import { useEffect, useState } from 'react';
import { reportingService } from '../../services/reportingService';
import StatCard from '../../components/Reporting/StatCard';
import FilterBar from '../../components/Reporting/FilterBar';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function Dahsboard() {
  const [stats, setStats] = useState({ active: 0, nonFacture: 0, paye: 0 });
  const [filters, setFilters] = useState({ dateDebut: '', dateFin: '', projetId: '', chefId: '' });

  const loadStats = () => {
    reportingService.getGlobalStats().then(setStats).catch(console.error);
  };

  useEffect(() => { loadStats(); }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Reporting Financier</h1>

      {/* 12.1 : Cartes Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Projets Actifs" value={stats.active} colorClass="text-blue-600" icon={<TrendingUp/>} />
        <StatCard label="À Facturer" value={stats.nonFacture} colorClass="text-amber-500" icon={<AlertCircle/>} />
        <StatCard label="CA Encaissé" value={`${stats.paye} MAD`} colorClass="text-emerald-600" icon={<CheckCircle/>} />
      </div>

      {/* Filtres par période, projet et chef (Consigne Prof) */}
      <FilterBar filters={filters} setFilters={setFilters} onApply={loadStats} />

      {/* 12.3 : Graphiques Simples (Visuel utile) */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Répartition par État</h3>
        <div className="flex items-end gap-6 h-40 px-4">
            <div className="flex-1 bg-blue-500 rounded-t-2xl relative group h-full">
                <div className="absolute bottom-0 w-full bg-blue-600 rounded-t-2xl transition-all" style={{height: '70%'}}></div>
            </div>
            <div className="flex-1 bg-emerald-500 rounded-t-2xl relative group h-full">
                <div className="absolute bottom-0 w-full bg-emerald-600 rounded-t-2xl transition-all" style={{height: '35%'}}></div>
            </div>
        </div>
      </div>
    </div>
  );
}