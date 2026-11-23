export interface FaqItem { question: string; answer: string; }
export const taxratecalculatorfederalFaqs: FaqItem[] = [
  {
    "question": "What are the 2026 Canadian federal tax brackets?",
    "answer": "For 2026, the published federal rates are 14% on the first $58,523 of taxable income, 20.5% on the portion from $58,523 to $117,045, 26% from $117,045 to $181,440, 29% from $181,440 to $258,482 and 33% on taxable income above $258,482. Each rate applies only to the portion of income within its bracket. These are federal rates and do not include provincial or territorial income tax. Thresholds and rates can change in future tax years."
  },
  {
    "question": "Does this include provincial tax?",
    "answer": "No. This calculator estimates Canadian federal bracket tax only. Residents generally also pay provincial or territorial income tax, and those rates vary depending on the province or territory of residence on December 31. Provincial tax is calculated separately and added to federal tax, with credits and adjustments affecting the final amount. The result on this page is therefore not your total Canadian income tax or take-home pay. Use the matching provincial calculator or CRA resources to estimate the other component."
  },
  {
    "question": "Why does the first federal rate show 14%?",
    "answer": "The CRA’s published 2026 federal tax table lists a 14% rate for the first federal income bracket. Tax rates and thresholds may reflect legislation and annual indexation, so older-year examples may show different rates or thresholds. This calculator uses the rates published for the selected 2026 tax year. Always check the displayed tax year and the CRA’s official current-year tax brackets before making a payment or filing decision."
  },
  {
    "question": "How does marginal tax work in Canada?",
    "answer": "Marginal tax means that each portion of taxable income is taxed at the rate for the bracket it falls into. If your income reaches a higher bracket, the higher rate applies only to the amount above that bracket threshold. The earlier portions remain taxed at their earlier rates. The calculator calculates each slice independently, adds the tax amounts and shows the top marginal rate alongside the effective rate. This helps prevent the common misunderstanding that your entire income is taxed at your highest bracket."
  },
  {
    "question": "Does the calculator apply the basic personal amount?",
    "answer": "No. The calculator applies the federal bracket rates to the taxable income amount entered. It does not calculate the federal basic personal amount, non-refundable credits, spouse or dependant amounts, disability credits, tuition credits, RRSP deductions or other adjustments. These items can reduce the final federal tax payable. For that reason, the result is a bracket-based estimate and may be higher than the final amount on a completed tax return. Use CRA-certified software for a full calculation."
  },
  {
    "question": "Should I enter gross salary or taxable income?",
    "answer": "For the most meaningful bracket estimate, enter your taxable income after applicable deductions and adjustments. Gross salary is not always the same as taxable income. RRSP deductions, employment expenses, other income, benefits and special adjustments may change the taxable amount. This calculator does not determine those adjustments. If you enter gross salary, treat the result as a rough illustration rather than a precise tax liability. Do not subtract the federal tax brackets or credits yourself; the calculator performs only the progressive bracket calculation."
  },
  {
    "question": "Does this include CPP and EI?",
    "answer": "No. Canada Pension Plan contributions and Employment Insurance premiums are payroll deductions separate from federal income tax. Their contribution rates, maximums and eligibility rules are different from income tax brackets. This tool excludes CPP, EI, provincial tax and other payroll deductions, so it cannot calculate net pay. If you need a take-home pay estimate, use a Canadian payroll calculator that includes the relevant statutory deductions and your province of employment or residence."
  },
  {
    "question": "Can I use this for a tax return?",
    "answer": "No. It is an educational estimate of federal bracket tax, not tax preparation software. A complete return can involve credits, deductions, benefit repayments, alternative calculations, investment income, capital gains, foreign income and other rules. The calculator does not collect the information needed to apply those rules. Use CRA-certified tax software or a qualified tax professional to prepare and verify your return. The official CRA page is the authority for current federal and provincial tax rates."
  }
];
