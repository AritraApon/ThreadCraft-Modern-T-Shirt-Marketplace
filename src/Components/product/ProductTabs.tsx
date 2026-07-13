'use client';

import { useState } from 'react';
import { MessageSquare, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TabsProps {
  description: string;
}

export default function ProductTabs({ description }: TabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Tabs Switcher Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'overview' ? 'border-amber-500 text-amber-500 bg-white dark:bg-gray-950' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <FileText size={14} /> Description
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'reviews' ? 'border-amber-500 text-amber-500 bg-white dark:bg-gray-950' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <MessageSquare size={14} /> Reviews & Comments
        </button>
      </div>

      {/* Dynamic Tab Body Render Panel */}
      <div className="p-6 min-h-[150px]">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              {description || 'No specialized breakdown provided for this inventory node.'}
            </motion.div>
          ) : (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="space-y-4"
            >
              <p className="text-xs text-gray-400 italic">Review collection hooks will integrate here post-database schema setup.</p>

              {/* Fake Dummy Placeholder Review Card */}
              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">Mashrafi Mortaza</span>
                  <span className="text-[10px] text-gray-400">Just now</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">The fabric configuration is absolutely phenomenal. High grade stitching!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}