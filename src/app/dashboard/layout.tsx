import DashboardSidebar from '@/Components/Layout/DashboardSidebar';
import React from 'react';


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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