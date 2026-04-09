import api from './api/axiosConfig';

export const projetService = {
  getAll: () => api.get('/projets'),
  getById: (id) => api.get(`/projets/${id}`),
  getResume: (id) => api.get(`/projets/${id}/resume`),
  create: (data) => api.post('/projets', data),
  update: (id, data) => api.put(`/projets/${id}`, data),
  delete: (id) => api.delete(`/projets/${id}`)
};