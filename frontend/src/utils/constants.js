export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TourHub';
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PAID: 'paid',
  REFUNDED: 'refunded',
};

export const BLOG_CATEGORIES = [
  'Guide',
  'Story',
  'Tips',
  'News',
];

export const TOUR_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'title', label: 'Name: A-Z' },
];

export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;
