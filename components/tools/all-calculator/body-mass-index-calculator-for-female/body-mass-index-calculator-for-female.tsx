"use client";

import React, { useMemo, useState } from "react";
import "./body-mass-index-calculator-for-female.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type UnitSystem = "metric" | "imperial";

interface BmiCategoryInfo {
  label: string;
  rangeText: string;
  markerPercent: number;
  interpretation: string;
}

export default function BodyMassIndexCalculatorForFemale() {
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [weightKg, setWeightKg] = useState<string>("62");
  const [heightCm, setHeightCm] = useState<string>("165");
  const [weightLb, setWeightLb] = useState<string>("137");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("5");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const result = useMemo(() => {
    let weightInKg = 0;
    let heightInMeters = 0;

    if (unitSystem === "metric") {
      if (weightKg.trim() === "" || heightCm.trim() === "") {
        return { error: "Please enter both weight in kilograms and height in centimeters.", bmi: null, category: null, weightInKg: null, heightInMeters: null };
      }
      const w = Number(weightKg);
      const h = Number(heightCm);
      if (!Number.isFinite(w) || !Number.isFinite(h)) {
        return { error: "Please enter valid numeric values for weight and height.", bmi: null, category: null, weightInKg: null, heightInMeters: null };
      }
      if (w <= 0 || h <= 0) {
        return { error: "Weight and height must be greater than zero.", bmi: null, category: null, weightInKg: null, heightInMeters: null };
      }
      weightInKg = w;
      heightInMeters = h / 100;
    } else {
      if (weightLb.trim() === "" || (heightFt.trim() === "" && heightIn.trim() === "")) {
        return { error: "Please enter weight in pounds and height in feet and inches.", bmi: null, category: null, weightInKg: null, heightInMeters: null };
      }
      const wLb = Number(weightLb);
      const ft = heightFt.trim() === "" ? 0 : Number(heightFt);
      const inch = heightIn.trim() === "" ? 0 : Number(heightIn);
      if (!Number.isFinite(wLb) || !Number.isFinite(ft) || !Number.isFinite(inch)) {
        return { error: "Please enter valid numbers for weight and height.", bmi: null, category: null, weightInKg: null, heightInMeters: null };
      }
      const totalInches = ft * 12 + inch;
      if (wLb <= 0 || totalInches <= 0) {
        return { error: "Weight and total height must be greater than zero.", bmi: null, category: null, weightInKg: null, heightInMeters: null };
      }
      weightInKg = wLb * 0.45359237;
      heightInMeters = totalInches * 0.0254;
    }

    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const category = getAdultBmiCategory(bmi);

    return {
      error: null,
      bmi,
      category,
      weightInKg,
      heightInMeters,
    };
  }, [unitSystem, weightKg, heightCm, weightLb, heightFt, heightIn]);

  const handleReset = () => {
    setWeightKg("");
    setHeightCm("");
    setWeightLb("");
    setHeightFt("");
    setHeightIn("");
  };

  return (
    <div className="femalebmi1-root">
      <div className="femalebmi1-shell">
        <header className="femalebmi1-header">
          <span className="femalebmi1-tag">Adult Women Health Screening Tool</span>
          <h1 className="femalebmi1-title">Body Mass Index Calculator for Female</h1>
          <p className="femalebmi1-subtitle">
            Calculate adult Body Mass Index (BMI) in metric or imperial units with clear context on healthy adult ranges and what BMI can and cannot tell you.
          </p>
        </header>

        <div className="femalebmi1-layout">
          <section className="femalebmi1-card" aria-label="BMI inputs">
            <div className="femalebmi1-toggle-group" role="group" aria-label="Measurement system">
              <button
                type="button"
                className={`femalebmi1-toggle-btn ${unitSystem === "metric" ? "femalebmi1-toggle-active" : ""}`}
                onClick={() => setUnitSystem("metric")}
              >
                Metric (kg, cm)
              </button>
              <button
                type="button"
                className={`femalebmi1-toggle-btn ${unitSystem === "imperial" ? "femalebmi1-toggle-active" : ""}`}
                onClick={() => setUnitSystem("imperial")}
              >
                Imperial (lb, ft/in)
              </button>
            </div>

            {unitSystem === "metric" ? (
              <div className="femalebmi1-fields">
                <div className="femalebmi1-field">
                  <label htmlFor="femalebmi1-weight-kg" className="femalebmi1-label">
                    Weight (kg)
                  </label>
                  <input
                    id="femalebmi1-weight-kg"
                    type="number"
                    step="any"
                    min="0"
                    className="femalebmi1-input"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="e.g., 62"
                  />
                </div>
                <div className="femalebmi1-field">
                  <label htmlFor="femalebmi1-height-cm" className="femalebmi1-label">
                    Height (cm)
                  </label>
                  <input
                    id="femalebmi1-height-cm"
                    type="number"
                    step="any"
                    min="0"
                    className="femalebmi1-input"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="e.g., 165"
                  />
                </div>
              </div>
            ) : (
              <div className="femalebmi1-fields">
                <div className="femalebmi1-field">
                  <label htmlFor="femalebmi1-weight-lb" className="femalebmi1-label">
                    Weight (pounds)
                  </label>
                  <input
                    id="femalebmi1-weight-lb"
                    type="number"
                    step="any"
                    min="0"
                    className="femalebmi1-input"
                    value={weightLb}
                    onChange={(e) => setWeightLb(e.target.value)}
                    placeholder="e.g., 137"
                  />
                </div>
                <div className="femalebmi1-height-row">
                  <div className="femalebmi1-field">
                    <label htmlFor="femalebmi1-height-ft" className="femalebmi1-label">
                      Height (feet)
                    </label>
                    <input
                      id="femalebmi1-height-ft"
                      type="number"
                      step="1"
                      min="0"
                      className="femalebmi1-input"
                      value={heightFt}
                      onChange={(e) => setHeightFt(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div className="femalebmi1-field">
                    <label htmlFor="femalebmi1-height-in" className="femalebmi1-label">
                      Height (inches)
                    </label>
                    <input
                      id="femalebmi1-height-in"
                      type="number"
                      step="any"
                      min="0"
                      className="femalebmi1-input"
                      value={heightIn}
                      onChange={(e) => setHeightIn(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            )}

            {result.error && (
              <div className="femalebmi1-error" role="alert">
                {result.error}
              </div>
            )}

            <div className="femalebmi1-actions">
              <button
                type="button"
                className="femalebmi1-reset-btn"
                onClick={handleReset}
              >
                Reset Inputs
              </button>
            </div>

            <div className="femalebmi1-formula-card">
              <div className="femalebmi1-formula-title">BMI Formula</div>
              <p className="femalebmi1-formula-eq">
                BMI = Weight in kilograms ÷ (Height in meters × Height in meters)
              </p>
              <p className="femalebmi1-formula-note">
                Standard adult BMI thresholds (Underweight &lt; 18.5, Normal weight 18.5–24.9, Overweight 25.0–29.9, Obesity ≥ 30.0) are the same for women and men aged 20 and older.
              </p>
            </div>
          </section>

          <section className="femalebmi1-card femalebmi1-output-card" aria-label="BMI results">
            {result.bmi !== null && result.category ? (
              <>
                <div className="femalebmi1-score-header">
                  <span className="femalebmi1-score-label">Calculated BMI</span>
                  <span className="femalebmi1-category-pill">{result.category.label}</span>
                </div>
                <div className="femalebmi1-score-value">{result.bmi.toFixed(1)}</div>
                <p className="femalebmi1-healthy-range">
                  Healthy Adult BMI Range: <strong>18.5 – 24.9</strong>
                </p>

                <div className="femalebmi1-scale-wrap" aria-label="BMI visual indicator">
                  <div className="femalebmi1-scale-bar">
                    <div
                      className="femalebmi1-marker"
                      style={{ left: `${result.category.markerPercent}%` }}
                      title={`BMI ${result.bmi.toFixed(1)}`}
                    />
                  </div>
                  <div className="femalebmi1-scale-labels">
                    <span>&lt;18.5</span>
                    <span>18.5–24.9</span>
                    <span>25.0–29.9</span>
                    <span>30.0+</span>
                  </div>
                </div>

                <p className="femalebmi1-interpretation">{result.category.interpretation}</p>

                <div className="femalebmi1-categories-table">
                  <div className="femalebmi1-cat-row">
                    <span>Underweight</span>
                    <span>Below 18.5</span>
                  </div>
                  <div className="femalebmi1-cat-row">
                    <span>Normal weight</span>
                    <span>18.5 – 24.9</span>
                  </div>
                  <div className="femalebmi1-cat-row">
                    <span>Overweight</span>
                    <span>25.0 – 29.9</span>
                  </div>
                  <div className="femalebmi1-cat-row">
                    <span>Obesity</span>
                    <span>30.0 or above</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="femalebmi1-empty">
                Enter valid weight and height values to calculate BMI.
              </div>
            )}
          </section>
        </div>

        <article className="femalebmi1-guide">
          <h2 className="femalebmi1-guide-title">How BMI Works for Adult Women</h2>
          <p className="femalebmi1-guide-text">
            Body Mass Index (BMI) compares a person&apos;s weight to their height squared. Although this calculator is tailored with helpful guidance for women, the standard adult BMI formula and category cutoffs are identical for women and men. A healthy adult BMI range is generally 18.5 to 24.9.
          </p>
          <p className="femalebmi1-guide-text">
            BMI is a general screening tool, not a medical diagnosis, and BMI alone does not determine an individual&apos;s overall health. Factors such as muscle mass, bone density, age, fitness level, ethnicity, and metabolic markers also matter. Furthermore, adult BMI categories apply to adults aged 20 and older and should not be used for children or teenagers, who require age- and sex-specific growth percentiles.
          </p>
        </article>

        <RelatedCalculatorLinks currentSlug="body-mass-index-calculator-for-female" />

        <section className="femalebmi1-faq" aria-label="Frequently asked questions">
          <h2 className="femalebmi1-faq-title">Frequently Asked Questions</h2>
          <div className="femalebmi1-faq-list">
            {faqItems.map((item, idx) => {
              const expanded = openFaqIndex === idx;
              return (
                <div key={item.question} className="femalebmi1-faq-item">
                  <button
                    type="button"
                    className="femalebmi1-faq-btn"
                    aria-expanded={expanded}
                    onClick={() => setOpenFaqIndex(expanded ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span className="femalebmi1-faq-sign">{expanded ? "−" : "+"}</span>
                  </button>
                  {expanded && <div className="femalebmi1-faq-body">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function getAdultBmiCategory(bmi: number): BmiCategoryInfo {
  if (bmi < 18.5) {
    const pct = Math.max(4, Math.min(22, (bmi / 18.5) * 22));
    return {
      label: "Underweight",
      rangeText: "Below 18.5",
      markerPercent: pct,
      interpretation:
        "A BMI below 18.5 falls in the adult underweight screening range. Consider discussing nutrition, energy intake, and overall health with a healthcare professional.",
    };
  }
  if (bmi < 25) {
    const pct = 25 + ((bmi - 18.5) / 6.5) * 25;
    return {
      label: "Normal weight",
      rangeText: "18.5 – 24.9",
      markerPercent: pct,
      interpretation:
        "A BMI between 18.5 and 24.9 is within the standard healthy adult weight range. Continuing balanced habits and regular movement supports long-term wellbeing.",
    };
  }
  if (bmi < 30) {
    const pct = 50 + ((bmi - 25) / 5) * 25;
    return {
      label: "Overweight",
      rangeText: "25.0 – 29.9",
      markerPercent: pct,
      interpretation:
        "A BMI from 25.0 to 29.9 falls into the adult overweight category. A healthcare provider can help interpret this alongside body composition, blood pressure, and activity.",
    };
  }
  const pct = Math.min(96, 75 + ((bmi - 30) / 15) * 21);
  return {
    label: "Obesity",
    rangeText: "30.0 or above",
    markerPercent: pct,
    interpretation:
      "A BMI of 30.0 or higher falls into the adult obesity screening range. Speaking with a clinician can provide personalized guidance beyond BMI alone.",
  };
}