import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Shield,
  Home,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Top Header Bar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                ShopVibe
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-semibold transition ${
                  isActive('/') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                }`}
              >
                Catalog
              </Link>

              {user && (
                <Link
                  to="/orders"
                  className={`flex items-center gap-1.5 text-sm font-semibold transition ${
                    isActive('/orders') ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  My Orders
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-sm font-bold transition"
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-700 hover:text-indigo-600 transition rounded-full hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                    <div className="text-xs text-indigo-600 capitalize font-bold">
                      {user.role}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Header Right Icons */}
            <div className="flex items-center gap-2 md:hidden">
              <Link to="/cart" className="relative p-2 text-gray-700">
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user && (
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile App Bottom Tab Bar (Appears on Mobile screens just like Flipkart / Amazon App) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl py-2 px-6 flex justify-around items-center">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 ${
            isActive('/') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-bold">Store</span>
        </Link>

        <Link
          to="/cart"
          className={`relative flex flex-col items-center gap-1 ${
            isActive('/cart') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="text-[11px] font-bold">Cart</span>
        </Link>

        {user ? (
          <Link
            to="/orders"
            className={`flex flex-col items-center gap-1 ${
              isActive('/orders') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[11px] font-bold">Orders</span>
          </Link>
        ) : (
          <Link
            to="/login"
            className={`flex flex-col items-center gap-1 ${
              isActive('/login') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[11px] font-bold">Account</span>
          </Link>
        )}

        {isAdmin && (
          <Link
            to="/admin"
            className={`flex flex-col items-center gap-1 ${
              isActive('/admin') ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[11px] font-bold">Admin</span>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
