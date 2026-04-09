import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { employeService } from '../../services/employeService';

export default function EmployeDetail() {
  const { id } = useParams();
  const [e, setE] = useState(null);
  useEffect(() => { employeService.getById(id).then(setE); }, [id]);

  if (!e) return null;

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-6 border-b pb-8">
        <div className="w-24 h-24 bg-slate-900 text-white rounded-3xl flex items-center justify-center text-4xl font-black italic">{e.nom[0]}</div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">{e.nom} {e.prenom}</h1>
          <p className="text-blue-600 font-bold uppercase text-xs tracking-widest">Matricule : {e.matricule}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div><p className="text-slate-400 font-bold uppercase text-[10px]">Email</p><p className="font-bold text-slate-700 mt-1">{e.email}</p></div>
        <div><p className="text-slate-400 font-bold uppercase text-[10px]">Login Système</p><p className="font-bold text-slate-700 mt-1">{e.login}</p></div>
      </div>
    </div>
  );
}