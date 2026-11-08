"use client";

import React, { useState } from "react";
import "./body-mass-index-calculator.css";
import { translations, languages } from "./i18n";

interface ComponentProps {
  slug?: string;
}

export default function BodyMassIndexCalculator({
  slug = "body-mass-index-calculator",
}: ComponentProps) {
  const [lang, setLang] = useState("en");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [heightUnit, setHeightUnit] = useState("cm");
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");

  const t = translations[lang] || translations.en;

  // ==========================================
  // URL BASED ARTICLE AND FAQ
  // ==========================================

  const articlesMap = t.articles || translations.en.articles;

  const currentArticle =
    articlesMap[slug] ||
    articlesMap["body-mass-index-calculator"] || {
      title: "Body Mass Index Calculator",
      intro:
        "Calculate your Body Mass Index (BMI) quickly and accurately.",
      faqs: [],
    };

  // ==========================================
  // CANONICAL URL
  // ==========================================

  const canonicalUrl = `https://liebess.com/tools/${slug}`;

  // ==========================================
  // JSON-LD STRUCTURED DATA
  // ==========================================

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${canonicalUrl}#webapp`,
        name: currentArticle.title,
        url: canonicalUrl,
        description: currentArticle.intro,
        applicationCategory: "HealthApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: "Liebess",
          url: "https://liebess.com",
        },
        featureList: [
          "Calculate Body Mass Index (BMI)",
          "Metric and imperial measurement support",
          "Healthy weight range calculation",
          "BMI category classification",
          "BMI Prime calculation",
          "Ponderal Index calculation",
        ],
      },

      ...(currentArticle.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              url: canonicalUrl,
              mainEntity: currentArticle.faqs.map((item: any) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  // ==========================================
  // HEIGHT CONVERSION
  // ==========================================

  const parseMeters = (val: string, unit: string) => {
    const num = parseFloat(val);

    if (isNaN(num) || num <= 0) return null;

    if (unit === "cm") return num / 100;
    if (unit === "ft") return num * 0.3048;
    if (unit === "in") return num * 0.0254;

    return null;
  };

  // ==========================================
  // WEIGHT CONVERSION
  // ==========================================

  const parseKg = (val: string, unit: string) => {
    const num = parseFloat(val);

    if (isNaN(num) || num <= 0) return null;

    if (unit === "kg") return num;
    if (unit === "lbs") return num * 0.45359237;

    return null;
  };

  const meters = parseMeters(height, heightUnit);
  const kg = parseKg(weight, weightUnit);

  const showResults = meters !== null && kg !== null;

  // ==========================================
  // BMI CALCULATION
  // ==========================================

  let bmi = 0;
  let categoryLabel = "";
  let categoryClass = "";
  let healthyRangeText = "";
  let weightDiffText = "";
  let bmiPrime = "";
  let ponderal = "";
  let markerPos = 0;

  if (showResults && meters && kg) {
    bmi = kg / (meters * meters);

    if (bmi < 18.5) {
      categoryLabel = t.categories?.underweight || "Underweight";
      categoryClass = "cat-underweight";
    } else if (bmi < 25) {
      categoryLabel = t.categories?.normal || "Normal Weight";
      categoryClass = "cat-normal";
    } else if (bmi < 30) {
      categoryLabel = t.categories?.overweight || "Overweight";
      categoryClass = "cat-overweight";
    } else if (bmi < 35) {
      categoryLabel = t.categories?.obese1 || "Obese Class 1";
      categoryClass = "cat-obese1";
    } else if (bmi < 40) {
      categoryLabel = t.categories?.obese2 || "Obese Class 2";
      categoryClass = "cat-obese2";
    } else {
      categoryLabel = t.categories?.obese3 || "Obese Class 3";
      categoryClass = "cat-obese3";
    }

    const minHealthyKg = 18.5 * meters * meters;
    const maxHealthyKg = 24.9 * meters * meters;

    const formatW = (valKg: number) => {
      if (weightUnit === "lbs") {
        return (
          (valKg / 0.45359237).toFixed(1) +
          " " +
          t.lbs
        );
      }

      return valKg.toFixed(1) + " " + t.kg;
    };

    healthyRangeText = `${formatW(minHealthyKg)} – ${formatW(
      maxHealthyKg
    )}`;

    if (bmi < 18.5) {
      const need = minHealthyKg - kg;

      weightDiffText = `${formatW(need)} ${t.underHealthyRange}`;
    } else if (bmi > 24.9) {
      const excess = kg - maxHealthyKg;

      weightDiffText = `${formatW(excess)} ${t.overHealthyRange}`;
    } else {
      weightDiffText = t.withinHealthyRange;
    }

    bmiPrime = (bmi / 25).toFixed(2);

    ponderal = (kg / (meters * meters * meters)).toFixed(1);

    markerPos = ((bmi - 15) / 30) * 100;

    if (markerPos < 0) markerPos = 0;
    if (markerPos > 100) markerPos = 100;
  }

  // ==========================================
  // FAQ TOGGLE
  // ==========================================

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="bmi-calculator-wrapper">

      {/* ======================================
          JSON-LD STRUCTURED DATA
      ======================================= */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* ======================================
          LANGUAGE SELECTOR
      ======================================= */}

      <div className="bmi-lang-selector-container">
        <select
          className="bmi-lang-select"
          value={lang}
          aria-label="Select Language"
          onChange={(e) => {
            setLang(e.target.value);
            setOpenFaqIndex(null);
          }}
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      {/* ======================================
          MAIN CALCULATOR CARD
      ======================================= */}

      <div className="bmi-card">
        <div className="bmi-card-title">{t.cardTitle}</div>

        <div className="bmi-form-grid">

          {/* AGE */}

          <div className="bmi-form-group">
            <label htmlFor="bmi-age">{t.age}</label>

            <input
              type="number"
              id="bmi-age"
              min="1"
              max="120"
              placeholder="e.g. 30"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <div className={`bmi-warning ${!age ? "show" : ""}`}>
              {t.warningComplete}
            </div>
          </div>

          {/* GENDER */}

          <div className="bmi-form-group">
            <label htmlFor="bmi-gender">{t.gender}</label>

            <select
              id="bmi-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">{t.selectGender}</option>
              <option value="male">{t.male}</option>
              <option value="female">{t.female}</option>
            </select>

            <div className={`bmi-warning ${!gender ? "show" : ""}`}>
              {t.warningComplete}
            </div>
          </div>

          {/* HEIGHT */}

          <div className="bmi-form-group">
            <label htmlFor="bmi-height">{t.height}</label>

            <div className="bmi-input-row">
              <input
                type="number"
                id="bmi-height"
                min="1"
                step="any"
                placeholder="e.g. 175"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />

              <select
                className="bmi-unit-select"
                value={heightUnit}
                onChange={(e) => setHeightUnit(e.target.value)}
              >
                <option value="cm">{t.cm}</option>
                <option value="ft">{t.ft}</option>
                <option value="in">{t.inch}</option>
              </select>
            </div>

            <div className={`bmi-warning ${!height ? "show" : ""}`}>
              {t.warningComplete}
            </div>
          </div>

          {/* WEIGHT */}

          <div className="bmi-form-group">
            <label htmlFor="bmi-weight">{t.weight}</label>

            <div className="bmi-input-row">
              <input
                type="number"
                id="bmi-weight"
                min="1"
                step="any"
                placeholder="e.g. 70"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />

              <select
                className="bmi-unit-select"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
              >
                <option value="kg">{t.kg}</option>
                <option value="lbs">{t.lbs}</option>
              </select>
            </div>

            <div className={`bmi-warning ${!weight ? "show" : ""}`}>
              {t.warningComplete}
            </div>
          </div>

        </div>
      </div>

      {/* ======================================
          RESULTS CARD
      ======================================= */}

      {showResults && (
        <div className="bmi-card">

          <div className="bmi-card-title">{t.resultsTitle}</div>

          <div className="bmi-results-box">
            <div className="bmi-value-display">
              {bmi.toFixed(1)}
            </div>

            <div className="bmi-score-label">
              {t.bmiScore}
            </div>

            <div className={`bmi-category-badge ${categoryClass}`}>
              {categoryLabel}
            </div>
          </div>

          {/* BMI STATISTICS */}

          <div className="bmi-stats-grid">

            <div className="bmi-stat-item">
              <div className="bmi-stat-label">
                {t.healthyWeightRange}
              </div>

              <div className="bmi-stat-value">
                {healthyRangeText}
              </div>
            </div>

            <div className="bmi-stat-item">
              <div className="bmi-stat-label">
                {t.weightDifference}
              </div>

              <div className="bmi-stat-value">
                {weightDiffText}
              </div>
            </div>

            <div className="bmi-stat-item">
              <div className="bmi-stat-label">
                {t.bmiPrime}
              </div>

              <div className="bmi-stat-value">
                {bmiPrime}
              </div>
            </div>

            <div className="bmi-stat-item">
              <div className="bmi-stat-label">
                {t.ponderalIndex}
              </div>

              <div className="bmi-stat-value">
                {ponderal}
              </div>
            </div>

          </div>

          {/* BMI SCALE */}

          <div className="bmi-scale-section">

            <div className="bmi-scale-title">
              {t.bmiScale}
            </div>

            <div className="bmi-scale-bar">
              <div
                className="bmi-scale-marker"
                style={{ left: `${markerPos}%` }}
              ></div>
            </div>

            <div className="bmi-scale-labels">
              <span>15</span>
              <span>18.5</span>
              <span>25</span>
              <span>30</span>
              <span>35</span>
              <span>40+</span>
            </div>

          </div>

          <p className="bmi-note">{t.note}</p>

        </div>
      )}

      {/* ======================================
          SEO ARTICLE
      ======================================= */}

      <h1 className="bmi-seo-h1">
        {currentArticle.title}
      </h1>

      <p className="bmi-intro">
        {currentArticle.intro}
      </p>

      {/* ======================================
          FAQ SECTION
      ======================================= */}

      {currentArticle.faqs &&
        currentArticle.faqs.length > 0 && (
          <section className="bmi-faq-section">

            <h2 className="bmi-seo-h2">
              {t.faqTitle}
            </h2>

            {currentArticle.faqs.map(
              (item: any, idx: number) => {
                const isOpen = openFaqIndex === idx;

                return (
                  <div
                    key={idx}
                    className="bmi-faq-item"
                  >

                    {/* FAQ QUESTION AS H2 */}

                    <h2
                      style={{
                        margin: 0,
                        padding: 0,
                        fontSize: "inherit",
                        fontWeight: "inherit",
                      }}
                    >
                      <button
                        type="button"
                        className="bmi-faq-question"
                        onClick={() => toggleFaq(idx)}
                        aria-expanded={isOpen}
                      >
                        <span>{item.question}</span>

                        <span
                          className={`bmi-faq-arrow ${
                            isOpen ? "open" : ""
                          }`}
                        >
                          ▲
                        </span>
                      </button>
                    </h2>

                    {/* FAQ ANSWER */}

                    <div
                      className={`bmi-faq-answer ${
                        isOpen ? "open" : ""
                      }`}
                    >
                      <div className="bmi-faq-answer-inner">
                        {item.answer}
                      </div>
                    </div>

                  </div>
                );
              }
            )}

          </section>
        )}

    </div>
  );
}