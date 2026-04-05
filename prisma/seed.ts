import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Inline workflow data for seeding (avoids TS compilation issues with imports)
const workflows = [
  {
    slug: "content-repurposer",
    name: "Content Repurposer",
    description: "Transformez un article en 5 posts LinkedIn, 5 tweets et 1 script video 60s",
    longDescription: "Collez l'URL d'un article de blog et notre IA le transformera automatiquement en contenu multi-format : 5 posts LinkedIn optimises pour l'engagement, 5 tweets percutants, et un script video de 60 secondes. Choisissez votre ton (professionnel, casual ou expert) pour adapter le contenu a votre audience.",
    category: "contenu",
    creditsPerRun: 5,
    frequency: "on_demand",
    icon: "\u270D\uFE0F",
    features: ["Scraping automatique d'articles", "5 posts LinkedIn optimises", "5 tweets percutants", "1 script video 60 secondes", "3 tons au choix"],
    integrations: ["Web", "LinkedIn", "Twitter"],
  },
  {
    slug: "cold-email",
    name: "Cold Email Personnalise",
    description: "Generez 3 variantes d'email de prospection personnalise",
    longDescription: "Entrez l'URL LinkedIn de votre prospect et notre IA analysera son profil pour generer 3 variantes d'email de prospection personnalise : une version formelle, une version casual et une version directe. Chaque email inclut un objet optimise pour maximiser le taux d'ouverture.",
    category: "prospection",
    creditsPerRun: 2,
    frequency: "on_demand",
    icon: "\uD83D\uDCE8",
    features: ["Analyse du profil LinkedIn", "3 variantes (formel, casual, direct)", "Personnalisation IA avancee", "Objets d'email optimises"],
    integrations: ["LinkedIn", "Email"],
  },
  {
    slug: "veille-sectorielle",
    name: "Veille Sectorielle Hebdo",
    description: "Recevez un digest hebdomadaire des 10 actus cles de votre secteur",
    longDescription: "Definissez 3 a 5 mots-cles de votre secteur et recevez chaque semaine un email digest contenant les 10 articles les plus pertinents, chacun resume par l'IA avec une analyse de tendances. Programmez le jour et l'heure de reception.",
    category: "veille",
    creditsPerRun: 15,
    frequency: "weekly",
    icon: "\uD83D\uDD0D",
    features: ["10 articles pertinents par semaine", "Resume IA de chaque article", "Analyse de tendances", "Livraison hebdomadaire programmee"],
    integrations: ["Google News", "Email"],
  },
  {
    slug: "analyseur-avis",
    name: "Analyseur d'Avis",
    description: "Analysez vos avis Google/Trustpilot : sentiment, plaintes et reponses types",
    longDescription: "Entrez l'URL de votre page Google Business ou Trustpilot. Notre IA scrape automatiquement les avis, analyse le sentiment global, identifie les plaintes recurrentes et genere des suggestions de reponses types pour chaque categorie de feedback.",
    category: "ecommerce",
    creditsPerRun: 12,
    frequency: "monthly",
    icon: "\u2B50",
    features: ["Scraping automatique des avis", "Analyse de sentiment detaillee", "Identification des plaintes recurrentes", "Suggestions de reponses types", "Rapport mensuel complet"],
    integrations: ["Google Business", "Trustpilot", "Email"],
  },
  {
    slug: "meeting-tasks",
    name: "Meeting \u2192 Taches",
    description: "Transformez vos reunions en taches actionnables avec responsables et deadlines",
    longDescription: "Collez la transcription de votre reunion et notre IA generera un resume structure, extraira automatiquement les taches actionnables, attribuera les responsables mentionnes et suggerera des deadlines realistes. Export par email.",
    category: "productivite",
    creditsPerRun: 8,
    frequency: "on_demand",
    icon: "\uD83D\uDCDD",
    features: ["Resume structure de la reunion", "Extraction automatique des taches", "Attribution des responsables", "Suggestions de deadlines", "Export email ou Notion"],
    integrations: ["Email", "Notion"],
  },
  {
    slug: "resume-financier",
    name: "Resume Financier Hebdo",
    description: "Resume hebdomadaire de vos actions : performance, news et sentiment",
    longDescription: "Suivez jusqu'a 10 valeurs boursieres. Chaque semaine, recevez un email avec la performance de la semaine, les news par valeur, une analyse de sentiment du marche et les evenements a venir (earnings, dividendes, etc.).",
    category: "finance",
    creditsPerRun: 18,
    frequency: "weekly",
    icon: "\uD83D\uDCC8",
    features: ["Suivi de 10 valeurs max", "Performance hebdomadaire", "News par valeur", "Analyse de sentiment marche", "Evenements a venir"],
    integrations: ["Yahoo Finance", "Email"],
  },
  {
    slug: "linkedin-post-generator",
    name: "LinkedIn Post Generator",
    description: "Generez 3 posts LinkedIn prets a publier (storytelling, liste, opinion)",
    longDescription: "Entrez un sujet ou une idee en 1-2 phrases et notre IA generera 3 posts LinkedIn dans des formats differents : storytelling, liste et opinion. Chaque post est optimise pour l'algorithme LinkedIn avec les hashtags pertinents inclus.",
    category: "contenu",
    creditsPerRun: 3,
    frequency: "on_demand",
    icon: "\uD83D\uDCAC",
    features: ["3 formats differents", "Storytelling, liste, opinion", "Optimise pour l'algorithme LinkedIn", "Hashtags pertinents inclus"],
    integrations: ["LinkedIn"],
  },
  {
    slug: "competitor-price-monitor",
    name: "Competitor Price Monitor",
    description: "Surveillez les prix concurrents et recevez des alertes en cas de changement",
    longDescription: "Ajoutez jusqu'a 10 URLs de pages produit concurrentes et definissez un seuil d'alerte. Notre systeme verifie quotidiennement les prix et vous envoie une alerte email des qu'un changement depasse votre seuil.",
    category: "ecommerce",
    creditsPerRun: 5,
    frequency: "daily",
    icon: "\uD83D\uDCB0",
    features: ["Surveillance quotidienne", "Jusqu'a 10 URLs", "Alerte seuil personnalisable", "Historique des prix", "Rapport de tendances"],
    integrations: ["Web", "Email"],
  },
  {
    slug: "inbox-summarizer",
    name: "Inbox Summarizer",
    description: "Resumez vos emails, categorisez par urgence et obtenez des brouillons de reponse",
    longDescription: "Collez le texte de vos emails et notre IA les resumera intelligemment, les categorisera (urgent / important / peut attendre), identifiera les actions requises et generera des brouillons de reponse pour chaque email.",
    category: "productivite",
    creditsPerRun: 4,
    frequency: "on_demand",
    icon: "\uD83D\uDCEB",
    features: ["Resume intelligent des emails", "Categorisation urgent/important/peut attendre", "Brouillons de reponse IA", "Identification des actions requises"],
    integrations: ["Email"],
  },
  {
    slug: "seo-blog-writer",
    name: "SEO Blog Writer",
    description: "Generez un article de blog SEO complet avec meta description et title tags",
    longDescription: "Entrez un mot-cle SEO principal et votre audience cible. Notre IA generera un article de blog complet (800 a 2500 mots), structure avec des H2/H3, une meta description optimisee et des suggestions de title tags. Disponible en francais et en anglais.",
    category: "contenu",
    creditsPerRun: 10,
    frequency: "on_demand",
    icon: "\uD83D\uDCD6",
    features: ["Article structure H2/H3", "Meta description optimisee", "Suggestions de title tags", "800 a 2500 mots", "Francais ou anglais"],
    integrations: ["Web", "Email"],
  },
];

