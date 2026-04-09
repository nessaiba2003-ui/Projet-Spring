import { useEffect, useMemo, useState } from 'react';
import { reportingService } from '../../services/reportingService';
import StatCard from '../../components/Reporting/StatCard';
import FilterBar from '../../components/Reporting/FilterBar';
import { TrendingUp, AlertCircle, CheckCircle, Wallet, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';

export default function Dahsboard() {
  const [stats, setStats] = useState({ active: 0, nonFacture: 0, paye: 0 });
  const [projets, setProjets] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportRows, setReportRows] = useState({
    nonFacturees: [],
    factureesNonPayees: [],
    payees: [],
    projetsEnCours: [],
    projetsClotures: [],
  });
  const [filters, setFilters] = useState({ dateDebut: '2020-01-01', dateFin: '2026-12-31', projetId: '', chefId: '' });

  const loadStats = async () => {
    setLoading(true);
    const params = {
      dateDebut: filters.dateDebut || undefined,
      dateFin: filters.dateFin || undefined,
      projetId: filters.projetId || undefined,
      chefId: filters.chefId || undefined,
    };
    try {
      const [global, nonFacturees, factureesNonPayees, payees, projetsEnCours, projetsClotures] = await Promise.all([
        reportingService.getGlobalStats(params),
        reportingService.getPhasesNonFacturees(params).catch(() => []),
        reportingService.getPhasesFactureesNonPayees(params).catch(() => []),
        reportingService.getPhasesPayees(params).catch(() => []),
        reportingService.getProjetsEnCours(params).catch(() => []),
        reportingService.getProjetsClotures(params).catch(() => []),
      ]);
      setStats({
        active: global?.projetsEnCours ?? global?.active ?? 0,
        nonFacture: global?.phasesAFacturer ?? global?.nonFacture ?? 0,
        paye: global?.montantTotalEncaisse ?? global?.paye ?? 0,
      });
      setReportRows({
        nonFacturees: Array.isArray(nonFacturees) ? nonFacturees : [],
        factureesNonPayees: Array.isArray(factureesNonPayees) ? factureesNonPayees : [],
        payees: Array.isArray(payees) ? payees : [],
        projetsEnCours: Array.isArray(projetsEnCours) ? projetsEnCours : [],
        projetsClotures: Array.isArray(projetsClotures) ? projetsClotures : [],
      });
      const allProjects = [...(Array.isArray(projetsEnCours) ? projetsEnCours : []), ...(Array.isArray(projetsClotures) ? projetsClotures : [])];
      const uniqProjects = Array.from(new Map(allProjects.filter((p) => p?.id != null).map((p) => [p.id, p])).values());
      setProjets(uniqProjects);
      const uniqChefs = Array.from(
        new Map(
          uniqProjects
            .map((p) => p?.chefProjet)
            .filter((c) => c?.id != null)
            .map((c) => [c.id, c])
        ).values()
      );
      setChefs(uniqChefs);
    } catch (e) {
      setStats({
        active: 0,
        nonFacture: 0,
        paye: 0,
      });
      setReportRows({
        nonFacturees: [],
        factureesNonPayees: [],
        payees: [],
        projetsEnCours: [],
        projetsClotures: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    // Auto-refresh: update charts/cards whenever a filter changes
  }, [filters.dateDebut, filters.dateFin, filters.projetId, filters.chefId]);

  useEffect(() => {
    const timer = setInterval(() => {
      loadStats();
    }, 5000);
    return () => clearInterval(timer);
  }, [filters.dateDebut, filters.dateFin, filters.projetId, filters.chefId]);

  const pieData = useMemo(
    () => [
      { name: 'Non facturées', value: reportRows.nonFacturees.length, color: '#f59e0b' },
      { name: 'Facturées non payées', value: reportRows.factureesNonPayees.length, color: '#3b82f6' },
      { name: 'Payées', value: reportRows.payees.length, color: '#10b981' },
    ],
    [reportRows]
  );

  const barData = useMemo(() => {
    const facture = reportRows.factureesNonPayees.reduce((sum, p) => sum + (Number(p?.montant) || 0), 0);
    const encaisse = reportRows.payees.reduce((sum, p) => sum + (Number(p?.montant) || 0), 0);
    return [{ name: 'Montants (MAD)', facture, encaisse }];
  }, [reportRows]);

  const kpis = useMemo(
    () => [
      { label: 'Phases non facturées', value: reportRows.nonFacturees.length, className: 'bg-amber-50 text-amber-700 border-amber-200' },
      { label: 'Facturées non payées', value: reportRows.factureesNonPayees.length, className: 'bg-blue-50 text-blue-700 border-blue-200' },
      { label: 'Phases payées', value: reportRows.payees.length, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { label: 'Projets en cours', value: reportRows.projetsEnCours.length, className: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { label: 'Projets clôturés', value: reportRows.projetsClotures.length, className: 'bg-slate-50 text-slate-700 border-slate-200' },
    ],
    [reportRows]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Reporting Financier</h1>

      {loading && (
        <div className="fixed top-20 right-6 z-40 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          Chargement des statistiques...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Projets Actifs"
          value={stats.active}
          colorClass="text-blue-700"
          icon={<TrendingUp />}
          accentClass="from-blue-50 to-indigo-50"
        />
        <StatCard
          label="À Facturer"
          value={stats.nonFacture}
          colorClass="text-amber-600"
          icon={<AlertCircle />}
          accentClass="from-amber-50 to-orange-50"
        />
        <StatCard
          label="CA Encaissé"
          value={`${stats.paye} MAD`}
          colorClass="text-emerald-700"
          icon={<Wallet />}
          accentClass="from-emerald-50 to-teal-50"
        />
      </div>

      <FilterBar filters={filters} setFilters={setFilters} onApply={loadStats} projets={projets} chefs={chefs} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <PieIcon size={14} className="text-indigo-500" /> Répartition par état
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-emerald-500" /> Montants facturés vs encaissés
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} MAD`} />
                <Legend />
                <Bar dataKey="facture" name="Facturé non payé" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="encaisse" name="Encaissé" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-4">Résultats du filtre</h3>
        <div className="flex flex-wrap gap-3">
          {kpis.map((item) => (
            <div key={item.label} className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-wider ${item.className}`}>
              {item.label}: {item.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}