
import type { ToolDefinition } from "./types";
import { frAgeCalculator } from "./localized-tools/fr/age-calculator";

export const frenchToolsRegistry = {
  [frAgeCalculator.slug]: frAgeCalculator,
} satisfies Record<string, ToolDefinition>;

export const frenchTools = Object.values(frenchToolsRegistry);

export function getFrenchTool(slug: string) {
  return frenchToolsRegistry[
    slug as keyof typeof frenchToolsRegistry
  ];
}
