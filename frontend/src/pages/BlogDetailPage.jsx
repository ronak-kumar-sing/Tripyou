import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Eye, ChevronRight, Clock } from 'lucide-react';
import { blogService } from '../services/blogService';
import Loading from '../components/common/Loading';
import { formatDate } from '../utils/formatters';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await blogService.getPostBySlug(slug);
        setPost(response.data);

        // Fetch related posts
        const relatedRes = await blogService.getBlogPosts({ limit: 3 });
        setRelatedPosts((relatedRes.data.posts || relatedRes.data).filter(p => p.slug !== slug));
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <Loading fullScreen />;
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
          <Link to="/blog" className="text-primary-500 hover:text-primary-600">
            Browse all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-500">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/blog" className="hover:text-primary-500">Blog</Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-900 font-medium truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            {post.author_name && (
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author_name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{formatDate(post.published_at || post.created_at, 'long')}</span>
            </div>
            {post.reading_time && (
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.reading_time} min read</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {post.cover_image_url && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags_json && post.tags_json.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h4 className="font-semibold mb-3">Tags:</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags_json.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-white py-12 border-t">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={relatedPost.cover_image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-500 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
