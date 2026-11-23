"use client";

import React, { useMemo, useState } from "react";
import "./body-mass-index-calculator-kg-cm.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type SystemMode = "metric" | "imperial";

interface CategoryOutcome {
  name: string;
  range: string;
  summary: string;
  positionPct: number;
}

export default function BodyMassIndexCalculatorKgCm() {
  const [mode, setMode] = useState<SystemMode>("metric");
  const [kgInput, setKgInput] = useState<string>("70");
  const [cmInput, setCmInput] = useState<string>("175");
  const [lbInput, setLbInput] = useState<string>("154");
  const [ftInput, setFtInput] = useState<string>("5");
  const [inInput, setInInput] = useState<string>("9");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const bmiCalc = useMemo(() => {
    let weightKg = 0;
    let heightMeters = 0;

    if (mode === "metric") {
      if (kgInput.trim() === "" || cmInput.trim() === "") {
        return {
          error: "Enter both weight in kilograms (kg) and height in centimeters (cm).",
          bmi: null,
          category: null,
          weightKg: null,
          heightMeters: null,
        };
      }
      const w = Number(kgInput);
      const h = Number(cmInput);
      if (!Number.isFinite(w) || !Number.isFinite(h)) {
        return {
          error: "Please enter valid numeric values for kg and cm.",
          bmi: null,
          category: null,
          weightKg: null,
          heightMeters: null,
        };
      }
      if (w <= 0 || h <= 0) {
        return {
          error: "Weight in kg and height in cm must be greater than zero.",
          bmi: null,
          category: null,
          weightKg: null,
          heightMeters: null,
        };
      }
      weightKg = w;
      heightMeters = h / 100;
    } else {
      if (lbInput.trim() === "" || (ftInput.trim() === "" && inInput.trim() === "")) {
        return {
          error: "Enter weight in pounds and height in feet and inches.",
          bmi: null,
          category: null,
          weightKg: null,
          heightMeters: null,
        };
      }
      const wLb = Number(lbInput);
      const ft = ftInput.trim() === "" ? 0 : Number(ftInput);
      const inch = inInput.trim() === "" ? 0 : Number(inInput);
      if (!Number.isFinite(wLb) || !Number.isFinite(ft) || !Number.isFinite(inch)) {
        return {
          error: "Please enter valid numbers for pounds, feet, and inches.",
          bmi: null,
          category: null,
          weightKg: null,
          heightMeters: null,
        };
      }
      const totalIn = ft * 12 + inch;
      if (wLb <= 0 || totalIn <= 0) {
        return {
          error: "Weight and total height must be greater than zero.",
          bmi: null,
          category: null,
          weightKg: null,
          heightMeters: null,
        };
      }
      weightKg = wLb * 0.45359237;
      heightMeters = totalIn * 0.0254;
    }

    const bmi = weightKg / (heightMeters * heightMeters);
    const category = classifyBmi(bmi);

    return {
      error: null,
      bmi,
      category,
      weightKg,
      heightMeters,
    };
  }, [mode, kgInput, cmInput, lbInput, ftInput, inInput]);

  const handleCopy = async () => {
    if (bmiCalc.bmi === null || !bmiCalc.category) return;
    const text = `BMI: ${bmiCalc.bmi.toFixed(1)} (${bmiCalc.category.name})`;
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
    setKgInput("");
    setCmInput("");
    setLbInput("");
    setFtInput("");
    setInInput("");
    setCopied(false);
  };

  return (
    <div className="bodymass1-root">
      <div className="bodymass1-container">
        <header className="bodymass1-header">
          <span className="bodymass1-badge">Metric Default · kg &amp; cm</span>
          <h1 className="bodymass1-title">body-mass-index-calculator-kg-cm</h1>
          <p className="bodymass1-lead">
            Calculate BMI using kg and cm quickly with this BMI calculator kg cm tool, complete with adult BMI categories, a visual scale, formula steps, and an optional imperial toggle.
          </p>
        </header>

        <div className="bodymass1-grid">
          <section className="bodymass1-card" aria-label="BMI inputs">
            <div className="bodymass1-mode-switch" role="group" aria-label="Measurement units">
              <button
                type="button"
                className={`bodymass1-mode-btn ${mode === "metric" ? "bodymass1-mode-active" : ""}`}
                onClick={() => setMode("metric")}
              >
                Metric (kg / cm)
              </button>
              <button
                type="button"
                className={`bodymass1-mode-btn ${mode === "imperial" ? "bodymass1-mode-active" : ""}`}
                onClick={() => setMode("imperial")}
              >
                Imperial (lb / ft-in)
              </button>
            </div>

            {mode === "metric" ? (
              <div className="bodymass1-fields">
                <div className="bodymass1-field">
                  <label htmlFor="bodymass1-kg" className="bodymass1-label">
                    Weight (kg)
                  </label>
                  <input
                    id="bodymass1-kg"
                    type="number"
                    step="any"
                    min="0"
                    className="bodymass1-input"
                    value={kgInput}
                    onChange={(e) => setKgInput(e.target.value)}
                    placeholder="e.g., 70"
                  />
                </div>
                <div className="bodymass1-field">
                  <label htmlFor="bodymass1-cm" className="bodymass1-label">
                    Height (cm)
                  </label>
                  <input
                    id="bodymass1-cm"
                    type="number"
                    step="any"
                    min="0"
                    className="bodymass1-input"
                    value={cmInput}
                    onChange={(e) => setCmInput(e.target.value)}
                    placeholder="e.g., 175"
                  />
                </div>
              </div>
            ) : (
              <div className="bodymass1-fields">
                <div className="bodymass1-field">
                  <label htmlFor="bodymass1-lb" className="bodymass1-label">
                    Weight (lb)
                  </label>
                  <input
                    id="bodymass1-lb"
                    type="number"
                    step="any"
                    min="0"
                    className="bodymass1-input"
                    value={lbInput}
                    onChange={(e) => setLbInput(e.target.value)}
                    placeholder="e.g., 154"
                  />
                </div>
                <div className="bodymass1-two-col">
                  <div className="bodymass1-field">
                    <label htmlFor="bodymass1-ft" className="bodymass1-label">
                      Height (ft)
                    </label>
                    <input
                      id="bodymass1-ft"
                      type="number"
                      step="1"
                      min="0"
                      className="bodymass1-input"
                      value={ftInput}
                      onChange={(e) => setFtInput(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div className="bodymass1-field">
                    <label htmlFor="bodymass1-in" className="bodymass1-label">
                      Height (in)
                    </label>
                    <input
                      id="bodymass1-in"
                      type="number"
                      step="any"
                      min="0"
                      className="bodymass1-input"
                      value={inInput}
                      onChange={(e) => setInInput(e.target.value)}
                      placeholder="9"
                    />
                  </div>
                </div>
              </div>
            )}

            {bmiCalc.error && (
              <div className="bodymass1-error" role="alert">
                {bmiCalc.error}
              </div>
            )}

            <div className="bodymass1-actions">
              <button
                type="button"
                className="bodymass1-btn-mint"
                onClick={handleCopy}
                disabled={bmiCalc.bmi === null}
              >
                {copied ? "Copied BMI" : "Copy Result"}
              </button>
              <button
                type="button"
                className="bodymass1-btn-reset"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </section>

          <section className="bodymass1-card bodymass1-result-card" aria-label="BMI calculation result">
            {bmiCalc.bmi !== null && bmiCalc.category && bmiCalc.heightMeters !== null && bmiCalc.weightKg !== null ? (
              <>
                <div className="bodymass1-result-top">
                  <span className="bodymass1-result-eyebrow">Your BMI Score</span>
                  <span className="bodymass1-cat-badge">{bmiCalc.category.name}</span>
                </div>

                <div className="bodymass1-bmi-number">{bmiCalc.bmi.toFixed(1)}</div>
                <div className="bodymass1-healthy-text">
                  Healthy Adult BMI Range: <strong>18.5–24.9</strong>
                </div>

                <div className="bodymass1-scale" aria-label="BMI category scale">
                  <div className="bodymass1-scale-track">
                    <div
                      className="bodymass1-scale-pin"
                      style={{ left: `${bmiCalc.category.positionPct}%` }}
                    />
                  </div>
                  <div className="bodymass1-scale-ticks">
                    <span>Underweight (&lt;18.5)</span>
                    <span>Normal (18.5–24.9)</span>
                    <span>Overweight (25.0–29.9)</span>
                    <span>Obesity (30.0+)</span>
                  </div>
                </div>

                <p className="bodymass1-interp">{bmiCalc.category.summary}</p>

                <div className="bodymass1-steps">
                  <div>
                    <strong>Formula:</strong> BMI = Weight (kg) / [Height (m) × Height (m)]
                  </div>
                  <div>
                    <strong>Steps:</strong> {bmiCalc.weightKg.toFixed(2)} kg ÷ (
                    {bmiCalc.heightMeters.toFixed(2)} m × {bmiCalc.heightMeters.toFixed(2)} m) ={" "}
                    <strong>{bmiCalc.bmi.toFixed(2)}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="bodymass1-placeholder">
                Enter valid weight and height values to view your BMI score and scale position.
              </div>
            )}
          </section>
        </div>

        <article className="bodymass1-article">
          <h2 className="bodymass1-h2">BMI Calculator with Kilograms and Centimeters</h2>
          <p className="bodymass1-p">
            A BMI calculator with kilograms and centimeters converts height in centimeters into meters (dividing cm by 100) and divides weight in kilograms by height in meters squared. For example, someone weighing 70 kg at 175 cm (1.75 m) has a BMI of 70 ÷ (1.75 × 1.75) = 22.9.
          </p>
          <p className="bodymass1-p">
            Adult BMI categories—Underweight (Below 18.5), Normal weight (18.5–24.9), Overweight (25.0–29.9), and Obesity (30.0 or above)—apply to adults aged 20 and older. Children and teenagers require age- and sex-specific BMI percentile charts rather than adult thresholds. BMI is a screening tool rather than a medical diagnosis.
          </p>
        </article>
        <RelatedCalculatorLinks currentSlug="body-mass-index-calculator-kg-cm" />

        <section className="bodymass1-faq" aria-label="Frequently asked questions">
          <h2 className="bodymass1-h2">Frequently Asked Questions</h2>
          <div className="bodymass1-faq-list">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={item.question} className="bodymass1-faq-item">
                  <button
                    type="button"
                    className="bodymass1-faq-btn"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <div className="bodymass1-faq-ans">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function classifyBmi(bmi: number): CategoryOutcome {
  if (bmi < 18.5) {
    const pct = Math.max(4, Math.min(22, (bmi / 18.5) * 22));
    return {
      name: "Underweight",
      range: "Below 18.5",
      summary:
        "Below the 18.5–24.9 healthy adult range. Consider consulting a healthcare professional for personalized screening context.",
      positionPct: pct,
    };
  }
  if (bmi < 25) {
    const pct = 25 + ((bmi - 18.5) / 6.5) * 25;
    return {
      name: "Normal weight",
      range: "18.5–24.9",
      summary:
        "Within the healthy adult BMI range of 18.5–24.9. Remember that BMI is a general screening metric rather than a complete health assessment.",
      positionPct: pct,
    };
  }
  if (bmi < 30) {
    const pct = 50 + ((bmi - 25) / 5) * 25;
    return {
      name: "Overweight",
      range: "25.0–29.9",
      summary:
        "Falls in the 25.0–29.9 adult overweight range. A clinician can interpret BMI alongside muscle mass, waist measures, and lab markers.",
      positionPct: pct,
    };
  }
  const pct = Math.min(96, 75 + ((bmi - 30) / 15) * 21);
  return {
    name: "Obesity",
    range: "30.0 or above",
    summary:
      "At or above 30.0 in the adult obesity screening range. Discussing results with a qualified healthcare provider helps put the number in context.",
    positionPct: pct,
  };
}