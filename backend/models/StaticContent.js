const mongoose = require('mongoose');

const staticContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  value: {
    type: String,
    required: true
  },
  section: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'html', 'image_url', 'json'],
    default: 'text'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
staticContentSchema.virtual('id').get(function() {
  return this._id.toString();
});

module.exports = mongoose.model('StaticContent', staticContentSchema);
