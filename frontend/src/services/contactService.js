import api from './api';

export const contactService = {
  submitContact: async (data) => {
    const response = await api.post('/contact', data);
    return response.data;
  },

  // Admin methods
  getAllContacts: async (params = {}) => {
    const response = await api.get('/admin/contacts', { params });
    return response.data;
  },

  getContactById: async (id) => {
    const response = await api.get(`/admin/contacts/${id}`);
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/admin/contacts/${id}/read`);
    return response.data;
  },

  replyToContact: async (id, reply) => {
    const response = await api.post(`/admin/contacts/${id}/reply`, { reply });
    return response.data;
  },

  deleteContact: async (id) => {
    const response = await api.delete(`/admin/contacts/${id}`);
    return response.data;
  },
};
