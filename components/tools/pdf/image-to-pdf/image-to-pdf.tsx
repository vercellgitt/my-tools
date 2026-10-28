"use client";

import React, { useState, useRef } from "react";
import { translations } from "./i18n";
import "./image-to-pdf.css";

interface ImageItem {
  name: string;
  size: number;
  src: string;
  rotation: number;
}

export default function ImageToPdf() {
  const [lang, setLang] = useState("en");
  const t = translations[lang] || translations.en;

  const [images, setImages] = useState<ImageItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [pdfBlobUrl, setPdfBlobUrl] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    setStatus("idle");

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            src: event.target?.result as string,
            rotation: 0,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      [copy[index], copy[index - 1]] = [copy[index - 1], copy[index]];
      return copy;
    });
  };

  const moveDown = (index: number) => {
    setImages((prev) => {
      if (index === prev.length - 1) return prev;
      const copy = [...prev];
      [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
      return copy;
    });
  };

  const rotate = (index: number, direction: "left" | "right") => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index].rotation += direction === "right" ? 90 : -90;
      return copy;
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;
    setStatus("loading");

    const jsPDFModule = await import("jspdf");
    const { jsPDF } = jsPDFModule;

    let pdf: any;

    for (let i = 0; i < images.length; i++) {
      const imgItem = images[i];
      const imgEl = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = imgItem.src;
        img.onload = () => resolve(img);
      });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;

      let pageWidth = imgEl.width;
      let pageHeight = imgEl.height;

      if (imgItem.rotation % 180 !== 0) {
        canvas.width = imgEl.height;
        canvas.height = imgEl.width;
        pageWidth = imgEl.height;
        pageHeight = imgEl.width;
      } else {
        canvas.width = imgEl.width;
        canvas.height = imgEl.height;
      }

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((imgItem.rotation * Math.PI) / 180);
      ctx.drawImage(imgEl, -imgEl.width / 2, -imgEl.height / 2);

      const finalImg = canvas.toDataURL("image/jpeg", 1.0);

      if (i === 0) {
        pdf = new jsPDF({
          orientation: pageWidth > pageHeight ? "landscape" : "portrait",
          unit: "px",
          format: [pageWidth, pageHeight],
        });
      } else {
        pdf.addPage(
          [pageWidth, pageHeight],
          pageWidth > pageHeight ? "landscape" : "portrait"
        );
      }

      pdf.addImage(finalImg, "JPEG", 0, 0, pageWidth, pageHeight);
    }

    const blob = pdf.output("blob");
    if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
    const url = URL.createObjectURL(blob);

    setPdfBlobUrl(url);
    setStatus("success");
  };

  const downloadPdf = () => {
    const a = document.createElement("a");
    a.href = pdfBlobUrl;
    a.download = "Liebess_Image_To_Convert.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setStatus("idle");
    setImages([]);

    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <div className="i2p-wrapper">
      {/* 8-Language Selector */}
      <div className="i2p-lang-selector">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="i2p-lang-select"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="it">Italiano</option>
          <option value="da">Dansk</option>
          <option value="no">Norsk</option>
          <option value="ga">Gaeilge</option>
          <option value="lb">Lëtzebuergesch</option>
          <option value="fi">Suomi</option>
          <option value="sv">Svenska</option>
          <option value="nl">Nederlands</option>
          <option value="is">Íslenska</option>
          <option value="bn">বাংলা</option>
          <option value="ar">العربية</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      <div className="i2p-container">
        <div className="i2p-upload-section">
          <h1>{t.title}</h1>
          <p className="i2p-subtitle">{t.subtitle}</p>

          <div
            className="i2p-upload-box"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="i2p-upload-icon">📄</div>
            <h3>{t.uploadTitle}</h3>
            <p>{t.uploadFormats}</p>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFilesChange}
            />
            <button className="i2p-primary-btn">{t.selectBtn}</button>
          </div>
        </div>

        {images.length > 0 && status !== "loading" && status !== "success" && (
          <>
            <div className="i2p-counter-box">
              <span>{t.totalImages}</span> <strong>{images.length}</strong>
            </div>

            <div className="i2p-preview-container">
              {images.map((img, idx) => (
                <div key={idx} className="i2p-image-card">
                  <img
                    src={img.src}
                    style={{ transform: `rotate(${img.rotation}deg)` }}
                    alt={img.name}
                  />
                  <div className="i2p-image-info">
                    <div className="i2p-image-name">{img.name}</div>
                    <div className="i2p-image-size">
                      {(img.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                  <div className="i2p-action-bar">
                    <button
                      className="i2p-action-btn i2p-delete-btn"
                      onClick={() => deleteImage(idx)}
                    >
                      {t.delete}
                    </button>
                    <button
                      className="i2p-action-btn i2p-up-btn"
                      onClick={() => moveUp(idx)}
                    >
                      {t.up}
                    </button>
                    <button
                      className="i2p-action-btn i2p-down-btn"
                      onClick={() => moveDown(idx)}
                    >
                      {t.down}
                    </button>
                    <button
                      className="i2p-action-btn i2p-rotate-btn"
                      onClick={() => rotate(idx, "left")}
                    >
                      ⟲
                    </button>
                    <button
                      className="i2p-action-btn i2p-rotate-btn"
                      onClick={() => rotate(idx, "right")}
                    >
                      ⟳
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="i2p-toolbar">
              <button
                className="i2p-secondary-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                {t.addMoreBtn}
              </button>
              <button
                className="i2p-convert-btn"
                onClick={convertToPdf}
              >
                {t.convertBtn}
              </button>
            </div>
          </>
        )}

        {status === "loading" && (
          <div className="i2p-loading-screen">
            <div className="i2p-loader"></div>
            <h2>{t.converting}</h2>
            <p>{t.pleaseWait}</p>
          </div>
        )}

        {status === "success" && (
          <div className="i2p-success-screen">
            <div className="i2p-success-icon">✅</div>
            <h2>{t.successTitle}</h2>
            <p>Total Pages: {images.length}</p>
            <button className="i2p-download-btn" onClick={downloadPdf}>
              {t.downloadBtn}
            </button>
          </div>
        )}

        {/* Toggleable Accordion FAQ Section */}
        <div className="i2p-faq-section">
          <h2>{t.faqTitle}</h2>
          {t.faqs.map((faq: any, idx: number) => (
            <div key={idx} className="i2p-faq-item">
              <button
                className="i2p-faq-question"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span>{faq.q}</span>
                <span>{openFaq === idx ? "▲" : "▼"}</span>
              </button>
              {openFaq === idx && <div className="i2p-faq-answer">{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className={`i2p-toast ${toastVisible ? "show" : ""}`}>
        {t.toastMessage}
      </div>
    </div>
  );
}