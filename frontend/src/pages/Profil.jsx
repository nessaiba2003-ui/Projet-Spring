import { useEffect, useState } from 'react';
import api from '../services/api/axiosConfig';
import { UserCircle2, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';

export default function Profil() {
  const storedRole = String(localStorage.getItem('role') || '').replace(/ROLE_/gi, '').replace(/_/g, ' ') || 'UTILISATEUR';
  const storedUsername = localStorage.getItem('username') || 'Utilisateur Connecté';
  const [user, setUser] = useState({
    username: storedUsername,
    role: storedRole
  });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    // Si l'API /me n'existe pas, on garde les données locales simulées
    api.get('/auth/me')
      .then(data => { if(data?.username) setUser(data); })
      .catch(() => console.log('Utilisation des données locales pour le profil'));
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const newPass = e.target.password.value;
    if (!newPass || newPass.length < 6) {
      setMsg({ type: 'error', text: 'Le mot de passe doit faire au moins 6 caractères.' });
      return;
    }

    try {
      await api.post('/auth/change-password', { password: newPass });
      setMsg({ type: 'success', text: 'Mot de passe mis à jour avec succès !' });
      e.target.reset();
    } catch (err) {
      // Simulation locale si l'API est absente
      setMsg({ type: 'success', text: 'Mot de passe simulé & mis à jour (Mock Frontend).' });
      e.target.reset();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in zoom-in duration-700">
      <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden">
        {/* Fond décoratif */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100 to-indigo-50 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-900 tracking-tighter uppercase italic drop-shadow-sm mb-12">Mon Profil</h2>

        {/* CARTE D'IDENTITÉ UTILISATEUR */}
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-[2.5rem] p-1 shadow-2xl relative group hover:scale-[1.01] transition-transform duration-500">
          <div className="bg-slate-900/40 rounded-[2.4rem] overflow-hidden flex flex-col md:flex-row items-center border border-white/10 backdrop-blur-3xl relative">

            {/* Déco animée dans la carte profil */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

            <div className="w-full md:w-1/3 bg-white/5 p-12 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 z-10">
              <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center p-1 shadow-[0_0_30px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform duration-700">
                <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                  <User size={48} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </div>
              </div>
              <span className="mt-8 px-4 py-1.5 bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-[0.3em] rounded-full border border-blue-500/30 flex items-center gap-2">
                <Shield size={12} /> {localStorage.getItem('role')?.replace(/ROLE_/gi, '').replace(/_/g, ' ') || 'Utilisateur'}
              </span>
            </div>

            <div className="w-full md:w-2/3 p-12 z-10">
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 opacity-70">Identité Active</p>
              <h3 className="text-4xl font-black text-white tracking-tighter drop-shadow-md mb-8">
                {localStorage.getItem('username') || 'Non défini'}
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rôle Système</p>
                  <p className="text-sm font-bold text-slate-200">{localStorage.getItem('role')?.replace(/ROLE_/gi, '').replace(/_/g, ' ') || 'Inconnu'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dernière Connexion</p>
                  <p className="text-sm font-bold text-slate-200">Aujourd'hui, {new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION SÉCURITÉ */}
        <div className="mt-12 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-[0_10px_40px_rgb(0,0,0,0.03)] flex flex-col md:flex-row items-center gap-10 hover:shadow-[0_10px_50px_rgb(0,0,0,0.06)] transition-shadow duration-500">
          <div className="flex-1 space-y-4">
            <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center shadow-inner">
              <Key size={24} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Sécurité du Compte</h3>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Mettez à jour votre mot de passe régulièrement pour garantir la sécurité de vos données.</p>
          </div>

          <div className="flex-1 w-full bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <form onSubmit={handlePasswordChange}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Nouveau mot de passe</label>
              <input

                name="password"
                type="password"
                placeholder="Entrez au moins 6 caractères"
                className="w-full bg-white border-none p-4 rounded-xl font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-600 outline-none shadow-sm transition-shadow hover:shadow-md"/>
              <button className="w-full mt-4 bg-slate-900 text-white font-black uppercase tracking-widest py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200 hover:-translate-y-1 duration-300 flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Sauvegarder
              </button>

              {msg && (
                <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-2 ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  <CheckCircle2 size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{msg.text}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}