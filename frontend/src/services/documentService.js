import api from './api/axiosConfig';

export const documentService = {
  // Liste des documents d'un projet spécifique
  getByProjet: (projetId) => api.get(`/projets/${projetId}/documents`),

  // Ajout avec Upload (Multipart)
  create: (projetId, formData) => api.post(`/projets/${projetId}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Téléchargement sécurisé
  download: (id) => api.get(`/documents/${id}/download`, {
    responseType: 'blob'
  }),

  delete: (id) => api.delete(`/documents/${id}`)
};