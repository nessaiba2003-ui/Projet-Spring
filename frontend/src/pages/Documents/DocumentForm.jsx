import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { documentSchema } from '../../utils/documentSchema';
import { documentService } from '../../services/documentService';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, FileUp } from 'lucide-react';

export default function DocumentForm() {
  const { projetId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(documentSchema)
  });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('titre', data.titre);
    formData.append('typeDoc', data.typeDoc);
    formData.append('description', data.description);
    formData.append('file', data.fichier[0]);

    try {
      await documentService.create(projetId, formData);
      navigate(-1);
    } catch (e) { alert("Erreur d'upload"); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6 font-medium">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter border-b pb-4">Nouveau Document Projet</h2>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Titre du document</label>
          <input {...register('titre')} className="w-full p-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-blue-600" />
          {errors.titre && <p className="text-red-500 text-[10px] font-bold">{errors.titre.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Type de document</label>
          <select {...register('typeDoc')} className="w-full p-3 bg-slate-50 rounded-xl border-none font-bold">
            <option value="">Sélectionner...</option>
            <option value="CAHIER_CHARGES">Cahier des charges</option>
            <option value="CONTRAT">Contrat signé</option>
            <option value="PV_RECEPTION">PV de réception</option>
          </select>
          {errors.typeDoc && <p className="text-red-500 text-[10px] font-bold">{errors.typeDoc.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Description</label>
          <textarea {...register('description')} className="w-full p-3 bg-slate-50 rounded-xl border-none min-h-[80px]" />
        </div>

        {/* UPLOAD DE FICHIER (Consigne Prof) */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase">Fichier</label>
          <div className="relative border-2 border-dashed border-slate-100 rounded-2xl p-10 text-center hover:bg-blue-50/20 transition-all cursor-pointer group">
            <input type="file" {...register('fichier')} className="absolute inset-0 opacity-0 cursor-pointer" />
            <FileUp size={40} className="mx-auto text-blue-500 mb-2" />
            <p className="text-[10px] font-black text-slate-400 uppercase">Choisir le fichier (PDF, DOCX, ZIP)</p>
          </div>
          {errors.fichier && <p className="text-red-500 text-[10px] font-bold text-center mt-2">{errors.fichier.message}</p>}
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-200">Enregistrer le document</button>
      </form>
    </div>
  );
}