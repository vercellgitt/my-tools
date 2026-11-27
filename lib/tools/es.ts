
import type { ToolDefinition } from "./types";
import { esAgeCalculator } from "./localized-tools/es/age-calculator";

export const spanishToolsRegistry = {
  [esAgeCalculator.slug]: esAgeCalculator,
} satisfies Record<string, ToolDefinition>;

export const spanishTools = Object.values(spanishToolsRegistry);

export function getSpanishTool(slug: string) {
  return spanishToolsRegistry[
    slug as keyof typeof spanishToolsRegistry
  ];
}
