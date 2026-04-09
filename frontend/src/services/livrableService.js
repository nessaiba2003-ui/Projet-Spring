import api from './api/axiosConfig';

export const livrableService = {
  getAll: () => api.get('/livrables'),
  // Liste des livrables d'une phase (Consigne : intégrés à la vue phase)
  getByPhase: (phaseId) => api.get(`/phases/${phaseId}/livrables`),

  // Ajout avec Upload éventuel (Consigne : upload de fichier)
  create: (phaseId, formData) => api.post(`/phases/${phaseId}/livrables`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Consultation et Modification
  getById: (id) => api.get(`/livrables/${id}`),
  update: (id, formData) => api.put(`/livrables/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Suppression
  delete: (id) => api.delete(`/livrables/${id}`)
};