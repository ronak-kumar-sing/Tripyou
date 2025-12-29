import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';
import { newsletterService } from '../../services/newsletterService';
import { toast } from 'react-toastify';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await newsletterService.subscribe(email);
      toast.success(response.message);
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Get Exclusive Deals</h3>
              <p className="text-primary-100 mt-1">Subscribe to our newsletter and get 20% off your first booking!</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 rounded-lg text-gray-900 w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : (
                  <>
                    Subscribe <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="text-2xl font-bold text-primary-400">TourHub</Link>
            <p className="text-gray-400 mt-4">
              Discover your next adventure with TourHub. We offer the best tours and experiences at unbeatable prices.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tours" className="text-gray-400 hover:text-primary-400 transition-colors">
                  All Tours
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Travel Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/admin-login" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Tour Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/tours?category=desert-safari" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Desert Safari
                </Link>
              </li>
              <li>
                <Link to="/tours?category=city-tours" className="text-gray-400 hover:text-primary-400 transition-colors">
                  City Tours
                </Link>
              </li>
              <li>
                <Link to="/tours?category=water-activities" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Water Activities
                </Link>
              </li>
              <li>
                <Link to="/tours?category=theme-parks" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Theme Parks
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary-400 flex-shrink-0 mt-1" />
                <span className="text-gray-400">123 Sheikh Zayed Road, Dubai, UAE</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary-400 flex-shrink-0" />
                <a href="tel:+97141234567" className="text-gray-400 hover:text-primary-400 transition-colors">
                  +971 4 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary-400 flex-shrink-0" />
                <a href="mailto:info@tourhub.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  info@tourhub.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} TourHub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
