export const meta = {
  slug: "content-repurposer",
  name: "Content Repurposer",
  description:
    "Transformez un article en 5 posts LinkedIn, 5 tweets et 1 script video 60s",
  longDescription:
    "Le Content Repurposer scrape automatiquement le contenu d'un article a partir de son URL, puis utilise l'IA pour generer du contenu optimise pour plusieurs plateformes. Vous obtenez 5 posts LinkedIn prets a publier, 5 tweets percutants et un script video de 60 secondes. Choisissez parmi 3 tons differents (professionnel, casual ou expert) pour adapter le contenu a votre audience.",
  category: "contenu",
  creditsPerRun: 5,
  frequency: "on_demand" as const,
  icon: "✍",
  features: [
    "Scraping automatique d'articles",
    "5 posts LinkedIn optimises",
    "5 tweets percutants",
    "1 script video 60 secondes",
    "3 tons au choix",
  ],
  integrations: ["Web", "LinkedIn", "Twitter"],
};
