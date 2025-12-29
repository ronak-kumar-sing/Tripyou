const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: true
  },
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  customer_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customer_phone: {
    type: String,
    required: true,
    trim: true
  },
  booking_date: {
    type: Date,
    required: true
  },
  number_of_people: {
    type: Number,
    required: true,
    min: 1
  },
  number_of_children: {
    type: Number,
    default: 0
  },
  total_price: {
    type: Number,
    required: true
  },
  special_requests: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  payment_status: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  payment_method: {
    type: String
  },
  stripe_payment_id: {
    type: String
  },
  booking_reference: {
    type: String,
    unique: true
  },
  admin_notes: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for id field
bookingSchema.virtual('id').get(function() {
  return this._id.toString();
});

module.exports = mongoose.model('Booking', bookingSchema);
