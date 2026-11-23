// Add the calculator React component here.
"use client";

import React, { useMemo, useState } from "react";
import "./volume-density-mass-calculator.css";
import { volumeDensityMassFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type CalcMode = "mass" | "density" | "volume";
type MassUnit = "kg" | "g" | "mg" | "lb" | "oz";
type DensityUnit = "kg/m³" | "g/cm³" | "g/mL" | "lb/ft³";
type VolumeUnit = "m³" | "cm³" | "mm³" | "L" | "mL" | "ft³";

const MASS_TO_KG: Record<MassUnit, number> = {
  kg: 1,
  g: 0.001,
  mg: 1e-6,
  lb: 0.45359237,
  oz: 0.028349523125,
};

const DENSITY_TO_KG_M3: Record<DensityUnit, number> = {
  "kg/m³": 1,
  "g/cm³": 1000,
  "g/mL": 1000,
  "lb/ft³": 16.01846337396,
};

const VOLUME_TO_M3: Record<VolumeUnit, number> = {
  "m³": 1,
  "cm³": 1e-6,
  "mm³": 1e-9,
  L: 0.001,
  mL: 1e-6,
  "ft³": 0.028316846592,
};

function formatSci(num: number): string {
  if (!Number.isFinite(num)) return "0";
  const abs = Math.abs(num);
  if (abs === 0) return "0";
  if (abs >= 1e6 || abs < 1e-4) {
    return num.toExponential(4);
  }
  return Number(num.toPrecision(6)).toString();
}

export default function VolumeDensityMassCalculator() {
  const [mode, setMode] = useState<CalcMode>("mass");
  const [massInput, setMassInput] = useState<string>("500");
  const [massUnit, setMassUnit] = useState<MassUnit>("g");
  const [densityInput, setDensityInput] = useState<string>("2.7");
  const [densityUnit, setDensityUnit] = useState<DensityUnit>("g/cm³");
  const [volumeInput, setVolumeInput] = useState<string>("100");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("cm³");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calculation = useMemo(() => {
    const parsePositive = (val: string) => {
      if (val.trim() === "") return { valid: false, message: "Please enter a numeric value." };
      const num = Number(val);
      if (!Number.isFinite(num) || num <= 0) {
        return { valid: false, message: "Value must be greater than zero." };
      }
      return { valid: true, value: num };
    };

    if (mode === "mass") {
      const dCheck = parsePositive(densityInput);
      const vCheck = parsePositive(volumeInput);
      if (!dCheck.valid || !vCheck.valid) {
        return {
          error: !dCheck.valid ? `Density: ${dCheck.message}` : `Volume: ${vCheck.message}`,
        };
      }
      const densityKgM3 = dCheck.value! * DENSITY_TO_KG_M3[densityUnit];
      const volumeM3 = vCheck.value! * VOLUME_TO_M3[volumeUnit];
      const massKg = densityKgM3 * volumeM3;
      const outputValue = massKg / MASS_TO_KG[massUnit];

      const conversions = (Object.keys(MASS_TO_KG) as MassUnit[]).map((u) => ({
        unit: u,
        val: formatSci(massKg / MASS_TO_KG[u]),
      }));

      return {
        error: null,
        resultLabel: `Calculated Mass (${massUnit})`,
        formattedResult: `${formatSci(outputValue)} ${massUnit}`,
        formulaText: "Mass = Density × Volume",
        steps: [
          `Convert Density (${dCheck.value} ${densityUnit}) to SI: ${formatSci(densityKgM3)} kg/m³.`,
          `Convert Volume (${vCheck.value} ${volumeUnit}) to SI: ${formatSci(volumeM3)} m³.`,
          `Multiply Mass (kg) = ${formatSci(densityKgM3)} × ${formatSci(volumeM3)} = ${formatSci(massKg)} kg.`,
          `Convert ${formatSci(massKg)} kg to ${massUnit}: ${formatSci(outputValue)} ${massUnit}.`,
        ],
        conversions,
      };
    }

    if (mode === "density") {
      const mCheck = parsePositive(massInput);
      const vCheck = parsePositive(volumeInput);
      if (!mCheck.valid || !vCheck.valid) {
        return {
          error: !mCheck.valid ? `Mass: ${mCheck.message}` : `Volume: ${vCheck.message}`,
        };
      }
      const massKg = mCheck.value! * MASS_TO_KG[massUnit];
      const volumeM3 = vCheck.value! * VOLUME_TO_M3[volumeUnit];
      const densityKgM3 = massKg / volumeM3;
      const outputValue = densityKgM3 / DENSITY_TO_KG_M3[densityUnit];

      const conversions = (Object.keys(DENSITY_TO_KG_M3) as DensityUnit[]).map((u) => ({
        unit: u,
        val: formatSci(densityKgM3 / DENSITY_TO_KG_M3[u]),
      }));

      return {
        error: null,
        resultLabel: `Calculated Density (${densityUnit})`,
        formattedResult: `${formatSci(outputValue)} ${densityUnit}`,
        formulaText: "Density = Mass ÷ Volume",
        steps: [
          `Convert Mass (${mCheck.value} ${massUnit}) to SI: ${formatSci(massKg)} kg.`,
          `Convert Volume (${vCheck.value} ${volumeUnit}) to SI: ${formatSci(volumeM3)} m³.`,
          `Divide Density (kg/m³) = ${formatSci(massKg)} ÷ ${formatSci(volumeM3)} = ${formatSci(densityKgM3)} kg/m³.`,
          `Convert ${formatSci(densityKgM3)} kg/m³ to ${densityUnit}: ${formatSci(outputValue)} ${densityUnit}.`,
        ],
        conversions,
      };
    }

    const mCheck = parsePositive(massInput);
    const dCheck = parsePositive(densityInput);
    if (!mCheck.valid || !dCheck.valid) {
      return {
        error: !mCheck.valid ? `Mass: ${mCheck.message}` : `Density: ${dCheck.message}`,
      };
    }
    const massKg = mCheck.value! * MASS_TO_KG[massUnit];
    const densityKgM3 = dCheck.value! * DENSITY_TO_KG_M3[densityUnit];
    const volumeM3 = massKg / densityKgM3;
    const outputValue = volumeM3 / VOLUME_TO_M3[volumeUnit];

    const conversions = (Object.keys(VOLUME_TO_M3) as VolumeUnit[]).map((u) => ({
      unit: u,
      val: formatSci(volumeM3 / VOLUME_TO_M3[u]),
    }));

    return {
      error: null,
      resultLabel: `Calculated Volume (${volumeUnit})`,
      formattedResult: `${formatSci(outputValue)} ${volumeUnit}`,
      formulaText: "Volume = Mass ÷ Density",
      steps: [
        `Convert Mass (${mCheck.value} ${massUnit}) to SI: ${formatSci(massKg)} kg.`,
        `Convert Density (${dCheck.value} ${densityUnit}) to SI: ${formatSci(densityKgM3)} kg/m³.`,
        `Divide Volume (m³) = ${formatSci(massKg)} ÷ ${formatSci(densityKgM3)} = ${formatSci(volumeM3)} m³.`,
        `Convert ${formatSci(volumeM3)} m³ to ${volumeUnit}: ${formatSci(outputValue)} ${volumeUnit}.`,
      ],
      conversions,
    };
  }, [mode, massInput, massUnit, densityInput, densityUnit, volumeInput, volumeUnit]);

  const handleReset = () => {
    setMassInput("500");
    setMassUnit("g");
    setDensityInput("2.7");
    setDensityUnit("g/cm³");
    setVolumeInput("100");
    setVolumeUnit("cm³");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (calculation.error || !calculation.formattedResult) return;
    const textToCopy = `${calculation.resultLabel}: ${calculation.formattedResult} (${calculation.formulaText})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="volumedensityShell" aria-label="Volume Density Mass Calculator">
      <header className="volumedensityHero">
        <h1 className="volumedensityTitle">Volume Density Mass Calculator</h1>
        <p className="volumedensityIntro">
          Compute mass, density, or volume automatically using our scientific Volume Density Mass
          Calculator. Enter any two known values, switch units across metric and imperial systems,
          and inspect step-by-step formula calculations in real time.
        </p>
      </header>

      <div className="volumedensityTabs" role="tablist" aria-label="Calculation mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "mass"}
          className={`volumedensityTabBtn ${mode === "mass" ? "volumedensityTabActive" : ""}`}
          onClick={() => setMode("mass")}
        >
          Calculate Mass (m = ρ × V)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "density"}
          className={`volumedensityTabBtn ${mode === "density" ? "volumedensityTabActive" : ""}`}
          onClick={() => setMode("density")}
        >
          Calculate Density (ρ = m ÷ V)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "volume"}
          className={`volumedensityTabBtn ${mode === "volume" ? "volumedensityTabActive" : ""}`}
          onClick={() => setMode("volume")}
        >
          Calculate Volume (V = m ÷ ρ)
        </button>
      </div>

      <div className="volumedensityGrid">
        <div className="volumedensityPanel">
          <h2 className="volumedensitySectionHeading">Input Parameters</h2>

          {mode !== "mass" && (
            <div className="volumedensityFieldGroup">
              <label htmlFor="vd-mass-input" className="volumedensityLabel">
                Mass Value
              </label>
              <div className="volumedensityInputRow">
                <input
                  id="vd-mass-input"
                  type="number"
                  step="any"
                  min="0"
                  value={massInput}
                  onChange={(e) => setMassInput(e.target.value)}
                  className="volumedensityNumberInput"
                  placeholder="Enter mass"
                />
                <select
                  aria-label="Mass unit"
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value as MassUnit)}
                  className="volumedensitySelect"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="mg">mg</option>
                  <option value="lb">lb</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
          )}

          {mode !== "density" && (
            <div className="volumedensityFieldGroup">
              <label htmlFor="vd-density-input" className="volumedensityLabel">
                Density Value
              </label>
              <div className="volumedensityInputRow">
                <input
                  id="vd-density-input"
                  type="number"
                  step="any"
                  min="0"
                  value={densityInput}
                  onChange={(e) => setDensityInput(e.target.value)}
                  className="volumedensityNumberInput"
                  placeholder="Enter density"
                />
                <select
                  aria-label="Density unit"
                  value={densityUnit}
                  onChange={(e) => setDensityUnit(e.target.value as DensityUnit)}
                  className="volumedensitySelect"
                >
                  <option value="kg/m³">kg/m³</option>
                  <option value="g/cm³">g/cm³</option>
                  <option value="g/mL">g/mL</option>
                  <option value="lb/ft³">lb/ft³</option>
                </select>
              </div>
            </div>
          )}

          {mode !== "volume" && (
            <div className="volumedensityFieldGroup">
              <label htmlFor="vd-volume-input" className="volumedensityLabel">
                Volume Value
              </label>
              <div className="volumedensityInputRow">
                <input
                  id="vd-volume-input"
                  type="number"
                  step="any"
                  min="0"
                  value={volumeInput}
                  onChange={(e) => setVolumeInput(e.target.value)}
                  className="volumedensityNumberInput"
                  placeholder="Enter volume"
                />
                <select
                  aria-label="Volume unit"
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value as VolumeUnit)}
                  className="volumedensitySelect"
                >
                  <option value="m³">m³</option>
                  <option value="cm³">cm³</option>
                  <option value="mm³">mm³</option>
                  <option value="L">L</option>
                  <option value="mL">mL</option>
                  <option value="ft³">ft³</option>
                </select>
              </div>
            </div>
          )}

          {mode === "mass" && (
            <div className="volumedensityFieldGroup">
              <label htmlFor="vd-output-mass-unit" className="volumedensityLabel">
                Target Mass Output Unit
              </label>
              <select
                id="vd-output-mass-unit"
                value={massUnit}
                onChange={(e) => setMassUnit(e.target.value as MassUnit)}
                className="volumedensitySelect"
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="mg">Milligrams (mg)</option>
                <option value="lb">Pounds (lb)</option>
                <option value="oz">Ounces (oz)</option>
              </select>
            </div>
          )}

          {mode === "density" && (
            <div className="volumedensityFieldGroup">
              <label htmlFor="vd-output-density-unit" className="volumedensityLabel">
                Target Density Output Unit
              </label>
              <select
                id="vd-output-density-unit"
                value={densityUnit}
                onChange={(e) => setDensityUnit(e.target.value as DensityUnit)}
                className="volumedensitySelect"
              >
                <option value="kg/m³">Kilograms per cubic meter (kg/m³)</option>
                <option value="g/cm³">Grams per cubic centimeter (g/cm³)</option>
                <option value="g/mL">Grams per milliliter (g/mL)</option>
                <option value="lb/ft³">Pounds per cubic foot (lb/ft³)</option>
              </select>
            </div>
          )}

          {mode === "volume" && (
            <div className="volumedensityFieldGroup">
              <label htmlFor="vd-output-volume-unit" className="volumedensityLabel">
                Target Volume Output Unit
              </label>
              <select
                id="vd-output-volume-unit"
                value={volumeUnit}
                onChange={(e) => setVolumeUnit(e.target.value as VolumeUnit)}
                className="volumedensitySelect"
              >
                <option value="m³">Cubic meters (m³)</option>
                <option value="cm³">Cubic centimeters (cm³)</option>
                <option value="mm³">Cubic millimeters (mm³)</option>
                <option value="L">Liters (L)</option>
                <option value="mL">Milliliters (mL)</option>
                <option value="ft³">Cubic feet (ft³)</option>
              </select>
            </div>
          )}

          {calculation.error && (
            <div className="volumedensityError" role="alert">
              {calculation.error}
            </div>
          )}

          <div className="volumedensityActions">
            <button type="button" onClick={handleCopy} className="volumedensityPrimaryBtn">
              {copied ? "Copied Result!" : "Copy Result"}
            </button>
            <button type="button" onClick={handleReset} className="volumedensitySecondaryBtn">
              Reset Values
            </button>
          </div>
        </div>

        <div className="volumedensityResultCard">
          <div>
            <div className="volumedensityResultLabel">
              {calculation.error ? "Input Validation Needed" : calculation.resultLabel}
            </div>
            <div className="volumedensityResultValue">
              {calculation.error ? "—" : calculation.formattedResult}
            </div>
            <div className="volumedensityFormulaBox">
              <strong>Formula:</strong> {calculation.formulaText}
            </div>
          </div>

          {!calculation.error && calculation.conversions && (
            <div className="volumedensityConversions">
              <p className="volumedensityConversionsTitle">Equivalent Unit Conversions</p>
              <div className="volumedensityConvGrid">
                {calculation.conversions.map((item) => (
                  <div key={item.unit} className="volumedensityConvItem">
                    <span>{item.unit}</span>
                    <strong>{item.val}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="volumedensityStepsCard">
        <h2 className="volumedensitySectionHeading">Formula &amp; Step-by-Step Solution</h2>
        {calculation.error ? (
          <p>Enter valid positive numbers above to generate the step-by-step derivation.</p>
        ) : (
          <ol className="volumedensityStepsList">
            {calculation.steps?.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        )}
      </div>

      <RelatedCalculatorLinks currentSlug="volume-density-mass-calculator" />

      <div className="volumedensityFaqSection">
        <h2 className="volumedensityFaqHeading">Frequently Asked Questions</h2>
        <div className="volumedensityFaqList">
          {volumeDensityMassFaqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={item.question} className="volumedensityFaqItem">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  className="volumedensityFaqTrigger"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <span>{item.question}</span>
                  <span>{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <div className="volumedensityFaqAnswer">{item.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}