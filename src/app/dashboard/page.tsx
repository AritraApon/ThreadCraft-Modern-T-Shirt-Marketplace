export const dynamic = "force-dynamic";
import Link from 'next/link';

import { Package, Layers, Layers3, ArrowLeft, Eye, AlertTriangle } from 'lucide-react';
import { getDashboardStats } from '@/lib/actions/dashboard.action';
import DashboardCharts from '@/Components/Dashboard/DashboardCharts';


export default async function DashboardPage() {
  const res = await getDashboardStats();

  // ডাইনামিক ডেট ফরম্যাট
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  if (!res.success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950 rounded-2xl">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Dashboard Synchronizer Failed</h3>
        <p className="text-xs text-gray-400 mt-1">{res.message || "Could not map analytic nodes from MongoDB."}</p>
      </div>
    );
  }

  const { totalProducts, totalStock, totalCategories, productsByCategory, monthlyAdded } = res.data;

  // লো-স্টক ডিটেকশন প্রোটোকল (স্ট্যাটিক্যাল চেক বা এপিআই প্রসেস)
  const lowStockThreshold = 5;

  return (
    <div className="space-y-8 pb-12 bg-[#F9FAFB] dark:bg-[#070A12] min-h-screen pt-6 transition-colors duration-300">

      {/* Top Controller: Brand Node & Back To Home Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 dark:border-gray-900/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Seller Dashboard <span className="text-amber-500">Node</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium">Today is {formattedDate}</p>
        </div>

        {/* Terminals Navigation */}
        <Link href="/">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer">
            <ArrowLeft size={14} />
            Back to Home
          </span>
        </Link>
      </div>

      {/* ---------- Overview Cards Grid ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          style="text-amber-500 bg-amber-500/10"
        />
        <OverviewCard
          title="Total Stock"
          value={totalStock}
          icon={Layers3}
          style="text-emerald-500 bg-emerald-500/10"
        />
        <OverviewCard
          title="Categories Matrix"
          value={totalCategories}
          icon={Layers}
          style="text-blue-500 bg-blue-500/10"
        />
        <OverviewCard
          title="Total Views"
          value={0}
          icon={Eye}
          style="text-purple-500 bg-purple-500/10"
        />
      </div>

      {/* ---------- Recharts Client Segment ---------- */}
      <DashboardCharts
        productsByCategory={productsByCategory}
        monthlyAdded={monthlyAdded}
      />

    </div>
  );
}

// 🎴 প্রফেশনাল মিনিমালিস্ট কার্ড কম্পোনেন্ট
function OverviewCard({
  title,
  value,
  icon: Icon,
  style
}: {
  title: string;
  value: number;
  icon: any;
  style: string;
}) {
  return (
    <div className="p-5 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900/60 rounded-2xl shadow-sm flex items-center justify-between transition-all">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          {value.toLocaleString()}
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${style}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}