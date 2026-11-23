export const ukTaxRateCalculator = {
  slug: "uk-tax-rate-calculator",
  title: "UK Tax Rate Calculator",
  description: "Estimate your UK income tax for the 2026–27 tax year. The standard Personal Allowance is £12,570 and is reduced by £1 for every £2 of adjusted ne",
  keywords: ["UK Tax Rate Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/uk-tax-rate-calculator",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/uk-tax-rate-calculator/uk-tax-rate-calculator"),
};
