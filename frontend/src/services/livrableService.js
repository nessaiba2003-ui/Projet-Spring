import api from './api/axiosConfig';

export const livrableService = {
  // Liste des livrables d'une phase (Consigne : intégrés à la vue phase)
  getByPhase: (phaseId) => api.get(`/phases/${phaseId}/livrables`),

  create: (phaseId, data) => api.post(`/phases/${phaseId}/livrables`, data),

  // Consultation et Modification
  getById: (id) => api.get(`/livrables/${id}`),
  update: (id, data) => api.put(`/livrables/${id}`, data),

  // Suppression
  delete: (id) => api.delete(`/livrables/${id}`)
};