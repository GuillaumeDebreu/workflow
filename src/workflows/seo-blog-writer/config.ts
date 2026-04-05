import { z } from "zod";

export const configSchema = z.object({
  keyword: z
    .string()
    .min(2, "Le mot-cle doit contenir au moins 2 caracteres"),
  audience: z
    .string()
    .min(2, "L'audience cible doit contenir au moins 2 caracteres"),
  wordCount: z.enum(["800", "1500", "2500"]),
  language: z.enum(["fr", "en"]),
});

export type Config = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "keyword",
    label: "Mot-cle principal",
    type: "text" as const,
    placeholder: "Ex: marketing automation B2B",
    required: true,
  },
  {
    name: "audience",
    label: "Audience cible",
    type: "text" as const,
    placeholder: "Ex: dirigeants de PME, marketeurs...",
    required: true,
  },
  {
    name: "wordCount",
    label: "Nombre de mots",
    type: "select" as const,
    options: [
      { value: "800", label: "800 mots (court)" },
      { value: "1500", label: "1500 mots (moyen)" },
      { value: "2500", label: "2500 mots (long)" },
    ],
    required: true,
  },
  {
    name: "language",
    label: "Langue",
    type: "select" as const,
    options: [
      { value: "fr", label: "Francais" },
      { value: "en", label: "Anglais" },
    ],
    required: true,
  },
];
