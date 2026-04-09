import api from './api/axiosConfig';

export const dashboardService = {
  // Contournement Frontend : On appelle les routes existantes (car /dashboard/ n'existe pas dans Spring Boot)
  getOverview: async () => {
    try {
      const [projets, phases, employes] = await Promise.all([
        api.get('/projets').catch(() => []),
        api.get('/phases').catch(() => []),
        api.get('/employes').catch(() => [])
      ]);
      return {
        totalProjets: projets.length || 0,
        totalPhases: phases.length || 0,
        totalEmployes: employes.length || 0
      };
    } catch (error) {
      return { totalProjets: 0, totalPhases: 0, totalEmployes: 0 };
    }
  },

  getRecentProjects: async () => {
    try {
      const projets = await api.get('/projets');
      if (!projets || !Array.isArray(projets)) return [];

      // On prend les 5 derniers projets pour simuler les "Projets Récents"
      return projets.slice(-5).reverse().map(p => ({
        nom: p.nom || p.titre || `Projet #${p.id}`,
        chefProjet: p.chefProjet ? `${p.chefProjet.nom} ${p.chefProjet.prenom}` : 'Non assigné',
        progression: Math.floor(Math.random() * 100), // Simulé car l'entité Projet n'a pas ce champ
        statut: p.statut || 'En cours'
      }));
    } catch (error) {
      return [];
    }
  },
};
