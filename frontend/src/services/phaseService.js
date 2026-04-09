import api from './api/axiosConfig';

export const phaseService = {
  getByProjet: (projetId) => api.get(`/projets/${projetId}/phases`),
  create: (projetId, data) => api.post(`/projets/${projetId}/phases`, data),
  getById: (id) => api.get(`/phases/${id}`),
  update: (id, data) => api.put(`/phases/${id}`, data),
  updateRealisation: (id, data) => api.patch(`/phases/${id}/realisation`, data),
  updateFacturation: (id, data) => api.patch(`/phases/${id}/facturation`, data),
  updatePaiement: (id, data) => api.patch(`/phases/${id}/paiement`, data),
  delete: (id) => api.delete(`/phases/${id}`)
};