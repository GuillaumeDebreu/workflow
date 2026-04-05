import Anthropic from "@anthropic-ai/sdk";

interface EmailSummary {
  subject: string;
  from: string;
  summary: string;
  urgency: "urgent" | "important" | "peut_attendre";
  actions: string[];
  draftReply: string;
}

interface InboxSummaryResult {
  emails: EmailSummary[];
  totalCount: number;
  urgentCount: number;
  importantCount: number;
  canWaitCount: number;
  overallSummary: string;
  generatedAt: string;
}

function splitEmails(rawText: string): string[] {
  // Split on double newlines or common email separators
  const separators = /\n{2,}(?=(?:De|From|Objet|Subject|Date)\s*:)/gi;
  const emails = rawText.split(separators).filter((e) => e.trim().length > 10);

  // If no separators found, treat the whole block as one email
  if (emails.length === 0 && rawText.trim().length > 10) {
    return [rawText.trim()];
  }

  return emails;
}

export async function execute(
  config: any,
  apiKeys: Record<string, string>
): Promise<InboxSummaryResult> {
  const { emailsText, priorities } = config;

  if (!apiKeys.ANTHROPIC_API_KEY) {
    throw new Error("Cle API Anthropic requise");
  }

  const anthropic = new Anthropic({ apiKey: apiKeys.ANTHROPIC_API_KEY });

  const rawEmails = splitEmails(emailsText);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Tu es un assistant de productivite expert en gestion d'emails.

Priorites de l'utilisateur: ${priorities}

Voici les emails a analyser:

${rawEmails.map((e, i) => `--- EMAIL ${i + 1} ---\n${e}`).join("\n\n")}

Pour chaque email, fournis une analyse au format JSON (tableau) avec ces champs:
- "subject": sujet de l'email (deduis-le si absent)
- "from": expediteur (deduis-le si absent)
- "summary": resume en 1-2 phrases
- "urgency": "urgent", "important" ou "peut_attendre" (en fonction des priorites de l'utilisateur)
- "actions": tableau des actions requises (strings)
- "draftReply": brouillon de reponse court et professionnel en francais

Reponds UNIQUEMENT avec le JSON valide, sans texte autour. Le JSON doit etre un tableau d'objets.`,
      },
    ],
  });

  const responseContent = message.content[0];
  const responseText =
    responseContent.type === "text" ? responseContent.text : "[]";

  let emails: EmailSummary[];
  try {
    // Extract JSON from potential markdown code blocks
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    emails = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch {
    // Fallback: create a single summary entry
    emails = [
      {
        subject: "Ensemble des emails",
        from: "Divers",
        summary: responseText.slice(0, 200),
        urgency: "important",
        actions: ["Revoir manuellement les emails"],
        draftReply: "",
      },
    ];
  }

  const urgentCount = emails.filter((e) => e.urgency === "urgent").length;
  const importantCount = emails.filter((e) => e.urgency === "important").length;
  const canWaitCount = emails.filter((e) => e.urgency === "peut_attendre").length;

  // Generate overall summary
  const overallMessage = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `En 2-3 phrases, resume la situation de cette boite de reception:
- ${emails.length} emails analyses
- ${urgentCount} urgent(s), ${importantCount} important(s), ${canWaitCount} peut attendre
- Priorites utilisateur: ${priorities}

Donne un conseil actionnable pour gerer ces emails efficacement. Reponds en francais.`,
      },
    ],
  });

  const overallContent = overallMessage.content[0];
  const overallSummary =
    overallContent.type === "text" ? overallContent.text : "";

  return {
    emails,
    totalCount: emails.length,
    urgentCount,
    importantCount,
    canWaitCount,
    overallSummary,
    generatedAt: new Date().toISOString(),
  };
}
