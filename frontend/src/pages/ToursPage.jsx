import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import TourCard from '../components/tours/TourCard';
import TourFilters from '../components/tours/TourFilters';
import Loading from '../components/common/Loading';
import { toursService } from '../services/toursService';
import { categoriesService } from '../services/categoriesService';
import { List, Grid } from 'lucide-react';

export default function ToursPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [viewMode, setViewMode] = useState('grid');

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    location: searchParams.get('location') || '',
    onSale: searchParams.get('onSale') || '',
  });

  const fetchTours = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v)
        ),
      };
      const response = await toursService.getTours(params);
      // API returns { success, data, pagination } structure
      const toursData = response.data || [];
      setTours(toursData);

      if (response.pagination) {
        setPagination({
          page: response.pagination.page || page,
          total: response.pagination.total || toursData.length,
          totalPages: response.pagination.pages || 1,
        });
      } else {
        setPagination({
          page: page,
          total: toursData.length,
          totalPages: 1,
        });
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTours(1);
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);
  }, [filters, fetchTours, setSearchParams]);

  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      location: '',
      onSale: '',
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">All Tours</h1>
          <p className="text-primary-100">
            Discover amazing experiences in your favorite destinations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <TourFilters
              categories={categories}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Tours Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow p-4">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{tours.length}</span> of{' '}
                <span className="font-semibold">{pagination.total}</span> tours
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-500' : 'text-gray-400'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-500' : 'text-gray-400'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : tours.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">No tours found matching your criteria</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary-500 font-semibold hover:text-primary-600"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
                  }`}>
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => fetchTours(i + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${pagination.page === i + 1
                          ? 'bg-primary-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
