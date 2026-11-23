"use client";

import React, { useMemo, useState } from "react";
import "./calculate-the-date-between-two-dates.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

const DAY_MS = 86400000;

export default function CalculateTheDateBetweenTwoDates() {
  const [firstDateStr, setFirstDateStr] = useState<string>("2026-06-01");
  const [secondDateStr, setSecondDateStr] = useState<string>("2026-06-21");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const midpointData = useMemo(() => {
    const d1 = parseStrictUtcDay(firstDateStr);
    const d2 = parseStrictUtcDay(secondDateStr);

    if (d1 === null || d2 === null) {
      return {
        error: "Please enter valid dates for both First Date and Second Date.",
        info: null,
      };
    }

    const wasReversed = d1 > d2;
    const startMs = Math.min(d1, d2);
    const endMs = Math.max(d1, d2);
    const totalDays = Math.round((endMs - startMs) / DAY_MS);
    const totalMs = endMs - startMs;

    // Exact elapsed midpoint in milliseconds
    const exactMidMs = startMs + totalMs / 2;
    const isOddDayInterval = totalDays % 2 !== 0;

    // Calendar midpoint date (floored to UTC midnight)
    const calendarMidMs = startMs + Math.floor(totalDays / 2) * DAY_MS;

    const daysFromFirstToMid = (exactMidMs - startMs) / DAY_MS;
    const daysFromMidToSecond = (endMs - exactMidMs) / DAY_MS;

    const p25Ms = startMs + totalMs * 0.25;
    const p50Ms = exactMidMs;
    const p75Ms = startMs + totalMs * 0.75;

    return {
      error: null,
      info: {
        wasReversed,
        startMs,
        endMs,
        totalDays,
        isOddDayInterval,
        calendarMidMs,
        exactMidMs,
        daysFromFirstToMid,
        daysFromMidToSecond,
        p25Date: formatDateLabel(p25Ms),
        p50Date: formatDateLabel(p50Ms),
        p75Date: formatDateLabel(p75Ms),
        midpointFormatted: formatDateLabel(calendarMidMs),
        midpointWeekday: formatWeekday(calendarMidMs),
        startFormatted: formatDateLabel(startMs),
        endFormatted: formatDateLabel(endMs),
      },
    };
  }, [firstDateStr, secondDateStr]);

  const handleCopy = async () => {
    if (!midpointData.info) return;
    const text = `${midpointData.info.midpointFormatted} (${midpointData.info.midpointWeekday})`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setFirstDateStr("");
    setSecondDateStr("");
    setCopied(false);
  };

  return (
    <div className="midpointdate1-root">
      <div className="midpointdate1-wrap">
        <header className="midpointdate1-header">
          <span className="midpointdate1-pill">Midpoint Date Finder</span>
          <h1 className="midpointdate1-title">Calculate the Date Between Two Dates</h1>
          <p className="midpointdate1-sub">
            Find the exact midpoint date halfway between two calendar dates, along with quarter milestones and a visual range timeline.
          </p>
        </header>

        <section className="midpointdate1-inputs" aria-label="Date range inputs">
          <div className="midpointdate1-field">
            <label htmlFor="midpointdate1-d1" className="midpointdate1-label">
              First Date
            </label>
            <input
              id="midpointdate1-d1"
              type="date"
              className="midpointdate1-input"
              value={firstDateStr}
              onChange={(e) => setFirstDateStr(e.target.value)}
            />
          </div>

          <div className="midpointdate1-field">
            <label htmlFor="midpointdate1-d2" className="midpointdate1-label">
              Second Date
            </label>
            <input
              id="midpointdate1-d2"
              type="date"
              className="midpointdate1-input"
              value={secondDateStr}
              onChange={(e) => setSecondDateStr(e.target.value)}
            />
          </div>
        </section>

        {midpointData.error && (
          <div className="midpointdate1-error" role="alert">
            {midpointData.error}
          </div>
        )}

        <div className="midpointdate1-actions">
          <button
            type="button"
            className="midpointdate1-btn-yellow"
            onClick={handleCopy}
            disabled={!midpointData.info}
          >
            {copied ? "Copied Midpoint Date" : "Copy Midpoint Date"}
          </button>
          <button
            type="button"
            className="midpointdate1-btn-charcoal"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        {midpointData.info && (
          <section className="midpointdate1-result-card" aria-label="Midpoint calculation results">
            {midpointData.info.wasReversed && (
              <div className="midpointdate1-info-banner">
                Dates were entered in reverse order; they were automatically ordered chronologically from earlier to later.
              </div>
            )}

            <div className="midpointdate1-hero-row">
              <div>
                <div className="midpointdate1-hero-label">Midpoint Date (50%)</div>
                <div className="midpointdate1-hero-date">
                  {midpointData.info.midpointFormatted}
                </div>
                <div className="midpointdate1-hero-weekday">
                  Weekday: <strong>{midpointData.info.midpointWeekday}</strong>
                </div>
              </div>

              <div className="midpointdate1-range-box">
                <div>
                  Total Date Range: <strong>{midpointData.info.totalDays} days</strong>
                </div>
                <div>
                  From First to Midpoint:{" "}
                  <strong>{formatHalfDays(midpointData.info.daysFromFirstToMid)} days</strong>
                </div>
                <div>
                  From Midpoint to Second:{" "}
                  <strong>{formatHalfDays(midpointData.info.daysFromMidToSecond)} days</strong>
                </div>
              </div>
            </div>

            {midpointData.info.isOddDayInterval ? (
              <p className="midpointdate1-odd-note">
                <strong>Odd Day Interval ({midpointData.info.totalDays} days):</strong> The exact elapsed midpoint falls halfway through a calendar day ({formatHalfDays(midpointData.info.daysFromFirstToMid)} days from each endpoint), so the midpoint sits between two calendar dates rather than on an exact whole-day boundary.
              </p>
            ) : (
              <p className="midpointdate1-odd-note">
                <strong>Even Day Interval ({midpointData.info.totalDays} days):</strong> The midpoint falls cleanly on {midpointData.info.midpointFormatted} with an equal whole number of days on both sides.
              </p>
            )}

            <div className="midpointdate1-timeline" aria-label="Visual timeline from first date to second date">
              <div className="midpointdate1-track">
                <span className="midpointdate1-point midpointdate1-point-start" />
                <span className="midpointdate1-point midpointdate1-point-mid" />
                <span className="midpointdate1-point midpointdate1-point-end" />
              </div>
              <div className="midpointdate1-timeline-labels">
                <div>
                  <span>First Date</span>
                  <strong>{midpointData.info.startFormatted}</strong>
                </div>
                <div className="midpointdate1-mid-label">
                  <span>Midpoint (50%)</span>
                  <strong>{midpointData.info.midpointFormatted}</strong>
                </div>
                <div className="midpointdate1-end-label">
                  <span>Second Date</span>
                  <strong>{midpointData.info.endFormatted}</strong>
                </div>
              </div>
            </div>

            <div className="midpointdate1-quarters">
              <div className="midpointdate1-q-item">
                <span>25% Mark</span>
                <strong>{midpointData.info.p25Date}</strong>
              </div>
              <div className="midpointdate1-q-item midpointdate1-q-active">
                <span>50% Midpoint</span>
                <strong>{midpointData.info.p50Date}</strong>
              </div>
              <div className="midpointdate1-q-item">
                <span>75% Mark</span>
                <strong>{midpointData.info.p75Date}</strong>
              </div>
            </div>
          </section>
        )}

        <article className="midpointdate1-guide">
          <h2 className="midpointdate1-h2">How Midpoint Dates Work on Even and Odd Spans</h2>
          <p className="midpointdate1-p">
            A midpoint date marks the halfway point across a selected date span. When two dates are separated by an even number of days—such as 20 days—the midpoint falls on an exact calendar day 10 days from each side. When separated by an odd number of days, the exact elapsed midpoint lands at a .5-day mark between consecutive calendar dates.
          </p>
        </article>

        <section className="midpointdate1-faq" aria-label="Frequently asked questions">
          <h2 className="midpointdate1-h2">Frequently Asked Questions</h2>
          <div className="midpointdate1-faq-list">
            {faqItems.map((item, idx) => {
              const expanded = openFaq === idx;
              return (
                <div key={item.question} className="midpointdate1-faq-item">
                  <button
                    type="button"
                    className="midpointdate1-faq-btn"
                    aria-expanded={expanded}
                    onClick={() => setOpenFaq(expanded ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span>{expanded ? "−" : "+"}</span>
                  </button>
                  {expanded && <div className="midpointdate1-faq-body">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function parseStrictUtcDay(str: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const ms = Date.UTC(y, mo - 1, d);
  const dt = new Date(ms);
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) {
    return null;
  }
  return ms;
}

function formatDateLabel(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatWeekday(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
  });
}

function formatHalfDays(days: number): string {
  return Number.isInteger(days) ? String(days) : days.toFixed(1);
}