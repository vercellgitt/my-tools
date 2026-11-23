"use client";

import React, { useMemo, useState } from "react";
import "./calculate-cubic-feet.css";
import { calculateCubicFeetFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type ShapeMode = "rectangular" | "square" | "cube" | "cylinder" | "custom";
type LengthUnit = "ft" | "in" | "cm" | "m";

type CubicFeetResult =
  | {
      error: string;
    }
  | {
      error: null;
      cubicFt: number;
      cubicIn: number;
      cubicM: number;
      cubicYd: number;
      liters: number;
      formula: string;
      diagramLabel: string;
      steps: string[];
    };

const TO_FT: Record<LengthUnit, number> = {
  ft: 1,
  in: 1 / 12,
  cm: 0.03280839895,
  m: 3.280839895,
};

function fmtVol(n: number): string {
  if (!Number.isFinite(n)) return "0";

  if (
    Math.abs(n) >= 1e6 ||
    (Math.abs(n) > 0 && Math.abs(n) < 1e-4)
  ) {
    return n.toExponential(4);
  }

  return Number(n.toPrecision(6)).toString();
}

export default function CalculateCubicFeet() {
  const [shape, setShape] = useState<ShapeMode>("rectangular");
  const [unit, setUnit] = useState<LengthUnit>("ft");
  const [length, setLength] = useState<string>("12");
  const [width, setWidth] = useState<string>("10");
  const [height, setHeight] = useState<string>("8");
  const [side, setSide] = useState<string>("10");
  const [radius, setRadius] = useState<string>("3");
  const [customAreaSqFt, setCustomAreaSqFt] = useState<string>("120");
  const [customDepthFt, setCustomDepthFt] = useState<string>("4");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calc = useMemo<CubicFeetResult>(() => {
    const f = TO_FT[unit];

    let cubicFt = 0;
    let formula = "";
    let diagramLabel = "";
    let steps: string[] = [];

    if (shape === "rectangular") {
      const l = Number(length);
      const w = Number(width);
      const h = Number(height);

      if ([l, w, h].some((x) => !Number.isFinite(x) || x <= 0)) {
        return {
          error: "Please enter positive length, width, and height.",
        };
      }

      const lFt = l * f;
      const wFt = w * f;
      const hFt = h * f;

      cubicFt = lFt * wFt * hFt;

      formula =
        "Cubic Feet = Length (ft) × Width (ft) × Height (ft)";

      diagramLabel = `[▭ L: ${fmtVol(lFt)} ft × W: ${fmtVol(
        wFt
      )} ft × H: ${fmtVol(hFt)} ft]`;

      steps = [
        `Convert dimensions to feet: L = ${fmtVol(
          lFt
        )} ft, W = ${fmtVol(wFt)} ft, H = ${fmtVol(hFt)} ft.`,
        `Multiply L × W × H = ${fmtVol(cubicFt)} ft³.`,
      ];
    } else if (shape === "square") {
      const s = Number(side);
      const h = Number(height);

      if ([s, h].some((x) => !Number.isFinite(x) || x <= 0)) {
        return {
          error: "Please enter positive side length and height.",
        };
      }

      const sFt = s * f;
      const hFt = h * f;

      cubicFt = sFt * sFt * hFt;

      formula = "Cubic Feet = Side² (ft²) × Height (ft)";

      diagramLabel = `[■ Side: ${fmtVol(
        sFt
      )} ft × Side: ${fmtVol(sFt)} ft × H: ${fmtVol(hFt)} ft]`;

      steps = [
        `Convert side (${s} ${unit} → ${fmtVol(
          sFt
        )} ft) and height (${h} ${unit} → ${fmtVol(hFt)} ft).`,
        `Calculate (${fmtVol(sFt)})² × ${fmtVol(
          hFt
        )} = ${fmtVol(cubicFt)} ft³.`,
      ];
    } else if (shape === "cube") {
      const s = Number(side);

      if (!Number.isFinite(s) || s <= 0) {
        return {
          error: "Please enter a positive side length.",
        };
      }

      const sFt = s * f;

      cubicFt = sFt ** 3;

      formula = "Cubic Feet = Side³ (ft³)";

      diagramLabel = `[Cube Edge: ${fmtVol(sFt)} ft in all 3 axes]`;

      steps = [
        `Convert side length to feet: ${fmtVol(sFt)} ft.`,
        `Cube the side length: (${fmtVol(sFt)})³ = ${fmtVol(
          cubicFt
        )} ft³.`,
      ];
    } else if (shape === "cylinder") {
      const r = Number(radius);
      const h = Number(height);

      if ([r, h].some((x) => !Number.isFinite(x) || x <= 0)) {
        return {
          error: "Please enter positive radius and height.",
        };
      }

      const rFt = r * f;
      const hFt = h * f;

      cubicFt = Math.PI * rFt * rFt * hFt;

      formula = "Cubic Feet = π × Radius² (ft²) × Height (ft)";

      diagramLabel = `[● Radius: ${fmtVol(
        rFt
      )} ft | Height: ${fmtVol(hFt)} ft]`;

      steps = [
        `Convert radius (${fmtVol(rFt)} ft) and height (${fmtVol(
          hFt
        )} ft).`,
        `Compute π × (${fmtVol(rFt)})² × ${fmtVol(
          hFt
        )} = ${fmtVol(cubicFt)} ft³.`,
      ];
    } else {
      const area = Number(customAreaSqFt);
      const depth = Number(customDepthFt);

      if (
        [area, depth].some((x) => !Number.isFinite(x) || x <= 0)
      ) {
        return {
          error:
            "Please enter positive custom base area (sq ft) and depth (ft).",
        };
      }

      cubicFt = area * depth;

      formula = "Cubic Feet = Custom Base Area (ft²) × Depth (ft)";

      diagramLabel = `[Custom Section Area: ${fmtVol(
        area
      )} ft² × Depth: ${fmtVol(depth)} ft]`;

      steps = [
        `Take custom section area = ${fmtVol(
          area
        )} ft² and depth = ${fmtVol(depth)} ft.`,
        `Multiply area × depth = ${fmtVol(cubicFt)} ft³.`,
      ];
    }

    return {
      error: null,
      cubicFt,
      cubicIn: cubicFt * 1728,
      cubicM: cubicFt * 0.028316846592,
      cubicYd: cubicFt / 27,
      liters: cubicFt * 28.316846592,
      formula,
      diagramLabel,
      steps,
    };
  }, [
    shape,
    unit,
    length,
    width,
    height,
    side,
    radius,
    customAreaSqFt,
    customDepthFt,
  ]);

  const handleReset = () => {
    setShape("rectangular");
    setUnit("ft");
    setLength("12");
    setWidth("10");
    setHeight("8");
    setSide("10");
    setRadius("3");
    setCustomAreaSqFt("120");
    setCustomDepthFt("4");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (calc.error !== null) return;

    const txt = `Volume: ${fmtVol(calc.cubicFt)} ft³ (${fmtVol(
      calc.cubicM
    )} m³ | ${fmtVol(calc.cubicYd)} yd³ | ${fmtVol(
      calc.liters
    )} L)`;

    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="calculatecubicWrap"
      aria-label="Calculate Cubic Feet Tool"
    >
      <header className="calculatecubicHeader">
        <h1 className="calculatecubicTitle">Calculate Cubic Feet</h1>

        <p className="calculatecubicIntro">
          Calculate cubic feet fast for rectangular rooms, square spaces,
          cubes, cylinders, and custom dimensions. View instant conversions
          into cubic inches, cubic meters, cubic yards, and liters along
          with a clear dimension diagram.
        </p>
      </header>

      <div
        className="calculatecubicShapes"
        role="tablist"
        aria-label="Shape mode"
      >
        {(
          [
            ["rectangular", "Rectangular Room"],
            ["square", "Square Room"],
            ["cube", "Cube"],
            ["cylinder", "Cylinder"],
            ["custom", "Custom Dimensions"],
          ] as [ShapeMode, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={shape === key}
            className={`calculatecubicShapeBtn ${
              shape === key ? "calculatecubicShapeActive" : ""
            }`}
            onClick={() => setShape(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="calculatecubicMainGrid">
        <div className="calculatecubicPanel">
          <h2 className="calculatecubicHeading">
            Dimensions &amp; Units
          </h2>

          {shape !== "custom" && (
            <div
              className="calculatecubicGrid2"
              style={{ marginBottom: 14 }}
            >
              <div>
                <label
                  htmlFor="cc-unit"
                  className="calculatecubicLabel"
                >
                  Measurement Unit
                </label>

                <select
                  id="cc-unit"
                  value={unit}
                  onChange={(e) =>
                    setUnit(e.target.value as LengthUnit)
                  }
                  className="calculatecubicSelect"
                >
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="m">Meters (m)</option>
                </select>
              </div>
            </div>
          )}

          {shape === "rectangular" && (
            <div className="calculatecubicGrid2">
              <div>
                <label
                  htmlFor="cc-l"
                  className="calculatecubicLabel"
                >
                  Length
                </label>

                <input
                  id="cc-l"
                  type="number"
                  step="any"
                  min="0"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cc-w"
                  className="calculatecubicLabel"
                >
                  Width
                </label>

                <input
                  id="cc-w"
                  type="number"
                  step="any"
                  min="0"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cc-h"
                  className="calculatecubicLabel"
                >
                  Height
                </label>

                <input
                  id="cc-h"
                  type="number"
                  step="any"
                  min="0"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>
            </div>
          )}

          {shape === "square" && (
            <div className="calculatecubicGrid2">
              <div>
                <label
                  htmlFor="cc-s"
                  className="calculatecubicLabel"
                >
                  Side Length
                </label>

                <input
                  id="cc-s"
                  type="number"
                  step="any"
                  min="0"
                  value={side}
                  onChange={(e) => setSide(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cc-sh"
                  className="calculatecubicLabel"
                >
                  Height
                </label>

                <input
                  id="cc-sh"
                  type="number"
                  step="any"
                  min="0"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>
            </div>
          )}

          {shape === "cube" && (
            <div className="calculatecubicGrid2">
              <div>
                <label
                  htmlFor="cc-cs"
                  className="calculatecubicLabel"
                >
                  Side Length
                </label>

                <input
                  id="cc-cs"
                  type="number"
                  step="any"
                  min="0"
                  value={side}
                  onChange={(e) => setSide(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>
            </div>
          )}

          {shape === "cylinder" && (
            <div className="calculatecubicGrid2">
              <div>
                <label
                  htmlFor="cc-r"
                  className="calculatecubicLabel"
                >
                  Radius
                </label>

                <input
                  id="cc-r"
                  type="number"
                  step="any"
                  min="0"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cc-rh"
                  className="calculatecubicLabel"
                >
                  Height
                </label>

                <input
                  id="cc-rh"
                  type="number"
                  step="any"
                  min="0"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="calculatecubicInput"
                />
              </div>
            </div>
          )}

          {shape === "custom" && (
            <div className="calculatecubicGrid2">
              <div>
                <label
                  htmlFor="cc-ca"
                  className="calculatecubicLabel"
                >
                  Custom Area (sq ft)
                </label>

                <input
                  id="cc-ca"
                  type="number"
                  step="any"
                  min="0"
                  value={customAreaSqFt}
                  onChange={(e) =>
                    setCustomAreaSqFt(e.target.value)
                  }
                  className="calculatecubicInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cc-cd"
                  className="calculatecubicLabel"
                >
                  Depth / Height (ft)
                </label>

                <input
                  id="cc-cd"
                  type="number"
                  step="any"
                  min="0"
                  value={customDepthFt}
                  onChange={(e) =>
                    setCustomDepthFt(e.target.value)
                  }
                  className="calculatecubicInput"
                />
              </div>
            </div>
          )}

          {calc.error === null && (
            <div className="calculatecubicDiagram">
              <strong>Dimension Diagram:</strong>{" "}
              {calc.diagramLabel}
            </div>
          )}

          {calc.error !== null && (
            <div className="calculatecubicError" role="alert">
              {calc.error}
            </div>
          )}

          <div className="calculatecubicBtns">
            <button
              type="button"
              onClick={handleCopy}
              className="calculatecubicYellowBtn"
              disabled={calc.error !== null}
            >
              {copied ? "Copied Result!" : "Copy Result"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="calculatecubicDarkBtn"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="calculatecubicResultBox">
          <div className="calculatecubicResultTag">
            Total Volume
          </div>

          <div className="calculatecubicResultMain">
            {calc.error !== null
              ? "—"
              : `${fmtVol(calc.cubicFt)} ft³`}
          </div>

          {calc.error === null && (
            <div className="calculatecubicUnitList">
              <div className="calculatecubicUnitCard">
                <div className="calculatecubicUnitName">
                  Cubic Inches
                </div>

                <div className="calculatecubicUnitVal">
                  {fmtVol(calc.cubicIn)} in³
                </div>
              </div>

              <div className="calculatecubicUnitCard">
                <div className="calculatecubicUnitName">
                  Cubic Meters
                </div>

                <div className="calculatecubicUnitVal">
                  {fmtVol(calc.cubicM)} m³
                </div>
              </div>

              <div className="calculatecubicUnitCard">
                <div className="calculatecubicUnitName">
                  Cubic Yards
                </div>

                <div className="calculatecubicUnitVal">
                  {fmtVol(calc.cubicYd)} yd³
                </div>
              </div>

              <div className="calculatecubicUnitCard">
                <div className="calculatecubicUnitName">
                  Liters
                </div>

                <div className="calculatecubicUnitVal">
                  {fmtVol(calc.liters)} L
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {calc.error === null && (
        <div className="calculatecubicStepsPanel">
          <h2 className="calculatecubicHeading">
            Formula &amp; Step-by-Step Solution
          </h2>

          <p>
            <strong>Formula:</strong> {calc.formula}
          </p>

          <ol className="calculatecubicStepsList">
            {calc.steps.map((st, idx) => (
              <li key={idx}>{st}</li>
            ))}
          </ol>
        </div>
      )}

      <RelatedCalculatorLinks currentSlug="calculate-cubic-feet" />

      <div className="calculatecubicFaqWrap">
        <h2 className="calculatecubicFaqHeading">
          Frequently Asked Questions
        </h2>

        {calculateCubicFeetFaqs.map((faq, idx) => {
          const isOpen = openFaq === idx;

          return (
            <div
              key={faq.question}
              className="calculatecubicFaqItem"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                className="calculatecubicFaqBtn"
                onClick={() =>
                  setOpenFaq(openFaq === idx ? null : idx)
                }
              >
                <span>{faq.question}</span>
                <span>{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="calculatecubicFaqAnswer">
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