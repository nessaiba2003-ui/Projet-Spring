import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { affectationService } from '../../services/affectationService';
import { employeService } from '../../services/employeService';
import { Trash2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AffectationModule() {
  const { phaseId } = useParams();
  const [affectations, setAffectations] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [form, setForm] = useState({ employeId: '', dateDebut: '', dateFin: '', chargeHoraire: '' });
  const [dispoMsg, setDispoMsg] = useState(null);

  useEffect(() => {
    if (phaseId) loadAffectations();
    else affectationService.getAll().then(data => setAffectations(data || [])).catch(() => setAffectations([]));

    employeService.getAll().then(data => setEmployes(data || [])).catch(error => {
      console.warn("Accès refusé ou impossible de charger les employés", error);
      setEmployes([]);
    });
  }, [phaseId]);

  const loadAffectations = () => {
    affectationService.getByPhase(phaseId).then(data => setAffectations(data || [])).catch(error => {
      console.warn("Impossible de charger les affectations", error);
      setAffectations([]);
    });
  };

  // --- CONSIGNES PROF : DISPONIBILITÉ & DOUBLONS ---
  const handleCheck = async () => {
    if (!form.employeId || !form.dateDebut || !form.dateFin) {
      setDispoMsg({ type: 'error', text: 'Veuillez remplir Employé + Dates avant de vérifier' });
      return;
    }

    // 1. Blocage des doublons
    const isAlreadyAssigned = affectations.find(a => String(a.employeId) === String(form.employeId));
    if (isAlreadyAssigned) {
      setDispoMsg({ type: 'error', text: 'ERREUR : Cet employé est déjà affecté à cette phase !' });
      return;
    }

    // 2. Contrôle disponibilité Backend
    try {
      const dispos = await employeService.getDisponibles(form.dateDebut, form.dateFin);
      const isFree = dispos.find(e => String(e.id) === String(form.employeId));

      if (isFree) {
        setDispoMsg({ type: 'success', text: 'OK : Employé disponible sur cette période.' });
      } else {
        setDispoMsg({ type: 'error', text: 'OCCUPÉ : Cet employé a déjà une autre mission sur ces dates.' });
      }
    } catch (err) {
      setDispoMsg({ type: 'error', text: 'Erreur lors de la vérification.' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!dispoMsg || dispoMsg.type === 'error') {
      alert("Veuillez vérifier la disponibilité avant d'affecter.");
      return;
    }

    try {
      await affectationService.create({ ...form, phaseId });
      loadAffectations();
      setForm({ employeId: '', dateDebut: '', dateFin: '', chargeHoraire: '' });
      setDispoMsg(null);
    } catch (err) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Affectations {phaseId ? `Phase : ${phaseId}` : `Globales`}</h1>

      {phaseId && (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Sélection Employé</label>
            <select
              value={form.employeId}
              onChange={(e) => { setForm({...form, employeId: e.target.value}); setDispoMsg(null); }}
              className="w-full p-2.5 bg-slate-50 rounded-xl border-none font-bold text-sm"
            >
              <option value="">Choisir...</option>
              {employes.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Période (Début - Fin)</label>
            <div className="flex gap-1">
              <input type="date" className="w-1/2 p-2 bg-slate-50 rounded-lg text-[10px]" onChange={e => {setForm({...form, dateDebut: e.target.value}); setDispoMsg(null);}} />
              <input type="date" className="w-1/2 p-2 bg-slate-50 rounded-lg text-[10px]" onChange={e => {setForm({...form, dateFin: e.target.value}); setDispoMsg(null);}} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Charge (H)</label>
            <input type="number" value={form.chargeHoraire} className="w-full p-2.5 bg-slate-50 rounded-xl border-none" onChange={e => setForm({...form, chargeHoraire: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleCheck} className="flex-1 bg-slate-800 text-white p-3 rounded-xl font-bold text-[10px] uppercase hover:bg-slate-700">Vérifier</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-black uppercase text-[10px] hover:bg-blue-700 shadow-lg shadow-blue-200">Affecter</button>
          </div>
        </div>

        {dispoMsg && (
          <div className={`p-4 rounded-xl flex items-center gap-3 border animate-in slide-in-from-top-2 ${dispoMsg.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
            {dispoMsg.type === 'error' ? <AlertCircle size={18}/> : <CheckCircle2 size={18}/>}
            <span className="text-xs font-bold uppercase tracking-tight">{dispoMsg.text}</span>
          </div>
          )}
        </form>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-5 text-xs font-black text-slate-400 uppercase">Employé</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase">Période d'affectation</th>
              <th className="p-5 text-xs font-black text-slate-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {affectations.map((aff) => {
              const e = employes.find(emp => String(emp.id) === String(aff.employeId)) || aff.employe;
              return (
              <tr key={aff.employeId} className="hover:bg-slate-50/50 transition-colors font-medium">
                <td className="p-5 text-slate-700 uppercase text-xs font-bold">{e?.nom || `Employé #${aff.employeId}`} {e?.prenom}</td>
                <td className="p-5">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                    <Calendar size={14}/> {aff.dateDebut} au {aff.dateFin}
                    <span className="ml-2 text-blue-600 font-black">({aff.chargeHoraire}h)</span>
                  </div>
                </td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => { if(window.confirm("Confirmer la suppression ?")) affectationService.delete(phaseId, aff.employeId).then(loadAffectations); }}
                    className="p-2 text-slate-300 hover:text-red-500"
                  >
                    <Trash2 size={18}/>
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}