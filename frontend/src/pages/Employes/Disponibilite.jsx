import { useState } from 'react';
import { employeService } from '../../services/employeService';
import { Search } from 'lucide-react';

export default function Disponibilite() {
  const [range, setRange] = useState({ debut: '', fin: '' });
  const [dispos, setDispos] = useState([]);

  const find = async () => {
    if (range.debut && range.fin) {
      const data = await employeService.getDisponibles(range.debut, range.fin);
      setDispos(data);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Vérification de disponibilité</h2>
      <div className="bg-white p-6 rounded-2xl border flex items-end gap-4 shadow-sm">
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Du</label>
          <input type="date" className="w-full p-2 bg-slate-50 rounded-lg border-none" onChange={e => setRange({...range, debut: e.target.value})} />
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Au</label>
          <input type="date" className="w-full p-2 bg-slate-50 rounded-lg border-none" onChange={e => setRange({...range, fin: e.target.value})} />
        </div>
        <button onClick={find} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-bold">Chercher</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dispos.map(e => (
          <div key={e.id} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm animate-in zoom-in duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full font-black uppercase tracking-tighter">
              {e.nom[0]}{e.prenom[0]}
            </div>
            <div>
              <p className="font-bold text-slate-800">{e.nom} {e.prenom}</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Disponible</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
