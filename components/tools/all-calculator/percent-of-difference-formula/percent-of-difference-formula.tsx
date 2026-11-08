"use client";

import React, { useState, useEffect } from "react";
import { percentFormulaConfig } from "./faq";
import "./percent-of-difference-formula.css";

interface ToolProps {
  slug: string;
}

export default function PercentOfDifferenceFormulaTool({ slug }: ToolProps) {
  const currentConfig = percentFormulaConfig[slug] || percentFormulaConfig["percent-to-change-formula"];

  // ইউআরএল (slug) অনুযায়ী ডিফল্ট ট্যাব নির্ধারণ
  const getInitialTab = (currentSlug: string): "change" | "difference" => {
    if (
      currentSlug === "percent-of-difference-formula" ||
      currentSlug === "how-to-calculate-percentage-of-difference"
    ) {
      return "difference";
    }
    return "change";
  };

  const [activeTab, setActiveTab] = useState<"change" | "difference">(getInitialTab(slug));

  // ইউআরএল পরিবর্তন হলে সেই অনুযায়ী ডিফল্ট ট্যাব সুইচ করবে
  useEffect(() => {
    setActiveTab(getInitialTab(slug));
  }, [slug]);

  // Percent Change states
  const [originalVal, setOriginalVal] = useState("");
  const [newVal, setNewVal] = useState("");
  const [originalError, setOriginalError] = useState("");
  const [newError, setNewError] = useState("");
  const [changeResult, setChangeResult] = useState<{ percentage: string; status: string } | null>(null);

  // Percent Difference states
  const [valA, setValA] = useState("");
  const [valB, setValB] = useState("");
  const [bError, setBError] = useState("");
  const [diffResult, setDiffResult] = useState<{ absDiff: string; avg: string; percentageDiff: string } | null>(null);

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const formatNumber = (value: number) => {
    if (!Number.isFinite(value)) return "—";
    return Number(value.toFixed(2)).toFixed(2);
  };

  // Percent Change Calculation Logic
  useEffect(() => {
    if (originalVal === "" || newVal === "") {
      setChangeResult(null);
      return;
    }

    const o = Number(originalVal);
    const n = Number(newVal);

    if (!Number.isFinite(o) || !Number.isFinite(n)) {
      setChangeResult(null);
      return;
    }

    if (o <= 0) {
      setOriginalError("Original value must be greater than zero.");
      setChangeResult(null);
      return;
    } else {
      setOriginalError("");
    }

    const difference = n - o;
    const change = (difference / o) * 100;

    if (!Number.isFinite(change)) {
      setNewError("Unable to calculate percentage.");
      setChangeResult(null);
      return;
    } else {
      setNewError("");
    }

    let status = "No Change";
    if (difference > 0) status = "Increase";
    else if (difference < 0) status = "Decrease";

    setChangeResult({
      percentage: formatNumber(Math.abs(change)) + "%",
      status,
    });
  }, [originalVal, newVal]);

  // Percent Difference Calculation Logic
  useEffect(() => {
    if (valA === "" || valB === "") {
      setDiffResult(null);
      return;
    }

    const a = Number(valA);
    const b = Number(valB);

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setDiffResult(null);
      return;
    }

    const difference = Math.abs(a - b);
    const average = (a + b) / 2;

    if (average === 0) {
      setBError("The average value is zero. Percentage difference cannot be calculated.");
      setDiffResult(null);
      return;
    } else {
      setBError("");
    }

    const percentageDifference = (difference / Math.abs(average)) * 100;

    if (!Number.isFinite(percentageDifference)) {
      setDiffResult(null);
      return;
    }

    setDiffResult({
      absDiff: formatNumber(difference),
      avg: formatNumber(average),
      percentageDiff: formatNumber(percentageDifference) + "%",
    });
  }, [valA, valB]);

  // JSON-LD Schema Markup
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: currentConfig.metaTitle,
    description: currentConfig.metaDescription,
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: currentConfig.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  };

  return (
    <div className="change-formula1">
      {/* Dynamic Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="change-formula2">
        <div className="change-formula3" role="tablist" aria-label="Percentage calculator types">
          <button
            type="button"
            className={`change-formula4 ${activeTab === "change" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "change"}
            onClick={() => setActiveTab("change")}
          >
            Percent Change
          </button>
          <button
            type="button"
            className={`change-formula4 ${activeTab === "difference" ? "active" : ""}`}
            role="tab"
            aria-selected={activeTab === "difference"}
            onClick={() => setActiveTab("difference")}
          >
            Percent Difference
          </button>
        </div>

        <div className="change-formula5">
          {/* Percent Change Tab Content */}
          <div className={`change-formula6 ${activeTab === "change" ? "active" : ""}`} role="tabpanel">
            <div className="change-formula7">
              <label className="change-formula8" htmlFor="original-value">Original Value</label>
              <input
                type="number"
                id="original-value"
                className={`change-formula9 ${originalError ? "input-error" : ""}`}
                placeholder="Enter original value"
                step="any"
                inputMode="decimal"
                value={originalVal}
                onChange={(e) => setOriginalVal(e.target.value)}
              />
              {originalError && <div className="change-formula10" style={{ display: "block" }}>{originalError}</div>}
            </div>

            <div className="change-formula7">
              <label className="change-formula8" htmlFor="new-value">New Value</label>
              <input
                type="number"
                id="new-value"
                className={`change-formula9 ${newError ? "input-error" : ""}`}
                placeholder="Enter new value"
                step="any"
                inputMode="decimal"
                value={newVal}
                onChange={(e) => setNewVal(e.target.value)}
              />
              {newError && <div className="change-formula10" style={{ display: "block" }}>{newError}</div>}
            </div>

            {changeResult && (
              <div className="change-formula11">
                <div className="change-formula12">
                  Percentage Change: <span className="change-formula13">{changeResult.percentage}</span>
                </div>
                <div className="change-formula12">
                  Status: <span className="change-formula13">{changeResult.status}</span>
                </div>
              </div>
            )}
          </div>

          {/* Percent Difference Tab Content */}
          <div className={`change-formula6 ${activeTab === "difference" ? "active" : ""}`} role="tabpanel">
            <div className="change-formula7">
              <label className="change-formula8" htmlFor="val-a">First Value (A)</label>
              <input
                type="number"
                id="val-a"
                className="change-formula9"
                placeholder="Enter first value"
                step="any"
                inputMode="decimal"
                value={valA}
                onChange={(e) => setValA(e.target.value)}
              />
            </div>

            <div className="change-formula7">
              <label className="change-formula8" htmlFor="val-b">Second Value (B)</label>
              <input
                type="number"
                id="val-b"
                className={`change-formula9 ${bError ? "input-error" : ""}`}
                placeholder="Enter second value"
                step="any"
                inputMode="decimal"
                value={valB}
                onChange={(e) => setValB(e.target.value)}
              />
              {bError && <div className="change-formula10" style={{ display: "block" }}>{bError}</div>}
            </div>

            {diffResult && (
              <div className="change-formula11">
                <div className="change-formula12">
                  Absolute Difference: <span className="change-formula13">{diffResult.absDiff}</span>
                </div>
                <div className="change-formula12">
                  Average Value: <span className="change-formula13">{diffResult.avg}</span>
                </div>
                <div className="change-formula12">
                  Percentage Difference: <span className="change-formula13">{diffResult.percentageDiff}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Content & Article Section */}
      <div className="change-formula14">
        <h1 className="change-formula15">{currentConfig.h1Title}</h1>
        <p className="change-formula16">{currentConfig.introText}</p>

        <div className="change-formula17">
          <h2 className="change-formula18">{currentConfig.article.title}</h2>
          {currentConfig.article.sections.map((sec, idx) => (
            <div key={idx} style={{ marginTop: "15px" }}>
              {sec.level === "h2" && <h2 className="change-formula18">{sec.heading}</h2>}
              {sec.level === "h3" && <h3 className="change-formula19">{sec.heading}</h3>}
              {sec.level === "h4" && <h4 className="change-formula20">{sec.heading}</h4>}
              <p className="change-formula21" style={{ marginTop: "5px" }}>{sec.content}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion Section */}
        <div className="change-formula22">
          <h2 className="change-formula23">Frequently Asked Questions</h2>
          {currentConfig.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div className="change-formula24" key={index}>
                <button
                  type="button"
                  className="change-formula25"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span>{isOpen ? "▲" : "▼"}</span>
                </button>
                {isOpen && <div className="change-formula26">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}