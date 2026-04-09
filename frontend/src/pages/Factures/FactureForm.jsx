import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { factureSchema } from '../../utils/factureSchema';
import { useParams, useNavigate } from 'react-router-dom';
import { factureService } from '../../services/factureService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import { phaseService } from '../../services/phaseService';
import Modal from '../../components/Modal';

const formatDateForApi = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function FactureForm() {
  const { phaseId, id } = useParams();
  const navigate = useNavigate();
  const [phaseMontant, setPhaseMontant] = useState(null);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Information', message: '' });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'factures');
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(factureSchema),
    defaultValues: { statut: 'FACTUREE' }
  });

  useEffect(() => {
    if (id) factureService.getById(id).then(reset);
    if (!id && phaseId) {
      phaseService.getById(phaseId).then((phase) => {
        const montant = Number(phase?.montant || 0);
        setPhaseMontant(montant);
        reset((prev) => ({ ...prev, montantHT: montant }));
      }).catch(() => setPhaseMontant(null));
    }
  }, [id, phaseId, reset]);

  // Calcul automatique du TTC pour la "Cohérence métier"
  const mHT = phaseMontant != null ? phaseMontant : (watch('montantHT') || 0);
  const tva = watch('tva') || 20;
  const TTC = Number(mHT) + (Number(mHT) * (Number(tva) / 100));

  const onSubmit = async (data) => {
    if (!canManage) {
      setInfoModal({ open: true, title: 'Accès refusé', message: "Vous n'avez pas les droits pour enregistrer cette facture." });
      return;
    }
    if (!id && !phaseId) {
      setInfoModal({ open: true, title: 'Validation', message: "Phase manquante : impossible de créer une facture sans phase." });
      return;
    }
    try {
      const payload = {
        reference: String(data.reference || '').trim(),
        montant: Number(phaseMontant != null ? phaseMontant : data.montantHT),
        dateFacture: formatDateForApi(data.dateFacture),
        payee: data.statut === 'PAYEE',
      };
      if (id) await factureService.update(id, payload);
      else await factureService.createFromPhase(phaseId, payload);
      navigate('/factures');
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || "Erreur lors de l'enregistrement";
      setInfoModal({ open: true, title: 'Erreur', message: msg });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter border-b pb-6 mb-8 italic">
        {id ? 'Modification Facture' : 'Génération de Facture'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!canManage && <div className="p-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">Accès en lecture seule : enregistrement non autorisé.</div>}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Référence Facture</label>
            <input {...register('reference')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold uppercase" placeholder="FAC-2026-001" />
            <p className="text-red-500 text-[10px] font-bold">{errors.reference?.message}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Date d'émission</label>
            <input type="date" {...register('dateFacture')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 bg-slate-50 p-6 rounded-3xl">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Montant HT (MAD)</label>
            <input
              type="number"
              {...register('montantHT')}
              readOnly={phaseMontant != null}
              className="w-full p-3 bg-white rounded-xl border-none font-black text-blue-600"
            />
            {errors.montantHT && <p className="text-red-500 text-[10px] font-bold">{errors.montantHT.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">TVA (%)</label>
            <input type="number" {...register('tva')} className="w-full p-3 bg-white rounded-xl border-none font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total TTC Calqué</label>
            <div className="w-full p-3 bg-blue-600 text-white rounded-xl font-black text-lg">{TTC.toFixed(2)}</div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">État de la facture</label>
          <select {...register('statut')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold">
            <option value="FACTUREE">En attente de paiement (FACTUREE)</option>
            <option value="PAYEE">Déjà payée (PAYEE)</option>
          </select>
        </div>

        <button type="submit" disabled={!canManage} className="w-full bg-slate-900 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 mt-6 hover:bg-blue-600 transition-all">
          Valider la Facture
        </button>
      </form>

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