const loadCalculator = () =>    
  import("@/components/tools/all-calculator/all-country-tax-rat-calculator/all-country-tax-calculator");    
const createTool = (    
  slug: string,    
  title: string,    
  description: string,    
  keywords: string[],    
  country: string,    
  taxSystem: string    
) => ({    
  slug,    
  title,    
  description,    
  keywords,    
  country,    
  taxSystem,    
  receiveSlug: true,    
  load: loadCalculator,    
});    
export const allCountryTaxCalculators = {    
  "after-tax-payment-calculator": createTool(    
    "after-tax-payment-calculator",    
    "After Tax Payment Calculator - Calculate Your Take Home Pay",    
    "Calculate your after-tax payment, income tax, effective tax rate and estimated net take-home pay with our free tax calculator.",    
    ["after tax payment calculator", "take home pay calculator", "net income calculator"],    
    "International",    
    "us_single"    
  ),    
  "tax-rate-calculator-ontario": createTool(    
    "tax-rate-calculator-ontario",    
    "Ontario Tax Rate Calculator 2026 - Income Tax Estimator",    
    "Calculate Ontario provincial and federal income tax, estimated tax rates and take-home pay using our 2026 Ontario tax calculator.",    
    ["tax rate calculator ontario", "ontario income tax calculator", "ontario tax estimator"],    
    "Ontario, Canada",    
    "canada_ontario"    
  ),    
  "uk-tax-rate-calculator": createTool(    
    "uk-tax-rate-calculator",    
    "UK Tax Rate Calculator 2026/27 - Income Tax Calculator",    
    "Calculate UK income tax, personal allowance, effective tax rate and estimated take-home pay for the 2026/27 tax year.",    
    ["uk tax rate calculator", "uk income tax calculator", "british tax calculator"],    
    "United Kingdom",    
    "uk"    
  ),    
  "tax-rate-calculator-australia": createTool(    
    "tax-rate-calculator-australia",    
    "Australia Tax Rate Calculator 2026-27 - Income Tax",    
    "Estimate Australian income tax, Medicare levy, effective tax rate and annual take-home pay for the 2026-27 financial year.",    
    ["tax rate calculator australia", "australia income tax calculator", "australian tax estimator"],    
    "Australia",    
    "australia"    
  ),    
  "us-tax-rate-calculator": createTool(    
    "us-tax-rate-calculator",    
    "US Tax Rate Calculator 2026 - Federal Income Tax",    
    "Calculate your estimated US federal income tax, taxable income, effective tax rate and annual take-home pay for 2026.",    
    ["us tax rate calculator", "usa income tax calculator", "federal tax estimator"],    
    "United States",    
    "us_single"    
  ),    
  "tax-rate-calculator-california": createTool(    
    "tax-rate-calculator-california",    
    "California Tax Rate Calculator 2026 - Income Tax Estimator",    
    "Estimate California state income tax, federal tax considerations, effective tax rate and take-home pay for 2026.",    
    ["tax rate calculator california", "california income tax calculator", "california tax estimator"],    
    "California, USA",    
    "us_california"    
  ),    
  "canada-tax-rate-calculator": createTool(    
    "canada-tax-rate-calculator",    
    "Canada Tax Rate Calculator 2026 - Federal Income Tax",    
    "Calculate estimated Canadian federal income tax, taxable income, effective tax rate and annual take-home pay for 2026.",    
    ["canada tax rate calculator", "canada income tax calculator", "canadian tax estimator"],    
    "Canada",    
    "canada_fed"    
  ),    
  "tax-rate-calculator-federal": createTool(    
    "tax-rate-calculator-federal",    
    "Federal Tax Rate Calculator 2026 - Estimate Income Tax",    
    "Estimate federal income tax, taxable income, effective tax rate and net income using the 2026 federal tax brackets.",    
    ["tax rate calculator federal", "federal income tax calculator", "federal tax rates"],    
    "United States",    
    "us_single"    
  ),    
};    
export type TaxCalculatorSlug = keyof typeof allCountryTaxCalculators;  