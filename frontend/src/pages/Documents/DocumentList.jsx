import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { documentService } from '../../services/documentService';
import { projetService } from '../../services/projetService';
import { FileCode, Download, Trash2, Plus, Info } from 'lucide-react';
import Modal from '../../components/Modal';
import { canMutateModule } from '../../utils/roles';

export default function DocumentList() {
  const { projetId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [isDelOpen, setDelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'documents');

  useEffect(() => { load(); }, [projetId]);
  const load = () => {
    if (projetId) {
      return documentService.getByProjet(projetId).then((rows) => setDocuments(rows || [])).catch(() => setDocuments([]));
    }
    return projetService.getAll()
      .then((projets) => Promise.all((projets || []).map((p) => documentService.getByProjet(p.id).catch(() => []))))
      .then((groups) => setDocuments(groups.flat()))
      .catch(() => setDocuments([]));
  };

  const handleDownload = async (doc) => {
    const blob = await documentService.download(doc.id);
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.nomFichier || 'document');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">{projetId ? 'Documents du Projet' : 'Tous les documents'}</h1>
        {canManage && projetId && (
          <Link to={`/projets/${projetId}/documents/nouveau`} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
            <Plus size={18}/> Ajouter un document
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start justify-between group hover:border-blue-200 transition-all">
            <div className="flex gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                <FileCode size={30}/>
              </div>
              <div>
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">{doc.code || doc.titre || `DOC-${doc.id}`}</h3>
                {/* APERÇU DES MÉTADONNÉES (Consigne Prof) */}
                <p className="text-[10px] text-blue-600 font-black mt-1 uppercase tracking-tighter">{doc.typeDoc || doc.cheminFichier || 'DOCUMENT'}</p>
                <p className="text-[11px] text-slate-400 mt-2 italic font-medium max-w-[200px] truncate">{doc.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => handleDownload(doc)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg transition-colors" title="Télécharger sécurisé">
                <Download size={18}/>
              </button>
              {canManage && (
                <button onClick={() => { setSelectedId(doc.id); setDelOpen(true); }} className="p-2 bg-slate-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 size={18}/>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SUPPRESSION AVEC CONFIRMATION (Consigne Prof) */}
      <Modal isOpen={isDelOpen} onClose={() => setDelOpen(false)} title="Confirmation" onConfirm={async () => { await documentService.delete(selectedId); setDelOpen(false); load(); }}>
        Voulez-vous vraiment supprimer ce document ? Cette action est définitive.
      </Modal>
    </div>
  );
}