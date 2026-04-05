export const meta = {
  slug: "inbox-summarizer",
  name: "Inbox Summarizer",
  description:
    "Resumez vos emails, categorisez par urgence et obtenez des brouillons de reponse",
  longDescription:
    "L'Inbox Summarizer analyse vos emails colles en entree, les resume intelligemment et les categorise par niveau d'urgence (urgent, important, peut attendre). Pour chaque email, il identifie les actions requises et propose un brouillon de reponse genere par IA, adapte a vos priorites.",
  category: "productivite",
  creditsPerRun: 4,
  frequency: "on_demand" as const,
  icon: "📫",
  features: [
    "Resume intelligent des emails",
    "Categorisation urgent/important/peut attendre",
    "Brouillons de reponse IA",
    "Identification des actions requises",
  ],
  integrations: ["Email"],
};
