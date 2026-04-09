import { z } from 'zod';

export const phaseSchema = (projectStart, projectEnd) => z.object({
  nom: z.string().min(2, "Nom trop court"),
  montant: z.string().min(1, "Le montant est obligatoire"),
  dateDebut: z.string().min(1, "Date de début obligatoire")
    .refine(date => new Date(date) >= new Date(projectStart), "La phase doit commencer après le début du projet"),
  dateFin: z.string().min(1, "Date de fin obligatoire")
    .refine(date => new Date(date) <= new Date(projectEnd), "La phase doit finir avant la fin du projet"),
}).refine(data => new Date(data.dateFin) >= new Date(data.dateDebut), {
  message: "La fin doit être après le début",
  path: ["dateFin"]
});