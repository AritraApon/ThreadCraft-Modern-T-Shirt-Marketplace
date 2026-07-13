'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';

// Premium high-quality T-shirt dummy images for the slider
const HERO_IMAGES = [
    "https://i.ibb.co.com/JW9wMbNP/image.png",
  "https://i.ibb.co.com/x8S1VNyN/image.png", // White Tee
  "https://i.ibb.co.com/zTkLq3D1/image.png", // Black Tee
  "https://i.ibb.co.com/7JH76tN2/image.png",
  "https://i.ibb.co.com/DHNswY5z/image.png" // Folded Premium Tees
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play engine for the right-side product slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // Changes image every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] flex items-center bg-[#F9FAFB] dark:bg-[#0B0F19] overflow-hidden pt-24 lg:pt-12 transition-colors duration-300">

      {/* Background Ambient Glows (Glassmorphic Touch) */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE: Typography & Call To Actions */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 text-center lg:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wider uppercase">
            <ShoppingBag size={14} />
            New Season Drop
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-[1.1]">
            Crafting Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
              Ultimate Threads
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Discover premium quality cotton T-shirts, structural polos, and matching jerseys engineered for absolute comfort and modern aesthetic vibes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold text-sm rounded-xl shadow-lg shadow-gray-900/10 dark:shadow-none hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-white dark:hover:text-white transition-all"
              >
                Explore Collection
                <ArrowRight size={16} />
              </motion.button>
            </Link>

            <Link href="/shop?category=T-shirt">
              <motion.button
                whileHover={{ y: -2 }}
                className="px-6 py-3.5 border-2 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                View Best Sellers
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Animated Image Slider Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="relative w-full h-[380px] sm:h-[450px] flex items-center justify-center"
        >
          {/* Decorative Framing Container */}
          <div className="absolute inset-0 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl pointer-events-none transform rotate-3 scale-95" />

          <div className="relative w-[85%] h-[90%] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center p-6">

            {/* Smooth Slide Transition Wrapper */}
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={HERO_IMAGES[currentSlide]}
                alt="Premium T-Shirt Display"
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.95, rotate: 5 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="max-h-full max-w-full object-contain drop-shadow-md"
              />
            </AnimatePresence>

            {/* Slider Navigation Dots Indicator */}
            <div className="absolute bottom-4 flex gap-2">
              {HERO_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-6 bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}