import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900">Your Cart is Empty</h2>
        <p className="mt-2 text-gray-500 max-w-md mx-auto">
          Looks like you haven't added anything to your cart yet. Explore our catalog and discover amazing tech gear.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3.5 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
        >
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80';
                  }}
                />
                <div>
                  <Link
                    to={`/product/${item.product}`}
                    className="font-bold text-gray-900 hover:text-indigo-600 transition line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <span className="text-xs text-gray-400 block mt-0.5">
                    Category: {item.category}
                  </span>
                  <span className="text-sm font-bold text-gray-800 block mt-1">
                    ${item.price.toFixed(2)} each
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Delete */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.product, item.qty - 1)}
                    className="p-2 text-gray-600 hover:bg-gray-100 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-bold text-gray-900 text-sm">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product, item.qty + 1)}
                    disabled={item.qty >= item.stock}
                    className="p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right min-w-[5rem]">
                  <span className="text-lg font-extrabold text-gray-900 block">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.product)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm sticky top-24 space-y-5">
            <h2 className="text-xl font-extrabold text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax</span>
                <span className="font-semibold text-gray-900">$0.00</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-indigo-600">
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-98 transition"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/"
              className="block text-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
