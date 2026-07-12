// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


import { useRouter } from 'next/navigation';
import ThemeToggle from '../Theme/ThemeToggle';
import { authClient } from '@/lib/auth-client';


export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // প্রোফাইল ড্রপডাউন

  // Better Auth Hooks integration
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  // Better Auth-এ রোল সাধারণত user.role বা custom claims-এ থাকে। ধরি user.role-এই আছে।
  const isSeller = user?.role === 'seller';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    setIsDropdownOpen(false);
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800/60 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Thread<span className="text-amber-500">Craft.</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* যদি সেলার লগইন থাকে, তবে মেইন ন্যাভবার লিংকেও ড্যাশবোর্ড দেখাবে */}
            {!isPending && isSeller && (
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300 flex items-center gap-1"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {isPending ? (
              // Loading Skeleton State
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            ) : user ? (
              /* Logged In: User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all focus:outline-none"
                >
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold text-sm uppercase">
                      {user.name?.[0]}
                    </div>
                  )}
                  <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800 shadow-xl py-2 text-sm text-gray-700 dark:text-gray-200"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        {isSeller && (
                          <span className="mt-1 inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded">
                            Seller Portal
                          </span>
                        )}
                      </div>

                      <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <User size={16} className="text-gray-400" /> <span>My Profile</span>
                      </Link>

                      {/* Dropdown এর ভেতরের Dashboard */}
                      {isSeller && (
                        <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center space-x-2 px-4 py-2.5 hover:bg-amber-500/10 text-amber-500 transition-colors font-medium">
                          <LayoutDashboard size={16} /> <span>Seller Dashboard</span>
                        </Link>
                      )}

                      <hr className="border-gray-100 dark:border-gray-800 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2.5 text-left hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 transition-colors"
                      >
                        <LogOut size={16} /> <span>Log Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Logged Out: Login & Register Buttons */
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-500 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 dark:bg-amber-500 dark:hover:bg-amber-600 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserPlus size={16} />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:outline-none"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0B0F19]"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-amber-500"
                >
                  {link.name}
                </Link>
              ))}

              {!isPending && user ? (
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Account Section
                  </div>

                  {isSeller && (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-amber-500 hover:bg-amber-500/10">
                      <LayoutDashboard size={18} /> Dashboard
                    </Link>
                  )}

                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <User size={18} /> Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut size={18} /> Log Out
                  </button>
                </div>
              ) : (
                // Mobile Unauthenticated State
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-4 py-2.5 text-sm font-medium text-white bg-amber-500 rounded-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}