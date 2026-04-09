import api from './api/axiosConfig';

export const dashboardService = {
  // API dédiée dashboard (globale pour tous les rôles autorisés)
  getOverview: async () => {
    try {
      return await api.get('/dashboard/overview');
    } catch (error) {
      return { totalProjets: 0, totalPhases: 0, totalEmployes: 0 };
    }
  },

  getRecentProjects: async () => {
    try {
      const rows = await api.get('/dashboard/recent-projects');
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      return [];
    }
  },
};
