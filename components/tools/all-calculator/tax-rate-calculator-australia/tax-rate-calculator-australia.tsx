"use client";

import React, { useMemo, useState } from "react";
import "./tax-rate-calculator-australia.css";
import { taxratecalculatoraustraliaFaqs } from "./faq";
import {
  calculateProgressiveTax,
  formatMoney,
} from "../_shared/tax-engine";
import DOMPurify from "isomorphic-dompurify";

export default function TaxRateCalculatorAustralia() {
  const [income, setIncome] = useState("75000");

  const output = useMemo(() => {
    const gross = Math.max(0, Number(income) || 0);

    const bands: { upTo: number | null; rate: number }[] = [
      { upTo: 18200, rate: 0 },
      { upTo: 45000, rate: 0.16 },
      { upTo: 135000, rate: 0.3 },
      { upTo: 190000, rate: 0.37 },
      { upTo: null, rate: 0.45 },
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
    <main className="ltc-shell tax-rate-calculator-australia-theme">
      <section className="ltc-hero">
        <span className="ltc-eyebrow">Liebess • Tax tools</span>

        <h1>Australia Tax Rate Calculator</h1>

        <p>
          Estimate Australian resident individual income tax for the 2026–27
          financial year using ATO marginal tax rates. The estimate excludes
          the Medicare levy, Medicare levy surcharge, offsets, deductions and
          non-resident tax rules.
        </p>

        <span className="ltc-year">Tax year: 2026–27</span>
      </section>

      <section className="ltc-card">
        <h2>Calculate your estimate</h2>

        <div className="ltc-form">
          <label>
            Annual taxable income (A$)
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
            <strong>{formatMoney(gross, "AUD")}</strong>
          </div>

          <div>
            <small>Estimated tax</small>
            <strong>{formatMoney(tax, "AUD")}</strong>
          </div>

          <div className="ltc-net">
            <small>Income after estimated tax</small>
            <strong>{formatMoney(net, "AUD")}</strong>
          </div>

          <div>
            <small>Marginal rate</small>
            <strong>{(calc.marginalRate * 100).toFixed(2)}%</strong>
          </div>

          <div>
            <small>Effective rate</small>
            <strong>{(output.effective * 100).toFixed(2)}%</strong>
          </div>
        </div>

        <p className="ltc-note">Estimate only.</p>
      </section>

      <section className="ltc-info">
        <h2>About this calculator</h2>

        <p>
          Estimate Australian resident individual income tax for the 2026–27
          financial year using ATO marginal tax rates. The estimate excludes
          the Medicare levy, Medicare levy surcharge, offsets, deductions and
          non-resident tax rules.
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
        <a href="/tax-rate-calculator-california">California Tax Rate Calculator</a>
        <a href="/after-tax-payment-calculator">After Tax Payment Calculator</a>
      `)
    }}
  />
</div>

      <section className="ltc-faq">
        <h2>Frequently asked questions</h2>

        {taxratecalculatoraustraliaFaqs.map((item, i) => (
          <details key={i}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>

      <footer className="ltc-source">
        Official reference:{" "}
        <a
          href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents"
          target="_blank"
          rel="noopener noreferrer"
        >
          Check official tax guidance
        </a>
      </footer>
    </main>
  );
}