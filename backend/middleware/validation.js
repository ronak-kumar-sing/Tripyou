const { body, validationResult } = require('express-validator');

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Register validation
exports.validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name cannot exceed 255 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors,
];

// Login validation
exports.validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors,
];

// Booking validation
exports.validateBooking = [
  body('tour_id')
    .notEmpty()
    .withMessage('Tour is required')
    .isMongoId()
    .withMessage('Invalid tour ID'),
  body('customer_name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name cannot exceed 255 characters'),
  body('customer_email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('customer_phone')
    .notEmpty()
    .withMessage('Phone number is required'),
  body('booking_date')
    .notEmpty()
    .withMessage('Booking date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('number_of_people')
    .isInt({ min: 1 })
    .withMessage('At least 1 person is required'),
  body('number_of_children')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Number of children must be 0 or more'),
  handleValidationErrors,
];

// Contact form validation
exports.validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name cannot exceed 255 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
  body('phone')
    .optional()
    .trim(),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Subject cannot exceed 255 characters'),
  handleValidationErrors,
];

// Tour validation
exports.validateTour = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('category_id')
    .notEmpty()
    .withMessage('Category is required')
    .isUUID()
    .withMessage('Invalid category ID'),
  body('base_price')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),
  body('sale_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Sale price must be a positive number'),
  handleValidationErrors,
];

// Blog post validation
exports.validateBlogPost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 255 })
    .withMessage('Title cannot exceed 255 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Category cannot exceed 100 characters'),
  handleValidationErrors,
];

// Category validation
exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name cannot exceed 255 characters'),
  body('type')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Type cannot exceed 100 characters'),
  handleValidationErrors,
];
