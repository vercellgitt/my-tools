export const canadaTaxRateCalculator = {
  slug: "canada-tax-rate-calculator",
  title: "Canada Tax Rate Calculator",
  description: "Estimate 2026 Canadian federal income tax and, if selected, Ontario provincial income tax. Provincial tax rates vary across Canada; this calculat",
  keywords: ["Canada Tax Rate Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/canada-tax-rate-calculator",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/canada-tax-rate-calculator/canada-tax-rate-calculator"),
};
