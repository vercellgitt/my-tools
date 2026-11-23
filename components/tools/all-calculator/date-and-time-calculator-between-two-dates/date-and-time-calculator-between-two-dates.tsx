"use client";

import React, { useMemo, useState } from "react";
import "./date-and-time-calculator-between-two-dates.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

export default function DateAndTimeCalculatorBetweenTwoDates() {
  const [startDate, setStartDate] = useState<string>("2026-04-10");
  const [startTime, setStartTime] = useState<string>("08:15:00");
  const [endDate, setEndDate] = useState<string>("2026-04-13");
  const [endTime, setEndTime] = useState<string>("20:45:30");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const output = useMemo(() => {
    const s = parseExactDateTime(startDate, startTime);
    const e = parseExactDateTime(endDate, endTime);

    if (!s || !e) {
      return {
        error: "Please enter valid start and end dates and times.",
        res: null,
      };
    }

    const deltaMs = e.epochMs - s.epochMs;
    const isReversed = deltaMs < 0;
    const absMs = Math.abs(deltaMs);
    const totalSeconds = Math.floor(absMs / 1000);
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalSeconds / 3600;
    const totalDays = totalSeconds / 86400;

    const earlier = deltaMs >= 0 ? s : e;
    const later = deltaMs >= 0 ? e : s;
    const cal = exactCalendarParts(earlier, later);

    return {
      error: null,
      res: {
        startSummary: formatTimestamp(s.epochMs),
        endSummary: formatTimestamp(e.epochMs),
        isReversed,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        years: cal.years,
        months: cal.months,
        days: cal.days,
        hours: cal.hours,
        minutes: cal.minutes,
        seconds: cal.seconds,
      },
    };
  }, [startDate, startTime, endDate, endTime]);

  const copyText = useMemo(() => {
    if (!output.res) return "";
    const r = output.res;
    const prefix = r.isReversed ? "End is earlier by: " : "Elapsed: ";
    return `${prefix}${r.totalSeconds.toLocaleString("en-US")}s (${r.totalHours.toFixed(2)}h / ${r.totalDays.toFixed(4)}d)`;
  }, [output.res]);

  const handleCopy = async () => {
    if (!copyText) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(copyText);
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
    <div className="datetimebetween1-root">
      <div className="datetimebetween1-stage">
        <header className="datetimebetween1-header">
          <span className="datetimebetween1-tag">Exact Elapsed Timeline</span>
          <h1 className="datetimebetween1-title">Date and Time Calculator Between Two Dates</h1>
          <p className="datetimebetween1-sub">
            Measure exact elapsed days, hours, minutes, and seconds between two timestamps alongside a calendar breakdown.
          </p>
        </header>

        <section className="datetimebetween1-timeline-bar" aria-label="Start and end timestamps">
          <div className="datetimebetween1-node">
            <label htmlFor="datetimebetween1-s-date" className="datetimebetween1-node-title">
              START MARKER
            </label>
            <div className="datetimebetween1-inputs-pair">
              <input
                id="datetimebetween1-s-date"
                type="date"
                className="datetimebetween1-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                id="datetimebetween1-s-time"
                type="time"
                step="1"
                aria-label="Start time"
                className="datetimebetween1-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="datetimebetween1-connector" aria-hidden="true">
            <span className="datetimebetween1-line" />
            <span className="datetimebetween1-dot" />
            <span className="datetimebetween1-line" />
          </div>

          <div className="datetimebetween1-node">
            <label htmlFor="datetimebetween1-e-date" className="datetimebetween1-node-title">
              END MARKER
            </label>
            <div className="datetimebetween1-inputs-pair">
              <input
                id="datetimebetween1-e-date"
                type="date"
                className="datetimebetween1-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <input
                id="datetimebetween1-e-time"
                type="time"
                step="1"
                aria-label="End time"
                className="datetimebetween1-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </section>

        {output.error && (
          <div className="datetimebetween1-error" role="alert">
            {output.error}
          </div>
        )}

        <div className="datetimebetween1-toolbar">
          <button
            type="button"
            className="datetimebetween1-btn-electric"
            onClick={handleCopy}
            disabled={!copyText}
          >
            {copied ? "Copied Elapsed Time" : "Copy Result"}
          </button>
          <button
            type="button"
            className="datetimebetween1-btn-reset"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        {output.res && (
          <section className="datetimebetween1-board" aria-label="Elapsed time comparison">
            <div className="datetimebetween1-endpoints">
              <div className="datetimebetween1-endpoint-card">
                <span>Start Timestamp</span>
                <strong>{output.res.startSummary}</strong>
              </div>
              <div className="datetimebetween1-endpoint-card">
                <span>End Timestamp</span>
                <strong>{output.res.endSummary}</strong>
              </div>
            </div>

            {output.res.isReversed && (
              <div className="datetimebetween1-reversed-note">
                Note: End timestamp is earlier than start timestamp. Showing magnitude of difference between the two points.
              </div>
            )}

            <div className="datetimebetween1-elapsed-grid">
              <div className="datetimebetween1-elapsed-box">
                <span>Total Elapsed Days</span>
                <strong>{output.res.totalDays.toFixed(4)}</strong>
              </div>
              <div className="datetimebetween1-elapsed-box">
                <span>Total Elapsed Hours</span>
                <strong>{output.res.totalHours.toFixed(2)}</strong>
              </div>
              <div className="datetimebetween1-elapsed-box">
                <span>Total Elapsed Minutes</span>
                <strong>{output.res.totalMinutes.toFixed(2)}</strong>
              </div>
              <div className="datetimebetween1-elapsed-box datetimebetween1-elapsed-accent">
                <span>Total Elapsed Seconds</span>
                <strong>{output.res.totalSeconds.toLocaleString("en-US")}</strong>
              </div>
            </div>

            <div className="datetimebetween1-cal-strip">
              <strong>Calendar Breakdown:</strong>{" "}
              <span>
                {output.res.years}y {output.res.months}m {output.res.days}d{" "}
                {output.res.hours}h {output.res.minutes}m {output.res.seconds}s
              </span>
            </div>
          </section>
        )}

        <article className="datetimebetween1-article">
          <h2 className="datetimebetween1-h2">Precise Elapsed Time Calculation</h2>
          <p className="datetimebetween1-p">
            Total elapsed seconds, minutes, hours, and days are derived directly from the exact time difference in milliseconds between the two date-time entries—never from estimated 30-day months. The calendar breakdown provides a complementary human-readable view of years, months, days, and clock time.
          </p>
        </article>
        <RelatedCalculatorLinks currentSlug="date-and-time-calculator-between-two-dates" />

        <section className="datetimebetween1-faq" aria-label="Frequently asked questions">
          <h2 className="datetimebetween1-h2">Frequently Asked Questions</h2>
          <div className="datetimebetween1-faq-list">
            {faqItems.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={item.question} className="datetimebetween1-faq-item">
                  <button
                    type="button"
                    className="datetimebetween1-faq-btn"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span>{open ? "−" : "+"}</span>
                  </button>
                  {open && <div className="datetimebetween1-faq-ans">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

interface ExactDt {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  epochMs: number;
}

function parseExactDateTime(dStr: string, tStr: string): ExactDt | null {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dStr.trim());
  if (!dm) return null;
  const year = Number(dm[1]);
  const month = Number(dm[2]);
  const day = Number(dm[3]);

  const cleanT = tStr.trim() === "" ? "00:00:00" : tStr.trim();
  const tm = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(cleanT);
  if (!tm) return null;
  const hour = Number(tm[1]);
  const minute = Number(tm[2]);
  const second = tm[3] ? Number(tm[3]) : 0;

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour > 23 || minute > 59 || second > 59) return null;

  const epochMs = Date.UTC(year, month - 1, day, hour, minute, second);
  const check = new Date(epochMs);
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    return null;
  }

  return { year, month, day, hour, minute, second, epochMs };
}

function formatTimestamp(ms: number): string {
  return new Date(ms).toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }) + " UTC";
}

function exactCalendarParts(a: ExactDt, b: ExactDt) {
  let y = b.year - a.year;
  let m = b.month - a.month;
  let d = b.day - a.day;
  const aSec = a.hour * 3600 + a.minute * 60 + a.second;
  const bSec = b.hour * 3600 + b.minute * 60 + b.second;
  let diffSec = bSec - aSec;

  if (diffSec < 0) {
    d -= 1;
    diffSec += 86400;
  }
  if (d < 0) {
    m -= 1;
    const py = b.month === 1 ? b.year - 1 : b.year;
    const pm = b.month === 1 ? 12 : b.month - 1;
    d += new Date(Date.UTC(py, pm, 0)).getUTCDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }

  return {
    years: Math.max(0, y),
    months: Math.max(0, m),
    days: Math.max(0, d),
    hours: Math.floor(diffSec / 3600),
    minutes: Math.floor((diffSec % 3600) / 60),
    seconds: diffSec % 60,
  };
}