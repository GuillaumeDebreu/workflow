export const meta = {
  slug: "resume-financier",
  name: "Resume Financier",
  description:
    "Resume hebdomadaire de vos actions : performance, news et sentiment",
  longDescription:
    "Le Resume Financier compile chaque semaine les performances de vos actions favorites, les actualites marquantes par valeur et une analyse de sentiment du marche. Suivez jusqu'a 10 valeurs, choisissez le jour de reception et restez informe des evenements a venir qui pourraient impacter vos investissements.",
  category: "finance",
  creditsPerRun: 18,
  frequency: "weekly" as const,
  icon: "📈",
  features: [
    "Suivi de 10 valeurs max",
    "Performance hebdomadaire",
    "News par valeur",
    "Analyse de sentiment marche",
    "Evenements a venir",
  ],
  integrations: ["Yahoo Finance", "Email"],
};
