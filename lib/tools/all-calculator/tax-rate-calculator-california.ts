export const californiaTaxRateCalculator = {
  slug: "tax-rate-calculator-california",
  title: "California Tax Rate Calculator",
  description: "Estimate California state income tax for tax year 2025 using the official California tax rate schedules. The 2026 full schedules were not yet pub",
  keywords: ["California Tax Rate Calculator", "income tax", "tax brackets", "tax rate"],
  canonical: "https://liebess.com/tax-rate-calculator-california",
  robots: { index: true, follow: true },
  load: () => import("@/components/tools/all-calculator/tax-rate-calculator-california/tax-rate-calculator-california"),
};
