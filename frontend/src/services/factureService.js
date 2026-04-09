import api from './api/axiosConfig';

export const factureService = {
  getAll: () => api.get('/factures'),
  getById: (id) => api.get(`/factures/${id}`),

  // Création liée à une phase
  createFromPhase: (phaseId, data) => api.post(`/phases/${phaseId}/facture`, data),

  update: (id, data) => api.put(`/factures/${id}`, data),

  delete: (id) => api.delete(`/factures/${id}`),
  // Action métier : Marquer comme payée
  markAsPaid: (id) => api.patch(`/factures/${id}/pay`)
};