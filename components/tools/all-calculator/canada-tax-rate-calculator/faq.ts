export interface FaqItem { question: string; answer: string; }
export const canadataxratecalculatorFaqs: FaqItem[] = [
  {
    "question": "What tax year does this Canada calculator use?",
    "answer": "This calculator uses the 2026 Canadian federal income tax brackets published by the Canada Revenue Agency. The tax year is the calendar year 2026, and the corresponding individual income tax return is generally filed in 2027. Federal brackets are indexed and may change each year. Provincial and territorial rates are separate and depend on your province or territory of residence on December 31. Check the displayed year and the official CRA page before using the estimate for planning or filing."
  },
  {
    "question": "Does Canada have federal and provincial income tax?",
    "answer": "Yes. Individuals generally pay federal income tax and provincial or territorial income tax. The federal government sets federal brackets, while each province or territory sets its own rates and thresholds. Both systems use progressive tax brackets, so each rate applies only to the portion of taxable income within that band. This calculator shows the federal calculation and provides an Ontario provincial estimate. If you live in another province or territory, the provincial part is not included and the total shown will be incomplete."
  },
  {
    "question": "Why is Ontario the only province selectable here?",
    "answer": "The Ontario option is included because it has its own published 2026 provincial brackets and is also covered by a separate Ontario Tax Rate Calculator. Other provinces and territories have different tax brackets, surtaxes, credits and rules. To avoid showing invented or incomplete provincial figures, this version does not pretend to calculate every province. If you are not an Ontario resident, use the federal-only figure as a partial estimate and consult the CRA’s current-year rates page or your province’s tax authority for the provincial portion."
  },
  {
    "question": "How do Canadian marginal tax brackets work?",
    "answer": "Canada uses progressive marginal tax rates. Each slice of taxable income is taxed at the rate for its bracket, rather than applying your highest rate to all income. For example, income that crosses into a higher federal bracket does not cause the lower portion to be taxed at that higher rate. The calculator computes each band separately and then adds the results. It reports a marginal rate, which applies to the next dollar, and an effective rate, which compares estimated tax with the income entered."
  },
  {
    "question": "Does this include tax credits and deductions?",
    "answer": "No. This simplified estimate applies the published bracket rates to the taxable income entered. It does not calculate the basic personal amount, non-refundable tax credits, RRSP deductions, childcare expenses, tuition credits, medical expenses, capital gains inclusion rules or other adjustments. These items can reduce or otherwise change your actual tax. The calculator is useful for understanding bracket-based tax, not for preparing a tax return. For a more accurate result, use CRA-certified tax software or consult a qualified Canadian tax professional."
  },
  {
    "question": "Which province should I use?",
    "answer": "Your provincial or territorial tax is generally based on where you were resident on December 31 of the tax year, subject to special rules for certain situations. It is not necessarily the province where your employer is located or where you worked most of the year. If you moved during the year, had business income in multiple provinces or have a special residency situation, consult CRA guidance. This tool currently models Ontario provincial brackets only; selecting Ontario when you do not qualify as an Ontario resident would produce an inaccurate provincial estimate."
  },
  {
    "question": "What is the difference between marginal and average tax rates?",
    "answer": "The marginal rate is the rate applied to the next dollar of taxable income. The effective or average rate is the total estimated tax divided by the income entered. In a progressive system, the effective rate is usually lower than the marginal rate because lower portions of income are taxed at lower rates. The calculator displays both measures to help explain how a bracket works. Neither number necessarily represents the exact amount deducted from a paycheque, because payroll deductions and credits are not fully modelled."
  },
  {
    "question": "Can I use this calculator for self-employment income?",
    "answer": "You can use the bracket estimate as a rough starting point if you enter taxable business income rather than gross business revenue. Self-employed people may have business expenses, CPP contributions, instalment requirements, GST/HST obligations and deductions that are not included here. The calculator also does not handle capital gains, dividends or special income types. For a complete estimate, determine your net taxable income and use CRA guidance or professional tax software. Do not treat this simplified output as the amount to remit."
  }
];
