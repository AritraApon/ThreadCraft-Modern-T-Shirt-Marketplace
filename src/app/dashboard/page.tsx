export const dynamic = "force-dynamic";

import Link from 'next/link';
import {
  Package,
  Layers,
  ArrowLeft,
  AlertTriangle,
  ClipboardList,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { getDashboardOverview } from '@/lib/actions/dashboard.action';
import DashboardCharts from '@/Components/Dashboard/DashboardCharts';

export default async function DashboardPage() {
  const res = await getDashboardOverview();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  if (!res || !res.success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950 rounded-2xl">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Dashboard Overview Failed</h3>
        <p className="text-xs text-gray-400 mt-1">{res?.message || "Could not retrieve analytical data from database."}</p>
      </div>
    );
  }

  const {
    totalOrders = 0,
    pendingOrders = 0,
    deliveredOrders = 0,
    totalRevenue = 0,
    totalProducts = 0,
    outOfStockProducts = 0,
    monthlyRevenue = []
  } = res.data || {};

  // Formatter for Recharts (monthly chart data)
  const monthlyChartData = (monthlyRevenue || []).map((m: any) => ({
    month: m.month,
    count: m.revenue || 0
  }));

  return (
    <div className="space-y-8 pb-12 bg-[#F9FAFB] dark:bg-[#070A12] min-h-screen pt-6 transition-colors duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 dark:border-gray-900/60 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Seller Dashboard <span className="text-amber-500">Overview</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium">{formattedDate}</p>
        </div>

        <Link href="/">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-900 text-gray-700 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-400 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer">
            <ArrowLeft size={14} />
            Back to Shop
          </span>
        </Link>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard
          title="Total Orders"
          value={totalOrders}
          icon={ClipboardList}
          style="text-amber-500 bg-amber-500/10"
        />
        <OverviewCard
          title="Pending Orders"
          value={pendingOrders}
          icon={Clock}
          style="text-yellow-500 bg-yellow-500/10"
        />
        <OverviewCard
          title="Total Revenue"
          value={`৳${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          style="text-emerald-500 bg-emerald-500/10"
        />
        <OverviewCard
          title="Delivered Orders"
          value={deliveredOrders}
          icon={CheckCircle2}
          style="text-blue-500 bg-blue-500/10"
        />
        <OverviewCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          style="text-purple-500 bg-purple-500/10"
        />
        <OverviewCard
          title="Out of Stock"
          value={outOfStockProducts}
          icon={AlertCircle}
          style="text-red-500 bg-red-500/10"
        />
      </div>

      {/* Analytics Chart Section */}
      <DashboardCharts
        productsByCategory={[]}
        monthlyAdded={monthlyChartData}
      />
    </div>
  );
}

function OverviewCard({
  title,
  value,
  icon: Icon,
  style
}: {
  title: string;
  value: string | number;
  icon: any;
  style: string;
}) {
  return (
    <div className="p-5 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900/60 rounded-2xl shadow-sm flex items-center justify-between transition-all">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${style}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}