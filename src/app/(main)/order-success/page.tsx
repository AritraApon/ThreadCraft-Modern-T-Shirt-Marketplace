'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 150 }}
        className="w-full max-w-md text-center space-y-6"
      >
        {/* Success Icon with Pulse */}
        <div className="relative inline-flex items-center justify-center">
          <motion.div
            className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <CheckCircle size={52} className="text-green-500" />
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-500/30"
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">
            Payment Successful! 🎉
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Your order has been placed and payment confirmed. The seller will process it shortly.
          </p>
        </div>

        {/* Order ID */}
        {orderId && (
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-3 inline-block">
            <p className="text-xs text-gray-400 mb-1">Order Reference</p>
            <p className="text-sm font-mono font-bold text-gray-900 dark:text-white">
              #{orderId.slice(-10).toUpperCase()}
            </p>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-sm shadow-amber-500/20 transition-all"
          >
            <Package size={16} /> Track My Order <ArrowRight size={14} />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-bold rounded-xl transition-all"
          >
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
