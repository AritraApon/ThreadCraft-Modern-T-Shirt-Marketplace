'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', '1');

    // ৪MD/404 ফিক্স: কারেন্ট ডাইনামিক পাথ ব্যবহার করা হচ্ছে
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">

        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search T-shirts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-xs focus:outline-none focus:border-amber-500 text-gray-900 dark:text-white"
          />
        </div>

        {/* Category (টি-শার্ট রিলেটেড ফিল্টার) */}
        <div className="md:col-span-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-2 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-xs focus:outline-none focus:border-amber-500 text-gray-900 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="T-Shirt">T-Shirt</option>
            <option value="Jersey">Jersey</option>
            <option value="Polo">Polo T-Shirt</option>
            <option value="Sweatshirt">Sweatshirt</option>
          </select>
        </div>

        {/* Sorting */}
        <div className="md:col-span-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-2 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-xs focus:outline-none focus:border-amber-500 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <button
          onClick={applyFilters}
          className="md:col-span-2 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <SlidersHorizontal size={14} /> Filter
        </button>

      </div>

      {/* Price Input Range */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
        <span className="text-gray-400 font-bold text-[10px] uppercase">Price Range:</span>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-gray-900 dark:text-white"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-20 px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-xs text-gray-900 dark:text-white"
        />
      </div>
    </div>
  );
}