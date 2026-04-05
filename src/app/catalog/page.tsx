"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import WorkflowCard from "@/components/WorkflowCard";

interface WorkflowMeta {
  slug: string;
  name: string;
  description: string;
  category: string;
  creditsPerRun: number;
  icon: string;
  frequency: string;
}

const categories = [
  { value: "all", label: "Tous" },
  { value: "contenu", label: "Contenu" },
  { value: "prospection", label: "Prospection" },
  { value: "veille", label: "Veille" },
  { value: "finance", label: "Finance" },
  { value: "productivite", label: "Productivite" },
  { value: "ecommerce", label: "E-commerce" },
];

export default function CatalogPage() {
  const [workflows, setWorkflows] = useState<WorkflowMeta[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch("/api/workflows/list")
      .then((res) => res.json())
      .then((data) => setWorkflows(data.workflows || []));
  }, []);

  const filtered =
    activeCategory === "all"
      ? workflows
      : workflows.filter((w) => w.category === activeCategory);

  return (
    <Providers>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl sm:text-5xl mb-4">
            Catalogue des <span className="text-gold">Automatisations</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Choisissez un workflow, configurez-le en 5 minutes, et laissez
            l&apos;IA travailler pour vous.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? "bg-gold text-background"
                  : "bg-surface border border-border text-muted hover:text-foreground hover:border-border-light"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((w) => (
            <WorkflowCard key={w.slug} {...w} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted py-12">
            Aucun workflow dans cette categorie pour le moment.
          </p>
        )}
      </main>
    </Providers>
  );
}
