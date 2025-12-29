import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { bookingsService } from '../../services/bookingsService';
import { formatPrice } from '../../utils/formatters';
import { Calendar, Users, Phone, Mail, User } from 'lucide-react';

export default function BookingForm({ tour, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [bookingDate, setBookingDate] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [numberOfChildren, setNumberOfChildren] = useState(0);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const pricePerPerson = tour.sale_price || tour.base_price;
  const childPrice = pricePerPerson * 0.5;
  const totalPrice = (pricePerPerson * numberOfPeople) + (childPrice * numberOfChildren);

  const onSubmit = async (data) => {
    if (!bookingDate) {
      toast.error('Please select a booking date');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        tour_id: tour.id,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        booking_date: bookingDate.toISOString().split('T')[0],
        number_of_people: numberOfPeople,
        number_of_children: numberOfChildren,
        special_requests: data.special_requests,
      };

      const response = await bookingsService.createBooking(bookingData);
      toast.success('Booking submitted successfully!');
      reset();
      setBookingDate(null);
      setNumberOfPeople(1);
      setNumberOfChildren(0);
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Book This Tour</h3>

      {/* Price Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Price per person:</span>
          <span className="font-semibold">{formatPrice(pricePerPerson)}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Children (50% off):</span>
          <span className="font-semibold">{formatPrice(childPrice)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-primary-500">{formatPrice(totalPrice)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Date Picker */}
        <div>
          <label className="label flex items-center gap-2">
            <Calendar size={16} />
            Select Date *
          </label>
          <DatePicker
            selected={bookingDate}
            onChange={(date) => setBookingDate(date)}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            placeholderText="Choose a date"
            className="w-full input"
            required
          />
        </div>

        {/* Number of People */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label flex items-center gap-2">
              <Users size={16} />
              Adults *
            </label>
            <select
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
              className="input"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Children</label>
            <select
              value={numberOfChildren}
              onChange={(e) => setNumberOfChildren(parseInt(e.target.value))}
              className="input"
            >
              {[0, 1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="label flex items-center gap-2">
            <User size={16} />
            Full Name *
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="Your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="label flex items-center gap-2">
            <Mail size={16} />
            Email *
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="label flex items-center gap-2">
            <Phone size={16} />
            Phone *
          </label>
          <input
            {...register('phone', { required: 'Phone is required' })}
            type="tel"
            className={`input ${errors.phone ? 'input-error' : ''}`}
            placeholder="+971 50 123 4567"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Special Requests */}
        <div>
          <label className="label">Special Requests</label>
          <textarea
            {...register('special_requests')}
            rows="3"
            className="input"
            placeholder="Any special requirements or requests..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}
