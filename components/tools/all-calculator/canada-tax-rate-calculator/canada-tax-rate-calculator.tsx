"use client";

import React, { useMemo, useState } from "react";
import "./canada-tax-rate-calculator.css";
import { canadataxratecalculatorFaqs } from "./faq";
import {
calculateProgressiveTax,
formatMoney,
} from "../_shared/tax-engine";
import DOMPurify from "isomorphic-dompurify";

export default function CanadaTaxRateCalculator() {
const [income, setIncome] = useState("75000");

const output = useMemo(() => {
const gross = Math.max(0, Number(income) || 0);

const bands = [
  [58523, 0.14],
  [117045, 0.205],
  [181440, 0.26],
  [258482, 0.29],
  [null, 0.33],
].map(([upTo, rate]) => ({
  upTo: upTo as number | null,
  rate: rate as number,
}));

const calc = calculateProgressiveTax(gross, bands);

const tax = calc.tax;
const net = Math.max(0, gross - tax);

return {
  gross,
  tax,
  net,
  calc,
  extra: 0,
  effective: gross > 0 ? (tax / gross) * 100 : 0,
  taxable: gross,
  deduction: 0,
  allowance: 0,
};

}, [income]);

const { gross, tax, net, calc } = output;

return (
<main className="ltc-shell canada-tax-rate-calculator-theme">
<section className="ltc-hero">
<span className="ltc-eyebrow">Liebess • Tax tools</span>

    <h1>Canada Tax Rate Calculator</h1>

    <p>
      Estimate 2026 Canadian federal income tax. Provincial
      tax rates vary across Canada. This calculator currently
      provides a federal-only estimate and does not include
      provincial or territorial income tax.
    </p>

    <span className="ltc-year">Tax year: 2026</span>
  </section>

  <section className="ltc-card">
    <h2>Calculate your estimate</h2>

    <div className="ltc-form">
      <label>
        Annual taxable income (C$)
        <input
          type="number"
          min="0"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      </label>
    </div>

    <div className="ltc-results">
      <div>
        <small>Taxable income</small>
        <strong>{formatMoney(gross, "CAD")}</strong>
      </div>

      <div>
        <small>Estimated federal tax</small>
        <strong>{formatMoney(tax, "CAD")}</strong>
      </div>

      <div className="ltc-net">
        <small>Income after estimated federal tax</small>
        <strong>{formatMoney(net, "CAD")}</strong>
      </div>

      <div>
        <small>Marginal rate</small>
        <strong>
          {(calc.marginalRate * 100).toFixed(2)}%
        </strong>
      </div>

      <div>
        <small>Effective rate</small>
        <strong>
          {(gross > 0 ? (tax / gross) * 100 : 0).toFixed(2)}%
        </strong>
      </div>
    </div>

    <p className="ltc-note">
      Estimate only. Provincial and territorial taxes,
      credits and other deductions are not included.
    </p>
  </section>

  <section className="ltc-info">
    <h2>About this calculator</h2>

    <p>
      Estimate 2026 Canadian federal income tax using
      progressive federal tax brackets. Provincial and
      territorial tax rates vary depending on where you live.
    </p>

    <p>
      Tax systems are progressive: each band applies only
      to the portion of income inside that band. Your
      marginal rate is not charged on every dollar.
      Credits, deductions and residency rules can change
      actual tax liability.
    </p>
  </section>

  {/* Internal and External Links */}
<div className="maintenance-1">
  <p>You may also find these useful tools and guides:</p>

  <p
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(`
        <a href="/uk-tax-rate-calculator">UK Tax Rate Calculator</a>
        <a href="/us-tax-rate-calculator">US Tax Rate Calculator</a>
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

    {canadataxratecalculatorFaqs.map((item, i) => (
      <details key={i}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>
    ))}
  </section>

  <footer className="ltc-source">
    Official reference:{" "}
    <a
      href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      Check official tax guidance
    </a>
  </footer>
</main>

);
}