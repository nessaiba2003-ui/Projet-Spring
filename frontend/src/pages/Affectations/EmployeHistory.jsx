import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { affectationService } from '../../services/affectationService';
import { CheckCircle } from 'lucide-react';

export default function EmployeHistory() {
  const { id } = useParams();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    affectationService.getHistoryByEmploye(id).then(setHistory);
  }, [id]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Historique des Phases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((h, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{h.phase?.nom}</p>
              <p className="font-bold text-slate-700 mt-1">{h.phase?.projet?.nom}</p>
              <p className="text-[10px] text-slate-400 mt-2 font-bold">{h.dateDebut} — {h.dateFin}</p>
            </div>
            <CheckCircle className="text-green-500" size={24}/>
          </div>
        ))}
      </div>
    </div>
  );
}