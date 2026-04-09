import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import DataTable from '../components/DataTable';
import Badge from '../components/Badge';
import { Layout, Briefcase, CheckSquare, Users } from 'lucide-react';

export default function Dashboard() {
  const [overview, setOverview] = useState({ totalProjets: 0, totalPhases: 0, totalEmployes: 0 });
  const [recentData, setRecentData] = useState([]);

  useEffect(() => {
    // On charge les données d'accueil (Style : .then(setData))
    dashboardService.getOverview().then(setOverview).catch(console.error);
    dashboardService.getRecentProjects().then(setRecentData).catch(console.error);
  }, []);

  const columns = [
    { key: 'nom', label: 'Projet' },
    { key: 'chefProjet', label: 'Responsable' },
    { key: 'avancement', label: 'Progression', render: (row) => (
       <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full" style={{ width: `${row.progression}%` }}></div>
       </div>
    )},
    { key: 'statut', label: 'Statut', render: (row) => (
      <Badge label={row.statut} type={row.statut === 'Terminé' ? 'success' : 'info'} />
    )},
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* HEADER DE BIENVENUE */}
      <div className="flex justify-between items-end bg-white/50 p-8 rounded-3xl backdrop-blur-sm border border-white shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tighter uppercase italic drop-shadow-sm">Tableau de Bord</h1>
          <p className="text-indigo-600/50 font-bold text-xs uppercase tracking-[0.3em] mt-1">Gestion Globale du Système</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Session Active</p>
          <p className="text-sm font-bold text-slate-800 italic uppercase">{localStorage.getItem('username') || 'Utilisateur'}</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{String(localStorage.getItem('role') || '').replace(/ROLE_/gi, '').replace(/_/g, ' ')}</p>
        </div>
      </div>

      {/* 1. LES COMPTEURS RAPIDES (Visuel) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <HomeCard label="Projets" value={overview.totalProjets} icon={<Briefcase size={28}/>} color="from-blue-500 to-blue-600" />
        <HomeCard label="Phases" value={overview.totalPhases} icon={<CheckSquare size={28}/>} color="from-slate-800 to-slate-950" />
        <HomeCard label="Équipe" value={overview.totalEmployes} icon={<Users size={28}/>} color="from-indigo-500 to-purple-600" />
      </div>

      {/* 2. RÉSUMÉ DE L'ACTIVITÉ (Utile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des projets récents */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
            <Layout size={16} className="text-indigo-400" /> Projets Récemment Modifiés
          </h2>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-6 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-shadow duration-500">
            <DataTable columns={columns} data={recentData} />
          </div>
        </div>

        {/* Petit Widget de distribution (Visuel conforme prof) */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center">État Global</h2>
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center min-h-[300px] shadow-2xl shadow-indigo-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative w-36 h-36 flex items-center justify-center border-[14px] border-indigo-500/30 rounded-full group-hover:scale-110 transition-transform duration-700">
              <div className="absolute inset-0 border-[14px] border-blue-500 rounded-full border-t-transparent animate-spin-slow"></div>
              <span className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">75%</span>
            </div>
            <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-blue-200/50 group-hover:text-blue-200 transition-colors duration-500">Objectifs atteints</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Petit composant interne pour les cartes d'accueil
function HomeCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-6 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 cursor-default group">
      <div className={`bg-gradient-to-br ${color} text-white p-5 rounded-3xl shadow-xl shadow-slate-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-4xl font-black text-slate-800 tracking-tighter">{value}</p>
      </div>
    </div>
  );
}