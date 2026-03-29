import { PortfolioTemplate } from "./minimal";
import { TerminalTemplate } from "./terminal";
import { LuminalTemplate } from "./luminal";
import type { Portfolio } from "@/db/schema";

// Shared props interface for all portfolio templates
export interface PortfolioTemplateProps {
  portfolio: Partial<Portfolio>;
  isPreview?: boolean;
  isLoggedIn?: boolean;
}

// Template configuration interface
export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  thumbnailColor: string;
}

// Registry of all available templates
export const PORTFOLIO_TEMPLATES: TemplateConfig[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "A clean, typography-focused template perfect for developers.",
    component: PortfolioTemplate,
    thumbnailColor: "#111111",
  },
  {
    id: "terminal",
    name: "Terminal",
    description: "A command-line inspired theme for the hardcore hackers.",
    component: TerminalTemplate,
    thumbnailColor: "#111111",
  },
  {
    id: "luminal",
    name: "Luminal",
    description: "A sleek, responsive dual-mode template.",
    component: LuminalTemplate,
    thumbnailColor: "#111111",
  },
];

export const getTemplate = (id: string | null | undefined) => {
  if (!id) return PORTFOLIO_TEMPLATES[0];
  return PORTFOLIO_TEMPLATES.find((t) => t.id === id) || PORTFOLIO_TEMPLATES[0];
};
