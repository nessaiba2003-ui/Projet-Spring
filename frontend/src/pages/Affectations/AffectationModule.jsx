import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { affectationService } from '../../services/affectationService';
import { employeService } from '../../services/employeService';
import { phaseService } from '../../services/phaseService';
import { projetService } from '../../services/projetService';
import { Trash2, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { canMutateModule } from '../../utils/roles';
import Modal from '../../components/Modal';

export default function AffectationModule() {
  const { phaseId, projetId } = useParams();
  const [affectations, setAffectations] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [form, setForm] = useState({ employeId: '', dateDebut: '', dateFin: '', role: '' });
  const [dispoMsg, setDispoMsg] = useState(null);
  const [projectPhases, setProjectPhases] = useState([]);
  const [selectedPhaseId, setSelectedPhaseId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saveError, setSaveError] = useState('');
  const role = useSelector((state) => state.auth.role);
  const canManage = canMutateModule(role, 'affectations');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (phaseId) loadAffectations();
    else if (projetId) {
      phaseService.getByProjet(projetId)
        .then((phases) => {
          const list = phases || [];
          setProjectPhases(list);
          if (list.length > 0) {
            const first = String(list[0].id);
            setSelectedPhaseId(first);
            return affectationService.getByPhase(first).then((rows) => setAffectations(rows || []));
          }
          setAffectations([]);
          return null;
        })
        .catch(() => {
          setProjectPhases([]);
          setAffectations([]);
        });
    } else {
      // Vue globale: afficher réellement toutes les affectations
      setLoading(true);
      affectationService.getAll()
        .then((rows) => setAffectations(rows || []))
        .catch(() => setAffectations([]))
        .finally(() => setLoading(false));
      projetService.getAll()
        .then((projets) => Promise.all((projets || []).map((p) => phaseService.getByProjet(p.id).catch(() => []))))
        .then((phaseGroups) => {
          const allPhases = phaseGroups.flat();
          setProjectPhases(allPhases);
        })
        .catch(() => {
          setProjectPhases([]);
        });
    }

    employeService.getAll().then(data => setEmployes(data || [])).catch(error => {
      console.warn("Accès refusé ou impossible de charger les employés", error);
      setEmployes([]);
    });
  }, [phaseId, projetId]);

  useEffect(() => {
    if (!phaseId && selectedPhaseId) {
      setLoading(true);
      affectationService.getByPhase(selectedPhaseId)
        .then((rows) => setAffectations(rows || []))
        .catch(() => setAffectations([]))
        .finally(() => setLoading(false));
    }
  }, [selectedPhaseId, phaseId, projetId]);

  const displayedAffectations = affectations;

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
    if ((phaseId || selectedPhaseId) === '') {
      setDispoMsg({ type: 'error', text: 'Veuillez sélectionner une phase.' });
      return;
    }
    if (form.dateDebut > form.dateFin) {
      setDispoMsg({ type: 'error', text: 'La date de début doit être antérieure à la date de fin.' });
      return;
    }

    // 1. Blocage des doublons
    const isAlreadyAssigned = affectations.find((a) => String(a?.id?.employeId || a?.employeId) === String(form.employeId));
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
    setSaveError('');
    if (!dispoMsg || dispoMsg.type === 'error') {
      setSaveError("Veuillez vérifier la disponibilité avant d'affecter.");
      return;
    }

    try {
      const targetPhaseId = phaseId || selectedPhaseId;
      if (!targetPhaseId) {
        setSaveError("Phase manquante.");
        return;
      }
      if (!form.role?.trim()) {
        setSaveError("Le rôle est obligatoire.");
        return;
      }
      await affectationService.create({
        phaseId: targetPhaseId,
        employeId: form.employeId,
        dto: {
          dateDebut: form.dateDebut,
          dateFin: form.dateFin,
          role: form.role.trim(),
        },
      });
      if (phaseId) loadAffectations();
      else affectationService.getByPhase(targetPhaseId).then((rows) => setAffectations(rows || []));
      setForm({ employeId: '', dateDebut: '', dateFin: '', role: '' });
      setDispoMsg(null);
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        (typeof err?.response?.data === 'string' ? err.response.data : null);
      setSaveError(serverMessage || "Erreur lors de l'enregistrement.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await affectationService.delete(deleteTarget.phaseId, deleteTarget.employeId);
      if (phaseId) loadAffectations();
      else if (selectedPhaseId) {
        const rows = await affectationService.getByPhase(selectedPhaseId);
        setAffectations(rows || []);
      }
    } catch (e) {
      setSaveError("Suppression de l'affectation impossible.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Affectations {phaseId ? `Phase : ${phaseId}` : (projetId ? `Projet : ${projetId}` : `Globales`)}</h1>

      {!phaseId && projetId && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-bold">
          Sélectionnez une phase de ce projet pour créer une affectation. Phases trouvées : {projectPhases.length}.
        </div>
      )}

      {(phaseId || projetId || projectPhases.length > 0) && canManage && (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {!phaseId && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Phase</label>
              <select value={selectedPhaseId} onChange={(e) => setSelectedPhaseId(e.target.value)} className="w-full p-2.5 bg-slate-50 rounded-xl border-none font-bold text-sm">
                <option value="">Choisir...</option>
                {projectPhases.map((p) => <option key={p.id} value={p.id}>{p.libelle || `Phase #${p.id}`}</option>)}
              </select>
            </div>
          )}
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
              <input type="date" value={form.dateDebut} className="w-1/2 p-2 bg-slate-50 rounded-lg text-[10px]" onChange={e => {setForm({...form, dateDebut: e.target.value}); setDispoMsg(null);}} />
              <input type="date" value={form.dateFin} className="w-1/2 p-2 bg-slate-50 rounded-lg text-[10px]" onChange={e => {setForm({...form, dateFin: e.target.value}); setDispoMsg(null);}} />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Rôle</label>
            <input type="text" value={form.role} className="w-full p-2.5 bg-slate-50 rounded-xl border-none" onChange={e => setForm({...form, role: e.target.value})} placeholder="Ex: Développeur" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleCheck} className="flex-1 bg-slate-800 text-white p-3 rounded-xl font-bold text-[10px] uppercase hover:bg-slate-700">Vérifier</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white p-3 rounded-xl font-black uppercase text-[10px] hover:bg-blue-700 shadow-lg shadow-blue-200">Affecter</button>
          </div>
        </div>

        {saveError && (
          <div className="p-4 rounded-xl border bg-red-50 border-red-100 text-red-700 text-xs font-bold uppercase tracking-tight">
            {saveError}
          </div>
        )}

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
            {displayedAffectations.map((aff) => {
              const employeId = aff?.id?.employeId || aff?.employeId;
              const phaseRef = aff?.id?.phaseId || phaseId || selectedPhaseId;
              const e = employes.find(emp => String(emp.id) === String(employeId)) || aff.employe;
              return (
              <tr key={`${employeId}-${phaseRef}`} className="hover:bg-slate-50/50 transition-colors font-medium">
                <td className="p-5 text-slate-700 uppercase text-xs font-bold">{e?.nom || `Employé #${employeId}`} {e?.prenom}</td>
                <td className="p-5">
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-[11px]">
                    <Calendar size={14}/> {aff.dateDebut} au {aff.dateFin}
                    <span className="ml-2 text-blue-600 font-black">{aff.role ? `(${aff.role})` : ''}</span>
                  </div>
                </td>
                <td className="p-5 text-right">
                  {canManage && (
                    <button
                      onClick={() => setDeleteTarget({ phaseId: phaseRef, employeId })}
                      className="p-2 text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={18}/>
                    </button>
                  )}
                </td>
              </tr>
              );
            })}
            {!loading && displayedAffectations.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-slate-400 text-sm italic">
                  Aucune affectation trouvée pour ce filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Suppression affectation"
      >
        <p>
          Voulez-vous vraiment retirer cet employé de la phase sélectionnée ?
        </p>
      </Modal>
    </div>
  );
}