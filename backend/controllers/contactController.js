const { ContactSubmission } = require('../models');
const { sendContactReply } = require('../utils/emailService');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const submission = new ContactSubmission({
      name,
      email,
      phone,
      subject,
      message,
    });
    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: submission,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contact submissions (admin)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const where = {};

    if (status === 'unread') where.is_read = false;
    if (status === 'read') where.is_read = true;
    if (status === 'replied') where.is_replied = true;
    if (status === 'unanswered') where.is_replied = false;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      where.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const [rows, count] = await Promise.all([
      ContactSubmission.find(where)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(offset),
      ContactSubmission.countDocuments(where)
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

// Get single contact submission (admin)
exports.getContactById = async (req, res) => {
  try {
    const contact = await ContactSubmission.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }

    // Mark as read
    if (!contact.is_read) {
      Object.assign(contact, { is_read: true });
      await contact.save();
    }

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mark as read/unread (admin)
exports.markAsRead = async (req, res) => {
  try {
    const contact = await ContactSubmission.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }

    Object.assign(contact, { is_read: true });
    await contact.save();

    res.json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reply to contact (admin)
exports.replyToContact = async (req, res) => {
  try {
    const { reply } = req.body;
    const contact = await ContactSubmission.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }

    // Send reply email
    await sendContactReply(contact, reply);

    // Update contact submission
    Object.assign(contact, {
      is_replied: true,
      admin_reply: reply,
    });
    await contact.save();

    res.json({ success: true, message: 'Reply sent successfully', data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete contact submission (admin)
exports.deleteContact = async (req, res) => {
  try {
    const contact = await ContactSubmission.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' });
    }

    await ContactSubmission.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Contact submission deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
