import api from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // User management
  getAdminUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  createAdminUser: async (data) => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  updateAdminUser: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  deleteAdminUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};
