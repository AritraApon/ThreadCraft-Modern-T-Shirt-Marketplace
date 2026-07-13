
import Categories from '@/Components/home/Categories';
import FAQ from '@/Components/home/FAQ';
import FeaturedProducts from '@/Components/home/FeaturedProducts';
import Hero from '@/Components/home/Hero';
import NewArrivals from '@/Components/home/NewArrivals';
import Newsletter from '@/Components/home/Newsletter';
import Statistics from '@/Components/home/Statistics';
import Testimonials from '@/Components/home/Testimonials';
import WhyChooseUs from '@/Components/home/WhyChooseUs';
import Footer from '@/Components/Layout/Footer';
import { getProductDetails } from '@/lib/actions/product.action';


export default async function HomePage() {

  const response = await getProductDetails("");
  const allProducts = response?.data?.products || response?.products || [];

  const dummyArrivals = [
  { _id: "n1", title: "Vintage Oversized Tee", price: 1250, category: "T-shirt", image: ["https://i.ibb.co.com/CZBWTPN/image.png"] },
  { _id: "n2", title: "Minimalist Pima Crewneck", price: 990, category: "T-shirt", image: ["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a"] },
  { _id: "n3", title: "Aesthetic Graphic Tee", price: 1150, category: "T-shirt", image: ["https://i.ibb.co.com/JF0ngLbk/image.png"] },
  { _id: "n4", title: "Aesthetic Graphic Tee", price: 1150, category: "T-shirt", image: ["https://i.ibb.co.com/v6zZqHt4/image.png"] }
];

  return (
    <div className="space-y-4">
      {/* Hero Section */}
      <Hero />

 {/* Featured Products Matrix Section */}

      <FeaturedProducts products={allProducts} />
      {/* Categories Filtering Section */}
      <Categories />


        <NewArrivals products={dummyArrivals}/>
        <WhyChooseUs/>
        <Statistics/>
        <Testimonials/>
        <FAQ/>
        <Newsletter/>
        <Footer/>
    </div>
  );
}