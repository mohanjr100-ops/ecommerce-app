import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-200">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to access your cart, track orders, or manage the store
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 transition"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-semibold text-center mb-3">
            QUICK ONE-CLICK DEMO LOGIN:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@example.com', 'admin123')}
              className="px-3 py-2 text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl border border-indigo-100 flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4" /> Fill Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('user@example.com', 'user123')}
              className="px-3 py-2 text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl border border-gray-200 flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-4 h-4" /> Fill Customer
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
