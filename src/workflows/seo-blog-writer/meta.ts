export const meta = {
  slug: "seo-blog-writer",
  name: "SEO Blog Writer",
  description:
    "Generez un article de blog SEO complet avec meta description et title tags",
  longDescription:
    "Le SEO Blog Writer genere un article de blog complet et optimise pour le referencement naturel. A partir d'un mot-cle cible, il produit un article structure avec des titres H2/H3, une meta description optimisee et des suggestions de title tags. Choisissez la longueur (800, 1500 ou 2500 mots) et la langue (francais ou anglais) pour un contenu pret a publier.",
  category: "contenu",
  creditsPerRun: 10,
  frequency: "on_demand" as const,
  icon: "📖",
  features: [
    "Article structure H2/H3",
    "Meta description optimisee",
    "Suggestions de title tags",
    "800 a 2500 mots",
    "Francais ou anglais",
  ],
  integrations: ["Web", "Email"],
};
