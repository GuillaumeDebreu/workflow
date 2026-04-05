import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";

interface PriceEntry {
  url: string;
  productName: string;
  currentPrice: number;
  previousPrice: number | null;
  currency: string;
  changePercent: number | null;
  alert: boolean;
}

interface PriceMonitorResult {
  prices: PriceEntry[];
  alerts: PriceEntry[];
  trendReport: string;
  checkedAt: string;
}

async function scrapePrice(url: string): Promise<{ productName: string; price: number; currency: string }> {
  // TODO: Replace with real web scraping logic
  // const response = await axios.get(url, {
  //   headers: { "User-Agent": "Mozilla/5.0 (compatible; PriceMonitor/1.0)" },
  // });
  // Parse HTML to extract price using cheerio or similar

  const mockPrice = Math.round((10 + Math.random() * 490) * 100) / 100;
  const domain = new URL(url).hostname.replace("www.", "");

  return {
    productName: `Produit sur ${domain}`,
    price: mockPrice,
    currency: "EUR",
  };
}

function getPreviousPrice(_url: string): number | null {
  // TODO: Replace with actual database/storage lookup for price history
  // const history = await db.priceHistory.findLatest({ url });
  // return history?.price ?? null;

  const hasPrevious = Math.random() > 0.3;
  if (!hasPrevious) return null;
  return Math.round((10 + Math.random() * 490) * 100) / 100;
}

export async function execute(
  config: any,
  apiKeys: Record<string, string>
): Promise<PriceMonitorResult> {
  const { urls, threshold } = config;

  if (!apiKeys.ANTHROPIC_API_KEY) {
    throw new Error("Cle API Anthropic requise");
  }

  const anthropic = new Anthropic({ apiKey: apiKeys.ANTHROPIC_API_KEY });

  // Scrape prices for all URLs
  const pricePromises = (urls as string[]).map(async (url: string) => {
    try {
      const { productName, price, currency } = await scrapePrice(url);
      const previousPrice = getPreviousPrice(url);

      let changePercent: number | null = null;
      let alert = false;

      if (previousPrice !== null) {
        changePercent =
          Math.round(((price - previousPrice) / previousPrice) * 100 * 100) / 100;
        alert = Math.abs(changePercent) >= threshold;
      }

      return {
        url,
        productName,
        currentPrice: price,
        previousPrice,
        currency,
        changePercent,
        alert,
      } as PriceEntry;
    } catch (error) {
      return {
        url,
        productName: "Erreur de recuperation",
        currentPrice: 0,
        previousPrice: null,
        currency: "EUR",
        changePercent: null,
        alert: false,
      } as PriceEntry;
    }
  });

  const prices = await Promise.all(pricePromises);
  const alerts = prices.filter((p) => p.alert);

  // Generate trend report with AI
  const priceDataText = prices
    .map(
      (p) =>
        `${p.productName} (${p.url}): ${p.currentPrice}${p.currency}${p.previousPrice !== null ? ` (precedent: ${p.previousPrice}${p.currency}, variation: ${p.changePercent}%)` : " (premier releve)"}`
    )
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Tu es un analyste ecommerce specialise dans la veille tarifaire.

Voici les prix releves aujourd'hui (seuil d'alerte: ${threshold}%):

${priceDataText}

Genere un rapport de tendances concis comprenant:
1. Resume des changements de prix
2. Alertes importantes (variations au-dela du seuil)
3. Recommandations strategiques

Reponds en francais.`,
      },
    ],
  });

  const reportContent = message.content[0];
  const trendReport = reportContent.type === "text" ? reportContent.text : "";

  return {
    prices,
    alerts,
    trendReport,
    checkedAt: new Date().toISOString(),
  };
}
