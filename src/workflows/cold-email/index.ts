import axios from "axios";
import * as cheerio from "cheerio";
import Anthropic from "@anthropic-ai/sdk";

interface EmailVariant {
  style: string;
  subject: string;
  body: string;
}

interface ColdEmailResult {
  prospectName: string;
  prospectTitle: string;
  prospectCompany: string;
  variants: EmailVariant[];
}

async function scrapeLinkedInProfile(url: string): Promise<{
  name: string;
  title: string;
  company: string;
  summary: string;
}> {
  // TODO: Replace with real LinkedIn scraping in production
  // LinkedIn requires authentication; consider using a scraping API service
  // const response = await axios.get(url, {
  //   headers: { "User-Agent": "Mozilla/5.0 (compatible; ColdEmail/1.0)" },
  //   timeout: 15000,
  // });
  // const $ = cheerio.load(response.data);

  // Placeholder: simulate LinkedIn profile data
  const placeholderHtml = `
    <html>
      <body>
        <h1 class="top-card-layout__title">Marie Martin</h1>
        <h2 class="top-card-layout__headline">VP Marketing chez TechCorp</h2>
        <section class="summary"><p>Experte en growth marketing B2B SaaS avec 10 ans d'experience.</p></section>
      </body>
    </html>
  `;
  const $ = cheerio.load(placeholderHtml);

  const name =
    $("h1").first().text().trim() || "Prospect";
  const headline =
    $("h2").first().text().trim() || "";

  const titleMatch = headline.match(/^([^@chez]+)/i);
  const companyMatch = headline.match(/(?:@|chez|at)\s*(.+)/i);

  return {
    name,
    title: titleMatch ? titleMatch[1].trim() : headline,
    company: companyMatch ? companyMatch[1].trim() : "Entreprise",
    summary: $("section.summary").text().trim() || headline,
  };
}

export async function execute(
  config: {
    linkedinUrl: string;
    senderName: string;
    senderCompany: string;
    objective: string;
  },
  apiKeys: Record<string, string>
): Promise<ColdEmailResult> {
  if (!config.linkedinUrl) {
    throw new Error("L'URL LinkedIn du prospect est requise");
  }
  if (!config.senderName || !config.senderCompany) {
    throw new Error("Le nom et l'entreprise de l'expediteur sont requis");
  }
  if (!config.objective) {
    throw new Error("L'objectif de l'email est requis");
  }

  // Step 1: Scrape the LinkedIn profile
  const profile = await scrapeLinkedInProfile(config.linkedinUrl);

  // Step 2: Generate cold email variants with Claude
  const prompt = `Tu es un expert en cold emailing B2B. Genere 3 variantes d'email de prospection.

PROFIL DU PROSPECT :
- Nom: ${profile.name}
- Poste: ${profile.title}
- Entreprise: ${profile.company}
- Resume: ${profile.summary}

EXPEDITEUR :
- Nom: ${config.senderName}
- Entreprise: ${config.senderCompany}

OBJECTIF : ${config.objective}

Genere exactement au format JSON suivant (sans markdown, juste le JSON brut) :
{
  "variants": [
    {
      "style": "formel",
      "subject": "objet de l'email",
      "body": "corps de l'email"
    },
    {
      "style": "casual",
      "subject": "objet de l'email",
      "body": "corps de l'email"
    },
    {
      "style": "direct",
      "subject": "objet de l'email",
      "body": "corps de l'email"
    }
  ]
}

Regles :
- Chaque email fait 100-200 mots max
- Personnalise avec des elements du profil du prospect
- L'objet doit etre < 60 caracteres et susciter la curiosite
- Inclure un CTA clair a la fin
- Formel : vouvoiement, structure classique
- Casual : tutoiement possible, ton amical
- Direct : droit au but, proposition de valeur immediate`;

  // TODO: Replace with real Anthropic API call in production
  // const anthropic = new Anthropic({ apiKey: apiKeys.anthropic });
  // const message = await anthropic.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 3000,
  //   messages: [{ role: "user", content: prompt }],
  // });
  // const responseText = message.content[0].type === "text" ? message.content[0].text : "";

  // Placeholder response for development
  const responseText = JSON.stringify({
    variants: [
      {
        style: "formel",
        subject: `${profile.company} x ${config.senderCompany} : une synergie a explorer`,
        body: `Bonjour ${profile.name},\n\nJe me permets de vous contacter car votre parcours chez ${profile.company} a retenu mon attention.\n\n${config.objective}\n\nSeriez-vous disponible pour un echange de 15 minutes cette semaine ?\n\nCordialement,\n${config.senderName}\n${config.senderCompany}`,
      },
      {
        style: "casual",
        subject: `Une idee pour ${profile.company}`,
        body: `Salut ${profile.name},\n\nJ'ai vu ton profil et ce que tu fais chez ${profile.company} est vraiment top.\n\n${config.objective}\n\nOn se cale un cafe virtuel ?\n\nA bientot,\n${config.senderName}`,
      },
      {
        style: "direct",
        subject: `${config.objective.slice(0, 50)}`,
        body: `${profile.name},\n\nJe suis ${config.senderName} de ${config.senderCompany}.\n\n${config.objective}\n\nDisponible demain 10h ou 14h ?\n\n${config.senderName}`,
      },
    ],
  });

  let parsed: { variants: EmailVariant[] };

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Erreur lors du parsing de la reponse IA");
  }

  if (!parsed.variants || parsed.variants.length < 3) {
    throw new Error("La reponse IA est incomplete - moins de 3 variantes");
  }

  return {
    prospectName: profile.name,
    prospectTitle: profile.title,
    prospectCompany: profile.company,
    variants: parsed.variants,
  };
}
