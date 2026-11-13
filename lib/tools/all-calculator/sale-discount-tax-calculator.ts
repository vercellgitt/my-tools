export const saleDiscountTaxCalculator = {
  slug: "sale-discount-value-calculator-with-tax-percentage",
  title: "Sale Discount Value Calculator With Tax Percentage Online",
  description:
    "Use our free Sale Discount Value Calculator With Tax Percentage to find final prices, total savings, multiple discounts, and exact sales tax amounts instantly.",
  load: () =>
    import(
      "@/components/tools/all-calculator/sale-discount-tax-calculator/sale-discount-tax-calculator"
    ),
};