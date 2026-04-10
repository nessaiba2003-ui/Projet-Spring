import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from './layouts/MainLayout';
import { Page404, AccessDenied } from './pages/StatusPages';
import Profil from './pages/Profil';
import Login from './pages/Login';
import RoleRoute from './components/guards/RoleRoute';
import { authService } from './services/authService';
import { logout, syncProfileSuccess } from './store/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './utils/roles';

// Imports des composants
import Dashboard from './pages/Dashboard';
import OrganismeList from './pages/Organismes/OrganismeList';
import OrganismeForm from './pages/Organismes/OrganismeForm';
import OrganismeDetail from './pages/Organismes/OrganismeDetail';
import EmployeList from './pages/Employes/EmployeList';
import EmployeForm from './pages/Employes/EmployeForm';
import EmployeDetail from './pages/Employes/EmployeDetail';
import Disponibilite from './pages/Employes/Disponibilite';
import ProjetList from './pages/Projets/ProjetList';
import ProjetForm from './pages/Projets/ProjetForm';
import ProjetResume from './pages/Projets/ProjetResume';
import PhaseList from './pages/Phases/PhaseList';
import PhaseForm from './pages/Phases/PhaseForm';
import PhaseDetail from './pages/Phases/PhaseDetail';
import AffectationModule from './pages/Affectations/AffectationModule';
import EmployeHistory from './pages/Affectations/EmployeHistory';
import LivrableList from './pages/Livrables/LivrableList';
import LivrableForm from './pages/Livrables/LivrableForm';
import DocumentList from './pages/Documents/DocumentList';
import DocumentForm from './pages/Documents/DocumentForm';
import FactureList from './pages/Factures/FactureList';
import FactureForm from './pages/Factures/FactureForm';
import FactureDetail from './pages/Factures/FactureDetail';
import PaymentList from './pages/Factures/PaymentList';
import ReportingDashboard from './pages/Reporting/Dashboard';

const ALL_APP_ROLES = [
  ROLES.ADMIN,
  ROLES.SECRETAIRE,
  ROLES.DIRECTEUR,
  ROLES.CHEF_PROJET,
  ROLES.COMPTABLE,
];

const resolveRole = (profile) => {
  const raw = profile?.role || profile?.profil?.libelle || '';
  if (!raw) return null;
  const cleaned = String(raw).trim().toUpperCase();
  return cleaned.startsWith('ROLE_') ? cleaned : `ROLE_${cleaned}`;
};

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const syncMe = async () => {
      if (!token) return;
      try {
        const profile = await authService.me();
        const resolvedRole = resolveRole(profile);
        dispatch(
          syncProfileSuccess({
            username: profile.login || profile.username,
            role: resolvedRole,
            user: {
              id: profile.id,
              nom: profile.nom,
              prenom: profile.prenom,
              email: profile.email,
              username: profile.login || profile.username,
              role: resolvedRole,
            },
          })
        );
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        dispatch(logout());
      }
    };

    syncMe();
  }, [token, dispatch]);

  return (
    <Routes>
      {/* 1. Page de Login (Indépendante du MainLayout) */}
      <Route path="/login" element={<Login />} />

      {/* 2. Routes protégées avec Sidebar (MainLayout) */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>

        {/* DASHBOARD : accessible aux 5 profils */}
        <Route element={<RoleRoute allowedRoles={ALL_APP_ROLES} />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="profil" element={<Profil />} />

        {/* PROTECTION : ADMIN (Employés) */}
        <Route path="employes" element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route index element={<EmployeList />} />
          <Route path="nouveau" element={<EmployeForm />} />
          <Route path="edit/:id" element={<EmployeForm />} />
          <Route path=":id" element={<EmployeDetail />} />
          <Route path="disponibilite" element={<Disponibilite />} />
          <Route path=":id/historique" element={<EmployeHistory />} />
        </Route>

        {/* PROTECTION : SECRETAIRE & ADMIN (Organismes) */}
        <Route path="organismes" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SECRETAIRE]} />}>
          <Route index element={<OrganismeList />} />
          <Route path="nouveau" element={<OrganismeForm />} />
          <Route path="edit/:id" element={<OrganismeForm />} />
          <Route path=":id" element={<OrganismeDetail />} />
        </Route>

        {/* PROTECTION : CHEF PROJET, SECRETAIRE & ADMIN (Phases, Affectations, Livrables) */}
        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.CHEF_PROJET, ROLES.SECRETAIRE]} />}>
          <Route path="projets/phases" element={<Navigate to="/phases" replace />} />
          <Route path="projets/affectations" element={<Navigate to="/affectations" replace />} />
          <Route path="projets/livrables" element={<Navigate to="/livrables" replace />} />
          <Route path="phases">
            <Route index element={<PhaseList />} />
            <Route path=":id" element={<PhaseDetail />} />
            <Route path="edit/:id" element={<PhaseForm />} />
            <Route path=":phaseId/affectations" element={<AffectationModule />} />
            <Route path=":phaseId/livrables" element={<LivrableList />} />
            <Route path=":phaseId/livrables/nouveau" element={<LivrableForm />} />
          </Route>
          <Route path="affectations" element={<AffectationModule />} />
          <Route path="livrables" element={<LivrableList />} />
          <Route path="livrables/nouveau" element={<LivrableForm />} />
          <Route path="livrables/edit/:id" element={<LivrableForm />} />
        </Route>

        {/* PROTECTION : COMPTABLE & ADMIN (Factures) */}
        <Route path="factures" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.COMPTABLE]} />}>
          <Route index element={<FactureList />} />
          <Route path=":id" element={<FactureDetail />} />
          <Route path="edit/:id" element={<FactureForm />} />
          <Route path="phases/:phaseId/factures/nouveau" element={<FactureForm />} />
        </Route>

        <Route path="paiement" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.COMPTABLE]} />}>
          <Route index element={<PaymentList />} />
        </Route>

        {/* PROTECTION : DIRECTEUR & ADMIN (Reporting) */}
        <Route path="reporting" element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.DIRECTEUR, ROLES.COMPTABLE]} />}>
          <Route index element={<ReportingDashboard />} />
          <Route path="non-facturees" element={<ReportingDashboard view="non-facturees" />} />
          <Route path="payees" element={<ReportingDashboard view="payees" />} />
          <Route path="clotures" element={<ReportingDashboard view="clotures" />} />
        </Route>

        {/* PROJETS & DOCUMENTS */}
        <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SECRETAIRE, ROLES.CHEF_PROJET, ROLES.DIRECTEUR]} />}>
          <Route path="projets/documents" element={<Navigate to="/documents" replace />} />
          <Route path="documents" element={<DocumentList />} />
          <Route path="projets">
            <Route index element={<ProjetList />} />
            <Route path="nouveau" element={<ProjetForm />} />
            <Route path="edit/:id" element={<ProjetForm />} />
            <Route path="resume/:id" element={<ProjetResume />} />
            <Route path=":id" element={<ProjetResume />} />
            <Route path=":projetId/phases" element={<PhaseList />} />
            <Route path=":projetId/phases/nouveau" element={<PhaseForm />} />
            <Route path=":projetId/affectations" element={<AffectationModule />} />
            <Route path=":projetId/documents" element={<DocumentList />} />
            <Route path=":projetId/documents/nouveau" element={<DocumentForm />} />
          </Route>
        </Route>

        <Route path="denied" element={<AccessDenied />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default App;
