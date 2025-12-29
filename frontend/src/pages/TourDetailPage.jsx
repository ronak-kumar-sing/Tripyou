import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock, MapPin, Users, Star, Check, ChevronRight,
  Calendar, Phone, Mail, Share2, Heart
} from 'lucide-react';
import { toursService } from '../services/toursService';
import BookingForm from '../components/tours/BookingForm';
import Loading from '../components/common/Loading';
import { formatPrice } from '../utils/formatters';

export default function TourDetailPage() {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await toursService.getTourBySlug(slug);
        setTour(response.data);
      } catch (error) {
        console.error('Error fetching tour:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [slug]);

  if (loading) return <Loading fullScreen />;
  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Not Found</h2>
          <Link to="/tours" className="text-primary-500 hover:text-primary-600">
            Browse all tours
          </Link>
        </div>
      </div>
    );
  }

  const images = tour.images_json || [{ url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600' }];
  const highlights = tour.highlights_json || tour.highlights || [];
  const included = tour.included || tour.includes_json || [];
  const itinerary = tour.itinerary || tour.itinerary_json || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-500">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/tours" className="hover:text-primary-500">Tours</Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-900 font-medium truncate">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
              <div className="relative h-96">
                <img
                  src={images[activeImage]?.url}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                {tour.is_on_sale && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
                    SALE
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${activeImage === index ? 'ring-2 ring-primary-500' : ''
                        }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tour Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{tour.title}</h1>

              <div className="flex flex-wrap gap-6 mb-6 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={20} className="text-primary-500" />
                  <span>{tour.location_city}, {tour.location_country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-primary-500" />
                  <span>{tour.duration_text || `${tour.duration_hours} hours`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-primary-500" />
                  <span>Max {tour.max_group_size} people</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <nav className="flex gap-6">
                  {['description', 'highlights', 'itinerary', 'included'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 border-b-2 font-medium capitalize transition-colors ${activeTab === tab
                        ? 'border-primary-500 text-primary-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="prose max-w-none">
                {activeTab === 'description' && (
                  <div dangerouslySetInnerHTML={{ __html: tour.description }} />
                )}

                {activeTab === 'highlights' && (
                  <ul className="space-y-3">
                    {highlights.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check size={20} className="text-primary-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {activeTab === 'itinerary' && (
                  <div className="space-y-4">
                    {Array.isArray(itinerary) && itinerary.length > 0 ? (
                      itinerary.map((item, index) => (
                        <div key={index} className="border-l-2 border-primary-500 pl-4">
                          <h4 className="font-semibold">{item.time || item.title}</h4>
                          <p className="text-gray-600">{item.activity || item.description || item}</p>
                        </div>
                      ))
                    ) : typeof itinerary === 'string' && itinerary ? (
                      <p className="whitespace-pre-wrap text-gray-600">{itinerary}</p>
                    ) : (
                      <p className="text-gray-500">No itinerary available</p>
                    )}
                  </div>
                )}

                {activeTab === 'included' && (
                  <div className="grid grid-cols-2 gap-4">
                    {included.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check size={18} className="text-green-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingForm tour={tour} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
