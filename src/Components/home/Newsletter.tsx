'use client';

import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-16 bg-white dark:bg-[#0B0F19] transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl bg-gradient-to-br from-gray-900 via-gray-950 to-amber-950 p-8 md:p-12 text-center overflow-hidden shadow-xl"
        >
          {/* Decorative Grid Overlays */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative z-10 space-y-4 max-w-xl mx-auto">
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
              Join The Club
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Get 15% Off Your Next Thread Drop
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscribe to unlock exclusive drops, VIP restock protocols, and members-only seasonal discount nodes.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 pt-4">
              <input
                type="email"
                placeholder="Enter your secure email address"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500 placeholder:text-gray-500 backdrop-blur-sm transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
              >
                <span>Subscribe</span>
                <Send size={14} />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}