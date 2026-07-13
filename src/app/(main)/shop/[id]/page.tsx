import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProductDetails } from '@/lib/actions/product.action';
import ProductGallery from '@/Components/product/ProductGallery';
import ProductInfo from '@/Components/product/ProductInfo';
import ProductTabs from '@/Components/product/ProductTabs';
import RelatedProducts from '@/Components/product/RelatedProducts';


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  // 1. Properly resolve dynamic route params (Next.js 16 compliant)
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  // 2. Load payload structure from the backend API response
  const response = await getProductDetails(id);

  // Safe extraction based on successResponse wrapper
  const product = response?.data?.product || response?.product;
  const relatedProducts = response?.data?.relatedProducts || response?.relatedProducts || [];

  // Fallback state if entity is missing
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-gray-500">Requested product asset node could not be retrieved.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 text-xs font-bold text-amber-500">
          <ArrowLeft size={14} /> Back to Shop Marketplace
        </Link>
      </div>
    );
  }

  // Handle singular or array mapping safely for the gallery engine
const imageList = product.images || (Array.isArray(product.image) ? product.image : [product.image]);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 min-h-screen">

      {/* Dynamic Navigation/Back Controller */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-amber-500 transition-colors bg-white dark:bg-gray-900 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Products Catalog
        </Link>
      </div>

      {/* Main Core Segment: Split Gallery and Context engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Interactive Panel */}
        <ProductGallery images={imageList} />

        {/* Right Details Matrix Info */}
        <ProductInfo product={product} />
      </div>

      {/* Description & Tab Controls */}
      <ProductTabs description={product.description} />

      {/* Dynamic Recommendation Block */}
      <RelatedProducts products={relatedProducts} />

    </div>
  );
}