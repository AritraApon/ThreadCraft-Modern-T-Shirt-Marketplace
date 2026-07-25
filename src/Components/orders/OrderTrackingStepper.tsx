'use client';

import { motion } from 'framer-motion';
import { Check, Clock, PackageCheck, Truck, Star } from 'lucide-react';
import { OrderStatus, StatusHistoryEntry } from '@/types/order';

const STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'Pending', label: 'Order Placed', icon: Clock },
  { status: 'Accepted', label: 'Accepted', icon: PackageCheck },
  { status: 'Processing', label: 'Processing', icon: PackageCheck },
  { status: 'Shipped', label: 'Shipped', icon: Truck },
  { status: 'Delivered', label: 'Delivered', icon: Star },
];

interface Props {
  currentStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
}

function getStepIndex(status: OrderStatus): number {
  if (status === 'Cancelled') return -1;
  return STEPS.findIndex((s) => s.status === status);
}

export default function OrderTrackingStepper({ currentStatus, statusHistory }: Props) {
  const currentIndex = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'Cancelled';

  const getTimestamp = (status: string) => {
    const entry = statusHistory?.find((h) => h.status === status);
    if (!entry) return null;
    return new Date(entry.updatedAt).toLocaleString('en-BD', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-xl">
        <span className="text-sm font-bold text-red-500">Order Cancelled</span>
        {getTimestamp('Cancelled') && (
          <span className="text-xs text-red-400">{getTimestamp('Cancelled')}</span>
        )}
      </div>
    );
  }

  return (
    <div className="relative py-2">
      <div className="flex items-start justify-between relative">
        {/* Background track line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-800 mx-[2.5%] hidden sm:block" />

        {/* Animated filled track */}
        {currentIndex > 0 && (
          <motion.div
            className="absolute top-4 left-0 h-0.5 bg-amber-500 hidden sm:block"
            style={{ marginLeft: '2.5%' }}
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIndex / (STEPS.length - 1)) * 95}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}

        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;
          const Icon = step.icon;
          const timestamp = getTimestamp(step.status);

          return (
            <div key={step.status} className="relative flex flex-col items-center flex-1 z-10">
              {/* Step Circle */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isCompleted
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : isActive
                      ? 'bg-white dark:bg-[#161F30] border-amber-500 text-amber-500'
                      : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    <Icon size={13} />
                  )}
                </motion.div>

                {/* Pulsing ring on active step */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-amber-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </div>

              {/* Label + Timestamp */}
              <div className="mt-2 text-center max-w-[80px]">
                <p className={`text-[10px] font-bold leading-tight ${
                  isCompleted ? 'text-amber-500' :
                  isActive ? 'text-gray-900 dark:text-white' :
                  'text-gray-400 dark:text-gray-600'
                }`}>
                  {step.label}
                </p>
                {timestamp && (
                  <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">
                    {timestamp}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
