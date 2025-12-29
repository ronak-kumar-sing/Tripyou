# Tourism Website - Implementation Guide with Code Examples

## PART 1: BACKEND SETUP & KEY FILES

### 1. Backend Entry Point (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tours', require('./routes/tours'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/content', require('./routes/content'));
app.use('/api/search', require('./routes/search'));
app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Database sync and server start
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    console.log('Database connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = app;
```

---

### 2. Database Config (config/database.js)

```javascript
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
```

---

### 3. Tour Model (models/Tour.js)

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tour = sequelize.define('Tour', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  short_description: {
    type: DataTypes.STRING(500),
  },
  location_city: {
    type: DataTypes.STRING,
  },
  location_country: {
    type: DataTypes.STRING,
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  duration_hours: {
    type: DataTypes.INTEGER,
  },
  duration_text: {
    type: DataTypes.STRING,
  },
  max_participants: {
    type: DataTypes.INTEGER,
  },
  highlights: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  included: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  excluded: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  itinerary: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  faq: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  images_json: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_on_sale: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  seo_meta_title: {
    type: DataTypes.STRING(255),
  },
  seo_meta_description: {
    type: DataTypes.STRING(500),
  },
  seo_keywords: {
    type: DataTypes.STRING(500),
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  tableName: 'tours',
});

module.exports = Tour;
```

---

### 4. Tours Controller (controllers/toursController.js)

```javascript
const Tour = require('../models/Tour');
const Category = require('../models/Category');
const { Op } = require('sequelize');
const { generateSlug } = require('../utils/helpers');

// Get all tours with filters
exports.getAllTours = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      location,
      onSale,
      featured,
      page = 1,
      limit = 12,
      sort = 'newest',
      search,
    } = req.query;

    const where = { is_active: true };
    
    if (category) where.category_id = category;
    if (minPrice) where.base_price = { [Op.gte]: minPrice };
    if (maxPrice) where.base_price = { ...where.base_price, [Op.lte]: maxPrice };
    if (location) where.location_city = { [Op.iLike]: `%${location}%` };
    if (onSale === 'true') where.is_on_sale = true;
    if (featured === 'true') where.is_featured = true;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const order = [];
    if (sort === 'price-asc') order.push(['base_price', 'ASC']);
    else if (sort === 'price-desc') order.push(['base_price', 'DESC']);
    else order.push(['created_at', 'DESC']);

    const offset = (page - 1) * limit;

    const { rows, count } = await Tour.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category' }],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single tour by slug
exports.getTourBySlug = async (req, res) => {
  try {
    const tour = await Tour.findOne({
      where: { slug: req.params.slug, is_active: true },
      include: [{ model: Category, as: 'category' }],
    });

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create tour (admin only)
exports.createTour = async (req, res) => {
  try {
    const {
      title, description, short_description, category_id,
      location_city, location_country, base_price, sale_price,
      duration_hours, duration_text, max_participants,
      highlights, included, excluded, itinerary, faq,
      images_json, is_featured, is_on_sale,
      seo_meta_title, seo_meta_description, seo_keywords,
    } = req.body;

    const slug = generateSlug(title);

    const tour = await Tour.create({
      title,
      slug,
      description,
      short_description,
      category_id,
      location_city,
      location_country,
      base_price,
      sale_price,
      duration_hours,
      duration_text,
      max_participants,
      highlights,
      included,
      excluded,
      itinerary,
      faq,
      images_json: images_json || [],
      is_featured,
      is_on_sale,
      seo_meta_title,
      seo_meta_description,
      seo_keywords,
    });

    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update tour (admin only)
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    await tour.update(req.body);

    res.json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete tour (admin only)
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);

    if (!tour) {
      return res.status(404).json({ success: false, message: 'Tour not found' });
    }

    await tour.destroy();

    res.json({ success: true, message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

### 5. Authentication Middleware (middleware/authMiddleware.js)

```javascript
const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};
```

---

### 6. Tours Routes (routes/tours.js)

```javascript
const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');
const { authenticateToken, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', toursController.getAllTours);
router.get('/:slug', toursController.getTourBySlug);

// Admin routes (protected)
router.post('/', authenticateToken, adminOnly, toursController.createTour);
router.put('/:id', authenticateToken, adminOnly, toursController.updateTour);
router.delete('/:id', authenticateToken, adminOnly, toursController.deleteTour);

module.exports = router;
```

---

## PART 2: FRONTEND SETUP & KEY COMPONENTS

### 1. Main App Component (src/App.jsx)

```jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public Pages
import Home from './pages/Home';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import DealsPage from './pages/DealsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import SearchResultsPage from './pages/SearchResultsPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTours from './pages/admin/AdminTours';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBlog from './pages/admin/AdminBlog';
import AdminContent from './pages/admin/AdminContent';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Admin routes without navbar/footer */}
            <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Public routes with navbar/footer */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/tours/:slug" element={<TourDetailPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

