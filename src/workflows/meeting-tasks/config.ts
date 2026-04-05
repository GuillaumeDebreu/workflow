import { z } from "zod";

export const configSchema = z.object({
  transcript: z
    .string()
    .min(50, "La transcription doit contenir au moins 50 caracteres"),
  projectTool: z.enum(["email", "notion"], {
    message: "Veuillez selectionner un outil d'export",
  }),
});

export type MeetingTasksConfig = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "transcript",
    label: "Transcription de la reunion",
    type: "textarea" as const,
    placeholder:
      "Collez ici la transcription de votre reunion...",
    required: true,
  },
  {
    name: "projectTool",
    label: "Outil d'export",
    type: "select" as const,
    required: true,
    options: [
      { value: "email", label: "Email" },
      { value: "notion", label: "Notion" },
    ],
  },
];
