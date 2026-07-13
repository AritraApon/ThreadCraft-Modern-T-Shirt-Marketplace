
import Categories from '@/Components/home/Categories';
import FeaturedProducts from '@/Components/home/FeaturedProducts';
import Hero from '@/Components/home/Hero';
import { getProductDetails } from '@/lib/actions/product.action';


export default async function HomePage() {

  const response = await getProductDetails("");
  const allProducts = response?.data?.products || response?.products || [];

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero />

      {/* Categories Filtering Section */}
      <Categories />

      {/* Featured Products Matrix Section */}

      <FeaturedProducts products={allProducts} />


    </div>
  );
}