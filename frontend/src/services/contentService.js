import api from './api';

export const contentService = {
  getAllContent: async () => {
    const response = await api.get('/content');
    return response.data;
  },

  getContentByKey: async (key) => {
    const response = await api.get(`/content/${key}`);
    return response.data;
  },

  getContentBySection: async (section) => {
    const response = await api.get(`/content/section/${section}`);
    return response.data;
  },

  // Admin methods
  getAllContentAdmin: async () => {
    const response = await api.get('/admin/content');
    return response.data;
  },

  updateContent: async (key, data) => {
    const response = await api.patch(`/admin/content/${key}`, data);
    return response.data;
  },

  updateSection: async (section, data) => {
    const response = await api.put(`/admin/content/section/${section}`, data);
    return response.data;
  },
};
