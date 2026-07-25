'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Loader2, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '@/types/order';
import OrderTrackingStepper from '@/Components/orders/OrderTrackingStepper';
import Image from 'next/image';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  Accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl overflow-hidden"
    >
      {/* Order Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors"
      >
        <div className="flex items-start gap-4 text-left min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-amber-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Order ID</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white font-mono truncate max-w-[160px] sm:max-w-none">
              #{(order._id as string).slice(-8).toUpperCase()}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {new Date(order.createdAt || '').toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">Total</p>
            <p className="text-base font-black text-amber-500">৳{order.totalAmount}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[order.orderStatus] || ''}`}>
            {order.orderStatus}
          </span>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-6">
              {/* Tracking Stepper */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Order Status</p>
                <OrderTrackingStepper
                  currentStatus={order.orderStatus}
                  statusHistory={order.statusHistory}
                />
              </div>

              {/* Order Items */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Items</p>
                <div className="space-y-2.5">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                        {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-gray-400">
                          {item.size && `Size: ${item.size}`}{item.size && item.color && ' · '}{item.color && `Color: ${item.color}`} · Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">৳{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 text-xs space-y-1">
                <p className="font-bold text-gray-900 dark:text-white text-[11px] uppercase tracking-wider mb-2">Delivery To</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingInfo.fullName}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingInfo.phone}</p>
                <p className="text-gray-600 dark:text-gray-400">{order.shippingInfo.address}, {order.shippingInfo.city} {order.shippingInfo.postalCode}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders/my', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (data.success) setOrders(data.data?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 15s for live status updates
    const interval = setInterval(fetchOrders, 15000);
    // Also refresh on page focus
    const onFocus = () => fetchOrders();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-1 border-l-4 border-amber-500 pl-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
          <ShoppingBag size={28} className="text-amber-500" />
          Your Orders
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          <span className="ml-2 text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Live updates every 15s</span>
        </p>
      </div>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 text-center space-y-5"
        >
          <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center">
            <Package size={40} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">No orders yet</h2>
            <p className="text-sm text-gray-500 mt-1">Your orders will appear here after checkout.</p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-sm shadow-amber-500/20 transition-all">
            Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id as string} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
