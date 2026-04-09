import { z } from 'zod';

export const employeSchema = z.object({
  matricule: z.string().min(1, "Le matricule est obligatoire"),
  nom: z.string().min(2, "Nom trop court"),
  prenom: z.string().min(2, "Prénom trop court"),
  email: z.string().email("Email invalide"),
  login: z.string().min(4, "Login de 4 caractères min."),
  telephone: z.string().min(6, "Téléphone obligatoire"),
  profilId: z.string().min(1, "Veuillez sélectionner un profil"),
  password: z.string().min(6, "Mot de passe de 6 caractères min."),
});