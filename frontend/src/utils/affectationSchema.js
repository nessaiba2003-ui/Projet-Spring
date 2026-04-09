import { z } from 'zod';

export const affectationSchema = z.object({
  employeId: z.string().min(1, "Veuillez sélectionner un employé"),
  dateDebut: z.string().min(1, "Date de début obligatoire"),
  dateFin: z.string().min(1, "Date de fin obligatoire"),
  chargeHoraire: z.preprocess((val) => Number(val), z.number().min(1, "Charge minimale : 1h")),
}).refine(data => new Date(data.dateFin) >= new Date(data.dateDebut), {
  message: "La fin doit être après le début",
  path: ["dateFin"]
});