import { z } from "zod";

export const configSchema = z.object({
  emailsText: z
    .string()
    .min(10, "Collez au moins un email"),
  priorities: z
    .string()
    .min(2, "Indiquez vos priorites"),
});

export type Config = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "emailsText",
    label: "Emails a analyser",
    type: "textarea" as const,
    placeholder:
      "Collez ici le contenu de vos emails (separez chaque email par une ligne vide)",
    required: true,
  },
  {
    name: "priorities",
    label: "Vos priorites",
    type: "text" as const,
    placeholder: "Ex: projets clients, recrutement, facturation...",
    required: true,
  },
];
