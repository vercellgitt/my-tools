"use client";

import React, { useMemo, useState } from "react";
import "./tax-rate-calculator-california.css";
import { taxratecalculatorcaliforniaFaqs } from "./faq";
import {
calculateProgressiveTax,
formatMoney,
} from "../_shared/tax-engine";
import DOMPurify from "isomorphic-dompurify";

export default function TaxRateCalculatorCalifornia() {
const [income, setIncome] = useState("75000");

const output = useMemo(() => {
const gross = Math.max(0, Number(income) || 0);

const bands: { upTo: number | null; rate: number }[] = [
  { upTo: 11079, rate: 0.01 },
  { upTo: 26264, rate: 0.02 },
  { upTo: 41452, rate: 0.04 },
  { upTo: 57542, rate: 0.06 },
  { upTo: 72724, rate: 0.08 },
  { upTo: 371479, rate: 0.093 },
  { upTo: 445771, rate: 0.103 },
  { upTo: 742953, rate: 0.113 },
  { upTo: null, rate: 0.123 },
];

const calc = calculateProgressiveTax(gross, bands);

const tax = calc.tax;
const net = Math.max(0, gross - tax);
const effective = gross > 0 ? tax / gross : 0;

return {
  gross,
  tax,
  net,
  calc,
  extra: 0,
  effective,
  taxable: gross,
  deduction: 0,
  allowance: 0,
};

}, [income]);

const { gross, tax, net, calc } = output;

return (
<main className="ltc-shell tax-rate-calculator-california-theme">
<section className="ltc-hero">
<span className="ltc-eyebrow">Liebess • Tax tools</span>

    <h1>California Tax Rate Calculator</h1>

    <p>
      Estimate California state income tax for tax year 2025 using the
      official California tax rate schedules. The 2026 full schedules were
      not yet published when this package was prepared, so this calculator
      deliberately defaults to the latest complete official schedule
      available: 2025. Federal tax is not included.
    </p>

    <span className="ltc-year">Tax year: 2025</span>
  </section>

  <section className="ltc-card">
    <h2>Calculate your estimate</h2>

    <div className="ltc-form">
      <label>
        Annual taxable income ($)
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
        <strong>{formatMoney(gross, "USD")}</strong>
      </div>

      <div>
        <small>Estimated tax</small>
        <strong>{formatMoney(tax, "USD")}</strong>
      </div>

      <div className="ltc-net">
        <small>Income after estimated tax</small>
        <strong>{formatMoney(net, "USD")}</strong>
      </div>

      <div>
        <small>Marginal rate</small>
        <strong>{(calc.marginalRate * 100).toFixed(2)}%</strong>
      </div>

      <div>
        <small>Effective rate</small>
        <strong>{(calc.effectiveRate * 100).toFixed(2)}%</strong>
      </div>
    </div>

    <p className="ltc-note">
      Estimate only. Uses 2025 California Schedule X for single or married
      filing separately; surtaxes and credits are excluded.
    </p>
  </section>

  <section className="ltc-info">
    <h2>About this calculator</h2>

    <p>
      Estimate California state income tax for tax year 2025 using the
      official California tax rate schedules. The 2026 full schedules were
      not yet published when this package was prepared, so this calculator
      deliberately defaults to the latest complete official schedule
      available: 2025. Federal tax is not included.
    </p>

    <p>
      Tax systems are progressive: each band applies only to the portion
      of income inside that band. Your marginal rate is not charged on
      every dollar. Deductions, credits, residency and special rules can
      change actual liability.
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
        <a href="/canada-tax-rate-calculator">Canada Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-ontario">Ontario Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-federal">Federal Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-australia">Australia Tax Rate Calculator</a>
        <a href="/after-tax-payment-calculator">After Tax Payment Calculator</a>
      `)
    }}
  />
</div>

  <section className="ltc-faq">
    <h2>Frequently asked questions</h2>

    {taxratecalculatorcaliforniaFaqs.map((item, i) => (
      <details key={i}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>
    ))}
  </section>

  <footer className="ltc-source">
    Official reference:{" "}
    <a
      href="https://www.ftb.ca.gov/forms/2025/2025-540-booklet.html"
      target="_blank"
      rel="noopener noreferrer"
    >
      Check official tax guidance
    </a>
  </footer>
</main>

);
}