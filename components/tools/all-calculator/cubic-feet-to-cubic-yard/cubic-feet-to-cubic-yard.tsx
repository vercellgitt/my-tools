"use client";

import React, { useMemo, useState } from "react";
import "./cubic-feet-to-cubic-yard.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type ConversionDirection = "ft3-to-yd3" | "yd3-to-ft3";

export default function CubicFeetToCubicYardCalculator() {
  const [rawValue, setRawValue] = useState<string>("27");
  const [direction, setDirection] = useState<ConversionDirection>("ft3-to-yd3");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const calculation = useMemo(() => {
    const trimmed = rawValue.trim();
    if (trimmed === "") {
      return {
        error: "Please enter a numerical volume value to convert.",
        cubicFeet: null,
        cubicYards: null,
        primaryResult: null,
        primaryUnit: direction === "ft3-to-yd3" ? "cubic yards (yd³)" : "cubic feet (ft³)",
        formulaText:
          direction === "ft3-to-yd3"
            ? "Cubic Yards = Cubic Feet ÷ 27"
            : "Cubic Feet = Cubic Yards × 27",
        stepsText: "",
      };
    }

    const numeric = Number(trimmed);
    if (!Number.isFinite(numeric)) {
      return {
        error: "Please enter a valid number.",
        cubicFeet: null,
        cubicYards: null,
        primaryResult: null,
        primaryUnit: direction === "ft3-to-yd3" ? "cubic yards (yd³)" : "cubic feet (ft³)",
        formulaText:
          direction === "ft3-to-yd3"
            ? "Cubic Yards = Cubic Feet ÷ 27"
            : "Cubic Feet = Cubic Yards × 27",
        stepsText: "",
      };
    }

    if (numeric < 0) {
      return {
        error: "Volume cannot be negative. Enter zero or a positive number.",
        cubicFeet: null,
        cubicYards: null,
        primaryResult: null,
        primaryUnit: direction === "ft3-to-yd3" ? "cubic yards (yd³)" : "cubic feet (ft³)",
        formulaText:
          direction === "ft3-to-yd3"
            ? "Cubic Yards = Cubic Feet ÷ 27"
            : "Cubic Feet = Cubic Yards × 27",
        stepsText: "",
      };
    }

    if (direction === "ft3-to-yd3") {
      const cubicFeet = numeric;
      const cubicYards = cubicFeet / 27;
      return {
        error: null,
        cubicFeet,
        cubicYards,
        primaryResult: cubicYards,
        primaryUnit: "yd³",
        formulaText: "Cubic Yards = Cubic Feet ÷ 27",
        stepsText: `${formatNumber(cubicFeet, 6)} ft³ ÷ 27 = ${formatNumber(cubicYards, 6)} yd³`,
      };
    } else {
      const cubicYards = numeric;
      const cubicFeet = cubicYards * 27;
      return {
        error: null,
        cubicFeet,
        cubicYards,
        primaryResult: cubicFeet,
        primaryUnit: "ft³",
        formulaText: "Cubic Feet = Cubic Yards × 27",
        stepsText: `${formatNumber(cubicYards, 6)} yd³ × 27 = ${formatNumber(cubicFeet, 6)} ft³`,
      };
    }
  }, [rawValue, direction]);

  const secondaryUnits = useMemo(() => {
    if (calculation.cubicFeet === null) return null;
    const ft3 = calculation.cubicFeet;
    const cubicInches = ft3 * 1728; // 12^3
    const cubicMeters = ft3 * 0.028316846592;
    const liters = cubicMeters * 1000;
    return {
      cubicInches,
      cubicMeters,
      liters,
    };
  }, [calculation.cubicFeet]);

  const handleCopy = async () => {
    if (calculation.primaryResult === null) return;
    const textToCopy = `${formatNumber(calculation.primaryResult, 6)} ${calculation.primaryUnit}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setRawValue("");
    setDirection("ft3-to-yd3");
    setCopied(false);
  };

  return (
    <div className="cftyard1-root">
      <div className="cftyard1-shell">
        <header className="cftyard1-header">
          <span className="cftyard1-badge">Volume Unit Converter</span>
          <h1 className="cftyard1-title">Cubic Feet to Cubic Yard Calculator</h1>
          <p className="cftyard1-subtitle">
            Convert between cubic feet (ft³) and cubic yards (yd³) with instant step-by-step math and equivalent metric and imperial volume units.
          </p>
        </header>

        <div className="cftyard1-grid">
          <section className="cftyard1-panel" aria-label="Conversion inputs">
            <div className="cftyard1-field">
              <label htmlFor="cftyard1-direction" className="cftyard1-label">
                Conversion Direction
              </label>
              <select
                id="cftyard1-direction"
                className="cftyard1-select"
                value={direction}
                onChange={(e) => setDirection(e.target.value as ConversionDirection)}
              >
                <option value="ft3-to-yd3">Cubic Feet (ft³) to Cubic Yards (yd³)</option>
                <option value="yd3-to-ft3">Cubic Yards (yd³) to Cubic Feet (ft³)</option>
              </select>
            </div>

            <div className="cftyard1-field">
              <label htmlFor="cftyard1-input" className="cftyard1-label">
                {direction === "ft3-to-yd3" ? "Enter Cubic Feet (ft³)" : "Enter Cubic Yards (yd³)"}
              </label>
              <input
                id="cftyard1-input"
                type="number"
                step="any"
                min="0"
                className="cftyard1-input"
                value={rawValue}
                onChange={(e) => setRawValue(e.target.value)}
                placeholder={direction === "ft3-to-yd3" ? "e.g., 27" : "e.g., 1"}
              />
            </div>

            {calculation.error && (
              <div className="cftyard1-error" role="alert">
                {calculation.error}
              </div>
            )}

            <div className="cftyard1-actions">
              <button
                type="button"
                className="cftyard1-btn cftyard1-btn-primary"
                onClick={handleCopy}
                disabled={calculation.primaryResult === null}
              >
                {copied ? "Copied Result" : "Copy Result"}
              </button>
              <button
                type="button"
                className="cftyard1-btn cftyard1-btn-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>

            <div className="cftyard1-formula-box">
              <div className="cftyard1-formula-heading">Conversion Formula &amp; Steps</div>
              <p className="cftyard1-formula-line">1 cubic yard = 27 cubic feet (3 ft × 3 ft × 3 ft)</p>
              <p className="cftyard1-formula-line">{calculation.formulaText}</p>
              {calculation.stepsText && (
                <p className="cftyard1-step-line">Step: {calculation.stepsText}</p>
              )}
            </div>
          </section>

          <section className="cftyard1-panel cftyard1-result-panel" aria-label="Conversion output">
            <div className="cftyard1-result-label">Converted Volume</div>
            {calculation.primaryResult !== null ? (
              <>
                <div className="cftyard1-result-value">
                  {formatNumber(calculation.primaryResult, 6)}{" "}
                  <span className="cftyard1-result-unit">{calculation.primaryUnit}</span>
                </div>
                <div className="cftyard1-pair-summary">
                  <span>
                    Cubic Feet: <strong>{formatNumber(calculation.cubicFeet ?? 0, 6)} ft³</strong>
                  </span>
                  <span>
                    Cubic Yards: <strong>{formatNumber(calculation.cubicYards ?? 0, 6)} yd³</strong>
                  </span>
                </div>
              </>
            ) : (
              <div className="cftyard1-result-placeholder">Enter a valid value to view result</div>
            )}

            {secondaryUnits && (
              <div className="cftyard1-units-list">
                <div className="cftyard1-units-title">Additional Volume Equivalents</div>
                <div className="cftyard1-unit-row">
                  <span>Cubic Inches (in³)</span>
                  <strong>{formatNumber(secondaryUnits.cubicInches, 4)} in³</strong>
                </div>
                <div className="cftyard1-unit-row">
                  <span>Cubic Meters (m³)</span>
                  <strong>{formatNumber(secondaryUnits.cubicMeters, 6)} m³</strong>
                </div>
                <div className="cftyard1-unit-row">
                  <span>Liters (L)</span>
                  <strong>{formatNumber(secondaryUnits.liters, 4)} L</strong>
                </div>
              </div>
            )}
          </section>
        </div>

        <article className="cftyard1-guide">
          <h2 className="cftyard1-guide-heading">How to Use This Cubic Feet to Cubic Yard Calculator</h2>
          <p className="cftyard1-guide-text">
            This cubic feet to cubic yard calculator helps you estimate bulk materials such as topsoil, gravel, mulch, concrete, and fill dirt quickly. Select whether you want to convert from cubic feet to cubic yards or from cubic yards to cubic feet, type your measurement, and review the automatic result along with equivalent values in cubic inches, cubic meters, and liters.
          </p>
          <h3 className="cftyard1-subheading">Understanding the 27-to-1 Cubic Ratio</h3>
          <p className="cftyard1-guide-text">
            Because one yard equals three feet and volume scales across three dimensions (length, width, and height), one cubic yard equals 3 × 3 × 3 = 27 cubic feet. Dividing cubic feet by 27 gives cubic yards, while multiplying cubic yards by 27 gives cubic feet.
          </p>
        </article>

        <RelatedCalculatorLinks currentSlug="cubic-feet-to-cubic-yard" />

        <section className="cftyard1-faq" aria-label="Frequently asked questions">
          <h2 className="cftyard1-faq-heading">Frequently Asked Questions</h2>
          <div className="cftyard1-faq-list">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={item.question} className="cftyard1-faq-item">
                  <button
                    type="button"
                    className="cftyard1-faq-trigger"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span className="cftyard1-faq-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <div className="cftyard1-faq-answer">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function formatNumber(value: number, maxDecimals: number): string {
  if (!Number.isFinite(value)) return "0";
  const rounded = Number(value.toFixed(maxDecimals));
  return rounded.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}