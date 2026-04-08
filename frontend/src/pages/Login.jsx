import { useForm } from 'react-hook-form';
import api from '../services/api/axiosConfig';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // 1. On récupère la réponse (déjà normalisée avec .data par l'intercepteur)
      const response = await api.post('/auth/login', data);

      // 2. IMPORTANT : Les vraies données de profil (rôle, nom) sont maintenant renvoyées par le Backend !
      const userData = response.token ? response : response.data;

      if (!userData || !userData.token) {
        throw new Error('Identifiants incorrects');
      }

      // 3. Stockage des vraies informations utilisateur
      localStorage.setItem('token', userData.token);

      // On sauvegarde le vrai rôle renvoyé par la BDD et le vrai nom !
      if (userData.role) {
        localStorage.setItem('role', userData.role);
      }
      if (userData.username) {
        localStorage.setItem('username', userData.username);
      }

      // 5. Redirection
      navigate('/dashboard');

      // Optionnel : recharge la page pour forcer la Sidebar à lire le nouveau rôle
      window.location.reload();
    } catch (err) {
      alert("Erreur d'authentification : Identifiants incorrects");
      console.error(err);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Blobs Lumineux Animés */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative max-w-md w-full bg-white/5 backdrop-blur-2xl p-12 rounded-[3rem] shadow-2xl border border-white/10 text-center transform hover:scale-[1.02] transition-transform duration-500">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 uppercase italic tracking-tighter mb-2 drop-shadow-lg">PROJET-MANAGER</h1>
        <p className="text-blue-200/50 font-bold text-[10px] uppercase tracking-[0.3em] mb-12">Authentification Sécurisée</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative group">
            <input
              {...register('login')}
              placeholder="Nom d'utilisateur"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white placeholder:text-white/20 focus:bg-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 group-hover:bg-white/10"
            />
          </div>

          <div className="relative group">
            <input
              {...register('password')}
              type="password"
              placeholder="Mot de passe"
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl font-bold text-white placeholder:text-white/20 focus:bg-white/10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 group-hover:bg-white/10"
            />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all duration-300 mt-4">
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}