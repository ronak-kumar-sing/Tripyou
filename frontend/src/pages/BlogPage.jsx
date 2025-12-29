import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BlogCard from '../components/blog/BlogCard';
import Loading from '../components/common/Loading';
import { blogService } from '../services/blogService';
import { FileText } from 'lucide-react';

export default function BlogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {
          page: 1,
          limit: 9,
          category: activeCategory || undefined,
        };
        const response = await blogService.getBlogPosts(params);
        let allPosts = response.data.posts || response.data;

        // Sort featured posts to top
        allPosts = allPosts.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });

        setPosts(allPosts);
        setPagination({
          page: response.data.page || 1,
          totalPages: response.data.totalPages || 1,
        });

        // Extract unique categories
        const cats = [...new Set(allPosts.filter(p => p.category).map(p => p.category))];
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Travel Blog</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Discover travel tips, destination guides, and inspiring stories from around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${!activeCategory
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${activeCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <Loading />
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">No blog posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
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
      </div>
    </div>
  );
}
