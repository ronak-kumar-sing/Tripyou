import api from './api';

export const categoriesService = {
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },

  // Admin methods
  getAllCategoriesAdmin: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (data) => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },

  updateCategory: async (id, data) => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};
