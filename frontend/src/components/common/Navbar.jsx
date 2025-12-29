import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, Search, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-500">TourHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Home
            </Link>
            <Link to="/tours" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Tours
            </Link>
            <Link to="/deals" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Deals
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
              Contact
            </Link>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search size={18} className="text-gray-400" />
              </button>
            </form>

            {/* Auth Links */}
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-secondary-500 font-semibold hover:text-secondary-600 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-2 text-gray-700">
                  <User size={20} />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-gray-700 p-2"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-primary-500 font-medium py-2"
            >
              Home
            </Link>
            <Link
              to="/tours"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-primary-500 font-medium py-2"
            >
              Tours
            </Link>
            <Link
              to="/deals"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-primary-500 font-medium py-2"
            >
              Deals
            </Link>
            <Link
              to="/blog"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-primary-500 font-medium py-2"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-primary-500 font-medium py-2"
            >
              Contact
            </Link>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
              >
                <Search size={20} />
              </button>
            </form>

            {user ? (
              <>
                <div className="text-gray-700 font-medium py-2">{user.name}</div>
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
                  className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </nav>
  );
}
