const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');
const { validateBooking } = require('../middleware/validation');

// Public routes
router.post('/', validateBooking, bookingsController.createBooking);
router.get('/:reference', bookingsController.getBookingByReference);

module.exports = router;
