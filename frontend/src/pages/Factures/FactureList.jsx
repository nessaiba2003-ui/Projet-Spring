import { useEffect, useState } from 'react';
import { factureService } from '../../services/factureService';
import { Search, Filter, Receipt, Eye, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import { phaseService } from '../../services/phaseService';

export default function FactureList() {
  const [factures, setFactures] = useState([]);
  const [nonFacturees, setNonFacturees] = useState([]);
  const [filter, setFilter] = useState('TOUS'); // FILTRAGE PAR ÉTAT
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'factures');

  useEffect(() => { load(); }, []);
  const load = async () => {
    try {
      const [allFactures, allPhases] = await Promise.all([
        factureService.getAll().catch(() => []),
        phaseService.getAll().catch(() => []),
      ]);
      const facturesList = allFactures || [];
      setFactures(facturesList);
      const facturedPhaseIds = new Set(facturesList.map((f) => f?.phase?.id).filter(Boolean));
      const notFacturedRows = (allPhases || [])
        .filter((p) => p?.id && p.etatFacturation === false && !facturedPhaseIds.has(p.id))
        .map((p) => ({
          id: `NF-${p.id}`,
          reference: `NON-FACTUREE-PHASE-${p.id}`,
          dateFacture: '-',
          montant: p.montant || 0,
          payee: false,
          isNonFacturee: true,
          phase: p,
        }));
      setNonFacturees(notFacturedRows);
    } catch {
      setFactures([]);
      setNonFacturees([]);
    }
  };

  const mergedData = [...factures, ...nonFacturees];

  const filteredData = mergedData.filter((f) => {
    if (filter === 'TOUS') return true;
    if (filter === 'PAYEE') return f.isNonFacturee !== true && (f.payee === true || f.statut === 'PAYEE');
    if (filter === 'FACTUREE') return f.isNonFacturee === true || (f.payee !== true && f.statut !== 'PAYEE');
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Gestion Comptable</h1>
        <div className="flex gap-2">
           {['TOUS', 'FACTUREE', 'PAYEE'].map(s => (
             <button
                key={s} onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden text-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 font-black text-slate-400 uppercase tracking-widest">Référence / Date</th>
              <th className="p-5 font-black text-slate-400 uppercase tracking-widest">Phase Associée</th>
              <th className="p-5 font-black text-slate-400 uppercase tracking-widest">Montant TTC</th>
              <th className="p-5 font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
              <th className="p-5 font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5">
                  <div className="font-black text-slate-800 uppercase text-xs">{f.reference}</div>
                  <div className="text-[10px] text-slate-400 font-bold italic">{f.dateFacture}</div>
                </td>
                {/* AFFICHAGE PHASE ASSOCIÉE */}
                <td className="p-5">
                  <div className="font-bold text-blue-600 text-[11px] uppercase tracking-tighter italic underline">
                    {f.phase?.libelle || `Phase #${f.phase?.id || '-'}`}
                  </div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Projet: {f.phase?.projet?.nom || '-'}
                  </div>
                </td>
                <td className="p-5 font-black text-slate-700">{f.montant ?? f.montantTTC ?? 0} MAD</td>
                <td className="p-5 text-center">
                  {/* STATUT FACTURÉ / PAYÉ */}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    (f.payee === true || f.statut === 'PAYEE')
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {(f.payee === true || f.statut === 'PAYEE') ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                    {(f.payee === true || f.statut === 'PAYEE') ? 'PAYEE' : (f.isNonFacturee ? 'NON FACTUREE' : 'FACTUREE')}
                  </span>
                </td>
                <td className="p-5 text-right">
                  {!f.isNonFacturee && <Link to={`/factures/${f.id}`} className="p-2 text-slate-300 hover:text-blue-600 inline-block transition-colors"><Eye size={18}/></Link>}
                  {canManage && !f.isNonFacturee && <Link to={`/factures/edit/${f.id}`} className="p-2 text-slate-300 hover:text-amber-600 inline-block transition-colors font-bold">Modif</Link>}
                  {canManage && f.isNonFacturee && f.phase?.id && (
                    <Link to={`/factures/phases/${f.phase.id}/factures/nouveau`} className="p-2 text-slate-300 hover:text-blue-600 inline-block transition-colors font-bold">
                      Facturer
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}