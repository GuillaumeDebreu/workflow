import Link from "next/link";

interface WorkflowCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  creditsPerRun: number;
  icon: string;
  frequency: string;
}

const categoryColors: Record<string, string> = {
  contenu: "bg-blue-500/10 text-blue-400",
  prospection: "bg-purple-500/10 text-purple-400",
  veille: "bg-green-500/10 text-green-400",
  finance: "bg-yellow-500/10 text-yellow-400",
  productivite: "bg-orange-500/10 text-orange-400",
  ecommerce: "bg-pink-500/10 text-pink-400",
};

export default function WorkflowCard({
  slug,
  name,
  description,
  category,
  creditsPerRun,
  icon,
  frequency,
}: WorkflowCardProps) {
  return (
    <Link href={`/catalog/${slug}`}>
      <div className="group bg-surface border border-border rounded-xl p-6 hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 h-full">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{icon}</span>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              categoryColors[category] || "bg-gray-500/10 text-gray-400"
            }`}
          >
            {category}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
          {name}
        </h3>
        <p className="text-muted text-sm mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1">
            <span className="text-gold">{creditsPerRun}</span> credits/exec
          </span>
          <span className="capitalize">{frequency.replace("_", " ")}</span>
        </div>
      </div>
    </Link>
  );
}
