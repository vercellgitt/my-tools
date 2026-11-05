"use client";

import React, { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import "./all-country-tax-calculator.css";
import { taxArticles } from "./faq";

type Bracket = {
  limit: number;
  rate: number;
};

type TaxConfig = {
  currency: string;
  brackets: Bracket[];
  allowance?: number;
  medicare?: boolean;
  cess?: boolean;
  surtax?: boolean;
};

const taxSystems: Record<string, TaxConfig> = {
  us_single: {
    currency: "$",
    allowance: 16100,
    brackets: [
      { limit: 12400, rate: 0.10 },
      { limit: 50400, rate: 0.12 },
      { limit: 105700, rate: 0.22 },
      { limit: 201775, rate: 0.24 },
      { limit: 256225, rate: 0.32 },
      { limit: 640600, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ],
  },

  us_married: {
    currency: "$",
    allowance: 32200,
    brackets: [
      { limit: 24800, rate: 0.10 },
      { limit: 100800, rate: 0.12 },
      { limit: 211400, rate: 0.22 },
      { limit: 403550, rate: 0.24 },
      { limit: 512450, rate: 0.32 },
      { limit: 768700, rate: 0.35 },
      { limit: Infinity, rate: 0.37 },
    ],
  },

  canada_fed: {
    currency: "C$",
    allowance: 16452,
    brackets: [
      { limit: 58523, rate: 0.14 },
      { limit: 117045, rate: 0.205 },
      { limit: 181440, rate: 0.26 },
      { limit: 258482, rate: 0.29 },
      { limit: Infinity, rate: 0.33 },
    ],
  },

  canada_ontario: {
    currency: "C$",
    allowance: 16452,
    surtax: true,
    brackets: [
      { limit: 53891, rate: 0.0505 },
      { limit: 107785, rate: 0.0915 },
      { limit: 150000, rate: 0.1116 },
      { limit: 220000, rate: 0.1216 },
      { limit: Infinity, rate: 0.1316 },
    ],
  },

  canada_bc: {
    currency: "C$",
    allowance: 16452,
    brackets: [
      { limit: 50363, rate: 0.056 },
      { limit: 100728, rate: 0.077 },
      { limit: 115648, rate: 0.105 },
      { limit: 140430, rate: 0.1229 },
      { limit: 190405, rate: 0.147 },
      { limit: 265545, rate: 0.168 },
      { limit: Infinity, rate: 0.205 },
    ],
  },

  uk: {
    currency: "£",
    allowance: 12570,
    brackets: [
      { limit: 37700, rate: 0.20 },
      { limit: 112570, rate: 0.40 },
      { limit: Infinity, rate: 0.45 },
    ],
  },

  australia: {
    currency: "A$",
    medicare: true,
    brackets: [
      { limit: 18200, rate: 0 },
      { limit: 45000, rate: 0.15 },
      { limit: 135000, rate: 0.30 },
      { limit: 190000, rate: 0.37 },
      { limit: Infinity, rate: 0.45 },
    ],
  },

  singapore: {
    currency: "S$",
    brackets: [
      { limit: 20000, rate: 0 },
      { limit: 30000, rate: 0.02 },
      { limit: 40000, rate: 0.035 },
      { limit: 80000, rate: 0.07 },
      { limit: 120000, rate: 0.115 },
      { limit: 160000, rate: 0.15 },
      { limit: 200000, rate: 0.18 },
      { limit: 240000, rate: 0.19 },
      { limit: 280000, rate: 0.195 },
      { limit: 320000, rate: 0.20 },
      { limit: 500000, rate: 0.22 },
      { limit: 1000000, rate: 0.23 },
      { limit: Infinity, rate: 0.24 },
    ],
  },

  india: {
    currency: "₹",
    cess: true,
    brackets: [
      { limit: 400000, rate: 0 },
      { limit: 800000, rate: 0.05 },
      { limit: 1200000, rate: 0.10 },
      { limit: 1600000, rate: 0.15 },
      { limit: 2000000, rate: 0.20 },
      { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.30 },
    ],
  },

  nz: {
    currency: "NZ$",
    brackets: [
      { limit: 15600, rate: 0.105 },
      { limit: 53500, rate: 0.175 },
      { limit: 78100, rate: 0.30 },
      { limit: 180000, rate: 0.33 },
      { limit: Infinity, rate: 0.39 },
    ],
  },

  netherlands: {
    currency: "€",
    brackets: [
      { limit: 38883, rate: 0.3575 },
      { limit: 78426, rate: 0.3756 },
      { limit: Infinity, rate: 0.495 },
    ],
  },

  us_california: {
    currency: "$",
    brackets: [
      { limit: 11456, rate: 0.01 },
      { limit: 27157, rate: 0.02 },
      { limit: 42861, rate: 0.04 },
      { limit: 59498, rate: 0.06 },
      { limit: 75197, rate: 0.08 },
      { limit: 384109, rate: 0.093 },
      { limit: 460927, rate: 0.103 },
      { limit: 768213, rate: 0.113 },
      { limit: Infinity, rate: 0.123 },
    ],
  },

  us_new_jersey: {
    currency: "$",
    brackets: [
      { limit: 20000, rate: 0.014 },
      { limit: 35000, rate: 0.0175 },
      { limit: 40000, rate: 0.035 },
      { limit: 75000, rate: 0.05525 },
      { limit: 500000, rate: 0.0637 },
      { limit: 1000000, rate: 0.0897 },
      { limit: Infinity, rate: 0.1075 },
    ],
  },

  us_texas: {
    currency: "$",
    brackets: [{ limit: Infinity, rate: 0 }],
  },

  us_florida: {
    currency: "$",
    brackets: [{ limit: Infinity, rate: 0 }],
  },
};

const slugToSystem: Record<string, string> = {
  "after-tax-payment-calculator": "us_single",
  "tax-rate-calculator-ontario": "canada_ontario",
  "uk-tax-rate-calculator": "uk",
  "tax-rate-calculator-australia": "australia",
  "us-tax-rate-calculator": "us_single",
  "tax-rate-calculator-california": "us_california",
  "canada-tax-rate-calculator": "canada_fed",
  "tax-rate-calculator-federal": "us_single",
  "tax-rate-calculator-india": "india",
  "canadian-tax-rate-calculator": "canada_fed",
  "federal-tax-rate-calculator": "us_single",
  "tax-rate-calculator-bc": "canada_bc",
  "tax-rate-calculator-singapore": "singapore",
  "effective-tax-rate-calculator": "us_single",
  "tax-rate-calculator-texas": "us_texas",
  "dutch-tax-rate-calculator": "netherlands",
  "tax-rate-calculator-florida": "us_florida",
  "tax-rate-calculator-nz": "nz",
  "tax-rate-calculator-new-jersey": "us_new_jersey",
  "new-jersey-tax-rate-calculator": "us_new_jersey",
  "tax-return-calculator": "us_single",
  "tax-return-calculator-refund": "us_single",
  "tax-home-pay-calculator-uk": "uk",
  "tax-payable-calculator-uk": "uk",
  "tax-return-calculator-hr-block": "us_single",
  "tax-return-calculator-2026": "us_single",
  "tax-return-calculator-estimate": "us_single",
  "tax-return-calculator-irs": "us_single",
  "tax-return-calculator-canada": "canada_fed",
};

function calculateBracketTax(income: number, brackets: Bracket[]) {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (income <= previousLimit) break;

    const amount = Math.min(income, bracket.limit) - previousLimit;

    tax += amount * bracket.rate;
    previousLimit = bracket.limit;
  }

  return tax;
}

function getOntarioHealthPremium(income: number) {
  if (income <= 20000) return 0;
  if (income <= 36000) return Math.min(300, (income - 20000) * 0.06);
  if (income <= 48000) return Math.min(450, 300 + (income - 36000) * 0.06);
  if (income <= 72000) return Math.min(600, 450 + (income - 48000) * 0.25);
  if (income <= 200000) return Math.min(750, 600 + (income - 72000) * 0.25);
  if (income <= 400000) return Math.min(900, 750 + (income - 200000) * 0.25);
  return 900;
}

export default function AllCountryTaxCalculator() {
  const pathname = usePathname();

  const slug = pathname.split("/").filter(Boolean).pop() || "";

  const system = slugToSystem[slug] || "us_single";

  const config = taxSystems[system];

  const article = taxArticles[slug];

  const [income, setIncome] = useState("75000");
  const [deductions, setDeductions] = useState("0");
  const [withholding, setWithholding] = useState("0");
  const [filingStatus, setFilingStatus] = useState("single");

  const gross = Math.max(0, Number(income) || 0);

  const customDeductions = Math.max(0, Number(deductions) || 0);

  const taxableBeforeAllowance = Math.max(0, gross - customDeductions);

  const standardDeduction =
    system.startsWith("us_")
      ? filingStatus === "married"
        ? 32200
        : filingStatus === "head"
          ? 24150
          : 16100
      : config.allowance || 0;

  const taxableIncome = Math.max(
    0,
    taxableBeforeAllowance - standardDeduction
  );

  const baseTax = calculateBracketTax(
    taxableIncome,
    config.brackets
  );

  let totalTax = baseTax;

  if (config.cess) {
    totalTax += baseTax * 0.04;
  }

  if (config.medicare) {
    if (taxableIncome > 26000) {
      totalTax += taxableIncome * 0.02;
    } else if (taxableIncome > 24276) {
      totalTax += (taxableIncome - 24276) * 0.1;
    }
  }

  if (config.surtax) {
    let surtax = 0;

    if (baseTax > 5818) {
      surtax += (baseTax - 5818) * 0.2;
    }

    if (baseTax > 7446) {
      surtax += (baseTax - 7446) * 0.36;
    }

    totalTax += surtax;
    totalTax += getOntarioHealthPremium(taxableIncome);
  }

  const netIncome = gross - totalTax;

  const effectiveRate =
    gross > 0 ? (totalTax / gross) * 100 : 0;

  const paid = Math.max(0, Number(withholding) || 0);

  const refund = paid - totalTax;

  const isReturn = slug.startsWith("tax-return");

  const formatMoney = (value: number) =>
    config.currency +
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const title = article?.heading || "Income Tax Calculator";

  return (
    <div className="tax-page">

      <section className="tax-calculator-container">

        <h1 className="tax-title">{title}</h1>

        <div className="tax-form-group">
          <label htmlFor="taxIncome">Gross Annual Income</label>

          <input
            id="taxIncome"
            type="number"
            min="0"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter annual income"
          />
        </div>

        {system.startsWith("us_") && (
          <div className="tax-form-group">
            <label htmlFor="filingStatus">Filing Status</label>

            <select
              id="filingStatus"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value)}
            >
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="head">Head of Household</option>
            </select>
          </div>
        )}

        <div className="tax-form-group">
          <label htmlFor="taxDeductions">
            Custom Deductions / Exemptions
          </label>

          <input
            id="taxDeductions"
            type="number"
            min="0"
            value={deductions}
            onChange={(e) => setDeductions(e.target.value)}
            placeholder="Optional deductions"
          />
        </div>

        {isReturn && (
          <div className="tax-form-group">
            <label htmlFor="taxWithholding">
              Tax Already Paid / Withholding
            </label>

            <input
              id="taxWithholding"
              type="number"
              min="0"
              value={withholding}
              onChange={(e) => setWithholding(e.target.value)}
              placeholder="Enter tax already paid"
            />
          </div>
        )}

        <div className="tax-results">

          <div className="tax-result-row">
            <span>Taxable Income (Estimated)</span>
            <strong>{formatMoney(taxableIncome)}</strong>
          </div>

          <div className="tax-result-row">
            <span>Estimated Tax Due</span>
            <strong>{formatMoney(totalTax)}</strong>
          </div>

          <div className="tax-result-row">
            <span>Estimated Effective Tax Rate</span>
            <strong>{effectiveRate.toFixed(2)}%</strong>
          </div>

          <div className="tax-result-row tax-result-total">
            <span>Estimated Net Take-Home Pay</span>
            <strong>{formatMoney(netIncome)}</strong>
          </div>

          {isReturn && (
            <div className="tax-result-row tax-result-refund">
              <span>
                {refund >= 0 ? "Estimated Tax Refund" : "Estimated Tax Owed"}
              </span>

              <strong>{formatMoney(Math.abs(refund))}</strong>
            </div>
          )}

        </div>

        <p className="tax-disclaimer">
          <strong>Disclaimer:</strong> This calculator provides general
          estimates using configured 2026 tax brackets. It does not include
          every tax credit, payroll contribution, local tax, deduction or
          individual tax circumstance. Actual tax liability may differ.
          Consult the relevant government tax authority or a qualified
          tax professional before filing.
        </p>

      </section>

      {article && (
        <section className="tax-article">

          <h2>{article.heading}</h2>

          {article.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <h2>Frequently Asked Questions</h2>

          <div className="tax-faq-list">
            {article.faqs.map((faq, index) => (
              <details className="tax-faq-item" key={index}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>

        </section>
      )}

    </div>
  );
}