import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organismeSchema } from '../../utils/organismeSchema';
import { organismeService } from '../../services/organismeService';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import { useState } from 'react';
import Modal from '../../components/Modal';

export default function OrganismeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Information', message: '' });
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({
    resolver: zodResolver(organismeSchema)
  });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'organismes');

  useEffect(() => { if (id) organismeService.getById(id).then(reset); }, [id, reset]);

  const onSubmit = async (data) => {
    if (!canManage) {
      setInfoModal({ open: true, title: 'Accès refusé', message: "Vous n'avez pas les droits pour enregistrer cet organisme." });
      return;
    }
    try {
      const payload = {
        code: data.code?.trim(),
        nom: data.nom?.trim(),
        contact: data.contact?.trim(),
        adresse: data.adresse?.trim() || null,
      };
      if (id) await organismeService.update(id, payload);
      else await organismeService.create(payload);
      navigate('/organismes');
    } catch (err) {
      // AFFICHAGE DES ERREURS BACKEND (Consigne Prof)
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.toString();
      setError("root", { message: msg });
      setInfoModal({ open: true, title: 'Erreur', message: msg });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter italic">
        {id ? 'Modifier l\'organisme' : 'Nouvel Organisme'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!canManage && <div className="p-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">Accès en lecture seule : enregistrement non autorisé.</div>}
        {errors.root && <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-xs">{errors.root.message}</div>}

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Code Identification</label>
            <input {...register('code')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
            <p className="text-red-500 text-[10px] font-bold">{errors.code?.message}</p>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Nom de l'organisme</label>
            <input {...register('nom')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
            <p className="text-red-500 text-[10px] font-bold">{errors.nom?.message}</p>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Contact Principal</label>
          <input {...register('contact')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
          <p className="text-red-500 text-[10px] font-bold">{errors.contact?.message}</p>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Adresse</label>
          <input {...register('adresse')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
          <p className="text-red-500 text-[10px] font-bold">{errors.adresse?.message}</p>
        </div>

        <button type="submit" disabled={!canManage} className="w-full bg-slate-900 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all mt-4">
          Enregistrer les données
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