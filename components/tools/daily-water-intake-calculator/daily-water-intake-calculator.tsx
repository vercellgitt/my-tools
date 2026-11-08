"use client";

import React, { useState, useEffect } from "react";
import { dailyWaterFaqs } from "./faq";
import "./daily-water-intake-calculator.css";

export default function DailyWaterIntakeCalculator() {
  const [currentUnit, setCurrentUnit] = useState<"metric" | "imperial">("metric");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("male");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [activity, setActivity] = useState<string>("sedentary");
  const [climate, setClimate] = useState<string>("temperate");
  const [exerciseMinutes, setExerciseMinutes] = useState<string>("");
  const [intensity, setIntensity] = useState<string>("low");
  const [routine, setRoutine] = useState<string>("indoor");
  const [pregnancy, setPregnancy] = useState<string>("no");
  const [breastfeeding, setBreastfeeding] = useState<string>("no");

  const [consumedMl, setConsumedMl] = useState<number>(0);
  const [historyStack, setHistoryStack] = useState<number[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [isValid, setIsValid] = useState<boolean>(false);
  const [outLiters, setOutLiters] = useState<number>(0);
  const [outMl, setOutMl] = useState<number>(0);
  const [outOz, setOutOz] = useState<string>("0");
  const [outCups, setOutCups] = useState<string>("0");
  const [breakdownBase, setBreakdownBase] = useState<number>(0);
  const [breakdownActivity, setBreakdownActivity] = useState<number>(0);
  const [breakdownSpecial, setBreakdownSpecial] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");

  const setUnit = (unit: "metric" | "imperial") => {
    setCurrentUnit(unit);

    const wNum = parseFloat(weight);
    const hNum = parseFloat(height);

    if (unit === "imperial") {
      if (!isNaN(wNum) && wNum < 200) {
        setWeight(Math.round(wNum * 2.20462).toString());
      }

      if (!isNaN(hNum) && hNum < 100) {
        setHeight(Math.round(hNum / 2.54).toString());
      }
    } else {
      if (!isNaN(wNum) && wNum > 100) {
        setWeight(Math.round(wNum / 2.20462).toString());
      }

      if (!isNaN(hNum) && hNum > 50) {
        setHeight(Math.round(hNum * 2.54).toString());
      }
    }
  };

  useEffect(() => {
    const ageVal = parseFloat(age);
    const weightVal = parseFloat(weight);

    if (
      !age ||
      !weight ||
      isNaN(ageVal) ||
      isNaN(weightVal) ||
      ageVal <= 0 ||
      ageVal > 120 ||
      weightVal <= 0
    ) {
      setIsValid(false);
      return;
    }

    setIsValid(true);

    const weightKg =
      currentUnit === "imperial" ? weightVal / 2.20462 : weightVal;

    let baseMl = gender === "male" ? 3000 : 2200;

    const weightBasedMl =
      weightKg * (gender === "male" ? 35 : 31);

    let blendedBaseMl =
      baseMl * 0.4 + weightBasedMl * 0.6;

    if (ageVal > 60) {
      blendedBaseMl *= 0.95;
    } else if (ageVal < 18) {
      blendedBaseMl = weightKg * 35;
    }

    const baseL = blendedBaseMl / 1000;

    let activityAddMl = 0;

    if (activity === "light") activityAddMl += 200;
    if (activity === "moderate") activityAddMl += 400;
    if (activity === "active") activityAddMl += 600;
    if (activity === "very-active") activityAddMl += 900;

    if (climate === "hot") activityAddMl += 500;
    if (climate === "cold") activityAddMl -= 150;

    if (routine === "outdoor") activityAddMl += 350;

    let intensityMultiplier = 1;

    if (intensity === "moderate") intensityMultiplier = 1.25;
    if (intensity === "high") intensityMultiplier = 1.6;

    const exMins = Math.max(0, parseFloat(exerciseMinutes) || 0);

    const exerciseMl =
      (exMins / 30) * 250 * intensityMultiplier;

    const totalActivityAddMl =
      activityAddMl + exerciseMl;

    const totalActivityAddL =
      totalActivityAddMl / 1000;

    let specialMl = 0;

    if (gender === "female") {
      if (pregnancy === "yes") specialMl += 300;
      if (breastfeeding === "yes") specialMl += 750;
    }

    const specialL = specialMl / 1000;

    const totalTargetMl =
      blendedBaseMl + totalActivityAddMl + specialMl;

    const totalTargetLiters = Math.max(0, totalTargetMl / 1000);

    setOutLiters(totalTargetLiters);

    const ml = Math.round(totalTargetLiters * 1000);

    setOutMl(ml);
    setOutOz((totalTargetLiters * 33.814).toFixed(1));
    setOutCups((totalTargetLiters * 4.167).toFixed(1));

    setBreakdownBase(baseL);
    setBreakdownActivity(totalActivityAddL);
    setBreakdownSpecial(specialL);
  }, [
    age,
    weight,
    gender,
    activity,
    climate,
    exerciseMinutes,
    intensity,
    routine,
    pregnancy,
    breastfeeding,
    currentUnit,
  ]);

  const addWater = (amount: number) => {
    setHistoryStack((prev) => [...prev, consumedMl]);
    setConsumedMl((prev) => prev + amount);
  };

  const addCustomWater = () => {
    const val = parseInt(customAmount, 10);

    if (!isNaN(val) && val > 0) {
      setHistoryStack((prev) => [...prev, consumedMl]);
      setConsumedMl((prev) => prev + val);
      setCustomAmount("");
    }
  };

  const undoWater = () => {
    if (historyStack.length > 0) {
      const last = historyStack[historyStack.length - 1];

      setHistoryStack((prev) => prev.slice(0, -1));
      setConsumedMl(last);
    }
  };

  const resetTracker = () => {
    setHistoryStack((prev) => [...prev, consumedMl]);
    setConsumedMl(0);
  };

  const remaining = Math.max(0, outMl - consumedMl);

  const percent =
    outMl > 0
      ? Math.min(100, Math.round((consumedMl / outMl) * 100))
      : 0;

  const schedulePortions = [
    { time: "08:00 AM - Wake up", pct: 0.15 },
    { time: "10:00 AM - Morning", pct: 0.15 },
    { time: "12:30 PM - Lunch", pct: 0.20 },
    { time: "03:30 PM - Afternoon", pct: 0.15 },
    { time: "06:00 PM - Evening", pct: 0.15 },
    { time: "08:30 PM - Post Dinner", pct: 0.10 },
    { time: "09:30 PM - Before Bed", pct: 0.10 },
  ];

  // SEO: JSON-LD Schema Markup

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id":
          "https://liebess.com/tools/daily-water-intake-calculator#webapp",
        name: "Daily Water Intake Calculator",
        url: "https://liebess.com/tools/daily-water-intake-calculator",
        description:
          "Calculate your estimated daily water intake based on age, gender, body weight, activity level, exercise duration, climate, pregnancy, and breastfeeding.",
        applicationCategory: "HealthApplication",
        operatingSystem: "All",
        browserRequirements:
          "Requires JavaScript and a modern web browser.",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        featureList: [
          "Daily water intake calculation",
          "Metric and imperial unit conversion",
          "Personalized hydration estimation",
          "Activity and climate adjustments",
          "Pregnancy and breastfeeding adjustments",
          "Daily water intake tracker",
          "Hydration progress tracking",
          "Suggested hydration schedule",
          "Print calculation results",
        ],
      },
      {
        "@type": "FAQPage",
        "@id":
          "https://liebess.com/tools/daily-water-intake-calculator#faq",
        mainEntity: dailyWaterFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="daily-water1">
        <div className="daily-water2">
          <header className="daily-water3">
            <h1 className="daily-water4">
              Daily Water Intake Calculator
            </h1>

            <div className="daily-water5">
              {isValid && (
                <button
                  type="button"
                  className="daily-water6"
                  onClick={() => window.print()}
                >
                  Print
                </button>
              )}
            </div>
          </header>

          <div className="daily-water7">
            <div className="daily-water8">
              <h2 className="daily-water9">Inputs</h2>

              <div className="daily-water10">
                <label className="daily-water11">
                  Unit Selection
                </label>

                <div className="daily-water12">
                  <button
                    type="button"
                    className={`daily-water13 ${
                      currentUnit === "metric"
                        ? "daily-water14"
                        : ""
                    }`}
                    onClick={() => setUnit("metric")}
                  >
                    Metric
                  </button>

                  <button
                    type="button"
                    className={`daily-water13 ${
                      currentUnit === "imperial"
                        ? "daily-water14"
                        : ""
                    }`}
                    onClick={() => setUnit("imperial")}
                  >
                    Imperial
                  </button>
                </div>
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Age (years){" "}
                  <span className="daily-water15">*</span>
                </label>

                <input
                  type="number"
                  className="daily-water16"
                  placeholder="Enter age"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Gender
                </label>

                <select
                  className="daily-water17"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Weight (
                  {currentUnit === "imperial" ? "lb" : "kg"})
                  <span className="daily-water15"> *</span>
                </label>

                <input
                  type="number"
                  className="daily-water16"
                  placeholder="Enter weight"
                  min="1"
                  max="500"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Height (
                  {currentUnit === "imperial" ? "inch" : "cm"})
                </label>

                <input
                  type="number"
                  className="daily-water16"
                  placeholder="Enter height"
                  min="30"
                  max="300"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Activity Level
                </label>

                <select
                  className="daily-water17"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                >
                  <option value="sedentary">
                    Sedentary (little or no exercise)
                  </option>
                  <option value="light">
                    Light (exercise 1-3 times/week)
                  </option>
                  <option value="moderate">
                    Moderate (exercise 3-5 times/week)
                  </option>
                  <option value="active">
                    Active (exercise 6-7 times/week)
                  </option>
                  <option value="very-active">
                    Very Active (hard exercise daily)
                  </option>
                </select>
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Climate
                </label>

                <select
                  className="daily-water17"
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                >
                  <option value="temperate">
                    Temperate / Normal
                  </option>
                  <option value="hot">Hot / Humid</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Daily Exercise (minutes)
                </label>

                <input
                  type="number"
                  className="daily-water16"
                  placeholder="e.g. 30"
                  min="0"
                  max="600"
                  value={exerciseMinutes}
                  onChange={(e) =>
                    setExerciseMinutes(e.target.value)
                  }
                />
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Exercise Intensity
                </label>

                <select
                  className="daily-water17"
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High / Vigorous</option>
                </select>
              </div>

              <div className="daily-water10">
                <label className="daily-water11">
                  Daily Routine
                </label>

                <select
                  className="daily-water17"
                  value={routine}
                  onChange={(e) => setRoutine(e.target.value)}
                >
                  <option value="indoor">
                    Indoor / Desk Job
                  </option>
                  <option value="outdoor">
                    Outdoor / Labor
                  </option>
                </select>
              </div>

              {gender === "female" && (
                <>
                  <div className="daily-water10">
                    <label className="daily-water11">
                      Pregnancy
                    </label>

                    <select
                      className="daily-water17"
                      value={pregnancy}
                      onChange={(e) =>
                        setPregnancy(e.target.value)
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="daily-water10">
                    <label className="daily-water11">
                      Breastfeeding
                    </label>

                    <select
                      className="daily-water17"
                      value={breastfeeding}
                      onChange={(e) =>
                        setBreastfeeding(e.target.value)
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </>
              )}

              {!isValid && (
                <div className="daily-water18">
                  Please complete your input.
                </div>
              )}
            </div>

            <div
              className="daily-water8"
              style={{
                display: isValid ? "block" : "none",
              }}
            >
              <h2 className="daily-water9">Outputs</h2>

              <div className="daily-water19">
                <span className="daily-water20">
                  Daily Water Target (Liters)
                </span>
                <span className="daily-water21">
                  {outLiters.toFixed(2)} L
                </span>
              </div>

              <div className="daily-water19">
                <span className="daily-water20">
                  Total Water (mL)
                </span>
                <span className="daily-water21">
                  {outMl} mL
                </span>
              </div>

              <div className="daily-water19">
                <span className="daily-water20">
                  US Fluid Ounces
                </span>
                <span className="daily-water21">
                  {outOz} fl oz
                </span>
              </div>

              <div className="daily-water19">
                <span className="daily-water20">
                  Cups (240 mL)
                </span>
                <span className="daily-water21">
                  {outCups} cups
                </span>
              </div>

              <h2
                className="daily-water9"
                style={{ marginTop: "12px" }}
              >
                Personalized Water Breakdown
              </h2>

              <div className="daily-water19">
                <span className="daily-water20">
                  Base Maintenance
                </span>
                <span className="daily-water21">
                  {breakdownBase.toFixed(2)} L
                </span>
              </div>

              <div className="daily-water19">
                <span className="daily-water20">
                  Activity & Climate Add-on
                </span>
                <span className="daily-water21">
                  {breakdownActivity.toFixed(2)} L
                </span>
              </div>

              <div className="daily-water19">
                <span className="daily-water20">
                  Special Conditions (Preg/Breast)
                </span>
                <span className="daily-water21">
                  {breakdownSpecial.toFixed(2)} L
                </span>
              </div>

              <h2
                className="daily-water9"
                style={{ marginTop: "12px" }}
              >
                Daily Hydration Tracker
              </h2>

              <div className="daily-water22">
                <div className="daily-water23">
                  <div className="daily-water24">
                    {consumedMl} mL
                  </div>
                  <div className="daily-water25">
                    Consumed Water
                  </div>
                </div>

                <div className="daily-water23">
                  <div className="daily-water24">
                    {remaining} mL
                  </div>
                  <div className="daily-water25">
                    Remaining Water
                  </div>
                </div>

                <div className="daily-water23">
                  <div className="daily-water24">
                    {percent}%
                  </div>
                  <div className="daily-water25">
                    Progress Percentage
                  </div>
                </div>
              </div>

              <div className="daily-water26">
                <div className="daily-water27">
                  <div
                    className="daily-water28"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>

              <div className="daily-water29">
                <button
                  type="button"
                  onClick={() => addWater(250)}
                >
                  +250 mL
                </button>

                <button
                  type="button"
                  onClick={() => addWater(330)}
                >
                  +330 mL
                </button>

                <button
                  type="button"
                  onClick={() => addWater(500)}
                >
                  +500 mL
                </button>

                <button
                  type="button"
                  onClick={() => addWater(750)}
                >
                  +750 mL
                </button>
              </div>

              <div className="daily-water30">
                <input
                  type="number"
                  className="daily-water16"
                  placeholder="Custom mL"
                  min="1"
                  style={{ flex: 2 }}
                  value={customAmount}
                  onChange={(e) =>
                    setCustomAmount(e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={addCustomWater}
                  style={{ flex: 1 }}
                >
                  Add
                </button>

                <button
                  type="button"
                  className="daily-water31"
                  onClick={undoWater}
                  style={{ flex: 1 }}
                >
                  Undo
                </button>

                <button
                  type="button"
                  className="daily-water31"
                  onClick={resetTracker}
                  style={{ flex: 1 }}
                >
                  Reset
                </button>
              </div>

              <h2
                className="daily-water9"
                style={{ marginTop: "12px" }}
              >
                Suggested Hydration Schedule
              </h2>

              <ul className="daily-water32">
                {schedulePortions.map((p, idx) => {
                  const amount = Math.round(outMl * p.pct);

                  return (
                    <li
                      key={idx}
                      className="daily-water33"
                    >
                      <span>{p.time}</span>
                      <span>{amount} mL</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div
            className="daily-water-seo-section"
            style={{ marginTop: "24px" }}
          >
            <h2 className="daily-water-h1">
              Master Your Health with the Ultimate Daily Water Intake Calculator
            </h2>

            <p className="daily-water-p">
              Staying properly hydrated is fundamental to maintaining
              physical health, mental focus, and overall wellness.
              Our daily water intake calculator estimates your daily
              hydration needs based on your age, gender, body weight,
              physical activity, exercise duration, climate, and
              special circumstances. Use the calculator to explore
              your estimated daily water intake, track your water
              consumption, monitor your hydration progress, and
              follow a suggested hydration schedule. Individual
              hydration requirements vary, and this calculator
              provides general educational estimates rather than
              medical advice.
            </p>

            <h2 className="daily-water-faq-heading">
              Frequently Asked Questions
            </h2>

            <div className="daily-water-faq-container">
              {dailyWaterFaqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={index}
                    className="daily-water-faq-item"
                  >
                    <h3
                      className="daily-water-faq-title"
                      onClick={() =>
                        setOpenFaq(isOpen ? null : index)
                      }
                    >
                      {faq.question}
                    </h3>

                    {isOpen && (
                      <p className="daily-water-faq-answer">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}