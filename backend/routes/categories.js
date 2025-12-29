const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// Public routes
router.get('/', categoriesController.getAllCategories);
router.get('/:slug', categoriesController.getCategoryBySlug);

module.exports = router;
