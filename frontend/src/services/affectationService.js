import api from './api/axiosConfig';

export const affectationService = {
  getAll: () => api.get('/affectations'),
  // 1. Liste des employés affectés à une phase
  getByPhase: (phaseId) => api.get(`/phases/${phaseId}/employes`),

  // 2. Formulaire d'ajout
  // Backend: POST /phases/{phaseId}/employes/{employeId}
  create: ({ phaseId, employeId, dto }) => api.post(`/phases/${phaseId}/employes/${employeId}`, dto),

  // 3. Modification
  // Endpoint update non exposé actuellement côté backend
  update: (_phaseId, _employeId, _data) => Promise.resolve(null),

  // 4. Historique des phases d'un employé
  getHistoryByEmploye: (employeId) => api.get(`/employes/${employeId}/phases`),

  // 5. Suppression avec confirmation
  delete: (phaseId, employeId) => api.delete(`/phases/${phaseId}/employes/${employeId}`)
};
