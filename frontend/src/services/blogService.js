import api from './api';

export const blogService = {
  getAllPosts: async (params = {}) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },

  getBlogPosts: async (params = {}) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },

  getPostBySlug: async (slug) => {
    const response = await api.get(`/blog/${slug}`);
    return response.data;
  },

  incrementViews: async (slug) => {
    const response = await api.post(`/blog/${slug}/views`);
    return response.data;
  },

  getRelatedPosts: async (slug) => {
    const response = await api.get(`/blog/${slug}/related`);
    return response.data;
  },

  // Admin methods
  getAllPostsAdmin: async (params = {}) => {
    const response = await api.get('/admin/blog', { params });
    return response.data;
  },

  getPostForEdit: async (id) => {
    const response = await api.get(`/admin/blog/${id}`);
    return response.data;
  },

  createPost: async (data) => {
    const response = await api.post('/admin/blog', data);
    return response.data;
  },

  updatePost: async (id, data) => {
    const response = await api.put(`/admin/blog/${id}`, data);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/admin/blog/${id}`);
    return response.data;
  },

  // Aliases for consistency
  createBlogPost: async (data) => {
    const response = await api.post('/admin/blog', data);
    return response.data;
  },

  updateBlogPost: async (id, data) => {
    const response = await api.put(`/admin/blog/${id}`, data);
    return response.data;
  },

  deleteBlogPost: async (id) => {
    const response = await api.delete(`/admin/blog/${id}`);
    return response.data;
  },
};
