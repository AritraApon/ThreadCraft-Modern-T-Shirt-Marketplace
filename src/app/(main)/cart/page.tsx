'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Loader2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartItemComponent from '@/Components/cart/CartItem';
import { CartItem } from '@/types/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setItems(data.data?.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json();
    if (data.success) {
      setItems(data.data?.items || []);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  };

  const handleRemove = async (itemId: string) => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();
    if (data.success) {
      setItems(data.data?.items || []);
      window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 80 : 0;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-1 border-l-4 border-amber-500 pl-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <ShoppingCart size={28} className="text-amber-500" />
          Your Cart
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''} in your bag</p>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center space-y-6"
        >
          <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center">
            <ShoppingBag size={40} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your cart is empty</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Looks like you haven't added anything yet.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-sm shadow-amber-500/20 transition-all"
          >
            Browse Shop <ArrowRight size={16} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItemComponent
                  key={item._id as string}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemove}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl p-6 space-y-5 sticky top-24">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">৳{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className="font-semibold text-gray-900 dark:text-white">৳{shipping}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-black text-base">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-amber-500">৳{total.toFixed(0)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/checkout')}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20 transition-colors"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </motion.button>

              <Link href="/shop" className="block text-center text-xs text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
