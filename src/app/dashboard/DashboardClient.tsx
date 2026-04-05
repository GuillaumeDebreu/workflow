"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import CreditsBadge from "@/components/CreditsBadge";

interface DashboardProps {
  user: {
    plan: string;
    creditsRemaining: number;
    totalCredits: number;
    email: string;
  };
  activeWorkflows: {
    id: string;
    slug: string;
    name: string;
    icon: string;
    isActive: boolean;
    frequency: string;
    creditsPerRun: number;
    lastRunAt: string | null;
    nextRunAt: string | null;
  }[];
  executions: {
    id: string;
    workflowName: string;
    workflowIcon: string;
    status: string;
    creditsUsed: number;
    startedAt: string;
    completedAt: string | null;
  }[];
}

const statusColors: Record<string, string> = {
  SUCCESS: "text-success",
  FAILED: "text-error",
  RUNNING: "text-warning",
  PENDING: "text-muted",
};

const statusLabels: Record<string, string> = {
  SUCCESS: "Succes",
  FAILED: "Erreur",
  RUNNING: "En cours",
  PENDING: "En attente",
};

export default function DashboardClient({
  user,
  activeWorkflows,
  executions,
}: DashboardProps) {
  return (
    <Providers>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl mb-1">Dashboard</h1>
            <p className="text-muted">{user.email}</p>
          </div>
          {user.plan === "FREE" && (
            <Link
              href="/api/stripe/checkout"
              className="px-6 py-2.5 bg-gold text-background font-semibold rounded-lg hover:bg-gold-light transition-colors"
            >
              Passer Pro - 49&#8364;/mois
            </Link>
          )}
        </div>

        {/* Credits + Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted">Credits restants</h3>
              <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full uppercase font-medium">
                {user.plan}
              </span>
            </div>
            <p className="text-3xl font-bold text-gold mb-3">
              {user.creditsRemaining}
            </p>
            <CreditsBadge
              remaining={user.creditsRemaining}
              total={user.totalCredits}
            />
          </div>
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-sm font-medium text-muted mb-3">
              Workflows actifs
            </h3>
            <p className="text-3xl font-bold mb-3">
              {activeWorkflows.filter((w) => w.isActive).length}
              <span className="text-lg text-muted font-normal">
                {user.plan === "FREE" ? " / 2" : " / illimite"}
              </span>
            </p>
            {activeWorkflows.filter((w) => w.isActive).length === 0 && (
              <Link
                href="/catalog"
                className="text-gold text-sm hover:underline"
              >
                Parcourir le catalogue &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* Active Workflows */}
        <section className="mb-10">
          <h2 className="font-serif text-2xl mb-6">Mes workflows actifs</h2>
          {activeWorkflows.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <p className="text-muted mb-4">
                Vous n&apos;avez pas encore de workflow actif
              </p>
              <Link
                href="/catalog"
                className="inline-block px-6 py-2.5 bg-gold text-background font-semibold rounded-lg hover:bg-gold-light transition-colors"
              >
                Decouvrir le catalogue
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeWorkflows.map((w) => (
                <Link
                  key={w.id}
                  href={`/catalog/${w.slug}`}
                  className="bg-surface border border-border rounded-xl p-5 hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{w.icon}</span>
                    <div>
                      <h3 className="font-medium">{w.name}</h3>
                      <span
                        className={`text-xs ${
                          w.isActive ? "text-success" : "text-muted"
                        }`}
                      >
                        {w.isActive ? "Actif" : "Inactif"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>{w.creditsPerRun} credits/exec</span>
                    {w.nextRunAt && (
                      <span>
                        Prochain:{" "}
                        {new Date(w.nextRunAt).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recent Executions */}
        <section>
          <h2 className="font-serif text-2xl mb-6">Dernieres executions</h2>
          {executions.length === 0 ? (
            <p className="text-muted bg-surface border border-border rounded-xl p-8 text-center">
              Aucune execution pour le moment
            </p>
          ) : (
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted">
                      <th className="text-left p-4 font-medium">Workflow</th>
                      <th className="text-left p-4 font-medium">Statut</th>
                      <th className="text-left p-4 font-medium">Credits</th>
                      <th className="text-left p-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executions.map((ex) => (
                      <tr
                        key={ex.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span>{ex.workflowIcon}</span>
                            <span>{ex.workflowName}</span>
                          </div>
                        </td>
                        <td className={`p-4 ${statusColors[ex.status]}`}>
                          {statusLabels[ex.status] || ex.status}
                        </td>
                        <td className="p-4 text-gold">{ex.creditsUsed}</td>
                        <td className="p-4 text-muted">
                          {new Date(ex.startedAt).toLocaleString("fr-FR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </Providers>
  );
}
