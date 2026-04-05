import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";

interface StockData {
  ticker: string;
  price: number;
  weeklyChange: number;
  weeklyChangePercent: number;
  news: string[];
}

interface FinancialSummaryResult {
  summary: string;
  stocks: StockData[];
  marketSentiment: string;
  upcomingEvents: string[];
  generatedAt: string;
}

async function fetchStockData(ticker: string): Promise<StockData> {
  // TODO: Replace with real Yahoo Finance API call
  // const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`, {
  //   params: { range: "5d", interval: "1d" },
  // });

  const mockPrice = Math.round(100 + Math.random() * 400 * 100) / 100;
  const mockChange = Math.round((Math.random() * 10 - 5) * 100) / 100;

  return {
    ticker,
    price: mockPrice,
    weeklyChange: mockChange,
    weeklyChangePercent: Math.round((mockChange / mockPrice) * 100 * 100) / 100,
    news: [
      `${ticker} publie ses resultats trimestriels la semaine prochaine`,
      `Analyste releve son objectif de cours pour ${ticker}`,
    ],
  };
}

async function fetchTickerNews(
  ticker: string,
  _apiKey?: string
): Promise<string[]> {
  // TODO: Replace with real news API call
  // const response = await axios.get("https://newsapi.org/v2/everything", {
  //   params: { q: ticker, sortBy: "publishedAt", apiKey: _apiKey },
  // });

  return [
    `${ticker}: Nouvelle acquisition strategique annoncee`,
    `${ticker}: Le titre progresse suite a un partenariat majeur`,
  ];
}

export async function execute(
  config: any,
  apiKeys: Record<string, string>
): Promise<FinancialSummaryResult> {
  const { tickers, includeNews } = config;

  if (!apiKeys.ANTHROPIC_API_KEY) {
    throw new Error("Cle API Anthropic requise");
  }

  const anthropic = new Anthropic({ apiKey: apiKeys.ANTHROPIC_API_KEY });

  // Fetch stock data for all tickers
  const stockDataPromises = (tickers as string[]).map((ticker: string) =>
    fetchStockData(ticker)
  );
  const stocks = await Promise.all(stockDataPromises);

  // Fetch news if requested
  if (includeNews) {
    const newsPromises = stocks.map(async (stock) => {
      const news = await fetchTickerNews(stock.ticker, apiKeys.NEWS_API_KEY);
      stock.news = news;
      return stock;
    });
    await Promise.all(newsPromises);
  }

  // Generate AI summary
  const stockSummaryText = stocks
    .map(
      (s) =>
        `${s.ticker}: ${s.price}$ (${s.weeklyChange >= 0 ? "+" : ""}${s.weeklyChangePercent}%) - News: ${s.news.join("; ")}`
    )
    .join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Tu es un analyste financier. Voici les donnees hebdomadaires de mes actions:\n\n${stockSummaryText}\n\nGenere un resume hebdomadaire structure comprenant:\n1. Vue d'ensemble du marche\n2. Performance par valeur (tableau)\n3. Analyse de sentiment global\n4. Evenements a venir importants\n5. Points d'attention\n\nReponds en francais, de maniere claire et professionnelle.`,
      },
    ],
  });

  const summaryContent = message.content[0];
  const summaryText =
    summaryContent.type === "text" ? summaryContent.text : "";

  return {
    summary: summaryText,
    stocks,
    marketSentiment: "neutre",
    upcomingEvents: [
      "Publication resultats Q1 - AAPL (semaine prochaine)",
      "Decision taux directeur BCE (mercredi)",
    ],
    generatedAt: new Date().toISOString(),
  };
}
