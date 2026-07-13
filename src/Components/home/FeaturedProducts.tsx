'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';

interface FeaturedProductsProps {
  products: any[]; // Pass down fetched products from server components
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // Slice to strictly display max 8 products for the landing matrix layout
  const displayProducts = products?.slice(0, 8) || [];

  return (
    <section className="py-16 bg-white dark:bg-[#0F1322]/40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Title Engine */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-100 dark:border-gray-900 pb-5">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Featured Products
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Explore our highest rated premium quality apparel architectures.
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-500 hover:gap-2 transition-all"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Dynamic Items Matrix Grid */}
        {displayProducts.length === 0 ? (
          <p className="text-center text-xs text-gray-400 italic py-8">No featured inventory items available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.map((product, idx) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.05 }}
              >
                <ProductCard product={product} index={idx} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Mobile & View More Trigger */}
        <div className="text-center pt-4">
          <Link href="/shop" className="inline-block sm:hidden">
            <button className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl w-full">
              View All Products <ArrowRight size={14} />
            </button>
          </Link>

          <Link href="/shop" className="hidden sm:inline-block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              View More Products
            </motion.button>
          </Link>
        </div>

      </div>
    </section>
  );
}