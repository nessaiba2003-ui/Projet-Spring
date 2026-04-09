import { z } from 'zod';

export const livrableSchema = z.object({
  nom: z.string().min(3, "Le nom du livrable doit avoir au moins 3 caractères"),
  description: z.string().optional(),
  // On peut valider la présence d'un fichier ou son type/taille ici
  fichier: z.any()
    .refine((files) => files?.length > 0, "Un fichier est requis pour soumettre le livrable")
    .refine((files) => files?.[0]?.size <= 10000000, "Le fichier ne doit pas dépasser 10 Mo") // 10Mo max
});