import { useEffect, useState } from 'react';
import { reportingService } from '../../services/reportingService';
import DataTable from '../../components/DataTable';
import Badge from '../../components/Badge';
import FilterBar from '../../components/Reporting/FilterBar';

export default function StatusPages({ type, title }) {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  // On utilise ton style : .then(setData)
  const loadData = () => {
    if(type === 'non-facturees') {
      reportingService.getPhasesNonFacturees(filters).then(setData);
    } else if(type === 'payees') {
      reportingService.getPhasesPayees(filters).then(setData);
    }
  };

  useEffect(() => { loadData(); }, [type]);

  const columns = [
    { key: 'projetNom', label: 'Projet' },
    { key: 'nom', label: 'Phase' },
    { key: 'montant', label: 'Montant' },
    { key: 'statut', label: 'État', render: (row) => (
      <Badge label={type === 'payees' ? 'Payé' : 'À Facturer'}
             type={type === 'payees' ? 'success' : 'warning'} />
    )},
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">{title}</h1>

      {/* Barre de filtre demandée par le prof */}
      <FilterBar filters={filters} setFilters={setFilters} onApply={loadData} />

      <DataTable
        columns={columns}
        data={data}
        // On enlève Edit/Delete ici car c'est du Reporting (consultation seule)
      />
    </div>
  );
}