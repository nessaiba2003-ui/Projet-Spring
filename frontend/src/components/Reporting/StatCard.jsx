import React from 'react';

export default function StatCard({ label, value, icon, colorClass, accentClass = 'from-slate-100 to-white' }) {
  return (
    <div className={`bg-gradient-to-br ${accentClass} p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-xl hover:shadow-slate-100 transition-all`}>
      <div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">{label}</p>
        <p className={`text-2xl font-black tracking-tighter ${colorClass}`}>{value}</p>
      </div>
      <div className="p-4 bg-white/80 rounded-2xl text-slate-400 shadow-sm">{icon}</div>
    </div>
  );
}