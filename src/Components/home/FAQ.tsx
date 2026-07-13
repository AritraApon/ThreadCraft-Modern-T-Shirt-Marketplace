'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: "How is the fabric quality of the t-shirts?",
    a: "We use 100% Combed Cotton and premium Pima Cotton. Our regular collection is made of 180-200 GSM fabric, and the oversized collection features 240 GSM heavyweight fabric."
  },
  {
    q: "How do I select the size chart? Can I exchange it if the size is wrong?",
    a: "A detailed size chart is provided with every product. You can exchange any unwashed product with its tags intact completely free of charge within 7 days of delivery."
  },
  {
    q: "Is there a chance that the t-shirt print will fade or crack?",
    a: "No, we use highly precise and advanced High-Density Screen Print and DTF technology. If you follow the proper wash care instructions (washing and ironing inside out), the print will remain like new for years."
  }
];
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 bg-[#F9FAFB] dark:bg-[#0B0F19]">
      <div className="max-w-3xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Got Questions?</h2>
          <p className="text-xs text-gray-500 mt-2">Everything you need to know about our thread setups and logistics protocols.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 flex justify-between items-center text-left text-xs sm:text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-gray-400" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="p-5 pt-0 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-50 dark:border-gray-900/50">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}