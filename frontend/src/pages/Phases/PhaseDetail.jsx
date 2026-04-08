import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { phaseService } from '../../services/phaseService';
import { CheckCircle2, Receipt, CreditCard, ArrowLeft } from 'lucide-react';

export default function PhaseDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => { load(); }, [id]);
  const load = () => phaseService.getById(id).then(setP);

  const updateStatus = async (type) => {
    try {
      if (type === 'real') await phaseService.updateRealisation(id, { realizee: !p.realisee });
      if (type === 'fact') await phaseService.updateFacturation(id, { facturee: !p.facturee });
      if (type === 'pay') await phaseService.updatePaiement(id, { payee: !p.payee });
      load(); // Recharger les données
    } catch (e) { alert(e); }
  };

  if (!p) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">{p.nom}</h2>
        <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">Budget : {p.montant} MAD</p>

        {/* BOUTONS D'ACTION MÉTIER (Consigne Prof) */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <button
            onClick={() => updateStatus('real')}
            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${p.realisee ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <CheckCircle2 size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour Réalisation</span>
          </button>

          <button
            onClick={() => updateStatus('fact')}
            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${p.facturee ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <Receipt size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour Facturation</span>
          </button>

          <button
            onClick={() => updateStatus('pay')}
            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${p.payee ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <CreditCard size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour Paiement</span>
          </button>
        </div>
      </div>
    </div>
  );
}