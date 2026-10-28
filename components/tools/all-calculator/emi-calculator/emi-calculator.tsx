"use client";

import React, { useState, useMemo } from "react";
import "./emi-calculator.css";
import { translations, Language } from "./i18n";

export default function EmiCalculator() {
  const [lang, setLang] = useState<Language>("en");
  const t = translations[lang];

  // Calculator form states
  const [loanType, setLoanType] = useState("home");
  const [principal, setPrincipal] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interest, setInterest] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureUnit, setTenureUnit] = useState("years");
  const [interestType, setInterestType] = useState("reducing");
  const [prepayment, setPrepayment] = useState("");
  const [prepaymentMonth, setPrepaymentMonth] = useState("");

  // FAQ accordion open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const currencyFormatter = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, []);

  function money(value: number): string {
    if (!Number.isFinite(value)) return "$0.00";
    return currencyFormatter.format(value);
  }

  // Inputs validation & computations
  const numericPrincipal = Number(principal) || 0;
  const numericDownPayment = Number(downPayment) || 0;
  const loanAmount = Math.max(0, numericPrincipal - numericDownPayment);
  const annualRate = Number(interest) || 0;
  const tenureValue = Number(tenure) || 0;

  const months =
    tenureUnit === "years" ? Math.round(tenureValue * 12) : Math.round(tenureValue);

  const numericPrepayment = Number(prepayment) || 0;
  const numericPrepaymentMonth = Math.max(1, Math.round(Number(prepaymentMonth) || 1));

  function calculateReducingEMI(p: number, rRate: number, m: number): number {
    if (p <= 0 || m <= 0) return 0;
    const monthlyRate = rRate / 100 / 12;
    if (monthlyRate === 0) return p / m;
    const factor = Math.pow(1 + monthlyRate, m);
    return (p * monthlyRate * factor) / (factor - 1);
  }

  function calculateFlatEMI(p: number, rRate: number, m: number): number {
    if (p <= 0 || m <= 0) return 0;
    const totalInterest = p * (rRate / 100) * (m / 12);
    return (p + totalInterest) / m;
  }

  const scheduleData = useMemo(() => {
    if (loanAmount <= 0 || months <= 0) {
      return { schedule: [], totalInterest: 0, totalPayment: 0, emi: 0 };
    }

    const monthlyRate = annualRate / 100 / 12;
    const emi =
      interestType === "flat"
        ? calculateFlatEMI(loanAmount, annualRate, months)
        : calculateReducingEMI(loanAmount, annualRate, months);

    let balance = loanAmount;
    let totalInterest = 0;
    let totalPayment = 0;
    const schedule = [];

    for (let month = 1; month <= months && balance > 0.005; month++) {
      let interestPart = 0;
      let principalPart = 0;
      let payment = 0;

      if (interestType === "flat") {
        interestPart = (loanAmount * (annualRate / 100)) / 12;
        principalPart = loanAmount / months;
        payment = principalPart + interestPart;
      } else {
        interestPart = balance * monthlyRate;
        principalPart = emi - interestPart;
        if (principalPart > balance) {
          principalPart = balance;
        }
        payment = principalPart + interestPart;
      }

      let extraPaymentVal = 0;
      if (numericPrepayment > 0 && month === numericPrepaymentMonth) {
        extraPaymentVal = Math.min(
          numericPrepayment,
          Math.max(0, balance - principalPart)
        );
      }

      balance -= principalPart;
      balance -= extraPaymentVal;

      if (balance < 0.005) {
        balance = 0;
      }

      totalInterest += interestPart;
      totalPayment += payment + extraPaymentVal;

      schedule.push({
        month,
        payment,
        principal: principalPart,
        interest: interestPart,
        extraPayment: extraPaymentVal,
        balance,
      });

      if (balance === 0) {
        break;
      }
    }

    return { schedule, totalInterest, totalPayment, emi };
  }, [loanAmount, annualRate, months, interestType, numericPrepayment, numericPrepaymentMonth]);

  const hasLoanAmount = principal.trim() !== "";
  const isInputComplete =
    principal.trim() !== "" && interest.trim() !== "" && tenure.trim() !== "";

  // Prepayment comparison for notice
  const normalScheduleData = useMemo(() => {
    if (numericPrepayment <= 0 || loanAmount <= 0 || months <= 0) return null;
    const monthlyRate = annualRate / 100 / 12;
    const emi =
      interestType === "flat"
        ? calculateFlatEMI(loanAmount, annualRate, months)
        : calculateReducingEMI(loanAmount, annualRate, months);

    let balance = loanAmount;
    let totalInterest = 0;
    let scheduleLength = 0;

    for (let month = 1; month <= months && balance > 0.005; month++) {
      let interestPart = 0;
      let principalPart = 0;
      if (interestType === "flat") {
        interestPart = (loanAmount * (annualRate / 100)) / 12;
        principalPart = loanAmount / months;
      } else {
        interestPart = balance * monthlyRate;
        principalPart = emi - interestPart;
        if (principalPart > balance) principalPart = balance;
      }
      balance -= principalPart;
      if (balance < 0.005) balance = 0;
      totalInterest += interestPart;
      scheduleLength = month;
      if (balance === 0) break;
    }
    return { totalInterest, scheduleLength };
  }, [loanAmount, annualRate, months, interestType, numericPrepayment]);

  const totalSum = loanAmount + scheduleData.totalInterest;
  const principalPercent = totalSum > 0 ? (loanAmount / totalSum) * 100 : 0;
  const interestPercent = totalSum > 0 ? (scheduleData.totalInterest / totalSum) * 100 : 0;

  const handleReset = () => {
    setLoanType("home");
    setPrincipal("");
    setDownPayment("");
    setInterest("");
    setTenure("");
    setTenureUnit("years");
    setInterestType("reducing");
    setPrepayment("");
    setPrepaymentMonth("");
  };

  return (
    <div className="emi-calc-wrapper">
      {/* 8-Language Dropdown Selector Centered at Top */}
      <div className="emi-calc-lang-bar">
        <select
          aria-label="Language Selector"
          className="emi-calc-lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
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

      <header className="header">
        <div className="container">
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <div className="calculator">
            {/* Form Section */}
            <section className="card">
              <div className="card-title">{t.loanDetails}</div>

              <div className="form-grid">
                <div className="field full">
                  <label htmlFor="loanType">{t.loanType}</label>
                  <select
                    id="loanType"
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                  >
                    {Object.entries(t.loanTypes).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field full">
                  <label htmlFor="principal">{t.loanAmount}</label>
                  <div className="input-with-prefix">
                    <span>$</span>
                    <input
                      id="principal"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder={t.loanAmountPlaceholder}
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="downPayment">{t.downPayment}</label>
                  <div className="input-with-prefix">
                    <span>$</span>
                    <input
                      id="downPayment"
                      type="number"
                      min="0"
                      step="100"
                      placeholder={t.downPaymentPlaceholder}
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="interest">{t.annualInterestRate}</label>
                  <input
                    id="interest"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder={t.interestRatePlaceholder}
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    inputMode="decimal"
                  />
                </div>

                <div className="field">
                  <label htmlFor="tenure">{t.loanTenure}</label>
                  <input
                    id="tenure"
                    type="number"
                    min="1"
                    step="1"
                    placeholder={t.tenurePlaceholder}
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    inputMode="numeric"
                  />
                </div>

                <div className="field">
                  <label htmlFor="tenureUnit">{t.tenureUnit}</label>
                  <select
                    id="tenureUnit"
                    value={tenureUnit}
                    onChange={(e) => setTenureUnit(e.target.value)}
                  >
                    <option value="years">{t.years}</option>
                    <option value="months">{t.months}</option>
                  </select>
                </div>

                <div className="field full">
                  <label htmlFor="interestType">{t.interestCalculation}</label>
                  <select
                    id="interestType"
                    value={interestType}
                    onChange={(e) => setInterestType(e.target.value)}
                  >
                    <option value="reducing">{t.reducingBalance}</option>
                    <option value="flat">{t.flatRate}</option>
                  </select>
                </div>
              </div>

              <div className="prepayment">
                <h3>{t.optionalPrepayment}</h3>
                <div className="prepayment-grid">
                  <div className="field">
                    <label htmlFor="prepayment">{t.extraPayment}</label>
                    <div className="input-with-prefix">
                      <span>$</span>
                      <input
                        id="prepayment"
                        type="number"
                        min="0"
                        step="100"
                        placeholder={t.extraPaymentPlaceholder}
                        value={prepayment}
                        onChange={(e) => setPrepayment(e.target.value)}
                        inputMode="decimal"
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="prepaymentMonth">{t.afterMonth}</label>
                    <input
                      id="prepaymentMonth"
                      type="number"
                      min="1"
                      step="1"
                      placeholder={t.monthPlaceholder}
                      value={prepaymentMonth}
                      onChange={(e) => setPrepaymentMonth(e.target.value)}
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>

              {hasLoanAmount && (
                <div className="reset-area">
                  <button className="reset-btn" onClick={handleReset} type="button">
                    {t.reset}
                  </button>
                </div>
              )}
            </section>

            {/* Results Section */}
            <section className={`card result-card ${hasLoanAmount ? "visible" : ""}`}>
              <div className="card-title">{t.emiResultTitle}</div>

              <div className="result-main">
                <div className="label">{t.monthlyEmi}</div>
                <div className="emi-value">
                  {isInputComplete ? money(scheduleData.emi) : "$0.00"}
                </div>
              </div>

              <div className="result-grid">
                <div className="result-box">
                  <span>{t.totalPrincipal}</span>
                  <strong>{isInputComplete ? money(loanAmount) : "$0.00"}</strong>
                </div>

                <div className="result-box">
                  <span>{t.totalInterest}</span>
                  <strong>{isInputComplete ? money(scheduleData.totalInterest) : "$0.00"}</strong>
                </div>

                <div className="result-box">
                  <span>{t.totalPayment}</span>
                  <strong>{isInputComplete ? money(scheduleData.totalPayment) : "$0.00"}</strong>
                </div>

                <div className="result-box">
                  <span>{t.totalMonths}</span>
                  <strong>{isInputComplete ? scheduleData.schedule.length : 0}</strong>
                </div>
              </div>

              <div className="summary">
                <div className="summary-row">
                  <span>{t.loanType}</span>
                  <strong>{t.loanTypes[loanType as keyof typeof t.loanTypes]}</strong>
                </div>

                <div className="summary-row">
                  <span>{t.interestRate}</span>
                  <strong>{annualRate > 0 ? `${annualRate.toFixed(2)}%` : "—"}</strong>
                </div>

                <div className="summary-row">
                  <span>{t.interestMethod}</span>
                  <strong>
                    {interestType === "flat" ? t.flatRate : t.reducingBalance}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>{t.loanTenure}</span>
                  <strong>
                    {tenureValue > 0
                      ? `${tenureValue} ${tenureUnit === "years" ? t.years : t.months}`
                      : "—"}
                  </strong>
                </div>

                <div className="summary-row">
                  <span>{t.downPayment}</span>
                  <strong>{money(numericDownPayment)}</strong>
                </div>
              </div>

              <div className="chart">
                <div className="chart-title">{t.principalVsInterest}</div>
                <div className="bar">
                  <div
                    className="principal-bar"
                    style={{ width: `${isInputComplete ? principalPercent : 0}%` }}
                  ></div>
                  <div
                    className="interest-bar"
                    style={{ width: `${isInputComplete ? interestPercent : 0}%` }}
                  ></div>
                </div>
                <div className="legend">
                  <div className="legend-item">
                    <span className="legend-box black"></span>
                    {t.principal}
                  </div>
                  <div className="legend-item">
                    <span className="legend-box white"></span>
                    {t.interest}
                  </div>
                </div>
              </div>

              <div className="notice">
                {!isInputComplete
                  ? t.initialNotice
                  : numericPrepayment > 0 && normalScheduleData
                  ? `With ${money(numericPrepayment)} extra payment after month ${numericPrepaymentMonth}, you could save approximately ${money(
                      Math.max(0, normalScheduleData.totalInterest - scheduleData.totalInterest)
                    )} in interest and reduce the repayment period by ${Math.max(
                      0,
                      normalScheduleData.scheduleLength - scheduleData.schedule.length
                    )} month(s).`
                  : "Enter an extra payment to see its effect on the repayment schedule."}
              </div>
            </section>
          </div>

          {/* Amortization Schedule Section */}
          <section className={`card schedule-section ${isInputComplete ? "visible" : ""}`}>
            <div className="card-title">{t.amortizationSchedule}</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t.tableMonth}</th>
                    <th>{t.tablePayment}</th>
                    <th>{t.tablePrincipal}</th>
                    <th>{t.tableInterest}</th>
                    <th>{t.tableExtraPayment}</th>
                    <th>{t.tableBalance}</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleData.schedule.map((row) => (
                    <tr key={row.month}>
                      <td style={{ textAlign: "center" }}>{row.month}</td>
                      <td>{money(row.payment)}</td>
                      <td>{money(row.principal)}</td>
                      <td>{money(row.interest)}</td>
                      <td>{money(row.extraPayment)}</td>
                      <td>{money(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Toggleable Accordion FAQ Section with SEO Keywords */}
          <section className="emi-calc-faq-section">
            <div className="card-title">{t.faqTitle}</div>
            {t.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div className="emi-calc-faq-item" key={index}>
                  <button
                    className="emi-calc-faq-question"
                    onClick={() => toggleFaq(index)}
                    type="button"
                  >
                    <span>{faq.q}</span>
                    <span className={`emi-calc-faq-icon ${isOpen ? "open" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && <div className="emi-calc-faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
}