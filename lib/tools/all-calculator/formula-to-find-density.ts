import { densityToolsConfig } from "@/components/tools/all-calculator/formula-to-find-density/faq";

const loadDensityTool = () =>
  import(
    "@/components/tools/all-calculator/formula-to-find-density/formula-to-find-density"
  );

const createDensityTool = (
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
  load: loadDensityTool,
});

export const densityCalculatorTools = {
  "calculating-density-formula": createDensityTool(
    "calculating-density-formula",
    densityToolsConfig["calculating-density-formula"].metaTitle,
    densityToolsConfig["calculating-density-formula"].metaDescription,
    densityToolsConfig["calculating-density-formula"].keywords
  ),

  "formula-to-find-density": createDensityTool(
    "formula-to-find-density",
    densityToolsConfig["formula-to-find-density"].metaTitle,
    densityToolsConfig["formula-to-find-density"].metaDescription,
    densityToolsConfig["formula-to-find-density"].keywords
  ),

  "volume-density-mass-calculator": createDensityTool(
    "volume-density-mass-calculator",
    densityToolsConfig["volume-density-mass-calculator"].metaTitle,
    densityToolsConfig["volume-density-mass-calculator"].metaDescription,
    densityToolsConfig["volume-density-mass-calculator"].keywords
  ),
};

export type DensityCalculatorSlug = keyof typeof densityCalculatorTools;