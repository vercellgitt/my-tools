import { percentFormulaConfig } from "@/components/tools/all-calculator/percent-of-difference-formula/faq";

const loadPercentTool = () =>
  import("@/components/tools/all-calculator/percent-of-difference-formula/percent-of-difference-formula");

const createPercentTool = (
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
  load: loadPercentTool,
});

export const percentFormulaTools = {
  "percent-to-change-formula": createPercentTool(
    "percent-to-change-formula",
    percentFormulaConfig["percent-to-change-formula"].metaTitle,
    percentFormulaConfig["percent-to-change-formula"].metaDescription,
    percentFormulaConfig["percent-to-change-formula"].keywords
  ),

  "percent-of-difference-formula": createPercentTool(
    "percent-of-difference-formula",
    percentFormulaConfig["percent-of-difference-formula"].metaTitle,
    percentFormulaConfig["percent-of-difference-formula"].metaDescription,
    percentFormulaConfig["percent-of-difference-formula"].keywords
  ),

  "how-to-calculate-percentage-of-difference": createPercentTool(
    "how-to-calculate-percentage-of-difference",
    percentFormulaConfig["how-to-calculate-percentage-of-difference"].metaTitle,
    percentFormulaConfig["how-to-calculate-percentage-of-difference"].metaDescription,
    percentFormulaConfig["how-to-calculate-percentage-of-difference"].keywords
  ),
};

export type PercentFormulaSlug = keyof typeof percentFormulaTools;