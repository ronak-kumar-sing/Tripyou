import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate, truncateText } from '../../utils/formatters';

export default function BlogCard({ post }) {
  return (
    <motion.div 
      className="card group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <motion.img
          src={post.cover_image_url || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
          alt={post.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        {/* Gradient overlay on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        {post.category && (
          <motion.div 
            className="absolute top-3 left-3 bg-gradient-to-r from-primary-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {post.category}
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-primary-500" />
            <span>{formatDate(post.published_at || post.created_at, 'short')}</span>
          </div>
          {post.author_name && (
            <div className="flex items-center gap-1">
              <User size={14} className="text-primary-500" />
              <span>{post.author_name}</span>
            </div>
          )}
          {post.views_count > 0 && (
            <div className="flex items-center gap-1">
              <Eye size={14} className="text-primary-500" />
              <span>{post.views_count}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {truncateText(post.excerpt || '', 120)}
        </p>

        {/* Read More */}
        <Link
          to={`/blog/${post.slug}`}
          className="text-primary-500 font-semibold hover:text-primary-600 transition-all inline-flex items-center gap-2 group/link"
        >
          Read More 
          <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
