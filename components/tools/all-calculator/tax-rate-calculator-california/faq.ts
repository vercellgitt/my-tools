export interface FaqItem { question: string; answer: string; }
export const taxratecalculatorcaliforniaFaqs: FaqItem[] = [
  {
    "question": "Why does this California calculator use 2025?",
    "answer": "The calculator uses the 2025 California tax rate schedule because that is the latest complete official schedule included in this package. Although some 2026 inflation-adjusted figures may be announced before the full filing schedules are available, the complete 2026 rate tables were not yet published when this package was prepared. Using an incomplete or guessed 2026 schedule would risk giving misleading results. The tax year is clearly displayed so you can distinguish this estimate from a future-year calculation."
  },
  {
    "question": "Does this calculate federal income tax too?",
    "answer": "No. California state income tax is separate from US federal income tax. This page estimates California state bracket tax only and does not include federal tax, Social Security, Medicare, local taxes or other payroll deductions. Your combined tax burden may be higher after federal and payroll taxes are considered. California also has additional rules and adjustments that may affect the final amount. Use a federal calculator separately and consult the California Franchise Tax Board for a complete state return calculation."
  },
  {
    "question": "Which filing status is used?",
    "answer": "This simplified calculator uses the 2025 California Schedule X brackets for Single or Married/RDP Filing Separately. California has different schedules for married or registered domestic partners filing jointly and for head of household. Because those schedules have different thresholds, this version should not be used as an exact estimate for those statuses. If you file jointly or as head of household, use the relevant Schedule Y or Schedule Z in the official FTB booklet or a tax preparation tool that supports your filing status."
  },
  {
    "question": "Are California rates progressive?",
    "answer": "Yes. California applies progressive income tax rates. Each rate applies only to the portion of taxable income within the corresponding band. A taxpayer who enters a higher bracket does not pay that highest percentage on every dollar. This calculator applies the single-filer Schedule X bands progressively and totals the tax for each slice. It shows the marginal rate and effective rate separately. The effective rate is based on the taxable income entered and is not necessarily the same as the percentage withheld from a paycheck."
  },
  {
    "question": "What income should I enter?",
    "answer": "Enter your California taxable income for 2025, not automatically your gross salary. California taxable income may differ from federal taxable income because California has its own adjustments, deductions and conformity rules. This calculator does not compute those adjustments, exemptions, credits or deductions. If you enter gross wages, the result may not reflect your actual state taxable income. For a precise return estimate, determine California taxable income using the FTB instructions or tax software that supports California-specific rules."
  },
  {
    "question": "Does this include the California Mental Health Services Tax?",
    "answer": "No. California imposes an additional 1% tax on taxable income above $1 million under the Mental Health Services Tax. This simplified bracket engine does not add that surcharge. It also excludes credits, exemption credits, alternative minimum tax and other special state rules. High-income taxpayers may therefore see a significant difference between this estimate and their final liability. Check the current FTB instructions and seek professional advice where appropriate."
  },
  {
    "question": "Can a California resident use this to estimate take-home pay?",
    "answer": "It is only one part of a take-home pay estimate. Your paycheck can include federal income tax withholding, California income tax withholding, Social Security, Medicare, California State Disability Insurance and benefit deductions. This page estimates a simplified California state income tax amount only. Payroll withholding can also differ from final tax liability because it depends on Form W-4, DE 4 and employer payroll settings. Do not use this result alone to set withholding or decide how much money to remit."
  },
  {
    "question": "Where can I verify the official California rates?",
    "answer": "The California Franchise Tax Board publishes the official tax rate schedules, tax tables and Form 540 instructions for each tax year. The source link on this page points to the 2025 FTB booklet used for the brackets in this calculator. Check the FTB website for updates, filing instructions and any later-year schedules. Official tables should take precedence over a general online estimate, especially if you have credits, multiple income sources, residency changes or a filing status other than the one modelled here."
  }
];
