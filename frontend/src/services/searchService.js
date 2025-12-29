import api from './api';

export const searchService = {
  search: async (query, type = 'all', page = 1) => {
    const response = await api.get('/search', {
      params: { q: query, type, page }
    });
    return response.data;
  },
};
