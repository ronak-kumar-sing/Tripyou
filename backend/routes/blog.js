const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/:slug', blogController.getPostBySlug);
router.post('/:slug/views', blogController.incrementViews);
router.get('/:slug/related', blogController.getRelatedPosts);

module.exports = router;
