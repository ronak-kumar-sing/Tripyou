import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/formatters';
import { motion } from 'framer-motion';

export default function TourCard({ tour }) {
  const discountPercent = tour.sale_price
    ? calculateDiscount(tour.base_price, tour.sale_price)
    : 0;

  const primaryImage = tour.images_json?.[0]?.url ||
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';

  return (
    <motion.div 
      className="card group overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <motion.img
          src={primaryImage}
          alt={tour.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        {/* Gradient overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {tour.is_on_sale && (
          <motion.div 
            className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {discountPercent}% OFF
          </motion.div>
        )}
        {tour.is_featured && (
          <motion.div 
            className="absolute top-3 left-3 bg-gradient-to-r from-primary-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1"
            initial={{ scale: 0, rotate: 12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <Star size={14} fill="currentColor" />
            Featured
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {tour.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin size={16} className="mr-2 flex-shrink-0 text-primary-500" />
          <span className="truncate">{tour.location_city}, {tour.location_country}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Clock size={16} className="mr-2 flex-shrink-0 text-primary-500" />
          <span>{tour.duration_text || `${tour.duration_hours} hours`}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          {tour.sale_price ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">
                {formatPrice(tour.sale_price)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(tour.base_price)}
              </span>
            </div>
          ) : (
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">
              {formatPrice(tour.base_price)}
            </div>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/tours/${tour.slug}`}
          className="block w-full text-center bg-gradient-to-r from-primary-500 to-blue-600 text-white py-3 rounded-xl hover:from-primary-600 hover:to-blue-700 transition-all font-semibold shadow-md hover:shadow-xl transform hover:scale-105 duration-300"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}
