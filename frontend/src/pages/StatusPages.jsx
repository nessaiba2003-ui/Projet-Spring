import { ShieldAlert, FileSearch } from 'lucide-react';

export const Page404 = () => (
  <div className="h-full flex flex-col items-center justify-center text-center py-20">
    <FileSearch size={100} className="text-slate-200 mb-6" />
    <h2 className="text-5xl font-black text-slate-800 tracking-tighter">404</h2>
    <p className="text-slate-500 mt-2 font-medium">La page que vous recherchez est introuvable.</p>
  </div>
);

export const AccessDenied = () => (
  <div className="h-full flex flex-col items-center justify-center text-center py-20">
    <ShieldAlert size={100} className="text-red-100 mb-6" />
    <h2 className="text-3xl font-black text-red-600 tracking-tighter uppercase">Accès Refusé</h2>
    <p className="text-slate-500 mt-2 font-medium">Vous n'avez pas les droits nécessaires pour accéder à ce module.</p>
  </div>
);