import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { ROLES, canAccessModule } from '../utils/roles';
import {
  LayoutDashboard, Building2, Users, FolderKanban,
  Layers, UserPlus, FileCheck, FileText,
  Receipt, BarChart3, LogOut, User, Wallet
} from 'lucide-react';

const menuItems = [
  { key: 'dashboard', name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { key: 'employes', name: 'Employés', path: '/employes', icon: <Users size={20} /> },
  { key: 'organismes', name: 'Organismes', path: '/organismes', icon: <Building2 size={20} /> },
  { key: 'projets', name: 'Projets', path: '/projets', icon: <FolderKanban size={20} /> },
  // Entrées distinctes pour éviter l'activation multiple sur /projets.
  { key: 'phases', name: 'Phases', path: '/phases', icon: <Layers size={20} /> },
  { key: 'affectations', name: 'Affectations', path: '/affectations', icon: <UserPlus size={20} /> },
  { key: 'livrables', name: 'Livrables', path: '/livrables', icon: <FileCheck size={20} /> },
  { key: 'documents', name: 'Documents', path: '/documents', icon: <FileText size={20} /> },
  { key: 'factures', name: 'Factures', path: '/factures', icon: <Receipt size={20} /> },
  { key: 'paiement', name: 'Paiement', path: '/paiement', icon: <Wallet size={20} /> },
  { key: 'reporting', name: 'Reporting', path: '/reporting', icon: <BarChart3 size={20} /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) return null;

  const displayRole = userRole || ROLES.INVITE;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-[#0f172a] to-slate-900 text-slate-400 min-h-screen flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.1)] border-r border-slate-800/50 z-20">
      <div className="p-8 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 tracking-tighter italic drop-shadow-md">PROJET-MANAGER</div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          if (!canAccessModule(displayRole, item.key)) return null;
          const isStrictActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end
              className={() =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                  isStrictActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                    : 'hover:bg-slate-800 hover:text-slate-200 hover:translate-x-1'
                }`
              }
            >
              {() => (
                <>
                  <div className={`${isStrictActive ? 'animate-bounce-slow' : ''}`}>{item.icon}</div>
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800/50 space-y-2 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-4 text-[10px] text-slate-500 uppercase font-bold tracking-widest">{displayRole}</div>
        <Link to="/profil" className="flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-slate-800 transition-all duration-300 hover:text-white group">
          <User size={18} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest">Mon Profil</span>
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 hover:-translate-y-1 transition-all duration-300 text-left group">
          <LogOut size={18} className="group-hover:-translate-x-1 group-hover:rotate-[-10deg] transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest">Quitter</span>
        </button>
      </div>
    </aside>
  );
}