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
      className="relative bg-cover bg-center min-h-[700px] flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.6)), url('${heroContent?.background_image_url || 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600'}')`,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-white relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {heroContent?.title || 'Discover Your Next Adventure'}
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-white/90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {heroContent?.subtitle || 'Explore the best tours and experiences in Dubai and beyond. Book your dream vacation today.'}
          </motion.p>
        </motion.div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 md:p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <motion.button
              type="submit"
              className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} />
              Search
            </motion.button>
          </div>
        </motion.form>

        {/* Quick Stats */}
        <motion.div 
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: TrendingUp, value: '500+', label: 'Tours' },
            { icon: Users, value: '10K+', label: 'Happy Customers' },
            { icon: MapPinned, value: '50+', label: 'Destinations' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
            >
              <div className="flex justify-center mb-2">
                <stat.icon size={32} className="text-white" />
              </div>
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-white/80 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
