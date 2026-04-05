export const meta = {
  slug: "cold-email",
  name: "Cold Email",
  description:
    "Generez 3 variantes d'email de prospection personnalise",
  longDescription:
    "Le Cold Email Generator analyse le profil LinkedIn de votre prospect pour creer 3 variantes d'email de prospection hautement personnalisees. Chaque variante adopte un style different (formel, casual, direct) pour maximiser vos chances de reponse. L'IA identifie les points de connexion pertinents et redige des objets d'email optimises pour le taux d'ouverture.",
  category: "prospection",
  creditsPerRun: 2,
  frequency: "on_demand" as const,
  icon: "📨",
  features: [
    "Analyse du profil LinkedIn",
    "3 variantes (formel, casual, direct)",
    "Personnalisation IA avancee",
    "Objets d'email optimises",
  ],
  integrations: ["LinkedIn", "Email"],
};
