"use client";

import React, { useState, useEffect } from "react";
import { dateCounterConfig } from "./faq";
import "./date-counter.css";

interface DateCounterProps {
  slug?: string;
}

const slugKeys = Object.keys(dateCounterConfig);

export default function DateCounter({ slug = "date-counter" }: DateCounterProps) {
  const activeIndex = Math.max(0, slugKeys.indexOf(slug));
  const [currentTab, setCurrentTab] = useState<number>(activeIndex);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Sync tab when slug prop changes
  useEffect(() => {
    const idx = slugKeys.indexOf(slug);
    if (idx !== -1) {
      setCurrentTab(idx);
    }
  }, [slug]);

  const currentConfig = dateCounterConfig[slugKeys[currentTab]] || dateCounterConfig["date-counter"];

  // State variables for calculators
  // Tab 0: Date & Time
  const [dtBase, setDtBase] = useState("");
  const [dtOp, setDtOp] = useState("add");
  const [dtAmount, setDtAmount] = useState("");
  const [dtUnit, setDtUnit] = useState("days");
  const [dtOut, setDtOut] = useState("-");
  const [dtErrBase, setDtErrBase] = useState(false);
  const [dtErrAmount, setDtErrAmount] = useState(false);
  const [dtErrAmountText, setDtErrAmountText] = useState("");
  const [res0Visible, setRes0Visible] = useState(false);

  // Tab 1: Date Counter
  const [dcBase, setDcBase] = useState("");
  const [dcOp, setDcOp] = useState("add");
  const [dcAmount, setDcAmount] = useState("");
  const [dcUnit, setDcUnit] = useState("days");
  const [dcInclude, setDcInclude] = useState("no");
  const [dcOut, setDcOut] = useState("-");
  const [dcErrBase, setDcErrBase] = useState(false);
  const [dcErrAmount, setDcErrAmount] = useState(false);
  const [res1Visible, setRes1Visible] = useState(false);

  // Tab 2: Duration
  const [durStart, setDurStart] = useState("");
  const [durEnd, setDurEnd] = useState("");
  const [durInclude, setDurInclude] = useState("no");
  const [durYmd, setDurYmd] = useState("-");
  const [durDays, setDurDays] = useState("-");
  const [durWeeks, setDurWeeks] = useState("-");
  const [durHours, setDurHours] = useState("-");
  const [durErrStart, setDurErrStart] = useState(false);
  const [durErrEnd, setDurErrEnd] = useState(false);
  const [res2Visible, setRes2Visible] = useState(false);

  // Tab 3: Date Range
  const [rngStart, setRngStart] = useState("");
  const [rngEnd, setRngEnd] = useState("");
  const [rngInclude, setRngInclude] = useState("yes");
  const [rngTotal, setRngTotal] = useState("-");
  const [rngBusiness, setRngBusiness] = useState("-");
  const [rngWeekend, setRngWeekend] = useState("-");
  const [rngWeeks, setRngWeeks] = useState("-");
  const [rngErrStart, setRngErrStart] = useState(false);
  const [rngErrEnd, setRngErrEnd] = useState(false);
  const [res3Visible, setRes3Visible] = useState(false);

  // Tab 4: Date to Date
  const [d2dStart, setD2dStart] = useState("");
  const [d2dEnd, setD2dEnd] = useState("");
  const [d2dType, setD2dType] = useState("diff");
  const [d2dYears, setD2dYears] = useState("-");
  const [d2dMonths, setD2dMonths] = useState("-");
  const [d2dDays, setD2dDays] = useState("-");
  const [d2dTotal, setD2dTotal] = useState("-");
  const [d2dInclusive, setD2dInclusive] = useState("-");
  const [d2dErrStart, setD2dErrStart] = useState(false);
  const [d2dErrEnd, setD2dErrEnd] = useState(false);
  const [res4Visible, setRes4Visible] = useState(false);

  // Tab 5: Days Since
  const [dsDate, setDsDate] = useState("");
  const [dsCalcDate, setDsCalcDate] = useState("");
  const [dsDays, setDsDays] = useState("-");
  const [dsWeeks, setDsWeeks] = useState("-");
  const [dsErrDate, setDsErrDate] = useState(false);
  const [dsErrText, setDsErrText] = useState("Please select starting date");
  const [res5Visible, setRes5Visible] = useState(false);

  // Tab 6: Days Until
  const [duDate, setDuDate] = useState("");
  const [duCalcDate, setDuCalcDate] = useState("");
  const [duDays, setDuDays] = useState("-");
  const [duWeeks, setDuWeeks] = useState("-");
  const [duErrDate, setDuErrDate] = useState(false);
  const [duErrText, setDuErrText] = useState("Please select target date");
  const [res6Visible, setRes6Visible] = useState(false);

  // Tab 7: Pregnancy Due Date
  const [pregMethod, setPregMethod] = useState("lmp");
  const [pregCycle, setPregCycle] = useState("28");
  const [pregDate, setPregDate] = useState("");
  const [pregDue, setPregDue] = useState("-");
  const [pregWeek, setPregWeek] = useState("-");
  const [pregDays, setPregDays] = useState("-");
  const [pregTrimester, setPregTrimester] = useState("-");
  const [pregRemaining, setPregRemaining] = useState("-");
  const [pregRemLabel, setPregRemLabel] = useState("Days Remaining");
  const [pregErrDate, setPregErrDate] = useState(false);
  const [pregErrText, setPregErrText] = useState("Please select valid date");
  const [res7Visible, setRes7Visible] = useState(false);

  // Tab 8: Conception Date
  const [concLmp, setConcLmp] = useState("");
  const [concCycle, setConcCycle] = useState("28");
  const [concDate, setConcDate] = useState("-");
  const [concOvulation, setConcOvulation] = useState("-");
  const [concFertile, setConcFertile] = useState("-");
  const [concErrLmp, setConcErrLmp] = useState(false);
  const [res8Visible, setRes8Visible] = useState(false);

  // Tab 9: Countdown
  const [cdTargetDate, setCdTargetDate] = useState("");
  const [cdTargetTime, setCdTargetTime] = useState("00:00");
  const [cdDays, setCdDays] = useState("-");
  const [cdHours, setCdHours] = useState("-");
  const [cdMinutes, setCdMinutes] = useState("-");
  const [cdSeconds, setCdSeconds] = useState("-");
  const [cdStatusTitle, setCdStatusTitle] = useState("Time Remaining");
  const [cdErrDate, setCdErrDate] = useState(false);
  const [cdErrText, setCdErrText] = useState("Please select target date");
  const [res9Visible, setRes9Visible] = useState(false);

  // Tab 10: Hijri to Gregorian
  const [hijriDay, setHijriDay] = useState("");
  const [hijriMonth, setHijriMonth] = useState("1");
  const [hijriYear, setHijriYear] = useState("");
  const [hijriOut, setHijriOut] = useState("-");
  const [hijriErrDay, setHijriErrDay] = useState(false);
  const [hijriErrYear, setHijriErrYear] = useState(false);
  const [hijriErrYearText, setHijriErrYearText] = useState("Enter valid year");
  const [res10Visible, setRes10Visible] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDsCalcDate(today);
    setDuCalcDate(today);
  }, []);

  // --- UTC & Date Helpers ---
  function parseDateUTC(dateStr: string) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  }

  function formatDateUTC(date: Date) {
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  }

  function formatDateTimeLocal(date: Date) {
    return date.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function todayUTCStr() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function addMonthsSafe(date: Date, months: number) {
    const d = new Date(date.getTime());
    const originalDay = d.getUTCDate();
    let targetMonth = d.getUTCMonth() + months;
    let targetYear = d.getUTCFullYear() + Math.floor(targetMonth / 12);
    targetMonth = ((targetMonth % 12) + 12) % 12;

    d.setUTCFullYear(targetYear, targetMonth, 1);
    const lastDay = new Date(Date.UTC(targetYear, targetMonth + 1, 0)).getUTCDate();
    d.setUTCDate(Math.min(originalDay, lastDay));
    return d;
  }

  function addYearsSafe(date: Date, years: number) {
    return addMonthsSafe(date, years * 12);
  }

  function getYearMonthDayDifference(d1Str: string, d2Str: string) {
    let start = parseDateUTC(d1Str);
    let end = parseDateUTC(d2Str);

    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }

    let years = end.getUTCFullYear() - start.getUTCFullYear();
    let months = end.getUTCMonth() - start.getUTCMonth();
    let days = end.getUTCDate() - start.getUTCDate();

    if (days < 0) {
      months--;
      const prevMonthLastDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMs = end.getTime() - start.getTime();
    const totalDays = Math.round(totalMs / 86400000);
    const totalWeeks = (totalDays / 7).toFixed(1);
    const totalHours = totalDays * 24;

    return { years, months, days, totalDays, totalWeeks, totalHours };
  }

  // --- Calculations ---
  useEffect(() => {
    // Tab 0: Date & Time
    if (currentTab === 0) {
      if (!dtBase) {
        setDtErrBase(true);
        setRes0Visible(false);
        return;
      }
      setDtErrBase(false);
      if (dtAmount === "" || isNaN(Number(dtAmount)) || Number(dtAmount) < 0) {
        setDtErrAmount(true);
        setDtErrAmountText("Please enter a valid non-negative number");
        setRes0Visible(false);
        return;
      }
      const rawAmount = Number(dtAmount);
      if ((dtUnit === "years" || dtUnit === "months") && !Number.isInteger(rawAmount)) {
        setDtErrAmount(true);
        setDtErrAmountText("Years and Months require a whole number (integer)");
        setRes0Visible(false);
        return;
      }
      setDtErrAmount(false);

      let dateObj = new Date(dtBase);
      let amount = rawAmount;
      if (dtOp === "sub") amount = -amount;

      if (dtUnit === "years") {
        const utc = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()));
        const resultUTC = addYearsSafe(utc, amount);
        dateObj = new Date(resultUTC.getUTCFullYear(), resultUTC.getUTCMonth(), resultUTC.getUTCDate(), resultUTC.getUTCHours(), resultUTC.getUTCMinutes(), resultUTC.getUTCSeconds());
      } else if (dtUnit === "months") {
        const utc = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()));
        const resultUTC = addMonthsSafe(utc, amount);
        dateObj = new Date(resultUTC.getUTCFullYear(), resultUTC.getUTCMonth(), resultUTC.getUTCDate(), resultUTC.getUTCHours(), resultUTC.getUTCMinutes(), resultUTC.getUTCSeconds());
      } else if (dtUnit === "weeks") {
        dateObj.setDate(dateObj.getDate() + amount * 7);
      } else if (dtUnit === "days") {
        dateObj.setDate(dateObj.getDate() + amount);
      } else if (dtUnit === "hours") {
        dateObj.setTime(dateObj.getTime() + amount * 3600000);
      } else if (dtUnit === "minutes") {
        dateObj.setTime(dateObj.getTime() + amount * 60000);
      } else if (dtUnit === "seconds") {
        dateObj.setTime(dateObj.getTime() + amount * 1000);
      }

      setDtOut(formatDateTimeLocal(dateObj));
      setRes0Visible(true);
    }

    // Tab 1: Date Counter
    if (currentTab === 1) {
      if (!dcBase) {
        setDcErrBase(true);
        setRes1Visible(false);
        return;
      }
      setDcErrBase(false);
      if (dcAmount === "" || isNaN(Number(dcAmount)) || Number(dcAmount) < 0 || !Number.isInteger(Number(dcAmount))) {
        setDcErrAmount(true);
        setRes1Visible(false);
        return;
      }
      setDcErrAmount(false);

      let dateObj = parseDateUTC(dcBase);
      let amount = Number(dcAmount);

      if (dcUnit === "days" || dcUnit === "weeks") {
        if (dcUnit === "weeks") amount = amount * 7;
        if (dcInclude === "yes" && amount > 0) amount -= 1;
      }
      if (dcOp === "sub") amount = -amount;

      if (dcUnit === "years") {
        dateObj = addYearsSafe(dateObj, amount);
      } else if (dcUnit === "months") {
        dateObj = addMonthsSafe(dateObj, amount);
      } else {
        dateObj.setUTCDate(dateObj.getUTCDate() + amount);
      }

      setDcOut(formatDateUTC(dateObj));
      setRes1Visible(true);
    }

    // Tab 2: Duration
    if (currentTab === 2) {
      if (!durStart) {
        setDurErrStart(true);
        setRes2Visible(false);
        return;
      }
      setDurErrStart(false);
      if (!durEnd) {
        setDurErrEnd(true);
        setRes2Visible(false);
        return;
      }
      setDurErrEnd(false);

      const res = getYearMonthDayDifference(durStart, durEnd);
      let totalDays = res.totalDays;
      if (durInclude === "yes") totalDays += 1;

      setDurYmd(`${res.years} Years, ${res.months} Months, ${res.days} Days`);
      setDurDays(`${totalDays} Days`);
      setDurWeeks(`${(totalDays / 7).toFixed(1)} Weeks`);
      setDurHours(`${totalDays * 24} Hours`);
      setRes2Visible(true);
    }

    // Tab 3: Date Range
    if (currentTab === 3) {
      if (!rngStart) {
        setRngErrStart(true);
        setRes3Visible(false);
        return;
      }
      setRngErrStart(false);
      if (!rngEnd) {
        setRngErrEnd(true);
        setRes3Visible(false);
        return;
      }
      setRngErrEnd(false);

      let d1 = parseDateUTC(rngStart);
      let d2 = parseDateUTC(rngEnd);
      if (d1 > d2) {
        const temp = d1;
        d1 = d2;
        d2 = temp;
      }

      let totalDays = Math.round((d2.getTime() - d1.getTime()) / 86400000);
      if (rngInclude === "yes") totalDays += 1;

      let businessDays = 0;
      let weekendDays = 0;
      const current = new Date(d1.getTime());
      for (let i = 0; i < totalDays; i++) {
        const dow = current.getUTCDay();
        if (dow === 0 || dow === 6) weekendDays++;
        else businessDays++;
        current.setUTCDate(current.getUTCDate() + 1);
      }

      setRngTotal(`${totalDays} Days`);
      setRngBusiness(`${businessDays} Days`);
      setRngWeekend(`${weekendDays} Days`);
      setRngWeeks(`${(totalDays / 7).toFixed(1)} Weeks`);
      setRes3Visible(true);
    }

    // Tab 4: Date to Date
    if (currentTab === 4) {
      if (!d2dStart) {
        setD2dErrStart(true);
        setRes4Visible(false);
        return;
      }
      setD2dErrStart(false);
      if (!d2dEnd) {
        setD2dErrEnd(true);
        setRes4Visible(false);
        return;
      }
      setD2dErrEnd(false);

      const res = getYearMonthDayDifference(d2dStart, d2dEnd);
      setD2dYears(String(res.years));
      setD2dMonths(String(res.months));
      setD2dDays(String(res.days));
      setD2dTotal(`${res.totalDays} Days`);
      setD2dInclusive(`${res.totalDays + 1} Days`);
      setRes4Visible(true);
    }

    // Tab 5: Days Since
    if (currentTab === 5) {
      if (!dsDate) {
        setDsErrDate(true);
        setRes5Visible(false);
        return;
      }
      setDsErrDate(false);
      const startDate = parseDateUTC(dsDate);
      const calcDate = dsCalcDate ? parseDateUTC(dsCalcDate) : parseDateUTC(todayUTCStr());
      const diffDays = Math.round((calcDate.getTime() - startDate.getTime()) / 86400000);

      if (diffDays < 0) {
        setDsErrDate(true);
        setDsErrText("Starting date must be on or before calculation date");
        setRes5Visible(false);
        return;
      }

      setDsDays(`${diffDays} Days`);
      setDsWeeks(`${Math.floor(diffDays / 7)} Weeks, ${diffDays % 7} Days`);
      setRes5Visible(true);
    }

    // Tab 6: Days Until
    if (currentTab === 6) {
      if (!duDate) {
        setDuErrDate(true);
        setRes6Visible(false);
        return;
      }
      setDuErrDate(false);
      const targetDate = parseDateUTC(duDate);
      const calcDate = duCalcDate ? parseDateUTC(duCalcDate) : parseDateUTC(todayUTCStr());
      const diffDays = Math.round((targetDate.getTime() - calcDate.getTime()) / 86400000);

      if (diffDays < 0) {
        setDuErrDate(true);
        setDuErrText("Target date must be on or after calculation date");
        setRes6Visible(false);
        return;
      }

      setDuDays(`${diffDays} Days`);
      setDuWeeks(`${Math.floor(diffDays / 7)} Weeks, ${diffDays % 7} Days`);
      setRes6Visible(true);
    }

    // Tab 7: Pregnancy Due Date
    if (currentTab === 7) {
      if (!pregDate) {
        setPregErrDate(true);
        setRes7Visible(false);
        return;
      }
      setPregErrDate(false);
      const inputDate = parseDateUTC(pregDate);
      const cycleLen = Number(pregCycle);
      let dueDate: Date;
      let lmpDate: Date;

      if (pregMethod === "lmp") {
        const cycleDiff = cycleLen - 28;
        dueDate = new Date(inputDate.getTime());
        dueDate.setUTCDate(dueDate.getUTCDate() + 280 + cycleDiff);
        lmpDate = new Date(inputDate.getTime());
      } else if (pregMethod === "conception") {
        dueDate = new Date(inputDate.getTime());
        dueDate.setUTCDate(dueDate.getUTCDate() + 266);
        lmpDate = new Date(inputDate.getTime());
        lmpDate.setUTCDate(lmpDate.getUTCDate() - 14);
      } else {
        dueDate = new Date(inputDate.getTime());
        lmpDate = new Date(dueDate.getTime());
        lmpDate.setUTCDate(lmpDate.getUTCDate() - 280);
      }

      const today = parseDateUTC(todayUTCStr());
      const totalGestationalDays = Math.round((today.getTime() - lmpDate.getTime()) / 86400000);

      if ((pregMethod === "lmp" || pregMethod === "conception") && totalGestationalDays < 0) {
        setPregErrDate(true);
        setPregErrText("Selected date appears to be in the future");
        setRes7Visible(false);
        return;
      }

      const currentWeek = Math.max(0, Math.floor(totalGestationalDays / 7));
      const currentDay = Math.max(0, totalGestationalDays % 7);
      const daysDiff = Math.round((dueDate.getTime() - today.getTime()) / 86400000);

      let trimester = "First Trimester";
      if (currentWeek >= 14 && currentWeek <= 27) trimester = "Second Trimester";
      else if (currentWeek >= 28) trimester = "Third Trimester";

      setPregDue(formatDateUTC(dueDate));
      setPregWeek(`Week ${currentWeek} (${currentWeek} w ${currentDay} d)`);
      setPregDays(`${Math.max(0, totalGestationalDays)} Days`);
      setPregTrimester(trimester);

      if (daysDiff > 0) {
        setPregRemLabel("Days Remaining");
        setPregRemaining(`${daysDiff} Days Remaining`);
      } else if (daysDiff === 0) {
        setPregRemLabel("Status");
        setPregRemaining("Due Today");
      } else {
        setPregRemLabel("Overdue");
        setPregRemaining(`${Math.abs(daysDiff)} Days Overdue`);
      }
      setRes7Visible(true);
    }

    // Tab 8: Conception Date
    if (currentTab === 8) {
      if (!concLmp) {
        setConcErrLmp(true);
        setRes8Visible(false);
        return;
      }
      setConcErrLmp(false);
      const lmpDate = parseDateUTC(concLmp);
      const cycleLen = Number(concCycle);
      const ovulationDayOffset = cycleLen - 14;

      const ovulationDate = new Date(lmpDate.getTime());
      ovulationDate.setUTCDate(ovulationDate.getUTCDate() + ovulationDayOffset);

      const conceptionDate = new Date(ovulationDate.getTime());
      const fertileStart = new Date(ovulationDate.getTime());
      fertileStart.setUTCDate(fertileStart.getUTCDate() - 5);
      const fertileEnd = new Date(ovulationDate.getTime());
      fertileEnd.setUTCDate(fertileEnd.getUTCDate() + 1);

      setConcDate(formatDateUTC(conceptionDate));
      setConcOvulation(formatDateUTC(ovulationDate));
      setConcFertile(`${formatDateUTC(fertileStart)} to ${formatDateUTC(fertileEnd)}`);
      setRes8Visible(true);
    }

    // Tab 10: Hijri to Gregorian
    if (currentTab === 10) {
      let hasError = false;
      if (!hijriDay || Number(hijriDay) < 1 || Number(hijriDay) > 30) {
        setHijriErrDay(true);
        hasError = true;
      } else {
        setHijriErrDay(false);
      }
      if (!hijriYear || Number(hijriYear) < 1) {
        setHijriErrYear(true);
        setHijriErrYearText("Enter valid year");
        hasError = true;
      } else {
        setHijriErrYear(false);
      }

      if (hasError) {
        setRes10Visible(false);
        return;
      }

      try {
        const d = Number(hijriDay);
        const m = Number(hijriMonth);
        const y = Number(hijriYear);
        const approxGregYear = Math.floor(y * 0.970224 + 621.5643);

        const hijriFormatter = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          timeZone: "UTC",
        });

        let foundDate: Date | null = null;
        const searchStart = Date.UTC(approxGregYear - 1, 0, 1);
        const searchEnd = Date.UTC(approxGregYear + 2, 11, 31);
        const dayMs = 86400000;

        for (let ts = searchStart; ts <= searchEnd; ts += dayMs) {
          const candidate = new Date(ts);
          const parts = hijriFormatter.formatToParts(candidate);
          const hDay = Number(parts.find((p) => p.type === "day")?.value);
          const hMonth = Number(parts.find((p) => p.type === "month")?.value);
          const hYear = Number(parts.find((p) => p.type === "year")?.value);

          if (hDay === d && hMonth === m && hYear === y) {
            foundDate = candidate;
            break;
          }
        }

        if (!foundDate) {
          setHijriErrYear(true);
          setHijriErrYearText("No exact Umm al-Qura match found for this Hijri date");
          setRes10Visible(false);
          return;
        }

        setHijriOut(formatDateUTC(foundDate) + " (Umm al-Qura Calendar)");
        setRes10Visible(true);
      } catch {
        setHijriErrYear(true);
        setHijriErrYearText("Conversion failed for the specified date");
        setRes10Visible(false);
      }
    }
  }, [
    currentTab,
    dtBase,
    dtOp,
    dtAmount,
    dtUnit,
    dcBase,
    dcOp,
    dcAmount,
    dcUnit,
    dcInclude,
    durStart,
    durEnd,
    durInclude,
    rngStart,
    rngEnd,
    rngInclude,
    d2dStart,
    d2dEnd,
    d2dType,
    dsDate,
    dsCalcDate,
    duDate,
    duCalcDate,
    pregMethod,
    pregCycle,
    pregDate,
    concLmp,
    concCycle,
    hijriDay,
    hijriMonth,
    hijriYear,
  ]);

  // Tab 9: Countdown timer effect
  useEffect(() => {
    if (currentTab !== 9) return;
    if (!cdTargetDate) {
      setCdErrDate(true);
      setRes9Visible(false);
      return;
    }
    setCdErrDate(false);

    const targetTimestamp = new Date(`${cdTargetDate}T${cdTargetTime || "00:00"}`).getTime();
    if (isNaN(targetTimestamp)) {
      setCdErrDate(true);
      setCdErrText("Invalid date/time");
      setRes9Visible(false);
      return;
    }

    setRes9Visible(true);

    const updateTimer = () => {
      const now = Date.now();
      const distance = targetTimestamp - now;

      if (distance < 0) {
        setCdStatusTitle("Countdown Target Reached!");
        setCdDays("0");
        setCdHours("0");
        setCdMinutes("0");
        setCdSeconds("0");
        return;
      }

      setCdStatusTitle("Time Remaining");
      setCdDays(String(Math.floor(distance / 86400000)));
      setCdHours(String(Math.floor((distance % 86400000) / 3600000)));
      setCdMinutes(String(Math.floor((distance % 3600000) / 60000)));
      setCdSeconds(String(Math.floor((distance % 60000) / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [currentTab, cdTargetDate, cdTargetTime]);

  const handleReset = () => {
    if (currentTab === 0) {
      setDtBase("");
      setDtAmount("");
      setRes0Visible(false);
    } else if (currentTab === 1) {
      setDcBase("");
      setDcAmount("");
      setRes1Visible(false);
    } else if (currentTab === 2) {
      setDurStart("");
      setDurEnd("");
      setRes2Visible(false);
    } else if (currentTab === 3) {
      setRngStart("");
      setRngEnd("");
      setRes3Visible(false);
    } else if (currentTab === 4) {
      setD2dStart("");
      setD2dEnd("");
      setRes4Visible(false);
    } else if (currentTab === 5) {
      setDsDate("");
      setRes5Visible(false);
    } else if (currentTab === 6) {
      setDuDate("");
      setRes6Visible(false);
    } else if (currentTab === 7) {
      setPregDate("");
      setRes7Visible(false);
    } else if (currentTab === 8) {
      setConcLmp("");
      setRes8Visible(false);
    } else if (currentTab === 9) {
      setCdTargetDate("");
      setRes9Visible(false);
    } else if (currentTab === 10) {
      setHijriDay("");
      setHijriYear("");
      setRes10Visible(false);
    }
  };

  const isResVisible =
    (currentTab === 0 && res0Visible) ||
    (currentTab === 1 && res1Visible) ||
    (currentTab === 2 && res2Visible) ||
    (currentTab === 3 && res3Visible) ||
    (currentTab === 4 && res4Visible) ||
    (currentTab === 5 && res5Visible) ||
    (currentTab === 6 && res6Visible) ||
    (currentTab === 7 && res7Visible) ||
    (currentTab === 8 && res8Visible) ||
    (currentTab === 9 && res9Visible) ||
    (currentTab === 10 && res10Visible);

  return (
    <div className={`date-counter-wrapper date-counter${currentTab + 1}`}>
      <div className="date-counter-container">
        <header className="date-counter-header">
          <h1>{currentConfig.h1Title}</h1>
          <p>{currentConfig.introText}</p>
        </header>

        {/* Desktop Navigation Tabs */}
        <nav className="date-counter-tabs" role="tablist">
          {slugKeys.map((key, i) => (
            <button
              key={key}
              className={`date-counter-tab-btn ${currentTab === i ? "active" : ""}`}
              onClick={() => setCurrentTab(i)}
              role="tab"
            >
              {dateCounterConfig[key].h1Title.replace(" Calculator", "").replace(" Online", "")}
            </button>
          ))}
        </nav>

        {/* Mobile Dropdown Navigation */}
        <select
          className="date-counter-mobile-select"
          value={currentTab}
          onChange={(e) => setCurrentTab(Number(e.target.value))}
        >
          {slugKeys.map((key, i) => (
            <option key={key} value={i}>
              {dateCounterConfig[key].h1Title}
            </option>
          ))}
        </select>

        {/* 1. Date & Time Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 0 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Date & Time Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dt-base">Start Date & Time</label>
              <input
                type="datetime-local"
                id="dt-base"
                className="date-counter-input"
                value={dtBase}
                onChange={(e) => setDtBase(e.target.value)}
              />
              <span className={`date-counter-error-msg ${dtErrBase ? "visible" : ""}`}>Please complete start date & time</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dt-operation">Operation</label>
              <select
                id="dt-operation"
                className="date-counter-select"
                value={dtOp}
                onChange={(e) => setDtOp(e.target.value)}
              >
                <option value="add">Add Time</option>
                <option value="sub">Subtract Time</option>
              </select>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dt-amount">Amount</label>
              <input
                type="number"
                id="dt-amount"
                className="date-counter-input"
                min="0"
                step="1"
                placeholder="e.g. 5"
                value={dtAmount}
                onChange={(e) => setDtAmount(e.target.value)}
              />
              <span className={`date-counter-error-msg ${dtErrAmount ? "visible" : ""}`}>{dtErrAmountText}</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dt-unit">Unit</label>
              <select
                id="dt-unit"
                className="date-counter-select"
                value={dtUnit}
                onChange={(e) => setDtUnit(e.target.value)}
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
                <option value="weeks">Weeks</option>
                <option value="days">Days</option>
                <option value="hours">Hours</option>
                <option value="minutes">Minutes</option>
                <option value="seconds">Seconds</option>
              </select>
            </div>
          </div>
          <div className={`date-counter-result-box ${res0Visible ? "visible" : ""}`}>
            <h2>Resulting Date & Time</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item full-width">
                <div className="date-counter-result-label">New Date & Time</div>
                <div className="date-counter-result-value">{dtOut}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Date Counter */}
        <section className={`date-counter-calc-section ${currentTab === 1 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Date Counter</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dc-base">Start Date</label>
              <input
                type="date"
                id="dc-base"
                className="date-counter-input"
                value={dcBase}
                onChange={(e) => setDcBase(e.target.value)}
              />
              <span className={`date-counter-error-msg ${dcErrBase ? "visible" : ""}`}>Please select start date</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dc-operation">Operation</label>
              <select
                id="dc-operation"
                className="date-counter-select"
                value={dcOp}
                onChange={(e) => setDcOp(e.target.value)}
              >
                <option value="add">Add</option>
                <option value="sub">Subtract</option>
              </select>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dc-amount">Amount</label>
              <input
                type="number"
                id="dc-amount"
                className="date-counter-input"
                min="0"
                step="1"
                placeholder="e.g. 30"
                value={dcAmount}
                onChange={(e) => setDcAmount(e.target.value)}
              />
              <span className={`date-counter-error-msg ${dcErrAmount ? "visible" : ""}`}>Please enter a whole number (integer)</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dc-unit">Unit</label>
              <select
                id="dc-unit"
                className="date-counter-select"
                value={dcUnit}
                onChange={(e) => setDcUnit(e.target.value)}
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            {(dcUnit === "days" || dcUnit === "weeks") && (
              <div className="date-counter-form-group full-width">
                <label className="date-counter-label" htmlFor="dc-include">Include Start Date?</label>
                <select
                  id="dc-include"
                  className="date-counter-select"
                  value={dcInclude}
                  onChange={(e) => setDcInclude(e.target.value)}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
            )}
          </div>
          <div className={`date-counter-result-box ${res1Visible ? "visible" : ""}`}>
            <h2>Calculated Date</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item full-width">
                <div className="date-counter-result-label">Result Date</div>
                <div className="date-counter-result-value">{dcOut}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Date Duration Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 2 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Date Duration Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dur-start">Start Date</label>
              <input
                type="date"
                id="dur-start"
                className="date-counter-input"
                value={durStart}
                onChange={(e) => setDurStart(e.target.value)}
              />
              <span className={`date-counter-error-msg ${durErrStart ? "visible" : ""}`}>Please select start date</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="dur-end">End Date</label>
              <input
                type="date"
                id="dur-end"
                className="date-counter-input"
                value={durEnd}
                onChange={(e) => setDurEnd(e.target.value)}
              />
              <span className={`date-counter-error-msg ${durErrEnd ? "visible" : ""}`}>Please select end date</span>
            </div>
            <div className="date-counter-form-group full-width">
              <label className="date-counter-label" htmlFor="dur-include">Include End Date?</label>
              <select
                id="dur-include"
                className="date-counter-select"
                value={durInclude}
                onChange={(e) => setDurInclude(e.target.value)}
              >
                <option value="no">No (Standard)</option>
                <option value="yes">Yes (+1 Day)</option>
              </select>
            </div>
          </div>
          <div className={`date-counter-result-box ${res2Visible ? "visible" : ""}`}>
            <h2>Duration Breakdown</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Years, Months, Days</div>
                <div className="date-counter-result-value">{durYmd}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Total Days</div>
                <div className="date-counter-result-value">{durDays}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Total Weeks</div>
                <div className="date-counter-result-value">{durWeeks}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Total Hours</div>
                <div className="date-counter-result-value">{durHours}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Date Range Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 3 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Date Range Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="rng-start">Start Date</label>
              <input
                type="date"
                id="rng-start"
                className="date-counter-input"
                value={rngStart}
                onChange={(e) => setRngStart(e.target.value)}
              />
              <span className={`date-counter-error-msg ${rngErrStart ? "visible" : ""}`}>Please select start date</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="rng-end">End Date</label>
              <input
                type="date"
                id="rng-end"
                className="date-counter-input"
                value={rngEnd}
                onChange={(e) => setRngEnd(e.target.value)}
              />
              <span className={`date-counter-error-msg ${rngErrEnd ? "visible" : ""}`}>Please select end date</span>
            </div>
            <div className="date-counter-form-group full-width">
              <label className="date-counter-label" htmlFor="rng-include">Include Start Date?</label>
              <select
                id="rng-include"
                className="date-counter-select"
                value={rngInclude}
                onChange={(e) => setRngInclude(e.target.value)}
              >
                <option value="yes">Yes (Inclusive)</option>
                <option value="no">No</option>
              </select>
            </div>
          </div>
          <div className={`date-counter-result-box ${res3Visible ? "visible" : ""}`}>
            <h2>Range Statistics</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Total Calendar Days</div>
                <div className="date-counter-result-value">{rngTotal}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Business Days (Mon-Fri)</div>
                <div className="date-counter-result-value">{rngBusiness}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Weekend Days</div>
                <div className="date-counter-result-value">{rngWeekend}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Total Weeks</div>
                <div className="date-counter-result-value">{rngWeeks}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Date to Date Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 4 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Date to Date Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="d2d-start">From Date</label>
              <input
                type="date"
                id="d2d-start"
                className="date-counter-input"
                value={d2dStart}
                onChange={(e) => setD2dStart(e.target.value)}
              />
              <span className={`date-counter-error-msg ${d2dErrStart ? "visible" : ""}`}>Please select from date</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="d2d-end">To Date</label>
              <input
                type="date"
                id="d2d-end"
                className="date-counter-input"
                value={d2dEnd}
                onChange={(e) => setD2dEnd(e.target.value)}
              />
              <span className={`date-counter-error-msg ${d2dErrEnd ? "visible" : ""}`}>Please select to date</span>
            </div>
            <div className="date-counter-form-group full-width">
              <label className="date-counter-label" htmlFor="d2d-type">Calculation Type</label>
              <select
                id="d2d-type"
                className="date-counter-select"
                value={d2dType}
                onChange={(e) => setD2dType(e.target.value)}
              >
                <option value="diff">Difference (Y/M/D Breakdown)</option>
                <option value="inclusive">Inclusive Days Count</option>
              </select>
            </div>
          </div>
          <div className={`date-counter-result-box ${res4Visible ? "visible" : ""}`}>
            <h2>{d2dType === "inclusive" ? "Inclusive Days Result" : "Exact Difference"}</h2>
            {d2dType === "diff" ? (
              <div className="date-counter-result-grid">
                <div className="date-counter-result-item">
                  <div className="date-counter-result-label">Years</div>
                  <div className="date-counter-result-value">{d2dYears}</div>
                </div>
                <div className="date-counter-result-item">
                  <div className="date-counter-result-label">Months</div>
                  <div className="date-counter-result-value">{d2dMonths}</div>
                </div>
                <div className="date-counter-result-item">
                  <div className="date-counter-result-label">Days</div>
                  <div className="date-counter-result-value">{d2dDays}</div>
                </div>
                <div className="date-counter-result-item">
                  <div className="date-counter-result-label">Total Days Difference</div>
                  <div className="date-counter-result-value">{d2dTotal}</div>
                </div>
              </div>
            ) : (
              <div className="date-counter-result-grid">
                <div className="date-counter-result-item full-width">
                  <div className="date-counter-result-label">Total Inclusive Days</div>
                  <div className="date-counter-result-value">{d2dInclusive}</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Days Since Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 5 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Days Since Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="ds-date">Starting Date</label>
              <input
                type="date"
                id="ds-date"
                className="date-counter-input"
                value={dsDate}
                onChange={(e) => setDsDate(e.target.value)}
              />
              <span className={`date-counter-error-msg ${dsErrDate ? "visible" : ""}`}>{dsErrText}</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="ds-calc-date">Calculation Date</label>
              <input
                type="date"
                id="ds-calc-date"
                className="date-counter-input"
                value={dsCalcDate}
                onChange={(e) => setDsCalcDate(e.target.value)}
              />
            </div>
          </div>
          <div className={`date-counter-result-box ${res5Visible ? "visible" : ""}`}>
            <h2>Time Elapsed</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Days Since</div>
                <div className="date-counter-result-value">{dsDays}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Weeks & Days Since</div>
                <div className="date-counter-result-value">{dsWeeks}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Days Until Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 6 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Days Until Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="du-date">Target Date</label>
              <input
                type="date"
                id="du-date"
                className="date-counter-input"
                value={duDate}
                onChange={(e) => setDuDate(e.target.value)}
              />
              <span className={`date-counter-error-msg ${duErrDate ? "visible" : ""}`}>{duErrText}</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="du-calc-date">Calculation Date</label>
              <input
                type="date"
                id="du-calc-date"
                className="date-counter-input"
                value={duCalcDate}
                onChange={(e) => setDuCalcDate(e.target.value)}
              />
            </div>
          </div>
          <div className={`date-counter-result-box ${res6Visible ? "visible" : ""}`}>
            <h2>Time Remaining</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Days Until</div>
                <div className="date-counter-result-value">{duDays}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Weeks & Days Until</div>
                <div className="date-counter-result-value">{duWeeks}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Pregnancy Due Date Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 7 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Pregnancy Due Date Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="preg-method">Calculation Method</label>
              <select
                id="preg-method"
                className="date-counter-select"
                value={pregMethod}
                onChange={(e) => setPregMethod(e.target.value)}
              >
                <option value="lmp">Last Menstrual Period (LMP)</option>
                <option value="conception">Conception Date</option>
                <option value="ultrasound">Ultrasound Due Date</option>
              </select>
            </div>
            {pregMethod === "lmp" && (
              <div className="date-counter-form-group">
                <label className="date-counter-label" htmlFor="preg-cycle">Avg. Menstrual Cycle Length</label>
                <select
                  id="preg-cycle"
                  className="date-counter-select"
                  value={pregCycle}
                  onChange={(e) => setPregCycle(e.target.value)}
                >
                  {[28, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35].map((d) => (
                    <option key={d} value={d}>
                      {d} Days {d === 28 ? "(Standard)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="date-counter-form-group full-width">
              <label className="date-counter-label" htmlFor="preg-date">
                {pregMethod === "lmp"
                  ? "Last Menstrual Period (LMP) Date"
                  : pregMethod === "conception"
                  ? "Conception Date"
                  : "Ultrasound Due Date"}
              </label>
              <input
                type="date"
                id="preg-date"
                className="date-counter-input"
                value={pregDate}
                onChange={(e) => setPregDate(e.target.value)}
              />
              <span className={`date-counter-error-msg ${pregErrDate ? "visible" : ""}`}>{pregErrText}</span>
            </div>
          </div>
          <div className={`date-counter-result-box ${res7Visible ? "visible" : ""}`}>
            <h2>Pregnancy Milestones</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Estimated Due Date</div>
                <div className="date-counter-result-value">{pregDue}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Current Pregnancy Week</div>
                <div className="date-counter-result-value">{pregWeek}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Pregnancy Days</div>
                <div className="date-counter-result-value">{pregDays}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Trimester</div>
                <div className="date-counter-result-value">{pregTrimester}</div>
              </div>
              <div className="date-counter-result-item full-width">
                <div className="date-counter-result-label">{pregRemLabel}</div>
                <div className="date-counter-result-value">{pregRemaining}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Conception Date Calculator */}
        <section className={`date-counter-calc-section ${currentTab === 8 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Conception Date Calculator</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="conc-lmp">Last Menstrual Period (LMP)</label>
              <input
                type="date"
                id="conc-lmp"
                className="date-counter-input"
                value={concLmp}
                onChange={(e) => setConcLmp(e.target.value)}
              />
              <span className={`date-counter-error-msg ${concErrLmp ? "visible" : ""}`}>Please select LMP date</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="conc-cycle">Avg. Menstrual Cycle Length</label>
              <select
                id="conc-cycle"
                className="date-counter-select"
                value={concCycle}
                onChange={(e) => setConcCycle(e.target.value)}
              >
                {[28, 21, 22, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33, 34, 35].map((d) => (
                  <option key={d} value={d}>
                    {d} Days {d === 28 ? "(Standard)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={`date-counter-result-box ${res8Visible ? "visible" : ""}`}>
            <h2>Conception & Fertility Breakdown</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Estimated Conception Date</div>
                <div className="date-counter-result-value">{concDate}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Estimated Ovulation Date</div>
                <div className="date-counter-result-value">{concOvulation}</div>
              </div>
              <div className="date-counter-result-item full-width">
                <div className="date-counter-result-label">Estimated Fertile Window</div>
                <div className="date-counter-result-value">{concFertile}</div>
              </div>
            </div>
            <p className="date-counter-note-text">Note: Conception date is an estimate based on average cycle length. Actual conception can vary by several days.</p>
          </div>
        </section>

        {/* 10. Date & Time Countdown */}
        <section className={`date-counter-calc-section ${currentTab === 9 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Date & Time Countdown</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="cd-target-date">Target Date</label>
              <input
                type="date"
                id="cd-target-date"
                className="date-counter-input"
                value={cdTargetDate}
                onChange={(e) => setCdTargetDate(e.target.value)}
              />
              <span className={`date-counter-error-msg ${cdErrDate ? "visible" : ""}`}>{cdErrText}</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="cd-target-time">Target Time</label>
              <input
                type="time"
                id="cd-target-time"
                className="date-counter-input"
                value={cdTargetTime}
                onChange={(e) => setCdTargetTime(e.target.value)}
              />
            </div>
          </div>
          <div className={`date-counter-result-box ${res9Visible ? "visible" : ""}`}>
            <h2>{cdStatusTitle}</h2>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Days</div>
                <div className="date-counter-result-value">{cdDays}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Hours</div>
                <div className="date-counter-result-value">{cdHours}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Minutes</div>
                <div className="date-counter-result-value">{cdMinutes}</div>
              </div>
              <div className="date-counter-result-item">
                <div className="date-counter-result-label">Seconds</div>
                <div className="date-counter-result-value">{cdSeconds}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. Arabic to Gregorian Date Converter */}
        <section className={`date-counter-calc-section ${currentTab === 10 ? "active" : ""}`}>
          <h2 className="date-counter-section-title">Arabic to Gregorian Date Converter (Umm al-Qura)</h2>
          <div className="date-counter-form-grid">
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="hijri-day">Hijri Day (1-30)</label>
              <input
                type="number"
                id="hijri-day"
                className="date-counter-input"
                min="1"
                max="30"
                placeholder="e.g. 15"
                value={hijriDay}
                onChange={(e) => setHijriDay(e.target.value)}
              />
              <span className={`date-counter-error-msg ${hijriErrDay ? "visible" : ""}`}>Enter valid day (1-30)</span>
            </div>
            <div className="date-counter-form-group">
              <label className="date-counter-label" htmlFor="hijri-month">Hijri Month</label>
              <select
                id="hijri-month"
                className="date-counter-select"
                value={hijriMonth}
                onChange={(e) => setHijriMonth(e.target.value)}
              >
                {[
                  "1. Muharram",
                  "2. Safar",
                  "3. Rabi' al-Awwal",
                  "4. Rabi' al-Thani",
                  "5. Jumada al-Ula",
                  "6. Jumada al-Thani",
                  "7. Rajab",
                  "8. Sha'ban",
                  "9. Ramadan",
                  "10. Shawwal",
                  "11. Dhu al-Qi'dah",
                  "12. Dhu al-Hijjah",
                ].map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="date-counter-form-group full-width">
              <label className="date-counter-label" htmlFor="hijri-year">Hijri Year</label>
              <input
                type="number"
                id="hijri-year"
                className="date-counter-input"
                min="1"
                placeholder="e.g. 1447"
                value={hijriYear}
                onChange={(e) => setHijriYear(e.target.value)}
              />
              <span className={`date-counter-error-msg ${hijriErrYear ? "visible" : ""}`}>{hijriErrYearText}</span>
            </div>
          </div>
          <div className={`date-counter-result-box ${res10Visible ? "visible" : ""}`}>
            <h3>Converted Gregorian Date</h3>
            <div className="date-counter-result-grid">
              <div className="date-counter-result-item full-width">
                <div className="date-counter-result-label">Gregorian Equivalent (Umm al-Qura Standard)</div>
                <div className="date-counter-result-value">{hijriOut}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Global Reset Container */}
        <div className={`date-counter-bottom-action ${isResVisible ? "visible" : ""}`}>
          <button type="button" className="date-counter-btn-reset" onClick={handleReset}>
            Reset
          </button>
        </div>

        {/* SEO Article & Accordion FAQ Section */}
        <div className="date-counter-seo-content">
          <h2>{currentConfig.article.title}</h2>
          <p>{currentConfig.introText}</p>

          {currentConfig.article.sections.map((sec, idx) => {
            if (sec.level === "h2") return <h2 key={idx}>{sec.heading}</h2>;
            if (sec.level === "h3") return <h3 key={idx}>{sec.heading}</h3>;
            return <h4 key={idx}>{sec.heading}</h4>;
          })}

          <div className="date-counter-faq-section">
            <h3>Frequently Asked Questions</h3>
            {currentConfig.faqs.map((faq, idx) => (
              <div key={idx} className={`date-counter-faq-item ${openFaqIndex === idx ? "open" : ""}`}>
                <button
                  className="date-counter-faq-question"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                >
                  <span>{faq.question}</span>
                  <span>{openFaqIndex === idx ? "▲" : "▼"}</span>
                </button>
                <div className="date-counter-faq-answer">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}