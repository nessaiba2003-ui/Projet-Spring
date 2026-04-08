import { useEffect, useState } from 'react';
import { projetService } from '../../services/projetService';
import { Search, Plus, Eye, Edit, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjetList() {
  const [projets, setProjets] = useState([]);
  const [filters, setFilters] = useState({ code: '', organisme: '', chef: '' });

  useEffect(() => {
    projetService.getAll().then(setProjets).catch(console.error);
  }, []);

  const filtered = projets.filter(p =>
    p.code.toLowerCase().includes(filters.code.toLowerCase()) &&
    p.organisme?.nom.toLowerCase().includes(filters.organisme.toLowerCase()) &&
    (p.chefProjet?.nom + " " + p.chefProjet?.prenom).toLowerCase().includes(filters.chef.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestion des Projets</h1>
        <Link to="/projets/nouveau" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700">
          <Plus size={20}/> Nouveau Projet
        </Link>
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
                  <Link title="Modifier" to={`/projets/edit/${p.id}`} className="p-2 text-slate-400 hover:text-amber-600 inline-block"><Edit size={18}/></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}