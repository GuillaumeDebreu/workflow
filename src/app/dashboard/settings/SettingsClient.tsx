"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

interface SettingsProps {
  user: {
    email: string;
    plan: string;
    stripeSubId: string | null;
  };
  apiKeys: { id: string; service: string; keyPreview: string }[];
}

const services = [
  { value: "anthropic", label: "Anthropic (Claude)" },
  { value: "openai", label: "OpenAI" },
];

export default function SettingsClient({ user, apiKeys }: SettingsProps) {
  const [keys, setKeys] = useState(apiKeys);
  const [newService, setNewService] = useState("");
  const [newKey, setNewKey] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveApiKey() {
    if (!newService || !newKey) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service: newService, key: newKey }),
      });
      const data = await res.json();
      if (res.ok) {
        setKeys((prev) => [
          ...prev.filter((k) => k.service !== newService),
          { id: data.id, service: newService, keyPreview: newKey.slice(0, 8) + "..." + newKey.slice(-4) },
        ]);
        setNewService("");
        setNewKey("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteApiKey(id: string) {
    await fetch(`/api/settings/api-keys?id=${id}`, { method: "DELETE" });
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <Providers>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl sm:text-4xl mb-10">Parametres</h1>

        {/* Account */}
        <section className="bg-surface border border-border rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Compte</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted">Plan</span>
              <span className="text-gold font-medium uppercase">
                {user.plan}
              </span>
            </div>
          </div>
        </section>

        {/* Subscription */}
        <section className="bg-surface border border-border rounded-xl p-6 mb-8">
          <h2 className="font-semibold text-lg mb-4">Abonnement</h2>
          {user.plan === "PRO" && user.stripeSubId ? (
            <a
              href="/api/stripe/portal"
              className="inline-block px-4 py-2 bg-surface-light border border-border rounded-lg text-sm hover:border-gold transition-colors"
            >
              Gerer mon abonnement (Stripe)
            </a>
          ) : (
            <div>
              <p className="text-muted mb-4">
                Passez Pro pour 500 credits/mois et des workflows illimites.
              </p>
              <a
                href="/api/stripe/checkout"
                className="inline-block px-6 py-2.5 bg-gold text-background font-semibold rounded-lg hover:bg-gold-light transition-colors"
              >
                Passer Pro - 49&#8364;/mois
              </a>
            </div>
          )}
        </section>

        {/* API Keys */}
        <section className="bg-surface border border-border rounded-xl p-6">
          <h2 className="font-semibold text-lg mb-4">Cles API</h2>
          <p className="text-muted text-sm mb-4">
            Ajoutez vos cles API pour que les workflows puissent fonctionner.
          </p>

          {keys.length > 0 && (
            <div className="space-y-2 mb-6">
              {keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3"
                >
                  <div>
                    <span className="font-medium text-sm capitalize">
                      {k.service}
                    </span>
                    <span className="text-muted text-sm ml-3">
                      {k.keyPreview}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteApiKey(k.id)}
                    className="text-sm text-muted hover:text-error transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-gold"
            >
              <option value="">Service...</option>
              {services.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-gold"
            />
            <button
              onClick={saveApiKey}
              disabled={saving || !newService || !newKey}
              className="px-4 py-2 bg-gold text-background font-semibold rounded-lg text-sm hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {saving ? "..." : "Ajouter"}
            </button>
          </div>
        </section>
      </main>
    </Providers>
  );
}
