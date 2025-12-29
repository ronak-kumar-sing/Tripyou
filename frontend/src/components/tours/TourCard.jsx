import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star } from 'lucide-react';
import { formatPrice, calculateDiscount } from '../../utils/formatters';

export default function TourCard({ tour }) {
  const discountPercent = tour.sale_price
    ? calculateDiscount(tour.base_price, tour.sale_price)
    : 0;

  const primaryImage = tour.images_json?.[0]?.url ||
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800';

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={primaryImage}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {tour.is_on_sale && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {discountPercent}% OFF
          </div>
        )}
        {tour.is_featured && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star size={14} fill="currentColor" />
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {tour.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <MapPin size={16} className="mr-2 flex-shrink-0" />
          <span className="truncate">{tour.location_city}, {tour.location_country}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Clock size={16} className="mr-2 flex-shrink-0" />
          <span>{tour.duration_text || `${tour.duration_hours} hours`}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          {tour.sale_price ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary-500">
                {formatPrice(tour.sale_price)}
              </span>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(tour.base_price)}
              </span>
            </div>
          ) : (
            <div className="text-xl font-bold text-primary-500">
              {formatPrice(tour.base_price)}
            </div>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/tours/${tour.slug}`}
          className="block w-full text-center bg-primary-500 text-white py-2.5 rounded-lg hover:bg-primary-600 transition-colors font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
