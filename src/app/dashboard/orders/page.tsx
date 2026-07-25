'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Loader2 } from 'lucide-react';
import OrdersTable from '@/Components/Dashboard/Manage-Orders/OrdersTable';
import SalesHistory from '@/Components/Dashboard/SalesHistory';
import { Order } from '@/types/order';

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'analytics'>('orders');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', { credentials: 'include', cache: 'no-store' });
      const data = await res.json();
      if (data.success) setOrders(data.data?.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1 border-l-4 border-amber-500 pl-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
          <ClipboardList size={22} className="text-amber-500" />
          Orders Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          All paid orders — update status to notify customers in real time.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-0">
        {(['orders', 'analytics'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px transition-all capitalize ${
              activeTab === tab
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'orders' ? 'Orders Table' : 'Sales Analytics'}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-amber-500" size={32} />
        </div>
      ) : activeTab === 'orders' ? (
        <OrdersTable />
      ) : (
        <SalesHistory orders={orders} />
      )}
    </div>
  );
}
