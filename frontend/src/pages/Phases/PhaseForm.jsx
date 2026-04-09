import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phaseSchema } from '../../utils/phaseSchema';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { projetService } from '../../services/projetService';
import { phaseService } from '../../services/phaseService';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
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

export default function PhaseForm() {
  const { projetId, id } = useParams();
  const navigate = useNavigate();
  const [projet, setProjet] = useState(null);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Information', message: '' });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'phases');

  // On récupère les dates du projet pour valider les phases
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(phaseSchema(projet?.dateDebut, projet?.dateFin))
  });

  useEffect(() => {
    if (projetId) {
      projetService.getById(projetId).then(setProjet).catch(() => setProjet(null));
      return;
    }
    if (id) {
      phaseService.getById(id).then((phase) => {
        if (!phase) return;
        reset({
          libelle: phase.libelle || '',
          montant: phase.montant || '',
          dateDebut: phase.dateDebut || '',
          dateFin: phase.dateFin || '',
          etatRealisation: Boolean(phase.etatRealisation),
          etatFacturation: Boolean(phase.etatFacturation),
          etatPaiement: Boolean(phase.etatPaiement),
        });
        if (phase.projet?.id) {
          projetService.getById(phase.projet.id).then(setProjet).catch(() => setProjet(null));
        }
      }).catch(() => setProjet(null));
    }
  }, [projetId, id, reset]);

  const onSubmit = async (data) => {
    if (!canManage) {
      setInfoModal({ open: true, title: 'Accès refusé', message: "Vous n'avez pas les droits pour enregistrer cette phase." });
      return;
    }
    try {
      const formattedStart = formatDateForApi(data.dateDebut);
      const formattedEnd = formatDateForApi(data.dateFin);
      const numericMontant = Number(data.montant);
      const parentProjectId = projetId ? Number(projetId) : undefined;

      if (!formattedStart || !formattedEnd) {
        setInfoModal({ open: true, title: 'Validation', message: "Format date invalide. Utilisez YYYY-MM-DD." });
        return;
      }
      if (!Number.isFinite(numericMontant)) {
        setInfoModal({ open: true, title: 'Validation', message: "Montant invalide." });
        return;
      }

      const payload = {
        libelle: data.libelle,
        montant: numericMontant,
        dateDebut: formattedStart,
        dateFin: formattedEnd,
        etatRealisation: Boolean(data.etatRealisation),
        etatFacturation: Boolean(data.etatFacturation),
        etatPaiement: Boolean(data.etatPaiement),
        ...(parentProjectId ? { projet: { id: parentProjectId } } : {}),
      };
      if (id) await phaseService.update(id, payload);
      else await phaseService.create(projetId, payload);
      navigate(-1);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Erreur lors de l'enregistrement";
      setInfoModal({ open: true, title: 'Erreur', message: msg });
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
      <h2 className="text-xl font-black text-slate-800 uppercase mb-6 tracking-tighter">Configuration de la Phase</h2>

      {projet && (
        <div className="mb-8 p-4 bg-blue-50 rounded-xl text-[11px] font-bold text-blue-600 uppercase border border-blue-100">
          Intervalle projet : {projet.dateDebut} au {projet.dateFin}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 font-medium text-sm">
        {!canManage && <div className="p-3 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold">Accès en lecture seule : enregistrement non autorisé.</div>}
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase text-slate-400">Nom de la phase</label>
          <input {...register('libelle')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600" />
          <p className="text-red-500 text-[10px]">{errors.libelle?.message}</p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 rounded-2xl p-4">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <input type="checkbox" {...register('etatRealisation')} />
            Réalisée
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <input type="checkbox" {...register('etatFacturation')} />
            Facturée
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <input type="checkbox" {...register('etatPaiement')} />
            Payée
          </label>
        </div>

        <button type="submit" disabled={!canManage} className="w-full bg-slate-900 disabled:bg-slate-300 text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-4">Valider la Phase</button>
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