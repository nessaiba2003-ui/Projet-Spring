import { Edit, Trash2 } from 'lucide-react';

export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{col.label}</th>
            ))}
            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.length > 0 ? data.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="p-4 text-sm text-slate-600">{item[col.key]}</td>
              ))}
              <td className="p-4 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md inline-block"><Edit size={16}/></button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-md inline-block"><Trash2 size={16}/></button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan={columns.length + 1} className="p-10 text-center text-slate-400 italic">Aucune donnée disponible</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}