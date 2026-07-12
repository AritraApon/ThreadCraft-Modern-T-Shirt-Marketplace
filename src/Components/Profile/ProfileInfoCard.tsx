'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-toastify';
import { UserSessionData } from '@/types/user';

import { Edit3, LogOut, Shield, Mail, User, Image as ImageIcon, Key, Calendar } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface InfoCardProps {
  user: UserSessionData;
}

export default function ProfileInfoCard({ user }: InfoCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully.");
            router.push('/login');
            router.refresh();
          }
        }
      });
    } catch (err) {
      toast.error("Failed to terminate user session.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="w-full space-y-6 text-gray-900 dark:text-white">

        {/* BANNER ROW COMPONENT */}
        <div className="w-full bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-300 dark:border-gray-700 bg-white dark:bg-gray-950 p-1">
              <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-lg" />
            </div>

            <div className="text-center md:text-left space-y-1">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                <Shield size={11} /> {user.role} Account
              </span>
              <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1.5">
                <Mail size={14} className="text-amber-500" /> {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={() => setIsEditOpen(true)} className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors">
              <Edit3 size={14} /> Edit Profile
            </button>
            <button onClick={handleSignOut} disabled={isLoggingOut} className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <LogOut size={14} /> {isLoggingOut ? "Leaving..." : "Log Out"}
            </button>
          </div>
        </div>

        {/* METADATA SHEET DISPLAY */}
        <div className="w-full bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-gray-900 dark:text-white border-b border-slate-100 dark:border-gray-800 pb-3">
            Account Records & Metadata Schema
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* MongoDB Unique _id Block */}
            <div className="md:col-span-2 flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Key size={14} className="text-amber-500" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Document unique identifier (_id)</span>
              </div>
              <p className="text-base font-bold font-mono text-gray-900 dark:text-amber-400 select-all break-all">{user._id}</p>
            </div>

            {/* Profile Name Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><User size={14} /><span className="text-[11px] font-bold uppercase tracking-widest">Profile Name</span></div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</p>
            </div>

            {/* Profile Role Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Shield size={14} /><span className="text-[11px] font-bold uppercase tracking-widest">Account Role Scope</span></div>
              <p className="text-lg font-black uppercase text-gray-900 dark:text-white tracking-wide">{user.role}</p>
            </div>

            {/* Profile Email Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Mail size={14} /><span className="text-[11px] font-bold uppercase tracking-widest">Email Node</span></div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-200 font-mono truncate select-all">{user.email}</p>
            </div>

            {/* Profile Created At Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><Calendar size={14} /><span className="text-[11px] font-bold uppercase tracking-widest">ISO Creation Date</span></div>
              <p className="text-base font-mono text-gray-700 dark:text-gray-400">{new Date(user.createdAt).toLocaleString()}</p>
            </div>

            {/* Photo Link Box */}
            <div className="md:col-span-2 flex flex-col p-4 rounded-xl bg-slate-50 dark:bg-gray-950 border border-slate-200 dark:border-gray-800 space-y-1">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400"><ImageIcon size={14} /><span className="text-[11px] font-bold uppercase tracking-widest">Hosted CDN Target Resource (Image URL)</span></div>
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate select-all hover:text-amber-500 dark:hover:text-amber-400 transition-colors">{user.image}</p>
            </div>

          </div>
        </div>

      </div>

      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} currentUser={user} />
    </>
  );
}