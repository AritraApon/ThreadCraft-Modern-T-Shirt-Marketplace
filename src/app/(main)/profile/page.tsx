'use client';


import ProfileInfoCard from "@/Components/Profile/ProfileInfoCard";
import { authClient } from "@/lib/auth-client";
// import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import { UserSessionData } from "@/types/user";
import { Loader2, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={36} />
      </div>
    );
  }

  const rawUser = session?.user;

  const user: UserSessionData | null = rawUser ? {
    _id: (rawUser as any).id || "6a535b339aefd968ac60443e",
    name: rawUser.name,
    email: rawUser.email,
    emailVerified: rawUser.emailVerified || false,
    image: rawUser.image || "https://i.ibb.co/v4KKmPB5/download-1.jpg",
    createdAt: (rawUser as any).createdAt || new Date().toISOString(),
    updatedAt: (rawUser as any).updatedAt || new Date().toISOString(),
    role: (rawUser as any).role || "seller"
  } : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-8 text-gray-900 dark:text-white transition-colors duration-200">

      <div className="space-y-1 border-l-4 border-amber-500 pl-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2 tracking-tight">
          Welcome back, {user?.name?.split(' ')[0] || 'Seller'}!
          <Sparkles className="text-amber-500 dark:text-amber-400 fill-amber-500/20" size={24} />
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage and oversee your global profile operational nodes.</p>
      </div>

      {user ? (
        <ProfileInfoCard user={user} />
      ) : (
        <div className="p-12 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-gray-400 text-sm">
          No authenticated session found.
        </div>
      )}

    </div>
  );
}