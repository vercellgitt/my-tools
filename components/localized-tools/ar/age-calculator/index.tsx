
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import "./style.css";
import { arabicAgeCalculatorFaqs } from "./faq";

type AgeResult = {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  birthDay: string;
  zodiac: string;
  birthYear: number;
  leapYear: string;
  century: string;
  daysInBirthYear: number;
  daysLivedThisYear: number;
  nextBirthdayMonths: number;
  nextBirthdayDays: number;
  nextBirthdayHours: number;
  nextBirthdayMinutes: number;
  nextBirthdaySeconds: number;
  yearProgress: number;
};

const arabicNumber = (value: number) =>
  new Intl.NumberFormat("ar-SA").format(value);

const formatArabicDate = (date: Date) =>
  new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

const getDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (value: string) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const isLeapYear = (year: number) =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const getZodiac = (day: number, month: number) => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "الحمل";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "الثور";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "الجوزاء";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "السرطان";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "الأسد";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "العذراء";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "الميزان";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "العقرب";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "القوس";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "الجدي";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "الدلو";
  return "الحوت";
};

const getAgeParts = (birth: Date, target: Date) => {
  let years = target.getFullYear() - birth.getFullYear();
  let months = target.getMonth() - birth.getMonth();
  let days = target.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(
      target.getFullYear(),
      target.getMonth(),
      0
    );
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
};

const getNextBirthday = (birth: Date, now: Date) => {
  const month = birth.getMonth();
  const day = birth.getDate();

  let year = now.getFullYear();
  let birthday = new Date(
    year,
    month,
    Math.min(day, daysInMonth(year, month)),
    0, 0, 0
  );

  if (birthday.getTime() <= now.getTime()) {
    year++;
    birthday = new Date(
      year,
      month,
      Math.min(day, daysInMonth(year, month)),
      0, 0, 0
    );
  }

  const previousBirthday = new Date(
    year - 1,
    month,
    Math.min(day, daysInMonth(year - 1, month)),
    0, 0, 0
  );

  const remaining = Math.max(0, birthday.getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);

  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const progress =
    ((now.getTime() - previousBirthday.getTime()) /
      (birthday.getTime() - previousBirthday.getTime())) *
    100;

  return {
    months: Math.floor(totalDays / 30),
    days: totalDays % 30,
    hours: totalHours % 24,
    minutes: totalMinutes % 60,
    seconds: totalSeconds % 60,
    progress: Math.min(100, Math.max(0, progress)),
  };
};

