import { useEffect, useState } from 'react';
import { employeService } from '../../services/employeService';
import { Search, UserPlus, Eye, Edit, Trash2, CalendarSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmployeList() {
  const [employes, setEmployes] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => { load(); }, []);
  const load = async () => { const data = await employeService.getAll(); setEmployes(data); };

  const filtered = employes.filter(e =>
    e.matricule.toLowerCase().includes(filter.toLowerCase()) ||
    e.login.toLowerCase().includes(filter.toLowerCase()) ||
    e.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Gestion des Employés</h1>
        <div className="flex gap-3">
          <Link to="/employes/disponibilite" className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all">
            <CalendarSearch size={18}/> Disponibilité
          </Link>
          <Link to="/employes/nouveau" className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 transition-all">
            <UserPlus size={18}/> Ajouter un employé
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <Search className="text-slate-400" size={20}/>
        <input
          type="text"
          placeholder="Recherche multicritère (Matricule, Login, Email)..."
          className="flex-1 bg-transparent border-none focus:ring-0 font-medium text-slate-600"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest">Matricule</th>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest">Nom & Prénom</th>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest">Compte</th>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-blue-600 uppercase">{emp.matricule}</td>
                <td className="p-4 font-bold text-slate-700">{emp.nom} {emp.prenom}</td>
                <td className="p-4">
                  <div className="font-medium text-slate-600">{emp.email}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Login: {emp.login}</div>
                </td>
                <td className="p-4 text-right space-x-1">
                  <Link to={`/employes/${emp.id}`} className="p-2 text-slate-400 hover:text-blue-600 inline-block transition-colors"><Eye size={18}/></Link>
                  <Link to={`/employes/edit/${emp.id}`} className="p-2 text-slate-400 hover:text-amber-600 inline-block transition-colors"><Edit size={18}/></Link>
                  <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}