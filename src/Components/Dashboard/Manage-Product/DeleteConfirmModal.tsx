'use client';

import { useState } from 'react';
import { deleteProduct } from "@/lib/actions/product.action";
import { toast } from 'react-toastify';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({ isOpen, onClose, productId, productTitle, onSuccess }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteProduct(productId);
    setIsDeleting(false);

    if (res?.error) {
      toast.error(res.error || "Failed to delete product!");
    } else {
      toast.success("Product deleted successfully!");
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-xl transition-colors duration-300">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-950 dark:text-white">Delete Product?</h3>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to permanently delete <span className="font-semibold text-gray-800 dark:text-gray-200">"{productTitle}"</span>? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button" onClick={onClose} disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Cancel
          </button>
          <button
            type="button" onClick={handleDelete} disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-sm transition-all disabled:opacity-60"
          >
            {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}