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
      // Fallback for GitHub Pages static showcase
      const localOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
      if (localOrders.length > 0) {
        setOrders(localOrders);
      } else {
        const demoOrders = [
          {
            _id: '6afd50ed05375639446a3922',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: 'Delivered',
            totalPrice: 24990,
            paymentMethod: 'Cash on Delivery',
            shippingAddress: {
              fullName: 'Demo Customer',
              address: '221B Baker St',
              city: 'Mumbai',
              postalCode: '400001',
              phone: '+91 98765 43210',
            },
            orderItems: [
              {
                name: 'Sony WH-1000XM5 Wireless Headphones',
                qty: 1,
                price: 24990,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
              },
            ],
          },
          {
            _id: '6afd983b10294821034f112a',
            createdAt: new Date(Date.now() - 36000000).toISOString(),
            status: 'Shipped',
            totalPrice: 114900,
            paymentMethod: 'Cash on Delivery',
            shippingAddress: {
              fullName: 'Rahul Sharma',
              address: '45 Residency Rd',
              city: 'Bengaluru',
              postalCode: '560025',
              phone: '+91 99887 76655',
            },
            orderItems: [
              {
                name: 'Apple MacBook Air M3 (15-inch)',
                qty: 1,
                price: 114900,
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
              },
            ],
          },
        ];
        setOrders(demoOrders);
      }
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
      // Local fallback
      const localOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
      const updated = localOrders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o));
      localStorage.setItem('my_orders', JSON.stringify(updated));
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
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
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No customer orders yet</h3>
          <p className="text-sm text-gray-500">Orders placed by customers will be listed here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID & Date</th>
                  <th className="px-6 py-4">Customer Details</th>
                  <th className="px-6 py-4">Items Ordered</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Current Status</th>
                  <th className="px-6 py-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="font-bold text-gray-900">#{order._id.slice(-8)}</div>
                      <div className="text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {order.shippingAddress?.fullName || order.user?.name || 'Customer'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.shippingAddress?.city}, {order.shippingAddress?.phone}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.orderItems?.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-700">
                            {item.qty}× <span className="font-medium">{item.name}</span>
                          </div>
                        ))}
                      </div>
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

                    <td className="px-6 py-4 text-right">
                      <select
                        disabled={updatingId === order._id}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs font-bold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
