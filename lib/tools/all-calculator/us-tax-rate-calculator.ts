export const usTaxRateCalculator = {
  slug: "us-tax-rate-calculator",
  title: "US Tax Rate Calculator",
  description: "Estimate 2026 US federal individual income tax using the IRS marginal tax brackets and standard deduction. Choose a filing status and enter annua",
  keywords: ["US Tax Rate Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/us-tax-rate-calculator",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/us-tax-rate-calculator/us-tax-rate-calculator"),
};
