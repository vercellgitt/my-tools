export interface FaqItem { question: string; answer: string; }
export const uktaxratecalculatorFaqs: FaqItem[] = [
  {
    "question": "What is the UK Personal Allowance for 2026–27?",
    "answer": "The standard UK Personal Allowance for the 2026–27 tax year is £12,570. This is the amount of eligible income you can usually receive before paying income tax. The allowance is reduced by £1 for every £2 of adjusted net income above £100,000, so it is fully withdrawn when adjusted net income reaches £125,140. Your actual entitlement can also be affected by circumstances such as Marriage Allowance, blind person’s allowance and certain reliefs. This calculator applies the standard allowance and the £100,000 taper rule only; it does not calculate every personal relief or special tax treatment. Use the result as an estimate and check your position with HMRC or a qualified adviser."
  },
  {
    "question": "Are UK income tax rates the same in Scotland?",
    "answer": "No. Scotland sets separate income tax bands and rates for most non-savings, non-dividend income, such as employment income and pensions. For 2026–27, the Scottish bands include starter, basic, intermediate, higher, advanced and top rates. The rest of the UK uses the basic, higher and additional rates. Savings interest and dividends generally follow UK-wide rules rather than the Scottish non-savings bands. Select Scotland in the calculator if you are a Scottish taxpayer. Residency rules can be more specific than simply where you work, so confirm your taxpayer status before relying on an estimate."
  },
  {
    "question": "Does the higher tax rate apply to all my income?",
    "answer": "No. UK income tax is progressive. Each rate applies only to the slice of taxable income that falls inside its band. For example, moving into the higher-rate band does not cause all your income to be taxed at 40%; the lower slices remain taxed at their lower rates. The calculator applies the bands progressively and shows both the marginal rate on your top slice and the effective rate across the income entered. This distinction is important when comparing a pay rise or bonus. National Insurance, student loan repayments and pension contributions are not included in this income-tax estimate."
  },
  {
    "question": "What happens when income is over £100,000?",
    "answer": "The standard Personal Allowance is tapered once adjusted net income exceeds £100,000. For every £2 above that threshold, £1 of allowance is lost. This creates an effective marginal tax rate that can be higher than the headline band rate over part of that income range. The calculator models the standard taper by reducing the allowance as income rises, down to zero. Adjusted net income is not always identical to gross salary: pension contributions and certain charitable donations can affect it. The result is therefore an estimate, not a substitute for a full adjusted-net-income calculation."
  },
  {
    "question": "Does this calculator include National Insurance?",
    "answer": "No. This tool estimates income tax only. National Insurance contributions are separate deductions with their own thresholds, rates and rules, and they can vary by employment type and circumstances. Your take-home pay may therefore be lower than the after-tax figure shown here. Student loan repayments, workplace pension contributions, salary sacrifice, benefits in kind and other payroll deductions are also outside this calculation. To estimate full take-home pay, use a dedicated UK salary calculator that includes National Insurance and relevant deductions, or check your payslip and HMRC guidance."
  },
  {
    "question": "Which income should I enter?",
    "answer": "Enter your estimated annual taxable income before income tax, in pounds sterling. For a straightforward employee estimate, this may be your annual salary before tax. If you have several income sources, taxable benefits, rental income, self-employment profits or pension income, the correct figure may require combining and adjusting those amounts under HMRC rules. Do not subtract the Personal Allowance yourself: the calculator applies it. It does not automatically account for allowable expenses, pension relief, Gift Aid, savings allowances, dividend allowances or other reliefs, so complex circumstances may produce a different final liability."
  },
  {
    "question": "What is marginal tax rate?",
    "answer": "Your marginal tax rate is the rate applied to the next pound of taxable income at your current income level. It is not the percentage of your entire income that you pay in tax. Your effective tax rate is total estimated income tax divided by the income entered. Because the UK system applies tax bands progressively and may taper the Personal Allowance, these two percentages can be quite different. The calculator displays both so you can understand the rate on your next increment of income and the overall share of income represented by the estimate."
  },
  {
    "question": "Can I use this for self-employed tax?",
    "answer": "You can use it as a broad estimate of income tax on taxable profits, but it is not a complete self-assessment calculator. Self-employed people may need to calculate taxable trading profit after allowable expenses, payments on account, Class 2 or Class 4 National Insurance where applicable, student loan repayments and other income or reliefs. The tax year and accounting period rules can also matter. Entering gross business turnover instead of taxable profit will overstate or distort the estimate. For a return or payment decision, use HMRC’s Self Assessment guidance or obtain professional advice."
  }
];
