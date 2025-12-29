import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import TourCard from '../components/tours/TourCard';
import Loading from '../components/common/Loading';
import { searchService } from '../services/searchService';
import { Search } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({ tours: [], blogs: [] });

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await searchService.search(query);
        setResults(response.data);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
      }
    };
    performSearch();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Search size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter a search term</h2>
          <Link to="/tours" className="text-primary-500 hover:text-primary-600">
            Browse all tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-primary-100">
            Showing results for "<span className="font-semibold">{query}</span>"
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Tours Results */}
            {results.tours && results.tours.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Tours ({results.tours.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>
              </section>
            )}

            {/* Blog Results */}
            {results.blogs && results.blogs.length > 0 && (
              <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Blog Posts ({results.blogs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.blogs.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* No Results */}
            {(!results.tours || results.tours.length === 0) &&
              (!results.blogs || results.blogs.length === 0) && (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                  <Search size={48} className="mx-auto text-gray-400 mb-4" />
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found for "{query}"
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Try searching with different keywords
                  </p>
                  <Link
                    to="/tours"
                    className="text-primary-500 font-semibold hover:text-primary-600"
                  >
                    Browse all tours
                  </Link>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
