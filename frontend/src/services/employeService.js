import api from './api/axiosConfig';

export const employeService = {
  getAll: () => api.get('/employes'),
  getById: (id) => api.get(`/employes/${id}`),
  create: (data) => api.post('/employes', data),
  update: (id, data) => api.put(`/employes/${id}`, data),
  delete: (id) => api.delete(`/employes/${id}`),
  getDisponibles: (debut, fin) => api.get(`/employes/disponibles?dateDebut=${debut}&dateFin=${fin}`)
};