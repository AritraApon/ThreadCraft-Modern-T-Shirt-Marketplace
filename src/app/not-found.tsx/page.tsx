'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function DashboardNotFound() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-[65vh] flex flex-col items-center justify-center text-center px-4 max-w-md mx-auto space-y-6"
    >
      {/* Warning Hexagon/Icon Frame */}
      <div className="p-4 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
        <AlertCircle size={32} />
      </div>

      {/* Main Error Headers */}
      <div className="space-y-2">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          Resource Matrix Not Found
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          The dashboard node, metrics collection, or parameter link you are trying to intercept does not exist or has been relocated.
        </p>
      </div>

      {/* Interactive Action Links */}
      <div className="pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft size={14} />
          Return to Console Main
        </Link>
      </div>
    </motion.div>
  );
}