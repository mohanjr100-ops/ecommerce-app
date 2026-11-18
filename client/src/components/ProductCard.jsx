import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const inCart = cartItems.find((item) => item.product === product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&q=80';
          }}
        />
        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
        {/* Stock Badge */}
        <span
          className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${
            isOutOfStock
              ? 'bg-red-500 text-white'
              : product.stock < 10
              ? 'bg-amber-100 text-amber-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
        </span>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 text-base">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition shadow-sm ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : inCart
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-4 h-4" />
                Added ({inCart.qty})
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
