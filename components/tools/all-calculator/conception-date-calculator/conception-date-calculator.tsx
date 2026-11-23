"use client";

import React, { useMemo, useState } from "react";
import "./conception-date-calculator.css";
import { conceptionDateFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type ConceptionMode = "lmp" | "dueDate" | "pregnancyAge";

type ConceptionResult =
  | {
      error: string;
    }
  | {
      error: null;
      conceptionDate: Date;
      ovulationDate: Date;
      fertileWindow: string;
      dueDate: Date;
      durationText: string;
      milestones: {
        label: string;
        date: string;
      }[];
    };

function parseLocalDate(str: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;

  const [y, m, d] = str.split("-").map(Number);

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

function addDays(date: Date, days: number): Date {
  const copy = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  copy.setDate(copy.getDate() + Math.round(days));

  return copy;
}

function formatDate(dt: Date): string {
  return dt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function toInputDate(dt: Date): string {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");

  return `${y}-${m}-${d}`;
}

export default function ConceptionDateCalculator() {
  const defaultLmp = useMemo(() => {
    const today = new Date();

    return toInputDate(
      addDays(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        ),
        -42
      )
    );
  }, []);

  const [mode, setMode] = useState<ConceptionMode>("lmp");
  const [lmpInput, setLmpInput] = useState<string>(defaultLmp);
  const [cycleLength, setCycleLength] = useState<string>("28");

  const [dueDateInput, setDueDateInput] = useState<string>(() =>
    toInputDate(addDays(new Date(), 238))
  );

  const [refDateInput, setRefDateInput] = useState<string>(() =>
    toInputDate(new Date())
  );

  const [weeksInput, setWeeksInput] = useState<string>("6");
  const [daysInput, setDaysInput] = useState<string>("0");

  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const result = useMemo<ConceptionResult>(() => {
    const cycle = Number(cycleLength);

    if (!Number.isFinite(cycle) || cycle < 20 || cycle > 45) {
      return {
        error: "Please enter an average cycle length between 20 and 45 days.",
      };
    }

    const cycleOffset = cycle - 28;

    let lmpDate: Date | null = null;

    if (mode === "lmp") {
      lmpDate = parseLocalDate(lmpInput);

      if (!lmpDate) {
        return {
          error: "Please enter a valid Last Menstrual Period (LMP) date.",
        };
      }
    } else if (mode === "dueDate") {
      const due = parseLocalDate(dueDateInput);

      if (!due) {
        return {
          error: "Please enter a valid expected due date.",
        };
      }

      lmpDate = addDays(due, -280);
    } else {
      const ref = parseLocalDate(refDateInput);

      const wks = Number(weeksInput);
      const dys = Number(daysInput);

      if (!ref) {
        return {
          error: "Please enter a valid reference date.",
        };
      }

      if (!Number.isFinite(wks) || wks < 0 || wks > 42) {
        return {
          error: "Pregnancy weeks must be between 0 and 42.",
        };
      }

      if (!Number.isFinite(dys) || dys < 0 || dys > 6) {
        return {
          error: "Additional days must be between 0 and 6.",
        };
      }

      lmpDate = addDays(ref, -(wks * 7 + dys));
    }

    // Ensure LMP date is valid before calculations.
    if (!lmpDate) {
      return {
        error: "Unable to calculate the estimated conception date.",
      };
    }

    const ovulationDate = addDays(lmpDate, 14 + cycleOffset);

    const conceptionDate = ovulationDate;

    const fertileStart = addDays(ovulationDate, -5);
    const fertileEnd = addDays(ovulationDate, 1);

    const dueDate = addDays(lmpDate, 280 + cycleOffset);

    const today = new Date();

    const todayClean = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const elapsedDays = Math.max(
      0,
      Math.round(
        (todayClean.getTime() - lmpDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const estWeeks = Math.floor(elapsedDays / 7);
    const estRemDays = elapsedDays % 7;

    return {
      error: null,
      conceptionDate,
      ovulationDate,

      fertileWindow: `${formatDate(fertileStart)} – ${formatDate(
        fertileEnd
      )}`,

      dueDate,

      durationText: `${estWeeks} weeks, ${estRemDays} days (from LMP)`,

      milestones: [
        {
          label: "Cycle Start (LMP)",
          date: formatDate(lmpDate),
        },
        {
          label: "Fertile Window",
          date: `${formatDate(fertileStart)} – ${formatDate(fertileEnd)}`,
        },
        {
          label: "Est. Conception",
          date: formatDate(conceptionDate),
        },
        {
          label: "Est. Due Date",
          date: formatDate(dueDate),
        },
      ],
    };
  }, [
    mode,
    lmpInput,
    cycleLength,
    dueDateInput,
    refDateInput,
    weeksInput,
    daysInput,
  ]);

  const handleReset = () => {
    setMode("lmp");
    setLmpInput(defaultLmp);
    setCycleLength("28");
    setDueDateInput(toInputDate(addDays(new Date(), 238)));
    setRefDateInput(toInputDate(new Date()));
    setWeeksInput("6");
    setDaysInput("0");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (result.error !== null) return;

    const summary = `Estimated Conception Date: ${formatDate(
      result.conceptionDate
    )} | Ovulation: ${formatDate(
      result.ovulationDate
    )} | Fertile Window: ${
      result.fertileWindow
    } | Due Date: ${formatDate(result.dueDate)} (Estimate only).`;

    try {
      await navigator.clipboard.writeText(summary);

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="conceptionWrapper"
      aria-label="Conception Date Calculator"
    >
      <header className="conceptionHeader">
        <h1 className="conceptionTitle">
          Conception Date Calculator
        </h1>

        <p className="conceptionIntro">
          Estimate your likely conception date, ovulation timing, fertile
          window, and due date with our Conception Date Calculator.
          Switch between Last Menstrual Period, expected due date, or
          current pregnancy weeks to view a personalized timeline.
        </p>
      </header>

      <div
        className="conceptionModeBar"
        role="tablist"
        aria-label="Conception calculation method"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "lmp"}
          className={`conceptionModeBtn ${
            mode === "lmp" ? "conceptionModeActive" : ""
          }`}
          onClick={() => setMode("lmp")}
        >
          Last Menstrual Period
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "dueDate"}
          className={`conceptionModeBtn ${
            mode === "dueDate" ? "conceptionModeActive" : ""
          }`}
          onClick={() => setMode("dueDate")}
        >
          Expected Due Date
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "pregnancyAge"}
          className={`conceptionModeBtn ${
            mode === "pregnancyAge" ? "conceptionModeActive" : ""
          }`}
          onClick={() => setMode("pregnancyAge")}
        >
          Pregnancy Weeks &amp; Days
        </button>
      </div>

      <div className="conceptionInputBox">
        <h2 className="conceptionSectionTitle">
          Enter Your Dates
        </h2>

        <div className="conceptionFormGrid">
          {mode === "lmp" && (
            <div>
              <label
                htmlFor="cd-lmp"
                className="conceptionFieldLabel"
              >
                First Day of Last Menstrual Period
              </label>

              <input
                id="cd-lmp"
                type="date"
                value={lmpInput}
                onChange={(e) => setLmpInput(e.target.value)}
                className="conceptionInput"
              />
            </div>
          )}

          {mode === "dueDate" && (
            <div>
              <label
                htmlFor="cd-due"
                className="conceptionFieldLabel"
              >
                Expected Due Date
              </label>

              <input
                id="cd-due"
                type="date"
                value={dueDateInput}
                onChange={(e) => setDueDateInput(e.target.value)}
                className="conceptionInput"
              />
            </div>
          )}

          {mode === "pregnancyAge" && (
            <>
              <div>
                <label
                  htmlFor="cd-ref"
                  className="conceptionFieldLabel"
                >
                  Reference Date
                </label>

                <input
                  id="cd-ref"
                  type="date"
                  value={refDateInput}
                  onChange={(e) => setRefDateInput(e.target.value)}
                  className="conceptionInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cd-weeks"
                  className="conceptionFieldLabel"
                >
                  Pregnancy Weeks
                </label>

                <input
                  id="cd-weeks"
                  type="number"
                  min="0"
                  max="42"
                  value={weeksInput}
                  onChange={(e) => setWeeksInput(e.target.value)}
                  className="conceptionInput"
                />
              </div>

              <div>
                <label
                  htmlFor="cd-days"
                  className="conceptionFieldLabel"
                >
                  Additional Days
                </label>

                <input
                  id="cd-days"
                  type="number"
                  min="0"
                  max="6"
                  value={daysInput}
                  onChange={(e) => setDaysInput(e.target.value)}
                  className="conceptionInput"
                />
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="cd-cycle"
              className="conceptionFieldLabel"
            >
              Average Menstrual Cycle (Days)
            </label>

            <input
              id="cd-cycle"
              type="number"
              min="20"
              max="45"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="conceptionInput"
            />
          </div>
        </div>

        {result.error !== null && (
          <div className="conceptionError" role="alert">
            {result.error}
          </div>
        )}

        <div className="conceptionDisclaimer">
          <strong>Important Notice:</strong> Conception dates,
          ovulation windows, and due dates generated by this calculator
          are calendar estimates only—not exact medical or clinical
          determinations. Please consult a healthcare professional
          for medical confirmation.
        </div>

        <div className="conceptionActions">
          <button
            type="button"
            onClick={handleCopy}
            className="conceptionCopyBtn"
            disabled={result.error !== null}
          >
            {copied ? "Copied Summary!" : "Copy Result"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="conceptionResetBtn"
          >
            Reset
          </button>
        </div>
      </div>

      {result.error === null && (
        <>
          <div className="conceptionCardsGrid">
            <div className="conceptionDateCard">
              <div className="conceptionCardLabel">
                Estimated Conception Date
              </div>

              <div className="conceptionCardValue">
                {formatDate(result.conceptionDate)}
              </div>
            </div>

            <div className="conceptionDateCard">
              <div className="conceptionCardLabel">
                Estimated Ovulation Date
              </div>

              <div className="conceptionCardValue">
                {formatDate(result.ovulationDate)}
              </div>
            </div>

            <div className="conceptionDateCard">
              <div className="conceptionCardLabel">
                Estimated Fertile Window
              </div>

              <div className="conceptionCardValue">
                {result.fertileWindow}
              </div>
            </div>

            <div className="conceptionDateCard">
              <div className="conceptionCardLabel">
                Estimated Due Date
              </div>

              <div className="conceptionCardValue">
                {formatDate(result.dueDate)}
              </div>
            </div>

            <div className="conceptionDateCard">
              <div className="conceptionCardLabel">
                Estimated Pregnancy Duration
              </div>

              <div className="conceptionCardValue">
                {result.durationText}
              </div>
            </div>
          </div>

          <div className="conceptionTimeline">
            <h2 className="conceptionSectionTitle">
              Conception &amp; Pregnancy Timeline
            </h2>

            <div className="conceptionTimelineList">
              {result.milestones.map((m) => (
                <div
                  key={m.label}
                  className="conceptionMilestone"
                >
                  <div className="conceptionMilestoneTag">
                    {m.label}
                  </div>

                  <div className="conceptionMilestoneDate">
                    {m.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <RelatedCalculatorLinks currentSlug="conception-date-calculator" />

      <div className="conceptionFaqSection">
        <h2 className="conceptionFaqHeading">
          Frequently Asked Questions
        </h2>

        {conceptionDateFaqs.map((item, idx) => {
          const isOpen = openFaq === idx;

          return (
            <div
              key={item.question}
              className="conceptionFaqItem"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                className="conceptionFaqTrigger"
                onClick={() =>
                  setOpenFaq(isOpen ? null : idx)
                }
              >
                <span>{item.question}</span>
                <span>{isOpen ? "−" : "+"}</span>
              </button>

              {isOpen && (
                <div className="conceptionFaqAnswer">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}