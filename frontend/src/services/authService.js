import api from './api/axiosConfig';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    // TRÈS IMPORTANT : On stocke le rôle pour que la Sidebar le voie !
    if (response.data.role) {
      localStorage.setItem('role', response.data.role);
    }
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  }
};
