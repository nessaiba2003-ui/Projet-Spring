import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { Page404, AccessDenied } from './pages/StatusPages';
import Profil from './pages/Profil';
import Login from './pages/Login';
import RoleRoute from './components/guards/RoleRoute';

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
import ReportingDashboard from './pages/Reporting/Dashboard';

const ModuleWrapper = ({ title }) => (
  <div className="bg-white p-20 rounded-[2.5rem] shadow-sm border border-slate-100 text-center animate-in fade-in duration-500">
    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Gestion des {title}</h2>
    <div className="mt-6 h-1.5 w-16 bg-blue-600 mx-auto rounded-full"></div>
    <p className="text-slate-400 mt-8 font-medium italic text-lg text-opacity-50">Interface du module métier en cours de chargement...</p>
  </div>
);

function App() {
  return (
    <Routes>
      {/* 1. Page de Login (Indépendante du MainLayout) */}
      <Route path="/login" element={<Login />} />

      {/* 2. Routes protégées avec Sidebar (MainLayout) */}
      <Route path="/" element={<MainLayout />}>

        {/* ACCÈS LIBRE CONNECTÉ */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profil" element={<Profil />} />

        {/* PROTECTION : ADMIN (Employés) */}
        <Route path="employes" element={<RoleRoute allowedRoles={['ADMINISTRATEUR']} />}>
          <Route index element={<EmployeList />} />
          <Route path="nouveau" element={<EmployeForm />} />
          <Route path="edit/:id" element={<EmployeForm />} />
          <Route path=":id" element={<EmployeDetail />} />
          <Route path="disponibilite" element={<Disponibilite />} />
          <Route path=":id/historique" element={<EmployeHistory />} />
        </Route>

        {/* PROTECTION : SECRETAIRE & ADMIN (Organismes) */}
        <Route path="organismes" element={<RoleRoute allowedRoles={['ADMINISTRATEUR', 'SECRETAIRE']} />}>
          <Route index element={<OrganismeList />} />
          <Route path="nouveau" element={<OrganismeForm />} />
          <Route path="edit/:id" element={<OrganismeForm />} />
          <Route path=":id" element={<OrganismeDetail />} />
        </Route>

        {/* PROTECTION : CHEF PROJET & ADMIN (Phases, Affectations, Livrables) */}
        <Route element={<RoleRoute allowedRoles={['ADMINISTRATEUR', 'CHEF_PROJET']} />}>
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
        <Route path="factures" element={<RoleRoute allowedRoles={['ADMINISTRATEUR', 'COMPTABLE']} />}>
          <Route index element={<FactureList />} />
          <Route path="edit/:id" element={<FactureForm />} />
          <Route path="phases/:phaseId/factures/nouveau" element={<FactureForm />} />
        </Route>

        {/* PROTECTION : DIRECTEUR & ADMIN (Reporting) */}
        <Route path="reporting" element={<RoleRoute allowedRoles={['ADMINISTRATEUR', 'DIRECTEUR']} />}>
          <Route index element={<ReportingDashboard />} />
          <Route path="non-facturees" element={<ReportingDashboard view="non-facturees" />} />
          <Route path="payees" element={<ReportingDashboard view="payees" />} />
          <Route path="clotures" element={<ReportingDashboard view="clotures" />} />
        </Route>

        {/* PROJETS & DOCUMENTS */}
        <Route element={<RoleRoute allowedRoles={['ADMINISTRATEUR', 'SECRETAIRE', 'CHEF_PROJET', 'DIRECTEUR']} />}>
          <Route path="projets">
            <Route index element={<ProjetList />} />
            <Route path="nouveau" element={<ProjetForm />} />
            <Route path="edit/:id" element={<ProjetForm />} />
            <Route path="resume/:id" element={<ProjetResume />} />
            <Route path=":id" element={<ProjetResume />} />
            <Route path=":projetId/phases" element={<PhaseList />} />
            <Route path=":projetId/phases/nouveau" element={<PhaseForm />} />
            <Route path=":projetId/documents" element={<DocumentList />} />
            <Route path=":projetId/documents/nouveau" element={<DocumentForm />} />
          </Route>
          <Route path="documents" element={<DocumentList />} />
        </Route>

        <Route path="denied" element={<AccessDenied />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default App;
