import { useEffect, useMemo, useState } from 'react';
import { factureService } from '../../services/factureService';
import { Receipt, CalendarDays, Landmark } from 'lucide-react';

export default function PaymentList() {
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    factureService.getAll().then((data) => setFactures(data || [])).catch(() => setFactures([]));
  }, []);

  const paidFactures = useMemo(
    () => factures.filter((f) => f?.payee === true || f?.statut === 'PAYEE'),
    [factures]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Suivi des Paiements</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
          Factures encaissées (payee=true)
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden text-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest">Référence</th>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest">Montant</th>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest">Date de paiement</th>
              <th className="p-4 font-black text-slate-400 uppercase tracking-widest">Projet associé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paidFactures.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest">
                  Aucune facture payée
                </td>
              </tr>
            ) : (
              paidFactures.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-700">{f.reference || `FAC-${f.id}`}</td>
                  <td className="p-4 font-black text-emerald-600">{f.montant ?? f.montantTTC ?? 0} MAD</td>
                  <td className="p-4 text-slate-600">
                    {f.datePaiement || f.dateFacture || '-'}
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {f.phase?.projet?.nom || f.projet?.nom || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
