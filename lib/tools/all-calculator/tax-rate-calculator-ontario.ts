export const ontarioTaxRateCalculator = {
  slug: "tax-rate-calculator-ontario",
  title: "Ontario Tax Rate Calculator",
  description: "Calculate an estimate of Ontario provincial income tax for 2026 using the published provincial brackets. Ontario tax is generally paid in additio",
  keywords: ["Ontario Tax Rate Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/tax-rate-calculator-ontario",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/tax-rate-calculator-ontario/tax-rate-calculator-ontario"),
};
