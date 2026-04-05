"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ConfigField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "boolean" | "tags";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface ActivationPanelProps {
  workflowSlug: string;
  configFields: ConfigField[];
  creditsPerRun: number;
  frequency: string;
  isAuthenticated: boolean;
  existingConfig?: Record<string, unknown>;
  isActive?: boolean;
}

export default function ActivationPanel({
  workflowSlug,
  configFields,
  creditsPerRun,
  frequency,
  isAuthenticated,
  existingConfig,
  isActive: initialActive = false,
}: ActivationPanelProps) {
  const router = useRouter();
  const [config, setConfig] = useState<Record<string, unknown>>(
    existingConfig || {}
  );
  const [isActive, setIsActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tagInput, setTagInput] = useState<Record<string, string>>({});

  function updateConfig(name: string, value: unknown) {
    setConfig((prev) => ({ ...prev, [name]: value }));
  }

  function addTag(name: string) {
    const val = tagInput[name]?.trim();
    if (!val) return;
    const current = (config[name] as string[]) || [];
    if (!current.includes(val)) {
      updateConfig(name, [...current, val]);
    }
    setTagInput((prev) => ({ ...prev, [name]: "" }));
  }

  function removeTag(name: string, tag: string) {
    const current = (config[name] as string[]) || [];
    updateConfig(
      name,
      current.filter((t) => t !== tag)
    );
  }

  async function handleActivate() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workflows/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowSlug, config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'activation");
      setIsActive(true);
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate() {
    setLoading(true);
    try {
      const res = await fetch("/api/workflows/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowSlug }),
      });
      if (!res.ok) throw new Error("Erreur");
      setIsActive(false);
      router.refresh();
    } catch {
      setError("Erreur lors de la desactivation");
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/workflows/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Activation</h3>
        {isActive && (
          <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
            Actif
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm mb-6 pb-4 border-b border-border">
        <span className="text-muted">Cout par execution</span>
        <span className="text-gold font-semibold">{creditsPerRun} credits</span>
      </div>

      <div className="space-y-4 mb-6">
        {configFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1.5">
              {field.label}
              {field.required !== false && (
                <span className="text-gold ml-1">*</span>
              )}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                value={(config[field.name] as string) || ""}
                onChange={(e) => updateConfig(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              />
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={(config[field.name] as number) || ""}
                onChange={(e) =>
                  updateConfig(field.name, parseFloat(e.target.value))
                }
                placeholder={field.placeholder}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              />
            )}

            {field.type === "textarea" && (
              <textarea
                value={(config[field.name] as string) || ""}
                onChange={(e) => updateConfig(field.name, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors resize-none"
              />
            )}

            {field.type === "select" && (
              <select
                value={(config[field.name] as string) || ""}
                onChange={(e) => updateConfig(field.name, e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
              >
                <option value="">Selectionner...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === "boolean" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(config[field.name] as boolean) || false}
                  onChange={(e) => updateConfig(field.name, e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
                <span className="text-sm text-muted">{field.placeholder}</span>
              </label>
            )}

            {field.type === "tags" && (
              <div>
                <div className="flex gap-2 mb-2 flex-wrap">
                  {((config[field.name] as string[]) || []).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gold/10 text-gold rounded-full flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(field.name, tag)}
                        className="hover:text-error"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput[field.name] || ""}
                    onChange={(e) =>
                      setTagInput((prev) => ({
                        ...prev,
                        [field.name]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag(field.name);
                      }
                    }}
                    placeholder={field.placeholder}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(field.name)}
                    className="px-3 py-2 bg-surface-light border border-border rounded-lg text-sm hover:border-gold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-error text-sm mb-4">{error}</p>
      )}

      <div className="space-y-2">
        {!isActive ? (
          <button
            onClick={handleActivate}
            disabled={loading}
            className="w-full py-3 bg-gold text-background font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "Activation..." : "Configurer et activer"}
          </button>
        ) : (
          <>
            {frequency === "on_demand" && (
              <button
                onClick={handleExecute}
                disabled={loading}
                className="w-full py-3 bg-gold text-background font-semibold rounded-lg hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {loading ? "Execution..." : "Executer maintenant"}
              </button>
            )}
            <button
              onClick={handleDeactivate}
              disabled={loading}
              className="w-full py-2.5 bg-surface-light border border-border text-muted rounded-lg hover:text-error hover:border-error/30 transition-colors disabled:opacity-50 text-sm"
            >
              Desactiver
            </button>
          </>
        )}
      </div>
    </div>
  );
}
