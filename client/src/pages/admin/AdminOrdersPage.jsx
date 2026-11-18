import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Package, CheckCircle2, Clock, Truck } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, status: res.data.order.status } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review customer purchases and update delivery fulfillment status
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl">{error}</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No orders found</h3>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Purchased Items</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition">
                    {/* Order ID & Date */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gray-900 block">
                        #{order._id.slice(-8)}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">
                        {order.user?.name || order.shippingAddress.fullName}
                      </p>
                      <p className="text-xs text-gray-500">{order.user?.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {order.shippingAddress.city}, {order.shippingAddress.phone}
                      </p>
                    </td>

                    {/* Purchased Items */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-700">
                            <span className="font-semibold">{item.qty}×</span> {item.name}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-bold text-gray-900 text-base">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </td>

                    {/* Current Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status === 'Delivered' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {order.status === 'Shipped' && <Truck className="w-3.5 h-3.5" />}
                        {order.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        {order.status}
                      </span>
                    </td>

                    {/* Status Select Action */}
                    <td className="px-6 py-4 text-right">
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs font-bold px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
