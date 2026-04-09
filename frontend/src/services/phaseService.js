import api from './api/axiosConfig';

export const phaseService = {
  getAll: () => api.get('/phases'),
  getByProjet: (projetId) => api.get(`/projets/${projetId}/phases`),
  create: (projetId, data) => api.post(`/projets/${projetId}/phases`, data),
  getById: (id) => api.get(`/phases/${id}`),
  update: (id, data) => api.put(`/phases/${id}`, data),
  updateRealisation: (id, etat) => api.patch(`/phases/${id}/realisation?etat=${etat}`),
  updateFacturation: (id, etat) => api.patch(`/phases/${id}/facturation?etat=${etat}`),
  updatePaiement: (id, etat) => api.patch(`/phases/${id}/paiement?etat=${etat}`),
  delete: (id) => api.delete(`/phases/${id}`)
};