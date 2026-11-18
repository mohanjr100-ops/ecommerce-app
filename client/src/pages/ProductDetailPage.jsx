import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { fallbackProducts } from '../data/fallbackProducts';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        // Fallback: check localStorage or fallbackProducts
        const stored = localStorage.getItem('catalog_products');
        const catalog = stored ? JSON.parse(stored) : fallbackProducts;
        const fallback = catalog.find((p) => p._id === id) || fallbackProducts.find((p) => p._id === id);
        if (fallback) {
          setProduct(fallback);
        } else {
          setError(err.response?.data?.message || 'Product not found');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, qty);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="mt-2 text-gray-500">{error || 'This product might have been removed.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const inCart = cartItems.find((item) => item.product === product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Breadcrumb / Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 sm:p-10">
        {/* Product Image */}
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-3">
              {product.category}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-4">
              <span className="text-3xl font-extrabold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isOutOfStock
                    ? 'bg-red-100 text-red-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isOutOfStock ? 'Out of Stock' : `${product.stock} Units In Stock`}
              </span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed text-base">
              {product.description}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
            {/* Quantity Picker & Add to Cart */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm bg-white">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-gray-800">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                {inCart && (
                  <span className="text-xs text-gray-500">
                    ({inCart.qty} already in cart)
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold shadow-lg transition duration-200 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    : addedNotice
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-98 shadow-indigo-200'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                  </>
                )}
              </button>

              <Link
                to="/cart"
                className="py-3.5 px-6 rounded-2xl font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 text-center transition"
              >
                Go to Cart
              </Link>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-xs text-gray-500 text-center">
              <div className="p-3 bg-gray-50 rounded-xl flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>Fast Shipping</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Quality Guaranteed</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-indigo-600" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
