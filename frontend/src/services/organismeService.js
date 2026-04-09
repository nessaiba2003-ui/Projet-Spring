import api from './api/axiosConfig';

export const organismeService = {
  getAll: () => api.get('/organismes'),
  getById: (id) => api.get(`/organismes/${id}`),
  create: (data) => api.post('/organismes', data), // DTO de création
  update: (id, data) => api.put(`/organismes/${id}`, data),
  delete: (id) => api.delete(`/organismes/${id}`),
  search: (params) => api.get('/organismes/search', { params }) // Recherche par nom, code, contact
};