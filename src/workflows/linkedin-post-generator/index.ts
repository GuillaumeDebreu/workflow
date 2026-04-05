import Anthropic from "@anthropic-ai/sdk";

interface LinkedInPost {
  format: "storytelling" | "liste" | "opinion";
  content: string;
  hashtags: string[];
  estimatedReadTime: string;
}

interface LinkedInPostResult {
  posts: LinkedInPost[];
  topic: string;
  tone: string;
  generatedAt: string;
}

export async function execute(
  config: any,
  apiKeys: Record<string, string>
): Promise<LinkedInPostResult> {
  const { topic, tone, industry } = config;

  if (!apiKeys.ANTHROPIC_API_KEY) {
    throw new Error("Cle API Anthropic requise");
  }

  const anthropic = new Anthropic({ apiKey: apiKeys.ANTHROPIC_API_KEY });

  const formats: Array<{ name: "storytelling" | "liste" | "opinion"; instruction: string }> = [
    {
      name: "storytelling",
      instruction:
        "Ecris un post LinkedIn au format storytelling. Commence par un hook accrocheur sur la premiere ligne, puis raconte une histoire personnelle ou professionnelle liee au sujet. Termine par une lecon ou un appel a l'action.",
    },
    {
      name: "liste",
      instruction:
        "Ecris un post LinkedIn au format liste. Commence par un hook accrocheur, puis presente 5 a 7 points cles sous forme de liste avec des emojis. Termine par une conclusion et un appel a l'engagement.",
    },
    {
      name: "opinion",
      instruction:
        "Ecris un post LinkedIn au format prise de position / opinion forte. Commence par une declaration audacieuse ou contre-intuitive, argumente ta position avec des exemples concrets, et termine par une question ouverte pour engager la discussion.",
    },
  ];

  const postPromises = formats.map(async (format) => {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Tu es un expert en creation de contenu LinkedIn pour l'industrie "${industry}".

Sujet: ${topic}
Ton: ${tone}

${format.instruction}

Regles:
- Maximum 1300 caracteres (optimal pour LinkedIn)
- Utilise des sauts de ligne pour aerer le texte
- Pas de liens externes
- Suggere 3-5 hashtags pertinents a la fin
- Le post doit etre en francais

Reponds avec UNIQUEMENT le post, suivi des hashtags sur une ligne separee prefixee par "HASHTAGS:".`,
        },
      ],
    });

    const responseContent = message.content[0];
    const responseText =
      responseContent.type === "text" ? responseContent.text : "";

    const parts = responseText.split("HASHTAGS:");
    const postContent = parts[0].trim();
    const hashtagsRaw = parts[1]?.trim() || "";
    const hashtags = hashtagsRaw
      .split(/[\s,]+/)
      .filter((h: string) => h.startsWith("#"))
      .map((h: string) => h.trim());

    const wordCount = postContent.split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      format: format.name,
      content: postContent,
      hashtags: hashtags.length > 0 ? hashtags : [`#${industry.replace(/\s+/g, "")}`, "#LinkedIn", "#Contenu"],
      estimatedReadTime: `${readTime} min`,
    } as LinkedInPost;
  });

  const posts = await Promise.all(postPromises);

  return {
    posts,
    topic,
    tone,
    generatedAt: new Date().toISOString(),
  };
}
