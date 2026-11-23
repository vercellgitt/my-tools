export const australiaTaxRateCalculator = {
  slug: "tax-rate-calculator-australia",
  title: "Australia Tax Rate Calculator",
  description: "Estimate Australian resident individual income tax for the 2026–27 financial year using ATO marginal tax rates. The estimate excludes the Medicar",
  keywords: ["Australia Tax Rate Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/tax-rate-calculator-australia",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/tax-rate-calculator-australia/tax-rate-calculator-australia"),
};
