import { z } from "zod";

export const configSchema = z.object({
  tickers: z
    .array(z.string().min(1))
    .min(5, "Au moins 5 symboles requis")
    .max(10, "Maximum 10 symboles"),
  day: z.enum(["lundi", "mardi", "mercredi", "jeudi", "vendredi"]),
  includeNews: z.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;

export const configFields = [
  {
    name: "tickers",
    label: "Symboles boursiers",
    type: "tags" as const,
    placeholder: "Ex: AAPL, MSFT, TSLA...",
    required: true,
  },
  {
    name: "day",
    label: "Jour de reception",
    type: "select" as const,
    options: [
      { value: "lundi", label: "Lundi" },
      { value: "mardi", label: "Mardi" },
      { value: "mercredi", label: "Mercredi" },
      { value: "jeudi", label: "Jeudi" },
      { value: "vendredi", label: "Vendredi" },
    ],
    required: true,
  },
  {
    name: "includeNews",
    label: "Inclure les actualites",
    type: "boolean" as const,
    required: false,
  },
];
