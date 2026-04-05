import { z } from "zod";

export const configSchema = z.object({
  reviewsUrl: z
    .string()
    .url("Veuillez entrer une URL valide")
    .min(1, "L'URL des avis est requise"),
  businessName: z
    .string()
    .min(1, "Le nom de l'entreprise est requis"),
});

export type AnalyseurAvisConfig = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "reviewsUrl",
    label: "URL de la page d'avis (Google Business ou Trustpilot)",
    type: "text" as const,
    placeholder: "https://www.trustpilot.com/review/votre-entreprise",
    required: true,
  },
  {
    name: "businessName",
    label: "Nom de l'entreprise",
    type: "text" as const,
    placeholder: "Ma Super Entreprise",
    required: true,
  },
];
