import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projetSchema } from '../../utils/projetSchema';
import { projetService } from '../../services/projetService';
import { organismeService } from '../../services/organismeService';
import { employeService } from '../../services/employeService';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import Modal from '../../components/Modal';

const formatDateForApi = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ProjetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [organismes, setOrganismes] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Information', message: '' });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'projets');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projetSchema)
  });

  useEffect(() => {
    organismeService.getAll().then(setOrganismes);
    employeService.getAll().then(setEmployes);
    if (id) {
      projetService.getById(id).then((project) => {
        reset({
          code: project?.code || '',
          nom: project?.nom || '',
          description: project?.description || '',
          montantGlobal: project?.montantGlobal ?? '',
          dateDebut: formatDateForApi(project?.dateDebut) || '',
          dateFin: formatDateForApi(project?.dateFin) || '',
          organismeId: project?.organisme?.id ? String(project.organisme.id) : '',
          chefProjetId: project?.chefProjet?.id ? String(project.chefProjet.id) : '',
        });
      });
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    if (!canManage) {
      setInfoModal({ open: true, title: 'Accès refusé', message: "Vous n'avez pas les droits pour enregistrer ce projet." });
      return;
    }
    try {
      // Le backend attend ProjetDTO: organismeId/chefProjetId + LocalDate (YYYY-MM-DD)
      const payload = {
        code: data.code,
        nom: data.nom,
        description: data.description || '',
        montantGlobal: Number(data.montantGlobal),
        dateDebut: formatDateForApi(data.dateDebut),
        dateFin: formatDateForApi(data.dateFin),
        organismeId: Number(data.organismeId),
        chefProjetId: Number(data.chefProjetId),
        organisme: { id: Number(data.organismeId) },
        chefProjet: { id: Number(data.chefProjetId) },
      };

      if (id) await projetService.update(id, payload);
      else await projetService.create(payload);
      navigate('/projets');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || String(err);
      setInfoModal({ open: true, title: 'Erreur', message: msg });
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tighter">
        {id ? 'Modification du Projet' : 'Création de Projet'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {!canManage && <div className="p-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">Accès en lecture seule : enregistrement non autorisé.</div>}
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
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
            <textarea {...register('description')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-medium min-h-[46px]" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Montant Global (MAD)</label>
            <input type="number" step="0.01" {...register('montantGlobal')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold" />
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

        <button type="submit" disabled={!canManage} className="w-full bg-slate-900 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all mt-4">
          Valider le Projet
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