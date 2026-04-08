import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Settings } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Simple */}
      <aside className="w-64 bg-slate-800 text-white p-6 shadow-xl">
        <h1 className="text-xl font-bold mb-10 border-b border-slate-700 pb-4">Suivi Projets</h1>
        <nav className="space-y-4">
          <Link to="/" className="flex items-center gap-3 hover:bg-slate-700 p-2 rounded">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/projets" className="flex items-center gap-3 hover:bg-slate-700 p-2 rounded">
            <FolderKanban size={20} /> Projets
          </Link>
        </nav>
      </aside>

      {/* Zone de contenu */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm p-4 text-right">
          <span className="text-gray-600">Session : Administrateur</span>
        </header>
        <main className="p-8">
          <Outlet /> {/* Les pages s'afficheront ici */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
