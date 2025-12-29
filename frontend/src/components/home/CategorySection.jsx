import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategorySection({ categories }) {
  if (!categories || categories.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore by <span className="bg-gradient-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Browse our wide selection of tours by category and find your perfect adventure
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={item}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                to={`/tours?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl h-56 shadow-lg block hover:shadow-2xl transition-shadow duration-300"
              >
                <motion.img
                  src={category.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Animated overlay on hover */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-primary-600/80 via-primary-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform transition-transform duration-300 group-hover:translate-y-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      whileHover={{ x: 0, opacity: 1 }}
                      className="group-hover:opacity-100 opacity-0 transition-opacity"
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  </div>
                  <p className="text-sm text-gray-200 flex items-center gap-1">
                    <MapPin size={14} />
                    {category.tours_count || 0} Tours Available
                  </p>
                  {category.icon && (
                    <div className="absolute top-4 right-4 text-3xl opacity-70">
                      {category.icon}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
