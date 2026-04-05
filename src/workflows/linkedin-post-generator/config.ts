import { z } from "zod";

export const configSchema = z.object({
  topic: z.string().min(3, "Le sujet doit contenir au moins 3 caracteres"),
  tone: z.enum(["inspirant", "educatif", "provocateur"]),
  industry: z.string().min(2, "L'industrie doit contenir au moins 2 caracteres"),
});

export type Config = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "topic",
    label: "Sujet du post",
    type: "text" as const,
    placeholder: "Ex: L'importance du personal branding en 2026",
    required: true,
  },
  {
    name: "tone",
    label: "Ton",
    type: "select" as const,
    options: [
      { value: "inspirant", label: "Inspirant" },
      { value: "educatif", label: "Educatif" },
      { value: "provocateur", label: "Provocateur" },
    ],
    required: true,
  },
  {
    name: "industry",
    label: "Industrie",
    type: "text" as const,
    placeholder: "Ex: SaaS, Marketing Digital, Finance...",
    required: true,
  },
];
