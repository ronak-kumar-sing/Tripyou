import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/tours', label: 'Tours' },
    { to: '/deals', label: 'Deals' },
    { to: '/blog', label: 'Blog' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-blue-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              TourHub
            </motion.span>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles size={20} className="text-primary-500" />
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <motion.div key={link.to} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  to={link.to}
                  className={`text-gray-700 hover:text-primary-500 font-medium transition-colors relative ${
                    location.pathname === link.to ? 'text-primary-500' : ''
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-blue-600"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              </motion.div>
            ))}

            {/* Search Form */}
            <motion.form 
              onSubmit={handleSearch} 
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48 transition-all focus:w-56"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search size={18} className="text-gray-400 hover:text-primary-500 transition-colors" />
              </button>
            </motion.form>

            {/* Auth Links */}
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to="/admin"
                      className="text-secondary-500 font-semibold hover:text-secondary-600 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  </motion.div>
                )}
                <div className="flex items-center space-x-2 text-gray-700 bg-gray-100 px-3 py-2 rounded-xl">
                  <User size={18} />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all font-medium shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-700 p-2"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={`block text-gray-700 hover:text-primary-500 font-medium py-2 ${
                      location.pathname === link.to ? 'text-primary-500 font-semibold' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-primary-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-primary-600 hover:to-blue-700"
                >
                  <Search size={20} />
                </button>
              </form>

              {user ? (
                <>
                  <div className="text-gray-700 font-medium py-2 bg-gray-100 px-4 rounded-xl flex items-center gap-2">
                    <User size={18} />
                    {user.name}
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block text-secondary-500 font-semibold py-2"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl hover:from-red-600 hover:to-pink-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
