import { z } from 'zod';

export const documentSchema = z.object({
  titre: z.string().min(3, "Le titre est obligatoire (3 car. min)"),
  typeDoc: z.string().min(1, "Veuillez choisir un type de document"),
  description: z.string().optional(),
  fichier: z.any()
    .refine((files) => files?.length > 0, "Le fichier est obligatoire")
    .refine((files) => files?.[0]?.size <= 15000000, "Taille max : 15 Mo")
});