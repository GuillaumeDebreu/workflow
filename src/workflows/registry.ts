import { meta as contentRepurposer } from "./content-repurposer/meta";
import { meta as coldEmail } from "./cold-email/meta";
import { meta as veilleSectorielle } from "./veille-sectorielle/meta";
import { meta as analyseurAvis } from "./analyseur-avis/meta";
import { meta as meetingTasks } from "./meeting-tasks/meta";
import { meta as resumeFinancier } from "./resume-financier/meta";
import { meta as linkedinPostGenerator } from "./linkedin-post-generator/meta";
import { meta as competitorPriceMonitor } from "./competitor-price-monitor/meta";
import { meta as inboxSummarizer } from "./inbox-summarizer/meta";
import { meta as seoBlogWriter } from "./seo-blog-writer/meta";

import { configFields as contentRepurposerConfig } from "./content-repurposer/config";
import { configFields as coldEmailConfig } from "./cold-email/config";
import { configFields as veilleSectorielleConfig } from "./veille-sectorielle/config";
import { configFields as analyseurAvisConfig } from "./analyseur-avis/config";
import { configFields as meetingTasksConfig } from "./meeting-tasks/config";
import { configFields as resumeFinancierConfig } from "./resume-financier/config";
import { configFields as linkedinPostGeneratorConfig } from "./linkedin-post-generator/config";
import { configFields as competitorPriceMonitorConfig } from "./competitor-price-monitor/config";
import { configFields as inboxSummarizerConfig } from "./inbox-summarizer/config";
import { configFields as seoBlogWriterConfig } from "./seo-blog-writer/config";

export interface WorkflowMeta {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  creditsPerRun: number;
  frequency: string;
  icon: string;
  features: string[];
  integrations: string[];
}

export interface ConfigField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "boolean" | "tags";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface WorkflowRegistryEntry {
  meta: WorkflowMeta;
  configFields: ConfigField[];
}

const registry: WorkflowRegistryEntry[] = [
  { meta: contentRepurposer, configFields: contentRepurposerConfig },
  { meta: coldEmail, configFields: coldEmailConfig },
  { meta: veilleSectorielle, configFields: veilleSectorielleConfig },
  { meta: analyseurAvis, configFields: analyseurAvisConfig },
  { meta: meetingTasks, configFields: meetingTasksConfig },
  { meta: resumeFinancier, configFields: resumeFinancierConfig },
  { meta: linkedinPostGenerator, configFields: linkedinPostGeneratorConfig },
  { meta: competitorPriceMonitor, configFields: competitorPriceMonitorConfig },
  { meta: inboxSummarizer, configFields: inboxSummarizerConfig },
  { meta: seoBlogWriter, configFields: seoBlogWriterConfig },
];

export default registry;