// Layout component with Navbar and Footer
function Layout() {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/tours/:slug" element={<TourDetailPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
```

---

### 2. Navbar Component (src/components/common/Navbar.jsx)

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, User } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-teal-600">
          TourHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-teal-600">
            Home
          </Link>
          <Link to="/tours" className="text-gray-700 hover:text-teal-600">
            Tours
          </Link>
          <Link to="/deals" className="text-gray-700 hover:text-teal-600">
            Deals
          </Link>
          <Link to="/blog" className="text-gray-700 hover:text-teal-600">
            Blog
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-teal-600">
            Contact
          </Link>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search tours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-600"
            />
            <button type="submit" className="absolute right-2 top-2">
              <Search size={20} className="text-gray-600" />
            </button>
          </form>

          {/* Auth Links */}
          {user ? (
            <div className="flex items-center space-x-4">
              {user.is_admin && (
                <Link to="/admin" className="text-orange-600 font-semibold">
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center space-x-2">
                <User size={20} />
                <span className="text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/auth/login"
                className="text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-50 px-4 py-4 space-y-4">
          <Link to="/" className="block text-gray-700 hover:text-teal-600">
            Home
          </Link>
          <Link to="/tours" className="block text-gray-700 hover:text-teal-600">
            Tours
          </Link>
          <Link to="/deals" className="block text-gray-700 hover:text-teal-600">
            Deals
          </Link>
          <Link to="/blog" className="block text-gray-700 hover:text-teal-600">
            Blog
          </Link>
          <Link to="/contact" className="block text-gray-700 hover:text-teal-600">
            Contact
          </Link>

          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg"
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-r-lg"
            >
              Search
            </button>
          </form>

          {user ? (
            <>
              <div className="text-gray-700">{user.name}</div>
              {user.is_admin && (
                <Link to="/admin" className="block text-orange-600 font-semibold">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="block text-center text-gray-700 border border-gray-300 px-4 py-2 rounded-lg">
                Login
              </Link>
              <Link to="/auth/register" className="block text-center bg-teal-600 text-white px-4 py-2 rounded-lg">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
```

---

### 3. Tours Service (src/services/toursService.js)

```javascript
import api from './api';

export const toursService = {
  getAllTours: (params) => {
    return api.get('/tours', { params });
  },

  getTourBySlug: (slug) => {
    return api.get(`/tours/${slug}`);
  },

  createTour: (data) => {
    return api.post('/admin/tours', data);
  },

  updateTour: (id, data) => {
    return api.put(`/admin/tours/${id}`, data);
  },

  deleteTour: (id) => {
    return api.delete(`/admin/tours/${id}`);
  },

  getTourForEdit: (id) => {
    return api.get(`/admin/tours/${id}`);
  },
};
```

---

### 4. Tour Card Component (src/components/tours/TourCard.jsx)

```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign } from 'lucide-react';

export default function TourCard({ tour }) {
  const discountPercent = tour.sale_price
    ? Math.round(((tour.base_price - tour.sale_price) / tour.base_price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        {tour.images_json && tour.images_json.length > 0 && (
          <img
            src={tour.images_json[0].url}
            alt={tour.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform"
          />
        )}
        {tour.is_on_sale && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Sale {discountPercent}% OFF
          </div>
        )}
        {tour.is_featured && (
          <div className="absolute top-2 left-2 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {tour.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPin size={16} className="mr-2" />
          <span>{tour.location_city}, {tour.location_country}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <Clock size={16} className="mr-2" />
          <span>{tour.duration_text || `${tour.duration_hours} hours`}</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          {tour.sale_price ? (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-teal-600">
                ${tour.sale_price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${tour.base_price}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-lg font-bold text-teal-600">
              From ${tour.base_price}
            </div>
          )}
        </div>

        {/* Book Button */}
        <Link
          to={`/tours/${tour.slug}`}
          className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition text-center font-semibold"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
```

---

### 5. Tours Page Component (src/pages/ToursPage.jsx)

```jsx
import React, { useState, useEffect } from 'react';
import { toursService } from '../services/toursService';
import TourCard from '../components/tours/TourCard';
import TourFilters from '../components/tours/TourFilters';
import { toast } from 'react-toastify';

export default function ToursPage() {
  const [tours, setTours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 10000,
    location: '',
    onSale: false,
    page: 1,
    limit: 12,
    sort: 'newest',
  });

  // Fetch tours
  useEffect(() => {
    fetchTours();
  }, [filters]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const response = await toursService.getAllTours(filters);
      setTours(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load tours');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Our Tours
          </h1>
          <p className="text-gray-600">
            Discover amazing experiences and unforgettable adventures
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <TourFilters
              categories={categories}
              onFilterChange={handleFilterChange}
              filters={filters}
            />
          </div>

          {/* Tours Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
              </div>
            ) : tours.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handleFilterChange({ page })}
                        className={`px-4 py-2 rounded-lg ${
                          pagination.page === page
                            ? 'bg-teal-600 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No tours found. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## PART 3: ADMIN SETUP

### Admin Dashboard Component (src/pages/admin/AdminDashboard.jsx)

```jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, BookOpen, DollarSign, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      setStats(response.data.data);
      setRecentBookings(response.data.data.recentBookings || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Tours"
            value={stats.totalTours || 0}
            icon={<BookOpen className="w-8 h-8" />}
            color="blue"
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings || 0}
            icon={<Calendar className="w-8 h-8" />}
            color="green"
          />
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings || 0}
            icon={<Users className="w-8 h-8" />}
            color="yellow"
          />
          <StatCard
            title="Total Revenue"
            value={`$${(stats.totalRevenue || 0).toFixed(2)}`}
            icon={<DollarSign className="w-8 h-8" />}
            color="purple"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bookings Chart */}
          {stats.bookingsOverTime && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bookings Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.bookingsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#32B8C6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tours by Category */}
          {stats.toursByCategory && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tours by Category
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.toursByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#32B8C6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tour
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.booking_reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.customer_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.tour_title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(booking.booking_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
```

---

## ENVIRONMENT VARIABLES

### Backend (.env)
```
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tourism_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
SMTP_FROM=noreply@tourhub.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TourHub
```

---

**This guide provides complete code structure and examples. Use these as templates for your actual implementation!**
