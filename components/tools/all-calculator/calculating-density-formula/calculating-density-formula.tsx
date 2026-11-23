"use client";

import React, { useMemo, useState } from "react";
import "./calculating-density-formula.css";
import { calculatingDensityFormulaFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type MassUnit = "kg" | "g" | "mg" | "lb" | "oz";
type VolumeUnit = "m³" | "cm³" | "mm³" | "L" | "mL" | "ft³";

type DensityResult =
  | {
      error: string;
    }
  | {
      error: null;
      massKg: number;
      volumeM3: number;
      kgPerM3: number;
      gPerCm3: number;
      gPerMl: number;
      lbPerFt3: number;
    };

const MASS_TO_KG: Record<MassUnit, number> = {
  kg: 1,
  g: 0.001,
  mg: 1e-6,
  lb: 0.45359237,
  oz: 0.028349523125,
};

const VOLUME_TO_M3: Record<VolumeUnit, number> = {
  "m³": 1,
  "cm³": 1e-6,
  "mm³": 1e-9,
  L: 0.001,
  mL: 1e-6,
  "ft³": 0.028316846592,
};

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "0";

  const abs = Math.abs(n);

  if (abs === 0) return "0";

  if (abs >= 1e6 || abs < 1e-4) {
    return n.toExponential(4);
  }

  return Number(n.toPrecision(6)).toString();
}

