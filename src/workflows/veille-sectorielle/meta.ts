export const meta = {
  slug: "veille-sectorielle",
  name: "Veille Sectorielle",
  description:
    "Recevez un digest hebdomadaire des 10 actus cles de votre secteur",
  longDescription:
    "La Veille Sectorielle surveille automatiquement les actualites liees a vos mots-cles et vous livre chaque semaine un digest structure des 10 articles les plus pertinents. Chaque article est accompagne d'un resume IA et d'une analyse de tendances pour vous permettre de rester informe sans effort. Programmez la livraison au jour et a l'heure de votre choix.",
  category: "veille",
  creditsPerRun: 15,
  frequency: "weekly" as const,
  icon: "🔎",
  features: [
    "10 articles pertinents par semaine",
    "Resume IA de chaque article",
    "Analyse de tendances",
    "Livraison hebdomadaire programmee",
  ],
  integrations: ["Google News", "Email"],
};
