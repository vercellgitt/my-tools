"use client";

import React, { useMemo, useState } from "react";
import "./percent-of-difference-formula.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

export default function PercentOfDifferenceFormulaCalculator() {
  const [valA, setValA] = useState<string>("50");
  const [valB, setValB] = useState<string>("75");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const computed = useMemo(() => {
    if (valA.trim() === "" || valB.trim() === "") {
      return {
        error: "Enter both Value A and Value B to evaluate the formula.",
        absDiff: null,
        average: null,
        percentDiff: null,
      };
    }

    const a = Number(valA);
    const b = Number(valB);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return {
        error: "Both Value A and Value B must be valid numbers.",
        absDiff: null,
        average: null,
        percentDiff: null,
      };
    }

    const absDiff = Math.abs(a - b);
    const average = (a + b) / 2;

    if (average === 0) {
      return {
        error:
          "Average is zero ((A + B) / 2 = 0). Percentage difference cannot be calculated when the average is zero.",
        absDiff,
        average,
        percentDiff: null,
      };
    }

    const percentDiff = (absDiff / Math.abs(average)) * 100;

    return {
      error: null,
      absDiff,
      average,
      percentDiff,
    };
  }, [valA, valB]);

  const handleCopy = async () => {
    if (computed.percentDiff === null) return;
    const formatted = `${formatPrecise(computed.percentDiff, 4)}%`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formatted);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setValA("");
    setValB("");
    setCopied(false);
  };

  return (
    <div className="diffformula1-root">
      <div className="diffformula1-container">
        <header className="diffformula1-banner">
          <span className="diffformula1-pill">Formula Breakdown</span>
          <h1 className="diffformula1-h1">Percent of Difference Formula</h1>
          <p className="diffformula1-sub">
            Evaluate Percentage Difference = (|A − B| ÷ ((A + B) ÷ 2)) × 100 with each intermediate term shown separately.
          </p>
        </header>

        <div className="diffformula1-formula-strip">
          <strong>Mathematical Formula:</strong>{" "}
          <span>Percentage Difference = (|A − B| / ((A + B) / 2)) × 100</span>
        </div>

        <section className="diffformula1-workspace" aria-label="Value A and Value B inputs">
          <div className="diffformula1-inputs">
            <div className="diffformula1-box">
              <label htmlFor="diffformula1-a" className="diffformula1-label">
                Value A
              </label>
              <input
                id="diffformula1-a"
                type="number"
                step="any"
                className="diffformula1-input"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
                placeholder="e.g., 50"
              />
            </div>
            <div className="diffformula1-box">
              <label htmlFor="diffformula1-b" className="diffformula1-label">
                Value B
              </label>
              <input
                id="diffformula1-b"
                type="number"
                step="any"
                className="diffformula1-input"
                value={valB}
                onChange={(e) => setValB(e.target.value)}
                placeholder="e.g., 75"
              />
            </div>
          </div>

          {computed.error && (
            <div className="diffformula1-alert" role="alert">
              {computed.error}
            </div>
          )}

          <div className="diffformula1-controls">
            <button
              type="button"
              className="diffformula1-btn-primary"
              onClick={handleCopy}
              disabled={computed.percentDiff === null}
            >
              {copied ? "Copied Result" : "Copy Result"}
            </button>
            <button
              type="button"
              className="diffformula1-btn-reset"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>

          <div className="diffformula1-metrics">
            <div className="diffformula1-metric-card">
              <span className="diffformula1-metric-label">1. Absolute Difference |A − B|</span>
              <strong className="diffformula1-metric-val">
                {computed.absDiff !== null ? formatPrecise(computed.absDiff, 4) : "—"}
              </strong>
            </div>
            <div className="diffformula1-metric-card">
              <span className="diffformula1-metric-label">2. Average (A + B) / 2</span>
              <strong className="diffformula1-metric-val">
                {computed.average !== null ? formatPrecise(computed.average, 4) : "—"}
              </strong>
            </div>
            <div className="diffformula1-metric-card diffformula1-metric-highlight">
              <span className="diffformula1-metric-label">3. Percentage Difference</span>
              <strong className="diffformula1-metric-val">
                {computed.percentDiff !== null ? `${formatPrecise(computed.percentDiff, 4)}%` : "—"}
              </strong>
            </div>
          </div>
        </section>

        <article className="diffformula1-article">
          <h2 className="diffformula1-h2">Formula Explanation &amp; Worked Example</h2>
          <p className="diffformula1-p">
            In the percent of difference formula, the numerator |A − B| measures the non-negative gap between Value A and Value B. The denominator ((A + B) ÷ 2) computes their arithmetic mean so that the percentage reflects a balanced comparison between both numbers.
          </p>
          <div className="diffformula1-example">
            <strong>Worked Example (A = 40, B = 60):</strong>
            <p className="diffformula1-p">
              Absolute difference: |40 − 60| = 20. Average: (40 + 60) ÷ 2 = 50. Percentage difference: (20 ÷ 50) × 100 = 40%.
            </p>
          </div>
        </article>
        <RelatedCalculatorLinks currentSlug="percent-of-difference-formula" />

        <section className="diffformula1-faq" aria-label="Frequently asked questions">
          <h2 className="diffformula1-h2">Frequently Asked Questions</h2>
          <div className="diffformula1-faq-list">
            {faqItems.map((item, index) => {
              const open = openFaq === index;
              return (
                <div key={item.question} className="diffformula1-faq-item">
                  <button
                    type="button"
                    className="diffformula1-faq-btn"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span>{open ? "−" : "+"}</span>
                  </button>
                  {open && <div className="diffformula1-faq-ans">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function formatPrecise(value: number, maxDecimals: number): string {
  const n = Number(value.toFixed(maxDecimals));
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}