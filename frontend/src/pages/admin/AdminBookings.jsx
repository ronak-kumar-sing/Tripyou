import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { bookingsService } from '../../services/bookingsService';
import Loading from '../../components/common/Loading';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import { formatDate, formatPrice } from '../../utils/formatters';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsService.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await bookingsService.updateBookingStatus(id, status);
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    filter === 'all' ? true : booking.status === filter
  );

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Manage Bookings</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === status
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {status} ({bookings.filter(b => status === 'all' || b.status === status).length})
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Grid */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {booking.tour_id?.title || 'Tour'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{booking.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{booking.customer_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} />
                    <span>{booking.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{formatDate(booking.booking_date)}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {booking.number_of_people} adults
                    {booking.number_of_children > 0 && `, ${booking.number_of_children} children`}
                  </span>
                  <span className="font-semibold text-gray-900">
                    Total: {formatPrice(booking.total_price)}
                  </span>
                </div>
                {booking.special_requests && (
                  <p className="mt-2 text-sm text-gray-600 italic">
                    Note: {booking.special_requests}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm border-2 ${booking.status === 'confirmed' ? 'border-green-500 bg-green-50 text-green-700' :
                    booking.status === 'pending' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
                      'border-red-500 bg-red-50 text-red-700'
                    }`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className="text-xs text-gray-500 text-center">
                  {formatDate(booking.created_at, 'short')}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">No bookings found</p>
          </div>
        )}
      </div>
    </div>
  );
}
