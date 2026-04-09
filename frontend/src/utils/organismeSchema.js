import { z } from 'zod';

export const organismeSchema = z.object({
  nom: z.string().min(3, "Le nom doit avoir au moins 3 caractères"),
  code: z.string().min(2, "Le code est obligatoire (min 2 car.)"),
  contact: z.string().min(5, "Contact obligatoire (Email ou Tel)"),
  adresse: z.string().optional(),
});