export const meta = {
  slug: "linkedin-post-generator",
  name: "LinkedIn Post Generator",
  description:
    "Generez 3 posts LinkedIn prets a publier (storytelling, liste, opinion)",
  longDescription:
    "Le LinkedIn Post Generator cree automatiquement 3 variantes de posts LinkedIn a partir d'un sujet et d'un ton choisi. Chaque variante utilise un format different (storytelling, liste, opinion) pour maximiser l'engagement. Les posts sont optimises pour l'algorithme LinkedIn et incluent des hashtags pertinents pour votre industrie.",
  category: "contenu",
  creditsPerRun: 3,
  frequency: "on_demand" as const,
  icon: "💬",
  features: [
    "3 formats differents",
    "Storytelling, liste, opinion",
    "Optimise pour l'algorithme LinkedIn",
    "Hashtags pertinents inclus",
  ],
  integrations: ["LinkedIn"],
};
