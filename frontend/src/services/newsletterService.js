import api from './api';

export const newsletterService = {
  subscribe: async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  unsubscribe: async (email) => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  },
};
