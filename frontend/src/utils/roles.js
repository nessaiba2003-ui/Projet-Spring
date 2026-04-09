export const ROLES = {
  ADMIN: 'ROLE_ADMINISTRATEUR',
  SECRETAIRE: 'ROLE_SECRETAIRE',
  DIRECTEUR: 'ROLE_DIRECTEUR',
  CHEF_PROJET: 'ROLE_CHEF_DE_PROJET',
  COMPTABLE: 'ROLE_COMPTABLE',
  INVITE: 'ROLE_INVITE',
};

const resolveRole = (role) => {
  const cleaned = String(role || '').trim().toUpperCase();
  if (!cleaned) return '';
  return cleaned.startsWith('ROLE_') ? cleaned : `ROLE_${cleaned}`;
};

export const canAccessModule = (role, moduleKey) => {
  const resolved = resolveRole(role);
  if (!resolved) return false;
  if (resolved === ROLES.ADMIN) return true;

  const byRole = {
    [ROLES.SECRETAIRE]: ['dashboard', 'organismes', 'projets'],
    [ROLES.DIRECTEUR]: ['dashboard', 'reporting'],
    [ROLES.CHEF_PROJET]: ['dashboard', 'projets', 'phases', 'affectations', 'livrables', 'documents'],
    [ROLES.COMPTABLE]: ['dashboard', 'factures', 'paiement', 'reporting'],
    [ROLES.INVITE]: ['dashboard'],
  };

  return (byRole[resolved] || []).includes(moduleKey);
};

export const canMutateModule = (role, moduleKey) => canAccessModule(role, moduleKey);