export default function CalculatingDensityFormula() {
  const [mass, setMass] = useState<string>("250");
  const [massUnit, setMassUnit] = useState<MassUnit>("g");
  const [volume, setVolume] = useState<string>("50");
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>("cm³");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const result = useMemo<DensityResult>(() => {
    const m = Number(mass);
    const v = Number(volume);

    if (mass.trim() === "" || !Number.isFinite(m) || m <= 0) {
      return {
        error: "Please enter a valid positive mass value.",
      };
    }

    if (volume.trim() === "" || !Number.isFinite(v) || v <= 0) {
      return {
        error: "Please enter a valid positive volume value.",
      };
    }

    const massKg = m * MASS_TO_KG[massUnit];
    const volumeM3 = v * VOLUME_TO_M3[volumeUnit];

    const kgPerM3 = massKg / volumeM3;
    const gPerCm3 = kgPerM3 / 1000;
    const gPerMl = gPerCm3;
    const lbPerFt3 = kgPerM3 / 16.01846337396;

    return {
      error: null,
      massKg,
      volumeM3,
      kgPerM3,
      gPerCm3,
      gPerMl,
      lbPerFt3,
    };
  }, [mass, massUnit, volume, volumeUnit]);

  const handleReset = () => {
    setMass("250");
    setMassUnit("g");
    setVolume("50");
    setVolumeUnit("cm³");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result.error !== null) return;

    const text = `Density = ${fmt(result.gPerCm3)} g/cm³ (${fmt(
      result.kgPerM3
    )} kg/m³ | ${fmt(result.lbPerFt3)} lb/ft³) using Density = Mass / Volume.`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="densityformulaContainer"
      aria-label="Calculating Density Formula Calculator"
    >
      <header className="densityformulaBanner">
        <h1 className="densityformulaHeading">
          Calculating Density Formula
        </h1>

        <p className="densityformulaLead">
          Master the calculating density formula (Density = Mass / Volume)
          with automatic unit conversions. Enter your mass and volume to view
          density in kg/m³, g/cm³, g/mL, and lb/ft³ alongside a clear
          step-by-step derivation.
        </p>
      </header>

      <div className="densityformulaCentralPanel">
        <div className="densityformulaInputsRow">
          <div className="densityformulaInputCard">
            <h2 className="densityformulaCardTitle">1. Mass Input</h2>

            <label htmlFor="df-mass-val" className="densityformulaLabel">
              Mass Amount
            </label>

            <input
              id="df-mass-val"
              type="number"
              step="any"
              min="0"
              value={mass}
              onChange={(e) => setMass(e.target.value)}
              className="densityformulaField"
            />

            <label htmlFor="df-mass-unit" className="densityformulaLabel">
              Mass Unit
            </label>

            <select
              id="df-mass-unit"
              value={massUnit}
              onChange={(e) =>
                setMassUnit(e.target.value as MassUnit)
              }
              className="densityformulaField"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="g">Grams (g)</option>
              <option value="mg">Milligrams (mg)</option>
              <option value="lb">Pounds (lb)</option>
              <option value="oz">Ounces (oz)</option>
            </select>
          </div>

          <div className="densityformulaInputCard">
            <h2 className="densityformulaCardTitle">2. Volume Input</h2>

            <label htmlFor="df-vol-val" className="densityformulaLabel">
              Volume Amount
            </label>

            <input
              id="df-vol-val"
              type="number"
              step="any"
              min="0"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="densityformulaField"
            />

            <label htmlFor="df-vol-unit" className="densityformulaLabel">
              Volume Unit
            </label>

            <select
              id="df-vol-unit"
              value={volumeUnit}
              onChange={(e) =>
                setVolumeUnit(e.target.value as VolumeUnit)
              }
              className="densityformulaField"
            >
              <option value="m³">Cubic meters (m³)</option>
              <option value="cm³">Cubic centimeters (cm³)</option>
              <option value="mm³">Cubic millimeters (mm³)</option>
              <option value="L">Liters (L)</option>
              <option value="mL">Milliliters (mL)</option>
              <option value="ft³">Cubic feet (ft³)</option>
            </select>
          </div>
        </div>

        {result.error !== null ? (
          <div className="densityformulaErrorBox" role="alert">
            {result.error}
          </div>
        ) : (
          <div className="densityformulaHeroResult">
            <div className="densityformulaResultCaption">
              Calculated Density
            </div>

            <div className="densityformulaBigNumber">
              {fmt(result.gPerCm3)} g/cm³
            </div>

            <div className="densityformulaSubFormula">
              Formula: Density = Mass / Volume (
              {fmt(result.kgPerM3)} kg/m³ ·{" "}
              {fmt(result.lbPerFt3)} lb/ft³)
            </div>
          </div>
        )}

        <div className="densityformulaBtnGroup">
          <button
            type="button"
            onClick={handleCopy}
            className="densityformulaBtnPrimary"
            disabled={result.error !== null}
          >
            {copied ? "Copied Result!" : "Copy Result"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="densityformulaBtnReset"
          >
            Reset
          </button>
        </div>
      </div>

      {result.error === null && (
        <>
          <div className="densityformulaSubSection">
            <h2 className="densityformulaSubHeading">
              Density Unit Conversion Table
            </h2>

            <table className="densityformulaTable">
              <thead>
                <tr>
                  <th>Unit</th>
                  <th>Calculated Value</th>
                  <th>Common Context</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>kg/m³</td>
                  <td>
                    <strong>{fmt(result.kgPerM3)}</strong>
                  </td>
                  <td>SI base unit for engineering &amp; physics</td>
                </tr>

                <tr>
                  <td>g/cm³</td>
                  <td>
                    <strong>{fmt(result.gPerCm3)}</strong>
                  </td>
                  <td>Solids, minerals, metals &amp; lab samples</td>
                </tr>

                <tr>
                  <td>g/mL</td>
                  <td>
                    <strong>{fmt(result.gPerMl)}</strong>
                  </td>
                  <td>Liquids and solutions</td>
                </tr>

                <tr>
                  <td>lb/ft³</td>
                  <td>
                    <strong>{fmt(result.lbPerFt3)}</strong>
                  </td>
                  <td>US imperial construction &amp; materials</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="densityformulaSubSection">
            <h2 className="densityformulaSubHeading">
              Step-by-Step Solution
            </h2>

            <ol className="densityformulaSteps">
              <li>
                Start with the calculating density formula:{" "}
                <strong>Density = Mass / Volume</strong>.
              </li>

              <li>
                Convert mass ({mass} {massUnit}) to kilograms:{" "}
                <strong>{fmt(result.massKg)} kg</strong>.
              </li>

              <li>
                Convert volume ({volume} {volumeUnit}) to cubic meters:{" "}
                <strong>{fmt(result.volumeM3)} m³</strong>.
              </li>

              <li>
                Divide mass by volume: {fmt(result.massKg)} ÷{" "}
                {fmt(result.volumeM3)} ={" "}
                <strong>{fmt(result.kgPerM3)} kg/m³</strong> (
                {fmt(result.gPerCm3)} g/cm³).
              </li>
            </ol>
          </div>
        </>
      )}

      <RelatedCalculatorLinks currentSlug="calculating-density-formula" />

      <div className="densityformulaFaqWrap">
        <h2 className="densityformulaFaqTitle">
          Frequently Asked Questions
        </h2>

        {calculatingDensityFormulaFaqs.map((faq, idx) => {
          const expanded = openFaq === idx;

          return (
            <div key={faq.question} className="densityformulaFaqCard">
              <button
                type="button"
                aria-expanded={expanded}
                className="densityformulaFaqBtn"
                onClick={() =>
                  setOpenFaq(expanded ? null : idx)
                }
              >
                <span>{faq.question}</span>
                <span>{expanded ? "−" : "+"}</span>
              </button>

              {expanded && (
                <div className="densityformulaFaqBody">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}