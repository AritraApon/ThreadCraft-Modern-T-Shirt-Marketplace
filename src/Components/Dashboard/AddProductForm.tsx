'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';
import { Loader2, Plus, X, Image as ImageIcon, Shirt } from 'lucide-react';
import { addProduct } from '@/lib/actions/product.action';

export default function AddProductForm() {
  const router = useRouter();
  const { data: session, isPending: isAuthPending } = authClient.useSession();

  // Form Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Form Field States
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [material, setMaterial] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Arrays
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]); // ImgBB থেকে আসা ফাইনাল URLs

  // Temporary input states for tags
  const [currentColor, setCurrentColor] = useState('');
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // ImgBB Multi-Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const apiKey = process.env.NEXT_PUBLIC_NEXT_BASE_IMGBB_API;
    if (!apiKey) {
      toast.error("ImgBB API key is missing!");
      return;
    }

    toast.info("Uploading image(s)...");

    // একাধিক ইমেজ একসাথে আপলোড করার জন্য loop
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('image', files[i]);

      try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          setImages((prev) => [...prev, result.data.url]);
          toast.success(`${files[i].name} uploaded successfully!`);
        } else {
          toast.error(`Failed to upload ${files[i].name}`);
        }
      } catch (error) {
        console.error("ImgBB Upload Error:", error);
        toast.error("Image upload failed due to a network error.");
      }
    }
  };

  // Remove Image from Preview Grid
  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Toggle Size Selection
  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // Add Color Tag
  const addColor = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentColor.trim()) {
      e.preventDefault();
      if (!colors.includes(currentColor.trim())) {
        setColors((prev) => [...prev, currentColor.trim()]);
      }
      setCurrentColor('');
    }
  };

  // Remove Color Tag
  const removeColor = (colorToRemove: string) => {
    setColors((prev) => prev.filter((c) => c !== colorToRemove));
  };

  // Form Submit Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error("You must be logged in to add products!");
      return;
    }

    if (images.length === 0) {
      toast.error("Please upload at least one product image!");
      return;
    }

    setIsLoading(true);

    // তোমার Product Interface অনুযায়ী ডাটা অবজেক্ট তৈরি
    const productData = {
      title,
      brand,
      category,
      price: Number(price),
      stock: Number(stock),
      sizes,
      colors,
      material,
      images,
      shortDescription,
      description,
      createdBy: session.user.id, // Better Auth থেকে সরাসরি আইডি নেওয়া হচ্ছে
    };

    const res = await addProduct(productData);

    setIsLoading(false);

    if (res.error) {
      toast.error(res.error || "Failed to create product!");
    } else {
      toast.success("Product added successfully!");
      router.push('/dashboard/manage-products'); // সফল হলে ম্যানেজ পেজে রিডাইরেক্ট
    }
  };

  if (isAuthPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800/80 shadow-xl rounded-2xl p-5 sm:p-8 transition-colors duration-300">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <Shirt size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New T-Shirt</h2>
          <p className="text-xs text-gray-400">List a premium quality thread in the marketplace</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Product Title *</label>
          <input
            type="text" required placeholder="Premium Oversized Vintage T-Shirt" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white"
          />
        </div>

        {/* Brand & Category (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Brand Name</label>
            <input
              type="text" placeholder="ThreadCraft Exclusive" value={brand} onChange={(e) => setBrand(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Category</label>
            <input
              type="text" placeholder="Oversized, Hoodie, Slim-Fit" value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Price, Stock & Material (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Price ($) *</label>
            <input
              type="number" required min="1" value={price || ''} onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Stock Quantity *</label>
            <input
              type="number" required min="0" value={stock || ''} onChange={(e) => setStock(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Material</label>
            <input
              type="text" placeholder="100% Organic Cotton" value={material} onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Size Selection (Badges) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Available Sizes</label>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => {
              const isSelected = sizes.includes(size);
              return (
                <button
                  type="button" key={size} onClick={() => toggleSize(size)}
                  className={`w-11 h-10 text-xs font-bold rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Tag Input */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Available Colors (Press Enter to add)</label>
          <input
            type="text" placeholder="e.g. Black, Vintage White" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} onKeyDown={addColor}
            className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white mb-2"
          />
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {colors.map((color) => (
                <span key={color} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                  {color}
                  <button type="button" onClick={() => removeColor(color)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Multi-Image Upload & Preview Grid */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Product Images * (Upload via ImgBB)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* Upload Box */}
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50/40 dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all">
              <ImageIcon size={20} className="text-gray-400 mb-1" />
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium text-center px-2">Add Images</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {/* ImgBB Live Preview Cards */}
            {images.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden group shadow-sm bg-gray-50 dark:bg-[#0B0F19]">
                <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button" onClick={() => removeImage(index)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-md bg-red-500/90 hover:bg-red-600 text-white shadow transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Short Description * (Max 150 chars)</label>
          <input
            type="text" required maxLength={150} placeholder="Brief one-line pitch for product card grid view..." value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white"
          />
        </div>

        {/* Full Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">Full Description *</label>
          <textarea
            required rows={4} placeholder="Provide detailed material info, fit guide, styling tips, etc..." value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 dark:focus:ring-amber-500/20 text-gray-900 dark:text-white resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit" disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm rounded-xl shadow-md disabled:opacity-60 transition-all pt-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Submitting Product...
            </>
          ) : (
            <>
              <Plus size={18} /> Publish Product
            </>
          )}
        </button>

      </form>
    </div>
  );
}