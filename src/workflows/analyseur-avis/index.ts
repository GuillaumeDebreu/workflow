import axios from "axios";
import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";

interface ReviewData {
  author: string;
  rating: number;
  text: string;
  date: string;
}

interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

interface RecurringComplaint {
  theme: string;
  occurrences: number;
  exampleQuotes: string[];
}

interface ResponseSuggestion {
  category: string;
  tone: string;
  template: string;
}

interface AnalyseurAvisResult {
  businessName: string;
  sourceUrl: string;
  totalReviewsAnalyzed: number;
  averageRating: number;
  sentimentBreakdown: SentimentBreakdown;
  strengths: string[];
  recurringComplaints: RecurringComplaint[];
  responseSuggestions: ResponseSuggestion[];
  summary: string;
  generatedAt: string;
}

async function scrapeReviews(url: string): Promise<ReviewData[]> {
  // TODO: Replace with real scraping in production
  // Google Business and Trustpilot have different DOM structures
  // Consider using a dedicated reviews API service for reliability
  // const response = await axios.get(url, {
  //   headers: { "User-Agent": "Mozilla/5.0 (compatible; AnalyseurAvis/1.0)" },
  //   timeout: 15000,
  // });
  // const $ = cheerio.load(response.data);

  // Placeholder: simulate scraped reviews
  const placeholderHtml = `
    <html>
      <body>
        <div class="review-list">
          <div class="review"><span class="author">Jean D.</span><span class="rating">5</span><p>Excellent service, je recommande !</p></div>
          <div class="review"><span class="author">Marie L.</span><span class="rating">1</span><p>Livraison tres en retard, decu.</p></div>
        </div>
      </body>
    </html>
  `;
  const $ = cheerio.load(placeholderHtml);

  // Simulated review data for development
  const reviews: ReviewData[] = [
    { author: "Jean D.", rating: 5, text: "Excellent service client, reponse rapide et efficace. Je recommande vivement !", date: "2026-03-15" },
    { author: "Marie L.", rating: 1, text: "Livraison tres en retard, plus de 3 semaines d'attente. Service client injoignable.", date: "2026-03-12" },
    { author: "Pierre M.", rating: 4, text: "Bon produit dans l'ensemble, rapport qualite-prix correct.", date: "2026-03-10" },
    { author: "Sophie R.", rating: 2, text: "Produit recu endommage, retour complique. Dommage car le produit semblait bien.", date: "2026-03-08" },
    { author: "Luc B.", rating: 5, text: "Parfait ! Commande livree en 2 jours, produit conforme a la description.", date: "2026-03-05" },
    { author: "Emma V.", rating: 1, text: "Impossible de joindre le service client. Appels non repondus, emails ignores.", date: "2026-03-03" },
    { author: "Thomas G.", rating: 3, text: "Correct sans plus. Le produit fait le job mais rien d'exceptionnel.", date: "2026-03-01" },
    { author: "Camille F.", rating: 4, text: "Tres satisfait de mon achat. L'equipe est reactive et professionnelle.", date: "2026-02-28" },
    { author: "Nicolas P.", rating: 1, text: "Livraison en retard de 2 semaines et produit de qualite mediocre.", date: "2026-02-25" },
    { author: "Julie H.", rating: 5, text: "Service exceptionnel, suivi personnalise. Je suis cliente fidele depuis 2 ans.", date: "2026-02-22" },
    { author: "Antoine C.", rating: 2, text: "Le SAV est vraiment decevant. Probleme non resolu apres 3 relances.", date: "2026-02-20" },
    { author: "Laura D.", rating: 4, text: "Produit de bonne qualite, livraison rapide. Je recommande.", date: "2026-02-18" },
  ];

  return reviews;
}

