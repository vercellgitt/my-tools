"use client";

import React, { useState, useEffect } from "react";
import { dateAndTimeToolsConfig } from "./faq";
import "./date-and-time-duration-calculator.css";

interface Props {
  slug: string;
}

export default function DateAndTimeDurationCalculator({ slug }: Props) {
  const config =
    dateAndTimeToolsConfig[slug] ||
    dateAndTimeToolsConfig["date-and-time-duration-calculator"];

  const [calculatorType, setCalculatorType] = useState<string>("duration");

  // Calculator 1 state
  const [durSd, setDurSd] = useState("");
  const [durSt, setDurSt] = useState("00:00");
  const [durEd, setDurEd] = useState("");
  const [durEt, setDurEt] = useState("00:00");

  // Calculator 2 state
  const [addSd, setAddSd] = useState("");
  const [addSt, setAddSt] = useState("00:00");
  const [addOperation, setAddOperation] = useState("add");
  const [addValue, setAddValue] = useState("");
  const [addUnit, setAddUnit] = useState("years");

  // Calculator 3 state
  const [diffSd, setDiffSd] = useState("");
  const [diffEd, setDiffEd] = useState("");

  // Calculator 4 state
  const [betSd, setBetSd] = useState("");
  const [betEd, setBetEd] = useState("");
  const [betType, setBetType] = useState("middle");
  const [betPercentage, setBetPercentage] = useState("");

  // Calculator 5 state
  const [betTimeSd, setBetTimeSd] = useState("");
  const [betTimeSt, setBetTimeSt] = useState("00:00");
  const [betTimeEd, setBetTimeEd] = useState("");
  const [betTimeEt, setBetTimeEt] = useState("00:00");
  const [betTimeInclude, setBetTimeInclude] = useState("exclude");

  const [errorMsg, setErrorMsg] = useState("");
  const [resultItems, setResultItems] = useState<
    { label: string; value: string }[] | null
  >(null);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sync calculatorType based on URL slug on load
  useEffect(() => {
    if (slug === "date-and-time-duration-calculator") {
      setCalculatorType("duration");
    } else if (slug === "date-and-time-calculator-duration") {
      setCalculatorType("add");
    } else if (slug === "date-difference-calculator") {
      setCalculatorType("difference");
    } else if (slug === "calculate-the-date-between-two-dates") {
      setCalculatorType("between");
    } else if (slug === "date-and-time-calculator-between-two-dates") {
      setCalculatorType("betweenTime");
    }
  }, [slug]);

  const formatNumber = (val: number) =>
    val.toLocaleString("en-US", { maximumFractionDigits: 2 });

  const plural = (val: number, word: string) =>
    `${val} ${word}${val === 1 ? "" : "s"}`;

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);

  const formatDateTime = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);

  const formatWeeksFromMilliseconds = (ms: number) => {
    let secs = Math.floor(ms / 1000);

    const weeks = Math.floor(secs / 604800);
    secs %= 604800;

    const days = Math.floor(secs / 86400);
    secs %= 86400;

    const hours = Math.floor(secs / 3600);
    secs %= 3600;

    const minutes = Math.floor(secs / 60);
    secs %= 60;

    const parts = [];

    if (weeks) parts.push(plural(weeks, "week"));
    if (days) parts.push(plural(days, "day"));
    if (hours) parts.push(plural(hours, "hour"));
    if (minutes) parts.push(plural(minutes, "minute"));
    if (secs) parts.push(plural(secs, "second"));

    return parts.length ? parts.join(", ") : "0 weeks";
  };

  const formatWeeksFromDays = (days: number) =>
    formatWeeksFromMilliseconds(days * 86400000);

  const addCalendarDays = (date: Date, days: number) => {
    const res = new Date(date.getTime());
    res.setDate(res.getDate() + days);
    return res;
  };

  const addMonthsClamped = (date: Date, months: number) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    const res = new Date(
      year,
      month + months,
      1,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );

    const lastDay = new Date(
      res.getFullYear(),
      res.getMonth() + 1,
      0
    ).getDate();

    res.setDate(Math.min(day, lastDay));

    return res;
  };

  const getCalendarBreakdown = (start: Date, end: Date) => {
    if (end < start) {
      throw new Error("End date must not be earlier than start date.");
    }

    let totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth();

    let cursor = addMonthsClamped(start, totalMonths);

    if (cursor > end) {
      totalMonths--;
      cursor = addMonthsClamped(start, totalMonths);
    }

    let days = 0;

    while (true) {
      const next = addCalendarDays(cursor, 1);

      if (next > end) break;

      cursor = next;
      days++;
    }

    const rem = end.getTime() - cursor.getTime();

    return {
      years: Math.floor(totalMonths / 12),
      months: totalMonths % 12,
      days,
      hours: Math.floor(rem / 3600000),
      minutes: Math.floor((rem % 3600000) / 60000),
      seconds: Math.floor((rem % 60000) / 1000),
    };
  };

  const formatBreakdown = (data: any) =>
    [
      plural(data.years, "year"),
      plural(data.months, "month"),
      plural(data.days, "day"),
      plural(data.hours, "hour"),
      plural(data.minutes, "minute"),
      plural(data.seconds, "second"),
    ].join(", ");

  const parseDateTime = (dStr: string, tStr: string) => {
    if (!dStr || !tStr) {
      throw new Error(
        "Please complete all required date and time fields."
      );
    }

    const [y, m, d] = dStr.split("-").map(Number);
    const [h, min] = tStr.split(":").map(Number);

    const date = new Date(y, m - 1, d, h, min, 0, 0);

    if (
      date.getFullYear() !== y ||
      date.getMonth() !== m - 1 ||
      date.getDate() !== d ||
      date.getHours() !== h ||
      date.getMinutes() !== min
    ) {
      throw new Error("Please enter a valid date and time.");
    }

    return date;
  };

  const parseDateOnly = (dStr: string) => {
    if (!dStr) {
      throw new Error("Please select all required dates.");
    }

    const [y, m, d] = dStr.split("-").map(Number);
    const ts = Date.UTC(y, m - 1, d);
    const check = new Date(ts);

    if (
      check.getUTCFullYear() !== y ||
      check.getUTCMonth() !== m - 1 ||
      check.getUTCDate() !== d
    ) {
      throw new Error("Please enter a valid date.");
    }

    return {
      year: y,
      month: m,
      day: d,
      timestamp: ts,
    };
  };

  // Calculation handler
  useEffect(() => {
    setErrorMsg("");
    setResultItems(null);

    try {
      if (calculatorType === "duration") {
        if (!durSd || !durEd) return;

        const start = parseDateTime(durSd, durSt);
        const end = parseDateTime(durEd, durEt);

        if (end < start) {
          throw new Error(
            "End date and time must be later than or equal to start date and time."
          );
        }

        const diff = end.getTime() - start.getTime();
        const bd = getCalendarBreakdown(start, end);

        setResultItems([
          {
            label: "Start Date and Time",
            value: formatDateTime(start),
          },
          {
            label: "End Date and Time",
            value: formatDateTime(end),
          },
          {
            label: "Calendar Duration",
            value: formatBreakdown(bd),
          },
          {
            label: "Total Days",
            value: formatNumber(diff / 86400000),
          },
          {
            label: "Total Weeks",
            value: formatWeeksFromMilliseconds(diff),
          },
          {
            label: "Complete Weeks",
            value: Math.floor(diff / 604800000).toLocaleString("en-US"),
          },
          {
            label: "Total Hours",
            value: formatNumber(diff / 3600000),
          },
          {
            label: "Total Minutes",
            value: Math.floor(diff / 60000).toLocaleString("en-US"),
          },
          {
            label: "Total Seconds",
            value: Math.floor(diff / 1000).toLocaleString("en-US"),
          },
        ]);
      } else if (calculatorType === "add") {
        if (!addSd || addValue === "") return;

        const start = parseDateTime(addSd, addSt);
        const val = Number(addValue);

        if (!Number.isFinite(val) || val < 0) {
          throw new Error(
            "Please enter a valid non-negative duration value."
          );
        }

        const dir = addOperation === "add" ? 1 : -1;
        let res = new Date(start.getTime());

        if (addUnit === "years") {
          res = addMonthsClamped(res, dir * val * 12);
        } else if (addUnit === "months") {
          res = addMonthsClamped(res, dir * val);
        } else if (addUnit === "weeks") {
          res = addCalendarDays(res, dir * val * 7);
        } else if (addUnit === "days") {
          res = addCalendarDays(res, dir * val);
        } else if (addUnit === "hours") {
          res = new Date(res.getTime() + dir * val * 3600000);
        } else if (addUnit === "minutes") {
          res = new Date(res.getTime() + dir * val * 60000);
        }

        setResultItems([
          {
            label: "Starting Date and Time",
            value: formatDateTime(start),
          },
          {
            label: "Operation",
            value:
              addOperation === "add"
                ? "Add Duration"
                : "Subtract Duration",
          },
          {
            label: "Duration",
            value: `${val} ${addUnit}`,
          },
          {
            label: "Result Date",
            value: formatDate(res),
          },
          {
            label: "Result Time",
            value: res.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
          {
            label: "Result Date and Time",
            value: formatDateTime(res),
          },
        ]);
      } else if (calculatorType === "difference") {
        if (!diffSd || !diffEd) return;

        const start = parseDateOnly(diffSd);
        const end = parseDateOnly(diffEd);

        if (end.timestamp < start.timestamp) {
          throw new Error(
            "End date must not be earlier than start date."
          );
        }

        const totalDays = Math.round(
          (end.timestamp - start.timestamp) / 86400000
        );

        setResultItems([
          {
            label: "Start Date",
            value: formatDate(
              new Date(start.year, start.month - 1, start.day)
            ),
          },
          {
            label: "End Date",
            value: formatDate(
              new Date(end.year, end.month - 1, end.day)
            ),
          },
          {
            label: "Total Days",
            value: totalDays.toLocaleString("en-US"),
          },
          {
            label: "Total Weeks",
            value: formatWeeksFromDays(totalDays),
          },
          {
            label: "Complete Weeks",
            value: Math.floor(totalDays / 7).toLocaleString("en-US"),
          },
        ]);
      } else if (calculatorType === "between") {
        if (!betSd || !betEd) return;

        const start = parseDateOnly(betSd);
        const end = parseDateOnly(betEd);

        if (end.timestamp < start.timestamp) {
          throw new Error(
            "End date must not be earlier than start date."
          );
        }

        const totalDays = Math.round(
          (end.timestamp - start.timestamp) / 86400000
        );

        let pct = 50;

        if (betType === "percentage") {
          pct = Number(betPercentage);

          if (
            !Number.isFinite(pct) ||
            pct < 0 ||
            pct > 100
          ) {
            throw new Error(
              "Please enter a percentage between 0 and 100."
            );
          }
        }

        const offset = Math.round((totalDays * pct) / 100);
        const target = new Date(
          start.timestamp + offset * 86400000
        );

        setResultItems([
          {
            label: "Start Date",
            value: formatDate(
              new Date(start.year, start.month - 1, start.day)
            ),
          },
          {
            label: "End Date",
            value: formatDate(
              new Date(end.year, end.month - 1, end.day)
            ),
          },
          {
            label: "Total Days Between",
            value: totalDays.toLocaleString("en-US"),
          },
          {
            label: "Percentage",
            value: `${pct}%`,
          },
          {
            label:
              betType === "middle"
                ? "Middle Date"
                : "Percentage Date",
            value: formatDate(
              new Date(
                target.getUTCFullYear(),
                target.getUTCMonth(),
                target.getUTCDate()
              )
            ),
          },
          {
            label: "Days From Start",
            value: offset.toLocaleString("en-US"),
          },
        ]);
      } else if (calculatorType === "betweenTime") {
        if (!betTimeSd || !betTimeEd) return;

        const start = parseDateTime(betTimeSd, betTimeSt);
        const origEnd = parseDateTime(betTimeEd, betTimeEt);

        const end =
          betTimeInclude === "include"
            ? addCalendarDays(origEnd, 1)
            : origEnd;

        if (end < start) {
          throw new Error(
            "Calculated end date must not be earlier than start date."
          );
        }

        const diff = end.getTime() - start.getTime();
        const bd = getCalendarBreakdown(start, end);

        setResultItems([
          {
            label: "Start Date and Time",
            value: formatDateTime(start),
          },
          {
            label: "Original End",
            value: formatDateTime(origEnd),
          },
          {
            label: "End Date Option",
            value:
              betTimeInclude === "include"
                ? "Include End Date"
                : "Exclude End Date",
          },
          {
            label: "Calendar Duration",
            value: formatBreakdown(bd),
          },
          {
            label: "Total Days",
            value: formatNumber(diff / 86400000),
          },
          {
            label: "Total Hours",
            value: formatNumber(diff / 3600000),
          },
        ]);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      setResultItems(null);
    }
  }, [
    calculatorType,
    durSd,
    durSt,
    durEd,
    durEt,
    addSd,
    addSt,
    addOperation,
    addValue,
    addUnit,
    diffSd,
    diffEd,
    betSd,
    betEd,
    betType,
    betPercentage,
    betTimeSd,
    betTimeSt,
    betTimeEd,
    betTimeEt,
    betTimeInclude,
  ]);

  const handleReset = () => {
    setDurSd("");
    setDurSt("00:00");
    setDurEd("");
    setDurEt("00:00");

    setAddSd("");
    setAddSt("00:00");
    setAddValue("");

    setDiffSd("");
    setDiffEd("");

    setBetSd("");
    setBetEd("");
    setBetPercentage("");

    setBetTimeSd("");
    setBetTimeSt("00:00");
    setBetTimeEd("");
    setBetTimeEt("00:00");

    setErrorMsg("");
    setResultItems(null);
  };

  const handleCopy = () => {
    if (!resultItems) return;

    const text = resultItems
      .map((i) => `${i.label}: ${i.value}`)
      .join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="date-and-time1-wrapper">
        {/* H1: Exactly one H1 per URL */}
        <h1 className="date-and-time1-h1">
          {config.h1Title}
        </h1>

        <p className="date-and-time1-desc">
          {config.introText}
        </p>

        <div className="date-and-time1-group">
          <label
            className="date-and-time1-label"
            htmlFor="calculatorTypeSelect"
          >
            Select Calculator
          </label>

          <select
            id="calculatorTypeSelect"
            className="date-and-time1-select"
            value={calculatorType}
            onChange={(e) => setCalculatorType(e.target.value)}
          >
            <option value="duration">
              Date and Time Duration Calculator
            </option>
            <option value="add">
              Date and Time Calculator Duration
            </option>
            <option value="difference">
              Date Difference Calculator
            </option>
            <option value="between">
              Calculate the Date Between Two Dates
            </option>
            <option value="betweenTime">
              Date and Time Calculator Between Two Dates
            </option>
          </select>
        </div>

        {/* CALCULATOR 1 */}
        {calculatorType === "duration" && (
          <div className="date-and-time1-section">
            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={durSd}
                  onChange={(e) => setDurSd(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Time
                </label>
                <input
                  type="time"
                  className="date-and-time1-input"
                  value={durSt}
                  onChange={(e) => setDurSt(e.target.value)}
                />
              </div>
            </div>

            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={durEd}
                  onChange={(e) => setDurEd(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  End Time
                </label>
                <input
                  type="time"
                  className="date-and-time1-input"
                  value={durEt}
                  onChange={(e) => setDurEt(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* CALCULATOR 2 */}
        {calculatorType === "add" && (
          <div className="date-and-time1-section">
            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={addSd}
                  onChange={(e) => setAddSd(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Time
                </label>
                <input
                  type="time"
                  className="date-and-time1-input"
                  value={addSt}
                  onChange={(e) => setAddSt(e.target.value)}
                />
              </div>
            </div>

            <div className="date-and-time1-group">
              <label className="date-and-time1-label">
                Operation
              </label>
              <select
                className="date-and-time1-select"
                value={addOperation}
                onChange={(e) => setAddOperation(e.target.value)}
              >
                <option value="add">Add Duration</option>
                <option value="subtract">Subtract Duration</option>
              </select>
            </div>

            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Duration Value
                </label>
                <input
                  type="number"
                  className="date-and-time1-input"
                  placeholder="Enter duration"
                  value={addValue}
                  onChange={(e) => setAddValue(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Duration Unit
                </label>
                <select
                  className="date-and-time1-select"
                  value={addUnit}
                  onChange={(e) => setAddUnit(e.target.value)}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                  <option value="weeks">Weeks</option>
                  <option value="days">Days</option>
                  <option value="hours">Hours</option>
                  <option value="minutes">Minutes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* CALCULATOR 3 */}
        {calculatorType === "difference" && (
          <div className="date-and-time1-section">
            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={diffSd}
                  onChange={(e) => setDiffSd(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={diffEd}
                  onChange={(e) => setDiffEd(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* CALCULATOR 4 */}
        {calculatorType === "between" && (
          <div className="date-and-time1-section">
            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={betSd}
                  onChange={(e) => setBetSd(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={betEd}
                  onChange={(e) => setBetEd(e.target.value)}
                />
              </div>
            </div>

            <div className="date-and-time1-group">
              <label className="date-and-time1-label">
                Calculation Type
              </label>
              <select
                className="date-and-time1-select"
                value={betType}
                onChange={(e) => setBetType(e.target.value)}
              >
                <option value="middle">Middle Date</option>
                <option value="percentage">
                  Specific Percentage
                </option>
              </select>
            </div>

            {betType === "percentage" && (
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Percentage (0–100)
                </label>
                <input
                  type="number"
                  className="date-and-time1-input"
                  placeholder="Enter percentage"
                  value={betPercentage}
                  onChange={(e) =>
                    setBetPercentage(e.target.value)
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* CALCULATOR 5 */}
        {calculatorType === "betweenTime" && (
          <div className="date-and-time1-section">
            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={betTimeSd}
                  onChange={(e) => setBetTimeSd(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  Start Time
                </label>
                <input
                  type="time"
                  className="date-and-time1-input"
                  value={betTimeSt}
                  onChange={(e) => setBetTimeSt(e.target.value)}
                />
              </div>
            </div>

            <div className="date-and-time1-row">
              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  End Date
                </label>
                <input
                  type="date"
                  className="date-and-time1-input"
                  value={betTimeEd}
                  onChange={(e) => setBetTimeEd(e.target.value)}
                />
              </div>

              <div className="date-and-time1-group">
                <label className="date-and-time1-label">
                  End Time
                </label>
                <input
                  type="time"
                  className="date-and-time1-input"
                  value={betTimeEt}
                  onChange={(e) => setBetTimeEt(e.target.value)}
                />
              </div>
            </div>

            <div className="date-and-time1-group">
              <label className="date-and-time1-label">
                End Date Option
              </label>
              <select
                className="date-and-time1-select"
                value={betTimeInclude}
                onChange={(e) =>
                  setBetTimeInclude(e.target.value)
                }
              >
                <option value="exclude">Exclude End Date</option>
                <option value="include">Include End Date</option>
              </select>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="date-and-time1-error">
            {errorMsg}
          </div>
        )}

        {/* RESULT: H3 */}
        {resultItems && (
          <div className="date-and-time1-result">
            <h3 className="date-and-time1-result-title">
              Calculation Result
            </h3>

            {resultItems.map((item, idx) => (
              <div className="date-and-time1-item" key={idx}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}

            <div className="date-and-time1-actions">
              <button
                className="date-and-time1-copy-btn"
                onClick={handleCopy}
              >
                {copied ? "Copied!" : "Copy Result"}
              </button>

              <button
                className="date-and-time1-reset-btn"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ARTICLE SECTION */}
        <div className="date-and-time1-article">
          {/* H2 */}
          <h2>{config.article.title}</h2>

          {/* All article subsections are H3 */}
          {config.article.sections.map((sec, idx) => (
            <div key={idx}>
              <h3>{sec.heading}</h3>
              <p>{sec.content}</p>
            </div>
          ))}
        </div>

        {/* FAQ SECTION */}
        <div className="date-and-time1-faq-section">
          {/* H2 */}
          <h2>Frequently Asked Questions</h2>

          {config.faqs.map((faq, index) => {
            const HeadingTag = index < 10 ? "h2" : "h3";

            return (
              <div
                className="date-and-time1-faq-item"
                key={index}
              >
                <HeadingTag className="date-and-time1-faq-heading">
                  <button
                    type="button"
                    className="date-and-time1-faq-question"
                    aria-expanded={openFaq === index}
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index ? null : index
                      )
                    }
                  >
                    <span>{faq.question}</span>
                    <span>
                      {openFaq === index ? "▲" : "▼"}
                    </span>
                  </button>
                </HeadingTag>

                {openFaq === index && (
                  <div className="date-and-time1-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}