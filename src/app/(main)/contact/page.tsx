'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Connect your custom form action or API handler here
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F19] pt-28 pb-16 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Contact Meta Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 space-y-4"
        >
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Get In Touch</span>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">Connect Node</h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Have queries regarding bulk structural orders, custom prints, or logistics tracking? Ping our support engine.
          </p>

          <div className="space-y-3 pt-4">
            {[
              { icon: Mail, label: "Secure Email", val: "support@threads.co" },
              { icon: Phone, label: "Hotline Terminal", val: "+880 1700-000000" },
              { icon: MapPin, label: "HQ Coordinates", val: "Dhaka, Bangladesh" }
            ].map((info, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-xl shadow-sm">
                <div className="text-amber-500"><info.icon size={16} /></div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{info.label}</p>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{info.val}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Interactive Contact Form Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 p-6 sm:p-8 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-2xl shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Aritro Mazumdar"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs focus:outline-none focus:border-amber-500 transition-colors dark:text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs focus:outline-none focus:border-amber-500 transition-colors dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Message Intercept</label>
              <textarea
                rows={5}
                required
                placeholder="Type your message parameter details here..."
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs focus:outline-none focus:border-amber-500 transition-colors resize-none dark:text-white"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors ml-auto"
            >
              <span>Transmit Message</span>
              <Send size={14} />
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  );
}