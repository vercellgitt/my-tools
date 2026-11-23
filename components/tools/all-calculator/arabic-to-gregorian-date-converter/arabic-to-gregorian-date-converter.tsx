// Add the calculator React component here.
"use client";

import React, { useMemo, useState } from "react";
import "./arabic-to-gregorian-date-converter.css";
import { arabicToGregorianFaqs } from "./faq";
import RelatedCalculatorLinks from "../_shared/related-calculator-links";

interface HijriMonthMeta {
  num: number;
  english: string;
  arabic: string;
}

const HIJRI_MONTHS: HijriMonthMeta[] = [
  { num: 1, english: "Muharram", arabic: "مُحَرَّم" },
  { num: 2, english: "Safar", arabic: "صَفَر" },
  { num: 3, english: "Rabi al-Awwal", arabic: "رَبِيع الأَوَّل" },
  { num: 4, english: "Rabi al-Thani", arabic: "رَبِيع الثَّانِي" },
  { num: 5, english: "Jumada al-Awwal", arabic: "جُمَادَى الأُولَى" },
  { num: 6, english: "Jumada al-Thani", arabic: "جُمَادَى الآخِرَة" },
  { num: 7, english: "Rajab", arabic: "رَجَب" },
  { num: 8, english: "Sha'ban", arabic: "شَعْبَان" },
  { num: 9, english: "Ramadan", arabic: "رَمَضَان" },
  { num: 10, english: "Shawwal", arabic: "شَوَّال" },
  { num: 11, english: "Dhu al-Qi'dah", arabic: "ذُو القَعْدَة" },
  { num: 12, english: "Dhu al-Hijjah", arabic: "ذُو الحِجَّة" },
];

// Kuwaiti / tabular Islamic calendar Julian Day conversion
function hijriToJd(hYear: number, hMonth: number, hDay: number): number {
  return (
    Math.floor((11 * hYear + 3) / 30) +
    354 * hYear +
    30 * hMonth -
    Math.floor((hMonth - 1) / 2) +
    hDay +
    1948440 -
    385
  );
}

function jdToHijri(jd: number): { year: number; month: number; day: number } {
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remL = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - remL) / 5316) * Math.floor((50 * remL) / 17719) +
    Math.floor(remL / 5670) * Math.floor((43 * remL) / 15238);
  const adjL =
    remL -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * adjL) / 709);
  const day = adjL - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

