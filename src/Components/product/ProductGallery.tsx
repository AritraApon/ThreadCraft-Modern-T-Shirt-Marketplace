'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: GalleryProps) {
  // Safe check if images array is empty or undefined
  const productImages = images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518"];
  const [activeImage, setActiveImage] = useState(productImages[0]);

  return (
    <div className="space-y-4">
      {/* Main Preview Container */}
      <div className="relative w-full h-[400px] md:h-[500px] bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center p-6 border border-gray-100 dark:border-gray-800">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt="Product Preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="max-h-full max-w-full object-contain"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails Navigation Row */}
      {productImages.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {productImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative w-20 h-20 rounded-xl bg-gray-50 dark:bg-gray-900 p-2 overflow-hidden border-2 transition-all ${
                activeImage === img ? 'border-amber-500 scale-95 shadow-sm' : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}