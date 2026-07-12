'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';
import { UserSessionData } from '@/types/user';
import { X, Loader2, UploadCloud, User as UserIcon } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSessionData | null;
}

export default function EditProfileModal({ isOpen, onClose, currentUser }: EditProfileModalProps) {
  const [name, setName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setImageUrl(currentUser.image || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_NEXT_BASE_IMGBB_API;
    if (!apiKey) {
      toast.error("ImgBB API key is missing in your .env.local!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const resData = await res.json();

      if (resData.success && resData.data?.url) {
        setImageUrl(resData.data.url);
        toast.success("Image uploaded successfully via ImgBB!");
      } else {
        toast.error("ImgBB upload service failed.");
      }
    } catch (err) {
      toast.error("Network error during ImgBB upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Identity Name fields cannot be empty!");

    setIsSubmitting(true);
    try {
      const { error } = await authClient.updateUser({
        name,
        image: imageUrl || null,
      });

      if (error) {
        toast.error(error.message || "Failed to sync updates.");
      } else {
        toast.success("Identity synchronized successfully!");
        onClose();
      }
    } catch (err) {
      toast.error("An operational error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Main Modal Container - Light/Dark safe colors */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xl transition-all z-10">

        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <X size={20} />
        </button>

        <h3 className="text-xl font-black mb-6 text-gray-900 dark:text-white">
          Update Profile Information
        </h3>

        <form onSubmit={handleProfileUpdate} className="space-y-6">

          {/* ImgBB Image File Input Handler */}
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-5 rounded-xl space-y-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-amber-500 bg-gray-100 dark:bg-gray-800">
              <img
                src={imageUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <Loader2 className="animate-spin text-amber-400" size={20} />
                </div>
              )}
            </div>

            {/* Pure Accessible Native Label & Hidden Input File Trigger */}
            <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 transition-colors shadow-sm">
              <UploadCloud size={16} className="text-amber-500" />
              {isUploading ? "Uploading to Cloud..." : "Choose New Photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Full Name Input field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
              <UserIcon size={13} className="text-amber-500" /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-gray-900 dark:text-white"
            />
          </div>

          {/* Action Footer Drawer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider border border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 font-medium shadow-md"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={14} />} Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}