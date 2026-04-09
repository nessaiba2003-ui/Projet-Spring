import { z } from 'zod';

export const factureSchema = z.object({
  reference: z.string().min(3, "La référence est obligatoire"),
  dateFacture: z.string().min(1, "Date de facturation obligatoire"),
  montantHT: z.preprocess((val) => Number(val), z.number().min(1, "Le montant HT doit être positif")),
  tva: z.preprocess((val) => Number(val), z.number().min(0, "TVA invalide")),
  statut: z.enum(['FACTUREE', 'PAYEE', 'ANNULEE']),
  description: z.string().optional(),
});