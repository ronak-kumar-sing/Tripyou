import React from 'react';
import { Link } from 'react-router-dom';
import TourCard from '../tours/TourCard';
import { Tag } from 'lucide-react';

export default function DealsSection({ deals }) {
  if (!deals || deals.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-r from-secondary-500 to-secondary-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div className="text-white">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={24} />
              <span className="text-sm font-semibold uppercase tracking-wider">Limited Time</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Special Deals & Offers
            </h2>
            <p className="text-secondary-100">
              Don't miss out on these amazing discounts on top tours
            </p>
          </div>
          <Link
            to="/deals"
            className="mt-4 md:mt-0 bg-white text-secondary-500 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View All Deals
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {deals.slice(0, 4).map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
