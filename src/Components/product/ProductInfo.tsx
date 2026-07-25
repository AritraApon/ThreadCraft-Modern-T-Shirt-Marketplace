'use client';

import { useState } from 'react';
import { Star, ShoppingBag, Heart, Minus, Plus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface InfoProps {
  product: any;
}

export default function ProductInfo({ product }: InfoProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const router = useRouter();
  const stockVal = Number(product.stock ?? 0);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product._id,
          title: product.title,
          image: product.images?.[0] || product.image || '',
          price: product.price,
          size: selectedSize,
          color: selectedColor,
          quantity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Added to cart! 🛒', { position: 'top-right', autoClose: 2000 });
        // Notify navbar to refresh cart count
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        toast.error(data.message || 'Failed to add to cart');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setBuyingNow(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: product._id,
          title: product.title,
          image: product.images?.[0] || product.image || '',
          price: product.price,
          size: selectedSize,
          color: selectedColor,
          quantity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('cart-updated'));
        router.push('/checkout');
      } else {
        toast.error(data.message || 'Failed to proceed');
        setBuyingNow(false);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
      setBuyingNow(false);
    }
  };

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
        {stockVal > 0 ? (
          <>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Quantity:</span>
              <div className="flex items-center border-2 border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                  <Minus size={14} />
                </button>
                <span className="px-4 text-sm font-bold text-gray-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(stockVal, q + 1))} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
                  <Plus size={14} />
                </button>
              </div>

              {/* Low stock alert */}
              {stockVal <= 5 && (
                <span className="text-xs font-bold text-red-500 animate-pulse">
                  Only {stockVal} left in stock!
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Cart */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={addingToCart || buyingNow}
                className="flex-1 py-3.5 rounded-xl bg-gray-900 dark:bg-gray-100 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white text-white dark:text-gray-900 text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                {addingToCart ? 'Adding...' : 'Add to Cart'}
              </motion.button>

              {/* Buy Now */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={addingToCart || buyingNow}
                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Zap size={18} />
                {buyingNow ? 'Processing...' : 'Buy Now'}
              </motion.button>

              {/* Wishlist */}
              <button className="p-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-800 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 transition-colors">
                <Heart size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-wider">Out of Stock</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Currently unavailable for purchase</span>
          </div>
        )}
      </div>
    </div>
  );
}