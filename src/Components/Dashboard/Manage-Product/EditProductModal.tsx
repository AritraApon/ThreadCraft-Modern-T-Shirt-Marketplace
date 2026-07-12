'use client';

import { useState, FormEvent } from 'react';
import { updateProduct } from "@/lib/actions/product.action";
import { toast } from 'react-toastify';
import { X, Loader2, Save } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess: () => void;
}

export default function EditProductModal({ isOpen, onClose, product, onSuccess }: EditModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Default values পপুলেট করা হচ্ছে id ধরে
  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [category, setCategory] = useState(product?.category || '');
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || '');

  if (!isOpen) return null;

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedData = {
      title,
      price: Number(price),
      stock: Number(stock),
      category,
      shortDescription,
    };

    const res = await updateProduct(product._id, updatedData);
    setIsLoading(false);

    if (res?.error) {
      toast.error(res.error || "Update failed!");
    } else {
      toast.success("Product updated successfully!");
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-xl transition-colors duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-4">Edit Product Info</h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Product Title</label>
            <input
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-gray-950 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Price ($)</label>
              <input
                type="number" required value={price} onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-gray-950 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Stock</label>
              <input
                type="number" required value={stock} onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-gray-950 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Category</label>
            <input
              type="text" value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-gray-950 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1">Short Description</label>
            <textarea
              rows={3} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-gray-950 dark:text-white resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md disabled:opacity-60 transition-all"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              SaveChanges
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}