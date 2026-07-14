'use client';

import ProfileInfoCard from "@/Components/Profile/ProfileInfoCard";
import { authClient } from "@/lib/auth-client";

import { UserSessionData } from "@/types/user";
import { Loader2, LayoutDashboard } from "lucide-react";

export default function DashboardProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  const rawUser = session?.user;

  const user: UserSessionData | null = rawUser ? {
    _id: (rawUser as any).id ,
    name: rawUser.name,
    email: rawUser.email,
    emailVerified: rawUser.emailVerified || false,
    image: rawUser.image || "https://i.ibb.co/v4KKmPB5/download-1.jpg",
    createdAt: (rawUser as any).createdAt || new Date().toISOString(),
    updatedAt: (rawUser as any).updatedAt || new Date().toISOString(),
    role: (rawUser as any).role || "seller"
  } : null;

  return (
    <div className="w-full space-y-6 transition-colors duration-200">

      {/* ড্যাশবোর্ড ভাইব দেওয়ার জন্য একটা ছোট হেডার */}
      <div className="space-y-1 border-l-4 border-amber-500 pl-4">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
          <LayoutDashboard size={22} className="text-amber-500" />
          Dashboard Profile Node
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Review and configure your operational dashboard metrics.</p>
      </div>


      {user ? (
        <ProfileInfoCard user={user} />
      ) : (
        <div className="p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 text-sm">
          No active dashboard session detected.
        </div>
      )}

    </div>
  );
}