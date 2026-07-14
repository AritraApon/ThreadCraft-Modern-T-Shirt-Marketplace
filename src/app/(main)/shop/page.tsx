
import ProductCard from '@/Components/product/ProductCard';
import ProductFilters from '@/Components/product/ProductFilters';
import ProductPagination from '@/Components/product/ProductPagination';
import { getProducts } from '@/lib/actions/product.action';

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function AllProductPage({ searchParams }: PageProps) {
  // ১. ইউজার ইউআরএল থেকে ফিল্টারের ডেটা রিসিভ করা হচ্ছে
  const resolvedParams = await searchParams;

  // ২. তোমার ব্যাকএন্ড অ্যাকশনে ডাইনামিক প্যারামস পাঠানো হচ্ছে
  const response = await getProducts(resolvedParams);

  // তোমার ব্যাকএন্ড API স্ট্রাকচার অনুযায়ী ডেটা ডিকনস্ট্রাকশন
  const products = response?.data?.products || response?.products || [];
  const pagination = response?.data?.pagination || response?.pagination || { page: 1, limit: 12, total: 0, totalPages: 1 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 min-h-screen">

      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
          All Products Collection
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Showing {products.length} of {pagination.total} premium products.
        </p>
      </div>

      {/* সার্চ ও ফিল্টার বার */}
      <ProductFilters />

      {/* ডেস্কটপে নিখুঁত ৪টি করে কার্ডের রো (Responsive Grid Layout) */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product: any ,index: number) => (
            <ProductCard index={index} key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-12 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl text-xs text-gray-400">
          No premium items found matching the filter matrix.
        </div>
      )}

      {/* পেজ কন্ট্রোলার */}
      <ProductPagination pagination={pagination} />

    </div>
  );
}