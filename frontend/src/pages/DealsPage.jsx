import React, { useEffect, useState } from 'react';
import TourCard from '../components/tours/TourCard';
import Loading from '../components/common/Loading';
import { toursService } from '../services/toursService';
import { Tag, Percent } from 'lucide-react';

export default function DealsPage() {
  const [loading, setLoading] = useState(true);
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await toursService.getDeals();
        setDeals(response.data);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag size={32} />
            <Percent size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Special Deals & Offers</h1>
          <p className="text-secondary-100 max-w-2xl mx-auto">
            Don't miss out on these amazing discounts! Book your dream tour today and save big.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <Loading />
        ) : deals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <Tag size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No deals available at the moment</p>
            <p className="text-gray-400">Check back later for exciting offers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
