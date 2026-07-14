'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';
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
  Cell
} from 'recharts';

interface ChartsProps {
  productsByCategory: { category: string; count: number }[];
  monthlyAdded: { month: string; count: number }[];
}

// চার্টের জন্য মডার্ন মিনিমাল কালার প্যালেট matrix
const COLOR_PALETTE = ['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'];

export default function DashboardCharts({ productsByCategory, monthlyAdded }: ChartsProps) {

  // মঙ্গোডিবি ডেটা Recharts এর কী-ভ্যালু অনুযায়ী অ্যাডজাস্টমেন্ট
  const barChartData = monthlyAdded.map(item => ({
    name: item.month,
    count: item.count
  }));

  const pieChartData = productsByCategory.map((item, index) => ({
    name: item.category,
    value: item.count,
    color: COLOR_PALETTE[index % COLOR_PALETTE.length]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* 📊 Bar Chart: Monthly Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 p-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900/60 rounded-2xl shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-amber-500" />
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Products Added by Month</h3>
        </div>

        <div className="w-full h-[260px] text-xs">
          {barChartData.length > 0 ? (
            <ResponsiveContainer width="100%" h="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-gray-900" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#9CA3AF" />
                <YAxis axisLine={false} tickLine={false} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderRadius: '12px', border: 'none', color: '#fff' }}
                  cursor={{ fill: 'rgba(245, 158, 11, 0.03)' }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No batch updates found.</div>
          )}
        </div>
      </motion.div>

      {/* 🍕 Pie Chart: Category Matrix */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900/60 rounded-2xl shadow-sm space-y-4"
      >
        <div className="flex items-center gap-2">
          <PieIcon size={16} className="text-amber-500" />
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Products by Category</h3>
        </div>

        <div className="w-full h-[220px] flex items-center justify-center text-xs">
          {pieChartData.length > 0 ? (
            <ResponsiveContainer width="100%" h="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0B0F19', borderRadius: '12px', border: 'none', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">Empty structure.</div>
          )}
        </div>

        {/* Dynamic Multi-Category Labels */}
        <div className="flex flex-wrap justify-center gap-3 text-[10px] font-bold text-gray-500">
          {pieChartData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-gray-700 dark:text-gray-300 capitalize">{item.name} ({item.value})</span>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}