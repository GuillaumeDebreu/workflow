import axios from "axios";
import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";

interface ContentRepurposerResult {
  sourceUrl: string;
  sourceTitle: string;
  linkedinPosts: string[];
  tweets: string[];
  videoScript: string;
  tone: string;
}

async function scrapeArticle(
  url: string
): Promise<{ title: string; content: string }> {
  // TODO: Add real HTTP request in production
  // const response = await axios.get(url, {
  //   headers: { "User-Agent": "Mozilla/5.0 (compatible; ContentRepurposer/1.0)" },
  //   timeout: 15000,
  // });
  // const $ = cheerio.load(response.data);

  // Placeholder: simulate scraping
  const placeholderHtml = `
    <html>
      <head><title>Sample Article</title></head>
      <body>
        <article>
          <h1>Sample Article Title</h1>
          <p>This is placeholder article content that would be scraped from the provided URL.</p>
        </article>
      </body>
    </html>
  `;
  const $ = cheerio.load(placeholderHtml);

  const title =
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "Article sans titre";

  // Extract main content from common article selectors
  const selectors = [
    "article",
    '[role="main"]',
    ".post-content",
    ".article-body",
    ".entry-content",
    "main",
  ];
  let content = "";
  for (const selector of selectors) {
    const el = $(selector);
    if (el.length) {
      el.find("script, style, nav, footer, header, aside").remove();
      content = el.text().trim();
      break;
    }
  }

  if (!content) {
    content = $("body").text().trim().slice(0, 5000);
  }

  return { title, content: content.slice(0, 8000) };
}

export async function execute(
  config: { url: string; tone: string },
  apiKeys: Record<string, string>
): Promise<ContentRepurposerResult> {
  if (!config.url) {
    throw new Error("L'URL de l'article est requise");
  }

  // Step 1: Scrape the article
  const { title, content } = await scrapeArticle(config.url);

  if (!content || content.length < 50) {
    throw new Error(
      "Impossible d'extraire suffisamment de contenu de l'article"
    );
  }

  // Step 2: Generate repurposed content with Claude
  const toneInstructions: Record<string, string> = {
    professionnel:
      "Utilise un ton professionnel, structure et credible. Vocabulaire soutenu sans etre pompeux.",
    casual:
      "Utilise un ton decontracte, accessible et engageant. Comme si tu parlais a un ami.",
    expert:
      "Utilise un ton d'expert du domaine, avec des termes techniques precis et des insights pointus.",
  };

  const prompt = `Tu es un expert en content marketing. A partir de cet article, genere du contenu pour plusieurs plateformes.

ARTICLE :
Titre: ${title}
Contenu: ${content}

TON : ${config.tone} - ${toneInstructions[config.tone] || toneInstructions.professionnel}

Genere exactement au format JSON suivant (sans markdown, juste le JSON brut) :
{
  "linkedinPosts": ["post1", "post2", "post3", "post4", "post5"],
  "tweets": ["tweet1", "tweet2", "tweet3", "tweet4", "tweet5"],
  "videoScript": "script video de 60 secondes"
}

Regles :
- LinkedIn : chaque post fait 800-1200 caracteres, avec emojis et hashtags
- Tweets : chaque tweet fait max 280 caracteres, percutants
- Video script : structure avec intro accrocheuse (5s), contenu principal (45s), CTA (10s)`;

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
    linkedinPosts: [
      `[Post LinkedIn 1 - ${config.tone}] Contenu genere a partir de: ${title}`,
      `[Post LinkedIn 2 - ${config.tone}] Point cle de l'article`,
      `[Post LinkedIn 3 - ${config.tone}] Insight principal`,
      `[Post LinkedIn 4 - ${config.tone}] Statistique marquante`,
      `[Post LinkedIn 5 - ${config.tone}] Conclusion et appel a l'action`,
    ],
    tweets: [
      `[Tweet 1] Resume de: ${title}`,
      `[Tweet 2] Point cle #contenu`,
      `[Tweet 3] Saviez-vous que...`,
      `[Tweet 4] A retenir`,
      `[Tweet 5] Thread a suivre`,
    ],
    videoScript: `[Script Video 60s] Introduction accrocheuse sur ${title}. Contenu principal avec les points cles. Appel a l'action final.`,
  });

  let parsed: {
    linkedinPosts: string[];
    tweets: string[];
    videoScript: string;
  };

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Erreur lors du parsing de la reponse IA");
  }

  if (
    !parsed.linkedinPosts?.length ||
    !parsed.tweets?.length ||
    !parsed.videoScript
  ) {
    throw new Error("La reponse IA est incomplete");
  }

  return {
    sourceUrl: config.url,
    sourceTitle: title,
    linkedinPosts: parsed.linkedinPosts,
    tweets: parsed.tweets,
    videoScript: parsed.videoScript,
    tone: config.tone,
  };
}
