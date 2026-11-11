"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cubicToolsConfig } from "./faq";
import "./calculate-cubic-feet.css";

interface ToolProps {
  slug?: string;
}

export default function CalculateCubicFeetTool({ slug = "calculate-cubic-feet" }: ToolProps) {
  const router = useRouter();

  const tabSlugs = [
    "calculate-cubic-feet",
    "cubic-feet-to-cubic-yard",
    "cubic-calculator",
    "cubic-feet-per-minute-calculator"
  ];

  const getTabIdxFromSlug = (s: string) => {
    const index = tabSlugs.indexOf(s);
    return index >= 0 ? index : 0;
  };

  const [activeTab, setActiveTab] = useState(getTabIdxFromSlug(slug));

  const activeSlug = tabSlugs[activeTab];

  const currentConfig =
    cubicToolsConfig[activeSlug] ||
    cubicToolsConfig["calculate-cubic-feet"];
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // States for Calculator 1
  const [cfLength, setCfLength] = useState("");
  const [cfWidth, setCfWidth] = useState("");
  const [cfHeight, setCfHeight] = useState("");
  const [cfUnit, setCfUnit] = useState("feet");

  const [cfRes, setCfRes] = useState<{
    feet: number;
    inches: number;
    meters: number;
    yards: number;
  } | null>(null);

  // States for Calculator 2
  const [cftyInput, setCftyInput] = useState("");

  const [cftyRes, setCftyRes] = useState<{
    yards: number;
    feet: number;
    inches: number;
    meters: number;
  } | null>(null);

  // States for Calculator 3
  const [ccShape, setCcShape] = useState("cube");
  const [ccLength, setCcLength] = useState("");
  const [ccWidth, setCcWidth] = useState("");
  const [ccHeight, setCcHeight] = useState("");
  const [ccUnit, setCcUnit] = useState("inches");

  const [ccRes, setCcRes] = useState<{
    volume: number;
    feet: number;
    yards: number;
    inches: number;
    meters: number;
  } | null>(null);

  // States for Calculator 4
  const [cfmVol, setCfmVol] = useState("");
  const [cfmTime, setCfmTime] = useState("");
  const [cfmTimeUnit, setCfmTimeUnit] = useState("minutes");

  const [cfmRes, setCfmRes] = useState<{
    min: number;
    hour: number;
    sec: number;
  } | null>(null);

  useEffect(() => {
    setActiveTab(getTabIdxFromSlug(slug));
  }, [slug]);

 const switchTab = (index: number) => {
  setActiveTab(index);
  setOpenFaqIndex(null);
  router.push(`/${tabSlugs[index]}`);
};

  const convertToFeet = (value: number, unit: string) => {
    switch (unit) {
      case "inches": return value / 12;
      case "centimeters": return value / 30.48;
      case "meters": return value * 3.28084;
      case "yards": return value * 3;
      case "feet":
      default: return value;
    }
  };

  // Calc 1 Logic
  const lVal = parseFloat(cfLength);
  const wVal = parseFloat(cfWidth);
  const hVal = parseFloat(cfHeight);

  const isLValid = !isNaN(lVal) && lVal > 0;
  const isWValid = !isNaN(wVal) && wVal > 0;
  const isHValid = !isNaN(hVal) && hVal > 0;

  const isCfTouched = cfLength !== "" || cfWidth !== "" || cfHeight !== "";

  const showCfWarnL = isCfTouched && (!isLValid);
  const showCfWarnW = isCfTouched && (!isWValid);
  const showCfWarnH = isCfTouched && (!isHValid);

  useEffect(() => {
    if (isLValid && isWValid && isHValid) {
      const lFeet = convertToFeet(lVal, cfUnit);
      const wFeet = convertToFeet(wVal, cfUnit);
      const hFeet = convertToFeet(hVal, cfUnit);

      const cubicFeet = lFeet * wFeet * hFeet;

      setCfRes({
        feet: cubicFeet,
        inches: cubicFeet * 1728,
        meters: cubicFeet / 35.3147,
        yards: cubicFeet / 27,
      });
    } else {
      setCfRes(null);
    }
  }, [cfLength, cfWidth, cfHeight, cfUnit, isLValid, isWValid, isHValid, lVal, wVal, hVal]);

  // Calc 2 Logic
  const cftyVal = parseFloat(cftyInput);
  const isCftyValid = !isNaN(cftyVal) && cftyVal >= 0;
  const showCftyWarn = cftyInput !== "" && !isCftyValid;

  useEffect(() => {
    if (isCftyValid && cftyInput !== "") {
      const cubicFeet = cftyVal;

      setCftyRes({
        yards: cubicFeet / 27,
        feet: cubicFeet,
        inches: cubicFeet * 1728,
        meters: cubicFeet / 35.3147,
      });
    } else {
      setCftyRes(null);
    }
  }, [cftyInput, isCftyValid, cftyVal]);

  // Calc 3 Logic
  const v1 = parseFloat(ccLength);
  const v2 = parseFloat(ccWidth) || 0;
  const v3 = parseFloat(ccHeight) || 0;

  const isCc1Valid = !isNaN(v1) && v1 > 0;
  const isCc2Valid = ccShape !== "rectangular" || (!isNaN(v2) && v2 > 0);
  const isCc3Valid = ccShape === "cube" || (!isNaN(v3) && v3 > 0);

  const isCcTouched = ccLength !== "" || ccWidth !== "" || ccHeight !== "";

  const showCcWarnL = isCcTouched && !isCc1Valid;
  const showCcWarnW = ccShape === "rectangular" && isCcTouched && !isCc2Valid;
  const showCcWarnH = ccShape !== "cube" && isCcTouched && !isCc3Valid;

  useEffect(() => {
    if (isCc1Valid && isCc2Valid && isCc3Valid) {
      let volumeBase = 0;

      if (ccShape === "cube") {
        volumeBase = Math.pow(v1, 3);
      } else if (ccShape === "rectangular") {
        volumeBase = v1 * v2 * v3;
      } else if (ccShape === "cylinder") {
        volumeBase = Math.PI * Math.pow(v1, 2) * v3;
      }

      let cubicFeet = 0;

      if (ccUnit === "inches") cubicFeet = volumeBase / 1728;
      else if (ccUnit === "feet") cubicFeet = volumeBase;
      else if (ccUnit === "centimeters") cubicFeet = volumeBase / 28316.8466;
      else if (ccUnit === "meters") cubicFeet = volumeBase * 35.3147;

      setCcRes({
        volume: volumeBase,
        feet: cubicFeet,
        yards: cubicFeet / 27,
        inches: cubicFeet * 1728,
        meters: cubicFeet / 35.3147,
      });
    } else {
      setCcRes(null);
    }
  }, [ccShape, ccLength, ccWidth, ccHeight, ccUnit, isCc1Valid, isCc2Valid, isCc3Valid, v1, v2, v3]);

  // Calc 4 Logic
  const volVal = parseFloat(cfmVol);
  const timeVal = parseFloat(cfmTime);

  const isVolValid = !isNaN(volVal) && volVal >= 0;
  const isTimeValid = !isNaN(timeVal) && timeVal > 0;

  const isCfmTouched = cfmVol !== "" || cfmTime !== "";

  const showCfmWarnVol = isCfmTouched && !isVolValid;
  const showCfmWarnTime = isCfmTouched && !isTimeValid;

  useEffect(() => {
    if (isVolValid && isTimeValid && cfmVol !== "" && cfmTime !== "") {
      let cfm = 0;

      if (cfmTimeUnit === "minutes") cfm = volVal / timeVal;
      else if (cfmTimeUnit === "seconds") cfm = (volVal / timeVal) * 60;

      setCfmRes({
        min: cfm,
        hour: cfm * 60,
        sec: cfm / 60,
      });
    } else {
      setCfmRes(null);
    }
  }, [cfmVol, cfmTime, cfmTimeUnit, isVolValid, isTimeValid, volVal, timeVal]);

  return (
    <div className="cubic-wrapper-box">

      <h1 className="cubic-main-h1">{currentConfig.h1Title}</h1>

      <div className="cubic-tab-container">
        <button className={`cubic-tab-btn ${activeTab === 0 ? "active" : ""}`} onClick={() => switchTab(0)}>
          Calculate Cubic Feet
        </button>

        <button className={`cubic-tab-btn ${activeTab === 1 ? "active" : ""}`} onClick={() => switchTab(1)}>
          Cubic Feet to Yard
        </button>

        <button className={`cubic-tab-btn ${activeTab === 2 ? "active" : ""}`} onClick={() => switchTab(2)}>
          Cubic Calculator
        </button>

        <button className={`cubic-tab-btn ${activeTab === 3 ? "active" : ""}`} onClick={() => switchTab(3)}>
          CFM Calculator
        </button>
      </div>

      {/* 1. Calculate Cubic Feet */}
      <div className={`cubic-calculator-section ${activeTab === 0 ? "active" : ""}`}>
        <div className="cubic-row-inputs">
          <div className="cubic-form-group">
            <label className="cubic-label">Length</label>
            <input
              type="number"
              className="cubic-input"
              value={cfLength}
              placeholder="Enter length"
              step="any"
              min="0"
              onChange={(e) => setCfLength(e.target.value)}
            />
            <span className="cubic-warning-text" style={{ display: showCfWarnL ? "block" : "none" }}>
              Please complete your Length (positive value required)
            </span>
          </div>

          <div className="cubic-form-group">
            <label className="cubic-label">Width</label>
            <input
              type="number"
              className="cubic-input"
              value={cfWidth}
              placeholder="Enter width"
              step="any"
              min="0"
              onChange={(e) => setCfWidth(e.target.value)}
            />
            <span className="cubic-warning-text" style={{ display: showCfWarnW ? "block" : "none" }}>
              Please complete your Width (positive value required)
            </span>
          </div>
        </div>

        <div className="cubic-row-inputs">
          <div className="cubic-form-group">
            <label className="cubic-label">Height</label>
            <input
              type="number"
              className="cubic-input"
              value={cfHeight}
              placeholder="Enter height"
              step="any"
              min="0"
              onChange={(e) => setCfHeight(e.target.value)}
            />
            <span className="cubic-warning-text" style={{ display: showCfWarnH ? "block" : "none" }}>
              Please complete your Height (positive value required)
            </span>
          </div>

          <div className="cubic-form-group">
            <label className="cubic-label">Measurement Unit</label>
            <select className="cubic-select" value={cfUnit} onChange={(e) => setCfUnit(e.target.value)}>
              <option value="feet">Feet</option>
              <option value="inches">Inches</option>
              <option value="centimeters">Centimeters</option>
              <option value="meters">Meters</option>
              <option value="yards">Yards</option>
            </select>
          </div>
        </div>

        <div className={`cubic-result-box ${cfRes ? "active" : ""}`}>
          <h3>Calculation Results</h3>

          <div className="cubic-primary-result">
            <div className="cubic-primary-label">Total Cubic Feet</div>
            <div className="cubic-primary-value">{cfRes ? cfRes.feet.toFixed(4) + " ft³" : "0.0000 ft³"}</div>
          </div>

          <div className="cubic-sub-results-title">Additional Conversions</div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Inches</span>
            <span className="cubic-result-value">{cfRes ? cfRes.inches.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " in³" : "0.00 in³"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Meters</span>
            <span className="cubic-result-value">{cfRes ? cfRes.meters.toFixed(4) + " m³" : "0.0000 m³"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Yards</span>
            <span className="cubic-result-value">{cfRes ? cfRes.yards.toFixed(4) + " yd³" : "0.0000 yd³"}</span>
          </div>

          <div className="cubic-formula-box">Formula: Cubic Feet = Length x Width x Height (Converted to Feet)</div>
        </div>
      </div>

      {/* 2. Cubic Feet to Yard */}
      <div className={`cubic-calculator-section ${activeTab === 1 ? "active" : ""}`}>
        <div className="cubic-form-group">
          <label className="cubic-label">Cubic Feet</label>
          <input
            type="number"
            className="cubic-input"
            value={cftyInput}
            placeholder="Enter cubic feet"
            step="any"
            min="0"
            onChange={(e) => setCftyInput(e.target.value)}
          />
          <span className="cubic-warning-text" style={{ display: showCftyWarn ? "block" : "none" }}>
            Please complete your Cubic Feet (positive value required)
          </span>
        </div>

        <div className={`cubic-result-box ${cftyRes ? "active" : ""}`}>
          <h3>Conversion Results</h3>

          <div className="cubic-primary-result">
            <div className="cubic-primary-label">Cubic Yards</div>
            <div className="cubic-primary-value">{cftyRes ? cftyRes.yards.toFixed(4) + " yd³" : "0.0000 yd³"}</div>
          </div>

          <div className="cubic-sub-results-title">Additional Conversions</div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Feet</span>
            <span className="cubic-result-value">{cftyRes ? cftyRes.feet.toFixed(4) + " ft³" : "0.0000 ft³"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Inches</span>
            <span className="cubic-result-value">{cftyRes ? cftyRes.inches.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " in³" : "0.00 in³"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Meters</span>
            <span className="cubic-result-value">{cftyRes ? cftyRes.meters.toFixed(4) + " m³" : "0.0000 m³"}</span>
          </div>

          <div className="cubic-formula-box">Formula: 1 Cubic Yard = 27 Cubic Feet | Cubic Yards = Cubic Feet / 27</div>
        </div>
      </div>

      {/* 3. Cubic Calculator */}
      <div className={`cubic-calculator-section ${activeTab === 2 ? "active" : ""}`}>
        <div className="cubic-form-group">
          <label className="cubic-label">Shape Selection</label>
          <select className="cubic-select" value={ccShape} onChange={(e) => setCcShape(e.target.value)}>
            <option value="cube">Cube</option>
            <option value="rectangular">Rectangular Box</option>
            <option value="cylinder">Cylinder</option>
          </select>
        </div>

        <div className="cubic-row-inputs">
          <div className="cubic-form-group">
            <label className="cubic-label">
              {ccShape === "cylinder" ? "Radius" : ccShape === "cube" ? "Side Length" : "Length"}
            </label>
            <input
              type="number"
              className="cubic-input"
              value={ccLength}
              placeholder="Enter value"
              step="any"
              min="0"
              onChange={(e) => setCcLength(e.target.value)}
            />
            <span className="cubic-warning-text" style={{ display: showCcWarnL ? "block" : "none" }}>
              Please complete your value (positive value required)
            </span>
          </div>

          {ccShape === "rectangular" && (
            <div className="cubic-form-group">
              <label className="cubic-label">Width</label>
              <input
                type="number"
                className="cubic-input"
                value={ccWidth}
                placeholder="Enter width"
                step="any"
                min="0"
                onChange={(e) => setCcWidth(e.target.value)}
              />
              <span className="cubic-warning-text" style={{ display: showCcWarnW ? "block" : "none" }}>
                Please complete your Width (positive value required)
              </span>
            </div>
          )}
        </div>

        {ccShape !== "cube" && (
          <div className="cubic-row-inputs">
            <div className="cubic-form-group">
              <label className="cubic-label">Height / Depth</label>
              <input
                type="number"
                className="cubic-input"
                value={ccHeight}
                placeholder="Enter height"
                step="any"
                min="0"
                onChange={(e) => setCcHeight(e.target.value)}
              />
              <span className="cubic-warning-text" style={{ display: showCcWarnH ? "block" : "none" }}>
                Please complete your Height (positive value required)
              </span>
            </div>

            <div className="cubic-form-group">
              <label className="cubic-label">Measurement Unit</label>
              <select className="cubic-select" value={ccUnit} onChange={(e) => setCcUnit(e.target.value)}>
                <option value="inches">Inches</option>
                <option value="feet">Feet</option>
                <option value="centimeters">Centimeters</option>
                <option value="meters">Meters</option>
              </select>
            </div>
          </div>
        )}

        {ccShape === "cube" && (
          <div className="cubic-form-group">
            <label className="cubic-label">Measurement Unit</label>
            <select className="cubic-select" value={ccUnit} onChange={(e) => setCcUnit(e.target.value)}>
              <option value="inches">Inches</option>
              <option value="feet">Feet</option>
              <option value="centimeters">Centimeters</option>
              <option value="meters">Meters</option>
            </select>
          </div>
        )}

        <div className={`cubic-result-box ${ccRes ? "active" : ""}`}>
          <h3>Volume Results</h3>

          <div className="cubic-primary-result">
            <div className="cubic-primary-label">Total Volume</div>
            <div className="cubic-primary-value">{ccRes ? ccRes.volume.toFixed(4) + " " + ccUnit + "³" : "0.0000"}</div>
          </div>

          <div className="cubic-sub-results-title">Additional Conversions</div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Feet</span>
            <span className="cubic-result-value">{ccRes ? ccRes.feet.toFixed(4) + " ft³" : "0.0000 ft³"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Yards</span>
            <span className="cubic-result-value">{ccRes ? ccRes.yards.toFixed(4) + " yd³" : "0.0000 yd³"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Inches</span>
            <span className="cubic-result-value">{ccRes ? ccRes.inches.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " in³" : "0.00 in³"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Meters</span>
            <span className="cubic-result-value">{ccRes ? ccRes.meters.toFixed(4) + " m³" : "0.0000 m³"}</span>
          </div>

          <div className="cubic-formula-box">Formula: Shape Volume Calculation based on dimensions</div>
        </div>
      </div>

      {/* 4. CFM Calculator */}
      <div className={`cubic-calculator-section ${activeTab === 3 ? "active" : ""}`}>
        <div className="cubic-row-inputs">
          <div className="cubic-form-group">
            <label className="cubic-label">Volume (Cubic Feet)</label>
            <input
              type="number"
              className="cubic-input"
              value={cfmVol}
              placeholder="Enter volume"
              step="any"
              min="0"
              onChange={(e) => setCfmVol(e.target.value)}
            />
            <span className="cubic-warning-text" style={{ display: showCfmWarnVol ? "block" : "none" }}>
              Please complete your Volume (positive value required)
            </span>
          </div>

          <div className="cubic-form-group">
            <label className="cubic-label">Time</label>
            <input
              type="number"
              className="cubic-input"
              value={cfmTime}
              placeholder="Enter time"
              step="any"
              min="0"
              onChange={(e) => setCfmTime(e.target.value)}
            />
            <span className="cubic-warning-text" style={{ display: showCfmWarnTime ? "block" : "none" }}>
              Please complete your Time (must be greater than 0)
            </span>
          </div>
        </div>

        <div className="cubic-form-group">
          <label className="cubic-label">Time Unit</label>
          <select className="cubic-select" value={cfmTimeUnit} onChange={(e) => setCfmTimeUnit(e.target.value)}>
            <option value="minutes">Minutes</option>
            <option value="seconds">Seconds</option>
          </select>
        </div>

        <div className={`cubic-result-box ${cfmRes ? "active" : ""}`}>
          <h3>Airflow Results</h3>

          <div className="cubic-primary-result">
            <div className="cubic-primary-label">Cubic Feet Per Minute (CFM)</div>
            <div className="cubic-primary-value">{cfmRes ? cfmRes.min.toFixed(4) + " CFM" : "0.0000 CFM"}</div>
          </div>

          <div className="cubic-sub-results-title">Additional Conversions</div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Feet Per Hour (CFH)</span>
            <span className="cubic-result-value">{cfmRes ? cfmRes.hour.toFixed(2) + " CFH" : "0.00 CFH"}</span>
          </div>

          <div className="cubic-result-item">
            <span className="cubic-result-label">Cubic Feet Per Second (CFS)</span>
            <span className="cubic-result-value">{cfmRes ? cfmRes.sec.toFixed(4) + " CFS" : "0.0000 CFS"}</span>
          </div>

          <div className="cubic-formula-box">Formula: CFM = Cubic Feet / Time (Minutes)</div>
        </div>
      </div>

      {/* SEO Intro, Article & FAQ Section */}
      <div className="cubic-seo-container">
        <p className="cubic-seo-intro">{currentConfig.introText}</p>

        <h2 className="cubic-seo-article-title">{currentConfig.article.title}</h2>

        {currentConfig.article.sections.map((sec, idx) => (
          <div key={idx} className="cubic-seo-section">
            {sec.level === "h2" && <h2 className="cubic-seo-heading">{sec.heading}</h2>}
            {sec.level === "h3" && <h3 className="cubic-seo-heading">{sec.heading}</h3>}
            {sec.level === "h4" && <h4 className="cubic-seo-heading">{sec.heading}</h4>}

            <p className="cubic-seo-text">{sec.content}</p>
          </div>
        ))}

        <h3 className="cubic-seo-faq-title" style={{ marginTop: "30px" }}>
          Frequently Asked Questions
        </h3>

        <div className="cubic-faq-list">
          {currentConfig.faqs.map((faq, index) => (
            <div key={index} className="cubic-faq-item">
              <button
                className="cubic-faq-question"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span>{openFaqIndex === index ? "▲" : "▼"}</span>
              </button>

              {openFaqIndex === index && (
                <div className="cubic-faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}