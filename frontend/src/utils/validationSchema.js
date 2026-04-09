import { z } from 'zod';

export const organismeSchema = z.object({
  nom: z.string().min(3, "Le nom doit avoir au moins 3 caractères"),
  code: z.string().min(2, "Le code est obligatoire"),
  contact: z.string().email("Email invalide").or(z.string().min(10, "Téléphone invalide")),
  adresse: z.string().optional(),
});