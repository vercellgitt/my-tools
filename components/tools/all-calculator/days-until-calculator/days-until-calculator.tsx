"use client";

import React, { useEffect, useMemo, useState } from "react";
import "./days-until-calculator.css";
import { daysUntilFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type DaysUntilResult =
  | {
      error: string;
    }
  | {
      error: null;
      isPast: boolean;
      hasLiveTime: boolean;
      days: number;
      weeks: number;
      months: number;
      hours: number;
      minutes: number;
      seconds: number;
    };

function toDateStr(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

function parseDateParts(
  dateStr: string
): { y: number; m: number; d: number } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;

  const [y, m, d] = dateStr.split("-").map(Number);

  const check = new Date(y, m - 1, d);

  if (
    check.getFullYear() !== y ||
    check.getMonth() !== m - 1 ||
    check.getDate() !== d
  ) {
    return null;
  }

  return { y, m, d };
}

function buildDateTime(
  dateStr: string,
  timeStr: string,
  fallbackNow: boolean
): Date | null {
  const parts = parseDateParts(dateStr);

  if (!parts) return null;

  if (!timeStr) {
    return fallbackNow
      ? new Date()
      : new Date(parts.y, parts.m - 1, parts.d, 0, 0, 0, 0);
  }

  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(timeStr);

  if (!timeMatch) return null;

  const hh = Number(timeMatch[1]);
  const mm = Number(timeMatch[2]);
  const ss = Number(timeMatch[3] || "0");

  if (hh > 23 || mm > 59 || ss > 59) return null;

  return new Date(parts.y, parts.m - 1, parts.d, hh, mm, ss, 0);
}

function approxMonthsBetween(a: Date, b: Date): number {
  const start = a <= b ? a : b;
  const end = a <= b ? b : a;

  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (end.getDate() < start.getDate()) {
    months = Math.max(0, months - 1);
  }

  return months;
}

export default function DaysUntilCalculator() {
  const initialTarget = useMemo(() => {
    const now = new Date();

    return toDateStr(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 30
      )
    );
  }, []);

  const [eventLabel, setEventLabel] = useState<string>("Custom Event");
  const [startDate, setStartDate] = useState<string>(() =>
    toDateStr(new Date())
  );
  const [targetDate, setTargetDate] = useState<string>(initialTarget);
  const [targetTime, setTargetTime] = useState<string>("");
  const [nowTick, setNowTick] = useState<Date>(() => new Date());
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!targetTime) return;

    const timer = window.setInterval(() => {
      setNowTick(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetTime]);

  const applyPreset = (
    preset: "birthday" | "holiday" | "event"
  ) => {
    const base = new Date();
    const y = base.getFullYear();

    if (preset === "birthday") {
      setEventLabel("Birthday Countdown");

      const bday = new Date(y, 5, 15);

      if (bday <= base) {
        bday.setFullYear(y + 1);
      }

      setTargetDate(toDateStr(bday));
      setTargetTime("");
    } else if (preset === "holiday") {
      setEventLabel("New Year Holiday");

      const ny = new Date(y + 1, 0, 1);

      setTargetDate(toDateStr(ny));
      setTargetTime("00:00");
    } else {
      setEventLabel("Launch Event");

      setTargetDate(
        toDateStr(
          new Date(
            y,
            base.getMonth(),
            base.getDate() + 14
          )
        )
      );

      setTargetTime("09:00");
    }
  };

  const breakdown = useMemo<DaysUntilResult>(() => {
    const startParts = parseDateParts(startDate);
    const targetParts = parseDateParts(targetDate);

    if (!startParts || !targetParts) {
      return {
        error: "Please select valid start and target calendar dates.",
      };
    }

    const hasLiveTime = Boolean(targetTime);

    const startObj = hasLiveTime
      ? nowTick
      : new Date(
          startParts.y,
          startParts.m - 1,
          startParts.d,
          0,
          0,
          0,
          0
        );

    const targetObj = buildDateTime(
      targetDate,
      targetTime,
      false
    );

    if (!targetObj) {
      return {
        error: "Please enter a valid target time (HH:MM).",
      };
    }

    const diffMs = targetObj.getTime() - startObj.getTime();

    const isPast = diffMs < 0;
    const absMs = Math.abs(diffMs);

    const totalSeconds = Math.floor(absMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(
      absMs / (1000 * 60 * 60 * 24)
    );

    const totalWeeks = Math.floor(totalDays / 7);

    const months = approxMonthsBetween(startObj, targetObj);

    return {
      error: null,
      isPast,
      hasLiveTime,
      days: totalDays,
      weeks: totalWeeks,
      months,
      hours: totalHours,
      minutes: totalMinutes,
      seconds: totalSeconds,
    };
  }, [startDate, targetDate, targetTime, nowTick]);

  const handleReset = () => {
    const todayStr = toDateStr(new Date());

    setEventLabel("Custom Event");
    setStartDate(todayStr);
    setTargetDate(initialTarget);
    setTargetTime("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (breakdown.error !== null) return;

    const direction = breakdown.isPast
      ? "elapsed since"
      : "remaining until";

    const text = `${eventLabel}: ${breakdown.days} days (${breakdown.weeks} weeks, ${breakdown.months} months) ${direction} ${targetDate}${
      targetTime ? ` ${targetTime}` : ""
    }.`;

    try {
      await navigator.clipboard.writeText(text);

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="daysuntilWrap"
      aria-label="Days Until Calculator"
    >
      <header className="daysuntilHero">
        <h1 className="daysuntilHeading">
          Days Until Calculator
        </h1>

        <p className="daysuntilIntro">
          Count down every moment with our Days Until Calculator.
          Check remaining days, weeks, months, hours, minutes,
          and live ticking seconds for birthdays, holidays, or
          custom events with automatic past-date detection.
        </p>
      </header>

      <div
        className="daysuntilPresets"
        role="group"
        aria-label="Countdown presets"
      >
        <button
          type="button"
          className="daysuntilPresetBtn"
          onClick={() => applyPreset("birthday")}
        >
          Birthday Countdown
        </button>

        <button
          type="button"
          className="daysuntilPresetBtn"
          onClick={() => applyPreset("holiday")}
        >
          Holiday Countdown
        </button>

        <button
          type="button"
          className="daysuntilPresetBtn"
          onClick={() => applyPreset("event")}
        >
          Event Countdown
        </button>

        <button
          type="button"
          className="daysuntilPresetBtn"
          onClick={() => setEventLabel("Custom Date")}
        >
          Custom Date
        </button>
      </div>

      <div className="daysuntilControls">
        <div className="daysuntilGridInputs">
          <div>
            <label
              htmlFor="du-label"
              className="daysuntilLabel"
            >
              Event Name
            </label>

            <input
              id="du-label"
              type="text"
              value={eventLabel}
              onChange={(e) => setEventLabel(e.target.value)}
              className="daysuntilInput"
            />
          </div>

          <div>
            <label
              htmlFor="du-start"
              className="daysuntilLabel"
            >
              Starting Date
            </label>

            <input
              id="du-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="daysuntilInput"
            />
          </div>

          <div>
            <label
              htmlFor="du-target"
              className="daysuntilLabel"
            >
              Target Date
            </label>

            <input
              id="du-target"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="daysuntilInput"
            />
          </div>

          <div>
            <label
              htmlFor="du-time"
              className="daysuntilLabel"
            >
              Target Time (Optional Live Countdown)
            </label>

            <input
              id="du-time"
              type="time"
              step="1"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="daysuntilInput"
            />
          </div>
        </div>

        {breakdown.error !== null ? (
          <div
            className="daysuntilStatusBanner daysuntilPastBanner"
            role="alert"
          >
            {breakdown.error}
          </div>
        ) : (
          <div
            className={`daysuntilStatusBanner ${
              breakdown.isPast ? "daysuntilPastBanner" : ""
            }`}
          >
            {breakdown.isPast ? (
              <span>
                <strong>Past Date Detected:</strong>{" "}
                {eventLabel} ({targetDate}) is in the past.
                Showing elapsed time since target.
              </span>
            ) : (
              <span>
                <strong>{eventLabel}:</strong> Counting down
                to {targetDate}
                {targetTime ? ` at ${targetTime}` : ""}{" "}
                {breakdown.hasLiveTime
                  ? "(Live second-by-second countdown active)"
                  : ""}
                .
              </span>
            )}
          </div>
        )}

        <div className="daysuntilActions">
          <button
            type="button"
            onClick={handleCopy}
            className="daysuntilPrimaryBtn"
            disabled={breakdown.error !== null}
          >
            {copied ? "Copied Result!" : "Copy Result"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="daysuntilSecondaryBtn"
          >
            Reset
          </button>
        </div>
      </div>

      {breakdown.error === null && (
        <div className="daysuntilCards">
          <div className="daysuntilStatCard">
            <div className="daysuntilStatNum">
              {breakdown.days.toLocaleString()}
            </div>

            <div className="daysuntilStatUnit">
              {breakdown.isPast
                ? "Days Ago"
                : "Remaining Days"}
            </div>
          </div>

          <div className="daysuntilStatCard">
            <div className="daysuntilStatNum">
              {breakdown.weeks.toLocaleString()}
            </div>

            <div className="daysuntilStatUnit">
              Weeks
            </div>
          </div>

          <div className="daysuntilStatCard">
            <div className="daysuntilStatNum">
              {breakdown.months.toLocaleString()}
            </div>

            <div className="daysuntilStatUnit">
              Months
            </div>
          </div>

          <div className="daysuntilStatCard">
            <div className="daysuntilStatNum">
              {breakdown.hours.toLocaleString()}
            </div>

            <div className="daysuntilStatUnit">
              Hours
            </div>
          </div>

          <div className="daysuntilStatCard">
            <div className="daysuntilStatNum">
              {breakdown.minutes.toLocaleString()}
            </div>

            <div className="daysuntilStatUnit">
              Minutes
            </div>
          </div>

          <div className="daysuntilStatCard">
            <div className="daysuntilStatNum">
              {breakdown.seconds.toLocaleString()}
            </div>

            <div className="daysuntilStatUnit">
              Seconds
            </div>
          </div>
        </div>
      )}

      <RelatedCalculatorLinks currentSlug="days-until-calculator" />

      <div className="daysuntilFaqSection">
        <h2 className="daysuntilFaqHeading">
          Frequently Asked Questions
        </h2>

        {daysUntilFaqs.map((faq, idx) => {
          const open = openFaq === idx;

          return (
            <div
              key={faq.question}
              className="daysuntilFaqItem"
            >
              <button
                type="button"
                aria-expanded={open}
                className="daysuntilFaqBtn"
                onClick={() => setOpenFaq(open ? null : idx)}
              >
                <span>{faq.question}</span>
                <span>{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="daysuntilFaqAnswer">
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