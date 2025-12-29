const express = require('express');
const router = express.Router();
const { authenticateToken, adminOnly } = require('../middleware/authMiddleware');

// Import controllers
const toursController = require('../controllers/toursController');
const categoriesController = require('../controllers/categoriesController');
const bookingsController = require('../controllers/bookingsController');
const blogController = require('../controllers/blogController');
const contactController = require('../controllers/contactController');
const contentController = require('../controllers/contentController');
const newsletterController = require('../controllers/newsletterController');
const dashboardController = require('../controllers/dashboardController');

// All admin routes require authentication and admin role
router.use(authenticateToken, adminOnly);

// Dashboard
router.get('/dashboard/stats', dashboardController.getDashboardStats);

// Tours management
router.get('/tours', toursController.getAllTours);
router.get('/tours/:id', toursController.getTourForEdit);
router.post('/tours', toursController.createTour);
router.put('/tours/:id', toursController.updateTour);
router.delete('/tours/:id', toursController.deleteTour);
router.patch('/tours/:id/sale-status', toursController.toggleSaleStatus);

// Categories management
router.get('/categories', categoriesController.getAllCategoriesAdmin);
router.post('/categories', categoriesController.createCategory);
router.put('/categories/:id', categoriesController.updateCategory);
router.delete('/categories/:id', categoriesController.deleteCategory);

// Bookings management
router.get('/bookings', bookingsController.getAllBookings);
router.get('/bookings/:id', bookingsController.getBookingById);
router.put('/bookings/:id', bookingsController.updateBooking);
router.delete('/bookings/:id', bookingsController.deleteBooking);
router.post('/bookings/:id/send-email', bookingsController.sendConfirmationEmail);

// Blog management
router.get('/blog', blogController.getAllPostsAdmin);
router.get('/blog/:id', blogController.getPostForEdit);
router.post('/blog', blogController.createPost);
router.put('/blog/:id', blogController.updatePost);
router.delete('/blog/:id', blogController.deletePost);

// Contact submissions management
router.get('/contacts', contactController.getAllContacts);
router.get('/contacts/:id', contactController.getContactById);
router.patch('/contacts/:id/read', contactController.markAsRead);
router.post('/contacts/:id/reply', contactController.replyToContact);
router.delete('/contacts/:id', contactController.deleteContact);

// Content management
router.get('/content', contentController.getAllContentAdmin);
router.patch('/content/:key', contentController.updateContent);
router.put('/content/section/:section', contentController.updateSection);

// Newsletter management
router.get('/newsletter', newsletterController.getAllSubscriptions);

// User management
router.get('/users', dashboardController.getAdminUsers);
router.post('/users', dashboardController.createAdminUser);
router.put('/users/:id', dashboardController.updateAdminUser);
router.delete('/users/:id', dashboardController.deleteAdminUser);

module.exports = router;
