"use client";

import React, { useState, useEffect } from "react";
import Script from "next/script";
import { ipToolsConfig, SlugConfig } from "./faq";
import "./what-is-my-ip-address.css";

interface ComponentProps {
  slug?: string;
}

export default function WhatIsMyIpAddress({ slug = "what-is-my-ip-address" }: ComponentProps) {
  const config: SlugConfig = ipToolsConfig[slug] || ipToolsConfig["what-is-my-ip-address"];

  const [ipv4, setIpv4] = useState<string>("Loading...");
  const [ipv6, setIpv6] = useState<string>("Loading...");
  const [deviceInfo, setDeviceInfo] = useState({
    browser: "—",
    version: "—",
    os: "—",
    device: "—",
  });

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const copyToClipboard = (text: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!text || text === "Loading..." || text === "Error" || text === "Not detected") return;
    const btn = e.currentTarget;
    const originalText = btn.textContent;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = "Copied!";
      btn.style.background = "#16a34a";
      btn.style.color = "#ffffff";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "#e2e8f0";
        btn.style.color = "#1e293b";
      }, 1500);
    });
  };

  const detectBrowserDevice = () => {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;
    let bName = "Unknown";
    let bVer = "—";
    let osName = "Unknown";
    let dType = "Desktop";

    if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1 && ua.indexOf("OPR") === -1) bName = "Chrome";
    else if (ua.indexOf("Firefox") > -1) bName = "Firefox";
    else if (ua.indexOf("Safari") > -1 && ua.indexOf("Chrome") === -1) bName = "Safari";
    else if (ua.indexOf("Edg") > -1) bName = "Edge";

    const vMatch = ua.match(/(Chrome|Firefox|Safari|Edg)\/(\d+)/);
    if (vMatch) bVer = vMatch[2];

    if (/Android/i.test(ua)) { osName = "Android"; dType = "Mobile"; }
    else if (/iPhone|iPad|iPod/i.test(ua)) { osName = "iOS"; dType = /iPad/i.test(ua) ? "Tablet" : "Mobile"; }
    else if (/Windows/i.test(ua)) osName = "Windows";
    else if (/Macintosh|Mac OS X/i.test(ua)) osName = "macOS";
    else if (/Linux/i.test(ua)) osName = "Linux";

    if (/Mobi|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) dType = "Mobile";
    else if (/Tablet|iPad/i.test(ua)) dType = "Tablet";

    setDeviceInfo({ browser: bName, version: bVer, os: osName, device: dType });
  };

  const fetchIPData = async () => {
    setIpv4("Loading...");
    setIpv6("Loading...");

    try {
      const v4Res = await fetch("https://api.ipify.org?format=json");
      const v4Data = await v4Res.json();
      const detectedV4 = v4Data.ip;
      setIpv4(detectedV4);

      let detectedV6 = "Not detected";
      try {
        const v6Res = await fetch("https://api64.ipify.org?format=json");
        const v6Data = await v6Res.json();
        if (v6Data.ip && v6Data.ip !== detectedV4) {
          detectedV6 = v6Data.ip;
        }
      } catch (e) {}
      setIpv6(detectedV6);
    } catch (err) {
      setIpv4("Error");
      setIpv6("Not detected");
    }
  };

  useEffect(() => {
    detectBrowserDevice();
    fetchIPData();
  }, []);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords.join(", "),
  };

  return (
    <div className="ip-tool-wrapper">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="webpage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <div className="ip-tool-container">
        <div className="ip-tool-header">
          <h1 className="ip-tool-h1">{config.h1Title}</h1>
          <p className="ip-tool-intro">{config.introText}</p>
        </div>

        <div className="ip-card">
          <div className="status">
            <span className="status-dot"></span>
            Connected • Live
          </div>

          <h2 className="ip-card-title">My IP Address is:</h2>

          <div className="ip-info">
            <div className="ip-row">
              <div className="ip-header-row">
                <span className="ip-label">IPv4:</span>
                <button className="copy-btn" onClick={(e) => copyToClipboard(ipv4, e)}>
                  Copy
                </button>
              </div>
              <span className="ipv4">{ipv4}</span>
            </div>

            <div className="ip-row">
              <div className="ip-header-row">
                <span className="ip-label">IPv6:</span>
                <button className="copy-btn" onClick={(e) => copyToClipboard(ipv6, e)}>
                  Copy
                </button>
              </div>
              <span className="ipv6">{ipv6}</span>
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-refresh" onClick={() => fetchIPData()}>
              ⟳ Refresh Data
            </button>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="card-header">
              <span>💻</span>
              <span>DEVICE & BROWSER INFO</span>
            </div>
            <div>
              <div className="field-row">
                <div>
                  <div className="field-label">Browser</div>
                  <div id="browser" className="card-value">{deviceInfo.browser}</div>
                </div>
                <div>
                  <div className="field-label">Version</div>
                  <div id="browser-version" className="card-value">{deviceInfo.version}</div>
                </div>
              </div>
              <div className="field-row-margin">
                <div>
                  <div className="field-label">OS</div>
                  <div id="os" className="card-value">{deviceInfo.os}</div>
                </div>
                <div>
                  <div className="field-label">Device</div>
                  <div id="device-type" className="card-value">{deviceInfo.device}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="ip-article-section">
          <h2>{config.article.title}</h2>
          {config.article.sections.map((sec, idx) => {
            const HeadingTag = sec.level as keyof React.JSX.IntrinsicElements;
            return (
              <React.Fragment key={idx}>
                {React.createElement(HeadingTag, {}, sec.heading)}
                <p>{sec.content}</p>
              </React.Fragment>
            );
          })}
        </section>

        <section className="ip-faq-section">
          <h2 className="ip-faq-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {config.faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">{isOpen ? "▲" : "▼"}</span>
                  </button>
                  {isOpen && <div className="faq-answer">{faq.answer}</div>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}