import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projetSchema } from '../../utils/projetSchema';
import { projetService } from '../../services/projetService';
import { organismeService } from '../../services/organismeService';
import { employeService } from '../../services/employeService';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProjetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organismes, setOrganismes] = useState([]);
  const [employes, setEmployes] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projetSchema)
  });

  useEffect(() => {
    organismeService.getAll().then(setOrganismes);
    employeService.getAll().then(setEmployes);
    if (id) projetService.getById(id).then(reset);
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) await projetService.update(id, data);
      else await projetService.create(data);
      navigate('/projets');
    } catch (err) { alert(err); }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">
        {id ? 'Modification du Projet' : 'Création de Projet'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Code Projet</label>
            <input {...register('code')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
            <p className="text-red-500 text-[10px] font-bold">{errors.code?.message}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Nom du Projet</label>
            <input {...register('nom')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
            <p className="text-red-500 text-[10px] font-bold">{errors.nom?.message}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Organisme (Client)</label>
            <select {...register('organismeId')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-medium">
              <option value="">Choisir un organisme...</option>
              {organismes.map(o => <option key={o.id} value={o.id}>{o.nom}</option>)}
            </select>
            <p className="text-red-500 text-[10px] font-bold">{errors.organismeId?.message}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Chef de Projet</label>
            <select {...register('chefProjetId')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-medium">
              <option value="">Choisir un chef de projet...</option>
              {employes.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
            </select>
            <p className="text-red-500 text-[10px] font-bold">{errors.chefProjetId?.message}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Date Début</label>
            <input type="date" {...register('dateDebut')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Date Fin (Contrôlée)</label>
            <input type="date" {...register('dateFin')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold" />
            <p className="text-red-500 text-[10px] font-bold">{errors.dateFin?.message}</p>
          </div>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all mt-4">
          Valider le Projet
        </button>
      </form>
    </div>
  );
}