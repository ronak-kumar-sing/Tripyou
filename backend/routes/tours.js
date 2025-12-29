const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');

// Public routes
router.get('/', toursController.getAllTours);
router.get('/featured', toursController.getFeaturedTours);
router.get('/on-sale', toursController.getOnSaleTours);
router.get('/:slug', toursController.getTourBySlug);

module.exports = router;
