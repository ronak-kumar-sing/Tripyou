const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  excerpt: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  cover_image_url: {
    type: String
  },
  category: {
    type: String
  },
  author_name: {
    type: String
  },
  is_published: {
    type: Boolean,
    default: false
  },
  published_at: {
    type: Date
  },
  views_count: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  seo_meta_title: {
    type: String
  },
  seo_meta_description: {
    type: String
  },
  seo_keywords: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
blogPostSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Index for search
blogPostSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

module.exports = mongoose.model('BlogPost', blogPostSchema);
