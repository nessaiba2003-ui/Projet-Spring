import { useEffect, useState } from 'react';
import { organismeService } from '../../services/organismeService';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom'; // AJOUTÉ
import Modal from '../../components/Modal';

export default function OrganismeList() {
  const [organismes, setOrganismes] = useState([]);
  const [search, setSearch] = useState({ nom: '', code: '' });
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => { loadOrganismes(); }, []);

  const loadOrganismes = async () => {
    try {
      const data = await organismeService.getAll();
      setOrganismes(data || []);
    } catch (err) { setOrganismes([]); }
  };

  const handleDelete = async () => {
    try {
      await organismeService.delete(selectedId);
      setDeleteModalOpen(false);
      loadOrganismes();
    } catch (err) { alert("Erreur lors de la suppression backend"); }
  };

  const filteredData = organismes.filter(o =>
    o.nom.toLowerCase().includes(search.nom.toLowerCase()) &&
    o.code.toLowerCase().includes(search.code.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Répertoire Organismes</h1>
        {/* LIEN VERS FORMULAIRE AJOUT */}
        <Link to="/organismes/nouveau" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-blue-700 transition-all">
          <Plus size={20}/> Nouvel Organisme
        </Link>
      </div>

      {/* RECHERCHE MULTICRITÈRE */}
      <div className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 border border-slate-100 items-center">
        <Search className="text-slate-400" size={20}/>
        <input
          type="text" placeholder="Rechercher par nom..."
          className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-slate-600"
          onChange={(e) => setSearch({...search, nom: e.target.value})}
        />
        <input
          type="text" placeholder="Code..."
          className="w-32 p-2 bg-slate-50 border-none rounded-lg text-xs font-bold"
          onChange={(e) => setSearch({...search, code: e.target.value})}
        />
      </div>

      {/* TABLEAU PAGINÉ */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden text-sm font-medium">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 font-black text-slate-400 uppercase text-[10px]">Code</th>
              <th className="p-5 font-black text-slate-400 uppercase text-[10px]">Nom</th>
              <th className="p-5 font-black text-slate-400 uppercase text-[10px]">Contact</th>
              <th className="p-5 font-black text-slate-400 uppercase text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredData.map((org) => (
              <tr key={org.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-5 font-bold text-blue-600 uppercase italic">{org.code}</td>
                <td className="p-5 text-slate-700 font-bold">{org.nom}</td>
                <td className="p-5 text-slate-500 italic">{org.contact}</td>
                <td className="p-5 text-right space-x-1">
                  <Link to={`/organismes/${org.id}`} className="p-2 text-slate-300 hover:text-blue-600 inline-block"><Eye size={18}/></Link>
                  <Link to={`/organismes/edit/${org.id}`} className="p-2 text-slate-300 hover:text-amber-600 inline-block"><Edit size={18}/></Link>
                  <button
                    onClick={() => { setSelectedId(org.id); setDeleteModalOpen(true); }}
                    className="p-2 text-slate-300 hover:text-red-600"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirmation de suppression"
      >
        Êtes-vous sûr de vouloir supprimer cet organisme ? Les projets associés seront impactés.
      </Modal>
    </div>
  );
}