async function main() {
  console.log("Seeding workflows...");

  for (const wf of workflows) {
    // Build configSchema from the workflow's config fields
    const configFields = await getConfigFields(wf.slug);

    await prisma.workflow.upsert({
      where: { slug: wf.slug },
      update: {
        ...wf,
        configSchema: { fields: configFields },
      },
      create: {
        ...wf,
        configSchema: { fields: configFields },
      },
    });
    console.log(`  - ${wf.name}`);
  }

  console.log("Seeding complete!");
}

function getConfigFields(slug: string) {
  const configs: Record<string, Array<{name:string;label:string;type:string;placeholder?:string;options?:{value:string;label:string}[];required?:boolean}>> = {
    "content-repurposer": [
      { name: "url", label: "URL de l'article", type: "text", placeholder: "https://blog.exemple.com/article", required: true },
      { name: "tone", label: "Ton", type: "select", options: [{ value: "professionnel", label: "Professionnel" }, { value: "casual", label: "Casual" }, { value: "expert", label: "Expert" }], required: true },
    ],
    "cold-email": [
      { name: "linkedinUrl", label: "URL LinkedIn du prospect", type: "text", placeholder: "https://linkedin.com/in/...", required: true },
      { name: "senderName", label: "Votre nom", type: "text", placeholder: "Jean Dupont", required: true },
      { name: "senderCompany", label: "Votre entreprise", type: "text", placeholder: "Ma Startup", required: true },
      { name: "objective", label: "Objectif du contact", type: "text", placeholder: "Proposer un partenariat...", required: true },
    ],
    "veille-sectorielle": [
      { name: "keywords", label: "Mots-cles (3-5)", type: "tags", placeholder: "Ajouter un mot-cle", required: true },
      { name: "day", label: "Jour de reception", type: "select", options: [{ value: "lundi", label: "Lundi" }, { value: "mardi", label: "Mardi" }, { value: "mercredi", label: "Mercredi" }, { value: "jeudi", label: "Jeudi" }, { value: "vendredi", label: "Vendredi" }], required: true },
      { name: "hour", label: "Heure de reception", type: "select", options: Array.from({ length: 13 }, (_, i) => ({ value: `${i + 8}`, label: `${i + 8}h00` })), required: true },
    ],
    "analyseur-avis": [
      { name: "reviewsUrl", label: "URL Google Business ou Trustpilot", type: "text", placeholder: "https://...", required: true },
      { name: "businessName", label: "Nom de l'entreprise", type: "text", placeholder: "Mon Commerce", required: true },
    ],
    "meeting-tasks": [
      { name: "transcript", label: "Transcription de la reunion", type: "textarea", placeholder: "Collez la transcription ici...", required: true },
      { name: "projectTool", label: "Outil d'export", type: "select", options: [{ value: "email", label: "Email" }, { value: "notion", label: "Notion" }], required: true },
    ],
    "resume-financier": [
      { name: "tickers", label: "Tickers (5-10 symboles)", type: "tags", placeholder: "ex: AAPL, MSFT, GOOG", required: true },
      { name: "day", label: "Jour de reception", type: "select", options: [{ value: "lundi", label: "Lundi" }, { value: "mardi", label: "Mardi" }, { value: "mercredi", label: "Mercredi" }, { value: "jeudi", label: "Jeudi" }, { value: "vendredi", label: "Vendredi" }], required: true },
      { name: "includeNews", label: "Inclure les news", type: "boolean", placeholder: "Recevoir les news par valeur" },
    ],
    "linkedin-post-generator": [
      { name: "topic", label: "Sujet ou idee", type: "text", placeholder: "L'importance du personal branding en 2026", required: true },
      { name: "tone", label: "Ton", type: "select", options: [{ value: "inspirant", label: "Inspirant" }, { value: "educatif", label: "Educatif" }, { value: "provocateur", label: "Provocateur" }], required: true },
      { name: "industry", label: "Secteur d'activite", type: "text", placeholder: "Tech, Marketing, Finance...", required: true },
    ],
    "competitor-price-monitor": [
      { name: "urls", label: "URLs des produits (max 10)", type: "tags", placeholder: "https://concurrent.com/produit", required: true },
      { name: "threshold", label: "Seuil d'alerte (%)", type: "number", placeholder: "5", required: true },
    ],
    "inbox-summarizer": [
      { name: "emailsText", label: "Texte des emails", type: "textarea", placeholder: "Collez vos emails ici...", required: true },
      { name: "priorities", label: "Vos priorites", type: "text", placeholder: "Clients VIP, deadlines projet X...", required: true },
    ],
    "seo-blog-writer": [
      { name: "keyword", label: "Mot-cle SEO principal", type: "text", placeholder: "automatisation marketing IA", required: true },
      { name: "audience", label: "Audience cible", type: "text", placeholder: "Directeurs marketing PME", required: true },
      { name: "wordCount", label: "Nombre de mots", type: "select", options: [{ value: "800", label: "800 mots" }, { value: "1500", label: "1500 mots" }, { value: "2500", label: "2500 mots" }], required: true },
      { name: "language", label: "Langue", type: "select", options: [{ value: "fr", label: "Francais" }, { value: "en", label: "English" }], required: true },
    ],
  };

  return configs[slug] || [];
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
