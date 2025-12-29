// Generate URL-friendly slug from text
exports.generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

// Generate unique booking reference
exports.generateBookingReference = () => {
  const prefix = 'TH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Format price
exports.formatPrice = (price, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
};

// Format date
exports.formatDate = (date, format = 'long') => {
  const options = format === 'long'
    ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    : { year: 'numeric', month: 'short', day: 'numeric' };

  return new Date(date).toLocaleDateString('en-US', options);
};

// Calculate discount percentage
exports.calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Paginate results helper
exports.paginate = (page = 1, limit = 10) => {
  const offset = (parseInt(page) - 1) * parseInt(limit);
  return {
    limit: parseInt(limit),
    offset,
  };
};

// Create pagination response
exports.paginationResponse = (count, page, limit) => {
  return {
    total: count,
    page: parseInt(page),
    limit: parseInt(limit),
    pages: Math.ceil(count / parseInt(limit)),
  };
};
