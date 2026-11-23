"use client";
import React, { useMemo, useState } from "react";
import "./after-tax-payment-calculator.css";
import { aftertaxpaymentcalculatorFaqs } from "./faq";
import { formatMoney } from "../_shared/tax-engine";
import DOMPurify from "isomorphic-dompurify";
export default function AfterTaxPaymentCalculator() {
  const [amount,setAmount]=useState("5000"); const [taxRate,setTaxRate]=useState("20"); const [deductions,setDeductions]=useState("0"); const [currency,setCurrency]=useState("USD");
  const output=useMemo(()=>{ const gross=Math.max(0,Number(amount)||0); const rate=Math.min(100,Math.max(0,Number(taxRate)||0))/100; const tax=gross*rate; const extra=Math.max(0,Number(deductions)||0); const net=Math.max(0,gross-tax-extra); const effective=gross>0?(gross-net)/gross:0; return {gross,tax,net,calc:undefined,extra:extra,effective:effective,taxable:gross,deduction:0,allowance:0}; },[amount,taxRate,deductions,currency]);
  const {gross,tax,net,calc,extra,effective,taxable,deduction,allowance}=output;
  return <main className="ltc-shell after-tax-payment-calculator-theme">
    <section className="ltc-hero"><span className="ltc-eyebrow">Liebess • Tax tools</span><h1>After Tax Payment Calculator</h1><p>Calculate an estimated payment after applying a tax percentage and optional deductions. This flexible calculator is not tied to one country’s tax law; enter the rate and deductions that apply to your situation.</p><span className="ltc-year">Tax year: Custom</span></section>
    <section className="ltc-card"><h2>Calculate your estimate</h2><div className="ltc-form"><label>Gross payment<input type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)} /></label><label>Tax rate (%)<input type="number" min="0" max="100" step="0.01" value={taxRate} onChange={e=>setTaxRate(e.target.value)} /></label><label>Other deductions<input type="number" min="0" value={deductions} onChange={e=>setDeductions(e.target.value)} /></label><label>Currency<select value={currency} onChange={e=>setCurrency(e.target.value)}><option value="USD">USD ($)</option><option value="GBP">GBP (£)</option><option value="CAD">CAD (C$)</option><option value="AUD">AUD (A$)</option><option value="EUR">EUR (€)</option></select></label></div><div className="ltc-results"><div><small>Gross payment</small><strong>{formatMoney(gross,currency)}</strong></div><div><small>Estimated tax</small><strong>{formatMoney(tax,currency)}</strong></div><div><small>Other deductions</small><strong>{formatMoney(extra,currency)}</strong></div><div className="ltc-net"><small>After-tax payment</small><strong>{formatMoney(net,currency)}</strong></div><div><small>Effective deduction rate</small><strong>{(effective*100).toFixed(2)}%</strong></div></div>
    <p className="ltc-note">Estimate only. </p></section>
    <section className="ltc-info"><h2>About this calculator</h2><p>Calculate an estimated payment after applying a tax percentage and optional deductions. This flexible calculator is not tied to one country’s tax law; enter the rate and deductions that apply to your situation.</p><p>Tax systems are progressive: each band applies only to the portion of income inside that band. Your marginal rate is not charged on every dollar. Deductions, credits, residency and special rules can change actual liability.</p></section>
    {/* Internal and External Links */}
<div className="maintenance-1">
  <p>You may also find these useful tools and guides:</p>

  <p
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(`
        <a href="/uk-tax-rate-calculator">UK Tax Rate Calculator</a>
        <a href="/us-tax-rate-calculator">US Tax Rate Calculator</a>
        <a href="/canada-tax-rate-calculator">Canada Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-ontario">Ontario Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-federal">Federal Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-australia">Australia Tax Rate Calculator</a>
        <a href="/tax-rate-calculator-california">California Tax Rate Calculator</a>
      `)
    }}
  />
</div>
    <section className="ltc-faq"><h2>Frequently asked questions</h2>{aftertaxpaymentcalculatorFaqs.map((item,i)=><details key={i}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</section>
    <footer className="ltc-source">Official reference: <a href="https://www.irs.gov/individuals/tax-withholding-estimator" target="_blank" rel="noopener noreferrer">Check official tax guidance</a></footer>
  </main>;
}
