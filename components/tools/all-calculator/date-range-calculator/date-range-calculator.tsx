"use client";

import React, { useMemo, useState } from "react";
import "./date-range-calculator.css";
import { dateRangeFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

interface MonthlyRow {
  key: string;
  label: string;
  daysInRange: number;
  businessDays: number;
}

function parseYmd(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

function toYmd(dt: Date): string {
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(
    dt.getDate()
  ).padStart(2, "0")}`;
}

function spanYmd(a: Date, b: Date): { years: number; months: number } {
  const start = a <= b ? a : b;
  const end = a <= b ? b : a;
  let years = end.getFullYear() - start.getFullYear();
  const yrCheck = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());
  if (yrCheck > end) years -= 1;
  const afterYr = new Date(start.getFullYear() + years, start.getMonth(), start.getDate());

  let months =
    (end.getFullYear() - afterYr.getFullYear()) * 12 + (end.getMonth() - afterYr.getMonth());
  const moCheck = new Date(afterYr.getFullYear(), afterYr.getMonth() + months, afterYr.getDate());
  if (moCheck > end) months -= 1;
  return { years, months };
}

export default function DateRangeCalculator() {
  const [startDate, setStartDate] = useState<string>("2026-01-01");
  const [endDate, setEndDate] = useState<string>("2026-06-30");
  const [includeStart, setIncludeStart] = useState<boolean>(true);
  const [includeEnd, setIncludeEnd] = useState<boolean>(true);
  const [excludeWeekends, setExcludeWeekends] = useState<boolean>(false);
  const [holidayInput, setHolidayInput] = useState<string>("2026-01-19");
  const [holidays, setHolidays] = useState<string[]>(["2026-01-19"]);
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const addHoliday = () => {
    const parsed = parseYmd(holidayInput);
    if (!parsed) return;
    const norm = toYmd(parsed);
    if (!holidays.includes(norm)) {
      setHolidays((prev) => [...prev, norm].sort());
    }
  };

  const removeHoliday = (h: string) => {
    setHolidays((prev) => prev.filter((item) => item !== h));
  };

  const rangeData = useMemo(() => {
    const d1 = parseYmd(startDate);
    const d2 = parseYmd(endDate);
    if (!d1 || !d2) {
      return { error: "Please enter valid start and end dates." };
    }

    const earlier = d1 <= d2 ? d1 : d2;
    const later = d1 <= d2 ? d2 : d1;

    const firstDay = includeStart
      ? new Date(earlier)
      : new Date(earlier.getFullYear(), earlier.getMonth(), earlier.getDate() + 1);
    const lastDay = includeEnd
      ? new Date(later)
      : new Date(later.getFullYear(), later.getMonth(), later.getDate() - 1);

    const holidaySet = new Set(holidays);

    let totalDays = 0;
    let weekdays = 0;
    let saturdays = 0;
    let sundays = 0;
    let businessDays = 0;

    const monthMap = new Map<string, MonthlyRow>();
    const cur = new Date(firstDay);

    while (cur <= lastDay) {
      totalDays += 1;
      const dow = cur.getDay();
      const ymdStr = toYmd(cur);
      const isWeekend = dow === 0 || dow === 6;
      const isHoliday = holidaySet.has(ymdStr);

      if (dow === 6) saturdays += 1;
      else if (dow === 0) sundays += 1;
      else weekdays += 1;

      const countsAsBusiness = !isWeekend && !isHoliday;
      if (countsAsBusiness) businessDays += 1;

      const mKey = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}`;
      const mLabel = cur.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      const existing = monthMap.get(mKey) ?? {
        key: mKey,
        label: mLabel,
        daysInRange: 0,
        businessDays: 0,
      };
      existing.daysInRange += 1;
      if (countsAsBusiness) existing.businessDays += 1;
      monthMap.set(mKey, existing);

      cur.setDate(cur.getDate() + 1);
    }

    const weekendDays = saturdays + sundays;
    const activeDays = excludeWeekends ? businessDays : totalDays;
    const totalWeeks = Number((activeDays / 7).toFixed(2));
    const completeWeeks = Math.floor(activeDays / 7);
    const remainingDays = activeDays % 7;
    const ym = spanYmd(firstDay, lastDay);

    return {
      error: null,
      totalDays,
      totalWeeks,
      completeMonths: ym.months,
      completeYears: ym.years,
      weekdays,
      saturdays,
      sundays,
      weekendDays,
      businessDays,
      completeWeeks,
      remainingDays,
      monthlyRows: Array.from(monthMap.values()),
    };
  }, [startDate, endDate, includeStart, includeEnd, excludeWeekends, holidays]);

  const handleSwap = () => {
    const tmp = startDate;
    setStartDate(endDate);
    setEndDate(tmp);
  };

  const handleReset = () => {
    setStartDate("2026-01-01");
    setEndDate("2026-06-30");
    setIncludeStart(true);
    setIncludeEnd(true);
    setExcludeWeekends(false);
    setHolidayInput("2026-01-19");
    setHolidays(["2026-01-19"]);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (rangeData.error) return;
    const txt = `Date Range (${startDate} to ${endDate}): ${rangeData.totalDays} total days, ${rangeData.businessDays} business days, ${rangeData.weekendDays} weekend days, ${rangeData.completeWeeks} complete weeks + ${rangeData.remainingDays} days.`;
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="daterangeContainer" aria-label="Date Range Calculator">
      <header className="daterangeHeader">
        <h1 className="daterangeTitle">Date Range Calculator</h1>
        <p className="daterangeIntro">
          Analyze any period with our Date Range Calculator including total days, weeks, complete
          months and years, weekdays, Saturdays, Sundays, business days, custom holidays, and a
          monthly breakdown.
        </p>
      </header>

      <div className="daterangeDualCal">
        <div className="daterangeCalCard">
          <h2 className="daterangeCalTitle">Start Calendar Date</h2>
          <label htmlFor="dr-start" className="daterangeLabel">
            Start Date
          </label>
          <input
            id="dr-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="daterangeInput"
          />
        </div>

        <div className="daterangeCalCard">
          <h2 className="daterangeCalTitle">End Calendar Date</h2>
          <label htmlFor="dr-end" className="daterangeLabel">
            End Date
          </label>
          <input
            id="dr-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="daterangeInput"
          />
        </div>
      </div>

      {!rangeData.error && (
        <div className="daterangeVisualStrip">
          <span>
            <strong>Selected Range:</strong> {startDate} → {endDate}
          </span>
          <span className="daterangePill">{rangeData.totalDays} Calendar Days</span>
          <span className="daterangePill" style={{ backgroundColor: "#ea580c" }}>
            {rangeData.businessDays} Business Days
          </span>
        </div>
      )}

      <div className="daterangeControlsBox">
        <div className="daterangeFlags">
          <label>
            <input
              type="checkbox"
              checked={includeStart}
              onChange={(e) => setIncludeStart(e.target.checked)}
            />{" "}
            Include start date
          </label>
          <label>
            <input
              type="checkbox"
              checked={includeEnd}
              onChange={(e) => setIncludeEnd(e.target.checked)}
            />{" "}
            Include end date
          </label>
          <label>
            <input
              type="checkbox"
              checked={excludeWeekends}
              onChange={(e) => setExcludeWeekends(e.target.checked)}
            />{" "}
            Exclude weekends for week/day summary
          </label>
        </div>

        <div className="daterangeHolidayRow">
          <label htmlFor="dr-hol" className="daterangeLabel" style={{ marginBottom: 0 }}>
            Custom Holiday Date:
          </label>
          <input
            id="dr-hol"
            type="date"
            value={holidayInput}
            onChange={(e) => setHolidayInput(e.target.value)}
            className="daterangeInput"
            style={{ maxWidth: 190 }}
          />
          <button type="button" onClick={addHoliday} className="daterangeOrangeBtn">
            Add Holiday
          </button>
        </div>

        {holidays.length > 0 && (
          <div className="daterangeHolidayList">
            {holidays.map((h) => (
              <span key={h} className="daterangeHolidayChip">
                {h}
                <button
                  type="button"
                  aria-label={`Remove holiday ${h}`}
                  className="daterangeChipRemove"
                  onClick={() => removeHoliday(h)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {rangeData.error && (
          <p role="alert" style={{ color: "#b91c1c", fontWeight: 600 }}>
            {rangeData.error}
          </p>
        )}

        <div className="daterangeActions">
          <button type="button" onClick={handleCopy} className="daterangeBlueBtn">
            {copied ? "Copied Result!" : "Copy Result"}
          </button>
          <button type="button" onClick={handleSwap} className="daterangeLightBtn">
            Swap Dates
          </button>
          <button type="button" onClick={handleReset} className="daterangeLightBtn">
            Reset
          </button>
        </div>
      </div>

      {!rangeData.error && (
        <>
          <div className="daterangeStatsGrid">
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.totalDays}</div>
              <div className="daterangeStatLbl">Total Days</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.totalWeeks}</div>
              <div className="daterangeStatLbl">Total Weeks</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.completeMonths}</div>
              <div className="daterangeStatLbl">Complete Months</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.completeYears}</div>
              <div className="daterangeStatLbl">Complete Years</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.weekdays}</div>
              <div className="daterangeStatLbl">Weekdays</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.saturdays}</div>
              <div className="daterangeStatLbl">Saturdays</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.sundays}</div>
              <div className="daterangeStatLbl">Sundays</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.weekendDays}</div>
              <div className="daterangeStatLbl">Weekend Days</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.businessDays}</div>
              <div className="daterangeStatLbl">Business Days</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.completeWeeks}</div>
              <div className="daterangeStatLbl">Complete Weeks</div>
            </div>
            <div className="daterangeStatCard">
              <div className="daterangeStatNum">{rangeData.remainingDays}</div>
              <div className="daterangeStatLbl">Remaining Days</div>
            </div>
          </div>

          <div className="daterangeMonthlyBox">
            <h2 className="daterangeSubHeading">Monthly Breakdown</h2>
            <table className="daterangeTable">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Days in Range</th>
                  <th>Business Days (Excl. Weekends &amp; Holidays)</th>
                </tr>
              </thead>
              <tbody>
                {rangeData.monthlyRows?.map((row) => (
                  <tr key={row.key}>
                    <td>{row.label}</td>
                    <td>
                      <strong>{row.daysInRange}</strong>
                    </td>
                    <td>
                      <strong>{row.businessDays}</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <RelatedCalculatorLinks currentSlug="date-range-calculator" />

      <div className="daterangeFaqSection">
        <h2 className="daterangeFaqHeading">Frequently Asked Questions</h2>
        {dateRangeFaqs.map((faq, idx) => {
          const open = openFaq === idx;
          return (
            <div key={faq.question} className="daterangeFaqItem">
              <button
                type="button"
                aria-expanded={open}
                className="daterangeFaqBtn"
                onClick={() => setOpenFaq(open ? null : idx)}
              >
                <span>{faq.question}</span>
                <span>{open ? "−" : "+"}</span>
              </button>
              {open && <div className="daterangeFaqAnswer">{faq.answer}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}