import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function CategorySection({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our wide selection of tours by category and find your perfect adventure
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/tours?category=${category.id}`}
              className="group relative overflow-hidden rounded-xl h-48 shadow-lg"
            >
              <img
                src={category.image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-200 flex items-center gap-1">
                  <MapPin size={14} />
                  {category.tours_count || 0} Tours
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
