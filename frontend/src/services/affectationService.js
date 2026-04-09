import api from './api/axiosConfig';

export const affectationService = {
  getAll: () => api.get('/affectations'),
  // 1. Liste des employés affectés à une phase
  getByPhase: (phaseId) => api.get(`/phases/${phaseId}/employes`),

  // 2. Formulaire d'ajout
  // On envoie un objet { employeId, phaseId, dateDebut, dateFin, chargeHoraire }
  create: (data) => api.post('/affectations', data),

  // 3. Modification
  // Utilise la clé composée phaseId/employeId pour cibler l'affectation
  update: (phaseId, employeId, data) => api.put(`/affectations/${phaseId}/${employeId}`, data),

  // 4. Historique des phases d'un employé
  getHistoryByEmploye: (employeId) => api.get(`/employes/${employeId}/phases`),

  // 5. Suppression avec confirmation
  delete: (phaseId, employeId) => api.delete(`/affectations/${phaseId}/${employeId}`)
};
