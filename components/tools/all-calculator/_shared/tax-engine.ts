export type TaxBand = { upTo: number | null; rate: number };
export function calculateProgressiveTax(income: number, bands: TaxBand[]) {
  const amount = Math.max(0, Number.isFinite(income) ? income : 0);
  let previous = 0, tax = 0, marginalRate = 0;
  for (const band of bands) {
    const upper = band.upTo === null ? amount : Math.min(amount, band.upTo);
    tax += Math.max(0, upper - previous) * band.rate;
    if (amount > previous) marginalRate = band.rate;
    if (band.upTo === null || amount <= band.upTo) break;
    previous = band.upTo;
  }
  return { income: amount, tax, net: Math.max(0, amount - tax), marginalRate, effectiveRate: amount > 0 ? tax / amount : 0 };
}
export function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
}
