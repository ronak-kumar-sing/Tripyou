import api from './api';

export const toursService = {
  getAllTours: async (params = {}) => {
    const response = await api.get('/tours', { params });
    return response.data;
  },

  getTours: async (params = {}) => {
    const response = await api.get('/tours', { params });
    return response.data;
  },

  getTourBySlug: async (slug) => {
    const response = await api.get(`/tours/${slug}`);
    return response.data;
  },

  getFeaturedTours: async (limit = 9) => {
    const response = await api.get('/tours/featured', { params: { limit } });
    return response.data;
  },

  getOnSaleTours: async (params = {}) => {
    const response = await api.get('/tours/on-sale', { params });
    return response.data;
  },

  getDeals: async (params = {}) => {
    const response = await api.get('/tours/on-sale', { params });
    return response.data;
  },

  // Admin methods
  createTour: async (data) => {
    const response = await api.post('/admin/tours', data);
    return response.data;
  },

  updateTour: async (id, data) => {
    const response = await api.put(`/admin/tours/${id}`, data);
    return response.data;
  },

  deleteTour: async (id) => {
    const response = await api.delete(`/admin/tours/${id}`);
    return response.data;
  },

  getTourForEdit: async (id) => {
    const response = await api.get(`/admin/tours/${id}`);
    return response.data;
  },

  toggleSaleStatus: async (id) => {
    const response = await api.patch(`/admin/tours/${id}/sale-status`);
    return response.data;
  },
};
