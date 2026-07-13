import DashboardSidebar from '@/Components/Layout/DashboardSidebar';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch the user session from Better Auth using request headers
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const role = user?.role || "buyer";

  // 2. Strict authorization check: If the user is a buyer, block access immediately
  if (role === "buyer") {
    // Option A: Redirect to a custom unauthorized page
    return redirect("/unauthorized");

    // Option B: If you want to show a 404/Not Found instead, uncomment the line below:
    // import { notFound } from 'next/navigation';
    // return notFound();
  }

  // 3. Render the secure dashboard layout only for authorized roles (e.g., admin, seller)
  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0B0F19] transition-colors duration-300">
      {/* Sidebar Component */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}