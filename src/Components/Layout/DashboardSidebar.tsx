'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, User, Menu, X, Shirt, MenuSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../Theme/ThemeToggle';


export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু স্টেট

  const menuItems = [
    { name: 'Add Product', href: '/dashboard/add-product', icon: PlusCircle },
    { name: 'Manage Products', href: '/dashboard/manage-products', icon: MenuSquare },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 sm:p-6">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm">
            <Shirt size={18} />
          </div>
          <span className="text-lg font-black tracking-tight text-gray-950 dark:text-white">
            Thread<span className="text-amber-500">Craft.</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/10'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions (Theme Toggle & Back to Store) */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between px-2">
        <Link href="/" className="text-xs font-semibold text-amber-500 hover:underline">
          ← Back to Shop
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-[#161F30]/90 backdrop-blur-md text-gray-700 dark:text-gray-300 shadow-md focus:outline-none"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 bg-white dark:bg-[#161F30] border-r border-gray-100 dark:border-gray-800/60 transition-colors duration-300">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay Drawar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Dark Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black z-40"
            />
            {/* Sidebar Body */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#161F30] border-r border-gray-100 dark:border-gray-800 z-50 transition-colors duration-300"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}