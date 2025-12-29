import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import ToursPage from './pages/ToursPage';
import TourDetailPage from './pages/TourDetailPage';
import DealsPage from './pages/DealsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import ContactPage from './pages/ContactPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTours from './pages/admin/AdminTours';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBlog from './pages/admin/AdminBlog';
import AdminContacts from './pages/admin/AdminContacts';
import AdminContent from './pages/admin/AdminContent';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Layout with Navbar and Footer
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Hidden Admin Login - Access via /admin-login */}
          <Route path="/admin-login" element={<LoginPage />} />

          {/* Admin routes (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="tours" element={<AdminTours />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>

          {/* Public routes (with navbar/footer) */}
          <Route element={<PublicLayout />}>
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

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
