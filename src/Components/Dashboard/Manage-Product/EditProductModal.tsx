'use client';

import { useState, FormEvent, useEffect } from 'react';
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

  // Form Fields State
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [material, setMaterial] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState('');

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setBrand(product.brand || '');
      setCategory(product.category || '');
      setPrice(product.price || 0);
      setStock(product.stock || 0);
      setMaterial(product.material || '');
      setShortDescription(product.shortDescription || '');
      setDescription(product.description || '');
      setSizes(product.sizes || []);
      setColors(product.colors || []);
      setImages(product.images || []);
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const productId = product._id || product.id;

  const toggleSize = (size: string) => {
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]);
  };

  const addColor = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentColor.trim()) {
      e.preventDefault();
      if (!colors.includes(currentColor.trim())) {
        setColors((prev) => [...prev, currentColor.trim()]);
      }
      setCurrentColor('');
    }
  };

  const removeColor = (colorToRemove: string) => {
    setColors((prev) => prev.filter((c) => c !== colorToRemove));
  };

const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!productId) {
      toast.error("Product ID is missing from client side state!");
      return;
    }

    setIsLoading(true);

    const updatedData = {
      title,
      brand,
      category,
      price: Number(price),
      stock: Number(stock),
      material,
      sizes,
      colors,
      images,
      shortDescription,
      description,
    };

    try {
      const res = await updateProduct(productId, updatedData);
      setIsLoading(false);

      console.log("--- EDIT RESPONSE START ---");
      console.log("Raw Server Action Response:", res);
      console.log("--- EDIT RESPONSE END ---");

      // 🎯 ব্যাকএন্ড সাকসেস কন্ডিশন সেফগার্ড (res.success অথবা এরর না থাকলে)
      if (res && (res.success === true || !res.error || res.status === 200)) {
        toast.success("Product updated successfully!");
        onSuccess(); // টেবিল রি-ফেচ করবে
        onClose();   // মোডাল ক্লোজ করবে
      } else {
        // যদি ব্যাকএন্ড কোনো স্পেসিফিক এরর মেসেজ পাঠায়
        const serverError = res?.error || res?.message || "Something went wrong on backend";
        toast.error(`Backend Error: ${serverError}`);
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error("Client Exception during update:", err);
      toast.error(`Client Code Crash: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-2xl transition-all">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"><X size={20} /></button>
        <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-6">Update Active Product</h3>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Product Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Category</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Price ($)</label>
              <input type="number" required value={price || ''} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Stock</label>
              <input type="number" required value={stock || ''} onChange={(e) => setStock(Number(e.target.value))} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Material</label>
              <input type="text" value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isSelected = sizes.includes(size);
                return (
                  <button type="button" key={size} onClick={() => toggleSize(size)} className={`w-10 h-9 text-xs font-bold rounded-lg border transition-all ${isSelected ? 'bg-amber-500 border-amber-500 text-white shadow-sm' : 'border-gray-200 dark:border-gray-700 text-gray-400'}`}>
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Colors (Enter)</label>
            <input type="text" placeholder="Add a color..." value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} onKeyDown={addColor} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none mb-2" />
            <div className="flex flex-wrap gap-1.5">
              {colors.map((color) => (
                <span key={color} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {color}
                  <button type="button" onClick={() => removeColor(color)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Short Description</label>
            <input type="text" required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Full Description</label>
            <textarea required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none resize-none" />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-60">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}