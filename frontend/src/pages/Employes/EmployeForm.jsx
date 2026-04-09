import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeSchema } from '../../utils/employeSchema';
import { employeService } from '../../services/employeService';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import api from '../../services/api/axiosConfig';
import Modal from '../../components/Modal';

export default function EmployeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profils, setProfils] = useState([]);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Information', message: '' });
  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm({
    resolver: zodResolver(employeSchema)
  });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'employes');

  useEffect(() => {
    api.get('/profils').then((data) => setProfils(data || [])).catch(() => setProfils([]));
    if (id) {
      employeService.getById(id).then((emp) => {
        reset({
          matricule: emp?.matricule || '',
          nom: emp?.nom || '',
          prenom: emp?.prenom || '',
          email: emp?.email || '',
          login: emp?.login || '',
          telephone: emp?.telephone || '',
          profilId: emp?.profil?.id ? String(emp.profil.id) : '',
          password: '',
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!canManage) {
      setInfoModal({ open: true, title: 'Accès refusé', message: "Vous n'avez pas les droits pour enregistrer cet employé." });
      return;
    }
    try {
      const payload = {
        matricule: data.matricule,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        login: data.login,
        telephone: data.telephone,
        password: data.password,
        profilId: Number(data.profilId),
        profil: { id: Number(data.profilId) },
      };
      if (id) await employeService.update(id, payload);
      else await employeService.create(payload);
      navigate('/employes');
    } catch (err) {
      // --- CONTRÔLE D'UNICITÉ BACKEND ---
      const msg = err.toString().toLowerCase();
      if (msg.includes("matricule")) setError("matricule", { message: "Matricule déjà utilisé" });
      if (msg.includes("login")) setError("login", { message: "Login déjà utilisé" });
      if (msg.includes("email")) setError("email", { message: "Email déjà utilisé" });
      if (!msg.includes("matricule") && !msg.includes("login") && !msg.includes("email")) {
        setInfoModal({ open: true, title: 'Erreur', message: "Erreur lors de l'enregistrement de l'employé." });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">{id ? 'Modifier' : 'Ajouter'} l'employé</h2>
      {!canManage && <div className="mb-4 p-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">Accès en lecture seule : enregistrement non autorisé.</div>}
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
        <div className="col-span-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Téléphone</label>
          <input {...register('telephone')} className="w-full p-3 bg-slate-50 rounded-xl border-none" />
          <p className="text-red-500 text-[10px] font-bold">{errors.telephone?.message}</p>
        </div>
        <div className="col-span-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Profil</label>
          <select {...register('profilId')} className="w-full p-3 bg-slate-50 rounded-xl border-none">
            <option value="">Choisir un profil...</option>
            {profils.map((p) => (
              <option key={p.id} value={p.id}>{p.libelle}</option>
            ))}
          </select>
          <p className="text-red-500 text-[10px] font-bold">{errors.profilId?.message}</p>
        </div>
        <div className="col-span-2 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Mot de passe</label>
          <input type="password" {...register('password')} className="w-full p-3 bg-slate-50 rounded-xl border-none" />
          <p className="text-red-500 text-[10px] font-bold">{errors.password?.message}</p>
        </div>
        <button type="submit" disabled={!canManage} className="col-span-2 bg-slate-900 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-4">Enregistrer</button>
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