"use client";

import React, { useMemo, useState } from "react";
import "./date-and-time-duration-calculator.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

export default function DateAndTimeDurationCalculator() {
  const [startDate, setStartDate] = useState<string>("2026-07-10");
  const [startTime, setStartTime] = useState<string>("10:00:00");
  const [endDate, setEndDate] = useState<string>("2026-07-12");
  const [endTime, setEndTime] = useState<string>("14:30:00");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calc = useMemo(() => {
    const startMs = buildUtcTimestamp(startDate, startTime);
    const endMs = buildUtcTimestamp(endDate, endTime);

    if (startMs === null || endMs === null) {
      return {
        error: "Please enter valid start and end dates and times.",
        data: null,
      };
    }

    const diffMs = endMs - startMs;
    if (diffMs < 0) {
      return {
        error: "End date/time is earlier than start date/time. Choose an end time at or after the start.",
        data: null,
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalSeconds / 3600;
    const totalDays = totalSeconds / 86400;

    const wholeDays = Math.floor(totalSeconds / 86400);
    const remAfterDays = totalSeconds % 86400;
    const hours = Math.floor(remAfterDays / 3600);
    const minutes = Math.floor((remAfterDays % 3600) / 60);
    const seconds = remAfterDays % 60;

    const readable = `${wholeDays}d ${hours}h ${minutes}m ${seconds}s`;

    return {
      error: null,
      data: {
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        wholeDays,
        hours,
        minutes,
        seconds,
        readable,
      },
    };
  }, [startDate, startTime, endDate, endTime]);

  const handleCopy = async () => {
    if (!calc.data) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(calc.data.readable);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setStartDate("");
    setStartTime("00:00:00");
    setEndDate("");
    setEndTime("00:00:00");
    setCopied(false);
  };

  return (
    <div className="dtduration1-root">
      <div className="dtduration1-dash">
        <header className="dtduration1-head">
          <div>
            <span className="dtduration1-kicker">Quick Duration Dashboard</span>
            <h1 className="dtduration1-h1">Date and Time Duration Calculator</h1>
          </div>
          <div className="dtduration1-head-actions">
            <button
              type="button"
              className="dtduration1-btn-orange"
              onClick={handleCopy}
              disabled={!calc.data}
            >
              {copied ? "Copied!" : "Copy Duration"}
            </button>
            <button
              type="button"
              className="dtduration1-btn-light"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </header>

        <section className="dtduration1-bar" aria-label="Start and end date and time">
          <div className="dtduration1-group">
            <label htmlFor="dtduration1-sd" className="dtduration1-label">
              Start Date &amp; Time
            </label>
            <div className="dtduration1-pair">
              <input
                id="dtduration1-sd"
                type="date"
                className="dtduration1-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                id="dtduration1-st"
                type="time"
                step="1"
                aria-label="Start time"
                className="dtduration1-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="dtduration1-group">
            <label htmlFor="dtduration1-ed" className="dtduration1-label">
              End Date &amp; Time
            </label>
            <div className="dtduration1-pair">
              <input
                id="dtduration1-ed"
                type="date"
                className="dtduration1-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                id="dtduration1-et"
                type="time"
                step="1"
                aria-label="End time"
                className="dtduration1-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </section>

        {calc.error && (
          <div className="dtduration1-err" role="alert">
            {calc.error}
          </div>
        )}

        {calc.data && (
          <>
            <section className="dtduration1-summary-banner" aria-label="Compact duration summary">
              <div>
                <span className="dtduration1-banner-sub">Readable Duration Breakdown</span>
                <div className="dtduration1-banner-main">{calc.data.readable}</div>
              </div>
              <div className="dtduration1-banner-parts">
                <span>{calc.data.wholeDays} Days</span>
                <span>{calc.data.hours} Hours</span>
                <span>{calc.data.minutes} Minutes</span>
                <span>{calc.data.seconds} Seconds</span>
              </div>
            </section>

            <section className="dtduration1-cards" aria-label="Total duration metrics">
              <div className="dtduration1-card">
                <span>Total Days</span>
                <strong>{calc.data.totalDays.toFixed(4)}</strong>
              </div>
              <div className="dtduration1-card">
                <span>Total Hours</span>
                <strong>{calc.data.totalHours.toFixed(2)}</strong>
              </div>
              <div className="dtduration1-card">
                <span>Total Minutes</span>
                <strong>{calc.data.totalMinutes.toFixed(2)}</strong>
              </div>
              <div className="dtduration1-card">
                <span>Total Seconds</span>
                <strong>{calc.data.totalSeconds.toLocaleString("en-US")}</strong>
              </div>
            </section>

            <section className="dtduration1-calc-detail" aria-label="Detailed calculation">
              <h2 className="dtduration1-h2">Detailed Calculation</h2>
              <p className="dtduration1-p">
                Total seconds = {calc.data.totalSeconds.toLocaleString("en-US")} s. Dividing by 60 gives{" "}
                {calc.data.totalMinutes.toFixed(2)} minutes; dividing by 3,600 gives{" "}
                {calc.data.totalHours.toFixed(2)} hours; dividing by 86,400 gives{" "}
                {calc.data.totalDays.toFixed(4)} days.
              </p>
            </section>
          </>
        )}
        <RelatedCalculatorLinks currentSlug="date-and-time-calculator-between-two-dates" />

        <section className="dtduration1-faq" aria-label="Frequently asked questions">
          <h2 className="dtduration1-h2">Frequently Asked Questions</h2>
          <div className="dtduration1-faq-list">
            {faqItems.map((item, index) => {
              const expanded = openFaq === index;
              return (
                <div key={item.question} className="dtduration1-faq-item">
                  <button
                    type="button"
                    className="dtduration1-faq-btn"
                    aria-expanded={expanded}
                    onClick={() => setOpenFaq(expanded ? null : index)}
                  >
                    <span>{item.question}</span>
                    <span>{expanded ? "−" : "+"}</span>
                  </button>
                  {expanded && <div className="dtduration1-faq-ans">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function buildUtcTimestamp(dateStr: string, timeStr: string): number | null {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!dm) return null;
  const y = Number(dm[1]);
  const mo = Number(dm[2]);
  const d = Number(dm[3]);

  const cleanTime = timeStr.trim() === "" ? "00:00:00" : timeStr.trim();
  const tm = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(cleanTime);
  if (!tm) return null;
  const h = Number(tm[1]);
  const mi = Number(tm[2]);
  const s = tm[3] ? Number(tm[3]) : 0;

  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || s > 59) return null;

  const ms = Date.UTC(y, mo - 1, d, h, mi, s);
  const dt = new Date(ms);
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return ms;
}