const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  short_description: {
    type: String
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  location_city: {
    type: String
  },
  location_country: {
    type: String,
    default: 'UAE'
  },
  base_price: {
    type: Number,
    required: true
  },
  sale_price: {
    type: Number
  },
  discount_percent: {
    type: Number
  },
  duration_hours: {
    type: Number
  },
  duration_text: {
    type: String
  },
  max_participants: {
    type: Number
  },
  highlights: {
    type: [String],
    default: []
  },
  included: {
    type: [String],
    default: []
  },
  excluded: {
    type: [String],
    default: []
  },
  itinerary: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  faq: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  images_json: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  is_on_sale: {
    type: Boolean,
    default: false
  },
  is_active: {
    type: Boolean,
    default: true
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
tourSchema.virtual('id').get(function() {
  return this._id.toString();
});

// Index for search
tourSchema.index({ title: 'text', description: 'text', location_city: 'text' });

module.exports = mongoose.model('Tour', tourSchema);
