// src/app/unauthorized/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 text-center">
      <h1 className="text-4xl font-black text-red-500 mb-2">403 - Access Denied</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        You do not have the required permissions to access the dashboard terminal.
      </p>
      <Link href="/" className="px-4 py-2 text-xs font-bold bg-gray-950 text-white dark:bg-white dark:text-gray-950 rounded-xl hover:opacity-90 transition-all">
        Return Home
      </Link>
    </div>
  );
}
