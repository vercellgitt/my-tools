"use client";

import React, { useMemo, useState } from "react";
import "./cubic-feet-per-minute-calculator.css";
import { cubicFeetPerMinuteFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type CfmMode = "roomAch" | "ductVelocity" | "unitConv";
type DimUnit = "ft" | "in" | "m" | "cm";
type VelUnit = "ft/min" | "ft/s" | "m/s";
type FlowUnit = "CFM" | "m³/h" | "L/s" | "m³/s";

type CfmResult =
  | {
      error: string;
    }
  | {
      error: null;
      cfm: number;
      roomVolumeFt3: number | null;
      ductAreaFt2: number | null;
      formula: string;
      steps: string[];
    };

const DIM_TO_FT: Record<DimUnit, number> = {
  ft: 1,
  in: 1 / 12,
  m: 3.280839895,
  cm: 0.03280839895,
};

const VEL_TO_FT_MIN: Record<VelUnit, number> = {
  "ft/min": 1,
  "ft/s": 60,
  "m/s": 196.8503937,
};

const FLOW_TO_CFM: Record<FlowUnit, number> = {
  CFM: 1,
  "m³/h": 1 / 1.6990107955,
  "L/s": 1 / 0.4719474432,
  "m³/s": 2118.880003289,
};

function fmtNum(n: number): string {
  if (!Number.isFinite(n)) return "0";

  if (
    Math.abs(n) >= 1e6 ||
    (Math.abs(n) > 0 && Math.abs(n) < 1e-4)
  ) {
    return n.toExponential(4);
  }

  return Number(n.toPrecision(6)).toString();
}

export default function CubicFeetPerMinuteCalculator() {
  const [mode, setMode] = useState<CfmMode>("roomAch");
  const [dimUnit, setDimUnit] = useState<DimUnit>("ft");

  const [length, setLength] = useState<string>("20");
  const [width, setWidth] = useState<string>("15");
  const [height, setHeight] = useState<string>("10");
  const [ach, setAch] = useState<string>("6");

  const [velocity, setVelocity] = useState<string>("800");
  const [velUnit, setVelUnit] = useState<VelUnit>("ft/min");
  const [ductShape, setDuctShape] = useState<"round" | "rect">("round");
  const [diameter, setDiameter] = useState<string>("10");
  const [ductWidth, setDuctWidth] = useState<string>("12");
  const [ductHeight, setDuctHeight] = useState<string>("8");

  const [flowVal, setFlowVal] = useState<string>("300");
  const [flowUnit, setFlowUnit] = useState<FlowUnit>("CFM");

  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calc = useMemo<CfmResult>(() => {
    if (mode === "roomAch") {
      const l = Number(length);
      const w = Number(width);
      const h = Number(height);
      const a = Number(ach);

      if (
        [l, w, h, a].some(
          (x) => !Number.isFinite(x) || x <= 0
        )
      ) {
        return {
          error:
            "Please enter positive numbers for length, width, height, and ACH.",
        };
      }

      const volFt3 =
        l *
        DIM_TO_FT[dimUnit] *
        (w * DIM_TO_FT[dimUnit]) *
        (h * DIM_TO_FT[dimUnit]);

      const cfm = (volFt3 * a) / 60;

      return {
        error: null,
        cfm,
        roomVolumeFt3: volFt3,
        ductAreaFt2: null,
        formula: "CFM = (Room Volume × ACH) ÷ 60",
        steps: [
          `Convert room dimensions to feet (${dimUnit} → ft): ${fmtNum(
            l * DIM_TO_FT[dimUnit]
          )} ft × ${fmtNum(w * DIM_TO_FT[dimUnit])} ft × ${fmtNum(
            h * DIM_TO_FT[dimUnit]
          )} ft.`,
          `Calculate room volume: ${fmtNum(volFt3)} ft³.`,
          `Apply formula: (${fmtNum(volFt3)} × ${a}) ÷ 60 = ${fmtNum(
            cfm
          )} CFM.`,
        ],
      };
    }

    if (mode === "ductVelocity") {
      const vel = Number(velocity);

      if (!Number.isFinite(vel) || vel <= 0) {
        return {
          error: "Please enter a positive air velocity.",
        };
      }

      const velFtMin = vel * VEL_TO_FT_MIN[velUnit];

      let areaFt2 = 0;

      if (ductShape === "round") {
        const d = Number(diameter);

        if (!Number.isFinite(d) || d <= 0) {
          return {
            error: "Please enter a positive duct diameter.",
          };
        }

        const dFt = d * DIM_TO_FT[dimUnit];
        const rFt = dFt / 2;

        areaFt2 = Math.PI * rFt * rFt;
      } else {
        const dw = Number(ductWidth);
        const dh = Number(ductHeight);

        if (
          !Number.isFinite(dw) ||
          dw <= 0 ||
          !Number.isFinite(dh) ||
          dh <= 0
        ) {
          return {
            error: "Please enter positive duct width and height.",
          };
        }

        areaFt2 =
          dw *
          DIM_TO_FT[dimUnit] *
          (dh * DIM_TO_FT[dimUnit]);
      }

      const cfm = velFtMin * areaFt2;

      return {
        error: null,
        cfm,
        roomVolumeFt3: null,
        ductAreaFt2: areaFt2,
        formula:
          "CFM = Air Velocity (ft/min) × Duct Area (ft²)",
        steps: [
          `Convert air velocity (${vel} ${velUnit}) to ft/min: ${fmtNum(
            velFtMin
          )} ft/min.`,
          `Compute duct cross-sectional area in ft²: ${fmtNum(
            areaFt2
          )} ft².`,
          `Multiply airflow: ${fmtNum(velFtMin)} × ${fmtNum(
            areaFt2
          )} = ${fmtNum(cfm)} CFM.`,
        ],
      };
    }

    const fVal = Number(flowVal);

    if (!Number.isFinite(fVal) || fVal < 0) {
      return {
        error: "Please enter a non-negative airflow value.",
      };
    }

    const cfm = fVal * FLOW_TO_CFM[flowUnit];

    return {
      error: null,
      cfm,
      roomVolumeFt3: null,
      ductAreaFt2: null,
      formula: "Converted Airflow via Standard Volumetric Ratios",
      steps: [
        `Start with ${fVal} ${flowUnit}.`,
        `Convert to Cubic Feet Per Minute (CFM): ${fmtNum(
          cfm
        )} CFM.`,
        `Equivalent rates: ${fmtNum(
          cfm * 1.6990107955
        )} m³/h, ${fmtNum(
          cfm * 0.4719474432
        )} L/s, ${fmtNum(
          cfm / 2118.880003289
        )} m³/s.`,
      ],
    };
  }, [
    mode,
    dimUnit,
    length,
    width,
    height,
    ach,
    velocity,
    velUnit,
    ductShape,
    diameter,
    ductWidth,
    ductHeight,
    flowVal,
    flowUnit,
  ]);

  const handleReset = () => {
    setMode("roomAch");
    setDimUnit("ft");

    setLength("20");
    setWidth("15");
    setHeight("10");
    setAch("6");

    setVelocity("800");
    setVelUnit("ft/min");
    setDuctShape("round");

    setDiameter("10");
    setDuctWidth("12");
    setDuctHeight("8");

    setFlowVal("300");
    setFlowUnit("CFM");

    setCopied(false);
  };

  const handleCopy = async () => {
    if (calc.error !== null) return;

    const text = `Airflow: ${fmtNum(
      calc.cfm
    )} CFM (${fmtNum(
      calc.cfm * 1.6990107955
    )} m³/h | ${fmtNum(
      calc.cfm * 0.4719474432
    )} L/s | ${fmtNum(
      calc.cfm / 2118.880003289
    )} m³/s)`;

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
      className="cfmWrapper"
      aria-label="Cubic Feet Per Minute Calculator"
    >
      <header className="cfmBanner">
        <h1 className="cfmTitle">
          Cubic Feet Per Minute Calculator
        </h1>

        <p className="cfmIntro">
          Calculate ventilation and HVAC airflow using our Cubic
          Feet Per Minute Calculator. Solve from room volume and air
          changes per hour, duct velocity and cross-section, or
          convert between CFM, m³/h, L/s, and m³/s.
        </p>
      </header>

      <div
        className="cfmModeTabs"
        role="tablist"
        aria-label="CFM calculation mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "roomAch"}
          className={`cfmTabBtn ${
            mode === "roomAch" ? "cfmTabActive" : ""
          }`}
          onClick={() => setMode("roomAch")}
        >
          Room Volume &amp; ACH
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "ductVelocity"}
          className={`cfmTabBtn ${
            mode === "ductVelocity" ? "cfmTabActive" : ""
          }`}
          onClick={() => setMode("ductVelocity")}
        >
          Air Velocity &amp; Duct Area
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "unitConv"}
          className={`cfmTabBtn ${
            mode === "unitConv" ? "cfmTabActive" : ""
          }`}
          onClick={() => setMode("unitConv")}
        >
          Airflow Unit Conversion
        </button>
      </div>

      <div className="cfmLayout">
        <div className="cfmPanel">
          <h2 className="cfmSectionHeading">
            Engineering Inputs
          </h2>

          {mode === "roomAch" && (
            <>
              <div className="cfmFieldGrid">
                <div>
                  <label
                    htmlFor="cfm-dim-unit"
                    className="cfmLabel"
                  >
                    Dimension Unit
                  </label>

                  <select
                    id="cfm-dim-unit"
                    value={dimUnit}
                    onChange={(e) =>
                      setDimUnit(e.target.value as DimUnit)
                    }
                    className="cfmSelect"
                  >
                    <option value="ft">Feet (ft)</option>
                    <option value="in">Inches (in)</option>
                    <option value="m">Meters (m)</option>
                    <option value="cm">Centimeters (cm)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="cfm-len" className="cfmLabel">
                    Room Length
                  </label>

                  <input
                    id="cfm-len"
                    type="number"
                    step="any"
                    min="0"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="cfmInput"
                  />
                </div>

                <div>
                  <label htmlFor="cfm-wid" className="cfmLabel">
                    Room Width
                  </label>

                  <input
                    id="cfm-wid"
                    type="number"
                    step="any"
                    min="0"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="cfmInput"
                  />
                </div>

                <div>
                  <label htmlFor="cfm-hgt" className="cfmLabel">
                    Room Height
                  </label>

                  <input
                    id="cfm-hgt"
                    type="number"
                    step="any"
                    min="0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="cfmInput"
                  />
                </div>

                <div>
                  <label htmlFor="cfm-ach" className="cfmLabel">
                    Air Changes / Hour (ACH)
                  </label>

                  <input
                    id="cfm-ach"
                    type="number"
                    step="any"
                    min="0"
                    value={ach}
                    onChange={(e) => setAch(e.target.value)}
                    className="cfmInput"
                  />
                </div>
              </div>

              <div className="cfmDiagram">
                <strong>Room Airflow Diagram:</strong> [Room
                Volume = L × W × H] → × [ACH] ÷ 60 min/hr → [Exhaust
                / Supply CFM]
              </div>
            </>
          )}

          {mode === "ductVelocity" && (
            <>
              <div className="cfmFieldGrid">
                <div>
                  <label htmlFor="cfm-vel" className="cfmLabel">
                    Air Velocity
                  </label>

                  <input
                    id="cfm-vel"
                    type="number"
                    step="any"
                    min="0"
                    value={velocity}
                    onChange={(e) =>
                      setVelocity(e.target.value)
                    }
                    className="cfmInput"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cfm-vel-u"
                    className="cfmLabel"
                  >
                    Velocity Unit
                  </label>

                  <select
                    id="cfm-vel-u"
                    value={velUnit}
                    onChange={(e) =>
                      setVelUnit(e.target.value as VelUnit)
                    }
                    className="cfmSelect"
                  >
                    <option value="ft/min">ft/min (FPM)</option>
                    <option value="ft/s">ft/s</option>
                    <option value="m/s">m/s</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cfm-shape"
                    className="cfmLabel"
                  >
                    Duct Cross-Section
                  </label>

                  <select
                    id="cfm-shape"
                    value={ductShape}
                    onChange={(e) =>
                      setDuctShape(
                        e.target.value as "round" | "rect"
                      )
                    }
                    className="cfmSelect"
                  >
                    <option value="round">
                      Round Duct (Diameter)
                    </option>
                    <option value="rect">
                      Rectangular Duct (W × H)
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cfm-dunit"
                    className="cfmLabel"
                  >
                    Duct Dimension Unit
                  </label>

                  <select
                    id="cfm-dunit"
                    value={dimUnit}
                    onChange={(e) =>
                      setDimUnit(e.target.value as DimUnit)
                    }
                    className="cfmSelect"
                  >
                    <option value="in">Inches (in)</option>
                    <option value="ft">Feet (ft)</option>
                    <option value="cm">Centimeters (cm)</option>
                    <option value="m">Meters (m)</option>
                  </select>
                </div>
              </div>

              {ductShape === "round" ? (
                <div className="cfmFieldGrid">
                  <div>
                    <label
                      htmlFor="cfm-dia"
                      className="cfmLabel"
                    >
                      Duct Diameter
                    </label>

                    <input
                      id="cfm-dia"
                      type="number"
                      step="any"
                      min="0"
                      value={diameter}
                      onChange={(e) =>
                        setDiameter(e.target.value)
                      }
                      className="cfmInput"
                    />
                  </div>
                </div>
              ) : (
                <div className="cfmFieldGrid">
                  <div>
                    <label
                      htmlFor="cfm-dw"
                      className="cfmLabel"
                    >
                      Duct Width
                    </label>

                    <input
                      id="cfm-dw"
                      type="number"
                      step="any"
                      min="0"
                      value={ductWidth}
                      onChange={(e) =>
                        setDuctWidth(e.target.value)
                      }
                      className="cfmInput"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="cfm-dh"
                      className="cfmLabel"
                    >
                      Duct Height
                    </label>

                    <input
                      id="cfm-dh"
                      type="number"
                      step="any"
                      min="0"
                      value={ductHeight}
                      onChange={(e) =>
                        setDuctHeight(e.target.value)
                      }
                      className="cfmInput"
                    />
                  </div>
                </div>
              )}

              <div className="cfmDiagram">
                <strong>Duct Airflow Diagram:</strong>{" "}
                {ductShape === "round"
                  ? "[○ Ø Diameter → Area πr²]"
                  : "[▭ Width × Height → Area]"}{" "}
                × [Velocity v] = [CFM]
              </div>
            </>
          )}

          {mode === "unitConv" && (
            <div className="cfmFieldGrid">
              <div>
                <label
                  htmlFor="cfm-flow-val"
                  className="cfmLabel"
                >
                  Airflow Value
                </label>

                <input
                  id="cfm-flow-val"
                  type="number"
                  step="any"
                  min="0"
                  value={flowVal}
                  onChange={(e) => setFlowVal(e.target.value)}
                  className="cfmInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cfm-flow-unit"
                  className="cfmLabel"
                >
                  Source Unit
                </label>

                <select
                  id="cfm-flow-unit"
                  value={flowUnit}
                  onChange={(e) =>
                    setFlowUnit(e.target.value as FlowUnit)
                  }
                  className="cfmSelect"
                >
                  <option value="CFM">CFM (ft³/min)</option>
                  <option value="m³/h">m³/h</option>
                  <option value="L/s">L/s</option>
                  <option value="m³/s">m³/s</option>
                </select>
              </div>
            </div>
          )}

          {calc.error !== null && (
            <div className="cfmError" role="alert">
              {calc.error}
            </div>
          )}

          <div className="cfmActions">
            <button
              type="button"
              onClick={handleCopy}
              className="cfmOrangeBtn"
              disabled={calc.error !== null}
            >
              {copied ? "Copied Result!" : "Copy Result"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="cfmGrayBtn"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="cfmOutputPanel">
          <div className="cfmOutputTag">
            Calculated Airflow
          </div>

          <div className="cfmOutputBig">
            {calc.error !== null
              ? "—"
              : `${fmtNum(calc.cfm)} CFM`}
          </div>

          {calc.error === null && (
            <div className="cfmMetricsList">
              <div className="cfmMetricBox">
                <div className="cfmMetricLabel">
                  Cubic Meters / Hour
                </div>

                <div className="cfmMetricVal">
                  {fmtNum(calc.cfm * 1.6990107955)} m³/h
                </div>
              </div>

              <div className="cfmMetricBox">
                <div className="cfmMetricLabel">
                  Liters / Second
                </div>

                <div className="cfmMetricVal">
                  {fmtNum(calc.cfm * 0.4719474432)} L/s
                </div>
              </div>

              <div className="cfmMetricBox">
                <div className="cfmMetricLabel">
                  Cubic Meters / Second
                </div>

                <div className="cfmMetricVal">
                  {fmtNum(calc.cfm / 2118.880003289)} m³/s
                </div>
              </div>

              <div className="cfmMetricBox">
                <div className="cfmMetricLabel">
                  {calc.roomVolumeFt3 !== null
                    ? "Room Volume"
                    : "Duct Cross-Section"}
                </div>

                <div className="cfmMetricVal">
                  {calc.roomVolumeFt3 !== null
                    ? `${fmtNum(calc.roomVolumeFt3)} ft³`
                    : calc.ductAreaFt2 !== null
                    ? `${fmtNum(calc.ductAreaFt2)} ft²`
                    : "N/A"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {calc.error === null && (
        <div className="cfmStepsBox">
          <h2 className="cfmSectionHeading">
            Formula &amp; Step-by-Step Solution
          </h2>

          <p>
            <strong>Formula:</strong> {calc.formula}
          </p>

          <ol className="cfmStepsList">
            {calc.steps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </div>
      )}

      <RelatedCalculatorLinks currentSlug="cubic-feet-per-minute-calculator" />

      <div className="cfmFaqSection">
        <h2 className="cfmFaqHeading">
          Frequently Asked Questions
        </h2>

        {cubicFeetPerMinuteFaqs.map((faq, idx) => {
          const open = openFaq === idx;

          return (
            <div key={faq.question} className="cfmFaqItem">
              <button
                type="button"
                aria-expanded={open}
                className="cfmFaqBtn"
                onClick={() => setOpenFaq(open ? null : idx)}
              >
                <span>{faq.question}</span>
                <span>{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="cfmFaqAnswer">
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