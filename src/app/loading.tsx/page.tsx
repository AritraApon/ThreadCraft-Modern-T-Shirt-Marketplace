'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
      {/* Outer Blur Ring Container */}
      <div className="relative flex items-center justify-center">
        {/* Animated Main Spinner Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear"
          }}
          className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full"
        />

        {/* Inner Counter-Rotating Pulse Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear"
          }}
          className="absolute w-6 h-6 border-2 border-gray-300/10 border-b-gray-400 dark:border-gray-700/30 dark:border-b-gray-500 rounded-full"
        />
      </div>

      {/* Loading Status Text Grid */}
      <div className="text-center space-y-1">
        <motion.h3
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs font-bold uppercase tracking-widest text-gray-800 dark:text-gray-200"
        >
          Synchronizing Data
        </motion.h3>
        <p className="text-[10px] text-gray-400 dark:text-gray-500">
          Loading secure dashboard environment...
        </p>
      </div>
    </div>
  );
}