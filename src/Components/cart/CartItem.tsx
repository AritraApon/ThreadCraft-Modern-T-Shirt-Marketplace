'use client';

import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [loading, setLoading] = useState(false);

  const handleQtyChange = async (newQty: number) => {
    if (newQty < 1) return;
    setLoading(true);
    await onQuantityChange(item._id as string, newQty);
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await onRemove(item._id as string);
    setLoading(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-start gap-4 p-4 bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 rounded-2xl"
    >
      {/* Product Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {item.image ? (
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{item.title}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-medium">
          {item.size && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md">
              Size: {item.size}
            </span>
          )}
          {item.color && (
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md capitalize">
              Color: {item.color}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => handleQtyChange(item.quantity - 1)}
              disabled={loading || item.quantity <= 1}
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 disabled:opacity-40"
            >
              <Minus size={12} />
            </button>
            <span className="px-3 py-1 text-xs font-bold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-700">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQtyChange(item.quantity + 1)}
              disabled={loading}
              className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 disabled:opacity-40"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Subtotal + Remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-amber-500">
              ৳{(item.price * item.quantity).toFixed(0)}
            </span>
            <button
              onClick={handleRemove}
              disabled={loading}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-40"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
