import type { ComponentType } from "react";

export interface ToolConfig {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  load: () => Promise<{ default: ComponentType }>;
}

const ageCalculator: ToolConfig = {
  slug: "age-calculator",

  title: "Age Calculator - Calculate Your Exact Age",

  description:
    "Calculate your exact age in years, months, and days using our free online age calculator.",

  keywords: [
    "age calculator",
    "calculate age",
    "date of birth calculator",
  ],

  load: () =>
    import("@/components/tools/age-calculator/age-calculator"),
};

export default ageCalculator;