"use client";

import React, { useMemo, useState } from "react";
import "./date-difference-calculator.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

export default function DateDifferenceCalculator() {
  const [firstDate, setFirstDate] = useState<string>("2026-02-01");
  const [secondDate, setSecondDate] = useState<string>("2026-05-15");
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);
  const [businessDaysOnly, setBusinessDaysOnly] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const analysis = useMemo(() => {
    const d1 = parseIsoDate(firstDate);
    const d2 = parseIsoDate(secondDate);

    if (!d1 || !d2) {
      return {
        error: "Please select valid calendar dates for both Date 1 and Date 2.",
        info: null,
      };
    }

    const start = d1.ms <= d2.ms ? d1 : d2;
    const end = d1.ms <= d2.ms ? d2 : d1;
    const swapped = d1.ms > d2.ms;

    const rawDaySpan = Math.round((end.ms - start.ms) / 86400000);
    const totalDays = includeEndDate ? rawDaySpan + 1 : rawDaySpan;
    const totalWeeks = totalDays / 7;

    // Count weekdays (Mon-Fri) and weekends (Sat-Sun) across the range
    let weekdays = 0;
    let weekends = 0;
    const lastOffset = includeEndDate ? rawDaySpan : rawDaySpan - 1;

    for (let offset = 0; offset <= lastOffset; offset++) {
      const currentMs = start.ms + offset * 86400000;
      const dow = new Date(currentMs).getUTCDay(); // 0=Sun, 6=Sat
      if (dow === 0 || dow === 6) {
        weekends += 1;
      } else {
        weekdays += 1;
      }
    }

    const ymd = diffCalendarYmd(start, end, includeEndDate);

    return {
      error: null,
      info: {
        startLabel: formatDateReadable(start.ms),
        endLabel: formatDateReadable(end.ms),
        swapped,
        totalDays,
        totalWeeks,
        years: ymd.years,
        months: ymd.months,
        days: ymd.days,
        weekdays,
        weekends,
        activeCount: businessDaysOnly ? weekdays : totalDays,
      },
    };
  }, [firstDate, secondDate, includeEndDate, businessDaysOnly]);

  const summaryText = useMemo(() => {
    if (!analysis.info) return "";
    const i = analysis.info;
    return `${i.totalDays} days (${i.years}y ${i.months}m ${i.days}d), ${i.weekdays} weekdays, ${i.weekends} weekend days`;
  }, [analysis.info]);

  const handleCopy = async () => {
    if (!summaryText) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summaryText);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleReset = () => {
    setFirstDate("");
    setSecondDate("");
    setIncludeEndDate(false);
    setBusinessDaysOnly(false);
    setCopied(false);
  };

  return (
    <div className="datediff1-root">
      <div className="datediff1-sheet">
        <header className="datediff1-header">
          <span className="datediff1-kicker">Calendar Comparison</span>
          <h1 className="datediff1-title">Date Difference Calculator</h1>
          <p className="datediff1-subtitle">
            Compare two calendar dates to see total days, weeks, calendar years/months/days, and weekday versus weekend counts.
          </p>
        </header>

        <section className="datediff1-form-card" aria-label="Calendar date comparison inputs">
          <div className="datediff1-date-row">
            <div className="datediff1-field">
              <label htmlFor="datediff1-first" className="datediff1-label">
                First Calendar Date
              </label>
              <input
                id="datediff1-first"
                type="date"
                className="datediff1-input"
                value={firstDate}
                onChange={(e) => setFirstDate(e.target.value)}
              />
            </div>

            <div className="datediff1-field">
              <label htmlFor="datediff1-second" className="datediff1-label">
                Second Calendar Date
              </label>
              <input
                id="datediff1-second"
                type="date"
                className="datediff1-input"
                value={secondDate}
                onChange={(e) => setSecondDate(e.target.value)}
              />
            </div>
          </div>

          <div className="datediff1-options">
            <label className="datediff1-checkbox-label">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
              />
              <span>Include end date in count</span>
            </label>

            <label className="datediff1-checkbox-label">
              <input
                type="checkbox"
                checked={businessDaysOnly}
                onChange={(e) => setBusinessDaysOnly(e.target.checked)}
              />
              <span>Highlight business days (Mon–Fri)</span>
            </label>
          </div>

          {analysis.error && (
            <div className="datediff1-error" role="alert">
              {analysis.error}
            </div>
          )}

          <div className="datediff1-btn-bar">
            <button
              type="button"
              className="datediff1-btn-primary"
              onClick={handleCopy}
              disabled={!summaryText}
            >
              {copied ? "Copied Summary" : "Copy Result"}
            </button>
            <button
              type="button"
              className="datediff1-btn-secondary"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </section>

        {analysis.info && (
          <section className="datediff1-summary-panel" aria-label="Date difference summary">
            <div className="datediff1-range-banner">
              Comparing <strong>{analysis.info.startLabel}</strong> to{" "}
              <strong>{analysis.info.endLabel}</strong>
              {analysis.info.swapped ? " (dates ordered chronologically)" : ""}
            </div>

            <div className="datediff1-stats-grid">
              <div className="datediff1-stat">
                <span className="datediff1-stat-title">
                  {businessDaysOnly ? "Business Days (Mon–Fri)" : "Total Days"}
                </span>
                <strong className="datediff1-stat-num">{analysis.info.activeCount}</strong>
              </div>
              <div className="datediff1-stat">
                <span className="datediff1-stat-title">Total Days</span>
                <strong className="datediff1-stat-num">{analysis.info.totalDays}</strong>
              </div>
              <div className="datediff1-stat">
                <span className="datediff1-stat-title">Total Weeks</span>
                <strong className="datediff1-stat-num">
                  {analysis.info.totalWeeks.toFixed(2)}
                </strong>
              </div>
              <div className="datediff1-stat">
                <span className="datediff1-stat-title">Calendar Span</span>
                <strong className="datediff1-stat-num datediff1-stat-small">
                  {analysis.info.years}y {analysis.info.months}m {analysis.info.days}d
                </strong>
              </div>
              <div className="datediff1-stat">
                <span className="datediff1-stat-title">Weekdays (Mon–Fri)</span>
                <strong className="datediff1-stat-num">{analysis.info.weekdays}</strong>
              </div>
              <div className="datediff1-stat">
                <span className="datediff1-stat-title">Weekend Days</span>
                <strong className="datediff1-stat-num">{analysis.info.weekends}</strong>
              </div>
            </div>
          </section>
        )}

        <article className="datediff1-note">
          <h2 className="datediff1-note-h2">Comparing Two Calendar Dates</h2>
          <p className="datediff1-note-p">
            When comparing two calendar dates, standard day difference counts the calendar days between the start date and end date, while enabling &ldquo;Include end date in count&rdquo; adds one day so both boundary dates are counted inclusively. Business day counts include Monday through Friday without subtracting regional public holidays.
          </p>
        </article>
        <RelatedCalculatorLinks currentSlug="date-difference-calculator" />

        <section className="datediff1-faq" aria-label="Frequently asked questions">
          <h2 className="datediff1-note-h2">Frequently Asked Questions</h2>
          <div className="datediff1-faq-list">
            {faqItems.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={item.question} className="datediff1-faq-item">
                  <button
                    type="button"
                    className="datediff1-faq-btn"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span>{open ? "−" : "+"}</span>
                  </button>
                  {open && <div className="datediff1-faq-ans">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

interface CalDate {
  year: number;
  month: number;
  day: number;
  ms: number;
}

function parseIsoDate(raw: string): CalDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const ms = Date.UTC(year, month - 1, day);
  const check = new Date(ms);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day, ms };
}

function formatDateReadable(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function diffCalendarYmd(start: CalDate, end: CalDate, includeEnd: boolean) {
  const effectiveEndMs = includeEnd ? end.ms + 86400000 : end.ms;
  const eDate = new Date(effectiveEndMs);
  let y = eDate.getUTCFullYear() - start.year;
  let m = eDate.getUTCMonth() + 1 - start.month;
  let d = eDate.getUTCDate() - start.day;

  if (d < 0) {
    m -= 1;
    const prevYr = eDate.getUTCMonth() === 0 ? eDate.getUTCFullYear() - 1 : eDate.getUTCFullYear();
    const prevMo = eDate.getUTCMonth() === 0 ? 12 : eDate.getUTCMonth();
    const daysInPrev = new Date(Date.UTC(prevYr, prevMo, 0)).getUTCDate();
    d += daysInPrev;
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return {
    years: Math.max(0, y),
    months: Math.max(0, m),
    days: Math.max(0, d),
  };
}