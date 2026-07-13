'use client';

import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import ProductCard from '../product/ProductCard';

function SmoothCounter({ value }: { value: number }) {
  const spring = useSpring(0, { duration: 2, bounce: 0 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

interface NewArrivalsProps {
  products: any[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  // Filters or slices the latest 4 products (e.g., T-shirts)
  const newTShirts = products?.filter(p => p.category?.toLowerCase() === 't-shirt').slice(0, 4) || [];

  return (
    <section className="py-16 bg-[#F9FAFB] dark:bg-[#0B0F19] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* New Arrivals Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Fresh Drops</span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">New Arrivals</h2>
            <p className="text-xs text-gray-500 mt-2">Upgrade your daily rotation with our latest structural fits and heavy-weight luxury drops.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newTShirts.map((product, idx) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <ProductCard product={product} index={idx} />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}