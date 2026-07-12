'use client';

import { useState } from 'react';
import { deleteProduct } from "@/lib/actions/product.action";
import { toast } from 'react-toastify';
import { Loader2, AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({ isOpen, onClose, product, onSuccess }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !product) return null;

  const productId = product._id || product.id;

  const handleDelete = async () => {
    if (!productId) {
      toast.error("Invalid Product ID reference on trigger!");
      return;
    }

    setIsDeleting(true);

    try {
      const res = await deleteProduct(productId);
      setIsDeleting(false);

      // 🔍 ব্রাউজার কনসোলে চেক করার জন্য প্রিন্ট
      console.log("--- DELETE RESPONSE START ---");
      console.log("Raw Server Action Response:", res);
      console.log("--- DELETE RESPONSE END ---");

      if (res && !res.error) {
        toast.success("Product successfully removed!");
        onSuccess();
        onClose();
      } else {
        const serverError = res?.error || res?.message || JSON.stringify(res);
        toast.error(`Backend Error: ${serverError}`);
      }
    } catch (err: any) {
      setIsDeleting(false);
      console.error("Client Exception during delete:", err);
      toast.error(`Client Code Crash: ${err.message}`);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-2xl transition-all">
        <div className="flex items-center gap-3 text-red-500 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-950 dark:text-white">Confirm Permanent Delete</h3>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to remove <span className="font-semibold text-gray-900 dark:text-gray-200">"{product.title}"</span>? This action cannot be reverted.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isDeleting} className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
          <button type="button" onClick={handleDelete} disabled={isDeleting} className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-md disabled:opacity-60">
            {isDeleting ? <Loader2 className="animate-spin" size={16} /> : "Purge Product"}
          </button>
        </div>
      </div>
    </div>
  );
}