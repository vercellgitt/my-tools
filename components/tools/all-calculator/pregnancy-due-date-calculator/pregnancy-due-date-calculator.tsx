"use client";

import React, { useMemo, useState } from "react";
import "./pregnancy-due-date-calculator.css";
import { pregnancyDueDateFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

type DueMode = "lmp" | "conception" | "ivf" | "ultrasound";

type DueDateResult =
  | {
      error: string;
    }
  | {
      error: null;
      dueDate: Date;
      ageText: string;
      remainingDays: number;
      trimester: string;
      trimesterIndex: number;
      estConception: Date;
      milestones: {
        title: string;
        date: string;
      }[];
    };

function parseDate(s: string): Date | null {
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

function addDays(d: Date, n: number): Date {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  c.setDate(c.getDate() + Math.round(n));
  return c;
}

function toInputStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PregnancyDueDateCalculator() {
  const defaultLmp = useMemo(() => {
    const t = new Date();

    return toInputStr(
      addDays(new Date(t.getFullYear(), t.getMonth(), t.getDate()), -70)
    );
  }, []);

  const [mode, setMode] = useState<DueMode>("lmp");
  const [lmpDate, setLmpDate] = useState<string>(defaultLmp);
  const [cycleLen, setCycleLen] = useState<string>("28");

  const [conceptionDateStr, setConceptionDateStr] = useState<string>(() =>
    toInputStr(addDays(new Date(), -56))
  );

  const [ivfDateStr, setIvfDateStr] = useState<string>(() =>
    toInputStr(addDays(new Date(), -51))
  );

  const [embryoAge, setEmbryoAge] = useState<"3" | "5">("5");

  const [usDateStr, setUsDateStr] = useState<string>(() =>
    toInputStr(new Date())
  );

  const [usWeeks, setUsWeeks] = useState<string>("10");
  const [usDays, setUsDays] = useState<string>("0");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const calc = useMemo<DueDateResult>(() => {
    let effectiveLmp: Date | null = null;
    let estConception: Date | null = null;

    if (mode === "lmp") {
      const lmp = parseDate(lmpDate);
      const cyc = Number(cycleLen);

      if (!lmp) {
        return {
          error: "Please enter a valid Last Menstrual Period date.",
        };
      }

      if (!Number.isFinite(cyc) || cyc < 20 || cyc > 45) {
        return {
          error: "Cycle length must be between 20 and 45 days.",
        };
      }

      effectiveLmp = addDays(lmp, cyc - 28);
      estConception = addDays(effectiveLmp, 14);
    } else if (mode === "conception") {
      const cDate = parseDate(conceptionDateStr);

      if (!cDate) {
        return {
          error: "Please enter a valid conception date.",
        };
      }

      estConception = cDate;
      effectiveLmp = addDays(cDate, -14);
    } else if (mode === "ivf") {
      const transfer = parseDate(ivfDateStr);

      if (!transfer) {
        return {
          error: "Please enter a valid IVF embryo transfer date.",
        };
      }

      const age = Number(embryoAge);

      estConception = addDays(transfer, -age);
      effectiveLmp = addDays(estConception, -14);
    } else {
      const us = parseDate(usDateStr);
      const w = Number(usWeeks);
      const d = Number(usDays);

      if (!us) {
        return {
          error: "Please enter a valid ultrasound date.",
        };
      }

      if (!Number.isFinite(w) || w < 0 || w > 42) {
        return {
          error: "Ultrasound weeks must be between 0 and 42.",
        };
      }

      if (!Number.isFinite(d) || d < 0 || d > 6) {
        return {
          error: "Ultrasound days must be between 0 and 6.",
        };
      }

      effectiveLmp = addDays(us, -(w * 7 + d));
      estConception = addDays(effectiveLmp, 14);
    }

    // Ensure both dates are valid before using them.
    if (!effectiveLmp || !estConception) {
      return {
        error: "Unable to calculate the estimated due date.",
      };
    }

    const dueDate = addDays(effectiveLmp, 280);

    const now = new Date();

    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const elapsedDays = Math.max(
      0,
      Math.round(
        (today.getTime() - effectiveLmp.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const weeksPregnant = Math.floor(elapsedDays / 7);
    const daysPregnant = elapsedDays % 7;

    const remainingDays = Math.max(
      0,
      Math.round(
        (dueDate.getTime() - today.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const trimester =
      weeksPregnant < 14
        ? "First Trimester (Weeks 1–13)"
        : weeksPregnant < 28
        ? "Second Trimester (Weeks 14–27)"
        : "Third Trimester (Weeks 28–40)";

    const trimesterIndex =
      weeksPregnant < 14 ? 1 : weeksPregnant < 28 ? 2 : 3;

    const milestones = [
      {
        title: "End of First Trimester (Wk 13)",
        date: fmtDate(addDays(effectiveLmp, 91)),
      },
      {
        title: "Second Trimester Begins (Wk 14)",
        date: fmtDate(addDays(effectiveLmp, 98)),
      },
      {
        title: "Mid-Pregnancy Landmark (Wk 20)",
        date: fmtDate(addDays(effectiveLmp, 140)),
      },
      {
        title: "Third Trimester Begins (Wk 28)",
        date: fmtDate(addDays(effectiveLmp, 196)),
      },
      {
        title: "Full Term Milestone (Wk 37)",
        date: fmtDate(addDays(effectiveLmp, 259)),
      },
      {
        title: "Estimated Due Date (Wk 40)",
        date: fmtDate(dueDate),
      },
    ];

    return {
      error: null,
      dueDate,
      ageText: `${weeksPregnant} weeks, ${daysPregnant} days`,
      remainingDays,
      trimester,
      trimesterIndex,
      estConception,
      milestones,
    };
  }, [
    mode,
    lmpDate,
    cycleLen,
    conceptionDateStr,
    ivfDateStr,
    embryoAge,
    usDateStr,
    usWeeks,
    usDays,
  ]);

  const handleReset = () => {
    setMode("lmp");
    setLmpDate(defaultLmp);
    setCycleLen("28");

    setConceptionDateStr(toInputStr(addDays(new Date(), -56)));
    setIvfDateStr(toInputStr(addDays(new Date(), -51)));

    setEmbryoAge("5");

    setUsDateStr(toInputStr(new Date()));
    setUsWeeks("10");
    setUsDays("0");

    setCopied(false);
  };

  const handleCopy = async () => {
    if (calc.error !== null) return;

    const summary = `Estimated Due Date: ${fmtDate(
      calc.dueDate
    )} | Pregnancy Age: ${calc.ageText} | Days Remaining: ${
      calc.remainingDays
    } | ${calc.trimester} (Estimate; confirm with provider).`;

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
      className="pregnancydueContainer"
      aria-label="Pregnancy Due Date Calculator"
    >
      <header className="pregnancydueHeader">
        <h1 className="pregnancydueTitle">
          Pregnancy Due Date Calculator
        </h1>

        <p className="pregnancydueIntro">
          Estimate your due date with our Pregnancy Due Date Calculator using
          last menstrual period, conception date, IVF transfer date, or
          ultrasound dating. Explore trimester progress, remaining days, and
          key pregnancy milestones.
        </p>
      </header>

      <div
        className="pregnancydueModeTabs"
        role="tablist"
        aria-label="Due date method"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "lmp"}
          className={`pregnancydueTab ${
            mode === "lmp" ? "pregnancydueTabActive" : ""
          }`}
          onClick={() => setMode("lmp")}
        >
          Last Menstrual Period
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "conception"}
          className={`pregnancydueTab ${
            mode === "conception" ? "pregnancydueTabActive" : ""
          }`}
          onClick={() => setMode("conception")}
        >
          Conception Date
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "ivf"}
          className={`pregnancydueTab ${
            mode === "ivf" ? "pregnancydueTabActive" : ""
          }`}
          onClick={() => setMode("ivf")}
        >
          IVF Transfer
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "ultrasound"}
          className={`pregnancydueTab ${
            mode === "ultrasound" ? "pregnancydueTabActive" : ""
          }`}
          onClick={() => setMode("ultrasound")}
        >
          Ultrasound Age
        </button>
      </div>

      <div className="pregnancydueFormPanel">
        <h2 className="pregnancydueSectionTitle">
          Pregnancy Dating Inputs
        </h2>

        <div className="pregnancydueGrid">
          {mode === "lmp" && (
            <>
              <div>
                <label htmlFor="pd-lmp" className="pregnancydueLabel">
                  Last Menstrual Period Date
                </label>

                <input
                  id="pd-lmp"
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="pregnancydueInput"
                />
              </div>

              <div>
                <label htmlFor="pd-cyc" className="pregnancydueLabel">
                  Average Cycle Length (Days)
                </label>

                <input
                  id="pd-cyc"
                  type="number"
                  min="20"
                  max="45"
                  value={cycleLen}
                  onChange={(e) => setCycleLen(e.target.value)}
                  className="pregnancydueInput"
                />
              </div>
            </>
          )}

          {mode === "conception" && (
            <div>
              <label htmlFor="pd-conc" className="pregnancydueLabel">
                Conception Date
              </label>

              <input
                id="pd-conc"
                type="date"
                value={conceptionDateStr}
                onChange={(e) => setConceptionDateStr(e.target.value)}
                className="pregnancydueInput"
              />
            </div>
          )}

          {mode === "ivf" && (
            <>
              <div>
                <label htmlFor="pd-ivf" className="pregnancydueLabel">
                  Embryo Transfer Date
                </label>

                <input
                  id="pd-ivf"
                  type="date"
                  value={ivfDateStr}
                  onChange={(e) => setIvfDateStr(e.target.value)}
                  className="pregnancydueInput"
                />
              </div>

              <div>
                <label htmlFor="pd-age" className="pregnancydueLabel">
                  Embryo Age
                </label>

                <select
                  id="pd-age"
                  value={embryoAge}
                  onChange={(e) =>
                    setEmbryoAge(e.target.value as "3" | "5")
                  }
                  className="pregnancydueInput"
                >
                  <option value="3">3-day embryo transfer</option>
                  <option value="5">5-day embryo transfer</option>
                </select>
              </div>
            </>
          )}

          {mode === "ultrasound" && (
            <>
              <div>
                <label htmlFor="pd-us-date" className="pregnancydueLabel">
                  Ultrasound Date
                </label>

                <input
                  id="pd-us-date"
                  type="date"
                  value={usDateStr}
                  onChange={(e) => setUsDateStr(e.target.value)}
                  className="pregnancydueInput"
                />
              </div>

              <div>
                <label htmlFor="pd-us-wks" className="pregnancydueLabel">
                  Pregnancy Weeks at Scan
                </label>

                <input
                  id="pd-us-wks"
                  type="number"
                  min="0"
                  max="42"
                  value={usWeeks}
                  onChange={(e) => setUsWeeks(e.target.value)}
                  className="pregnancydueInput"
                />
              </div>

              <div>
                <label htmlFor="pd-us-days" className="pregnancydueLabel">
                  Additional Days
                </label>

                <input
                  id="pd-us-days"
                  type="number"
                  min="0"
                  max="6"
                  value={usDays}
                  onChange={(e) => setUsDays(e.target.value)}
                  className="pregnancydueInput"
                />
              </div>
            </>
          )}
        </div>

        {calc.error !== null && (
          <div className="pregnancydueError" role="alert">
            {calc.error}
          </div>
        )}

        <div className="pregnancydueNotice">
          <strong>Medical Disclaimer:</strong> All due dates, gestational ages,
          and milestone dates shown here are estimates for informational
          planning. A licensed medical professional should confirm your
          pregnancy dating through clinical evaluation and prenatal care.
        </div>

        <div className="pregnancydueActions">
          <button
            type="button"
            onClick={handleCopy}
            className="pregnancyduePrimaryBtn"
            disabled={calc.error !== null}
          >
            {copied ? "Copied Result!" : "Copy Result"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="pregnancydueSecondaryBtn"
          >
            Reset
          </button>
        </div>
      </div>

      {calc.error === null && (
        <>
          <div className="pregnancydueSummaryGrid">
            <div className="pregnancydueStat">
              <div className="pregnancydueStatLabel">
                Estimated Due Date
              </div>

              <div className="pregnancydueStatVal">
                {fmtDate(calc.dueDate)}
              </div>
            </div>

            <div className="pregnancydueStat">
              <div className="pregnancydueStatLabel">
                Current Pregnancy Age
              </div>

              <div className="pregnancydueStatVal">
                {calc.ageText}
              </div>
            </div>

            <div className="pregnancydueStat">
              <div className="pregnancydueStatLabel">
                Remaining Days
              </div>

              <div className="pregnancydueStatVal">
                {calc.remainingDays} days
              </div>
            </div>

            <div className="pregnancydueStat">
              <div className="pregnancydueStatLabel">
                Estimated Conception
              </div>

              <div className="pregnancydueStatVal">
                {fmtDate(calc.estConception)}
              </div>
            </div>
          </div>

          <div className="pregnancydueTrimesterBox">
            <h2 className="pregnancydueSectionTitle">
              Trimester Visualization — {calc.trimester}
            </h2>

            <div className="pregnancydueTriBar">
              <div
                className={`pregnancydueTriSeg ${
                  calc.trimesterIndex === 1
                    ? "pregnancydueTriActive"
                    : ""
                }`}
              >
                Trimester 1 (Wks 1–13)
              </div>

              <div
                className={`pregnancydueTriSeg ${
                  calc.trimesterIndex === 2
                    ? "pregnancydueTriActive"
                    : ""
                }`}
              >
                Trimester 2 (Wks 14–27)
              </div>

              <div
                className={`pregnancydueTriSeg ${
                  calc.trimesterIndex === 3
                    ? "pregnancydueTriActive"
                    : ""
                }`}
              >
                Trimester 3 (Wks 28–40)
              </div>
            </div>
          </div>

          <h2 className="pregnancydueSectionTitle">
            Pregnancy Milestone Dates
          </h2>

          <div className="pregnancydueMilestonesGrid">
            {calc.milestones.map((m) => (
              <div
                key={m.title}
                className="pregnancydueMilestoneCard"
              >
                <div className="pregnancydueStatLabel">
                  {m.title}
                </div>

                <div className="pregnancydueStatVal">
                  {m.date}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <RelatedCalculatorLinks currentSlug="pregnancy-due-date-calculator" />

      <div className="pregnancydueFaqWrap">
        <h2 className="pregnancydueFaqHeading">
          Frequently Asked Questions
        </h2>

        {pregnancyDueDateFaqs.map((faq, idx) => {
          const open = openFaq === idx;

          return (
            <div key={faq.question} className="pregnancydueFaqItem">
              <button
                type="button"
                aria-expanded={open}
                className="pregnancydueFaqBtn"
                onClick={() => setOpenFaq(open ? null : idx)}
              >
                <span>{faq.question}</span>
                <span>{open ? "−" : "+"}</span>
              </button>

              {open && (
                <div className="pregnancydueFaqAnswer">
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