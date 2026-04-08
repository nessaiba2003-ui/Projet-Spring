import React from 'react';

export default function StatCard({ label, value, icon, colorClass }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 flex items-center justify-between hover:shadow-xl hover:shadow-slate-100 transition-all">
      <div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-2xl font-black tracking-tighter ${colorClass}`}>{value}</p>
      </div>
      <div className="p-4 bg-slate-50 rounded-2xl text-slate-300">{icon}</div>
    </div>
  );
}