import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = response.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      return { success: true, user: userData };
    } catch (err) {
      // If deliberate auth error from a reachable backend (400 or 401 with message)
      if (err.response && (err.response.status === 400 || err.response.status === 401) && err.response.data?.message) {
        const msg = err.response.data.message;
        setError(msg);
        return { success: false, message: msg };
      }

      // Standalone showcase fallback for GitHub Pages (no live backend)
      const savedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const matched = savedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

      const isAdminUser = email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@example.com';
      const role = isAdminUser ? 'admin' : (matched?.role || 'user');
      const name = matched?.name || (isAdminUser ? 'Admin User' : email.split('@')[0] || 'Customer');

      const userData = {
        _id: matched?._id || 'mock_usr_' + Date.now(),
        name,
        email,
        role,
      };
      const mockToken = 'mock_jwt_token_' + Date.now();

      setUser(userData);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', mockToken);
      return { success: true, user: userData };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userToken);
      return { success: true, user: userData };
    } catch (err) {
      // If deliberate error from reachable backend (e.g. email already exists)
      if (err.response && err.response.status === 400 && err.response.data?.message?.includes('already exists')) {
        const msg = err.response.data.message;
        setError(msg);
        return { success: false, message: msg };
      }

      // Standalone showcase fallback for GitHub Pages (no live backend)
      const savedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      
      const userData = {
        _id: 'mock_usr_' + Date.now(),
        name: name.trim() || 'New User',
        email: email.trim().toLowerCase(),
        role,
      };

      // Add to registered list if not present
      if (!savedUsers.some((u) => u.email === userData.email)) {
        savedUsers.push(userData);
        localStorage.setItem('registered_users', JSON.stringify(savedUsers));
      }

      const mockToken = 'mock_jwt_token_' + Date.now();
      setUser(userData);
      setToken(mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', mockToken);
      return { success: true, user: userData };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAdmin,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
