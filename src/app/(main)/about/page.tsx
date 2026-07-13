'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Ruler } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F19] pt-28 pb-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 space-y-16">

        {/* Header Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Our Architecture</span>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Engineering The Perfect Thread
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Threads & Co. isn't just an apparel marketplace. We treat clothing layout like structural design—combining precision metrics with premium comfort.
          </p>
        </motion.div>

        {/* Brand Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Ruler, title: "Structural Fit", desc: "Every sleeve angle and hemline calculation is strictly calibrated for maximum movement." },
            { icon: Cpu, title: "Tech Integration", desc: "Optimized logistics pipelines ensuring fast node-to-node delivery matrices across regions." },
            { icon: ShieldCheck, title: "Zero Defect Policy", desc: "100% combed cotton deployment guaranteeing long-term durability metrics." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-2xl shadow-sm text-center space-y-3"
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <item.icon size={20} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="p-8 bg-white dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-900 shadow-sm space-y-4"
        >
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">The Manifesto</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Founded with a vision to eliminate poor fits and fading prints, we treat every T-shirt drop as a structural project. From selecting raw organic fibers to managing high-density print node alignments, our process is entirely data-driven. We build garments that hold their shape, wash after wash.
          </p>
        </motion.div>

      </div>
    </div>
  );
}