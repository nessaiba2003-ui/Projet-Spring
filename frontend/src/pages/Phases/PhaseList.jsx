import { useEffect, useState } from 'react';
import { phaseService } from '../../services/phaseService';
import { projetService } from '../../services/projetService';
import { Plus, Eye, Edit, Trash2, CheckCircle, Receipt, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import Modal from '../../components/Modal';

export default function PhaseList() {
  const { projetId } = useParams();
  const [phases, setPhases] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Information', message: '' });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'phases');

  useEffect(() => {
    if (projetId) {
      phaseService.getByProjet(projetId).then((rows) => setPhases(rows || [])).catch(() => setPhases([]));
      return;
    }
    projetService.getAll()
      .then((projets) => Promise.all((projets || []).map((p) => phaseService.getByProjet(p.id).catch(() => []))))
      .then((groups) => setPhases(groups.flat()))
      .catch(() => setPhases([]));
  }, [projetId]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await phaseService.delete(deleteTarget.id);
      setPhases((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (e) {
      setInfoModal({ open: true, title: 'Erreur', message: "Suppression impossible: phase liée à d'autres données." });
    } finally {
      setDeleteTarget(null);
    }
  };

  const toggleEtat = async (phaseIdToUpdate, type, current) => {
    try {
      if (type === 'realisation') await phaseService.updateRealisation(phaseIdToUpdate, !current);
      if (type === 'facturation') await phaseService.updateFacturation(phaseIdToUpdate, !current);
      if (type === 'paiement') await phaseService.updatePaiement(phaseIdToUpdate, !current);
      setPhases((prev) =>
        prev.map((p) => {
          if (p.id !== phaseIdToUpdate) return p;
          if (type === 'realisation') return { ...p, etatRealisation: !current };
          if (type === 'facturation') return { ...p, etatFacturation: !current };
          return { ...p, etatPaiement: !current };
        })
      );
    } catch (e) {
      setInfoModal({ open: true, title: 'Erreur', message: "Mise à jour d'état impossible." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{projetId ? 'Phases du Projet' : 'Toutes les phases'}</h2>
        {canManage && projetId && (
          <Link to={`/projets/${projetId}/phases/nouveau`} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
            <Plus size={18}/> Nouvelle Phase
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {phases.map(phase => (
          <div key={phase.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-lg">{phase.libelle || phase.nom}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase">{phase.dateDebut} — {phase.dateFin}</p>
            </div>

            {/* Affichage Montant (Consigne Prof) */}
            <div className="flex-1 text-center">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Budget Phase</p>
              <p className="text-xl font-black text-blue-600 tracking-tighter">{phase.montant} MAD</p>
            </div>

            {/* État visuel (Réalisation / Facturation / Paiement) */}
            <div className="flex items-center gap-4 px-6 border-x border-slate-50">
              {canManage ? (
                <>
                  <button onClick={() => toggleEtat(phase.id, 'realisation', Boolean(phase.etatRealisation))} title="Basculer réalisation">
                    <CheckCircle size={20} className={phase.etatRealisation ? 'text-green-500' : 'text-slate-200'} />
                  </button>
                  <button onClick={() => toggleEtat(phase.id, 'facturation', Boolean(phase.etatFacturation))} title="Basculer facturation">
                    <Receipt size={20} className={phase.etatFacturation ? 'text-blue-500' : 'text-slate-200'} />
                  </button>
                  <button onClick={() => toggleEtat(phase.id, 'paiement', Boolean(phase.etatPaiement))} title="Basculer paiement">
                    <Wallet size={20} className={phase.etatPaiement ? 'text-emerald-500' : 'text-slate-200'} />
                  </button>
                </>
              ) : (
                <>
                  <CheckCircle size={20} className={phase.etatRealisation ? 'text-green-500' : 'text-slate-200'} />
                  <Receipt size={20} className={phase.etatFacturation ? 'text-blue-500' : 'text-slate-200'} />
                  <Wallet size={20} className={phase.etatPaiement ? 'text-emerald-500' : 'text-slate-200'} />
                </>
              )}
            </div>

            <div className="flex gap-2 ml-6">
              <Link to={`/phases/${phase.id}`} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600"><Eye size={18}/></Link>
              {canManage && <Link to={`/phases/edit/${phase.id}`} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600"><Edit size={18}/></Link>}
              {canManage && <button onClick={() => setDeleteTarget(phase)} className="p-2 bg-slate-50 rounded-lg text-slate-300 hover:text-red-600"><Trash2 size={18}/></button>}
            </div>
          </div>
        ))}
        {phases.length === 0 && (
          <div className="p-8 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-sm font-bold text-center">
            Aucune phase disponible.
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Suppression phase"
      >
        <p>Voulez-vous vraiment supprimer la phase <strong>{deleteTarget?.libelle || deleteTarget?.nom}</strong> ?</p>
      </Modal>

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