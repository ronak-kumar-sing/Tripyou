import React from 'react';
import { Link } from 'react-router-dom';
import TourCard from '../tours/TourCard';

export default function FeaturedTours({ tours }) {
  if (!tours || tours.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Tours
            </h2>
            <p className="text-gray-600">
              Discover our handpicked selection of top-rated experiences
            </p>
          </div>
          <Link
            to="/tours"
            className="mt-4 md:mt-0 text-primary-500 font-semibold hover:text-primary-600 transition-colors inline-flex items-center gap-1"
          >
            View All Tours →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}
