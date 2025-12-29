import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import BlogCard from '../blog/BlogCard';

export default function BlogSection({ posts }) {
  if (!posts || posts.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10">
          <BookOpen size={200} className="text-primary-500" />
        </div>
        <div className="absolute bottom-10 right-10">
          <BookOpen size={250} className="text-blue-500" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              From Our <span className="bg-gradient-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent">Blog</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Travel tips, destination guides, and inspiring stories
            </p>
          </div>
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              to="/blog"
              className="mt-4 md:mt-0 bg-gradient-to-r from-primary-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-blue-700 transition-all inline-flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              Read All Posts
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
