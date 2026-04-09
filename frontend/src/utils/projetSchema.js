import { z } from 'zod';

export const projetSchema = z.object({
  code: z.string().min(2, "Le code est obligatoire"),
  nom: z.string().min(3, "Le nom est trop court"),
  organismeId: z.string().min(1, "Veuillez sélectionner un organisme"),
  chefProjetId: z.string().min(1, "Veuillez sélectionner un chef de projet"),
  dateDebut: z.string().min(1, "Date de début obligatoire"),
  dateFin: z.string().min(1, "Date de fin obligatoire"),
}).refine((data) => new Date(data.dateFin) >= new Date(data.dateDebut), {
  message: "La date de fin doit être après la date de début",
  path: ["dateFin"],
});