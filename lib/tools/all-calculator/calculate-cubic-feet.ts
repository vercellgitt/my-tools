import { cubicToolsConfig } from "@/components/tools/all-calculator/calculate-cubic-feet/faq";

const loadCubicTool = () =>
  import("@/components/tools/all-calculator/calculate-cubic-feet/calculate-cubic-feet");

const createCubicTool = (
  slug: string,
  title: string,
  description: string,
  keywords: string[]
) => ({
  slug,
  title,
  description,
  keywords,
  receiveSlug: true,
  load: loadCubicTool,
});

export const cubicFeetTools = {
  "calculate-cubic-feet": createCubicTool(
    "calculate-cubic-feet",
    cubicToolsConfig["calculate-cubic-feet"].metaTitle,
    cubicToolsConfig["calculate-cubic-feet"].metaDescription,
    cubicToolsConfig["calculate-cubic-feet"].keywords
  ),
  "cubic-feet-to-cubic-yard": createCubicTool(
    "cubic-feet-to-cubic-yard",
    cubicToolsConfig["cubic-feet-to-cubic-yard"].metaTitle,
    cubicToolsConfig["cubic-feet-to-cubic-yard"].metaDescription,
    cubicToolsConfig["cubic-feet-to-cubic-yard"].keywords
  ),
  "cubic-calculator": createCubicTool(
    "cubic-calculator",
    cubicToolsConfig["cubic-calculator"].metaTitle,
    cubicToolsConfig["cubic-calculator"].metaDescription,
    cubicToolsConfig["cubic-calculator"].keywords
  ),
  "cubic-feet-per-minute-calculator": createCubicTool(
    "cubic-feet-per-minute-calculator",
    cubicToolsConfig["cubic-feet-per-minute-calculator"].metaTitle,
    cubicToolsConfig["cubic-feet-per-minute-calculator"].metaDescription,
    cubicToolsConfig["cubic-feet-per-minute-calculator"].keywords
  ),
};

export type CubicFeetSlug = keyof typeof cubicFeetTools;