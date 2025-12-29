const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
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
  type: {
    type: String,
    trim: true
  },
  icon_url: {
    type: String
  },
  image_url: {
    type: String
  },
  icon: {
    type: String
  },
  description: {
    type: String
  },
  display_order: {
    type: Number,
    default: 0
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
categorySchema.virtual('id').get(function() {
  return this._id.toString();
});

// Virtual for tours count
categorySchema.virtual('tours', {
  ref: 'Tour',
  localField: '_id',
  foreignField: 'category_id'
});

module.exports = mongoose.model('Category', categorySchema);
