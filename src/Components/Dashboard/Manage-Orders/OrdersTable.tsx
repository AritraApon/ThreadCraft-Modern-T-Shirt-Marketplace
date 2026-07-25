'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, RefreshCw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Order, OrderStatus } from '@/types/order';

const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Accepted', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const STATUS_COLORS: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400',
  Accepted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
  Delivered: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
};

export default function OrdersTable() {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setAllOrders(data.data?.orders || []);
      } else {
        setAllOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return allOrders;
    const q = searchQuery.toLowerCase();
    return allOrders.filter(
      (o) =>
        (o._id as string).toLowerCase().includes(q) ||
        o.shippingInfo.fullName.toLowerCase().includes(q) ||
        o.orderStatus.toLowerCase().includes(q)
    );
  }, [allOrders, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [searchQuery, totalPages, page]);

  const displayedOrders = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, page]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Optimistic update
        setAllOrders((prev) =>
          prev.map((o) =>
            (o._id as string) === orderId ? { ...o, orderStatus: newStatus } : o
          )
        );
        toast.success(`Status updated to ${newStatus}`, { autoClose: 2000 });
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Summary stats
  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrderCount = allOrders.length;

  return (
    <div className="w-full space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: totalOrderCount, color: 'text-amber-500' },
          { label: 'Revenue', value: `৳${totalRevenue.toFixed(0)}`, color: 'text-green-500' },
          { label: 'Delivered', value: allOrders.filter(o => o.orderStatus === 'Delivered').length, color: 'text-blue-500' },
          { label: 'Pending', value: allOrders.filter(o => o.orderStatus === 'Pending').length, color: 'text-yellow-500' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-xl p-4 space-y-1"
          >
            <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex bg-white dark:bg-[#161F30] p-4 rounded-xl border border-gray-100 dark:border-gray-800/80 items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs focus:outline-none text-gray-950 dark:text-white"
          />
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-amber-500 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-amber-500/50 transition-all disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Orders Table */}
      <div className="w-full bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-[#0B0F19]/30 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-xs text-gray-700 dark:text-gray-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp size={16} className="animate-pulse text-amber-500" />
                      Loading orders...
                    </div>
                  </td>
                </tr>
              ) : displayedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center p-10 text-gray-400">
                    No paid orders found yet.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((order) => (
                  <AnimatePresence key={order._id as string}>
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/40 dark:hover:bg-gray-800/10 transition-colors"
                    >
                      <td className="p-4 font-mono font-semibold text-gray-900 dark:text-white">
                        #{(order._id as string).slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{order.shippingInfo.fullName}</p>
                        <p className="text-[10px] text-gray-400">{order.shippingInfo.phone}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {order.orderItems.reduce((s, i) => s + i.quantity, 0)} pcs
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-amber-500">৳{order.totalAmount}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${PAYMENT_COLORS[order.paymentInfo.status] || ''}`}>
                          {order.paymentInfo.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${STATUS_COLORS[order.orderStatus] || ''}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(order.createdAt || '').toLocaleDateString('en-BD', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={order.orderStatus}
                          disabled={updatingId === (order._id as string)}
                          onChange={(e) => handleStatusUpdate(order._id as string, e.target.value as OrderStatus)}
                          className="text-[10px] font-semibold border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-amber-500 disabled:opacity-50 cursor-pointer"
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </motion.tr>
                  </AnimatePresence>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between text-xs">
            <span className="text-gray-400">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-500 dark:text-gray-400"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 text-gray-500 dark:text-gray-400"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
