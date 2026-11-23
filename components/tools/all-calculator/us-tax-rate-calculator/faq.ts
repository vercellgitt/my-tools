export interface FaqItem { question: string; answer: string; }
export const ustaxratecalculatorFaqs: FaqItem[] = [
  {
    "question": "What tax year does this US calculator use?",
    "answer": "This calculator uses the 2026 US federal individual income tax brackets and standard deduction amounts published by the Internal Revenue Service. Tax year 2026 income is generally reported on a return filed in 2027. Federal thresholds can change annually because of inflation adjustments or new legislation, so check the tax year displayed before using the estimate. This tool is for a simplified federal income-tax estimate; it does not calculate state or local income tax, Social Security, Medicare, credits, alternative minimum tax or every special deduction."
  },
  {
    "question": "What filing status should I choose?",
    "answer": "Choose the filing status that applies under IRS rules: Single, Married filing jointly, Married filing separately or Head of household. The status affects both the tax brackets and standard deduction. Head of household has eligibility requirements, including qualifying-person and household-cost tests, so it should not be selected simply because you pay most of your bills. Married taxpayers may have a choice between joint and separate filing, but the better option depends on their full circumstances. If you are unsure, review IRS Publication 501 or consult a tax professional before relying on the result."
  },
  {
    "question": "Does the calculator use the standard deduction?",
    "answer": "Yes. The estimate subtracts the 2026 standard deduction for the selected filing status from the annual income entered, with taxable income not allowed to fall below zero. For 2026, the standard deduction amounts used are $16,100 for Single and Married filing separately, $32,200 for Married filing jointly and $24,150 for Head of household. This simplified approach assumes you take the standard deduction. If you itemize deductions, qualify for additional deductions or have special adjustments, your taxable income and final liability may differ."
  },
  {
    "question": "Are all my earnings taxed at my highest bracket?",
    "answer": "No. US federal income tax uses progressive marginal brackets. Each portion of taxable income is taxed at the rate for its bracket. Reaching the 22% bracket does not mean every dollar is taxed at 22%; the lower portions remain taxed at 10% and 12%. The calculator adds the tax from each slice and reports the marginal rate and effective rate. The marginal rate applies to the next dollar of taxable income, while the effective rate is the estimated total federal income tax divided by the gross income entered."
  },
  {
    "question": "Does this include state income tax?",
    "answer": "No. The result is federal income tax only. Many states and some cities impose additional income taxes, and their rates, deductions and rules differ. State tax is not simply a fixed percentage of federal tax. If you live or work in a state with income tax, calculate that liability separately and consider local rules. This is particularly important for people who work remotely across state lines, move during the year or have income in multiple states. The estimate also excludes Social Security and Medicare payroll taxes."
  },
  {
    "question": "Are tax credits included?",
    "answer": "No. This estimate does not calculate child tax credit, earned income credit, education credits, foreign tax credit, saver’s credit or other non-refundable and refundable credits. Credits can reduce tax after deductions and may materially change the final amount owed or refunded. Eligibility often depends on income, dependants, filing status, expenses and other detailed tests. The tool is therefore best used to understand the basic bracket calculation before credits. For an actual return, use IRS-approved filing software or a qualified tax preparer."
  },
  {
    "question": "What is the difference between gross and taxable income?",
    "answer": "Gross income is the total income before certain adjustments and deductions. Taxable income is the amount remaining after applicable adjustments, deductions and exclusions. This calculator asks for annual gross income and applies only the standard deduction for the selected status. It does not calculate all adjustments to income, exclusions, itemized deductions or special deductions. If you already know your taxable income, do not enter it as gross income without accounting for the deduction behavior; the tool is designed for a simple gross-income estimate."
  },
  {
    "question": "Can I use this to calculate my paycheck withholding?",
    "answer": "Not precisely. Annual income-tax liability is different from paycheck withholding. Employers generally calculate withholding using Form W-4 information, pay frequency, benefits and other payroll details. This calculator does not model W-4 elections, bonuses, pre-tax health benefits, retirement contributions or payroll taxes. It can provide a rough annual federal income-tax estimate, but it should not be used as a substitute for the IRS Tax Withholding Estimator or payroll advice. Review your withholding during the year to avoid a large balance due or unnecessary over-withholding."
  }
];
