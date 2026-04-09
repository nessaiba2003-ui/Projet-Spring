import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phaseSchema } from '../../utils/phaseSchema';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { projetService } from '../../services/projetService';
import { phaseService } from '../../services/phaseService';

export default function PhaseForm() {
  const { projetId, id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);

  // On récupère les dates du projet pour valider les phases
  useEffect(() => {
    projetService.getById(projetId || id).then(setProjet);
  }, [projetId, id]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: projet ? zodResolver(phaseSchema(projet.dateDebut, projet.dateFin)) : undefined
  });

  const onSubmit = async (data) => {
    try {
      if (id) await phaseService.update(id, data);
      else await phaseService.create(projetId, data);
      navigate(-1);
    } catch (e) { alert(e); }
  };

  if (!projet) return null;

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-xl font-black text-slate-800 uppercase mb-6 tracking-tighter">Configuration de la Phase</h2>

      {/* Rappel Visuel des Dates du Projet (Consigne Prof) */}
      <div className="mb-8 p-4 bg-blue-50 rounded-xl text-[11px] font-bold text-blue-600 uppercase border border-blue-100">
        Intervalle projet : {projet.dateDebut} au {projet.dateFin}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-medium text-sm">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400">Nom de la phase</label>
          <input {...register('nom')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600" />
          <p className="text-red-500 text-[10px]">{errors.nom?.message}</p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400">Montant de la phase (MAD)</label>
          <input type="number" {...register('montant')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
          <p className="text-red-500 text-[10px]">{errors.montant?.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Début</label>
            <input type="date" {...register('dateDebut')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
            <p className="text-red-500 text-[10px]">{errors.dateDebut?.message}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Fin</label>
            <input type="date" {...register('dateFin')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
            <p className="text-red-500 text-[10px]">{errors.dateFin?.message}</p>
          </div>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-4">Valider la Phase</button>
      </form>
    </div>
  );
}