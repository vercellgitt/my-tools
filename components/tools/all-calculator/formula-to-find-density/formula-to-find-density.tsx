"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { densityToolsConfig } from "./faq";
import "./formula-to-find-density.css";

interface FormulaToFindDensityProps {
  slug?: string;
}

type CalcMode = "density" | "mass" | "volume";

const SLUG_KEYS = [
  "calculating-density-formula",
  "formula-to-find-density",
  "volume-density-mass-calculator",
] as const;

export default function FormulaToFindDensity({
  slug = "formula-to-find-density",
}: FormulaToFindDensityProps) {
  const router = useRouter();
  const activeSlug = densityToolsConfig[slug] ? slug : "formula-to-find-density";
  const pageData = densityToolsConfig[activeSlug];

  // Mode state initialized uniquely per URL slug
  const [currentMode, setCurrentMode] = useState<CalcMode>(pageData.defaultMode);

  // Input states
  const [massInput, setMassInput] = useState<string>("");
  const [massUnit, setMassUnit] = useState<string>("g");
  const [volumeInput, setVolumeInput] = useState<string>("");
  const [volumeUnit, setVolumeUnit] = useState<string>("cm3");
  const [densityInput, setDensityInput] = useState<string>("");
  const [densityUnit, setDensityUnit] = useState<string>("g_cm3");
  const [precision, setPrecision] = useState<number>(4);

  // History & Toast states
  const [historyLog, setHistoryLog] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [showToastFlag, setShowToastFlag] = useState<boolean>(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Sync mode automatically when URL slug changes
  useEffect(() => {
    const config = densityToolsConfig[activeSlug];
    if (config) {
      setCurrentMode(config.defaultMode);
      setOpenFaqIndex(null);
    }
  }, [activeSlug]);

  // Load 24-hour expiring history from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("density_calc_history");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.timestamp) {
          const now = Date.now();
          const twentyFourHours = 24 * 60 * 60 * 1000;
          if (now - parsed.timestamp < twentyFourHours) {
            setHistoryLog(parsed.items || []);
          } else {
            localStorage.removeItem("density_calc_history");
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Unit conversion helpers
  const getMassInKg = (value: number, unit: string): number => {
    switch (unit) {
      case "mg":
        return value / 1000000;
      case "g":
        return value / 1000;
      case "kg":
        return value;
      case "oz":
        return value * 0.0283495;
      case "lb":
        return value * 0.453592;
      case "ton":
        return value * 1000;
      default:
        return value;
    }
  };

  const getVolumeInM3 = (value: number, unit: string): number => {
    switch (unit) {
      case "mL":
        return value / 1000000;
      case "L":
        return value / 1000;
      case "cm3":
        return value / 1000000;
      case "m3":
        return value;
      case "mm3":
        return value / 1e9;
      case "ft3":
        return value * 0.0283168;
      case "in3":
        return value * 1.6387e-5;
      case "gal":
        return value * 0.00378541;
      default:
        return value;
    }
  };

  const getDensityInKgM3 = (value: number, unit: string): number => {
    switch (unit) {
      case "g_cm3":
        return value * 1000;
      case "kg_m3":
        return value;
      case "g_mL":
        return value * 1000;
      case "kg_L":
        return value * 1000;
      case "lb_ft3":
        return value * 16.0185;
      default:
        return value;
    }
  };

  // Navigate to corresponding URL when top dropdown changes
  const handleDropdownSlugChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    if (selectedSlug && selectedSlug !== activeSlug) {
      router.push(`/${selectedSlug}`);
    }
  };

  // Switch calculator mode button
  const handleModeChange = (mode: CalcMode) => {
    setCurrentMode(mode);
  };

  // Compute results dynamically
  const computeResults = () => {
    const massVal = parseFloat(massInput);
    const volVal = parseFloat(volumeInput);
    const densVal = parseFloat(densityInput);

    const massEmpty = massInput.trim() === "" || isNaN(massVal);
    const volEmpty = volumeInput.trim() === "" || isNaN(volVal);
    const densEmpty = densityInput.trim() === "" || isNaN(densVal);

    let showMassWarning = false;
    let showVolWarning = false;
    let showDensWarning = false;
    let isValid = false;

    let densityKgM3 = 0;
    let massKg = 0;
    let volM3 = 0;

    if (currentMode === "density") {
      if (massEmpty && !volEmpty) showMassWarning = true;
      else if (!massEmpty && volEmpty) showVolWarning = true;
      else if (!massEmpty && !volEmpty && massVal >= 0 && volVal > 0) {
        massKg = getMassInKg(massVal, massUnit);
        volM3 = getVolumeInM3(volVal, volumeUnit);
        if (volM3 > 0) {
          densityKgM3 = massKg / volM3;
          isValid = true;
        }
      }
    } else if (currentMode === "mass") {
      if (volEmpty && !densEmpty) showVolWarning = true;
      else if (!volEmpty && densEmpty) showDensWarning = true;
      else if (!volEmpty && !densEmpty && volVal > 0 && densVal > 0) {
        volM3 = getVolumeInM3(volVal, volumeUnit);
        densityKgM3 = getDensityInKgM3(densVal, densityUnit);
        massKg = densityKgM3 * volM3;
        isValid = true;
      }
    } else if (currentMode === "volume") {
      if (massEmpty && !densEmpty) showMassWarning = true;
      else if (!massEmpty && densEmpty) showDensWarning = true;
      else if (!massEmpty && !densEmpty && massVal >= 0 && densVal > 0) {
        massKg = getMassInKg(massVal, massUnit);
        densityKgM3 = getDensityInKgM3(densVal, densityUnit);
        if (densityKgM3 > 0) {
          volM3 = massKg / densityKgM3;
          isValid = true;
        }
      }
    }

    if (
      !isValid ||
      isNaN(densityKgM3) ||
      !isFinite(densityKgM3) ||
      isNaN(massKg) ||
      isNaN(volM3)
    ) {
      return {
        isValid: false,
        showMassWarning,
        showVolWarning,
        showDensWarning,
        primaryLabel: "",
        primaryValue: "-",
        siLabel: "Standard SI Unit Result:",
        siValue: "-",
        alt1Label: "",
        alt1Value: "-",
        alt2Label: "",
        alt2Value: "-",
        formulaStr: "",
        steps: [] as string[],
        historySummary: "",
      };
    }

    if (currentMode === "density") {
      const densGcm3 = densityKgM3 / 1000;
      const densLbft3 = densityKgM3 / 16.0185;
      const densKgL = densityKgM3 / 1000;
      const primary = `${densGcm3.toFixed(precision)} g/cm³`;

      return {
        isValid: true,
        showMassWarning: false,
        showVolWarning: false,
        showDensWarning: false,
        primaryLabel: "Density:",
        primaryValue: primary,
        siLabel: "Standard SI Unit Result:",
        siValue: `${densityKgM3.toFixed(precision)} kg/m³`,
        alt1Label: "Alternative (g/cm³, g/mL):",
        alt1Value: `${densGcm3.toFixed(precision)} g/cm³ | ${densGcm3.toFixed(precision)} g/mL`,
        alt2Label: "Alternative (kg/L, lb/ft³):",
        alt2Value: `${densKgL.toFixed(precision)} kg/L | ${densLbft3.toFixed(precision)} lb/ft³`,
        formulaStr: "Density = Mass / Volume",
        steps: [
          `1. Converted Mass to ${massKg.toFixed(6)} kg.`,
          `2. Converted Volume to ${volM3.toFixed(6)} m³.`,
          `3. Divided Mass by Volume: ${massKg.toFixed(6)} / ${volM3.toFixed(6)} = ${densityKgM3.toFixed(6)} kg/m³.`,
        ],
        historySummary: `Density: ${primary}`,
      };
    } else if (currentMode === "mass") {
      const massMg = massKg * 1e6;
      const massG = massKg * 1000;
      const massOz = massKg / 0.0283495;
      const massLb = massKg / 0.453592;
      const massTon = massKg / 1000;
      const primary = `${massKg.toFixed(precision)} kg`;

      return {
        isValid: true,
        showMassWarning: false,
        showVolWarning: false,
        showDensWarning: false,
        primaryLabel: "Mass:",
        primaryValue: primary,
        siLabel: "Standard SI Unit Result:",
        siValue: `${massKg.toFixed(precision)} kg (Base SI)`,
        alt1Label: "Alternative (g, mg):",
        alt1Value: `${massG.toFixed(precision)} g | ${massMg.toFixed(precision)} mg`,
        alt2Label: "Alternative (oz, lb, ton):",
        alt2Value: `${massOz.toFixed(precision)} oz | ${massLb.toFixed(precision)} lb | ${massTon.toFixed(precision)} ton`,
        formulaStr: "Mass = Density × Volume",
        steps: [
          `1. Converted Density to ${densityKgM3.toFixed(6)} kg/m³.`,
          `2. Converted Volume to ${volM3.toFixed(6)} m³.`,
          `3. Multiplied Density by Volume: ${densityKgM3.toFixed(6)} × ${volM3.toFixed(6)} = ${massKg.toFixed(6)} kg.`,
        ],
        historySummary: `Mass: ${primary}`,
      };
    } else {
      const volMl = volM3 * 1e6;
      const volL = volM3 * 1000;
      const volFt3 = volM3 / 0.0283168;
      const volGal = volM3 / 0.00378541;
      const primary = `${volM3.toFixed(precision)} m³`;

      return {
        isValid: true,
        showMassWarning: false,
        showVolWarning: false,
        showDensWarning: false,
        primaryLabel: "Volume:",
        primaryValue: primary,
        siLabel: "Standard SI Unit Result:",
        siValue: `${volM3.toFixed(precision)} m³ (Base SI)`,
        alt1Label: "Alternative (mL, L):",
        alt1Value: `${volL.toFixed(precision)} L | ${volMl.toFixed(precision)} mL`,
        alt2Label: "Alternative (ft³, in³, gal):",
        alt2Value: `${volFt3.toFixed(precision)} ft³ | ${volGal.toFixed(precision)} gal`,
        formulaStr: "Volume = Mass / Density",
        steps: [
          `1. Converted Mass to ${massKg.toFixed(6)} kg.`,
          `2. Converted Density to ${densityKgM3.toFixed(6)} kg/m³.`,
          `3. Divided Mass by Density: ${massKg.toFixed(6)} / ${densityKgM3.toFixed(6)} = ${volM3.toFixed(6)} m³.`,
        ],
        historySummary: `Volume: ${primary}`,
      };
    }
  };

  const result = computeResults();

  // Save valid calculation to history
  useEffect(() => {
    if (!result.isValid || !result.historySummary) return;

    const timer = setTimeout(() => {
      setHistoryLog((prev) => {
        if (prev.length > 0 && prev[0] === result.historySummary) return prev;
        const updated = [result.historySummary, ...prev].slice(0, 5);
        try {
          localStorage.setItem(
            "density_calc_history",
            JSON.stringify({
              timestamp: Date.now(),
              items: updated,
            })
          );
        } catch {
          // Ignore storage errors
        }
        return updated;
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [result.isValid, result.historySummary]);

  const showToast = (message: string) => {
    setToastMsg(message);
    setShowToastFlag(true);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setShowToastFlag(false);
    }, 2000);
  };

  const handleCopyResult = () => {
    if (!result.isValid || result.primaryValue === "-") return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(result.primaryValue)
        .then(() => showToast("Result copied to clipboard!"))
        .catch(() => showToast("Failed to copy result."));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = result.primaryValue;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        showToast("Result copied to clipboard!");
      } catch {
        showToast("Clipboard access blocked.");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleReset = () => {
    setMassInput("");
    setVolumeInput("");
    setDensityInput("");
  };

  const handleClearHistory = () => {
    setHistoryLog([]);
    try {
      localStorage.removeItem("density_calc_history");
    } catch {
      // Ignore
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="formula1">
      {/* Main Calculator Card */}
      <div className="formula2">
        {/* Dynamic Top Box Heading Unique to Each URL */}
        <div className="formula3">{pageData.toolHeading}</div>

        {/* Top Keyword / URL Selector Dropdown */}
        <div className="formula4">
          <label htmlFor="keywordUrlSelect" className="formula5">
            Select Calculation Tool / Formula Mode:
          </label>
          <select
            id="keywordUrlSelect"
            className="formula6"
            value={activeSlug}
            onChange={handleDropdownSlugChange}
          >
            {SLUG_KEYS.map((keySlug) => (
              <option key={keySlug} value={keySlug}>
                {densityToolsConfig[keySlug].dropdownLabel}
              </option>
            ))}
          </select>
        </div>

        {/* Calculation Mode Buttons */}
        <div className="formula7">
          <button
            type="button"
            className={`formula8 ${currentMode === "density" ? "formula9" : ""}`}
            onClick={() => handleModeChange("density")}
          >
            Calculate Density
          </button>
          <button
            type="button"
            className={`formula8 ${currentMode === "mass" ? "formula9" : ""}`}
            onClick={() => handleModeChange("mass")}
          >
            Calculate Mass
          </button>
          <button
            type="button"
            className={`formula8 ${currentMode === "volume" ? "formula9" : ""}`}
            onClick={() => handleModeChange("volume")}
          >
            Calculate Volume
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Mass Input (Visible for Density & Volume) */}
          {currentMode !== "mass" && (
            <div className="formula10">
              <div className="formula11">
                <label htmlFor="massInput" className="formula5">
                  Mass
                </label>
                <input
                  type="number"
                  id="massInput"
                  className="formula13"
                  placeholder="Enter mass"
                  step="any"
                  min="0"
                  value={massInput}
                  onChange={(e) => setMassInput(e.target.value)}
                />
                {result.showMassWarning && (
                  <div className="formula14">Please complete your input</div>
                )}
              </div>
              <div className="formula12">
                <label htmlFor="massUnit" className="formula5">
                  Unit
                </label>
                <select
                  id="massUnit"
                  className="formula13"
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value)}
                >
                  <option value="mg">mg</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="oz">oz</option>
                  <option value="lb">lb</option>
                  <option value="ton">ton</option>
                </select>
              </div>
            </div>
          )}

          {/* Volume Input (Visible for Density & Mass) */}
          {currentMode !== "volume" && (
            <div className="formula10">
              <div className="formula11">
                <label htmlFor="volumeInput" className="formula5">
                  Volume
                </label>
                <input
                  type="number"
                  id="volumeInput"
                  className="formula13"
                  placeholder="Enter volume"
                  step="any"
                  min="0"
                  value={volumeInput}
                  onChange={(e) => setVolumeInput(e.target.value)}
                />
                {result.showVolWarning && (
                  <div className="formula14">Please complete your input</div>
                )}
              </div>
              <div className="formula12">
                <label htmlFor="volumeUnit" className="formula5">
                  Unit
                </label>
                <select
                  id="volumeUnit"
                  className="formula13"
                  value={volumeUnit}
                  onChange={(e) => setVolumeUnit(e.target.value)}
                >
                  <option value="mL">mL</option>
                  <option value="L">L</option>
                  <option value="cm3">cm³</option>
                  <option value="m3">m³</option>
                  <option value="mm3">mm³</option>
                  <option value="ft3">ft³</option>
                  <option value="in3">in³</option>
                  <option value="gal">gal</option>
                </select>
              </div>
            </div>
          )}

          {/* Density Input (Visible for Mass & Volume) */}
          {currentMode !== "density" && (
            <div className="formula10">
              <div className="formula11">
                <label htmlFor="densityInput" className="formula5">
                  Density
                </label>
                <input
                  type="number"
                  id="densityInput"
                  className="formula13"
                  placeholder="Enter density"
                  step="any"
                  min="0"
                  value={densityInput}
                  onChange={(e) => setDensityInput(e.target.value)}
                />
                {result.showDensWarning && (
                  <div className="formula14">Please complete your input</div>
                )}
              </div>
              <div className="formula12">
                <label htmlFor="densityUnit" className="formula5">
                  Unit
                </label>
                <select
                  id="densityUnit"
                  className="formula13"
                  value={densityUnit}
                  onChange={(e) => setDensityUnit(e.target.value)}
                >
                  <option value="g_cm3">g/cm³</option>
                  <option value="kg_m3">kg/m³</option>
                  <option value="g_mL">g/mL</option>
                  <option value="kg_L">kg/L</option>
                  <option value="lb_ft3">lb/ft³</option>
                </select>
              </div>
            </div>
          )}

          {/* Precision Settings */}
          <div className="formula15">
            <div className="formula16">
              <label htmlFor="precisionSelect" className="formula5" style={{ marginBottom: 0 }}>
                Decimal Precision:
              </label>
              <select
                id="precisionSelect"
                className="formula17"
                value={precision}
                onChange={(e) => setPrecision(parseInt(e.target.value, 10))}
              >
                {Array.from({ length: 16 }, (_, idx) => (
                  <option key={idx} value={idx}>
                    {idx} {idx === 1 ? "Decimal Place" : "Decimal Places"}
                  </option>
                ))}
              </select>
            </div>
            <div className="formula18">Auto-calculating</div>
          </div>

          {/* Action Buttons */}
          {result.isValid && (
            <div className="formula19">
              <button type="button" className="formula20" onClick={handleReset}>
                Reset
              </button>
              <button type="button" className="formula20" onClick={handleCopyResult}>
                Copy Result
              </button>
            </div>
          )}
        </form>

        {/* Results Section */}
        {result.isValid && (
          <div className="formula21">
            <div className="formula22">Output Results</div>
            <div className="formula23">
              <span className="formula24">{result.primaryLabel}</span>
              <span className="formula25">{result.primaryValue}</span>
            </div>
            <div className="formula23">
              <span className="formula24">{result.siLabel}</span>
              <span className="formula25">{result.siValue}</span>
            </div>
            <div className="formula23">
              <span className="formula24">{result.alt1Label}</span>
              <span className="formula25">{result.alt1Value}</span>
            </div>
            <div className="formula23">
              <span className="formula24">{result.alt2Label}</span>
              <span className="formula25">{result.alt2Value}</span>
            </div>

            <div className="formula26">
              <p>
                <strong>Calculation Formula:</strong> {result.formulaStr}
              </p>
              <p>
                <strong>Step-by-Step Calculation:</strong>
                <br />
                {result.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    {step}
                    {idx < result.steps.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            </div>
          </div>
        )}

        {/* History Section */}
        {historyLog.length > 0 && (
          <div className="formula27">
            <div className="formula28">
              <span className="formula29">Calculation History</span>
              <button type="button" className="formula30" onClick={handleClearHistory}>
                Clear History
              </button>
            </div>
            <ul className="formula31">
              {historyLog.map((item, idx) => (
                <li key={idx} className="formula32">
                  <span>Calculation #{historyLog.length - idx}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SEO Content, H1, Introduction, Article & Clickable FAQ Section Below Tool */}
      <article className="formula35">
        <h1 className="formula36">{pageData.h1Title}</h1>
        <p className="formula37">{pageData.introText}</p>

        {/* Unique Article Sections */}
        <div className="formula38">
          <h2 className="formula39">{pageData.article.title}</h2>
          {pageData.article.sections.map((sec, idx) => (
            <div key={idx} className="formula40">
              {sec.level === "h2" && <h2 className="formula41">{sec.heading}</h2>}
              {sec.level === "h3" && <h3 className="formula41">{sec.heading}</h3>}
              {sec.level === "h4" && <h4 className="formula41">{sec.heading}</h4>}
              <p className="formula42">{sec.content}</p>
            </div>
          ))}
        </div>

        {/* Interactive Click-to-Expand FAQ Section (Each question in H2) */}
        <section className="formula43">
          <div className="formula44">Frequently Asked Questions</div>
          {pageData.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="formula45">
                <h2 className="formula46">
                  <button
                    type="button"
                    className="formula47"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="formula48">{isOpen ? "▲" : "▼"}</span>
                  </button>
                </h2>
                {isOpen && <div className="formula49">{faq.answer}</div>}
              </div>
            );
          })}
        </section>
      </article>

      {/* Toast Notification */}
      <div className={`formula33 ${showToastFlag ? "formula34" : ""}`}>
        {toastMsg}
      </div>
    </div>
  );
}