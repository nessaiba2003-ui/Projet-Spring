import { Search } from 'lucide-react';

export default function FilterBar({ filters, setFilters, onApply }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-end mb-8">
      <div className="flex-1 min-w-[200px]">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Période</label>
        <div className="flex gap-2 mt-1">
          <input type="date" className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-2"
            onChange={(e) => setFilters({...filters, dateDebut: e.target.value})} />
          <input type="date" className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-2"
            onChange={(e) => setFilters({...filters, dateFin: e.target.value})} />
        </div>
      </div>
      <div className="flex-1 min-w-[150px]">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Projet</label>
        <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-2 mt-1"
          onChange={(e) => setFilters({...filters, projetId: e.target.value})}>
          <option value="">Sélectionner Projet</option>
        </select>
      </div>
      <div className="flex-1 min-w-[150px]">
        <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Chef de Projet</label>
        <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-2 mt-1"
          onChange={(e) => setFilters({...filters, chefId: e.target.value})}>
          <option value="">Sélectionner Chef</option>
        </select>
      </div>
      <button onClick={onApply} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition">
        <Search size={20} />
      </button>
    </div>
  );
}