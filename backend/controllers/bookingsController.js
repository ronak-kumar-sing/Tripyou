const { Booking, Tour } = require('../models');
const { generateBookingReference } = require('../utils/helpers');
const { sendBookingConfirmation } = require('../utils/emailService');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const {
      tour_id,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      number_of_people,
      number_of_children,
      special_requests,
    } = req.body;

    // Get tour to calculate price
    const tour = await Tour.findById(tour_id);
    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    // Calculate total price
    const pricePerPerson = tour.sale_price || tour.base_price;
    const childPrice = pricePerPerson * 0.5; // 50% for children
    const total_price = (pricePerPerson * number_of_people) + (childPrice * (number_of_children || 0));

    // Generate unique booking reference
    const booking_reference = generateBookingReference();

    const booking = new Booking({
      tour_id,
      customer_name,
      customer_email,
      customer_phone,
      booking_date,
      number_of_people,
      number_of_children: number_of_children || 0,
      total_price,
      special_requests,
      booking_reference,
      status: 'pending',
      payment_status: 'unpaid',
    });
    await booking.save();

    // Send confirmation email (async, don't wait)
    sendBookingConfirmation(booking, tour).catch(err => {
      console.error('Failed to send booking confirmation email:', err);
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get booking by reference
exports.getBookingByReference = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      booking_reference: req.params.reference
    }).populate({
      path: 'tour',
      select: 'title slug location_city duration_text images_json'
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings (admin)
exports.getAllBookings = async (req, res) => {
  try {
    const {
      status,
      payment_status,
      search,
      dateFrom,
      dateTo,
      page = 1,
      limit = 20,
    } = req.query;

    const where = {};

    if (status && status !== 'all') where.status = status;
    if (payment_status && payment_status !== 'all') where.payment_status = payment_status;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      where.$or = [
        { customer_name: searchRegex },
        { customer_email: searchRegex },
        { booking_reference: searchRegex },
      ];
    }

    if (dateFrom) where.booking_date = { $gte: dateFrom };
    if (dateTo) where.booking_date = { ...where.booking_date, $lte: dateTo };

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [rows, count] = await Promise.all([
      Booking.find(where)
        .populate({
          path: 'tour',
          select: 'title slug'
        })
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(offset),
      Booking.countDocuments(where)
    ]);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking (admin)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'tour'
      });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking (admin)
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const { status, payment_status, admin_notes, payment_method } = req.body;

    Object.assign(booking, {
      status: status || booking.status,
      payment_status: payment_status || booking.payment_status,
      admin_notes: admin_notes !== undefined ? admin_notes : booking.admin_notes,
      payment_method: payment_method || booking.payment_method,
    });
    await booking.save();

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete booking (admin)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send confirmation email (admin)
exports.sendConfirmationEmail = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'tour'
      });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await sendBookingConfirmation(booking, booking.tour);

    res.json({ success: true, message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
