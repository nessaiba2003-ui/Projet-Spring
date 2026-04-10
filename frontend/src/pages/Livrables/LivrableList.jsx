import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { livrableService } from '../../services/livrableService';
import { projetService } from '../../services/projetService';
import { phaseService } from '../../services/phaseService';
import { FileText, Plus, Edit, Trash2, Download, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import Modal from '../../components/Modal';

export default function LivrableList() {
  const { phaseId } = useParams();
  const [livrables, setLivrables] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Erreur', message: '' });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'livrables');

  useEffect(() => { load(); }, [phaseId]);

  const load = () => {
    if (phaseId) {
      livrableService.getByPhase(phaseId).then(data => setLivrables(data || [])).catch(() => setLivrables([]));
      return;
    }
    projetService.getAll()
      .then((projets) => Promise.all((projets || []).map((p) => phaseService.getByProjet(p.id).catch(() => []))))
      .then((phaseGroups) => phaseGroups.flat())
      .then((phases) => Promise.all((phases || []).map((ph) => livrableService.getByPhase(ph.id).catch(() => []))))
      .then((livrableGroups) => setLivrables(livrableGroups.flat()))
      .catch(() => setLivrables([]));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALIDE': return 'bg-green-100 text-green-700';
      case 'A_CORRIGER': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await livrableService.delete(deleteTarget.id);
      load();
    } catch (e) {
      setInfoModal({ open: true, title: 'Erreur', message: "Suppression livrable impossible." });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">{phaseId ? 'Livrables de la Phase' : 'Tous les livrables'}</h1>
        {canManage && (
          <Link to={phaseId ? `/phases/${phaseId}/livrables/nouveau` : '/livrables/nouveau'} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-200">
            <Plus size={18}/> Nouveau Livrable
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {livrables.length > 0 ? livrables.map((l) => (
          <div key={l.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><FileText size={24}/></div>
              <div>
                <h3 className="font-bold text-slate-800">{l.libelle || l.nom || `Livrable #${l.id}`}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Livraison : {l.dateLivraison || l.dateSoumission || '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* AFFICHAGE DU STATUT (Consigne Prof) */}
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(l.statut)}`}>
                {l.statut || (l.dateLivraison ? 'VALIDE' : 'EN ATTENTE')}
              </span>

              <div className="flex gap-2 border-l pl-6 border-slate-100">
                <button className="p-2 text-slate-400 hover:text-blue-600" title="Télécharger"><Download size={18}/></button>
                {canManage && <Link to={`/livrables/edit/${l.id}`} className="p-2 text-slate-400 hover:text-amber-600"><Edit size={18}/></Link>}
                {canManage && <button onClick={() => setDeleteTarget(l)} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>}
              </div>
            </div>
          </div>
        )) : (
          <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-300 font-bold uppercase tracking-widest">
            Aucun livrable déposé pour le moment
          </div>
        )}
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Suppression livrable"
      >
        <p>
          Voulez-vous vraiment supprimer ce livrable <strong>{deleteTarget?.libelle || deleteTarget?.nom}</strong> ?
        </p>
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