import React, { useState, useEffect } from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import { productAPI } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load the latest collection. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-luxury-bg">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-gray-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Luxury Fashion Banner" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-bg via-transparent to-luxury-bg/50"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4 mt-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-widest text-white mb-6 uppercase">
            Elevate Your <span className="text-luxury-gold italic font-serif lowercase">Style</span>
          </h1>
          <p className="text-lg md:text-xl text-luxury-textSecondary mb-10 tracking-wide max-w-2xl mx-auto">
            Discover our exclusive new collection of premium shirts. Crafted for those who demand nothing but the absolute best.
          </p>
          <button className="bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black px-10 py-4 text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center mx-auto group">
            Explore Collection
            <ArrowRight className="ml-3 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Main Content - Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-medium tracking-wider text-white uppercase mb-2">
              Latest Arrivals
            </h2>
            <div className="h-1 w-20 bg-luxury-gold"></div>
          </div>
          <p className="text-luxury-textSecondary hidden md:block uppercase text-xs tracking-[0.15em]">
            {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-12 h-12 border-2 border-luxury-gold/20 border-t-luxury-gold rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-24 border border-red-900/30 bg-red-900/10 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 border border-gray-800 bg-[#0a0a0a] rounded-xl flex flex-col items-center">
            <ShoppingBag className="h-16 w-16 text-gray-700 mb-6" />
            <h3 className="text-2xl font-medium text-white mb-2 tracking-wider">No Products Found</h3>
            <p className="text-luxury-textSecondary max-w-md mx-auto">
              Our new collection is currently being prepared. Check back soon for exclusive pieces.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
