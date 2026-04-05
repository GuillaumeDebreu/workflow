import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";

interface SEOArticleResult {
  keyword: string;
  language: string;
  wordCount: number;
  article: string;
  metaDescription: string;
  titleTags: string[];
  outline: string[];
  generatedAt: string;
}

async function fetchRelatedKeywords(
  keyword: string,
  _language: string
): Promise<string[]> {
  // TODO: Replace with real SEO API call (e.g., SEMrush, Ahrefs, or Google Keyword Planner)
  // const response = await axios.get("https://api.semrush.com/", {
  //   params: { type: "phrase_related", key: apiKey, phrase: keyword, database: language === "fr" ? "fr" : "us" },
  // });

  return [
    `${keyword} guide`,
    `${keyword} strategie`,
    `${keyword} exemples`,
    `${keyword} outils`,
    `meilleur ${keyword}`,
  ];
}

export async function execute(
  config: any,
  apiKeys: Record<string, string>
): Promise<SEOArticleResult> {
  const { keyword, audience, wordCount, language } = config;

  if (!apiKeys.ANTHROPIC_API_KEY) {
    throw new Error("Cle API Anthropic requise");
  }

  const anthropic = new Anthropic({ apiKey: apiKeys.ANTHROPIC_API_KEY });
  const targetWords = parseInt(wordCount, 10);
  const lang = language === "fr" ? "francais" : "anglais";

  // Step 1: Fetch related keywords for SEO enrichment
  const relatedKeywords = await fetchRelatedKeywords(keyword, language);

  // Step 2: Generate article outline
  const outlineMessage = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Tu es un expert SEO et redacteur web. Genere un plan detaille pour un article de blog de ${targetWords} mots en ${lang}.

Mot-cle principal: ${keyword}
Audience cible: ${audience}
Mots-cles secondaires: ${relatedKeywords.join(", ")}

Genere un plan avec des titres H2 et H3 structures pour le SEO.
Reponds UNIQUEMENT avec un tableau JSON de strings representant les titres (prefixes par "H2:" ou "H3:").
Exemple: ["H2: Premier titre", "H3: Sous-titre 1.1", "H3: Sous-titre 1.2", "H2: Deuxieme titre"]`,
      },
    ],
  });

  const outlineContent = outlineMessage.content[0];
  const outlineText = outlineContent.type === "text" ? outlineContent.text : "[]";

  let outline: string[];
  try {
    const jsonMatch = outlineText.match(/\[[\s\S]*\]/);
    outline = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch {
    outline = [
      `H2: Guide complet sur ${keyword}`,
      `H3: Pourquoi ${keyword} est important`,
      `H3: Les bases de ${keyword}`,
      `H2: Strategies pour ${keyword}`,
      `H3: Strategie 1`,
      `H3: Strategie 2`,
      `H2: Outils et ressources`,
      `H2: Conclusion`,
    ];
  }

  // Step 3: Generate the full article
  const articleMessage = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: targetWords <= 800 ? 2048 : targetWords <= 1500 ? 4096 : 8192,
    messages: [
      {
        role: "user",
        content: `Tu es un redacteur SEO expert. Ecris un article de blog complet en ${lang}.

Mot-cle principal: ${keyword}
Audience cible: ${audience}
Mots-cles secondaires: ${relatedKeywords.join(", ")}
Nombre de mots cible: ${targetWords}

Plan de l'article:
${outline.join("\n")}

Regles SEO:
- Utilise le mot-cle principal dans le premier paragraphe
- Inclus les mots-cles secondaires naturellement dans le texte
- Structure avec des balises H2 et H3 (utilise ## et ### en markdown)
- Paragraphes courts (3-4 phrases max)
- Inclus des listes a puces quand c'est pertinent
- Ajoute une introduction engageante et une conclusion avec appel a l'action
- Densite du mot-cle principal: 1-2%
- Ecris pour l'audience cible specifique

Ecris UNIQUEMENT l'article en markdown, sans commentaires additionnels.`,
      },
    ],
  });

  const articleContent = articleMessage.content[0];
  const article = articleContent.type === "text" ? articleContent.text : "";

  // Step 4: Generate meta description and title tags
  const metaMessage = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Tu es un expert SEO. Pour un article sur "${keyword}" en ${lang}, genere:

1. Une meta description optimisee (150-160 caracteres, avec le mot-cle, incitant au clic)
2. 3 suggestions de title tags (50-60 caracteres chacun, avec le mot-cle en debut)

Reponds UNIQUEMENT en JSON valide:
{
  "metaDescription": "...",
  "titleTags": ["...", "...", "..."]
}`,
      },
    ],
  });

  const metaContent = metaMessage.content[0];
  const metaText = metaContent.type === "text" ? metaContent.text : "{}";

  let metaDescription: string;
  let titleTags: string[];

  try {
    const jsonMatch = metaText.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    metaDescription = parsed.metaDescription || `Decouvrez tout sur ${keyword} dans ce guide complet.`;
    titleTags = parsed.titleTags || [`${keyword} : Guide Complet ${new Date().getFullYear()}`];
  } catch {
    metaDescription = `Decouvrez tout sur ${keyword} dans ce guide complet adapte a ${audience}.`;
    titleTags = [
      `${keyword} : Guide Complet ${new Date().getFullYear()}`,
      `Tout Savoir sur ${keyword} | Guide Expert`,
      `${keyword} - Strategies et Conseils pour ${audience}`,
    ];
  }

  const actualWordCount = article.split(/\s+/).filter((w) => w.length > 0).length;

  return {
    keyword,
    language,
    wordCount: actualWordCount,
    article,
    metaDescription,
    titleTags,
    outline,
    generatedAt: new Date().toISOString(),
  };
}
