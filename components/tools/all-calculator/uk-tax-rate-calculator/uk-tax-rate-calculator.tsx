"use client";

import React, { useMemo, useState } from "react";
import "./uk-tax-rate-calculator.css";
import { uktaxratecalculatorFaqs } from "./faq";
import { calculateProgressiveTax, formatMoney } from "../_shared/tax-engine";
import DOMPurify from "isomorphic-dompurify";

export default function UkTaxRateCalculator() {
const [income, setIncome] = useState("75000");
const [region, setRegion] = useState(
"England / Wales / Northern Ireland"
);

const output = useMemo(() => {
const gross = Math.max(0, Number(income) || 0);

const allowance =
  gross > 100000
    ? Math.max(0, 12570 - (gross - 100000) / 2)
    : 12570;

const taxable = Math.max(0, gross - allowance);

const regionData: Record<
  string,
  Array<[number | null, number]>
> = {
  "England / Wales / Northern Ireland": [
    [37700, 0.2],
    [125140, 0.4],
    [null, 0.45],
  ],
  Scotland: [
    [3967, 0.19],
    [16956, 0.2],
    [31092, 0.21],
    [62430, 0.42],
    [125140, 0.45],
    [null, 0.48],
  ],
};

const bands = regionData[region].map(([upTo, rate]) => ({
  upTo,
  rate,
}));

const calc = calculateProgressiveTax(taxable, bands);

const tax = calc.tax;
const net = Math.max(0, gross - tax);
const effective = gross > 0 ? (tax / gross) * 100 : 0;

return {
  gross,
  tax,
  net,
  calc,
  extra: 0,
  effective,
  taxable,
  deduction: 0,
  allowance,
};

}, [income, region]);

const {
gross,
tax,
net,
calc,
effective,
taxable,
allowance,
} = output;

return (
<main className="ltc-shell uk-tax-rate-calculator-theme">
<section className="ltc-hero">
<span className="ltc-eyebrow">Liebess • Tax tools</span>

    <h1>UK Tax Rate Calculator</h1>

    <p>
      Estimate your UK income tax for the 2026–27 tax year.
      The standard Personal Allowance is £12,570 and is reduced
      by £1 for every £2 of adjusted net income above £100,000.
      England, Wales and Northern Ireland use the main UK bands;
      Scotland has separate non-savings income bands.
    </p>

    <span className="ltc-year">Tax year: 2026–27</span>
  </section>

  <section className="ltc-card">
    <h2>Calculate your estimate</h2>

    <div className="ltc-form">
      <label>
        Annual gross income (£)
        <input
          type="number"
          min="0"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      </label>

      <label>
        Tax region
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option>England / Wales / Northern Ireland</option>
          <option>Scotland</option>
        </select>
      </label>
    </div>

    <div className="ltc-results">
      <div>
        <small>Personal allowance</small>
        <strong>{formatMoney(allowance, "GBP")}</strong>
      </div>

      <div>
        <small>Taxable income</small>
        <strong>{formatMoney(taxable, "GBP")}</strong>
      </div>

      <div>
        <small>Estimated income tax</small>
        <strong>{formatMoney(tax, "GBP")}</strong>
      </div>

      <div className="ltc-net">
        <small>Income after estimated tax</small>
        <strong>{formatMoney(net, "GBP")}</strong>
      </div>

      <div>
        <small>Marginal rate</small>
        <strong>{(calc.marginalRate * 100).toFixed(2)}%</strong>
      </div>

      <div>
        <small>Effective rate on gross income</small>
        <strong>{effective.toFixed(2)}%</strong>
      </div>
    </div>

    <p className="ltc-note">
      Estimate only. Actual tax may differ depending on your
      circumstances and applicable tax rules.
    </p>
  </section>

  <section className="ltc-info">
    <h2>About this calculator</h2>

    <p>
      Estimate your UK income tax for the 2026–27 tax year.
      The standard Personal Allowance is £12,570 and is reduced
      by £1 for every £2 of adjusted net income above £100,000.
      England, Wales and Northern Ireland use the main UK bands;
      Scotland has separate non-savings income bands.
    </p>

    <p>
      Tax systems are progressive: each band applies only to
      the portion of income inside that band. Your marginal
      rate is not charged on every pound. Deductions, credits,
      residency and special rules can change actual liability.
    </p>
  </section>

  {/* Internal and External Links */}
<div className="maintenance-1">
  <p>
    You may also find these useful tools and guides:
  </p>

  <p
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(`
        <a href="/us-tax-rate-calculator">US Tax Rate Calculator</a>
        <a href="/canada-tax-rate-calculator">Canada Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-ontario">Ontario Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-federal">Federal Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-australia">Australia Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-california">California Tax Rate Calculator</a>
        <a href="/after-tax-payment-calculator">After Tax Payment Calculator</a>
      `)
    }}
  />
</div>

  <section className="ltc-faq">
    <h2>Frequently asked questions</h2>

    {uktaxratecalculatorFaqs.map((item, i) => (
      <details key={i}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>
    ))}
  </section>

  <footer className="ltc-source">
    Official reference:{" "}
    <a
      href="https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past"
      target="_blank"
      rel="noopener noreferrer"
    >
      Check official tax guidance
    </a>
  </footer>
</main>

);
}