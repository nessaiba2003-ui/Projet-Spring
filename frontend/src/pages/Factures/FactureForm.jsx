import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { factureSchema } from '../../utils/factureSchema';
import { useParams, useNavigate } from 'react-router-dom';
import { factureService } from '../../services/factureService';
import { useEffect } from 'react';

export default function FactureForm() {
  const { phaseId, id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(factureSchema),
    defaultValues: { statut: 'FACTUREE' }
  });

  useEffect(() => {
    if (id) factureService.getById(id).then(reset);
  }, [id, reset]);

  // Calcul automatique du TTC pour la "Cohérence métier"
  const mHT = watch('montantHT') || 0;
  const tva = watch('tva') || 20;
  const TTC = Number(mHT) + (Number(mHT) * (Number(tva) / 100));

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, montantTTC: TTC };
      if (id) await factureService.update(id, payload);
      else await factureService.createFromPhase(phaseId, payload);
      navigate('/factures');
    } catch (e) { alert("Erreur lors de l'enregistrement"); }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter border-b pb-6 mb-8 italic">
        {id ? 'Modification Facture' : 'Génération de Facture'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            <input type="number" {...register('montantHT')} className="w-full p-3 bg-white rounded-xl border-none font-black text-blue-600" />
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

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 mt-6 hover:bg-blue-600 transition-all">
          Valider la Facture
        </button>
      </form>
    </div>
  );
}