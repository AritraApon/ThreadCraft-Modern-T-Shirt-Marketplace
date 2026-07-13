'use client';

import Link from 'next/link';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  index: number; // Staggered delay এর জন্য আমরা ইনডেক্স ব্যবহার করব
}

export default function ProductCard({ product, index }: ProductCardProps) {
  return (
    <motion.div
      // ১. পেজ বা ফিল্টার লোডের সময় স্মুথ এন্ট্রান্স অ্যানিমেশন
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05, // একটা একটা করে কার্ড স্মুথলি ভেসে উঠবে
        ease: "easeOut"
      }}
      // ২. হোভার করলে হালকা কার্ডটা উপরে উঠবে এবং গ্লো করবে
      whileHover={{ y: -6 }}
      className="group flex flex-col w-full h-[450px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-500/30 dark:hover:border-amber-500/20 transition-all duration-300"
    >

      {/* T-Shirt Image Section */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center p-4">
        <motion.img
          src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518"}
          alt={product.title}
          // ইমেজ হোভার এনিমেশন
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="max-h-full max-w-full object-contain"
        />

        {/* Category Tag */}
        {product.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gray-900/80 dark:bg-gray-800/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {product.category}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 space-y-3">

        {/* Meta Info Row */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'New Arrival'}</span>

          <div className="flex items-center gap-0.5 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.round(product.rating || 5) ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-gray-700"}
              />
            ))}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-amber-500 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {product.description || 'Premium quality comfortable cotton fabrics T-Shirt.'}
          </p>
        </div>

        {/* Sizes metadata */}
        {product.sizes && (
          <div className="flex flex-wrap gap-1 pt-1">
            {product.sizes?.map((size: string) => (
              <span key={size} className="px-1.5 py-0.5 text-[10px] font-mono border border-gray-200 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                {size}
              </span>
            ))}
          </div>
        )}

        {/* Price & Action Button Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-900 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">Price</span>
            <span className="text-lg font-black text-amber-500 dark:text-amber-400">৳{product.price}</span>
          </div>

          <Link
            href={`/product/${product._id || product.id}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white text-xs font-bold transition-all shadow-sm group-hover:scale-105"
          >
            <span>View Details</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </motion.div>
  );
}