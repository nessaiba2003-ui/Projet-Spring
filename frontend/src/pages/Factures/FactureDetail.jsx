import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { factureService } from '../../services/factureService';
import { ArrowLeft } from 'lucide-react';

export default function FactureDetail() {
  const { id } = useParams();
  const [facture, setFacture] = useState(null);

  useEffect(() => {
    factureService.getById(id).then(setFacture).catch(() => setFacture(null));
  }, [id]);

  if (!facture) {
    return <div className="p-10 bg-white rounded-2xl border border-slate-100 text-slate-500 font-bold">Facture introuvable.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/factures" className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase">
        <ArrowLeft size={14} /> Retour aux factures
      </Link>
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Facture {facture.reference}</h1>
        <p className="text-slate-600"><span className="font-bold">Montant :</span> {facture.montant ?? 0} MAD</p>
        <p className="text-slate-600"><span className="font-bold">Date :</span> {facture.dateFacture || '-'}</p>
        <p className="text-slate-600"><span className="font-bold">Statut :</span> {facture.payee ? 'PAYEE' : 'FACTUREE'}</p>
        <p className="text-slate-600"><span className="font-bold">Projet :</span> {facture.phase?.projet?.nom || '-'}</p>
      </div>
    </div>
  );
}
