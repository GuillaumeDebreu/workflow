import { z } from "zod";

export const configSchema = z.object({
  urls: z
    .array(z.string().url("URL invalide"))
    .min(1, "Au moins 1 URL requise")
    .max(10, "Maximum 10 URLs"),
  threshold: z
    .number()
    .min(0.1, "Le seuil minimum est 0.1%")
    .max(100, "Le seuil maximum est 100%"),
});

export type Config = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "urls",
    label: "URLs des pages produits concurrentes",
    type: "tags" as const,
    placeholder: "Collez une URL et appuyez sur Entree",
    required: true,
  },
  {
    name: "threshold",
    label: "Seuil d'alerte (%)",
    type: "number" as const,
    placeholder: "Ex: 5 (pour 5%)",
    required: true,
  },
];
