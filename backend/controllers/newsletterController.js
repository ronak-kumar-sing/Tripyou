const { NewsletterSubscription } = require('../models');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Check if already subscribed
    const existing = await NewsletterSubscription.findOne({ email });

    if (existing) {
      if (existing.is_subscribed) {
        return res.status(400).json({ success: false, message: 'Email already subscribed' });
      } else {
        // Re-subscribe
        existing.is_subscribed = true;
        existing.subscribed_at = new Date();
        existing.unsubscribed_at = null;
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      }
    }

    await NewsletterSubscription.create({ email });

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const subscription = await NewsletterSubscription.findOne({ email });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Email not found in our newsletter list' });
    }

    subscription.is_subscribed = false;
    subscription.unsubscribed_at = new Date();
    await subscription.save();

    res.json({ success: true, message: 'You have been unsubscribed from our newsletter' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all subscriptions (admin)
exports.getAllSubscriptions = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query = {};
    if (status === 'subscribed') query.is_subscribed = true;
    if (status === 'unsubscribed') query.is_subscribed = false;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const subscriptions = await NewsletterSubscription.find(query)
      .sort({ subscribed_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const count = await NewsletterSubscription.countDocuments(query);

    res.json({
      success: true,
      data: subscriptions,
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
