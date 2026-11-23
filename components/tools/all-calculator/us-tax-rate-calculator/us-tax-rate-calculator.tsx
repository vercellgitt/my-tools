"use client";

import React, { useMemo, useState } from "react";
import "./us-tax-rate-calculator.css";
import { ustaxratecalculatorFaqs } from "./faq";
import {
calculateProgressiveTax,
formatMoney,
} from "../_shared/tax-engine";
import DOMPurify from "isomorphic-dompurify";

export default function UsTaxRateCalculator() {
const [income, setIncome] = useState("75000");
const [status, setStatus] = useState("Single");

const output = useMemo(() => {
const gross = Math.max(0, Number(income) || 0);

const deductions: Record<string, number> = {
  Single: 16100,
  "Married filing jointly": 32200,
  "Head of household": 24150,
  "Married filing separately": 16100,
};

const deduction = deductions[status] ?? 0;
const taxable = Math.max(0, gross - deduction);

const thresholdData: Record<string, number[]> = {
  Single: [12400, 50400, 105700, 201775, 256225, 640600],
  "Married filing jointly": [
    24800, 100800, 211400, 403550, 512450, 768700,
  ],
  "Married filing separately": [
    12400, 50400, 105700, 201775, 256225, 384350,
  ],
  "Head of household": [
    17700, 67450, 105700, 201750, 256200, 640600,
  ],
};

const thresholds = thresholdData[status] ?? thresholdData.Single;

const rates = [
  0.1,
  0.12,
  0.22,
  0.24,
  0.32,
  0.35,
  0.37,
];

const bands = rates.map((rate, index) => ({
  upTo: thresholds[index] ?? null,
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
  deduction,
  allowance: 0,
};

}, [income, status]);

const {
gross,
tax,
net,
calc,
effective,
taxable,
deduction,
} = output;

return (
<main className="ltc-shell us-tax-rate-calculator-theme">
<section className="ltc-hero">
<span className="ltc-eyebrow">Liebess • Tax tools</span>

    <h1>US Tax Rate Calculator</h1>

    <p>
      Estimate 2026 US federal individual income tax using
      the IRS marginal tax brackets and standard deduction.
      Choose a filing status and enter annual income.
      This estimate does not include state tax, payroll taxes,
      credits or itemized deductions.
    </p>

    <span className="ltc-year">Tax year: 2026</span>
  </section>

  <section className="ltc-card">
    <h2>Calculate your estimate</h2>

    <div className="ltc-form">
      <label>
        Annual gross income ($)
        <input
          type="number"
          min="0"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
        />
      </label>

      <label>
        Filing status
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Single">Single</option>
          <option value="Married filing jointly">
            Married filing jointly
          </option>
          <option value="Head of household">
            Head of household
          </option>
          <option value="Married filing separately">
            Married filing separately
          </option>
        </select>
      </label>
    </div>

    <div className="ltc-results">
      <div>
        <small>Standard deduction</small>
        <strong>{formatMoney(deduction, "USD")}</strong>
      </div>

      <div>
        <small>Taxable income</small>
        <strong>{formatMoney(taxable, "USD")}</strong>
      </div>

      <div>
        <small>Estimated federal tax</small>
        <strong>{formatMoney(tax, "USD")}</strong>
      </div>

      <div className="ltc-net">
        <small>Income after estimated federal tax</small>
        <strong>{formatMoney(net, "USD")}</strong>
      </div>

      <div>
        <small>Marginal rate</small>
        <strong>
          {(calc.marginalRate * 100).toFixed(2)}%
        </strong>
      </div>

      <div>
        <small>Effective rate on gross income</small>
        <strong>{effective.toFixed(2)}%</strong>
      </div>
    </div>

    <p className="ltc-note">
      Estimate only. Actual federal tax may differ depending
      on your circumstances, deductions and applicable tax rules.
    </p>
  </section>

  <section className="ltc-info">
    <h2>About this calculator</h2>

    <p>
      Estimate 2026 US federal individual income tax using
      the IRS marginal tax brackets and standard deduction.
      Choose a filing status and enter annual income.
      This estimate does not include state tax, payroll taxes,
      credits or itemized deductions.
    </p>

    <p>
      Tax systems are progressive: each band applies only
      to the portion of income inside that band. Your
      marginal rate is not charged on every dollar.
      Deductions, credits, residency and special rules
      can change actual liability.
    </p>
  </section>

  {/* Internal and External Links */}
<div className="maintenance-1">
  <p>You may also find these useful tools and guides:</p>

  <p
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(`
        <a href="/uk-tax-rate-calculator">UK Tax Rate Calculator</a>
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

    {ustaxratecalculatorFaqs.map((item, i) => (
      <details key={i}>
        <summary>{item.question}</summary>
        <p>{item.answer}</p>
      </details>
    ))}
  </section>

  <footer className="ltc-source">
    Official reference:{" "}
    <a
      href="https://www.irs.gov/irb/2025-45_IRB"
      target="_blank"
      rel="noopener noreferrer"
    >
      Check official tax guidance
    </a>
  </footer>
</main>

);
}