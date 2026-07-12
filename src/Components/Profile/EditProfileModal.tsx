'use client';

import { useState, useEffect, FormEvent } from 'react';
import { authClient } from "@/lib/auth-client"; // তোমার প্রজেক্টের Better Auth ক্লায়েন্ট পাথ অনুযায়ী চেঞ্জ করতে পারো
import { toast } from 'react-toastify';
import { X, Loader2, Camera } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; image?: string | null } | null;
}

export default function EditProfileModal({ isOpen, onClose, currentUser }: EditProfileModalProps) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setImageUrl(currentUser.image || '');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Better Auth এর মেথড দিয়ে ইউজার আপডেট করা
      const { data, error } = await authClient.updateUser({
        name: name,
        image: imageUrl || null, // ইমেজ না থাকলে null পাস হবে
      });

      if (error) {
        toast.error(error.message || "Failed to update profile!");
      } else {
        toast.success("Profile synchronized successfully!");
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Something went wrong during synchronization.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Box */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#161F30] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-2xl transition-all duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-200">
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-6">Modify Profile Context</h3>

        <form onSubmit={handleProfileUpdate} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
          </div>

          {/* Image URL Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Profile Image URL</label>
            <div className="relative flex items-center">
              <input
                type="url" placeholder="https://example.com/avatar.jpg" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Provide a direct secure link to host your public avatar.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button" onClick={onClose} disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-60 shadow-md"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
              Commit Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}