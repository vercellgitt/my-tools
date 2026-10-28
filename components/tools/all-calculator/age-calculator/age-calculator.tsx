"use client";

import React, { useState, useEffect, useRef } from "react";
import { translations, Language } from "./i18n";
import "./age-calculator.css";

export default function AgeCalculator() {
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang] || translations.en;

  const [birthDate, setBirthDate] = useState("");
  const [calculateDate, setCalculateDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorClass, setShowErrorClass] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [liveActive, setLiveActive] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const [years, setYears] = useState("0");
  const [months, setMonths] = useState("0");
  const [days, setDays] = useState("0");
  const [totalMonths, setTotalMonths] = useState("0");
  const [totalWeeks, setTotalWeeks] = useState("0");
  const [totalDays, setTotalDays] = useState("0");
  const [totalHours, setTotalHours] = useState("0");
  const [totalMinutes, setTotalMinutes] = useState("0");
  const [totalSeconds, setTotalSeconds] = useState("0");
  const [birthDay, setBirthDay] = useState("—");
  const [zodiac, setZodiac] = useState("—");
  const [birthDateText, setBirthDateText] = useState("—");
  const [calcDateText, setCalcDateText] = useState("—");

  const [nextMonths, setNextMonths] = useState("0");
  const [nextDays, setNextDays] = useState("0");
  const [nextHours, setNextHours] = useState("0");
  const [nextMinutes, setNextMinutes] = useState("0");
  const [nextSeconds, setNextSeconds] = useState("0");
  const [progressWidth, setProgressWidth] = useState("0%");
  const [progressText, setProgressText] = useState("0%");

  const [birthYear, setBirthYear] = useState("—");
  const [leapYear, setLeapYear] = useState("—");
  const [century, setCentury] = useState("—");
  const [agePercentage, setAgePercentage] = useState("0%");
  const [daysInBirthYear, setDaysInBirthYear] = useState("—");
  const [daysLivedThisYear, setDaysLivedThisYear] = useState("—");

  const [copyText, setCopyText] = useState("");
  const liveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const todayStr = getTodayString();
    setCalculateDate(todayStr);
  }, []);

  function getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDate(value: string) {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString(lang === "ar" ? "ar-SA" : lang === "de" ? "de-DE" : lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : lang === "it" ? "it-IT" : lang === "ja" ? "ja-JP" : lang === "pt" ? "pt-PT" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function daysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function clampDay(year: number, month: number, day: number) {
    return Math.min(day, daysInMonth(year, month));
  }

  function isLeapYear(year: number) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  function showError(msg: string) {
    setErrorMessage(msg);
    setShowErrorClass(true);
  }

  function hideError() {
    setErrorMessage("");
    setShowErrorClass(false);
  }

  function calculateExactAge(bDate: Date, now: Date) {
    let y = now.getFullYear() - bDate.getFullYear();
    let m = now.getMonth() - bDate.getMonth();
    let d = now.getDate() - bDate.getDate();
    let h = now.getHours() - bDate.getHours();
    let min = now.getMinutes() - bDate.getMinutes();
    let s = now.getSeconds() - bDate.getSeconds();

    if (s < 0) { s += 60; min--; }
    if (min < 0) { min += 60; h--; }
    if (h < 0) { h += 24; d--; }
    if (d < 0) {
      m--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      d += prevMonth.getDate();
    }
    if (m < 0) { y--; m += 12; }
    return { years: y, months: m, days: d, hours: h, minutes: min, seconds: s };
  }

  function calculateTotals(bDate: Date, now: Date) {
    const ms = now.getTime() - bDate.getTime();
    const tSec = Math.floor(ms / 1000);
    const tMin = Math.floor(tSec / 60);
    const tHour = Math.floor(tSec / 3600);
    const tDay = Math.floor(tSec / 86400);
    const tWeek = Math.floor(tDay / 7);
    let tMon = (now.getFullYear() - bDate.getFullYear()) * 12 + (now.getMonth() - bDate.getMonth());
    if (now.getDate() < bDate.getDate()) { tMon--; }
    return { totalMonths: tMon, totalWeeks: tWeek, totalDays: tDay, totalHours: tHour, totalMinutes: tMin, totalSeconds: tSec };
  }

  function getZodiac(day: number, month: number) {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  }

  function calculateNextBirthday(bDate: Date, now: Date) {
    let year = now.getFullYear();
    const month = bDate.getMonth();
    const day = bDate.getDate();
    let nextB = new Date(year, month, clampDay(year, month, day), 0, 0, 0);
    if (nextB <= now) {
      year++;
      nextB = new Date(year, month, clampDay(year, month, day), 0, 0, 0);
    }
    const prevB = new Date(year - 1, month, clampDay(year - 1, month, day), 0, 0, 0);
    const rem = nextB.getTime() - now.getTime();
    const totalDur = nextB.getTime() - prevB.getTime();
    const elapsed = now.getTime() - prevB.getTime();
    let prog = (elapsed / totalDur) * 100;
    prog = Math.max(0, Math.min(100, prog));

    const tSec = Math.max(0, Math.floor(rem / 1000));
    const sec = tSec % 60;
    const tMin = Math.floor(tSec / 60);
    const min = tMin % 60;
    const tHour = Math.floor(tMin / 60);
    const hr = tHour % 24;
    const d = Math.floor(tHour / 24);
    const m = Math.floor(d / 30);
    const remD = d % 30;
    return { months: m, days: remD, hours: hr, minutes: min, seconds: sec, progress: prog };
  }

  function getOrdinal(num: number) {
    const lastTwo = num % 100;
    if (lastTwo >= 11 && lastTwo <= 13) return "th";
    switch (num % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  function updateAllValues(bDate: Date, now: Date) {
    const age = calculateExactAge(bDate, now);
    const totals = calculateTotals(bDate, now);

    setYears(age.years.toLocaleString());
    setMonths(age.months.toLocaleString());
    setDays(age.days.toLocaleString());
    setTotalMonths(totals.totalMonths.toLocaleString());
    setTotalWeeks(totals.totalWeeks.toLocaleString());
    setTotalDays(totals.totalDays.toLocaleString());
    setTotalHours(totals.totalHours.toLocaleString());
    setTotalMinutes(totals.totalMinutes.toLocaleString());
    setTotalSeconds(totals.totalSeconds.toLocaleString());

    const yr = bDate.getFullYear();
    setBirthYear(yr.toString());
    setLeapYear(isLeapYear(yr) ? "Yes" : "No");
    const cent = Math.floor((yr - 1) / 100) + 1;
    setCentury(`${cent}${getOrdinal(cent)} Century`);
    const pct = Math.min(100, Math.max(0, age.years));
    setAgePercentage(`${pct.toFixed(1)}%`);
    const daysInYr = isLeapYear(yr) ? 366 : 365;
    setDaysInBirthYear(daysInYr.toLocaleString());

    const startYr = new Date(now.getFullYear(), 0, 1);
    const startNextYr = new Date(now.getFullYear() + 1, 0, 1);
    const lived = Math.floor((now.getTime() - startYr.getTime()) / 86400000);
    const daysThisYr = Math.ceil((startNextYr.getTime() - startYr.getTime()) / 86400000);
    setDaysLivedThisYear(`${Math.max(0, lived)} / ${daysThisYr}`);

    const bday = calculateNextBirthday(bDate, now);
    setNextMonths(bday.months.toLocaleString());
    setNextDays(bday.days.toLocaleString());
    setNextHours(bday.hours.toLocaleString());
    setNextMinutes(bday.minutes.toLocaleString());
    setNextSeconds(bday.seconds.toLocaleString());
    setProgressWidth(`${bday.progress}%`);
    setProgressText(`${bday.progress.toFixed(1)}%`);
  }

  // Automatic calculation trigger on input change
  useEffect(() => {
    if (!birthDate || !calculateDate) {
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
      return;
    }

    hideError();
    const bDate = parseDate(birthDate);
    const cDate = parseDate(calculateDate);

    if (!bDate) {
      showError(t.errors.selectBirthDate);
      return;
    }
    if (!cDate) {
      showError(t.errors.selectCalcDate);
      return;
    }
    if (bDate > cDate) {
      showError(t.errors.invalidRange);
      return;
    }

    setHasCalculated(true);
    setBirthDay(bDate.toLocaleDateString("en-US", { weekday: "long" }));
    setZodiac(getZodiac(bDate.getDate(), bDate.getMonth() + 1));
    setBirthDateText(formatDate(bDate));
    setCalcDateText(formatDate(cDate));

    const today = new Date();
    const isToday =
      cDate.getFullYear() === today.getFullYear() &&
      cDate.getMonth() === today.getMonth() &&
      cDate.getDate() === today.getDate();

    if (isToday) {
      setLiveActive(true);
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
      updateAllValues(bDate, new Date());
      liveTimerRef.current = setInterval(() => {
        updateAllValues(bDate, new Date());
      }, 1000);
    } else {
      setLiveActive(false);
      if (liveTimerRef.current) {
        clearInterval(liveTimerRef.current);
        liveTimerRef.current = null;
      }
      updateAllValues(bDate, cDate);
    }

    return () => {
      if (liveTimerRef.current) clearInterval(liveTimerRef.current);
    };
  }, [birthDate, calculateDate, lang]);

  function handleReset() {
    if (liveTimerRef.current) {
      clearInterval(liveTimerRef.current);
      liveTimerRef.current = null;
    }
    setBirthDate("");
    setCalculateDate(getTodayString());
    hideError();
    setHasCalculated(false);
    setLiveActive(false);
    setYears("0"); setMonths("0"); setDays("0");
    setTotalMonths("0"); setTotalWeeks("0"); setTotalDays("0");
    setTotalHours("0"); setTotalMinutes("0"); setTotalSeconds("0");
    setBirthDay("—"); setZodiac("—"); setBirthDateText("—"); setCalcDateText("—");
    setNextMonths("0"); setNextDays("0"); setNextHours("0"); setNextMinutes("0"); setNextSeconds("0");
    setProgressWidth("0%"); setProgressText("0%");
    setBirthYear("—"); setLeapYear("—"); setCentury("—"); setAgePercentage("0%");
    setDaysInBirthYear("—"); setDaysLivedThisYear("—");
  }

  async function handleCopy() {
    if (!hasCalculated) { showError(t.errors.calcFirst); return; }
    try {
      await navigator.clipboard.writeText(`Age Calculator Result: ${years} Years, ${months} Months, ${days} Days`);
      setCopyText(t.copied);
      setTimeout(() => setCopyText(""), 1600);
    } catch {
      showError(t.errors.unableToCopy);
    }
  }

  function handleShare() {
    if (!hasCalculated) { showError(t.errors.calcFirst); return; }
    if (navigator.share) {
      navigator.share({ title: t.title, text: `Age Calculator: ${years} Years, ${months} Months, ${days} Days` }).catch(() => {});
    } else {
      handleCopy();
    }
  }

  function handlePrint() {
    if (!hasCalculated) { showError(t.errors.calcFirst); return; }
    window.print();
  }

  return (
    <div className="age-calc-wrapper">
      <div className="age-calc-container">
        
        {/* Language Selector Dropdown Bar (Centered) */}
        <div className="age-lang-selector-bar" style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value as Language)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
            aria-label="Select Language"
          >
            <option value="en">English (EN)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="de">Deutsch (DE)</option>
            <option value="it">Italiano (IT)</option>
            <option value="pt">Português (PT)</option>
            <option value="ar">العربية (AR)</option>
            <option value="ja">日本語 (JA)</option>
          </select>
        </div>

        {/* Translated Header Section */}
        <header className="age-calc-header">
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </header>

        <main className="age-calc-card">
          <section className="age-calc-input-section">
            <div className="age-calc-input-grid">
              <div className="age-calc-field">
                <label htmlFor="birthDate">{t.birthDateLabel}</label>
                <input
                  id="birthDate"
                  className="age-calc-date-input"
                  type="date"
                  value={birthDate}
                  max={getTodayString()}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>
              <div className="age-calc-field">
                <label htmlFor="calculateDate">{t.calculateDateLabel}</label>
                <input
                  id="calculateDate"
                  className="age-calc-date-input"
                  type="date"
                  value={calculateDate}
                  max={getTodayString()}
                  onChange={(e) => setCalculateDate(e.target.value)}
                />
              </div>
            </div>

            <div className={`age-calc-error-message ${showErrorClass ? "show" : ""}`}>
              {errorMessage}
            </div>

            {/* Calculate Button removed as requested; Reset button kept */}
            <div className="age-calc-action-row" style={{ marginTop: "16px" }}>
              <button onClick={handleReset} className="age-calc-btn age-calc-btn-secondary" style={{ width: "100%" }}>
                {t.resetBtn}
              </button>
            </div>
          </section>

          <section className="age-calc-result-section">
            <div className="age-calc-result-title">{t.resultTitle}</div>

            {liveActive && (
              <div className="age-calc-live-indicator">
                <span className="age-calc-live-dot"></span> {t.liveIndicator}
              </div>
            )}

            <div className="age-calc-display">
              <div className="age-calc-box">
                <div className="age-calc-number">{years}</div>
                <div className="age-calc-label">{t.years}</div>
              </div>
              <div className="age-calc-box">
                <div className="age-calc-number">{months}</div>
                <div className="age-calc-label">{t.months}</div>
              </div>
              <div className="age-calc-box">
                <div className="age-calc-number">{days}</div>
                <div className="age-calc-label">{t.days}</div>
              </div>
            </div>

            <div className="age-calc-info-grid">
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.totalMonths}</div>
                <div className="age-calc-info-value">{totalMonths}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.totalWeeks}</div>
                <div className="age-calc-info-value">{totalWeeks}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.totalDays}</div>
                <div className="age-calc-info-value">{totalDays}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.totalHours}</div>
                <div className="age-calc-info-value">{totalHours}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.totalMinutes}</div>
                <div className="age-calc-info-value">{totalMinutes}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.birthDay}</div>
                <div className="age-calc-info-value">{birthDay}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.zodiac}</div>
                <div className="age-calc-info-value">{zodiac}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.birthDateText}</div>
                <div className="age-calc-info-value">{birthDateText}</div>
              </div>
              <div className="age-calc-info-card">
                <div className="age-calc-info-label">{t.calcDateText}</div>
                <div className="age-calc-info-value">{calcDateText}</div>
              </div>

              <div className="age-calc-info-card age-calc-seconds-card">
                <div className="age-calc-info-label">{t.totalSeconds}</div>
                <div className="age-calc-info-value age-calc-seconds-value">{totalSeconds}</div>
              </div>
            </div>

            <div className="age-calc-countdown-card">
              <div className="age-calc-countdown-title">{t.nextBirthday}</div>
              <div className="age-calc-countdown-grid">
                <div className="age-calc-countdown-item">
                  <div className="age-calc-countdown-number">{nextMonths}</div>
                  <div className="age-calc-countdown-label">{t.months}</div>
                </div>
                <div className="age-calc-countdown-item">
                  <div className="age-calc-countdown-number">{nextDays}</div>
                  <div className="age-calc-countdown-label">{t.days}</div>
                </div>
                <div className="age-calc-countdown-item">
                  <div className="age-calc-countdown-number">{nextHours}</div>
                  <div className="age-calc-countdown-label">{t.hours}</div>
                </div>
                <div className="age-calc-countdown-item">
                  <div className="age-calc-countdown-number">{nextMinutes}</div>
                  <div className="age-calc-countdown-label">{t.minutes}</div>
                </div>
                <div className="age-calc-countdown-item">
                  <div className="age-calc-countdown-number">{nextSeconds}</div>
                  <div className="age-calc-countdown-label">{t.seconds}</div>
                </div>
              </div>

              <div className="age-calc-progress-section">
                <div className="age-calc-progress-header">
                  <span>{t.currentYearProgress}</span>
                  <span>{progressText}</span>
                </div>
                <div className="age-calc-progress-track">
                  <div className="age-calc-progress-bar" style={{ width: progressWidth }}></div>
                </div>
              </div>
            </div>

            <div className="age-calc-birth-year-card">
              <div className="age-calc-birth-year-title">{t.birthYearStatistics}</div>
              <div className="age-calc-birth-year-grid">
                <div className="age-calc-birth-stat">
                  <div className="age-calc-birth-stat-label">{t.birthYear}</div>
                  <div className="age-calc-birth-stat-value">{birthYear}</div>
                </div>
                <div className="age-calc-birth-stat">
                  <div className="age-calc-birth-stat-label">{t.leapYear}</div>
                  <div className="age-calc-birth-stat-value">{leapYear}</div>
                </div>
                <div className="age-calc-birth-stat">
                  <div className="age-calc-birth-stat-label">{t.century}</div>
                  <div className="age-calc-birth-stat-value">{century}</div>
                </div>
                <div className="age-calc-birth-stat">
                  <div className="age-calc-birth-stat-label">{t.agePercentage}</div>
                  <div className="age-calc-birth-stat-value">{agePercentage}</div>
                </div>
                <div className="age-calc-birth-stat">
                  <div className="age-calc-birth-stat-label">{t.daysInBirthYear}</div>
                  <div className="age-calc-birth-stat-value">{daysInBirthYear}</div>
                </div>
                <div className="age-calc-birth-stat">
                  <div className="age-calc-birth-stat-label">{t.daysLivedThisYear}</div>
                  <div className="age-calc-birth-stat-value">{daysLivedThisYear}</div>
                </div>
              </div>
            </div>

            <div className="age-calc-bottom-actions">
              <button onClick={handleCopy} className="age-calc-btn age-calc-btn-secondary">
                {copyText || t.copyResult}
              </button>
              <button onClick={handleShare} className="age-calc-btn age-calc-btn-secondary">
                {t.shareResult}
              </button>
              <button onClick={handlePrint} className="age-calc-btn age-calc-btn-secondary">
                {t.printResult}
              </button>
            </div>
          </section>
        </main>

        {/* Toggleable & Fully Translated FAQ Section */}
        <section className="age-calc-faq-section" style={{ marginTop: "24px", padding: "20px", background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "14px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "16px", color: "#111827" }}>{t.faqTitle}</h2>
          {t.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "12px", marginBottom: "12px" }}>
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#1d4ed8",
                    cursor: "pointer",
                    padding: "8px 0"
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: "18px", fontWeight: "bold", transition: "transform 0.2s" }}>
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <p style={{ marginTop: "8px", fontSize: "14px", color: "#4b5563", lineHeight: "1.6" }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </section>

      </div>
    </div>
  );
}
