import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function Modal({ isOpen, onClose, onConfirm, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2 text-red-600 font-black uppercase text-xs tracking-widest">
            <AlertTriangle size={18} /> {title}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-8 text-slate-600 font-medium">
          {children}
        </div>
        <div className="p-6 bg-slate-50 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-xl transition-colors">
            Annuler
          </button>
          <button onClick={onConfirm} className="px-5 py-2 bg-red-600 text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors">
            Confirmer la suppression
          </button>
        </div>
      </div>
    </div>
  );
}