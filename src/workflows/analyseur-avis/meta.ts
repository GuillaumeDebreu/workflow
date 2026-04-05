export const meta = {
  slug: "analyseur-avis",
  name: "Analyseur d'Avis",
  description:
    "Analysez vos avis Google/Trustpilot : sentiment, plaintes et reponses types",
  longDescription:
    "L'Analyseur d'Avis scrape automatiquement les avis de votre entreprise sur Google Business ou Trustpilot, puis utilise l'IA pour realiser une analyse de sentiment detaillee. Il identifie les plaintes recurrentes, extrait les points forts et genere des suggestions de reponses types adaptees a chaque categorie d'avis. Recevez un rapport mensuel complet pour ameliorer votre reputation en ligne.",
  category: "ecommerce",
  creditsPerRun: 12,
  frequency: "monthly" as const,
  icon: "⭐",
  features: [
    "Scraping automatique des avis",
    "Analyse de sentiment detaillee",
    "Identification des plaintes recurrentes",
    "Suggestions de reponses types",
    "Rapport mensuel complet",
  ],
  integrations: ["Google Business", "Trustpilot", "Email"],
};
