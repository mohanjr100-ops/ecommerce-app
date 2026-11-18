import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { DollarSign, ShoppingBag, PackageCheck, Users, ArrowUpRight, TrendingUp } from 'lucide-react';
import { fallbackProducts } from '../../data/fallbackProducts';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
      } catch (err) {
        // Fallback for GitHub Pages static showcase
        const localOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
        const storedProducts = localStorage.getItem('catalog_products');
        const catalog = storedProducts ? JSON.parse(storedProducts) : fallbackProducts;
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');

        const totalRevenue = localOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

        setStats({
          totalRevenue: totalRevenue || 148884,
          totalOrders: localOrders.length || 3,
          totalProducts: catalog.length || 10,
          totalUsers: (registeredUsers.length || 0) + 2,
        });

        // Mock recent orders if none placed yet
        if (localOrders.length > 0) {
          setRecentOrders(localOrders.slice(0, 5));
        } else {
          setRecentOrders([
            {
              _id: '6afd50ed05375639446a3922',
              user: { name: 'Demo Customer', email: 'user@example.com' },
              totalPrice: 24990,
              status: 'Delivered',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              _id: '6afd983b10294821034f112a',
              user: { name: 'Rahul Sharma', email: 'rahul@example.com' },
              totalPrice: 114900,
              status: 'Shipped',
              createdAt: new Date(Date.now() - 36000000).toISOString(),
            },
            {
              _id: '6afd0018fbc71144a991820b',
              user: { name: 'Priya Patel', email: 'priya@example.com' },
              totalPrice: 8994,
              status: 'Pending',
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Admin Management
          </span>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            Store Performance & Metrics
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm transition"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Revenue
            </span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">
              ₹{stats?.totalRevenue?.toLocaleString('en-IN') || '0'}
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5 mt-2">
              <TrendingUp className="w-3.5 h-3.5" /> Gross sales
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">
              {stats?.totalOrders || 0}
            </span>
            <span className="text-xs text-indigo-600 font-semibold flex items-center gap-0.5 mt-2">
              All-time orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Products in Catalog */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Active Products
            </span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">
              {stats?.totalProducts || 0}
            </span>
            <span className="text-xs text-blue-600 font-semibold flex items-center gap-0.5 mt-2">
              In stock & active
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Customers
            </span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">
              {stats?.totalUsers || 0}
            </span>
            <span className="text-xs text-purple-600 font-semibold flex items-center gap-0.5 mt-2">
              Verified accounts
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
            <p className="text-xs text-gray-500">Live stream of store transactions</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-xs">
                    No orders have been recorded yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600 font-bold">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {order.user?.name || order.shippingAddress?.fullName || 'Customer'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.user?.email || 'Direct checkout'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : order.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
