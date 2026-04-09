import { useEffect, useState } from 'react';
import { phaseService } from '../../services/phaseService';
import { Plus, Eye, Edit, Trash2, CheckCircle, Receipt, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function PhaseList() {
  const { projetId } = useParams();
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    phaseService.getByProjet(projetId).then(setPhases).catch(console.error);
  }, [projetId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Phases du Projet</h2>
        <Link to={`/projets/${projetId}/phases/nouveau`} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
          <Plus size={18}/> Nouvelle Phase
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {phases.map(phase => (
          <div key={phase.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">{phase.nom}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase">{phase.dateDebut} — {phase.dateFin}</p>
            </div>

            {/* Affichage Montant (Consigne Prof) */}
            <div className="flex-1 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Budget Phase</p>
              <p className="text-xl font-black text-blue-600 tracking-tighter">{phase.montant} MAD</p>
            </div>

            {/* État visuel (Réalisation / Facturation / Paiement) */}
            <div className="flex items-center gap-4 px-6 border-x border-slate-50">
              <CheckCircle size={20} className={phase.realisee ? 'text-green-500' : 'text-slate-200'} title="Réalisée" />
              <Receipt size={20} className={phase.facturee ? 'text-blue-500' : 'text-slate-200'} title="Facturée" />
              <Wallet size={20} className={phase.payee ? 'text-emerald-500' : 'text-slate-200'} title="Payée" />
            </div>

            <div className="flex gap-2 ml-6">
              <Link to={`/phases/${phase.id}`} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600"><Eye size={18}/></Link>
              <Link to={`/phases/edit/${phase.id}`} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600"><Edit size={18}/></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}