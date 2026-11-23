"use client";

import React, { useMemo, useState } from "react";
import "./body-mass-index-calculator-bmi.css";
import { bodyMassIndexCalculatorBmiFaqs } from "./faq";
import DOMPurify from "isomorphic-dompurify";

type HeightUnit = "cm" | "ft" | "in";
type WeightUnit = "kg" | "lbs";

interface CategoryInfo {
  label: string;
  className: string;
}

function toMeters(value: string, unit: HeightUnit): number | null {
  const num = parseFloat(value);
  if (Number.isNaN(num) || num <= 0) return null;
  if (unit === "cm") return num / 100;
  if (unit === "ft") return num * 0.3048;
  if (unit === "in") return num * 0.0254;
  return null;
}

function toKg(value: string, unit: WeightUnit): number | null {
  const num = parseFloat(value);
  if (Number.isNaN(num) || num <= 0) return null;
  if (unit === "kg") return num;
  if (unit === "lbs") return num * 0.45359237;
  return null;
}

function getCategory(bmi: number): CategoryInfo {
  if (bmi < 18.5) return { label: "Underweight", className: "calculator-bmi19" };
  if (bmi < 25) return { label: "Normal Weight", className: "calculator-bmi20" };
  if (bmi < 30) return { label: "Overweight", className: "calculator-bmi21" };
  if (bmi < 35) return { label: "Obese Class 1", className: "calculator-bmi22" };
  if (bmi < 40) return { label: "Obese Class 2", className: "calculator-bmi23" };
  return { label: "Obese Class 3", className: "calculator-bmi24" };
}

function formatWeight(kg: number, unit: WeightUnit): string {
  if (unit === "lbs") {
    return `${(kg / 0.45359237).toFixed(1)} lbs`;
  }
  return `${kg.toFixed(1)} kg`;
}

export default function BodyMassIndexCalculatorBmi() {
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // প্রতিটি ইনপুট ফিল্ডের জন্য ডাইনামিক চেকিং ও ওয়ার্নিং শর্ত
  const ageMissing = age.trim() === "";
  const genderMissing = gender === "";
  const heightMissing = height.trim() === "";
  const weightMissing = weight.trim() === "";

  const calculation = useMemo(() => {
    const meters = toMeters(height, heightUnit);
    const kg = toKg(weight, weightUnit);

    if (meters === null || kg === null) {
      return null;
    }

    const bmi = kg / (meters * meters);
    const category = getCategory(bmi);

    const minHealthy = 18.5 * meters * meters;
    const maxHealthy = 24.9 * meters * meters;

    let diffText: string;
    if (bmi < 18.5) {
      const need = minHealthy - kg;
      diffText =
        weightUnit === "lbs"
          ? `${(need / 0.45359237).toFixed(1)} lbs under healthy range`
          : `${need.toFixed(1)} kg under healthy range`;
    } else if (bmi > 24.9) {
      const excess = kg - maxHealthy;
      diffText =
        weightUnit === "lbs"
          ? `${(excess / 0.45359237).toFixed(1)} lbs over healthy range`
          : `${excess.toFixed(1)} kg over healthy range`;
    } else {
      diffText = "Within healthy range";
    }

    const prime = bmi / 25;
    const ponderal = kg / (meters * meters * meters);

    let pos = ((bmi - 15) / 30) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;

    return {
      bmiScore: bmi.toFixed(1),
      category,
      healthyRange: `${formatWeight(minHealthy, weightUnit)} – ${formatWeight(
        maxHealthy,
        weightUnit
      )}`,
      weightDiff: diffText,
      bmiPrime: prime.toFixed(2),
      ponderal: ponderal.toFixed(1),
      markerLeft: `${pos}%`,
    };
  }, [height, heightUnit, weight, weightUnit]);

  const handleToggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="calculator-bmi1">
      <div className="calculator-bmi2">
        <div className="calculator-bmi3">Calculate Your BMI</div>
        <div className="calculator-bmi4">
          <div className="calculator-bmi5">
            <label htmlFor="bmi-age" className="calculator-bmi6">
              Age
            </label>
            <input
              type="number"
              id="bmi-age"
              className="calculator-bmi8"
              min={1}
              max={120}
              placeholder="e.g. 30"
              inputMode="numeric"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            {/* Age missing থাকলে calculator-bmi12 (opacity 1) পাবে */}
            <div
              className={`calculator-bmi11 ${
                ageMissing ? "calculator-bmi12" : ""
              }`}
            >
              Please enter your age.
            </div>
          </div>

          <div className="calculator-bmi5">
            <label htmlFor="bmi-gender" className="calculator-bmi6">
              Gender
            </label>
            <select
              id="bmi-gender"
              className="calculator-bmi9"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {/* Gender missing থাকলে calculator-bmi12 (opacity 1) পাবে */}
            <div
              className={`calculator-bmi11 ${
                genderMissing ? "calculator-bmi12" : ""
              }`}
            >
              Please complete your gender.
            </div>
          </div>

          <div className="calculator-bmi5">
            <label htmlFor="bmi-height" className="calculator-bmi6">
              Height
            </label>
            <div className="calculator-bmi7">
              <input
                type="number"
                id="bmi-height"
                className="calculator-bmi8"
                min={1}
                step="any"
                placeholder="e.g. 175"
                inputMode="decimal"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
              <select
                id="bmi-height-unit"
                aria-label="Height unit"
                className="calculator-bmi9 calculator-bmi10"
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value as HeightUnit)}
              >
                <option value="cm">cm</option>
                <option value="ft">ft</option>
                <option value="in">inch</option>
              </select>
            </div>
            <div
              className={`calculator-bmi11 ${
                heightMissing ? "calculator-bmi12" : ""
              }`}
            >
              Please enter your height.
            </div>
          </div>

          <div className="calculator-bmi5">
            <label htmlFor="bmi-weight" className="calculator-bmi6">
              Weight
            </label>
            <div className="calculator-bmi7">
              <input
                type="number"
                id="bmi-weight"
                className="calculator-bmi8"
                min={1}
                step="any"
                placeholder="e.g. 70"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <select
                id="bmi-weight-unit"
                aria-label="Weight unit"
                className="calculator-bmi9 calculator-bmi10"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
            <div
              className={`calculator-bmi11 ${
                weightMissing ? "calculator-bmi12" : ""
              }`}
            >
              Please enter your weight.
            </div>
          </div>
        </div>
      </div>

      <div
        className={`calculator-bmi2 calculator-bmi13 ${
          calculation ? "calculator-bmi14" : ""
        }`}
      >
        <div className="calculator-bmi3">Your Results</div>

        <div className="calculator-bmi15">
          <div className="calculator-bmi16">
            {calculation ? calculation.bmiScore : "--"}
          </div>
          <div className="calculator-bmi17">BMI Score</div>
          <div
            className={`calculator-bmi18 ${
              calculation ? calculation.category.className : ""
            }`}
          >
            {calculation ? calculation.category.label : "--"}
          </div>
        </div>

        <div className="calculator-bmi25">
          <div className="calculator-bmi26">
            <div className="calculator-bmi27">Healthy Weight Range</div>
            <div className="calculator-bmi28">
              {calculation ? calculation.healthyRange : "--"}
            </div>
          </div>
          <div className="calculator-bmi26">
            <div className="calculator-bmi27">Weight Difference</div>
            <div className="calculator-bmi28">
              {calculation ? calculation.weightDiff : "--"}
            </div>
          </div>
          <div className="calculator-bmi26">
            <div className="calculator-bmi27">BMI Prime</div>
            <div className="calculator-bmi28">
              {calculation ? calculation.bmiPrime : "--"}
            </div>
          </div>
          <div className="calculator-bmi26">
            <div className="calculator-bmi27">Ponderal Index</div>
            <div className="calculator-bmi28">
              {calculation ? calculation.ponderal : "--"}
            </div>
          </div>
        </div>

        <div className="calculator-bmi29">
          <div className="calculator-bmi30">BMI Scale</div>
          <div className="calculator-bmi31">
            <div
              className="calculator-bmi32"
              style={{ left: calculation ? calculation.markerLeft : "0%" }}
            />
          </div>
          <div className="calculator-bmi33">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>35</span>
            <span>40+</span>
          </div>
        </div>

        <p className="calculator-bmi34">
          Note: Standard BMI categories apply to adults. For individuals under 20
          years of age, age- and gender-specific BMI percentiles are
          recommended. BMI is a screening tool and not a diagnostic measure of
          health.
        </p>
      </div>

      <h1 className="calculator-bmi35">Body Mass Index Calculator BMI</h1>
