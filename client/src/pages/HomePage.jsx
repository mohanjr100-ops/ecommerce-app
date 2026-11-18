import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { fallbackProducts } from '../data/fallbackProducts';

const HomePage = () => {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(['All', 'Audio', 'Computers', 'Accessories', 'Displays', 'Wearables', 'Cameras', 'Electronics']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.data.categories && res.data.categories.length > 1) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        // Keep fallback categories
      }
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: 8,
        };
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }

        const res = await api.get('/products', { params });
        if (res.data.products && res.data.products.length > 0) {
          setProducts(res.data.products);
          setTotalPages(res.data.pages || 1);
        } else if (searchQuery.trim() || (selectedCategory && selectedCategory !== 'All')) {
          setProducts([]);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        // Fallback for GitHub Pages static showcase mode
        let filtered = fallbackProducts;
        if (selectedCategory && selectedCategory !== 'All') {
          filtered = filtered.filter((p) => p.category === selectedCategory);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(
            (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
          );
        }
        setProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / 8) || 1);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, currentPage]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            Discover Premium Gear
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Elevate Your Everyday Essentials.
          </h1>
          <p className="mt-4 text-indigo-200 text-base sm:text-lg">
            Shop the latest in audio, laptops, custom mechanical keyboards, and precision accessories in Indian Rupees (₹).
          </p>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition shadow-sm ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-indigo-200'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse h-80 flex flex-col justify-between"
            >
              <div className="bg-gray-200 rounded-xl h-44 w-full"></div>
              <div className="space-y-2 mt-4">
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-3 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <SlidersHorizontal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No products found</h3>
          <p className="text-gray-500 text-sm mt-1">
            Try adjusting your search query or choosing another category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
