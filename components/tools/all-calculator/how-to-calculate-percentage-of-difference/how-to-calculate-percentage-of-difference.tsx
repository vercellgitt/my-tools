"use client";

import React, { useMemo, useState } from "react";
import "./how-to-calculate-percentage-of-difference.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

export default function HowToCalculatePercentageOfDifference() {
  const [value1Raw, setValue1Raw] = useState<string>("80");
  const [value2Raw, setValue2Raw] = useState<string>("100");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calc = useMemo(() => {
    if (value1Raw.trim() === "" || value2Raw.trim() === "") {
      return {
        error: "Please enter both Value 1 and Value 2.",
        absDiff: null,
        average: null,
        percentDiff: null,
      };
    }

    const v1 = Number(value1Raw);
    const v2 = Number(value2Raw);

    if (!Number.isFinite(v1) || !Number.isFinite(v2)) {
      return {
        error: "Please enter valid numbers in both fields.",
        absDiff: null,
        average: null,
        percentDiff: null,
      };
    }

    const absDiff = Math.abs(v1 - v2);
    const average = (v1 + v2) / 2;

    if (average === 0) {
      return {
        error:
          "Percentage difference is undefined when the average of both values equals zero (division by zero).",
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
  }, [value1Raw, value2Raw]);

  const handleCopy = async () => {
    if (calc.percentDiff === null) return;
    const text = `${formatNum(calc.percentDiff, 4)}%`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setValue1Raw("");
    setValue2Raw("");
    setCopied(false);
  };

  return (
    <div className="percentdiff1-root">
      <div className="percentdiff1-wrapper">
        <header className="percentdiff1-header">
          <span className="percentdiff1-kicker">Symmetric Comparison Guide &amp; Calculator</span>
          <h1 className="percentdiff1-title">How to Calculate Percentage of Difference</h1>
          <p className="percentdiff1-lead">
            Compare two symmetric values relative to their average rather than treating either number as a starting baseline.
          </p>
        </header>

        <div className="percentdiff1-grid">
          <section className="percentdiff1-card percentdiff1-navy-card" aria-label="Input values">
            <div className="percentdiff1-field">
              <label htmlFor="percentdiff1-v1" className="percentdiff1-label">
                First Value
              </label>
              <input
                id="percentdiff1-v1"
                type="number"
                step="any"
                className="percentdiff1-input"
                value={value1Raw}
                onChange={(e) => setValue1Raw(e.target.value)}
                placeholder="e.g., 80"
              />
            </div>

            <div className="percentdiff1-field">
              <label htmlFor="percentdiff1-v2" className="percentdiff1-label">
                Second Value
              </label>
              <input
                id="percentdiff1-v2"
                type="number"
                step="any"
                className="percentdiff1-input"
                value={value2Raw}
                onChange={(e) => setValue2Raw(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>

            {calc.error && (
              <div className="percentdiff1-error" role="alert">
                {calc.error}
              </div>
            )}

            <div className="percentdiff1-btn-row">
              <button
                type="button"
                className="percentdiff1-btn-orange"
                onClick={handleCopy}
                disabled={calc.percentDiff === null}
              >
                {copied ? "Copied!" : "Copy Percentage"}
              </button>
              <button
                type="button"
                className="percentdiff1-btn-ghost"
                onClick={handleReset}
              >
                Clear / Reset
              </button>
            </div>
          </section>

          <section className="percentdiff1-card percentdiff1-light-card" aria-label="Percentage difference result">
            <div className="percentdiff1-result-eyebrow">Percentage Difference</div>
            {calc.percentDiff !== null ? (
              <>
                <div className="percentdiff1-result-big">{formatNum(calc.percentDiff, 4)}%</div>
                <p className="percentdiff1-diff-note">
                  Absolute difference between the two values: <strong>{formatNum(calc.absDiff ?? 0, 4)}</strong>
                  {" | "}Average: <strong>{formatNum(calc.average ?? 0, 4)}</strong>
                </p>
              </>
            ) : (
              <div className="percentdiff1-result-empty">
                Enter two values whose average is not zero to see the result.
              </div>
            )}

            <div className="percentdiff1-steps">
              <div className="percentdiff1-steps-title">Step-by-Step Calculation</div>
              <p className="percentdiff1-formula">
                Formula: (|Value 1 − Value 2| ÷ ((Value 1 + Value 2) ÷ 2)) × 100
              </p>
              {calc.percentDiff !== null && calc.absDiff !== null && calc.average !== null && (
                <ol className="percentdiff1-step-list">
                  <li>
                    Find absolute difference: |{value1Raw} − {value2Raw}| = {formatNum(calc.absDiff, 4)}
                  </li>
                  <li>
                    Find average of both values: ({value1Raw} + {value2Raw}) ÷ 2 = {formatNum(calc.average, 4)}
                  </li>
                  <li>
                    Divide and multiply by 100: ({formatNum(calc.absDiff, 4)} ÷ {formatNum(Math.abs(calc.average), 4)}) × 100 ={" "}
                    <strong>{formatNum(calc.percentDiff, 4)}%</strong>
                  </li>
                </ol>
              )}
            </div>
          </section>
        </div>

        <article className="percentdiff1-lesson">
          <h2 className="percentdiff1-lesson-heading">Percentage Difference vs. Percentage Change</h2>
          <p className="percentdiff1-lesson-text">
            Percentage difference measures how far apart two numbers are relative to their average. Neither value acts as a starting point, so swapping Value 1 and Value 2 produces the exact same percentage difference.
          </p>
          <p className="percentdiff1-lesson-text">
            By contrast, percentage change measures movement from an original value to a new value using the original value as the denominator. Use percentage difference when comparing two parallel measurements, estimates, or prices without a chronological &ldquo;before and after&rdquo; order.
          </p>
        </article>

        <RelatedCalculatorLinks currentSlug="how-to-calculate-percentage-of-difference" />

        <section className="percentdiff1-faq" aria-label="Frequently asked questions">
          <h2 className="percentdiff1-faq-heading">Frequently Asked Questions</h2>
          <div className="percentdiff1-faq-items">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.question} className="percentdiff1-faq-box">
                  <button
                    type="button"
                    className="percentdiff1-faq-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <div className="percentdiff1-faq-content">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function formatNum(num: number, decimals: number): string {
  const fixed = Number(num.toFixed(decimals));
  return fixed.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}