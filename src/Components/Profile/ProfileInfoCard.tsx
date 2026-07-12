'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';
// import EditProfileModal from './EditProfileModal';
import { Edit3, LogOut, ShieldCheck, Mail } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface InfoCardProps {
  user: any;
}

export default function ProfileInfoCard({ user }: InfoCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push('/login'); // লগআউট শেষে লগইন পেজে রিডাইরেক্ট
            router.refresh();
          }
        }
      });
    } catch (err) {
      toast.error("Failed to terminate session.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ডিফল্ট অ্যাভাটার যদি ইমেজ না থাকে
  const fallbackAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`;

  return (
    <>
      <div className="w-full bg-white/70 dark:bg-[#111827]/40 backdrop-blur-md border border-gray-100 dark:border-gray-800/60 rounded-2xl p-6 sm:p-8 shadow-xl transition-all duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Area */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-500/30 p-1 bg-gray-50 dark:bg-gray-900/50">
            <img
              src={user?.image || fallbackAvatar}
              alt={user?.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* User Details Context */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white flex items-center justify-center sm:justify-start gap-2">
              {user?.name}
              {user?.role === 'seller' && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ShieldCheck size={12} /> Seller
                </span>
              )}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-1.5">
              <Mail size={14} /> {user?.email}
            </p>
          </div>

          {/* Action Core Controls */}
          <div className="flex flex-row sm:flex-col w-full sm:w-auto gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all"
            >
              <Edit3 size={14} /> Edit Profile
            </button>

            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 transition-all disabled:opacity-50"
            >
              <LogOut size={14} /> {isLoggingOut ? "Ending..." : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {/* Render Edit Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        currentUser={user}
      />
    </>
  );
}