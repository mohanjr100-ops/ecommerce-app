import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">ShopVibe</span>
            <span className="text-gray-400 text-sm">| E-Commerce Platform</span>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Built with React, Node.js, Express & MongoDB
          </p>
          <div className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} ShopVibe, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
