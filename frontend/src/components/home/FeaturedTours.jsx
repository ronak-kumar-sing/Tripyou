import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import TourCard from '../tours/TourCard';

export default function FeaturedTours({ tours }) {
  if (!tours || tours.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Featured <span className="bg-gradient-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">Tours</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Discover our handpicked selection of top-rated experiences
            </p>
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to="/tours"
              className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-blue-700 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              View All Tours
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
