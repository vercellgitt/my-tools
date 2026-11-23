export const afterTaxPaymentCalculator = {
  slug: "after-tax-payment-calculator",
  title: "After Tax Payment Calculator",
  description: "Calculate an estimated payment after applying a tax percentage and optional deductions. This flexible calculator is not tied to one country’s tax",
  keywords: ["After Tax Payment Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/after-tax-payment-calculator",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/after-tax-payment-calculator/after-tax-payment-calculator"),
};