const calculateAge = (birth: Date, target: Date): AgeResult => {
  const age = getAgeParts(birth, target);

  const birthUTC = Date.UTC(
    birth.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );

  const targetUTC = Date.UTC(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const totalDays = Math.max(
    0,
    Math.floor((targetUTC - birthUTC) / 86400000)
  );

  const totalSeconds = Math.max(
    0,
    Math.floor((target.getTime() - birth.getTime()) / 1000)
  );

  const next = getNextBirthday(birth, target);

  const year = birth.getFullYear();
  const startOfYear = new Date(target.getFullYear(), 0, 1);
  const startOfNextYear = new Date(target.getFullYear() + 1, 0, 1);

  const daysLivedThisYear = Math.max(
    0,
    Math.floor(
      (target.getTime() - startOfYear.getTime()) / 86400000
    )
  );

  const daysInCurrentYear = Math.round(
    (startOfNextYear.getTime() - startOfYear.getTime()) / 86400000
  );

  const centuryNumber = Math.floor((year - 1) / 100) + 1;

  return {
    ...age,
    totalMonths:
      (target.getFullYear() - birth.getFullYear()) * 12 +
      target.getMonth() -
      birth.getMonth() -
      (target.getDate() < birth.getDate() ? 1 : 0),
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    totalHours: Math.floor(totalSeconds / 3600),
    totalMinutes: Math.floor(totalSeconds / 60),
    totalSeconds,
    birthDay: new Intl.DateTimeFormat("ar-SA", {
      weekday: "long",
    }).format(birth),
    zodiac: getZodiac(birth.getDate(), birth.getMonth() + 1),
    birthYear: year,
    leapYear: isLeapYear(year) ? "نعم" : "لا",
    century: `${arabicNumber(centuryNumber)}`,
    daysInBirthYear: isLeapYear(year) ? 366 : 365,
    daysLivedThisYear,
    nextBirthdayMonths: next.months,
    nextBirthdayDays: next.days,
    nextBirthdayHours: next.hours,
    nextBirthdayMinutes: next.minutes,
    nextBirthdaySeconds: next.seconds,
    yearProgress: next.progress,
  };
};

export default function ArabicAgeCalculator() {
  const [birthValue, setBirthValue] = useState("");
  const [calculationValue, setCalculationValue] = useState("");
  const [now, setNow] = useState(() => new Date());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCalculationValue(getDateString(new Date()));

    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const birthDate = useMemo(
    () => parseDate(birthValue),
    [birthValue]
  );

  const calculationDate = useMemo(
    () => parseDate(calculationValue),
    [calculationValue]
  );

  const isToday = calculationValue === getDateString(now);

  const result = useMemo(() => {
    if (!birthDate || !calculationDate) return null;

    if (birthDate.getTime() > calculationDate.getTime()) {
      return null;
    }

    const target = isToday ? now : calculationDate;

    return calculateAge(birthDate, target);
  }, [birthDate, calculationDate, isToday, now]);

  const error =
    birthValue && calculationValue && birthDate && calculationDate &&
    birthDate.getTime() > calculationDate.getTime()
      ? "لا يمكن أن يكون تاريخ الميلاد بعد تاريخ الحساب."
      : "";

  const resultText = useMemo(() => {
    if (!result || !birthDate || !calculationDate) return "";

    return [
      "نتيجة حاسبة العمر",
      `العمر: ${result.years} سنة، ${result.months} شهر، ${result.days} يوم`,
      `إجمالي الأشهر: ${result.totalMonths}`,
      `إجمالي الأسابيع: ${result.totalWeeks}`,
      `إجمالي الأيام: ${result.totalDays}`,
      `إجمالي الساعات: ${result.totalHours}`,
      `إجمالي الدقائق: ${result.totalMinutes}`,
      `إجمالي الثواني: ${result.totalSeconds}`,
      `يوم الميلاد: ${result.birthDay}`,
      `البرج: ${result.zodiac}`,
      `تاريخ الميلاد: ${formatArabicDate(birthDate)}`,
      `تاريخ الحساب: ${formatArabicDate(calculationDate)}`,
    ].join("\n");
  }, [result, birthDate, calculationDate]);

  const reset = useCallback(() => {
    setBirthValue("");
    setCalculationValue(getDateString(new Date()));
    setMessage("");
  }, []);

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(resultText);
      setMessage("تم نسخ النتيجة بنجاح.");
    } catch {
      setMessage("تعذر النسخ تلقائياً. حاول تحديد النتيجة ونسخها.");
    }
  };

  const shareResult = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "نتيجة حاسبة العمر",
          text: resultText,
        });
      } catch {
        // المستخدم قد يلغي نافذة المشاركة.
      }
    } else {
      await copyResult();
    }
  };

  const printResult = () => window.print();

  return (
    <div className="calculator-agee1" dir="rtl">
      <div className="calculator-agee2">
        <section className="calculator-agee3">
          <div className="calculator-agee4">
            <div className="calculator-agee5">
              <label htmlFor="agee-birth-date">
                تاريخ الميلاد
              </label>
              <input
                id="agee-birth-date"
                type="date"
                value={birthValue}
                max={getDateString(now)}
                onChange={(event) => {
                  setBirthValue(event.target.value);
                  setMessage("");
                }}
              />
            </div>

            <div className="calculator-agee5">
              <label htmlFor="agee-calculate-date">
                حساب العمر في تاريخ
              </label>
              <input
                id="agee-calculate-date"
                type="date"
                value={calculationValue}
                min={birthValue || undefined}
                max={getDateString(now)}
                onChange={(event) => {
                  setCalculationValue(event.target.value);
                  setMessage("");
                }}
              />
            </div>
          </div>

          {error && (
            <p className="calculator-agee-error" role="alert">
              {error}
            </p>
          )}

          {!birthValue && (
            <p className="calculator-agee-hint">
              أدخل تاريخ ميلادك لعرض عمرك ونتائج الحساب تلقائياً.
            </p>
          )}

          {result && (
            <div className="calculator-agee-result">
              <div className="calculator-agee-live">
                <span className="calculator-agee-dot" />
                {isToday ? "العمر يتحدث مباشرة" : "نتيجة التاريخ المحدد"}
              </div>

              <h2 className="calculator-agee-result-title">
                عمرك بالتفصيل
              </h2>

              <div className="calculator-agee-age-grid">
                {[
                  ["years", "سنة", result.years],
                  ["months", "شهر", result.months],
                  ["days", "يوم", result.days],
                ].map(([key, label, value]) => (
                  <div className="calculator-agee-age-box" key={key}>
                    <strong>{arabicNumber(Number(value))}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <h3 className="calculator-agee-section-title">
                إحصائيات العمر
              </h3>

              <div className="calculator-agee-info-grid">
                {[
                  ["إجمالي الأشهر", result.totalMonths],
                  ["إجمالي الأسابيع", result.totalWeeks],
                  ["إجمالي الأيام", result.totalDays],
                  ["إجمالي الساعات", result.totalHours],
                  ["إجمالي الدقائق", result.totalMinutes],
                  ["إجمالي الثواني", result.totalSeconds],
                  ["يوم الميلاد", result.birthDay],
                  ["البرج الفلكي", result.zodiac],
                  ["سنة الميلاد", result.birthYear],
                  ["سنة كبيسة", result.leapYear],
                  ["القرن", result.century],
                  ["أيام سنة الميلاد", result.daysInBirthYear],
                  ["الأيام المنقضية هذا العام", result.daysLivedThisYear],
                ].map(([label, value]) => (
                  <div className="calculator-agee-info-card" key={String(label)}>
                    <span>{label}</span>
                    <strong>
                      {typeof value === "number"
                        ? arabicNumber(value)
                        : value}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="calculator-agee-birthday">
                <h3>الوقت المتبقي لعيد ميلادك القادم</h3>
                <div className="calculator-agee-count-grid">
                  {[
                    ["شهر", result.nextBirthdayMonths],
                    ["يوم", result.nextBirthdayDays],
                    ["ساعة", result.nextBirthdayHours],
                    ["دقيقة", result.nextBirthdayMinutes],
                    ["ثانية", result.nextBirthdaySeconds],
                  ].map(([label, value]) => (
                    <div className="calculator-agee-count-box" key={String(label)}>
                      <strong>{arabicNumber(Number(value))}</strong>
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="calculator-agee-progress-heading">
                  <span>التقدم نحو عيد الميلاد القادم</span>
                  <strong>
                    {arabicNumber(Number(result.yearProgress.toFixed(1)))}٪
                  </strong>
                </div>

                <div
                  className="calculator-agee-progress"
                  role="progressbar"
                  aria-valuenow={result.yearProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span
                    style={{ width: `${result.yearProgress}%` }}
                  />
                </div>
              </div>

              <div className="calculator-agee-dates">
                <p>
                  <span>تاريخ الميلاد:</span>
                  <strong>{formatArabicDate(birthDate!)}</strong>
                </p>
                <p>
                  <span>تاريخ الحساب:</span>
                  <strong>{formatArabicDate(calculationDate!)}</strong>
                </p>
              </div>

              <div className="calculator-agee-actions">
                <button type="button" onClick={copyResult}>
                  نسخ النتيجة
                </button>
                <button type="button" onClick={shareResult}>
                  مشاركة
                </button>
                <button type="button" onClick={printResult}>
                  طباعة
                </button>
                <button
                  type="button"
                  className="calculator-agee-reset"
                  onClick={reset}
                >
                  إعادة ضبط
                </button>
              </div>

              {message && (
                <p className="calculator-agee-message" role="status">
                  {message}
                </p>
              )}
            </div>
          )}
        </section>
      </div>

      <section className="calculator-agee-article">
        <h1>حاسبة العمر – احسب عمرك بالسنوات والأشهر والأيام</h1>

        <p>
          استخدم حاسبة العمر لمعرفة عمرك بدقة اعتماداً على تاريخ ميلادك
          والتاريخ الذي تختاره. تعرض لك الأداة السنوات والأشهر والأيام،
          بالإضافة إلى إجمالي الأسابيع والساعات والدقائق والثواني.
          يمكنك أيضاً معرفة يوم ميلادك والوقت المتبقي حتى عيد ميلادك
          القادم. أدخل تاريخ الميلاد فقط وستظهر النتيجة تلقائياً دون
          الحاجة إلى الضغط على زر الحساب.
        </p>

        <h2>كيفية استخدام حاسبة العمر</h2>
        <p>
          اختر تاريخ ميلادك من حقل التاريخ الأول. يعرض الحقل الثاني
          تاريخ اليوم تلقائياً، ويمكنك تغييره لمعرفة عمرك في يوم سابق.
          بعد إدخال التاريخ الصحيح، تظهر النتائج مباشرة. إذا اخترت
          تاريخ اليوم، يتم تحديث الثواني والوقت المتبقي لعيد الميلاد
          بصورة مستمرة. يمكنك نسخ النتيجة أو مشاركتها أو طباعتها.
        </p>

        <h2>ما المعلومات التي تعرضها أداة حساب العمر؟</h2>
        <p>
          لا تقتصر الأداة على حساب السنوات فقط، بل تعرض العمر بالأشهر
          والأيام، وإجمالي الأيام والأسابيع والساعات والدقائق والثواني.
          كما تقدم معلومات إضافية مثل يوم الميلاد والسنة الكبيسة
          والقرن والبرج الفلكي. وتساعدك ميزة العد التنازلي على معرفة
          المدة المتبقية حتى عيد ميلادك التالي.
        </p>

        <h2>طريقة حساب العمر والسنوات الكبيسة</h2>
        <p>
          يعتمد حساب العمر على مقارنة تاريخ الميلاد بتاريخ الحساب،
          مع مراعاة اختلاف عدد الأيام في الأشهر. تتكون السنة العادية
          من 365 يوماً، بينما تتكون السنة الكبيسة من 366 يوماً.
          لذلك تستخدم الأداة قواعد التقويم الميلادي عند حساب الفترات
          الزمنية، حتى تكون النتائج متوافقة مع التواريخ الفعلية.
        </p>

        <h2>الأسئلة الشائعة حول Age Calculator</h2>

        <div className="calculator-agee-faq">
          {arabicAgeCalculatorFaqs.map((faq, index) => (
            <div className="calculator-agee-faq-item" key={faq.question}>
              <button
                type="button"
                className="calculator-agee-faq-question"
                aria-expanded={openFaq === index}
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
              >
                <span>{faq.question}</span>
                <span aria-hidden="true">
                  {openFaq === index ? "−" : "+"}
                </span>
              </button>

              {openFaq === index && (
                <div className="calculator-agee-faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="calculator-agee-disclaimer">
          ملاحظة: هذه الأداة مخصصة لحساب العمر وفق التقويم الميلادي
          لأغراض المعلومات العامة. وقد تختلف طريقة احتساب العمر
          الرسمية حسب البلد أو الجهة التي تطلب البيانات.
        </p>
      </section>
    </div>
  );
}
