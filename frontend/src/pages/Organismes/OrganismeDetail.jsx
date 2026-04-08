import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { organismeService } from '../../services/organismeService';
import { Building2, ArrowLeft } from 'lucide-react';

export default function OrganismeDetail() {
  const { id } = useParams();
  const [org, setOrg] = useState(null);

  useEffect(() => { organismeService.getById(id).then(setOrg); }, [id]);

  if (!org) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/organismes" className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase"><ArrowLeft size={14}/> Retour</Link>
      <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner"><Building2 size={40}/></div>
        <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-2">{org.nom}</h1>
        <p className="text-blue-600 font-black text-sm tracking-widest border-b pb-4 w-full">CODE : {org.code}</p>
        <div className="mt-8 space-y-4 w-full text-left">
           <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</p><p className="font-bold text-slate-700">{org.contact}</p></div>
           <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse</p><p className="font-bold text-slate-700">{org.adresse || 'Non renseignée'}</p></div>
        </div>
      </div>
    </div>
  );
}