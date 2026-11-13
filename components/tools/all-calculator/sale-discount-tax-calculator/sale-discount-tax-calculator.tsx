"use client";

import React, { useState } from "react";
import "./sale-discount-tax-calculator.css";
import { saleDiscountTaxFaqs } from "./faq";

export default function SaleDiscountTaxCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState<string>("0");
  const [salesTax, setSalesTax] = useState<string>("0");
  const [additionalDiscount, setAdditionalDiscount] = useState<string>("0");
  const [quantity, setQuantity] = useState<string>("1");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const rawPrice = originalPrice.trim();
  const isPriceInvalid = rawPrice !== "" && Number(rawPrice) < 0;

  const parsedQty = parseInt(quantity.trim(), 10);
  const isQtyInvalid = quantity.trim() === "" || isNaN(parsedQty) || parsedQty < 1;
  const validQuantity = isQtyInvalid ? 1 : parsedQty;

  const showResults = rawPrice !== "" && !isPriceInvalid && !isQtyInvalid;

  const price = showResults ? Math.max(0, parseFloat(rawPrice)) : 0;
  let numericDiscount = Math.max(0, parseFloat(discountValue) || 0);
  const salesTaxRate = Math.max(0, parseFloat(salesTax) || 0);
  const additionalDiscountRate = Math.max(0, parseFloat(additionalDiscount) || 0);

  let isDiscountExceeded = false;
  if (showResults) {
    if (discountType === "percentage" && numericDiscount > 100) {
      numericDiscount = 100;
      isDiscountExceeded = true;
    } else if (discountType === "fixed" && numericDiscount > price) {
      numericDiscount = price;
      isDiscountExceeded = true;
    }
  }

  let firstDiscountAmount = 0;
  let effectiveDiscountRate = 0;

  if (discountType === "percentage") {
    effectiveDiscountRate = numericDiscount;
    firstDiscountAmount = price * (numericDiscount / 100);
  } else {
    firstDiscountAmount = numericDiscount;
    effectiveDiscountRate = price > 0 ? (firstDiscountAmount / price) * 100 : 0;
  }

  const priceAfterFirstDiscount = Math.max(price - firstDiscountAmount, 0);
  const additionalDiscountAmount = priceAfterFirstDiscount * (additionalDiscountRate / 100);
  const priceAfterAllDiscounts = Math.max(priceAfterFirstDiscount - additionalDiscountAmount, 0);

  const totalDiscountAmountPerUnit = firstDiscountAmount + additionalDiscountAmount;
  const totalDiscountPercentage =
    price > 0 ? (totalDiscountAmountPerUnit / price) * 100 : 0;

  const salesTaxAmountPerUnit = priceAfterAllDiscounts * (salesTaxRate / 100);
  const finalPriceIncludingTaxPerUnit = priceAfterAllDiscounts + salesTaxAmountPerUnit;
  const totalSavingsForAllQuantities = totalDiscountAmountPerUnit * validQuantity;
  const totalPriceForAllQuantities = finalPriceIncludingTaxPerUnit * validQuantity;

  const formatCurrency = (amount: number) => {
    return `${currency} ${Number(amount).toFixed(2)}`;
  };

  const handleCopyResults = () => {
    const textToCopy = `
Sale Discount Value & Tax Summary:
Original Price Total: ${formatCurrency(price * validQuantity)}
Total Discount Amount: ${formatCurrency(totalDiscountAmountPerUnit)} (${totalDiscountPercentage.toFixed(2)}%)
Price After Discount: ${formatCurrency(priceAfterAllDiscounts)}
Sales Tax Amount: ${formatCurrency(salesTaxAmountPerUnit * validQuantity)}
Final Price Including Tax: ${formatCurrency(finalPriceIncludingTaxPerUnit)}
Total Savings (All Qty): ${formatCurrency(totalSavingsForAllQuantities)}
Total Price for All Quantities: ${formatCurrency(totalPriceForAllQuantities)}
    `.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handlePrintResults = () => {
    window.print();
  };

  const handleResetCalculator = () => {
    setOriginalPrice("");
    setCurrency("USD");
    setDiscountType("percentage");
    setDiscountValue("0");
    setSalesTax("0");
    setAdditionalDiscount("0");
    setQuantity("1");
    setCopied(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="sale-discount1">
      {/* Main Calculator Card */}
      <div className="sale-discount2">
        <h2 className="sale-discount3">
          Sale Discount Value Calculator With Tax Percentage
        </h2>

        <div className="sale-discount4">Input Details</div>

        <div className="sale-discount5">
          <div className="sale-discount6">
            <label htmlFor="originalPrice" className="sale-discount8">
              Original Price
            </label>
            <input
              type="number"
              id="originalPrice"
              className="sale-discount9"
              min="0"
              step="any"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="Enter original price"
            />
            {isPriceInvalid && (
              <span className="sale-discount10">
                Please enter a valid positive number.
              </span>
            )}
          </div>

          <div className="sale-discount6">
            <label htmlFor="currency" className="sale-discount8">
              Currency
            </label>
            <select
              id="currency"
              className="sale-discount9"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD — US Dollar (United States)</option>
              <option value="GBP">GBP — British Pound (United Kingdom)</option>
              <option value="NOK">NOK — Norwegian Krone (Norway)</option>
              <option value="EUR">EUR — Euro (European Union)</option>
              <option value="DKK">DKK — Danish Krone (Denmark)</option>
              <option value="SEK">SEK — Swedish Krona (Sweden)</option>
              <option value="ISK">ISK — Icelandic Króna (Iceland)</option>
              <option value="BDT">BDT — Bangladeshi Taka (Bangladesh)</option>
              <option value="SAR">SAR — Saudi Riyal (Saudi Arabia)</option>
              <option value="INR">INR — Indian Rupee (India)</option>
              <option value="CZK">CZK — Czech Koruna (Czech Republic)</option>
              <option value="PLN">PLN — Polish Zloty (Poland)</option>
              <option value="RON">RON — Romanian Leu (Romania)</option>
              <option value="HUF">HUF — Hungarian Forint (Hungary)</option>
              <option value="BGN">BGN — Bulgarian Lev (Bulgaria)</option>
              <option value="HRK">HRK — Croatian Kuna (Croatia)</option>
              <option value="ALL">ALL — Albanian Lek (Albania)</option>
              <option value="BYN">BYN — Belarusian Ruble (Belarus)</option>
              <option value="RUB">RUB — Russian Ruble (Russia)</option>
              <option value="BAM">BAM — Convertible Mark (Bosnia and Herzegovina)</option>
              <option value="RSD">RSD — Serbian Dinar (Serbia)</option>
              <option value="TRY">TRY — Turkish Lira (Turkey)</option>
              <option value="UAH">UAH — Ukrainian Hryvnia (Ukraine)</option>
              <option value="MDL">MDL — Moldovan Leu (Moldova)</option>
              <option value="MKD">MKD — Macedonian Denar (North Macedonia)</option>
              <option value="PKR">PKR — Pakistani Rupee (Pakistan)</option>
              <option value="AED">AED — UAE Dirham (UAE)</option>
            </select>
          </div>

          <div className="sale-discount6">
            <label htmlFor="discountType" className="sale-discount8">
              Discount Type
            </label>
            <select
              id="discountType"
              className="sale-discount9"
              value={discountType}
              onChange={(e) =>
                setDiscountType(e.target.value as "percentage" | "fixed")
              }
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div className="sale-discount6">
            <label htmlFor="discountValue" className="sale-discount8">
              Discount Value
            </label>
            <input
              type="number"
              id="discountValue"
              className="sale-discount9"
              min="0"
              step="any"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="Enter discount amount"
            />
            {isDiscountExceeded && (
              <span className="sale-discount10">
                Discount cannot exceed 100% or original price.
              </span>
            )}
          </div>

          <div className="sale-discount6">
            <label htmlFor="salesTax" className="sale-discount8">
              Sales Tax (%)
            </label>
            <input
              type="number"
              id="salesTax"
              className="sale-discount9"
              min="0"
              step="any"
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
              placeholder="Enter tax percentage"
            />
          </div>

          <div className="sale-discount6">
            <label htmlFor="additionalDiscount" className="sale-discount8">
              Additional Discount (%)
            </label>
            <input
              type="number"
              id="additionalDiscount"
              className="sale-discount9"
              min="0"
              step="any"
              value={additionalDiscount}
              onChange={(e) => setAdditionalDiscount(e.target.value)}
              placeholder="Enter extra discount"
            />
          </div>

          <div className="sale-discount7">
            <label htmlFor="quantity" className="sale-discount8">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="sale-discount9"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
            {isQtyInvalid && (
              <span className="sale-discount10">
                Quantity must be at least 1.
              </span>
            )}
          </div>
        </div>

        {/* Calculation Results */}
        {showResults && (
          <>
            <div className="sale-discount11">
              <h3 className="sale-discount12">Calculation Results</h3>

              <div className="sale-discount13">
                <span className="sale-discount14">Original Price:</span>
                <span className="sale-discount15">
                  {formatCurrency(price * validQuantity)}
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">First Discount Amount:</span>
                <span className="sale-discount15">
                  {formatCurrency(firstDiscountAmount * validQuantity)}
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">
                  Effective Discount Rate (Reverse):
                </span>
                <span className="sale-discount15">
                  {effectiveDiscountRate.toFixed(2)}%
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">
                  Additional Discount Amount:
                </span>
                <span className="sale-discount15">
                  {formatCurrency(additionalDiscountAmount * validQuantity)}
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">
                  Total Discount Amount (Per Unit):
                </span>
                <span className="sale-discount15">
                  {formatCurrency(totalDiscountAmountPerUnit)}
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">
                  Total Discount Percentage:
                </span>
                <span className="sale-discount15">
                  {totalDiscountPercentage.toFixed(2)}%
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">Price After Discount:</span>
                <span className="sale-discount15">
                  {formatCurrency(priceAfterAllDiscounts)}
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">Sales Tax Amount:</span>
                <span className="sale-discount15">
                  {formatCurrency(salesTaxAmountPerUnit * validQuantity)}
                </span>
              </div>

              <div className="sale-discount16">
                <span className="sale-discount14">
                  Final Price Including Tax (Per Unit):
                </span>
                <span className="sale-discount17">
                  {formatCurrency(finalPriceIncludingTaxPerUnit)}
                </span>
              </div>

              <div className="sale-discount13">
                <span className="sale-discount14">
                  Total Savings (All Quantities):
                </span>
                <span className="sale-discount15">
                  {formatCurrency(totalSavingsForAllQuantities)}
                </span>
              </div>

              <div className="sale-discount16">
                <span className="sale-discount14">
                  Total Price for All Quantities:
                </span>
                <span className="sale-discount17">
                  {formatCurrency(totalPriceForAllQuantities)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sale-discount18">
              <button
                type="button"
                className="sale-discount19"
                onClick={handleCopyResults}
              >
                {copied ? "Copied!" : "Copy Results"}
              </button>
              <button
                type="button"
                className="sale-discount20"
                onClick={handlePrintResults}
              >
                Print Results
              </button>
              <button
                type="button"
                className="sale-discount21"
                onClick={handleResetCalculator}
              >
                Reset
              </button>
            </div>
          </>
        )}
      </div>

      {/* SEO Content Section: H1 Main Heading + First Paragraph */}
      <section className="sale-discount22">
        <h1 className="sale-discount23">
          Sale Discount Value Calculator With Tax Percentage
        </h1>
        <p className="sale-discount24">
          Welcome to our free online Sale Discount Value Calculator With Tax
          Percentage, an accurate financial tool designed to help shoppers,
          retailers, and small business owners determine final checkout prices
          in seconds. Simply enter the original retail price, choose between a
          percentage markdown or a fixed discount value, add any stacked
          additional discount coupons, and enter your local sales tax
          percentage. The tool immediately breaks down your per-unit savings,
          effective discount rate, exact sales tax amount, and grand total
          across multiple quantities in your preferred global currency.
        </p>
      </section>

      {/* Interactive Accordion FAQ Section */}
      <section className="sale-discount25">
        <h2 className="sale-discount26">
          Frequently Asked Questions About Sale Discount Value Calculator With
          Tax Percentage
        </h2>
        <div className="sale-discount27">
          {saleDiscountTaxFaqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="sale-discount28">
                <button
                  type="button"
                  className="sale-discount29"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="sale-discount30">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && <div className="sale-discount31">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}