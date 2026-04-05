"use client";

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import ActivationPanel from "@/components/ActivationPanel";

interface ConfigField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "boolean" | "tags";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface WorkflowData {
  slug: string;
  name: string;
  description: string;
  longDescription: string | null;
  category: string;
  creditsPerRun: number;
  frequency: string;
  icon: string;
  features: string[];
  integrations: string[];
  configSchema: Record<string, unknown>;
}

const categoryLabels: Record<string, string> = {
  contenu: "Contenu",
  prospection: "Prospection",
  veille: "Veille",
  finance: "Finance",
  productivite: "Productivite",
  ecommerce: "E-commerce",
};

const frequencyLabels: Record<string, string> = {
  on_demand: "A la demande",
  daily: "Quotidien",
  weekly: "Hebdomadaire",
  monthly: "Mensuel",
};

export default function WorkflowDetailClient({
  workflow,
  isAuthenticated,
  existingConfig,
  isActive,
}: {
  workflow: WorkflowData;
  isAuthenticated: boolean;
  existingConfig?: Record<string, unknown>;
  isActive: boolean;
}) {
  const configFields = (
    (workflow.configSchema as unknown as { fields?: ConfigField[] })?.fields ||
    []
  ) as ConfigField[];

  return (
    <Providers>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Details */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{workflow.icon}</span>
                <div>
                  <span className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full">
                    {categoryLabels[workflow.category] || workflow.category}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl mt-2">
                    {workflow.name}
                  </h1>
                </div>
              </div>
              <p className="text-muted text-lg">{workflow.description}</p>
            </div>

            {workflow.longDescription && (
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="font-semibold text-lg mb-3">Comment ca marche</h2>
                <p className="text-muted leading-relaxed">
                  {workflow.longDescription}
                </p>
              </div>
            )}

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Fonctionnalites</h2>
              <ul className="space-y-3">
                {workflow.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-gold mt-0.5">&#10003;</span>
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="font-semibold text-lg mb-4">Informations</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted mb-1">Frequence</p>
                  <p className="font-medium">
                    {frequencyLabels[workflow.frequency] || workflow.frequency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Credits</p>
                  <p className="font-medium text-gold">
                    {workflow.creditsPerRun} / execution
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted mb-1">Integrations</p>
                  <div className="flex flex-wrap gap-1">
                    {workflow.integrations.map((int) => (
                      <span
                        key={int}
                        className="text-xs px-2 py-0.5 bg-surface-light border border-border rounded"
                      >
                        {int}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Activation */}
          <div>
            <ActivationPanel
              workflowSlug={workflow.slug}
              configFields={configFields}
              creditsPerRun={workflow.creditsPerRun}
              frequency={workflow.frequency}
              isAuthenticated={isAuthenticated}
              existingConfig={existingConfig}
              isActive={isActive}
            />
          </div>
        </div>
      </main>
    </Providers>
  );
}
