export const meta = {
  slug: "meeting-tasks",
  name: "Meeting Tasks",
  description:
    "Transformez vos reunions en taches actionnables avec responsables et deadlines",
  longDescription:
    "Meeting Tasks analyse automatiquement la transcription de votre reunion pour en extraire un resume structure, les taches actionnables, les responsables identifies et des suggestions de deadlines realistes. Exportez le resultat par email ou directement dans Notion pour un suivi efficace. Plus besoin de prendre des notes pendant vos reunions.",
  category: "productivite",
  creditsPerRun: 8,
  frequency: "on_demand" as const,
  icon: "📝",
  features: [
    "Resume structure de la reunion",
    "Extraction automatique des taches",
    "Attribution des responsables",
    "Suggestions de deadlines",
    "Export email ou Notion",
  ],
  integrations: ["Email", "Notion"],
};
