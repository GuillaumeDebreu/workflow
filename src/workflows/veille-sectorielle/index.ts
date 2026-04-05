import axios from "axios";
import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";

interface ArticleSummary {
  title: string;
  url: string;
  source: string;
  summary: string;
  relevanceScore: number;
}

interface VeilleSectorielleResult {
  keywords: string[];
  articles: ArticleSummary[];
  trendAnalysis: string;
  deliverySchedule: {
    day: string;
    hour: string;
  };
  generatedAt: string;
}

async function fetchNewsArticles(
  keywords: string[]
): Promise<{ title: string; url: string; source: string; snippet: string }[]> {
  const query = encodeURIComponent(keywords.join(" OR "));

  // TODO: Replace with real Google News scraping or News API call in production
  // const response = await axios.get(
  //   `https://news.google.com/rss/search?q=${query}&hl=fr&gl=FR&ceid=FR:fr`,
  //   { headers: { "User-Agent": "Mozilla/5.0 (compatible; VeilleSectorielle/1.0)" }, timeout: 15000 }
  // );
  // const $ = cheerio.load(response.data, { xmlMode: true });
  // const articles: { title: string; url: string; source: string; snippet: string }[] = [];
  // $("item").each((i, el) => {
  //   if (i >= 15) return false;
  //   articles.push({
  //     title: $(el).find("title").text().trim(),
  //     url: $(el).find("link").text().trim(),
  //     source: $(el).find("source").text().trim(),
  //     snippet: $(el).find("description").text().trim(),
  //   });
  // });

  // Placeholder: simulate fetched articles
  const placeholderArticles = Array.from({ length: 12 }, (_, i) => ({
    title: `Article ${i + 1} sur ${keywords[0]} et les dernieres tendances`,
    url: `https://example.com/article-${i + 1}`,
    source: ["Les Echos", "Le Figaro Tech", "TechCrunch FR", "Maddyness"][
      i % 4
    ],
    snippet: `Resume de l'article ${i + 1} traitant de ${keywords.join(", ")} avec des insights pertinents pour le secteur.`,
  }));

  return placeholderArticles;
}

export async function execute(
  config: {
    keywords: string[];
    day: string;
    hour: string;
  },
  apiKeys: Record<string, string>
): Promise<VeilleSectorielleResult> {
  if (!config.keywords || config.keywords.length < 3) {
    throw new Error("Veuillez fournir au moins 3 mots-cles");
  }
  if (config.keywords.length > 5) {
    throw new Error("Maximum 5 mots-cles autorises");
  }

  // Step 1: Fetch news articles for the keywords
  const rawArticles = await fetchNewsArticles(config.keywords);

  if (!rawArticles.length) {
    throw new Error(
      "Aucun article trouve pour les mots-cles fournis"
    );
  }

  // Step 2: Use Claude to summarize and rank articles, then analyze trends
  const articlesForPrompt = rawArticles
    .map(
      (a, i) =>
        `[${i + 1}] "${a.title}" (${a.source})\nURL: ${a.url}\nExtrait: ${a.snippet}`
    )
    .join("\n\n");

  const prompt = `Tu es un analyste de veille sectorielle expert. Analyse ces articles et produis un digest hebdomadaire.

MOTS-CLES DE VEILLE : ${config.keywords.join(", ")}

ARTICLES TROUVES :
${articlesForPrompt}

Genere exactement au format JSON suivant (sans markdown, juste le JSON brut) :
{
  "articles": [
    {
      "title": "titre de l'article",
      "url": "url de l'article",
      "source": "nom de la source",
      "summary": "resume IA de 2-3 phrases",
      "relevanceScore": 85
    }
  ],
  "trendAnalysis": "analyse de tendances en 3-5 phrases identifiant les themes emergents et les signaux faibles"
}

Regles :
- Selectionne les 10 articles les plus pertinents
- Classe-les par score de pertinence (0-100) decroissant
- Chaque resume fait 2-3 phrases percutantes
- L'analyse de tendances identifie les patterns et signaux faibles
- Reste factuel et objectif`;

  // TODO: Replace with real Anthropic API call in production
  // const anthropic = new Anthropic({ apiKey: apiKeys.anthropic });
  // const message = await anthropic.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 4000,
  //   messages: [{ role: "user", content: prompt }],
  // });
  // const responseText = message.content[0].type === "text" ? message.content[0].text : "";

  // Placeholder response for development
  const selectedArticles = rawArticles.slice(0, 10);
  const responseText = JSON.stringify({
    articles: selectedArticles.map((a, i) => ({
      title: a.title,
      url: a.url,
      source: a.source,
      summary: `Resume IA: ${a.snippet} Cet article met en lumiere des evolutions significatives dans le domaine.`,
      relevanceScore: 95 - i * 5,
    })),
    trendAnalysis: `Les mots-cles "${config.keywords.join(", ")}" revelent plusieurs tendances majeures cette semaine. On observe une acceleration des investissements dans le secteur, avec un interet croissant pour les solutions basees sur l'IA. Les acteurs traditionnels commencent a adapter leurs strategies face aux nouveaux entrants. Signal faible: une convergence entre ${config.keywords[0]} et ${config.keywords[1]} pourrait redefinir le marche dans les prochains mois.`,
  });

  let parsed: {
    articles: ArticleSummary[];
    trendAnalysis: string;
  };

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Erreur lors du parsing de la reponse IA");
  }

  if (!parsed.articles?.length || !parsed.trendAnalysis) {
    throw new Error("La reponse IA est incomplete");
  }

  return {
    keywords: config.keywords,
    articles: parsed.articles,
    trendAnalysis: parsed.trendAnalysis,
    deliverySchedule: {
      day: config.day,
      hour: config.hour,
    },
    generatedAt: new Date().toISOString(),
  };
}
