export const federalTaxRateCalculator = {
  slug: "tax-rate-calculator-federal",
  title: "Federal Tax Rate Calculator",
  description: "Estimate 2026 Canadian federal income tax using the CRA’s published federal tax brackets. This calculator focuses on federal bracket tax only; pr",
  keywords: ["Federal Tax Rate Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/tax-rate-calculator-federal",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/tax-rate-calculator-federal/tax-rate-calculator-federal"),
};
