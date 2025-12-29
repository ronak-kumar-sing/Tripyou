import api from './api';

export const bookingsService = {
  createBooking: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getBookingByReference: async (reference) => {
    const response = await api.get(`/bookings/${reference}`);
    return response.data;
  },

  // Admin methods
  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', { params });
    return response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/admin/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id, data) => {
    const response = await api.put(`/admin/bookings/${id}`, data);
    return response.data;
  },

  deleteBooking: async (id) => {
    const response = await api.delete(`/admin/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id, status) => {
    const response = await api.put(`/admin/bookings/${id}`, { status });
    return response.data;
  },

  sendConfirmationEmail: async (id) => {
    const response = await api.post(`/admin/bookings/${id}/send-email`);
    return response.data;
  },
};
