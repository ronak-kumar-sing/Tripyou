const { Tour, Booking, BlogPost, Category, User, ContactSubmission } = require('../models');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total counts using countDocuments
    const [totalTours, totalBookings, pendingBookings, totalPosts, unreadContacts] = await Promise.all([
      Tour.countDocuments({ is_active: true }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      BlogPost.countDocuments({ is_published: true }),
      ContactSubmission.countDocuments({ is_read: false }),
    ]);

    // Total revenue
    const revenueResult = await Booking.aggregate([
      { $match: { payment_status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total_price' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Bookings over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const bookingsOverTime = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', count: 1, _id: 0 } }
    ]);

    // Tours by category
    const toursByCategory = await Tour.aggregate([
      { $match: { is_active: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: '$category._id',
          category: { $first: '$category.name' },
          count: { $sum: 1 }
        }
      },
      { $project: { category: 1, count: 1, _id: 0 } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate({
        path: 'tour',
        select: 'title'
      })
      .sort({ createdAt: -1 })
      .limit(10);

    const formattedRecentBookings = recentBookings.map(b => ({
      id: b._id,
      booking_reference: b.booking_reference,
      customer_name: b.customer_name,
      tour_title: b.tour?.title,
      booking_date: b.booking_date,
      status: b.status,
    }));

    res.json({
      success: true,
      data: {
        totalTours,
        totalBookings,
        pendingBookings,
        totalPosts,
        unreadContacts,
        totalRevenue,
        bookingsOverTime,
        toursByCategory,
        recentBookings: formattedRecentBookings,
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get admin users
exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ is_admin: true })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create admin user
exports.createAdminUser = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = new User({
      email,
      password_hash: password,
      name,
      phone,
      is_admin: true,
    });
    await user.save();

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update admin user
exports.updateAdminUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, is_active } = req.body;
    Object.assign(user, { name, phone, is_active });
    await user.save();

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete admin user
exports.deleteAdminUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
