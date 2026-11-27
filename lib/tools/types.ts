
import type { ComponentType } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOConfig {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  h1Title?: string;
  introText?: string;
  faqs?: FAQItem[];
  article?: {
    title: string;
    sections?: {
      heading: string;
      level: "h2" | "h3" | "h4";
      content: string;
    }[];
  };
  hreflang?: Record<string, string>;
}

export interface ToolDefinition {
  title: string;
  description: string;
  slug?: string;
  keywords?: string[];
  receiveSlug?: boolean;
  isFree?: boolean;
  seoConfig?: SEOConfig;
  load: () => Promise<{
    default: ComponentType<{ slug?: string }>;
  }>;
}
