import api from './api/axiosConfig';

export const reportingService = {
  // Pour les cartes (Stats globales)
  getGlobalStats: () => api.get('/reporting/stats'),

  // Pour les tableaux filtrables (Consignes du Prof)
  // On passe "params" pour les filtres : dateDebut, dateFin, projetId, chefId
  getPhasesNonFacturees: (params) => api.get('/reporting/phases/terminees-non-facturees', { params }),
  getPhasesFactureesNonPayees: (params) => api.get('/reporting/phases/facturees-non-payees', { params }),
  getPhasesPayees: (params) => api.get('/reporting/phases/payees', { params }),
  getProjetsEnCours: (params) => api.get('/reporting/projets/en-cours', { params }),
  getProjetsClotures: (params) => api.get('/reporting/projets/clotures', { params }),
};