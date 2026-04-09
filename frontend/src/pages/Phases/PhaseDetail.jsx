import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { phaseService } from '../../services/phaseService';
import { CheckCircle2, Receipt, CreditCard, ArrowLeft } from 'lucide-react';
import Modal from '../../components/Modal';

export default function PhaseDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Erreur', message: '' });

  useEffect(() => { load(); }, [id]);
  const load = () => phaseService.getById(id).then(setP);

  const updateStatus = async (type) => {
    try {
      if (type === 'real') await phaseService.updateRealisation(id, !p.etatRealisation);
      if (type === 'fact') await phaseService.updateFacturation(id, !p.etatFacturation);
      if (type === 'pay') await phaseService.updatePaiement(id, !p.etatPaiement);
      load(); // Recharger les données
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || String(e);
      setInfoModal({ open: true, title: 'Erreur', message: msg });
    }
  };

  if (!p) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">{p.libelle}</h2>
        <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">Budget : {p.montant} MAD</p>

        {/* BOUTONS D'ACTION MÉTIER (Consigne Prof) */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          <button
            onClick={() => updateStatus('real')}
            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${p.etatRealisation ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <CheckCircle2 size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour Réalisation</span>
          </button>

          <button
            onClick={() => updateStatus('fact')}
            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${p.etatFacturation ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <Receipt size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour Facturation</span>
          </button>

          <button
            onClick={() => updateStatus('pay')}
            className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all ${p.etatPaiement ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
            <CreditCard size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mise à jour Paiement</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={infoModal.open}
        onClose={() => setInfoModal({ ...infoModal, open: false })}
        title={infoModal.title}
        hideCancel
        confirmLabel="OK"
      >
        <p>{infoModal.message}</p>
      </Modal>
    </div>
  );
}