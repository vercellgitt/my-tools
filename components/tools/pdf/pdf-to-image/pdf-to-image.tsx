"use client";

import React, { useState, useEffect, useRef } from "react";
import "./pdf-to-image.css";
import { translations, Language } from "./i18n";
import { TranslationKeys } from "./i18n/en";

function useExternalScript(src: string) {
  useEffect(() => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
  }, [src]);
}

export default function PdfToImageTool() {
  useExternalScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
  useExternalScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
  useExternalScript("https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js");

  const [lang, setLang] = useState<Language>("en");
  const t: TranslationKeys = (translations[lang] || translations.en) as any;

  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [currentDpi, setCurrentDpi] = useState<number>(150);
  const [quality, setQuality] = useState<number>(90);
  const [format, setFormat] = useState<string>("image/jpeg");
  const [convertedImages, setConvertedImages] = useState<any[]>([]);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isDropActive, setIsDropActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((window as any).pdfjsLib) {
      (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getActiveFile = () => uploadedFiles.find((f) => f.id === activeFileId);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(
      (f: any) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
    );
    if (files.length === 0) return;

    const newEntries = [...uploadedFiles];
    for (const file of files) {
      const id = Math.random().toString(36).substring(2);
      const entry: any = {
        id,
        file,
        name: file.name.replace(/\.pdf$/i, ""),
        size: file.size,
        pdfDoc: null,
        numPages: 0,
        pageStates: [],
      };
      newEntries.push(entry);
      setUploadedFiles([...newEntries]);
      if (!activeFileId) setActiveFileId(id);

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfjs = (window as any).pdfjsLib;
        if (pdfjs) {
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          entry.pdfDoc = pdf;
          entry.numPages = pdf.numPages;
          entry.pageStates = Array.from({ length: pdf.numPages }, (_, i) => ({
            pageNum: i + 1,
            rotation: 0,
            selected: true,
            thumbUrl: null,
          }));

          for (let i = 0; i < entry.pageStates.length; i++) {
            const page = await pdf.getPage(i + 1);
            const viewport = page.getViewport({ scale: 0.22 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              await page.render({ canvasContext: ctx, viewport }).promise;
              entry.pageStates[i].thumbUrl = canvas.toDataURL("image/jpeg", 0.55);
            }
          }
          setUploadedFiles([...newEntries]);
        }
      } catch (err) {
        console.error("Error loading PDF", err);
      }
    }
  };

  const startConversion = async () => {
    const file = getActiveFile();
    if (!file || !file.pdfDoc) return;

    const selectedStates = file.pageStates.filter((s: any) => s.selected);
    if (selectedStates.length === 0) return;

    setIsConverting(true);
    setProgress(0);
    setConvertedImages([]);

    const results = [];
    const scale = currentDpi / 72;

    for (let i = 0; i < selectedStates.length; i++) {
      const state = selectedStates[i];
      setProgress(Math.round(((i + 1) / selectedStates.length) * 100));
      setProgressText(`Converting page ${state.pageNum} (${i + 1}/${selectedStates.length})...`);

      const page = await file.pdfDoc.getPage(state.pageNum);
      const viewport = page.getViewport({ scale, rotation: state.rotation });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
      }

      const mime = format;
      const q = format === "image/png" ? undefined : quality / 100;
      const dataUrl = canvas.toDataURL(mime, q);
      const blob: any = await new Promise((resolve) => canvas.toBlob(resolve, mime, q));

      const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
      const fname = `${file.name}-page-${state.pageNum}.${ext}`;

      results.push({ blob, dataUrl, name: fname, size: blob.size, width: canvas.width, height: canvas.height });
    }

    setConvertedImages(results);
    setIsConverting(false);
  };

  const downloadZip = async () => {
    const JSZip = (window as any).JSZip;
    const saveAs = (window as any).saveAs;
    if (!JSZip || !saveAs || convertedImages.length === 0) return;

    const zip = new JSZip();
    convertedImages.forEach((img) => zip.file(img.name, img.blob));
    const content = await zip.generateAsync({ type: "blob" });
    const file = getActiveFile();
    saveAs(content, `${file ? file.name : "converted"}-images.zip`);
  };

  return (
    <div className="pdf-to-image-tool">
      {/* Top Language Dropdown Selector */}
      <div className="max-container lang-select-wrapper">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Language)}
          className="lang-select"
        >
          <option value="en">English</option>
          <option value="de">Deutsch (German)</option>
          <option value="fr">Français (French)</option>
          <option value="it">Italiano (Italian)</option>
          <option value="da">Dansk (Danish)</option>
          <option value="no">Norsk (Norwegian)</option>
          <option value="ga">Gaeilge (Irish)</option>
          <option value="lb">Lëtzebuergesch (Luxembourgish)</option>
          <option value="fi">Suomi (Finnish)</option>
          <option value="sv">Svenska (Swedish)</option>
          <option value="nl">Nederlands (Dutch)</option>
          <option value="is">Íslenska (Icelandic)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="ar">العربية (Arabic)</option>
          <option value="es">Español (Spanish)</option>
          <option value="pt">Português (Portuguese)</option>
          <option value="hi">हिन्दी (Hindi)</option>
        </select>
      </div>

      {/* Header */}
      <header className="max-container">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div className="header-icon">
            <i className="fas fa-file-pdf"></i>
          </div>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0, color: "#111827" }}>{t.title}</h1>
            <p style={{ fontSize: "0.75rem", color: "#6b7280", margin: 0 }}>{t.subtitle}</p>
          </div>
        </div>
      </header>

      <div className="max-container" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDropActive(true); }}
          onDragLeave={() => setIsDropActive(false)}
          onDrop={(e) => { e.preventDefault(); setIsDropActive(false); if (e.dataTransfer.files) { handleFileChange({ target: { files: e.dataTransfer.files } } as any); } }}
          className={`drop-zone ${isDropActive ? 'drop-zone-active' : ''}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
          />
          <div style={{ pointerEvents: "none" }}>
            <div style={{ width: "4rem", height: "4rem", margin: "0 auto 1rem auto", borderRadius: "1rem", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fas fa-cloud-upload-alt" style={{ fontSize: "1.75rem", color: "#2563eb" }}></i>
            </div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.25rem", color: "#111827" }}>{t.uploadTitle}</h2>
            <p style={{ color: "#6b7280", fontSize: "0.875rem", marginBottom: "1rem" }}>{t.uploadDesc}</p>
            <button type="button" style={{ padding: "0.625rem 1.25rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "0.5rem", fontWeight: 500, cursor: "pointer" }}>
              <i className="fas fa-folder-open" style={{ marginRight: "0.5rem" }}></i>{t.browseFiles}
            </button>
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "#111827" }}><i className="fas fa-file-pdf" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{t.uploadedPdfs}</h3>
              <button onClick={() => { setUploadedFiles([]); setActiveFileId(null); setConvertedImages([]); }} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}>
                <i className="fas fa-trash-alt" style={{ marginRight: "0.25rem" }}></i>{t.clearAll}
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {uploadedFiles.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setActiveFileId(f.id)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem", borderRadius: "0.75rem", backgroundColor: "#f8fafc", border: `1px solid ${f.id === activeFileId ? "#2563eb" : "#e2e8f0"}`, cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <i className="fas fa-file-pdf" style={{ color: "#dc2626", fontSize: "1.25rem" }}></i>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: "0.875rem", color: "#111827" }}>{f.file.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{formatBytes(f.size)} • {f.numPages || "..."} pages</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workspace */}
        {getActiveFile() && (
          <div className="grid-layout">
            <div className="col-span-8" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card">
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#111827" }}><i className="fas fa-th-large" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{t.pagePreview}</h3>
                <div className="scrollbar-thin" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "0.75rem", maxHeight: "400px", overflowY: "auto", padding: "0.25rem" }}>
                  {getActiveFile().pageStates.map((state: any, idx: number) => (
                    <div key={idx} className="page-thumb" style={{ borderRadius: "0.75rem", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", padding: "0.5rem" }}>
                      <div style={{ aspectRatio: "3/4", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }}>
                        {state.thumbUrl ? <img src={state.thumbUrl} style={{ objectFit: "contain", height: "100%", width: "100%" }} alt="" /> : "..."}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <input
                          type="checkbox"
                          checked={state.selected}
                          onChange={(e) => {
                            state.selected = e.target.checked;
                            setUploadedFiles([...uploadedFiles]);
                          }}
                          style={{ accentColor: "#2563eb" }}
                        />
                        <span style={{ fontSize: "0.75rem", color: "#4b5563" }}>Page {state.pageNum}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {convertedImages.length > 0 && (
                <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0, color: "#111827" }}><i className="fas fa-images" style={{ marginRight: "0.5rem", color: "#059669" }}></i>{t.convertedImages}</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.75rem" }}>
                    {convertedImages.map((img, idx) => (
                      <div key={idx} style={{ backgroundColor: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "0.75rem", padding: "0.5rem" }}>
                        <div style={{ aspectRatio: "3/4", backgroundColor: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: "0.5rem", borderRadius: "0.375rem", border: "1px solid #e2e8f0" }}>
                          <img src={img.dataUrl} style={{ objectFit: "contain", height: "100%", width: "100%" }} alt="" />
                        </div>
                        <div style={{ fontSize: "0.75rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "0.5rem", color: "#1f2937" }}>{img.name}</div>
                        <a
                          href={img.dataUrl}
                          download={img.name}
                          style={{ display: "block", textAlign: "center", fontSize: "0.75rem", padding: "0.375rem", backgroundColor: "#2563eb", color: "#fff", textDecoration: "none", borderRadius: "0.375rem" }}
                        >
                          <i className="fas fa-download"></i> {t.download}
                        </a>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={downloadZip}
                    style={{ width: "100%", padding: "0.75rem", backgroundColor: "#059669", color: "#fff", border: "none", borderRadius: "0.75rem", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  >
                    <i className="fas fa-file-archive"></i> {t.downloadAllZip}
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Settings */}
            <div className="col-span-4">
              <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "sticky", top: "1.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem", margin: 0, color: "#111827" }}>
                  <i className="fas fa-sliders-h" style={{ marginRight: "0.5rem", color: "#2563eb" }}></i>{t.settings}
                </h3>
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "#374151" }}>{t.outputFormat}</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                    {["image/jpeg", "image/png", "image/webp"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setFormat(m)}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          border: `1px solid ${format === m ? "#2563eb" : "#cbd5e1"}`,
                          backgroundColor: format === m ? "#eff6ff" : "transparent",
                          color: format === m ? "#1d4ed8" : "#374151",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          textTransform: "uppercase"
                        }}
                      >
                        {m.split("/")[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {format !== "image/png" && (
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "#374151" }}>
                      {t.imageQuality} <span style={{ color: "#2563eb" }}>{quality}%</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#2563eb" }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.5rem", color: "#374151" }}>{t.resolutionDpi}</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                    {[72, 150, 300, 600].map((dpi) => (
                      <button
                        key={dpi}
                        type="button"
                        onClick={() => setCurrentDpi(dpi)}
                        style={{
                          padding: "0.5rem",
                          borderRadius: "0.5rem",
                          border: `1px solid ${currentDpi === dpi ? "#2563eb" : "#cbd5e1"}`,
                          backgroundColor: currentDpi === dpi ? "#eff6ff" : "transparent",
                          color: currentDpi === dpi ? "#1d4ed8" : "#374151",
                          fontSize: "0.75rem",
                          cursor: "pointer"
                        }}
                      >
                        {dpi}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startConversion}
                  disabled={isConverting}
                  className="btn-primary"
                >
                  <i className="fas fa-magic"></i>
                  <span>{isConverting ? t.converting : t.convertToImages}</span>
                </button>

                {isConverting && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#6b7280" }}>
                      <span>{progressText}</span>
                      <span>{progress}%</span>
                    </div>
                    <div style={{ height: "0.5rem", backgroundColor: "#e2e8f0", borderRadius: "9999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", backgroundColor: "#2563eb", width: `${progress}%`, transition: "width 0.3s ease" }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accordion FAQ Section (Exactly matching user's design reference) */}
        <section className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#111827" }}>
            <i className="fas fa-question-circle" style={{ color: "#2563eb" }}></i> {t.faqTitle}
          </h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {t.faqs.map((faq: any, idx: number) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} style={{ borderBottom: idx !== t.faqs.length - 1 ? "1px solid #e2e8f0" : "none" }}>
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "1rem 0.5rem",
                      textAlign: "left",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "transparent",
                      border: "none",
                      color: "#111827",
                      cursor: "pointer"
                    }}
                  >
                    <span>{faq.q}</span>
                    <div style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      backgroundColor: "#f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "transform 0.2s"
                    }}>
                      <i className={`fas fa-chevron-down`} style={{
                        fontSize: "0.75rem",
                        color: "#4b5563",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                      }}></i>
                    </div>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 0.5rem 1rem 0.5rem", fontSize: "0.85rem", color: "#4b5563", lineHeight: "1.6" }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}