<p className="calculator-bmi36">
  A body mass index calculator helps you calculate your BMI using your height
  and weight. Your BMI score provides a general indication of whether your
  body weight falls within the underweight, normal, overweight, or obesity
  category. This simple calculation makes checking your BMI quick and easy.
</p>

<p className="calculator-bmi36">
  A BMI chart and body mass index chart help you understand different BMI
  ranges. For most adults, a normal BMI is between 18.5 and 24.9. Knowing
  your BMI index can help you understand your weight category and monitor
  changes over time.
</p>

<p className="calculator-bmi36">
  Understanding BMI values such as 25, 27, 29, 30, and 35 can help you
  interpret your body weight status. These numbers represent different
  adult BMI categories, but BMI alone cannot determine your overall health
  or directly measure body fat.
</p>

<p className="calculator-bmi36">
  Your healthy BMI and ideal BMI range are useful reference points, not
  individual health diagnoses. Measurements such as body fat percentage
  and lean body mass provide additional information about body composition.
  For personalized guidance, consider discussing your BMI results with a
  qualified healthcare professional.
</p>

{/* Internal Links */}
<div className="maintenance-1">
  <p>You may also find these useful tools:</p>

  <p
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(`
        <a href="/daily-water-intake-calculator">Your Precise Hydration Needs</a>
        <a href="/maintenance-calorie-calculator">Check Your Maintenance Calories</a>
      `)
    }}
  />
</div>




      <div className="calculator-bmi37">
        <h2 className="calculator-bmi38">
          Body Mass Index Calculator BMI Frequently Asked Questions
        </h2>

        {bodyMassIndexCalculatorBmiFaqs.map((item, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div
              key={item.question}
              className={`calculator-bmi39 ${isOpen ? "calculator-bmi42" : ""}`}
            >
              <button
                type="button"
                className="calculator-bmi40"
                aria-expanded={isOpen}
                onClick={() => handleToggleFaq(index)}
              >
                <h2>{item.question}</h2>
                <span className="calculator-bmi41">^</span>
              </button>
              <div
                className="calculator-bmi43"
                style={{
                  maxHeight: isOpen ? "600px" : "0px",
                }}
              >
                <div className="calculator-bmi44">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}