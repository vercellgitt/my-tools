import type { ToolDefinition } from "./types";

import { arabicAgeCalculator } from "./localized-tools/ar/age-calculator";

export const arabicToolsRegistry = {

  "age-calculator": arabicAgeCalculator,
  
} satisfies Record<string, ToolDefinition>;

export const arabicTools = Object.values(arabicToolsRegistry);

export function getArabicTool(slug: string) {
  return arabicToolsRegistry[
    slug as keyof typeof arabicToolsRegistry
  ];
}