import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeSchema } from '../../utils/employeSchema';
import { employeService } from '../../services/employeService';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function EmployeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: zodResolver(employeSchema)
  });

  useEffect(() => { if (id) employeService.getById(id).then(reset); }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      if (id) await employeService.update(id, data);
      else await employeService.create(data);
      navigate('/employes');
    } catch (err) {
      // --- CONTRÔLE D'UNICITÉ BACKEND ---
      const msg = err.toString().toLowerCase();
      if (msg.includes("matricule")) setError("matricule", { message: "Matricule déjà utilisé" });
      if (msg.includes("login")) setError("login", { message: "Login déjà utilisé" });
      if (msg.includes("email")) setError("email", { message: "Email déjà utilisé" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">{id ? 'Modifier' : 'Ajouter'} l'employé</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6 font-medium">
        <div className="col-span-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Matricule</label>
          <input {...register('matricule')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600" />
          <p className="text-red-500 text-[10px] font-bold">{errors.matricule?.message}</p>
        </div>
        <div className="col-span-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Login</label>
          <input {...register('login')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600" />
          <p className="text-red-500 text-[10px] font-bold">{errors.login?.message}</p>
        </div>
        <div className="col-span-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Nom</label>
          <input {...register('nom')} className="w-full p-3 bg-slate-50 rounded-xl border-none" />
        </div>
        <div className="col-span-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Prénom</label>
          <input {...register('prenom')} className="w-full p-3 bg-slate-50 rounded-xl border-none" />
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Email</label>
          <input {...register('email')} className="w-full p-3 bg-slate-50 rounded-xl border-none" />
          <p className="text-red-500 text-[10px] font-bold">{errors.email?.message}</p>
        </div>
        <button type="submit" className="col-span-2 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-4">Enregistrer</button>
      </form>
    </div>
  );
}