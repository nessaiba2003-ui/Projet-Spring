import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { projetService } from '../../services/projetService';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

export default function ProjetResume() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    projetService.getById(id).then(setData).catch(console.error);
  }, [id]);

  if (!data) return <div className="p-20 text-center font-bold text-slate-300">Chargement du résumé...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in duration-300">
      <div className="bg-slate-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10"><Briefcase size={120}/></div>
        <h2 className="text-4xl font-black uppercase tracking-tighter">{data.nom}</h2>
        <p className="text-blue-400 font-bold tracking-widest mt-2">{data.code} • CLIENT : {data.organisme?.nom}</p>

        <div className="mt-10 flex gap-8">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-slate-500" />
            <span className="font-bold">{data.dateDebut} au {data.dateFin}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-green-500" />
            <span className="font-black uppercase text-xs">Statut : {data.etat || 'En cours'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Responsable</p>
           <p className="text-xl font-bold text-slate-800">{data.chefProjet?.nom} {data.chefProjet?.prenom}</p>
           <p className="text-sm text-slate-500 italic mt-1">{data.chefProjet?.email}</p>
        </div>
        <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-lg">
           <p className="text-[10px] font-black text-blue-200 uppercase mb-4 tracking-widest">Récapitulatif Financier</p>
           <p className="text-3xl font-black italic tracking-tighter">Phase 6 Validée</p>
           <p className="text-blue-100 text-xs mt-2 italic font-medium">L'intégration des budgets se fera en Phase 7.</p>
        </div>
      </div>
    </div>
  );
}