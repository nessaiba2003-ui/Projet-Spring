import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { livrableService } from '../../services/livrableService';
import { FileText, Plus, Edit, Trash2, Download, Clock } from 'lucide-react';

export default function LivrableList() {
  const { phaseId } = useParams();
  const [livrables, setLivrables] = useState([]);

  useEffect(() => { load(); }, [phaseId]);

  const load = () => {
    if (phaseId) {
      livrableService.getByPhase(phaseId).then(data => setLivrables(data || [])).catch(() => setLivrables([]));
    } else {
      livrableService.getAll().then(data => setLivrables(data || [])).catch(() => setLivrables([]));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'VALIDE': return 'bg-green-100 text-green-700';
      case 'A_CORRIGER': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Livrables {phaseId ? `de la Phase` : `Globaux`}</h1>
        <Link to={phaseId ? `/phases/${phaseId}/livrables/nouveau` : `/livrables/nouveau`} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-200">
          <Plus size={18}/> Nouveau Livrable
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {livrables.length > 0 ? livrables.map((l) => (
          <div key={l.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><FileText size={24}/></div>
              <div>
                <h3 className="font-bold text-slate-800">{l.nom}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Soumis le : {l.dateSoumission}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {/* AFFICHAGE DU STATUT (Consigne Prof) */}
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(l.statut)}`}>
                {l.statut || 'EN ATTENTE'}
              </span>

              <div className="flex gap-2 border-l pl-6 border-slate-100">
                <button className="p-2 text-slate-400 hover:text-blue-600" title="Télécharger"><Download size={18}/></button>
                <Link to={`/livrables/edit/${l.id}`} className="p-2 text-slate-400 hover:text-amber-600"><Edit size={18}/></Link>
                <button onClick={() => {if(window.confirm("Supprimer ?")) livrableService.delete(l.id).then(load)}} className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
              </div>
            </div>
          </div>
        )) : (
          <div className="p-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100 text-slate-300 font-bold uppercase tracking-widest">
            Aucun livrable déposé pour le moment
          </div>
        )}
      </div>
    </div>
  );
}