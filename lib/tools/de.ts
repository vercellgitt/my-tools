import type { ToolDefinition } from "./types";

import { deAgeCalculator } from "./localized-tools/de/age-calculator";

export const germanToolsRegistry = {

  [deAgeCalculator.slug]: deAgeCalculator,
  
} satisfies Record<string, ToolDefinition>;

export const germanTools = Object.values(germanToolsRegistry);

export function getGermanTool(slug: string) {
  return germanToolsRegistry[
    slug as keyof typeof germanToolsRegistry
  ];
}