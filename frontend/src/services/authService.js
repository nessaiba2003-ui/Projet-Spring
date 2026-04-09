import api from './api/axiosConfig';

export const authService = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  me: async () => {
    return api.get('/auth/me');
  },
  register: (userData) => api.post('/auth/register', userData),
  logout: () => Promise.resolve(),
};
