'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Order } from '@/types/order';

interface SalesHistoryProps {
  orders: Order[];
}

const COLOR_PALETTE = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#EF4444'];

export default function SalesHistory({ orders }: SalesHistoryProps) {
  // Revenue by month
  const revenueByMonth = orders.reduce<Record<string, number>>((acc, order) => {
    const month = new Date(order.createdAt || '').toLocaleString('en-US', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + order.totalAmount;
    return acc;
  }, {});

  const revenueChartData = Object.entries(revenueByMonth)
    .map(([month, revenue]) => ({ name: month, revenue }))
    .slice(-6); // last 6 months

  // Orders by status
  const statusCounts = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = Object.entries(statusCounts).map(([status, count], idx) => ({
    name: status,
    value: count,
    color: COLOR_PALETTE[idx % COLOR_PALETTE.length],
  }));

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Revenue Total Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white shadow-lg shadow-amber-500/20"
      >
        <div className="flex items-center gap-2 mb-1">
          <DollarSign size={18} />
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Total Revenue (Paid Orders)</span>
        </div>
        <p className="text-3xl font-black">৳{totalRevenue.toFixed(0)}</p>
        <p className="text-xs opacity-70 mt-1">{orders.length} paid orders</p>
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue by Month Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 p-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900/60 rounded-2xl shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-amber-500" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Revenue by Month</h3>
          </div>

          <div className="w-full h-[240px] text-xs">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-900" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9CA3AF" />
                  <YAxis axisLine={false} tickLine={false} stroke="#9CA3AF" tickFormatter={(v) => `৳${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0B0F19', borderRadius: '12px', border: 'none', color: '#fff' }}
                    formatter={(v: any) => [`৳${v ?? 0}`, 'Revenue']}
                    cursor={{ fill: 'rgba(245, 158, 11, 0.03)' }}
                  />
                  <Bar dataKey="revenue" fill="#F59E0B" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No revenue data yet.</div>
            )}
          </div>
        </motion.div>

        {/* Orders by Status Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900/60 rounded-2xl shadow-sm space-y-4"
        >
          <div className="flex items-center gap-2">
            <BarChart2 size={16} className="text-amber-500" />
            <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Orders by Status</h3>
          </div>

          <div className="w-full h-[180px] flex items-center justify-center text-xs">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderRadius: '12px', border: 'none', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No data.</div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold text-gray-500">
            {statusChartData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-700 dark:text-gray-300">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
