"use client";

import React, { useMemo, useState } from "react";
import "./date-and-time-calculator-duration.css";
import { faqItems } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

export default function DateAndTimeCalculatorDuration() {
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [startTime, setStartTime] = useState<string>("09:00:00");
  const [endDate, setEndDate] = useState<string>("2026-03-15");
  const [endTime, setEndTime] = useState<string>("17:30:00");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const duration = useMemo(() => {
    const startParsed = parseDateAndTime(startDate, startTime);
    const endParsed = parseDateAndTime(endDate, endTime);

    if (!startParsed || !endParsed) {
      return {
        error: "Please enter valid start and end dates and times.",
        data: null,
      };
    }

    const diffMs = endParsed.epochMs - startParsed.epochMs;
    if (diffMs < 0) {
      return {
        error:
          "End date and time is earlier than start date and time. Please select an end time on or after the start time.",
        data: null,
      };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalSeconds / 3600;
    const totalDaysExact = totalSeconds / 86400;

    // Calendar-based breakdown (years, months, days, hours, minutes, seconds)
    const cal = computeCalendarBreakdown(startParsed, endParsed);
    const weeks = Math.floor(cal.remainingDaysAfterYearsMonths / 7);
    const daysInWeekRemainder = cal.remainingDaysAfterYearsMonths % 7;

    return {
      error: null,
      data: {
        years: cal.years,
        months: cal.months,
        weeks,
        daysInWeekRemainder,
        calendarDaysTotal: cal.totalCalendarDays,
        hours: cal.hours,
        minutes: cal.minutes,
        seconds: cal.seconds,
        totalHours,
        totalMinutes,
        totalSeconds,
        totalDaysExact,
      },
    };
  }, [startDate, startTime, endDate, endTime]);

  const summaryText = useMemo(() => {
    if (!duration.data) return "";
    const d = duration.data;
    const parts: string[] = [];
    if (d.years > 0) parts.push(`${d.years} ${d.years === 1 ? "year" : "years"}`);
    if (d.months > 0) parts.push(`${d.months} ${d.months === 1 ? "month" : "months"}`);
    if (d.weeks > 0) parts.push(`${d.weeks} ${d.weeks === 1 ? "week" : "weeks"}`);
    if (d.daysInWeekRemainder > 0) {
      parts.push(`${d.daysInWeekRemainder} ${d.daysInWeekRemainder === 1 ? "day" : "days"}`);
    }
    parts.push(`${d.hours}h ${d.minutes}m ${d.seconds}s`);
    return parts.join(", ");
  }, [duration.data]);

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
    setStartDate("");
    setStartTime("00:00:00");
    setEndDate("");
    setEndTime("00:00:00");
    setCopied(false);
  };

  return (
    <div className="dateduration1-root">
      <div className="dateduration1-frame">
        <header className="dateduration1-top">
          <span className="dateduration1-badge">Calendar &amp; Elapsed Duration</span>
          <h1 className="dateduration1-h1">Date and Time Calculator Duration</h1>
          <p className="dateduration1-desc">
            Calculate the duration between a start date/time and end date/time with both calendar units and exact total elapsed hours, minutes, and seconds.
          </p>
        </header>

        <div className="dateduration1-two-panel">
          <section className="dateduration1-panel dateduration1-panel-start" aria-label="Start date and time">
            <h2 className="dateduration1-panel-title">Start Date &amp; Time</h2>
            <div className="dateduration1-field">
              <label htmlFor="dateduration1-start-date" className="dateduration1-label">
                Start Date
              </label>
              <input
                id="dateduration1-start-date"
                type="date"
                className="dateduration1-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="dateduration1-field">
              <label htmlFor="dateduration1-start-time" className="dateduration1-label">
                Start Time
              </label>
              <input
                id="dateduration1-start-time"
                type="time"
                step="1"
                className="dateduration1-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </section>

          <section className="dateduration1-panel dateduration1-panel-end" aria-label="End date and time">
            <h2 className="dateduration1-panel-title">End Date &amp; Time</h2>
            <div className="dateduration1-field">
              <label htmlFor="dateduration1-end-date" className="dateduration1-label">
                End Date
              </label>
              <input
                id="dateduration1-end-date"
                type="date"
                className="dateduration1-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="dateduration1-field">
              <label htmlFor="dateduration1-end-time" className="dateduration1-label">
                End Time
              </label>
              <input
                id="dateduration1-end-time"
                type="time"
                step="1"
                className="dateduration1-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </section>
        </div>

        {duration.error && (
          <div className="dateduration1-error" role="alert">
            {duration.error}
          </div>
        )}

        <div className="dateduration1-actions">
          <button
            type="button"
            className="dateduration1-btn-cyan"
            onClick={handleCopy}
            disabled={!summaryText}
          >
            {copied ? "Copied Summary" : "Copy Duration Summary"}
          </button>
          <button
            type="button"
            className="dateduration1-btn-dark"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>

        {duration.data && (
          <section className="dateduration1-results" aria-label="Calculated duration">
            <div className="dateduration1-summary-card">
              <div className="dateduration1-summary-label">Duration Summary</div>
              <div className="dateduration1-summary-text">{summaryText}</div>
            </div>

            <div className="dateduration1-breakdown-grid">
              <div className="dateduration1-unit-box">
                <span>Years</span>
                <strong>{duration.data.years}</strong>
              </div>
              <div className="dateduration1-unit-box">
                <span>Months</span>
                <strong>{duration.data.months}</strong>
              </div>
              <div className="dateduration1-unit-box">
                <span>Weeks</span>
                <strong>{duration.data.weeks}</strong>
              </div>
              <div className="dateduration1-unit-box">
                <span>Days (wk rem.)</span>
                <strong>{duration.data.daysInWeekRemainder}</strong>
              </div>
              <div className="dateduration1-unit-box">
                <span>Hours</span>
                <strong>{duration.data.hours}</strong>
              </div>
              <div className="dateduration1-unit-box">
                <span>Minutes</span>
                <strong>{duration.data.minutes}</strong>
              </div>
              <div className="dateduration1-unit-box">
                <span>Seconds</span>
                <strong>{duration.data.seconds}</strong>
              </div>
            </div>

            <div className="dateduration1-totals-row">
              <div>
                <span>Total Hours:</span>{" "}
                <strong>{duration.data.totalHours.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong>
              </div>
              <div>
                <span>Total Minutes:</span>{" "}
                <strong>{duration.data.totalMinutes.toLocaleString("en-US", { maximumFractionDigits: 2 })}</strong>
              </div>
              <div>
                <span>Total Seconds:</span>{" "}
                <strong>{duration.data.totalSeconds.toLocaleString("en-US")}</strong>
              </div>
            </div>
          </section>
        )}

        <article className="dateduration1-guide">
          <h2 className="dateduration1-guide-h2">Calendar Duration vs. Total Elapsed Time</h2>
          <p className="dateduration1-guide-p">
            Calendar years and months vary in length—months can have 28, 29, 30, or 31 days, and leap years have 366 days. This calculator computes calendar years, months, and remaining days by advancing actual calendar dates, while total hours, minutes, and seconds reflect exact elapsed clock time from the start timestamp to the end timestamp.
          </p>
        </article>
        <RelatedCalculatorLinks currentSlug="date-and-time-calculator-duration" />

        <section className="dateduration1-faq" aria-label="Frequently asked questions">
          <h2 className="dateduration1-guide-h2">Frequently Asked Questions</h2>
          <div className="dateduration1-faq-list">
            {faqItems.map((item, idx) => {
              const expanded = openFaq === idx;
              return (
                <div key={item.question} className="dateduration1-faq-item">
                  <button
                    type="button"
                    className="dateduration1-faq-btn"
                    aria-expanded={expanded}
                    onClick={() => setOpenFaq(expanded ? null : idx)}
                  >
                    <span>{item.question}</span>
                    <span>{expanded ? "−" : "+"}</span>
                  </button>
                  {expanded && <div className="dateduration1-faq-body">{item.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

interface ParsedDateTime {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  hour: number;
  minute: number;
  second: number;
  epochMs: number;
}

function parseDateAndTime(dateStr: string, timeStr: string): ParsedDateTime | null {
  const dMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!dMatch) return null;
  const year = Number(dMatch[1]);
  const month = Number(dMatch[2]);
  const day = Number(dMatch[3]);

  const cleanTime = timeStr.trim() === "" ? "00:00:00" : timeStr.trim();
  const tMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(cleanTime);
  if (!tMatch) return null;
  const hour = Number(tMatch[1]);
  const minute = Number(tMatch[2]);
  const second = tMatch[3] ? Number(tMatch[3]) : 0;

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) return null;

  const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  if (
    utcDate.getUTCFullYear() !== year ||
    utcDate.getUTCMonth() !== month - 1 ||
    utcDate.getUTCDate() !== day
  ) {
    return null;
  }

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    epochMs: utcDate.getTime(),
  };
}

function daysInMonthUtc(year: number, month1Based: number): number {
  return new Date(Date.UTC(year, month1Based, 0)).getUTCDate();
}

function computeCalendarBreakdown(start: ParsedDateTime, end: ParsedDateTime) {
  let y = end.year - start.year;
  let m = end.month - start.month;
  let d = end.day - start.day;

  const startSecOfDay = start.hour * 3600 + start.minute * 60 + start.second;
  const endSecOfDay = end.hour * 3600 + end.minute * 60 + end.second;
  let secDiff = endSecOfDay - startSecOfDay;

  if (secDiff < 0) {
    d -= 1;
    secDiff += 86400;
  }

  if (d < 0) {
    m -= 1;
    const prevMonthYear = end.month === 1 ? end.year - 1 : end.year;
    const prevMonth = end.month === 1 ? 12 : end.month - 1;
    d += daysInMonthUtc(prevMonthYear, prevMonth);
  }

  if (m < 0) {
    y -= 1;
    m += 12;
  }

  const hours = Math.floor(secDiff / 3600);
  const minutes = Math.floor((secDiff % 3600) / 60);
  const seconds = secDiff % 60;

  const totalCalendarDays = Math.max(0, y * 365 + m * 30 + d);

  return {
    years: Math.max(0, y),
    months: Math.max(0, m),
    remainingDaysAfterYearsMonths: Math.max(0, d),
    totalCalendarDays,
    hours,
    minutes,
    seconds,
  };
}