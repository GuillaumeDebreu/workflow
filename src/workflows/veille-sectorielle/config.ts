import { z } from "zod";

export const configSchema = z.object({
  keywords: z
    .array(z.string().min(1))
    .min(3, "Veuillez entrer au moins 3 mots-cles")
    .max(5, "Maximum 5 mots-cles"),
  day: z.enum(["lundi", "mardi", "mercredi", "jeudi", "vendredi"], {
    message: "Veuillez selectionner un jour",
  }),
  hour: z.enum(
    ["8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h"],
    { message: "Veuillez selectionner une heure" }
  ),
});

export type VeilleSectorielleConfig = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "keywords",
    label: "Mots-cles de veille (3 a 5)",
    type: "tags" as const,
    placeholder: "Ex: intelligence artificielle, SaaS, fintech",
    required: true,
  },
  {
    name: "day",
    label: "Jour de livraison",
    type: "select" as const,
    required: true,
    options: [
      { value: "lundi", label: "Lundi" },
      { value: "mardi", label: "Mardi" },
      { value: "mercredi", label: "Mercredi" },
      { value: "jeudi", label: "Jeudi" },
      { value: "vendredi", label: "Vendredi" },
    ],
  },
  {
    name: "hour",
    label: "Heure de livraison",
    type: "select" as const,
    required: true,
    options: [
      { value: "8h", label: "8h" },
      { value: "9h", label: "9h" },
      { value: "10h", label: "10h" },
      { value: "11h", label: "11h" },
      { value: "12h", label: "12h" },
      { value: "13h", label: "13h" },
      { value: "14h", label: "14h" },
      { value: "15h", label: "15h" },
      { value: "16h", label: "16h" },
      { value: "17h", label: "17h" },
      { value: "18h", label: "18h" },
      { value: "19h", label: "19h" },
      { value: "20h", label: "20h" },
    ],
  },
];
