import { Navigate, Outlet } from 'react-router-dom';

export default function RoleRoute({ allowedRoles }) {
  const token = localStorage.getItem('token');
  const rawRole = String(localStorage.getItem('role') || '').toUpperCase();

  // Normalisation robuste du rôle de l'utilisateur
  const userRole = rawRole.replace(/ROLE_/gi, '').trim().replace('_DE_', '_');

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && allowedRoles.length > 0 && userRole !== 'ADMINISTRATEUR') {
    const normalizedAllowed = allowedRoles.map(r => String(r).toUpperCase().replace(/ROLE_/gi, '').trim().replace('_DE_', '_'));
    if (!normalizedAllowed.includes(userRole)) {
      return <Navigate to="/denied" replace />;
    }
  }

  return <Outlet />;
}