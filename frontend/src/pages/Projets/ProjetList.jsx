import { useEffect, useState } from 'react';
import { projetService } from '../../services/projetService';
import { Search, Plus, Eye, Edit, FileText, Layers, UserPlus, FileCode, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import Modal from '../../components/Modal';

export default function ProjetList() {
  const [projets, setProjets] = useState([]);
  const [filters, setFilters] = useState({ code: '', organisme: '', chef: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [infoModal, setInfoModal] = useState({ open: false, title: 'Erreur', message: '' });
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'projets');

  useEffect(() => {
    projetService.getAll().then(setProjets).catch(console.error);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await projetService.delete(deleteTarget.id);
      setProjets((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (e) {
      setInfoModal({ open: true, title: 'Erreur', message: "Suppression impossible : ce projet contient probablement des phases." });
    } finally {
      setDeleteTarget(null);
    }
  };

  const filtered = projets.filter(p =>
    p.code.toLowerCase().includes(filters.code.toLowerCase()) &&
    p.organisme?.nom.toLowerCase().includes(filters.organisme.toLowerCase()) &&
    (p.chefProjet?.nom + " " + p.chefProjet?.prenom).toLowerCase().includes(filters.chef.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestion des Projets</h1>
        {canManage && (
          <Link to="/projets/nouveau" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700">
            <Plus size={20}/> Nouveau Projet
          </Link>
        )}
      </div>

      {/* RECHERCHE MULTICRITÈRE (Consigne Prof) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Code Projet</label>
          <input type="text" placeholder="Filtrer par code..." className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm"
            onChange={(e) => setFilters({...filters, code: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Organisme</label>
          <input type="text" placeholder="Filtrer par client..." className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm"
            onChange={(e) => setFilters({...filters, organisme: e.target.value})} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Chef de Projet</label>
          <input type="text" placeholder="Filtrer par responsable..." className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm"
            onChange={(e) => setFilters({...filters, chef: e.target.value})} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-black text-slate-400 uppercase">Projet</th>
              <th className="p-4 font-black text-slate-400 uppercase">Client / Chef</th>
              <th className="p-4 font-black text-slate-400 uppercase">Période</th>
              <th className="p-4 font-black text-slate-400 uppercase">État</th>
              <th className="p-4 font-black text-slate-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-black text-blue-600 uppercase tracking-tighter">{p.code}</div>
                  <div className="font-bold text-slate-700">{p.nom}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-600">{p.organisme?.nom}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">{p.chefProjet?.nom} {p.chefProjet?.prenom}</div>
                </td>
                <td className="p-4 text-xs font-bold text-slate-500 italic">{p.dateDebut} <br/> {p.dateFin}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    p.etat === 'TERMINE' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {p.etat || 'EN COURS'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <Link title="Détail" to={`/projets/${p.id}`} className="p-2 text-slate-400 hover:text-blue-600 inline-block"><Eye size={18}/></Link>
                  <Link title="Résumé" to={`/projets/resume/${p.id}`} className="p-2 text-slate-400 hover:text-emerald-600 inline-block"><FileText size={18}/></Link>
                  <Link title="Phases" to={`/projets/${p.id}/phases`} className="p-2 text-slate-400 hover:text-indigo-600 inline-block"><Layers size={18}/></Link>
                  <Link title="Documents" to={`/projets/${p.id}/documents`} className="p-2 text-slate-400 hover:text-cyan-600 inline-block"><FileCode size={18}/></Link>
                  <Link title="Affectations" to={`/projets/${p.id}/affectations`} className="p-2 text-slate-400 hover:text-fuchsia-600 inline-block"><UserPlus size={18}/></Link>
                  {canManage && <Link title="Modifier" to={`/projets/edit/${p.id}`} className="p-2 text-slate-400 hover:text-amber-600 inline-block"><Edit size={18}/></Link>}
                  {canManage && <button title="Supprimer" onClick={() => setDeleteTarget(p)} className="p-2 text-slate-400 hover:text-red-600 inline-block"><Trash2 size={18}/></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Suppression projet"
      >
        <p>
          Voulez-vous vraiment supprimer le projet <strong>{deleteTarget?.code || deleteTarget?.nom}</strong> ?
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