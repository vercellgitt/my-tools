"use client";

import React, { useState, useEffect } from "react";
import "./maintenance-calorie-calculator.css";
import { maintenanceCalorieFaqs } from "./faq";

export default function MaintenanceCalorieCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [heightFt, setHeightFt] = useState<string>("");
  const [heightIn, setHeightIn] = useState<string>("");
  const [activity, setActivity] = useState<string>("1.2");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [results, setResults] = useState<{
    bmr: number;
    tdee: number;
    maintenance: number;
    weekly: number;
    monthly: number;
    extremeLoss: number;
    mildLoss: number;
    mildGain: number;
    extremeGain: number;
  } | null>(null);

  useEffect(() => {
    calculate();
  }, [unit, gender, age, weight, heightCm, heightFt, heightIn, activity]);

  const calculate = () => {
    const errs: { [key: string]: string } = {};
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);

    if (!age || isNaN(ageNum) || ageNum <= 0) {
      errs.age = "Please enter your Age (Years)";
    }

    if (!weight || isNaN(weightNum) || weightNum <= 0) {
      errs.weight = `Please enter your Weight (${unit === "metric" ? "kg" : "lbs"})`;
    }

    let calculatedHeightCm = 0;
    if (unit === "metric") {
      const hCm = parseFloat(heightCm);
      if (!heightCm || isNaN(hCm) || hCm <= 0) {
        errs.heightCm = "Please enter your Height (cm)";
      } else {
        calculatedHeightCm = hCm;
      }
    } else {
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      if (ft <= 0 && inch <= 0) {
        errs.heightFt = "Please enter Height (ft)";
        errs.heightIn = "Please enter Height (in)";
      } else if (inch < 0 || inch >= 12) {
        errs.heightIn = "Inches must be between 0 and 11";
      } else {
        calculatedHeightCm = (ft * 12 + inch) * 2.54;
      }
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      setResults(null);
      return;
    }

    let weightKg = weightNum;
    if (unit === "imperial") {
      weightKg = weightNum * 0.453592;
    }

    let bmrVal = 10 * weightKg + 6.25 * calculatedHeightCm - 5 * ageNum;
    if (gender === "male") {
      bmrVal += 5;
    } else {
      bmrVal -= 161;
    }

    const actFactor = parseFloat(activity);
    const tdeeVal = Math.round(bmrVal * actFactor);

    setResults({
      bmr: Math.round(bmrVal),
      tdee: tdeeVal,
      maintenance: tdeeVal,
      weekly: tdeeVal * 7,
      monthly: tdeeVal * 30,
      extremeLoss: tdeeVal - 500,
      mildLoss: tdeeVal - 250,
      mildGain: tdeeVal + 250,
      extremeGain: tdeeVal + 500,
    });
  };

  const handleReset = () => {
    setAge("");
    setWeight("");
    setHeightCm("");
    setHeightFt("");
    setHeightIn("");
    setGender("male");
    setUnit("metric");
    setActivity("1.2");
    setErrors({});
    setResults(null);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Structured Data Schema Markup (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "Maintenance Calorie Calculator",
        "url": "https://yourdomain.com/maintenance-calorie-calculator",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "All",
        "description":
          "Calculate your daily maintenance calorie needs with precision. Estimate BMR, TDEE, and weight management caloric intake targets easily."
      },
      {
        "@type": "FAQPage",
        "mainEntity": maintenanceCalorieFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="maintenance-calorie1">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Interactive Tool */}
      <div className="maintenance-calorie2">
        <h1 className="maintenance-calorie3">Maintenance Calorie Calculator</h1>

        <div className="maintenance-calorie4">
          <label className="maintenance-calorie5" htmlFor="mc-unit">
            Unit Selection
          </label>
          <select
            id="mc-unit"
            className="maintenance-calorie6"
            value={unit}
            onChange={(e) => setUnit(e.target.value as "metric" | "imperial")}
          >
            <option value="metric">Metric (kg, cm)</option>
            <option value="imperial">Imperial (lbs, ft/in)</option>
          </select>
        </div>

        <div className="maintenance-calorie4">
          <label className="maintenance-calorie5" htmlFor="mc-gender">
            Gender
          </label>
          <select
            id="mc-gender"
            className="maintenance-calorie6"
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="maintenance-calorie4">
          <label className="maintenance-calorie5" htmlFor="mc-age">
            Age (Years)
          </label>
          <input
            type="number"
            id="mc-age"
            className={`maintenance-calorie6 ${errors.age ? "maintenance-calorie7" : ""}`}
            placeholder="e.g. 25"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          {errors.age && <div className="maintenance-calorie8">{errors.age}</div>}
        </div>

        <div className="maintenance-calorie4">
          <label className="maintenance-calorie5" htmlFor="mc-weight">
            Weight ({unit === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            id="mc-weight"
            step="0.1"
            className={`maintenance-calorie6 ${errors.weight ? "maintenance-calorie7" : ""}`}
            placeholder="e.g. 70"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          {errors.weight && <div className="maintenance-calorie8">{errors.weight}</div>}
        </div>

        {unit === "metric" ? (
          <div className="maintenance-calorie4">
            <label className="maintenance-calorie5" htmlFor="mc-height-cm">
              Height (cm)
            </label>
            <input
              type="number"
              id="mc-height-cm"
              step="0.1"
              className={`maintenance-calorie6 ${errors.heightCm ? "maintenance-calorie7" : ""}`}
              placeholder="e.g. 175"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
            />
            {errors.heightCm && (
              <div className="maintenance-calorie8">{errors.heightCm}</div>
            )}
          </div>
        ) : (
          <div className="maintenance-calorie9">
            <div className="maintenance-calorie4 maintenance-calorie10">
              <label className="maintenance-calorie5" htmlFor="mc-height-ft">
                Height (ft)
              </label>
              <input
                type="number"
                id="mc-height-ft"
                className={`maintenance-calorie6 ${errors.heightFt ? "maintenance-calorie7" : ""}`}
                placeholder="e.g. 5"
                value={heightFt}
                onChange={(e) => setHeightFt(e.target.value)}
              />
              {errors.heightFt && (
                <div className="maintenance-calorie8">{errors.heightFt}</div>
              )}
            </div>
            <div className="maintenance-calorie4 maintenance-calorie10">
              <label className="maintenance-calorie5" htmlFor="mc-height-in">
                Height (in)
              </label>
              <input
                type="number"
                id="mc-height-in"
                max="11"
                className={`maintenance-calorie6 ${errors.heightIn ? "maintenance-calorie7" : ""}`}
                placeholder="e.g. 9"
                value={heightIn}
                onChange={(e) => setHeightIn(e.target.value)}
              />
              {errors.heightIn && (
                <div className="maintenance-calorie8">{errors.heightIn}</div>
              )}
            </div>
          </div>
        )}

        <div className="maintenance-calorie4">
          <label className="maintenance-calorie5" htmlFor="mc-activity">
            Activity Level
          </label>
          <select
            id="mc-activity"
            className="maintenance-calorie6"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="1.2">Sedentary (Little or no exercise)</option>
            <option value="1.375">Lightly Active (1–3 days/week)</option>
            <option value="1.55">Moderately Active (3–5 days/week)</option>
            <option value="1.725">Very Active (6–7 days/week)</option>
            <option value="1.9">Extra Active (Very intense exercise or physical job)</option>
          </select>
        </div>

        {results && (
          <div className="maintenance-calorie13">
            <h3 className="maintenance-calorie14">Primary Results</h3>
            <div className="maintenance-calorie15">
              <span>Maintenance Calories:</span>
              <span className="maintenance-calorie16">{results.maintenance} kcal</span>
            </div>
            <div className="maintenance-calorie15">
              <span>Basal Metabolic Rate (BMR):</span>
              <span className="maintenance-calorie16">{results.bmr} kcal</span>
            </div>
            <div className="maintenance-calorie15">
              <span>Total Daily Energy Expenditure (TDEE):</span>
              <span className="maintenance-calorie16">{results.tdee} kcal</span>
            </div>
            <div className="maintenance-calorie15">
              <span>Weekly Maintenance Calories:</span>
              <span className="maintenance-calorie16">
                {results.weekly.toLocaleString()} kcal
              </span>
            </div>
            <div className="maintenance-calorie15">
              <span>Monthly Maintenance Calories:</span>
              <span className="maintenance-calorie16">
                {results.monthly.toLocaleString()} kcal
              </span>
            </div>

            <h3 className="maintenance-calorie14" style={{ marginTop: "24px" }}>
              Goal-based Calorie Results
            </h3>
            <table className="maintenance-calorie17">
              <thead>
                <tr>
                  <th>Goal</th>
                  <th>Daily Calories</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Weight Loss (-500 kcal)</td>
                  <td>{results.extremeLoss} kcal</td>
                </tr>
                <tr>
                  <td>Mild Weight Loss (-250 kcal)</td>
                  <td>{results.mildLoss} kcal</td>
                </tr>
                <tr>
                  <td>Maintenance</td>
                  <td>{results.maintenance} kcal</td>
                </tr>
                <tr>
                  <td>Mild Weight Gain (+250 kcal)</td>
                  <td>{results.mildGain} kcal</td>
                </tr>
                <tr>
                  <td>Weight Gain (+500 kcal)</td>
                  <td>{results.extremeGain} kcal</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {results && (
          <div className="maintenance-calorie11">
            <button className="maintenance-calorie12" onClick={handleReset}>
              Reset
            </button>
          </div>
        )}
      </div>

      {/* SEO Content & Information Below Tool */}
      <div className="maintenance-calorie18">
        <h2 className="maintenance-calorie19">
          Maintenance Calorie Calculator: Free Daily Caloric Needs Tool
        </h2>
        <p className="maintenance-calorie21">
          Understanding your daily metabolic energy requirements is essential for long-term health and weight management success. Our maintenance calorie calculator gives you an exact baseline of daily caloric intake required to maintain your present weight completely steady without unwanted weight fluctuations.
        </p>

        <h2 className="maintenance-calorie20">
          How Maintenance Calories Are Calculated Accurate Baseline
        </h2>
        <p className="maintenance-calorie21">
          Maintenance calories represent the baseline energy expended through daily cellular maintenance, organic function, and physical movements. We calculate this baseline using clinically validated Mifflin-St Jeor formulations combined with standardized activity physical multipliers.
        </p>

        <h2 className="maintenance-calorie20">
          BMR Formula Details (Mifflin-St Jeor Equation)
        </h2>
        <p className="maintenance-calorie21">
          For Males: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5
        </p>
        <p className="maintenance-calorie21">
          For Females: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
        </p>

        {/* Dynamic Accordion FAQ Section */}
        <div className="maintenance-calorie22">
          <h2 className="maintenance-calorie19">Frequently Asked Questions (FAQ)</h2>
          {maintenanceCalorieFaqs.map((faq, index) => {
            const Tag = faq.tag || "h2";
            return (
              <div key={index} className="maintenance-calorie23">
                <button
                  className="maintenance-calorie24"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <Tag style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit" }}>
                    {faq.question}
                  </Tag>
                  <span
                    className={`maintenance-calorie26 ${
                      openFaqIndex === index ? "open" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="maintenance-calorie25">
                    <p style={{ margin: 0 }}>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}