export async function execute(
  config: {
    reviewsUrl: string;
    businessName: string;
  },
  apiKeys: Record<string, string>
): Promise<AnalyseurAvisResult> {
  if (!config.reviewsUrl) {
    throw new Error("L'URL de la page d'avis est requise");
  }
  if (!config.businessName) {
    throw new Error("Le nom de l'entreprise est requis");
  }

  // Step 1: Scrape reviews
  const reviews = await scrapeReviews(config.reviewsUrl);

  if (!reviews.length) {
    throw new Error("Aucun avis trouve sur la page fournie");
  }

  // Step 2: Calculate basic stats
  const totalReviews = reviews.length;
  const averageRating =
    Math.round(
      (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10
    ) / 10;

  // Step 3: Analyze with Claude
  const reviewsForPrompt = reviews
    .map(
      (r, i) =>
        `[${i + 1}] ${r.author} - ${r.rating}/5 (${r.date})\n"${r.text}"`
    )
    .join("\n\n");

  const prompt = `Tu es un expert en analyse de reputation en ligne. Analyse ces avis clients pour "${config.businessName}".

AVIS CLIENTS :
${reviewsForPrompt}

Genere exactement au format JSON suivant (sans markdown, juste le JSON brut) :
{
  "sentimentBreakdown": {
    "positive": 50,
    "neutral": 20,
    "negative": 30
  },
  "strengths": ["point fort 1", "point fort 2", "point fort 3"],
  "recurringComplaints": [
    {
      "theme": "theme de la plainte",
      "occurrences": 3,
      "exampleQuotes": ["citation 1", "citation 2"]
    }
  ],
  "responseSuggestions": [
    {
      "category": "avis positif",
      "tone": "reconnaissant",
      "template": "modele de reponse"
    },
    {
      "category": "plainte livraison",
      "tone": "empathique",
      "template": "modele de reponse"
    },
    {
      "category": "probleme SAV",
      "tone": "professionnel",
      "template": "modele de reponse"
    }
  ],
  "summary": "resume global de la reputation en 3-4 phrases"
}

Regles :
- Les pourcentages de sentiment doivent totaliser 100
- Identifie au moins 2 plaintes recurrentes avec des citations exactes
- Propose au moins 3 modeles de reponses adaptes aux differents types d'avis
- Le resume doit etre actionnable avec des recommandations claires`;

  // TODO: Replace with real Anthropic API call in production
  // const anthropic = new Anthropic({ apiKey: apiKeys.anthropic });
  // const message = await anthropic.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 4000,
  //   messages: [{ role: "user", content: prompt }],
  // });
  // const responseText = message.content[0].type === "text" ? message.content[0].text : "";

  // Placeholder response for development
  const responseText = JSON.stringify({
    sentimentBreakdown: {
      positive: 42,
      neutral: 16,
      negative: 42,
    },
    strengths: [
      "Service client reactif et professionnel",
      "Qualite des produits appreciee",
      "Suivi personnalise des commandes",
    ],
    recurringComplaints: [
      {
        theme: "Delais de livraison",
        occurrences: 3,
        exampleQuotes: [
          "Livraison tres en retard, plus de 3 semaines d'attente",
          "Livraison en retard de 2 semaines",
        ],
      },
      {
        theme: "Service apres-vente injoignable",
        occurrences: 2,
        exampleQuotes: [
          "Service client injoignable",
          "Impossible de joindre le service client. Appels non repondus, emails ignores.",
        ],
      },
    ],
    responseSuggestions: [
      {
        category: "Avis positif",
        tone: "reconnaissant",
        template: `Merci beaucoup pour votre avis ! Toute l'equipe de ${config.businessName} est ravie que vous soyez satisfait(e). Votre fidelite nous motive a continuer de nous ameliorer.`,
      },
      {
        category: "Plainte livraison",
        tone: "empathique",
        template: `Nous sommes sincèrement desoles pour ce retard de livraison. Ce n'est pas a la hauteur de nos standards. Nous avons pris des mesures pour ameliorer nos delais. N'hesitez pas a nous contacter directement pour un suivi personnalise.`,
      },
      {
        category: "Probleme SAV",
        tone: "professionnel",
        template: `Nous regrettons cette experience avec notre service client. Votre retour est precieux et nous avons renforce notre equipe support. Merci de nous contacter a support@${config.businessName.toLowerCase().replace(/\s+/g, "")}.com pour resoudre votre probleme en priorite.`,
      },
    ],
    summary: `${config.businessName} presente un profil de reputation mixte avec 42% d'avis positifs. Les principaux atouts sont la qualite des produits et la reactivite du service. Les axes d'amelioration prioritaires concernent les delais de livraison et l'accessibilite du SAV. Recommandation: mettre en place un suivi proactif des livraisons et renforcer les canaux de contact client.`,
  });

  let parsed: {
    sentimentBreakdown: SentimentBreakdown;
    strengths: string[];
    recurringComplaints: RecurringComplaint[];
    responseSuggestions: ResponseSuggestion[];
    summary: string;
  };

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Erreur lors du parsing de la reponse IA");
  }

  if (
    !parsed.sentimentBreakdown ||
    !parsed.strengths?.length ||
    !parsed.recurringComplaints?.length ||
    !parsed.responseSuggestions?.length ||
    !parsed.summary
  ) {
    throw new Error("La reponse IA est incomplete");
  }

  return {
    businessName: config.businessName,
    sourceUrl: config.reviewsUrl,
    totalReviewsAnalyzed: totalReviews,
    averageRating,
    sentimentBreakdown: parsed.sentimentBreakdown,
    strengths: parsed.strengths,
    recurringComplaints: parsed.recurringComplaints,
    responseSuggestions: parsed.responseSuggestions,
    summary: parsed.summary,
    generatedAt: new Date().toISOString(),
  };
}
