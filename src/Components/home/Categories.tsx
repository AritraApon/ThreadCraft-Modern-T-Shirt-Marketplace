'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shirt, Award, Layers } from 'lucide-react';

const CATEGORIES = [
  {
    name: 'T-Shirt',
    slug: 'T-Shirt',
    icon: Shirt,
    count: 'Premium Cotton',
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Polo',
    slug: 'Polo',
    icon: Layers,
    count: 'Structural Fit',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Jersey',
    slug: 'Jersey',
    icon: Award,
    count: 'Athletic Gear',
    color: 'from-emerald-500 to-teal-600',
  },
];

export default function Categories() {
  return (
    <section className="py-16 bg-[#F9FAFB] dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Shop By Category
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Select your preferred operational thread style to initialize custom marketplace filtering.
          </p>
        </div>

        {/* Categories Grid Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link href={`/shop?category=${cat.slug}`}>
                  <div className="relative group overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all">
                    {/* Background Decorative Ambient Glow */}
                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br ${cat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-500 transition-colors">
                        {cat.name}s
                      </h3>
                      <p className="text-xs text-gray-400 font-medium">
                        {cat.count}
                      </p>
                    </div>

                    <div className={`p-4 rounded-xl bg-gradient-to-br ${cat.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                      <IconComponent size={24} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}