import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Package, Clock, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await api.get('/orders/my');
        setOrders(res.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const getStepProgress = (status) => {
    if (status === 'Delivered') return 3;
    if (status === 'Shipped') return 2;
    return 1; // Pending
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track your shipments and view order history
          </p>
        </div>
        <Link
          to="/"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <ShoppingBag className="w-4 h-4" /> Shop More
        </Link>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">No orders placed yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            When you purchase items from our catalog, they will appear here.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow hover:bg-indigo-700 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const step = getStepProgress(order.status);

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm"
              >
                {/* Header */}
                <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-mono">
                      Order ID: #{order._id}
                    </span>
                    <div className="text-sm font-semibold text-gray-700">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-xl font-extrabold text-gray-900">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                <div className="px-6 py-6 border-b border-gray-100 bg-white">
                  <div className="max-w-md mx-auto">
                    <div className="relative flex items-center justify-between">
                      {/* Connecting line */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0">
                        <div
                          className="h-full bg-indigo-600 transition-all duration-500"
                          style={{
                            width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                          }}
                        ></div>
                      </div>

                      {/* Step 1: Pending */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 1
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 mt-2">
                          Pending
                        </span>
                      </div>

                      {/* Step 2: Shipped */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 2
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 mt-2">
                          Shipped
                        </span>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                            step >= 3
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 mt-2">
                          Delivered
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 divide-y divide-gray-100">
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-xl bg-gray-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{(item.qty * item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
                  <div>
                    <span className="font-semibold text-gray-700">Delivery Address: </span>
                    {order.shippingAddress.fullName}, {order.shippingAddress.address},{' '}
                    {order.shippingAddress.city} {order.shippingAddress.postalCode} (Tel:{' '}
                    {order.shippingAddress.phone})
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Payment: </span>
                    {order.paymentMethod}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
