import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye } from 'lucide-react';
import { formatDate, truncateText } from '../../utils/formatters';

export default function BlogCard({ post }) {
  return (
    <div className="card group">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={post.cover_image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {post.category && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {post.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(post.published_at || post.created_at, 'short')}</span>
          </div>
          {post.author_name && (
            <div className="flex items-center gap-1">
              <User size={14} />
              <span>{post.author_name}</span>
            </div>
          )}
          {post.views_count > 0 && (
            <div className="flex items-center gap-1">
              <Eye size={14} />
              <span>{post.views_count}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {truncateText(post.excerpt || '', 120)}
        </p>

        {/* Read More */}
        <Link
          to={`/blog/${post.slug}`}
          className="text-primary-500 font-semibold hover:text-primary-600 transition-colors inline-flex items-center gap-1"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
