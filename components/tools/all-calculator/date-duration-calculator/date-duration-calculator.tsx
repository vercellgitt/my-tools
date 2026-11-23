"use client";

import React, { useMemo, useState } from "react";
import "./date-duration-calculator.css";
import { dateDurationFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type DurationMode = "dateOnly" | "dateTime";

type DateDurationResult =
  | {
      error: string;
    }
  | {
      error: null;
      years: number;
      months: number;
      weeks: number;
      days: number;
      rawDays: number;
      hours: number;
      minutes: number;
      seconds: number;
      businessDays: number;
      weekendDays: number;
    };

function parseDateOnly(
  s: string
): { y: number; m: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;

  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);

  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== m - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }

  return { y, m, d };
}

function combineDateTime(
  dateStr: string,
  timeStr: string
): Date | null {
  const dp = parseDateOnly(dateStr);
  if (!dp) return null;

  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(
    timeStr || "00:00"
  );

  if (!match) return null;

  const hh = Number(match[1]);
  const mm = Number(match[2]);
  const ss = Number(match[3] || "0");

  if (hh > 23 || mm > 59 || ss > 59) return null;

  return new Date(dp.y, dp.m - 1, dp.d, hh, mm, ss, 0);
}

function ymdDiff(
  start: Date,
  end: Date
): { years: number; months: number; days: number } {
  let a = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const b = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  if (a > b) {
    const tmp = new Date(a);
    a.setTime(b.getTime());
    b.setTime(tmp.getTime());
  }

  let years = b.getFullYear() - a.getFullYear();

  const testYear = new Date(
    a.getFullYear() + years,
    a.getMonth(),
    a.getDate()
  );

  if (testYear > b) {
    years -= 1;
  }

  const afterYears = new Date(
    a.getFullYear() + years,
    a.getMonth(),
    a.getDate()
  );

  let months =
    (b.getFullYear() - afterYears.getFullYear()) * 12 +
    (b.getMonth() - afterYears.getMonth());

  const testMonth = new Date(
    afterYears.getFullYear(),
    afterYears.getMonth() + months,
    afterYears.getDate()
  );

  if (testMonth > b) {
    months -= 1;
  }

  const afterMonths = new Date(
    afterYears.getFullYear(),
    afterYears.getMonth() + months,
    afterYears.getDate()
  );

  const days = Math.max(
    0,
    Math.round(
      (b.getTime() - afterMonths.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return { years, months, days };
}

export default function DateDurationCalculator() {
  const [mode, setMode] = useState<DurationMode>("dateOnly");
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endDate, setEndDate] = useState<string>("2026-12-31");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [includeEndDate, setIncludeEndDate] =
    useState<boolean>(false);
  const [excludeWeekends, setExcludeWeekends] =
    useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const result = useMemo<DateDurationResult>(() => {
    const sParts = parseDateOnly(startDate);
    const eParts = parseDateOnly(endDate);

    if (!sParts || !eParts) {
      return {
        error: "Please enter valid start and end dates.",
      };
    }

    const sDt =
      mode === "dateTime"
        ? combineDateTime(startDate, startTime)
        : new Date(
            sParts.y,
            sParts.m - 1,
            sParts.d,
            0,
            0,
            0,
            0
          );

    const eDt =
      mode === "dateTime"
        ? combineDateTime(endDate, endTime)
        : new Date(
            eParts.y,
            eParts.m - 1,
            eParts.d,
            0,
            0,
            0,
            0
          );

    if (!sDt || !eDt) {
      return {
        error: "Please enter valid start and end times.",
      };
    }

    const first = sDt <= eDt ? sDt : eDt;
    const second = sDt <= eDt ? eDt : sDt;

    const startDay = new Date(
      first.getFullYear(),
      first.getMonth(),
      first.getDate()
    );

    const endDay = new Date(
      second.getFullYear(),
      second.getMonth(),
      second.getDate()
    );

    let businessDays = 0;
    let weekendDays = 0;

    const cursor = new Date(startDay);

    const lastDay = includeEndDate
      ? endDay
      : new Date(
          endDay.getFullYear(),
          endDay.getMonth(),
          endDay.getDate() - 1
        );

    while (cursor <= lastDay) {
      const dow = cursor.getDay();

      if (dow === 0 || dow === 6) {
        weekendDays += 1;
      } else {
        businessDays += 1;
      }

      cursor.setDate(cursor.getDate() + 1);
    }

    const extraMs =
      includeEndDate && mode === "dateOnly"
        ? 86400000
        : 0;

    const totalMs = Math.max(
      0,
      second.getTime() - first.getTime() + extraMs
    );

    const totalSeconds = Math.floor(totalMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);

    const rawDays = Math.floor(
      totalMs / (1000 * 60 * 60 * 24)
    );

    const displayDays = excludeWeekends
      ? businessDays
      : rawDays;

    const weeks = Math.floor(displayDays / 7);

    const adjustedEnd = includeEndDate
      ? new Date(second.getTime() + 86400000)
      : second;

    const ymd = ymdDiff(first, adjustedEnd);

    return {
      error: null,
      years: ymd.years,
      months: ymd.months,
      weeks,
      days: displayDays,
      rawDays,
      hours: totalHours,
      minutes: totalMinutes,
      seconds: totalSeconds,
      businessDays,
      weekendDays,
    };
  }, [
    mode,
    startDate,
    startTime,
    endDate,
    endTime,
    includeEndDate,
    excludeWeekends,
  ]);

  const handleSwap = () => {
    const tmpD = startDate;
    const tmpT = startTime;

    setStartDate(endDate);
    setStartTime(endTime);
    setEndDate(tmpD);
    setEndTime(tmpT);
  };

  const handleReset = () => {
    setMode("dateOnly");
    setStartDate("2026-01-01");
    setStartTime("09:00");
    setEndDate("2026-12-31");
    setEndTime("17:00");
    setIncludeEndDate(false);
    setExcludeWeekends(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result.error !== null) return;

    const txt = `Duration (${startDate} to ${endDate}): ${result.years}y ${result.months}m ${result.days}d (${result.businessDays} business days, ${result.weekendDays} weekend days).`;

    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="datedurationContainer"
      aria-label="Date Duration Calculator"
    >
      <header className="datedurationHeader">
        <h1 className="datedurationTitle">
          Date Duration Calculator
        </h1>

        <p className="datedurationIntro">
          Measure exact time spans with our Date Duration Calculator
          in date-only or date-and-time mode. View years, months,
          weeks, days, hours, minutes, seconds, business days, and
          weekend counts with full leap-year support.
        </p>
      </header>

      <div
        className="datedurationModeSwitch"
        role="tablist"
        aria-label="Duration mode"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "dateOnly"}
          className={`datedurationModeBtn ${
            mode === "dateOnly" ? "datedurationModeActive" : ""
          }`}
          onClick={() => setMode("dateOnly")}
        >
          Date-Only Duration
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "dateTime"}
          className={`datedurationModeBtn ${
            mode === "dateTime" ? "datedurationModeActive" : ""
          }`}
          onClick={() => setMode("dateTime")}
        >
          Date &amp; Time Duration
        </button>
      </div>

      <div className="datedurationPanel">
        <div className="datedurationGrid">
          <div>
            <label
              htmlFor="dd-sdate"
              className="datedurationLabel"
            >
              Start Date
            </label>

            <input
              id="dd-sdate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="datedurationInput"
            />
          </div>

          {mode === "dateTime" && (
            <div>
              <label
                htmlFor="dd-stime"
                className="datedurationLabel"
              >
                Start Time
              </label>

              <input
                id="dd-stime"
                type="time"
                step="1"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="datedurationInput"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="dd-edate"
              className="datedurationLabel"
            >
              End Date
            </label>

            <input
              id="dd-edate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="datedurationInput"
            />
          </div>

          {mode === "dateTime" && (
            <div>
              <label
                htmlFor="dd-etime"
                className="datedurationLabel"
              >
                End Time
              </label>

              <input
                id="dd-etime"
                type="time"
                step="1"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="datedurationInput"
              />
            </div>
          )}
        </div>

        <div className="datedurationChecks">
          <label>
            <input
              type="checkbox"
              checked={includeEndDate}
              onChange={(e) =>
                setIncludeEndDate(e.target.checked)
              }
            />{" "}
            Include end date
          </label>

          <label>
            <input
              type="checkbox"
              checked={excludeWeekends}
              onChange={(e) =>
                setExcludeWeekends(e.target.checked)
              }
            />{" "}
            Exclude weekends (show business days as primary days)
          </label>
        </div>

        {result.error !== null && (
          <p
            role="alert"
            style={{
              color: "#b91c1c",
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            {result.error}
          </p>
        )}

        <div className="datedurationActions">
          <button
            type="button"
            onClick={handleCopy}
            className="datedurationPrimaryBtn"
            disabled={result.error !== null}
          >
            {copied ? "Copied Result!" : "Copy Result"}
          </button>

          <button
            type="button"
            onClick={handleSwap}
            className="datedurationSecondaryBtn"
          >
            Swap Dates
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="datedurationSecondaryBtn"
          >
            Reset
          </button>
        </div>
      </div>

      {result.error === null && (
        <>
          <div className="datedurationTimelineBar">
            <span>Start: {startDate}</span>

            <span
              className="datedurationLine"
              aria-hidden="true"
            />

            <span>End: {endDate}</span>
          </div>

          <div className="datedurationCards">
            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.years}
              </div>
              <div className="datedurationCardLabel">Years</div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.months}
              </div>
              <div className="datedurationCardLabel">Months</div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.weeks}
              </div>
              <div className="datedurationCardLabel">Weeks</div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.days}
              </div>
              <div className="datedurationCardLabel">
                {excludeWeekends ? "Business Days" : "Days"}
              </div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.hours.toLocaleString()}
              </div>
              <div className="datedurationCardLabel">Hours</div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.minutes.toLocaleString()}
              </div>
              <div className="datedurationCardLabel">Minutes</div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.seconds.toLocaleString()}
              </div>
              <div className="datedurationCardLabel">Seconds</div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.businessDays}
              </div>
              <div className="datedurationCardLabel">
                Business Days
              </div>
            </div>

            <div className="datedurationCard">
              <div className="datedurationCardVal">
                {result.weekendDays}
              </div>
              <div className="datedurationCardLabel">
                Weekend Days
              </div>
            </div>
          </div>
        </>
      )}

      <RelatedCalculatorLinks currentSlug="date-duration-calculator" />

      <div className="datedurationFaqWrap">
        <h2 className="datedurationFaqHeading">
          Frequently Asked Questions
        </h2>

        {dateDurationFaqs.map((faq, idx) => {
          const open = openFaq === idx;

          return (
            <div
              key={faq.question}
              className="datedurationFaqItem"
            >
              <button
                type="button"
                aria-expanded={open}
                className="datedurationFaqBtn"
                onClick={() =>
                  setOpenFaq(open ? null : idx)
                }
              >
                <span>{faq.question}</span>
                <span>{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="datedurationFaqAnswer">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}