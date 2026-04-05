import { z } from "zod";

export const configSchema = z.object({
  linkedinUrl: z
    .string()
    .url("Veuillez entrer une URL LinkedIn valide")
    .min(1, "L'URL LinkedIn est requise"),
  senderName: z
    .string()
    .min(1, "Votre nom est requis"),
  senderCompany: z
    .string()
    .min(1, "Le nom de votre entreprise est requis"),
  objective: z
    .string()
    .min(10, "L'objectif doit contenir au moins 10 caracteres"),
});

export type ColdEmailConfig = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "linkedinUrl",
    label: "URL du profil LinkedIn du prospect",
    type: "text" as const,
    placeholder: "https://linkedin.com/in/nom-du-prospect",
    required: true,
  },
  {
    name: "senderName",
    label: "Votre nom",
    type: "text" as const,
    placeholder: "Jean Dupont",
    required: true,
  },
  {
    name: "senderCompany",
    label: "Votre entreprise",
    type: "text" as const,
    placeholder: "Acme Corp",
    required: true,
  },
  {
    name: "objective",
    label: "Objectif de l'email",
    type: "textarea" as const,
    placeholder:
      "Ex: Proposer une demo de notre outil SaaS de gestion de projet",
    required: true,
  },
];
