import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { livrableSchema } from '../../utils/livrableSchema';
import { useParams, useNavigate } from 'react-router-dom';
import { livrableService } from '../../services/livrableService';
import { phaseService } from '../../services/phaseService';
import { Upload, ArrowLeft, FileCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LivrableForm() {
  const { phaseId, id } = useParams();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [phases, setPhases] = useState([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState(phaseId || "");

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(livrableSchema)
  });

  const fileField = watch("fichier");
  useEffect(() => {
    if (fileField && fileField.length > 0) {
      setFileName(fileField[0].name);
    }
  }, [fileField]);

  useEffect(() => {
    if (id) livrableService.getById(id).then(reset);
    // Si on vient de la page globale "Livrables", on charge la liste des phases pour le select
    if (!phaseId) phaseService.getAll().then(setPhases).catch(() => setPhases([]));
  }, [id, reset, phaseId]);

  const onSubmit = async (data) => {
    if (!phaseId && !selectedPhaseId) {
      alert("Veuillez sélectionner une Phase pour ce livrable.");
      return;
    }

    const targetPhaseId = phaseId || selectedPhaseId;
    const formData = new FormData();
    formData.append('nom', data.nom);
    formData.append('description', data.description || "");
    if (data.fichier && data.fichier[0]) {
      formData.append('file', data.fichier[0]);
    }

    try {
      if (id) await livrableService.update(id, formData);
      else await livrableService.create(targetPhaseId, formData);
      navigate(-1);
    } catch (e) {
      alert("Erreur lors de l'upload du livrable");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase">
        <ArrowLeft size={14}/> Retour aux livrables
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6 font-medium">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter border-b pb-4">
          {id ? 'Éditer le Livrable' : 'Soumission de Livrable'}
        </h2>

        {/* SÉLECTEUR DE PHASE SI AJOUT GLOBAL */}
        {!phaseId && !id && (
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Phase liée au Livrable</label>
            <select
              value={selectedPhaseId}
              onChange={(e) => setSelectedPhaseId(e.target.value)}
              className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600 font-bold"
            >
              <option value="">-- Sélectionnez une phase --</option>
              {phases.map(p => <option key={p.id} value={p.id}>{p.nom || `Phase #${p.id}`} {p.projet ? `(Projet: ${p.projet.nom})` : ''}</option>)}
            </select>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Intitulé du livrable</label>
          <input
            {...register('nom')}
            className={`w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 ${errors.nom ? 'focus:ring-red-500' : 'focus:ring-blue-600'}`}
            placeholder="Ex: Rapport Final Technique"
          />
          {errors.nom && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.nom.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Notes (Optionnel)</label>
          <textarea {...register('description')} className="w-full p-3 bg-slate-50 rounded-xl border-none min-h-[80px]" />
        </div>

        {/* ZONE D'UPLOAD STYLISÉE (Consigne Prof) */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Fichier de preuve</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-blue-50/30 transition-all cursor-pointer group">
            <input type="file" {...register('fichier')} className="absolute inset-0 opacity-0 cursor-pointer" />
            {fileName ? (
              <div className="flex flex-col items-center text-blue-600 animate-in zoom-in duration-300">
                <FileCheck size={40} />
                <p className="mt-2 text-xs font-black truncate max-w-xs uppercase tracking-widest">{fileName}</p>
              </div>
            ) : (
              <>
                <Upload size={32} className="mx-auto text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Glissez votre fichier ici ou cliquez pour parcourir</p>
                <p className="text-[9px] text-slate-300 mt-1 italic font-bold uppercase">(PDF, ZIP, MAX 10 MO)</p>
              </>
            )}
          </div>
          {errors.fichier && <p className="text-red-500 text-[10px] font-bold mt-1 text-center">{errors.fichier.message}</p>}
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all">
          Enregistrer le Livrable
        </button>
      </form>
    </div>
  );
}