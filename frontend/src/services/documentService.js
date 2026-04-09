import api from './api/axiosConfig';

export const documentService = {
  // Liste des documents d'un projet spécifique
  getByProjet: (projetId) => api.get(`/projets/${projetId}/documents`),

  create: (projetId, data) => api.post(`/projets/${projetId}/documents`, data),

  // Téléchargement sécurisé
  download: (id) => api.get(`/documents/${id}/download`, {
    responseType: 'blob'
  }),

  delete: (id) => api.delete(`/documents/${id}`)
};