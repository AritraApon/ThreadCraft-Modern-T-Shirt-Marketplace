'use client';

import { useState } from 'react';
import { Star, ShoppingBag, Heart, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfoProps {
  product: any;
}

export default function ProductInfo({ product }: InfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-6">
      {/* Badge & Title Engine */}
      <div className="space-y-2">
        {product.badge && (
          <span className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider">
            {product.badge}
          </span>
        )}
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {product.title}
        </h1>
      </div>

      {/* Review Metrics Row */}
      <div className="flex items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="flex items-center gap-1 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className={i < Math.round(product.rating || 5) ? "fill-amber-500" : "text-gray-300 dark:text-gray-700"} />
          ))}
          <span className="text-sm font-bold ml-1 text-gray-700 dark:text-gray-300">
            {product.rating || '5.0'}
          </span>
        </div>
        <span className="text-xs text-gray-400">|</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Category: <span className="font-semibold text-gray-700 dark:text-gray-300">{product.category}</span></span>
      </div>
      <div>
        <p>{product.shortDescription}</p>
      </div>

      {/* Price Block */}
      <div className="py-2">
        <span className="text-sm text-gray-400 font-medium block">Price Tag</span>
        <span className="text-3xl font-black text-amber-500 dark:text-amber-400">৳{product.price}</span>
      </div>

      {/* Dynamic Size Matrix Picker */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Size:</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-xs font-mono font-bold border-2 rounded-xl transition-all ${
                  selectedSize === size
                    ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Color Picker */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Select Color:</span>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color: string) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-3 py-1.5 text-xs rounded-xl border-2 font-medium capitalize transition-all ${
                  selectedColor === color
                    ? 'border-amber-500 bg-amber-500/5 text-amber-500'
                    : 'border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector & Action Trigger */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-900 space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Quantity:</span>
          <div className="flex items-center border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
              <Minus size={14} />
            </button>
            <span className="px-4 text-sm font-bold text-gray-900 dark:text-white">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3.5 rounded-xl bg-gray-900 dark:bg-gray-100 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white text-white dark:text-gray-900 text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <ShoppingBag size={18} />
            Add To Cart
          </motion.button>
          <button className="p-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 transition-colors">
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}