const mongoose = require('mongoose');

const newsletterSubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  is_subscribed: {
    type: Boolean,
    default: true
  },
  subscribed_at: {
    type: Date,
    default: Date.now
  },
  unsubscribed_at: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
newsletterSubscriptionSchema.virtual('id').get(function() {
  return this._id.toString();
});

module.exports = mongoose.model('NewsletterSubscription', newsletterSubscriptionSchema);
