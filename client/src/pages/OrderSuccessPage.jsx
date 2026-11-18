import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center w-full">
      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
        Order Confirmed
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-4">
        Thank You For Your Purchase!
      </h1>

      <p className="mt-3 text-gray-600 max-w-lg mx-auto">
        Your order has been recorded in our system, stock has been reserved, and our fulfillment team is preparing your package.
      </p>

      {orderId && (
        <div className="mt-6 inline-block bg-gray-50 border border-gray-200 px-5 py-2.5 rounded-xl text-sm text-gray-700">
          Order Reference ID: <span className="font-mono font-bold text-indigo-600">{orderId}</span>
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/orders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          <Package className="w-4 h-4" /> View My Orders
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition"
        >
          <Home className="w-4 h-4" /> Back to Store
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
