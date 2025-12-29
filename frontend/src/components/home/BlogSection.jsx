import React from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../blog/BlogCard';

export default function BlogSection({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              From Our Blog
            </h2>
            <p className="text-gray-600">
              Travel tips, destination guides, and inspiring stories
            </p>
          </div>
          <Link
            to="/blog"
            className="mt-4 md:mt-0 text-primary-500 font-semibold hover:text-primary-600 transition-colors inline-flex items-center gap-1"
          >
            Read All Posts →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
