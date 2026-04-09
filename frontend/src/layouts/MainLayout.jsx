import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';

export default function MainLayout() {
  const role = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Système de Suivi de Projets</div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-700 leading-none">{role || 'invité'}</p>
              <p className="text-[9px] text-green-500 font-bold uppercase mt-1 tracking-tighter">Session Active</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400">
              {isAuthenticated ? (role || 'i').slice(0, 2).toUpperCase() : '--'}
            </div>
          </div>
        </header>

        <main className="p-10 flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <footer className="p-4 bg-white border-t border-slate-100 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          © 2026 - Direction des Systèmes d'Information
        </footer>
      </div>
    </div>
  );
}