import Anthropic from "@anthropic-ai/sdk";

interface TaskItem {
  title: string;
  description: string;
  assignee: string;
  priority: "haute" | "moyenne" | "basse";
  suggestedDeadline: string;
}

interface MeetingDecision {
  decision: string;
  context: string;
}

interface MeetingTasksResult {
  summary: string;
  participants: string[];
  duration: string;
  decisions: MeetingDecision[];
  tasks: TaskItem[];
  nextSteps: string[];
  exportFormat: string;
}

export async function execute(
  config: {
    transcript: string;
    projectTool: string;
  },
  apiKeys: Record<string, string>
): Promise<MeetingTasksResult> {
  if (!config.transcript || config.transcript.length < 50) {
    throw new Error(
      "La transcription est requise et doit contenir au moins 50 caracteres"
    );
  }
  if (!config.projectTool) {
    throw new Error("Veuillez selectionner un outil d'export");
  }

  // Truncate very long transcripts to stay within reasonable token limits
  const transcript = config.transcript.slice(0, 15000);

  const prompt = `Tu es un assistant de productivite expert en gestion de reunions. Analyse cette transcription et extrais les informations cles.

TRANSCRIPTION DE LA REUNION :
${transcript}

Genere exactement au format JSON suivant (sans markdown, juste le JSON brut) :
{
  "summary": "resume structure de la reunion en 3-5 phrases",
  "participants": ["nom1", "nom2"],
  "duration": "duree estimee",
  "decisions": [
    {
      "decision": "description de la decision",
      "context": "contexte bref"
    }
  ],
  "tasks": [
    {
      "title": "titre court de la tache",
      "description": "description detaillee de ce qui doit etre fait",
      "assignee": "nom du responsable",
      "priority": "haute",
      "suggestedDeadline": "date suggeree au format YYYY-MM-DD"
    }
  ],
  "nextSteps": ["prochaine etape 1", "prochaine etape 2"]
}

Regles :
- Identifie tous les participants mentionnes
- Extrais toutes les decisions prises explicitement
- Pour chaque tache, identifie clairement le responsable (utilise le nom mentionne ou "Non assigne")
- Les priorites sont: "haute", "moyenne" ou "basse"
- Les deadlines suggerees doivent etre realistes (dans les 1-4 semaines a venir)
- Les prochaines etapes incluent les follow-ups necessaires
- Si la duree n'est pas claire, estime-la`;

  // TODO: Replace with real Anthropic API call in production
  // const anthropic = new Anthropic({ apiKey: apiKeys.anthropic });
  // const message = await anthropic.messages.create({
  //   model: "claude-sonnet-4-20250514",
  //   max_tokens: 4000,
  //   messages: [{ role: "user", content: prompt }],
  // });
  // const responseText = message.content[0].type === "text" ? message.content[0].text : "";

  // Placeholder response for development
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeks = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const threeWeeks = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const responseText = JSON.stringify({
    summary:
      "La reunion a porte sur l'avancement du projet et la planification des prochaines etapes. Les participants ont discute des blocages actuels et ont defini des priorites claires pour les deux prochaines semaines. Plusieurs decisions importantes ont ete prises concernant la strategie a adopter.",
    participants: ["Alice", "Bob", "Charlie"],
    duration: "45 minutes",
    decisions: [
      {
        decision: "Adopter la nouvelle architecture technique",
        context:
          "Apres analyse des options, l'equipe a choisi la solution la plus scalable",
      },
      {
        decision: "Reporter le lancement d'une semaine",
        context:
          "Pour permettre des tests supplementaires et garantir la qualite",
      },
    ],
    tasks: [
      {
        title: "Finaliser les specs techniques",
        description:
          "Rediger le document de specifications techniques detaille incluant les diagrammes d'architecture et les endpoints API",
        assignee: "Alice",
        priority: "haute" as const,
        suggestedDeadline: formatDate(nextWeek),
      },
      {
        title: "Preparer l'environnement de staging",
        description:
          "Configurer le serveur de staging avec les nouvelles variables d'environnement et deployer la derniere version",
        assignee: "Bob",
        priority: "haute" as const,
        suggestedDeadline: formatDate(nextWeek),
      },
      {
        title: "Rediger les tests d'integration",
        description:
          "Ecrire les tests d'integration pour les 3 endpoints critiques identifies pendant la reunion",
        assignee: "Charlie",
        priority: "moyenne" as const,
        suggestedDeadline: formatDate(twoWeeks),
      },
      {
        title: "Mettre a jour la documentation",
        description:
          "Mettre a jour le wiki avec les nouvelles decisions architecturales et les procedures de deploiement",
        assignee: "Alice",
        priority: "basse" as const,
        suggestedDeadline: formatDate(threeWeeks),
      },
    ],
    nextSteps: [
      "Point de suivi dans 1 semaine pour valider l'avancement",
      "Partager le document de specs avec l'equipe elargie",
      "Planifier une session de review du code avant le deploiement",
    ],
  });

  let parsed: {
    summary: string;
    participants: string[];
    duration: string;
    decisions: MeetingDecision[];
    tasks: TaskItem[];
    nextSteps: string[];
  };

  try {
    parsed = JSON.parse(responseText);
  } catch {
    throw new Error("Erreur lors du parsing de la reponse IA");
  }

  if (
    !parsed.summary ||
    !parsed.tasks?.length ||
    !parsed.participants?.length
  ) {
    throw new Error("La reponse IA est incomplete");
  }

  // TODO: In production, export to the selected tool
  // if (config.projectTool === "notion") {
  //   // Use Notion API to create a page with tasks
  //   // const notionApiKey = apiKeys.notion;
  //   // await axios.post("https://api.notion.com/v1/pages", { ... }, {
  //   //   headers: { Authorization: `Bearer ${notionApiKey}`, "Notion-Version": "2022-06-28" }
  //   // });
  // } else if (config.projectTool === "email") {
  //   // Use Resend or similar to send the summary by email
  //   // await resend.emails.send({ ... });
  // }

  return {
    summary: parsed.summary,
    participants: parsed.participants,
    duration: parsed.duration,
    decisions: parsed.decisions,
    tasks: parsed.tasks,
    nextSteps: parsed.nextSteps,
    exportFormat: config.projectTool,
  };
}
