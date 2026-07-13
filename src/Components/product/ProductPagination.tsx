'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductPagination({ pagination }: { pagination: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { page, totalPages } = pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());

    // ৪MD/404 ফিক্স
    const currentPath = window.location.pathname;
    router.push(`${currentPath}?${params.toString()}`);
  };

  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 px-3">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 disabled:opacity-40 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}