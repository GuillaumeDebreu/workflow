import Link from "next/link";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const steps = [
  {
    num: "01",
    title: "Choisissez",
    desc: "Parcourez notre catalogue de 10+ workflows IA prets a l'emploi.",
  },
  {
    num: "02",
    title: "Configurez",
    desc: "Remplissez quelques champs (URL, mots-cles, ton...). 5 minutes max.",
  },
  {
    num: "03",
    title: "Activez",
    desc: "Recevez les resultats par email. Automatiquement, sans code.",
  },
];

const workflows = [
  { icon: "\u270D\uFE0F", name: "Content Repurposer", desc: "Article \u2192 5 posts LinkedIn + 5 tweets + 1 script video", credits: 5, cat: "Contenu" },
  { icon: "\uD83D\uDCE8", name: "Cold Email", desc: "3 variantes d'email de prospection personnalise par IA", credits: 2, cat: "Prospection" },
  { icon: "\uD83D\uDD0D", name: "Veille Sectorielle", desc: "Digest hebdo des 10 actus cles de votre secteur", credits: 15, cat: "Veille" },
  { icon: "\u2B50", name: "Analyseur d'Avis", desc: "Rapport sentiment + plaintes recurrentes + reponses types", credits: 12, cat: "E-commerce" },
  { icon: "\uD83D\uDCDD", name: "Meeting \u2192 Taches", desc: "Transcription \u2192 resume + taches + responsables + deadlines", credits: 8, cat: "Productivite" },
  { icon: "\uD83D\uDCC8", name: "Resume Financier", desc: "Suivi hebdo de vos actions : performance, news, sentiment", credits: 18, cat: "Finance" },
];

const pricing = [
  { name: "Zapier + IA", price: "300\u20AC+/mois", items: ["Config complexe", "Couts API en plus", "Maintenance requise"] },
  { name: "Agence", price: "5 000\u20AC+", items: ["Delais de livraison", "Rigide a modifier", "Dependance externe"] },
  { name: "AutoFlow", price: "Gratuit", highlight: true, items: ["Pret en 5 minutes", "100 credits offerts", "Zero code, tout heberge"] },
];

export default function LandingPage() {
  return (
    <Providers>
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-block px-4 py-1.5 bg-gold/10 text-gold rounded-full text-sm font-medium mb-6">
          100 credits offerts &middot; Aucune carte requise
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6 max-w-4xl mx-auto">
          Activez vos{" "}
          <span className="text-gold">automatisations IA</span>{" "}
          en 5 minutes
        </h1>
        <p className="text-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10">
          Le Netflix des automatisations IA. Choisissez un workflow, configurez quelques
          champs, et recevez les resultats par email. Zero code, tout est heberge.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-gold text-background font-semibold rounded-xl hover:bg-gold-light transition-colors text-lg"
          >
            Creer mon compte gratuit
          </Link>
          <Link
            href="/catalog"
            className="px-8 py-4 bg-surface border border-border font-semibold rounded-xl hover:border-gold/30 transition-colors text-lg"
          >
            Voir le catalogue
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="font-serif text-3xl sm:text-4xl text-center mb-16">
          Comment <span className="text-gold">ca marche</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.num} className="text-center">
              <div className="text-5xl font-serif text-gold/20 mb-4">
                {step.num}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl mb-4">
            10+ workflows <span className="text-gold">prets a l&apos;emploi</span>
          </h2>
          <p className="text-muted text-lg">
            Veille, prospection, contenu, finance, productivite, e-commerce
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {workflows.map((w) => (
            <div
              key={w.name}
              className="bg-surface border border-border rounded-xl p-6 hover:border-gold/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{w.icon}</span>
                <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full">
                  {w.cat}
                </span>
              </div>
              <h3 className="font-semibold mb-1">{w.name}</h3>
              <p className="text-muted text-sm mb-3">{w.desc}</p>
              <p className="text-xs text-muted">
                <span className="text-gold">{w.credits}</span> credits/execution
              </p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/catalog"
            className="text-gold hover:underline font-medium"
          >
            Voir tous les workflows &rarr;
          </Link>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <h2 className="font-serif text-3xl sm:text-4xl text-center mb-16">
          Pourquoi <span className="text-gold">AutoFlow</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-8 ${
                p.highlight
                  ? "bg-gold/5 border-2 border-gold"
                  : "bg-surface border border-border"
              }`}
            >
              <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
              <p
                className={`text-3xl font-bold mb-6 ${
                  p.highlight ? "text-gold" : ""
                }`}
              >
                {p.price}
              </p>
              <ul className="space-y-3">
                {p.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted">
                    <span className={p.highlight ? "text-gold" : "text-muted"}>
                      {p.highlight ? "\u2713" : "\u2717"}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border text-center">
        <h2 className="font-serif text-3xl sm:text-4xl mb-6">
          Pret a <span className="text-gold">automatiser</span> ?
        </h2>
        <p className="text-muted text-lg mb-8 max-w-xl mx-auto">
          Creez votre compte gratuitement et activez vos 2 premieres
          automatisations IA en quelques minutes.
        </p>
        <Link
          href="/login"
          className="inline-block px-8 py-4 bg-gold text-background font-semibold rounded-xl hover:bg-gold-light transition-colors text-lg"
        >
          Commencer gratuitement
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-serif text-xl text-gold">AutoFlow</span>
          <p className="text-muted text-sm">
            &copy; 2026 AutoFlow. Tous droits reserves.
          </p>
        </div>
      </footer>
    </Providers>
  );
}
