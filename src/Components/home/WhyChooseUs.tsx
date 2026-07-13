'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Package } from 'lucide-react';

const FEATURES = [
  { title: "Premium Fabrics", desc: "Hand-picked organic cotton blends for maximum comfort.", icon: ShieldCheck },
  { title: "Fast Logistics", desc: "Nationwide express delivery to your doorstep within 48h.", icon: Zap },
  { title: "Quality Guarantee", desc: "Rigorous stitching standards for long-term durability.", icon: Package },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-white dark:bg-[#0B0F19]">
      <div className="max-w-5xl mx-auto px-4 relative">
        <h2 className="text-3xl font-black text-center mb-16 dark:text-white">Why Choose Us?</h2>

        {/* Center Connecting Line */}
        <div className="absolute left-1/2 top-32 bottom-20 w-px bg-gray-200 dark:bg-gray-800 hidden md:block" />

        <div className="space-y-12">
          {FEATURES.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="flex-1 text-right md:text-left space-y-2">
                <h3 className="font-bold dark:text-white">{feat.title}</h3>
                <p className="text-xs text-gray-500">{feat.desc}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg z-10">
                <feat.icon size={20} />
              </div>
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}