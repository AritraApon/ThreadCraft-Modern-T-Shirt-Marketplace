import ProductCard from './ProductCard';

interface RelatedProps {
  products: any[];
}

export default function RelatedProducts({ products }: RelatedProps) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-4 pt-6">
      <div className="border-b border-gray-100 dark:border-gray-900 pb-3">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
          You May Also Like
        </h2>
        <p className="text-xs text-gray-400">Similar items curated from the matching operational branch.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((prod: any, idx: number) => (
          <ProductCard key={prod._id || prod.id} product={prod} index={idx} />
        ))}
      </div>
    </div>
  );
}