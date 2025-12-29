// Export all Mongoose models
const User = require('./User');
const Category = require('./Category');
const Tour = require('./Tour');
const Booking = require('./Booking');
const BlogPost = require('./BlogPost');
const ContactSubmission = require('./ContactSubmission');
const NewsletterSubscription = require('./NewsletterSubscription');
const StaticContent = require('./StaticContent');

module.exports = {
  User,
  Category,
  Tour,
  Booking,
  BlogPost,
  StaticContent,
  ContactSubmission,
  NewsletterSubscription,
};
