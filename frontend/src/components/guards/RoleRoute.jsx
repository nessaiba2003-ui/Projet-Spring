import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RoleRoute({ allowedRoles }) {
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const currentRole = String(role || '').trim().toUpperCase();
  const acceptedRoles = (allowedRoles || []).map((r) => String(r || '').trim().toUpperCase());

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (acceptedRoles.length > 0 && !acceptedRoles.includes(currentRole)) {
    return <Navigate to="/denied" replace />;
  }

  return <Outlet />;
}



