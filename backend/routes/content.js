const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');

// Public routes
router.get('/', contentController.getAllContent);
router.get('/:key', contentController.getContentByKey);
router.get('/section/:section', contentController.getContentBySection);

module.exports = router;