function gregorianToJd(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

function jdToGregorian(jd: number): Date {
  const f = jd + 1401 + Math.floor((Math.floor((4 * jd + 274277) / 146097) * 3) / 4) - 38;
  const e = 4 * f + 3;
  const g = Math.floor((e % 1461) / 4);
  const h = 5 * g + 2;
  const day = Math.floor((h % 153) / 5) + 1;
  const month = ((Math.floor(h / 153) + 2) % 12) + 1;
  const year = Math.floor(e / 1461) - 4716 + Math.floor((14 - month) / 12);
  return new Date(year, month - 1, day);
}

export default function ArabicToGregorianDateConverter() {
  const [direction, setDirection] = useState<"h2g" | "g2h">("h2g");
  const [hYear, setHYear] = useState<string>("1448");
  const [hMonth, setHMonth] = useState<string>("9");
  const [hDay, setHDay] = useState<string>("1");
  const [gDateInput, setGDateInput] = useState<string>("2026-11-22");
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const conversion = useMemo(() => {
    if (direction === "h2g") {
      const y = Number(hYear);
      const m = Number(hMonth);
      const d = Number(hDay);
      if (!Number.isInteger(y) || y < 1 || y > 2000) {
        return { error: "Please enter a valid Hijri year (1–2000)." };
      }
      if (!Number.isInteger(m) || m < 1 || m > 12) {
        return { error: "Please select a valid Hijri month (1–12)." };
      }
      if (!Number.isInteger(d) || d < 1 || d > 30) {
        return { error: "Please enter a valid Hijri day (1–30)." };
      }

      const jd = hijriToJd(y, m, d);
      const gregDate = jdToGregorian(jd);
      const monthMeta = HIJRI_MONTHS[m - 1];
      const englishMonth = gregDate.toLocaleDateString("en-US", { month: "long" });
      const dayOfWeek = gregDate.toLocaleDateString("en-US", { weekday: "long" });
      const formattedGreg = gregDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        error: null,
        gregorianText: formattedGreg,
        hijriText: `${d} ${monthMeta.english} ${y} AH`,
        arabicMonth: monthMeta.arabic,
        englishMonth,
        dayOfWeek,
      };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(gDateInput)) {
      return { error: "Please select a valid Gregorian date." };
    }
    const [gy, gm, gd] = gDateInput.split("-").map(Number);
    const gCheck = new Date(gy, gm - 1, gd);
    if (gCheck.getFullYear() !== gy || gCheck.getMonth() !== gm - 1 || gCheck.getDate() !== gd) {
      return { error: "Please enter a real calendar date." };
    }

    const jd = gregorianToJd(gy, gm, gd);
    const hijri = jdToHijri(jd);
    const safeMonthIdx = Math.min(11, Math.max(0, hijri.month - 1));
    const monthMeta = HIJRI_MONTHS[safeMonthIdx];
    const englishMonth = gCheck.toLocaleDateString("en-US", { month: "long" });
    const dayOfWeek = gCheck.toLocaleDateString("en-US", { weekday: "long" });
    const formattedGreg = gCheck.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return {
      error: null,
      gregorianText: formattedGreg,
      hijriText: `${hijri.day} ${monthMeta.english} ${hijri.year} AH`,
      arabicMonth: monthMeta.arabic,
      englishMonth,
      dayOfWeek,
    };
  }, [direction, hYear, hMonth, hDay, gDateInput]);

  const handleReset = () => {
    setDirection("h2g");
    setHYear("1448");
    setHMonth("9");
    setHDay("1");
    setGDateInput("2026-11-22");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (conversion.error) return;
    const text = `Hijri: ${conversion.hijriText} (${conversion.arabicMonth}) ↔ Gregorian: ${conversion.gregorianText} (${conversion.dayOfWeek})`;
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
      className="arabicgregorianShell"
      aria-label="Arabic to Gregorian Date Converter"
    >
      <header className="arabicgregorianBanner">
        <h1 className="arabicgregorianTitle">Arabic to Gregorian Date Converter</h1>
        <p className="arabicgregorianIntro">
          Convert dates smoothly with our Arabic to Gregorian Date Converter across all twelve
          Hijri months—and switch to Gregorian-to-Hijri reverse conversion anytime. View Arabic and
          English month names along with the day of the week.
        </p>
      </header>

      <div className="arabicgregorianDirBar" role="tablist" aria-label="Conversion direction">
        <button
          type="button"
          role="tab"
          aria-selected={direction === "h2g"}
          className={`arabicgregorianDirBtn ${
            direction === "h2g" ? "arabicgregorianDirActive" : ""
          }`}
          onClick={() => setDirection("h2g")}
        >
          Hijri to Gregorian (Arabic → Gregorian)
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={direction === "g2h"}
          className={`arabicgregorianDirBtn ${
            direction === "g2h" ? "arabicgregorianDirActive" : ""
          }`}
          onClick={() => setDirection("g2h")}
        >
          Gregorian to Hijri (Reverse)
        </button>
      </div>

      <div className="arabicgregorianCard">
        <h2 className="arabicgregorianHeading">Calendar Date Input</h2>

        {direction === "h2g" ? (
          <div className="arabicgregorianGrid">
            <div>
              <label htmlFor="ag-hy" className="arabicgregorianLabel">
                Hijri Year (AH)
              </label>
              <input
                id="ag-hy"
                type="number"
                min="1"
                max="2000"
                value={hYear}
                onChange={(e) => setHYear(e.target.value)}
                className="arabicgregorianInput"
              />
            </div>
            <div>
              <label htmlFor="ag-hm" className="arabicgregorianLabel">
                Hijri Month
              </label>
              <select
                id="ag-hm"
                value={hMonth}
                onChange={(e) => setHMonth(e.target.value)}
                className="arabicgregorianSelect"
              >
                {HIJRI_MONTHS.map((m) => (
                  <option key={m.num} value={String(m.num)}>
                    {m.num}. {m.english} ({m.arabic})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="ag-hd" className="arabicgregorianLabel">
                Hijri Day
              </label>
              <input
                id="ag-hd"
                type="number"
                min="1"
                max="30"
                value={hDay}
                onChange={(e) => setHDay(e.target.value)}
                className="arabicgregorianInput"
              />
            </div>
          </div>
        ) : (
          <div className="arabicgregorianGrid">
            <div>
              <label htmlFor="ag-gdate" className="arabicgregorianLabel">
                Gregorian Date
              </label>
              <input
                id="ag-gdate"
                type="date"
                value={gDateInput}
                onChange={(e) => setGDateInput(e.target.value)}
                className="arabicgregorianInput"
              />
            </div>
          </div>
        )}

        {conversion.error && (
          <div className="arabicgregorianError" role="alert">
            {conversion.error}
          </div>
        )}

        <div className="arabicgregorianSightingNote">
          <strong>Moon Sighting Note:</strong> Hijri calendar dates may vary by one day or more
          depending on local crescent moon sighting, regional authorities, and astronomical or
          tabular calculation methods.
        </div>

        <div className="arabicgregorianActions">
          <button type="button" onClick={handleCopy} className="arabicgregorianGoldBtn">
            {copied ? "Copied Result!" : "Copy Result"}
          </button>
          <button type="button" onClick={handleReset} className="arabicgregorianGreenBtn">
            Reset
          </button>
        </div>
      </div>

      {!conversion.error && (
        <div className="arabicgregorianOutGrid">
          <div className="arabicgregorianOutBox">
            <div className="arabicgregorianOutTag">Gregorian Date</div>
            <div className="arabicgregorianOutVal">{conversion.gregorianText}</div>
          </div>
          <div className="arabicgregorianOutBox">
            <div className="arabicgregorianOutTag">Hijri Date</div>
            <div className="arabicgregorianOutVal">{conversion.hijriText}</div>
          </div>
          <div className="arabicgregorianOutBox">
            <div className="arabicgregorianOutTag">Arabic Month Name</div>
            <div className="arabicgregorianOutVal" dir="rtl">
              {conversion.arabicMonth}
            </div>
          </div>
          <div className="arabicgregorianOutBox">
            <div className="arabicgregorianOutTag">English Month Name</div>
            <div className="arabicgregorianOutVal">{conversion.englishMonth}</div>
          </div>
          <div className="arabicgregorianOutBox">
            <div className="arabicgregorianOutTag">Day of the Week</div>
            <div className="arabicgregorianOutVal">{conversion.dayOfWeek}</div>
          </div>
        </div>
      )}

      <RelatedCalculatorLinks currentSlug="arabic-to-gregorian-date-converter" />

      <div className="arabicgregorianFaqWrap">
        <h2 className="arabicgregorianFaqHeading">Frequently Asked Questions</h2>
        {arabicToGregorianFaqs.map((faq, idx) => {
          const open = openFaq === idx;
          return (
            <div key={faq.question} className="arabicgregorianFaqItem">
              <button
                type="button"
                aria-expanded={open}
                className="arabicgregorianFaqBtn"
                onClick={() => setOpenFaq(open ? null : idx)}
              >
                <span>{faq.question}</span>
                <span>{open ? "−" : "+"}</span>
              </button>
              {open && <div className="arabicgregorianFaqAnswer">{faq.answer}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );
}