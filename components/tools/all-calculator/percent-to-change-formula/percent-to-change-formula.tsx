"use client";

import React, { useMemo, useState } from "react";
import "./percent-to-change-formula.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

export default function PercentToChangeFormulaCalculator() {
  const [originalRaw, setOriginalRaw] = useState<string>("200");
  const [newRaw, setNewRaw] = useState<string>("250");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calc = useMemo(() => {
    if (originalRaw.trim() === "" || newRaw.trim() === "") {
      return {
        error: "Please enter both an Original Value and a New Value.",
        numericalDiff: null,
        percentChange: null,
        direction: null as "increase" | "decrease" | "no-change" | null,
      };
    }

    const orig = Number(originalRaw);
    const next = Number(newRaw);

    if (!Number.isFinite(orig) || !Number.isFinite(next)) {
      return {
        error: "Please enter valid numbers for Original Value and New Value.",
        numericalDiff: null,
        percentChange: null,
        direction: null,
      };
    }

    if (orig === 0) {
      return {
        error:
          "Percentage change is undefined when the Original Value is zero because division by zero is not possible.",
        numericalDiff: next - orig,
        percentChange: null,
        direction: null,
      };
    }

    const numericalDiff = next - orig;
    const percentChange = (numericalDiff / orig) * 100;
    const direction =
      percentChange > 0 ? "increase" : percentChange < 0 ? "decrease" : "no-change";

    return {
      error: null,
      numericalDiff,
      percentChange,
      direction,
    };
  }, [originalRaw, newRaw]);

  const handleCopy = async () => {
    if (calc.percentChange === null) return;
    const sign = calc.percentChange > 0 ? "+" : "";
    const text = `${sign}${formatDec(calc.percentChange, 4)}%`;
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
    setOriginalRaw("");
    setNewRaw("");
    setCopied(false);
  };

  const directionLabel =
    calc.direction === "increase"
      ? "Increase"
      : calc.direction === "decrease"
      ? "Decrease"
      : calc.direction === "no-change"
      ? "No Change"
      : "—";

  return (
    <div className="percentchange1-root">
      <div className="percentchange1-sheet">
        <header className="percentchange1-header">
          <span className="percentchange1-badge">Financial &amp; Metric Change</span>
          <h1 className="percentchange1-title">Percent to Change Formula</h1>
          <p className="percentchange1-subtitle">
            Calculate percentage change from an original value to a new value using ((New Value − Original Value) ÷ Original Value) × 100.
          </p>
        </header>

        <div className="percentchange1-grid">
          <section className="percentchange1-card" aria-label="Original and new value inputs">
            <div className="percentchange1-field">
              <label htmlFor="percentchange1-orig" className="percentchange1-label">
                Original Value
              </label>
              <input
                id="percentchange1-orig"
                type="number"
                step="any"
                className="percentchange1-input"
                value={originalRaw}
                onChange={(e) => setOriginalRaw(e.target.value)}
                placeholder="e.g., 200"
              />
            </div>

            <div className="percentchange1-field">
              <label htmlFor="percentchange1-new" className="percentchange1-label">
                New Value
              </label>
              <input
                id="percentchange1-new"
                type="number"
                step="any"
                className="percentchange1-input"
                value={newRaw}
                onChange={(e) => setNewRaw(e.target.value)}
                placeholder="e.g., 250"
              />
            </div>

            {calc.error && (
              <div className="percentchange1-error" role="alert">
                {calc.error}
              </div>
            )}

            <div className="percentchange1-actions">
              <button
                type="button"
                className="percentchange1-btn-red"
                onClick={handleCopy}
                disabled={calc.percentChange === null}
              >
                {copied ? "Copied!" : "Copy Result"}
              </button>
              <button
                type="button"
                className="percentchange1-btn-outline"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </section>

          <section className="percentchange1-card percentchange1-summary" aria-label="Percentage change output">
            <div className="percentchange1-top-meta">
              <span className="percentchange1-meta-label">Percentage Change</span>
              <span className="percentchange1-dir-badge">{directionLabel}</span>
            </div>

            {calc.percentChange !== null && calc.numericalDiff !== null ? (
              <>
                <div className="percentchange1-big-val">
                  {calc.percentChange > 0 ? "+" : ""}
                  {formatDec(calc.percentChange, 4)}%
                </div>
                <div className="percentchange1-diff-line">
                  Numerical Difference (New − Original):{" "}
                  <strong>
                    {calc.numericalDiff > 0 ? "+" : ""}
                    {formatDec(calc.numericalDiff, 4)}
                  </strong>
                </div>

                <div className="percentchange1-formula-box">
                  <div className="percentchange1-formula-title">Formula &amp; Calculation Steps</div>
                  <p className="percentchange1-formula-text">
                    Percentage Change = ((New Value − Original Value) ÷ Original Value) × 100
                  </p>
                  <p className="percentchange1-step-text">
                    Step 1: {newRaw} − {originalRaw} = {formatDec(calc.numericalDiff, 4)}
                  </p>
                  <p className="percentchange1-step-text">
                    Step 2: ({formatDec(calc.numericalDiff, 4)} ÷ {originalRaw}) × 100 ={" "}
                    {formatDec(calc.percentChange, 4)}%
                  </p>
                </div>
              </>
            ) : (
              <div className="percentchange1-empty">
                Enter a non-zero Original Value and a New Value to view percentage change.
              </div>
            )}
          </section>
        </div>

        <article className="percentchange1-article">
          <h2 className="percentchange1-h2">Reading Positive, Negative, and Zero Results</h2>
          <p className="percentchange1-p">
            A <strong>positive</strong> percentage change indicates an <strong>increase</strong> from the original value to the new value. A <strong>negative</strong> percentage change indicates a <strong>decrease</strong>. A result of <strong>0%</strong> means there was <strong>no change</strong>. When the original value is zero, percentage change is undefined.
          </p>
        </article>
        <RelatedCalculatorLinks currentSlug="percent-to-change-formula" />

        <section className="percentchange1-faq" aria-label="Frequently asked questions">
          <h2 className="percentchange1-h2">Frequently Asked Questions</h2>
          <div className="percentchange1-faq-list">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.question} className="percentchange1-faq-item">
                  <button
                    type="button"
                    className="percentchange1-faq-btn"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <div className="percentchange1-faq-body">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function formatDec(val: number, maxDec: number): string {
  const n = Number(val.toFixed(maxDec));
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDec,
  });
}