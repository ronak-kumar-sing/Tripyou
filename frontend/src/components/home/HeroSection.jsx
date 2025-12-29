import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Users, MapPinned } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ heroContent }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section
      className="relative bg-cover bg-center min-h-[600px] flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${heroContent?.background_image_url || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600'}')`,
      }}
    >

      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
          {heroContent?.title || 'Discover Your Next Adventure'}
        </h1>
        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          {heroContent?.subtitle || 'Explore the best tours and experiences in Dubai and beyond. Book your dream vacation today.'}
        </p>

        {/* Search Form */}
        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-4 md:p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-12">
          <div className="text-center">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-gray-200">Tours</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-gray-200">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">50+</div>
            <div className="text-gray-200">Destinations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
