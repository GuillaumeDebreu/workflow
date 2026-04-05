export const meta = {
  slug: "competitor-price-monitor",
  name: "Competitor Price Monitor",
  description:
    "Surveillez les prix concurrents et recevez des alertes en cas de changement",
  longDescription:
    "Le Competitor Price Monitor surveille quotidiennement les prix sur les pages produits de vos concurrents. Definissez un seuil d'alerte personnalisable et recevez une notification des que le prix change au-dela de ce seuil. L'outil conserve un historique des prix et genere des rapports de tendances pour vous aider a ajuster votre strategie tarifaire.",
  category: "ecommerce",
  creditsPerRun: 5,
  frequency: "daily" as const,
  icon: "💰",
  features: [
    "Surveillance quotidienne",
    "Jusqu'a 10 URLs",
    "Alerte seuil personnalisable",
    "Historique des prix",
    "Rapport de tendances",
  ],
  integrations: ["Web", "Email"],
};
