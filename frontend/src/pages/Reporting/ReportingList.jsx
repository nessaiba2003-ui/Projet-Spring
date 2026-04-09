import { useEffect, useState } from 'react';
import { reportingService } from '../../services/reportingService';
import DataTable from '../../components/DataTable';
import FilterBar from '../../components/Reporting/FilterBar';

export default function ReportingList({ title, fetchMethod }) {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  const loadData = () => {
    reportingService[fetchMethod](filters).then(setData).catch(console.error);
  };

  useEffect(() => { loadData(); }, [fetchMethod]);

  const columns = [
    { key: 'projetNom', label: 'Projet' },
    { key: 'nom', label: 'Libellé' },
    { key: 'montant', label: 'Montant HT' },
    { key: 'date', label: 'Date' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{title}</h2>
      <FilterBar filters={filters} setFilters={setFilters} onApply={loadData} />
      <DataTable columns={columns} data={data} />
    </div>
  );
}