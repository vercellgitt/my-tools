"use client";

import React, { useMemo, useState } from "react";
import "./date-to-date-calculator.css";
import { dateToDateFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type DateToDateResult =
  | {
      error: string;
    }
  | {
      error: null;
      totalDays: number;
      completeYears: number;
      completeMonths: number;
      completeWeeks: number;
      remainingDays: number;
      weekdays: number;
      weekendDays: number;
      businessDays: number;
      isReversed: boolean;
    };

function parseLocal(s: string): Date | null {
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

  return dt;
}

function fmtLocal(dt: Date): string {
  return `${dt.getFullYear()}-${String(
    dt.getMonth() + 1
  ).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function calendarYearsMonthsDays(
  a: Date,
  b: Date
): { years: number; months: number; days: number } {
  const start = a <= b ? a : b;
  const end = a <= b ? b : a;

  let years = end.getFullYear() - start.getFullYear();

  const yrCheck = new Date(
    start.getFullYear() + years,
    start.getMonth(),
    start.getDate()
  );

  if (yrCheck > end) years -= 1;

  const afterYr = new Date(
    start.getFullYear() + years,
    start.getMonth(),
    start.getDate()
  );

  let months =
    (end.getFullYear() - afterYr.getFullYear()) * 12 +
    (end.getMonth() - afterYr.getMonth());

  const moCheck = new Date(
    afterYr.getFullYear(),
    afterYr.getMonth() + months,
    afterYr.getDate()
  );

  if (moCheck > end) months -= 1;

  const afterMo = new Date(
    afterYr.getFullYear(),
    afterYr.getMonth() + months,
    afterYr.getDate()
  );

  const days = Math.max(
    0,
    Math.round(
      (end.getTime() - afterMo.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return { years, months, days };
}

export default function DateToDateCalculator() {
  const [firstDate, setFirstDate] = useState<string>("2026-03-01");
  const [secondDate, setSecondDate] = useState<string>("2026-11-22");
  const [includeStart, setIncludeStart] = useState<boolean>(true);
  const [includeEnd, setIncludeEnd] = useState<boolean>(false);
  const [excludeWeekends, setExcludeWeekends] =
    useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = useMemo<DateToDateResult>(() => {
    const d1 = parseLocal(firstDate);
    const d2 = parseLocal(secondDate);

    if (!d1 || !d2) {
      return {
        error: "Please enter valid first and second dates.",
      };
    }

    const earlier = d1 <= d2 ? d1 : d2;
    const later = d1 <= d2 ? d2 : d1;

    const iterStart = includeStart
      ? new Date(earlier)
      : new Date(
          earlier.getFullYear(),
          earlier.getMonth(),
          earlier.getDate() + 1
        );

    const iterEnd = includeEnd
      ? new Date(later)
      : new Date(
          later.getFullYear(),
          later.getMonth(),
          later.getDate() - 1
        );

    let weekdays = 0;
    let weekendDays = 0;

    const cur = new Date(iterStart);

    while (cur <= iterEnd) {
      const dow = cur.getDay();

      if (dow === 0 || dow === 6) {
        weekendDays += 1;
      } else {
        weekdays += 1;
      }

      cur.setDate(cur.getDate() + 1);
    }

    const totalDays = Math.max(0, weekdays + weekendDays);

    const effectiveDays = excludeWeekends
      ? weekdays
      : totalDays;

    const completeWeeks = Math.floor(effectiveDays / 7);
    const remainingAfterWeeks = effectiveDays % 7;

    const ymdEnd = includeEnd
      ? new Date(
          later.getFullYear(),
          later.getMonth(),
          later.getDate() + 1
        )
      : later;

    const ymdStart = includeStart
      ? earlier
      : new Date(
          earlier.getFullYear(),
          earlier.getMonth(),
          earlier.getDate() + 1
        );

    const ymd =
      ymdStart <= ymdEnd
        ? calendarYearsMonthsDays(ymdStart, ymdEnd)
        : { years: 0, months: 0, days: 0 };

    return {
      error: null,
      totalDays,
      completeYears: ymd.years,
      completeMonths: ymd.months,
      completeWeeks,
      remainingDays: remainingAfterWeeks,
      weekdays,
      weekendDays,
      businessDays: weekdays,
      isReversed: d1 > d2,
    };
  }, [
    firstDate,
    secondDate,
    includeStart,
    includeEnd,
    excludeWeekends,
  ]);

  const handleSwap = () => {
    const tmp = firstDate;
    setFirstDate(secondDate);
    setSecondDate(tmp);
  };

  const handleReset = () => {
    setFirstDate("2026-03-01");
    setSecondDate("2026-11-22");
    setIncludeStart(true);
    setIncludeEnd(false);
    setExcludeWeekends(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (stats.error !== null) return;

    const txt = `Date Comparison (${firstDate} vs ${secondDate}): ${stats.totalDays} total days (${stats.completeYears}y ${stats.completeMonths}m, ${stats.completeWeeks}w ${stats.remainingDays}d, ${stats.businessDays} business days, ${stats.weekendDays} weekend days).`;

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
      className="datetodateWrap"
      aria-label="Date to Date Calculator"
    >
      <header className="datetodateHeader">
        <h1 className="datetodateTitle">
          Date to Date Calculator
        </h1>

        <p className="datetodateIntro">
          Compare any two dates with our Date to Date Calculator
          to get total days, complete years, complete months,
          complete weeks, weekdays, weekend days, and business
          days with full leap-year accuracy.
        </p>
      </header>

      <div className="datetodateCardsRow">
        <div className="datetodateInputCard">
          <h2 className="datetodateCardHeading">First Date</h2>

          <label
            htmlFor="dtd-first"
            className="datetodateLabel"
          >
            Select First Date
          </label>

          <input
            id="dtd-first"
            type="date"
            value={firstDate}
            onChange={(e) => setFirstDate(e.target.value)}
            className="datetodateDateInput"
          />

          <button
            type="button"
            className="datetodateTodayBtn"
            onClick={() => setFirstDate(fmtLocal(new Date()))}
          >
            Set Today
          </button>
        </div>

        <div className="datetodateInputCard">
          <h2 className="datetodateCardHeading">Second Date</h2>

          <label
            htmlFor="dtd-second"
            className="datetodateLabel"
          >
            Select Second Date
          </label>

          <input
            id="dtd-second"
            type="date"
            value={secondDate}
            onChange={(e) => setSecondDate(e.target.value)}
            className="datetodateDateInput"
          />

          <button
            type="button"
            className="datetodateTodayBtn"
            onClick={() => setSecondDate(fmtLocal(new Date()))}
          >
            Set Today
          </button>
        </div>
      </div>

      <div className="datetodateOptionsBar">
        <div className="datetodateChecks">
          <label>
            <input
              type="checkbox"
              checked={includeStart}
              onChange={(e) =>
                setIncludeStart(e.target.checked)
              }
            />{" "}
            Include start date
          </label>

          <label>
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) =>
                setIncludeEnd(e.target.checked)
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
            Exclude weekends
          </label>
        </div>

        <div className="datetodateBtns">
          <button
            type="button"
            onClick={handleCopy}
            className="datetodateCoralBtn"
            disabled={stats.error !== null}
          >
            {copied ? "Copied Result!" : "Copy Result"}
          </button>

          <button
            type="button"
            onClick={handleSwap}
            className="datetodateOrangeBtn"
          >
            Swap Dates
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="datetodateOrangeBtn"
          >
            Reset
          </button>
        </div>
      </div>

      {stats.error !== null ? (
        <p
          role="alert"
          style={{ color: "#b91c1c", fontWeight: 600 }}
        >
          {stats.error}
        </p>
      ) : (
        <div className="datetodateComparisonPanel">
          <h2 className="datetodateCompTitle">
            Comparison Overview{" "}
            {stats.isReversed
              ? "(First date is later than second date — absolute span shown)"
              : ""}
          </h2>

          <div className="datetodateStatsGrid">
            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.totalDays.toLocaleString()}
              </div>
              <div className="datetodateStatName">
                Total Days
              </div>
            </div>

            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.completeYears}
              </div>
              <div className="datetodateStatName">
                Complete Years
              </div>
            </div>

            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.completeMonths}
              </div>
              <div className="datetodateStatName">
                Complete Months
              </div>
            </div>

            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.completeWeeks}
              </div>
              <div className="datetodateStatName">
                Complete Weeks
              </div>
            </div>

            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.remainingDays}
              </div>
              <div className="datetodateStatName">
                Remaining Days
              </div>
            </div>

            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.weekdays}
              </div>
              <div className="datetodateStatName">
                Weekdays
              </div>
            </div>

            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.weekendDays}
              </div>
              <div className="datetodateStatName">
                Weekend Days
              </div>
            </div>

            <div className="datetodateStatBox">
              <div className="datetodateStatVal">
                {stats.businessDays}
              </div>
              <div className="datetodateStatName">
                Business Days
              </div>
            </div>
          </div>
        </div>
      )}

      <RelatedCalculatorLinks currentSlug="date-to-date-calculator" />

      <div className="datetodateFaqWrap">
        <h2 className="datetodateFaqHeading">
          Frequently Asked Questions
        </h2>

        {dateToDateFaqs.map((faq, idx) => {
          const open = openFaq === idx;

          return (
            <div
              key={faq.question}
              className="datetodateFaqItem"
            >
              <button
                type="button"
                aria-expanded={open}
                className="datetodateFaqBtn"
                onClick={() => setOpenFaq(open ? null : idx)}
              >
                <span>{faq.question}</span>
                <span>{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="datetodateFaqAnswer">
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