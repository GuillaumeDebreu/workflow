import { z } from "zod";

export const configSchema = z.object({
  url: z
    .string()
    .url("Veuillez entrer une URL valide")
    .min(1, "L'URL est requise"),
  tone: z.enum(["professionnel", "casual", "expert"], {
    message: "Veuillez selectionner un ton",
  }),
});

export type ContentRepurposerConfig = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "url",
    label: "URL de l'article",
    type: "text" as const,
    placeholder: "https://example.com/article",
    required: true,
  },
  {
    name: "tone",
    label: "Ton du contenu",
    type: "select" as const,
    required: true,
    options: [
      { value: "professionnel", label: "Professionnel" },
      { value: "casual", label: "Casual" },
      { value: "expert", label: "Expert" },
    ],
  },
];
