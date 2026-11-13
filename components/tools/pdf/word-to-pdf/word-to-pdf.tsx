"use client";

import React, { useState, useRef, useEffect } from "react";
import Script from "next/script";
import "./word-to-pdf.css";
import { wordToPdfFaqs } from "./faq";

declare global {
  interface Window {
    mammoth?: any;
    XLSX?: any;
    html2canvas?: any;
    jspdf?: any;
    PDFLib?: any;
  }
}

const SUPPORTED_EXTENSIONS = new Set([
  "txt",
  "docx",
  "doc",
  "pdf",
  "rtf",
  "md",
  "html",
  "htm",
  "csv",
  "json",
  "xls",
  "xlsx",
]);

function formatBytes(bytes: number): string {
  if (!bytes) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  return (
    (bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2) +
    " " +
    units[index]
  );
}

function getExtension(name: string): string {
  const parts = name.toLowerCase().split(".");
  return parts.length > 1 ? parts.pop() || "" : "";
}

function getBaseName(name: string): string {
  return name.replace(/\.[^/.]+$/, "").trim() || "document";
}

function escapeHtml(value: string): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hasComplexScript(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1B00-\u1B7F\u1B80-\u1BBF\u1BC0-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1C8F\u1C90-\u1CBF\u1CC0-\u1CCF\u1CD0-\u1CFF\u4E00-\u9FFF\u3400-\u4DBF\uAC00-\uD7AF\u3040-\u309F\u30A0-\u30FF]/.test(
    text
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function awaitNextFrame() {
  if (
    typeof (window as any).scheduler !== "undefined" &&
    typeof (window as any).scheduler.yield === "function"
  ) {
    await (window as any).scheduler.yield();
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export default function WordToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [pageSize, setPageSize] = useState<"a4" | "letter" | "legal">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const [quality, setQuality] = useState<"standard" | "high">("standard");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaAuthor, setMetaAuthor] = useState("");

  const [converting, setConverting] = useState(false);
  const [progressTitle, setProgressTitle] = useState(
    "Converting your documents..."
  );
  const [progressStatus, setProgressStatus] = useState("Preparing...");
  const [progressPercent, setProgressPercent] = useState(0);

  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [origSize, setOrigSize] = useState("--");
  const [pdfSize, setPdfSize] = useState("--");
  const [pageCount, setPageCount] = useState("0");
  const [resultQuality, setResultQuality] = useState("Standard");
  const [outputFilename, setOutputFilename] = useState("document");
  const [zoom, setZoom] = useState(100);

  const [toastText, setToastText] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputMoreRef = useRef<HTMLInputElement | null>(null);
  const resultPanelRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, [pdfUrl]);

  const showToast = (msg = "Download Complete") => {
    setToastText(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastText(null);
    }, 2000);
  };

  const validateFile = (file: File) => {
    const ext = getExtension(file.name);
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      return {
        valid: false,
        message: `"${file.name}" is not a supported format.`,
      };
    }
    if (ext === "doc") {
      return {
        valid: false,
        message: `"${file.name}" is an old DOC file. Please save it as DOCX first.`,
      };
    }
    return { valid: true };
  };

  const addFiles = (incomingList: FileList | null) => {
    setAlertMessage(null);
    const incoming = Array.from(incomingList || []);
    if (!incoming.length) return;

    setFiles((prev) => {
      const updated = [...prev];
      for (const file of incoming) {
        const validation = validateFile(file);
        if (!validation.valid) {
          setAlertMessage(validation.message || "Invalid file.");
          continue;
        }
        const duplicate = updated.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );
        if (!duplicate) {
          updated.push(file);
        }
      }
      return updated;
    });
  };

  const removeFileAt = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearAllFiles = () => {
    setFiles([]);
    setAlertMessage(null);
  };

  const handleSettingChange = <T,>(setter: (val: T) => void, val: T) => {
    setter(val);
    if (pdfBlob && !converting) {
      setAlertMessage(
        "Settings changed. Convert again to create the PDF with the new settings."
      );
    }
  };

  const createTextPdf = () => {
    const { jsPDF } = window.jspdf;
    return new jsPDF({
      orientation,
      unit: "mm",
      format: pageSize,
      compress: true,
    });
  };

  const addTextDocumentToPdf = async (
    pdf: any,
    text: string,
    fileName: string
  ) => {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    const fontSize = quality === "high" ? 9 : 8.5;
    const lineHeight = fontSize * 0.42;
    const top = margin + 8;
    const bottom = pageHeight - margin;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(getBaseName(fileName), margin, margin + 2);

    pdf.setFont("courier", "normal");
    pdf.setFontSize(fontSize);

    let y = top;
    const lines = String(text).replace(/\r\n/g, "\n").split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.length) {
        if (y + lineHeight > bottom) {
          pdf.addPage();
          y = margin;
        }
        y += lineHeight;
        continue;
      }

      const wrapped = pdf.splitTextToSize(line, contentWidth);
      for (const part of wrapped) {
        if (y + lineHeight > bottom) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(part, margin, y);
        y += lineHeight;
      }

      if (i % 400 === 0 && i > 0) {
        setProgressStatus(
          `${fileName}: processing line ${i.toLocaleString()} of ${lines.length.toLocaleString()}`
        );
        await awaitNextFrame();
      }
    }

    return pdf.getNumberOfPages();
  };

  const rtfToText = (rtf: string) => {
    return String(rtf)
      .replace(/\\par[d]?/gi, "\n")
      .replace(/\\line/gi, "\n")
      .replace(/\\tab/gi, "\t")
      .replace(/\\'[0-9a-f]{2}/gi, (match) =>
        String.fromCharCode(parseInt(match.substring(2), 16))
      )
      .replace(/\\[a-z]+\d* ?/gi, "")
      .replace(/[{}]/g, "")
      .trim();
  };

  const markdownToPlainText = (markdown: string) => {
    return String(markdown)
      .replace(/^#{1,6}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  };

  const parseCSV = (text: string) => {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let quotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"' && next === '"') {
        cell += '"';
        i++;
        continue;
      }
      if (char === '"') {
        quotes = !quotes;
        continue;
      }
      if (char === "," && !quotes) {
        row.push(cell);
        cell = "";
        continue;
      }
      if ((char === "\n" || char === "\r") && !quotes) {
        if (char === "\r" && next === "\n") i++;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
        continue;
      }
      cell += char;
    }

    if (cell.length || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows;
  };

  const csvToText = (rows: string[][]) => {
    return rows
      .map((row) => row.map((cell) => String(cell)).join("    "))
      .join("\n");
  };

  const spreadsheetToText = async (file: File) => {
    if (!window.XLSX) {
      throw new Error("Excel library could not be loaded.");
    }
    const buffer = await file.arrayBuffer();
    const workbook = window.XLSX.read(buffer, { type: "array" });
    let output = "";

    for (const sheetName of workbook.SheetNames) {
      output += "\n\n===== " + sheetName + " =====\n\n";
      const sheet = workbook.Sheets[sheetName];
      const rows: any[][] = window.XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        raw: false,
        defval: "",
      });
      for (const row of rows) {
        output += row.map((value) => String(value)).join("    ") + "\n";
      }
    }
    return output;
  };

  const docxToHtml = async (file: File) => {
    if (!window.mammoth) {
      throw new Error("DOCX library could not be loaded.");
    }
    const buffer = await file.arrayBuffer();
    const result = await window.mammoth.convertToHtml({ arrayBuffer: buffer });
    return result.value;
  };

  const sanitizeHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const styles = Array.from(doc.head.querySelectorAll("style"))
      .map((style) => style.outerHTML)
      .join("\n");

    doc
      .querySelectorAll("script, iframe, object, embed, link, meta, base")
      .forEach((el) => el.remove());

    doc.querySelectorAll("*").forEach((el) => {
      Array.from(el.attributes).forEach((attribute) => {
        const name = attribute.name.toLowerCase();
        const value = attribute.value;
        if (name.startsWith("on") || /javascript:/i.test(value)) {
          el.removeAttribute(attribute.name);
        }
      });
    });

    return styles + "\n" + (doc.body ? doc.body.innerHTML : "");
  };

  const createDocumentHtml = (content: string, fileName: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: #fff;
  color: #111827;
  font-family: Arial, Helvetica, "Noto Sans", "Noto Sans Bengali", "Noto Sans Arabic", sans-serif;
  font-size: 14px;
  line-height: 1.55;
}
.wrapper { padding: 5px; background: #fff; }
h1 { font-size: 26px; }
h2 { font-size: 21px; }
h3 { font-size: 18px; }
p { margin: 0 0 12px; }
pre { white-space: pre-wrap; word-break: break-word; font-family: "Courier New", monospace; }
table { width: 100%; border-collapse: collapse; margin: 10px 0 20px; font-size: 11px; }
th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; vertical-align: top; }
th { background: #f1f5f9; }
img { max-width: 100%; height: auto; }
</style>
</head>
<body>
<div class="wrapper">
<h2>${escapeHtml(getBaseName(fileName))}</h2>
${content}
</div>
</body>
</html>`;
  };

  const htmlToSinglePdf = async (html: string) => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format: pageSize,
      compress: true,
    });

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-100000px";
    iframe.style.top = "0";
    iframe.style.width = "900px";
    iframe.style.height = "1200px";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      iframe.remove();
      throw new Error("Unable to initialize preview document frame.");
    }

    doc.open();
    doc.write(html);
    doc.close();

    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      setTimeout(() => resolve(), 600);
    });

    const body = doc.body;
    const canvas = await window.html2canvas(body, {
      scale: quality === "high" ? 1.7 : 1.15,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: body.scrollWidth,
      windowHeight: body.scrollHeight,
    });

    iframe.remove();

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;
    const availableWidth = pageWidth - margin * 2;
    const imageHeight = (canvas.height * availableWidth) / canvas.width;
    const usableHeight = pageHeight - margin * 2;

    const imageData = canvas.toDataURL(
      "image/jpeg",
      quality === "high" ? 0.93 : 0.82
    );

    let offset = 0;
    let first = true;
    let pages = 0;

    while (offset < imageHeight || first) {
      if (!first) {
        pdf.addPage();
      }
      pdf.addImage(
        imageData,
        "JPEG",
        margin,
        margin - offset,
        availableWidth,
        imageHeight,
        undefined,
        "FAST"
      );
      offset += usableHeight;
      first = false;
      pages++;
      if (pages > 5000) break;
    }

    return {
      bytes: pdf.output("arraybuffer"),
      pages,
    };
  };

  const textFileToPdf = async (text: string, fileName: string) => {
    if (hasComplexScript(text)) {
      setProgressStatus(
        `${fileName}: Unicode detected — using visual rendering for better language support`
      );
      const html = createDocumentHtml(
        `<pre style="white-space:pre-wrap;word-break:break-word;font-family:inherit;font-size:13px;line-height:1.5;">${escapeHtml(
          text
        )}</pre>`,
        fileName
      );
      return await htmlToSinglePdf(html);
    }

    const pdf = createTextPdf();
    const pages = await addTextDocumentToPdf(pdf, text, fileName);
    return {
      bytes: pdf.output("arraybuffer"),
      pages,
    };
  };

  const convertOneFile = async (file: File, index: number, total: number) => {
    const ext = getExtension(file.name);
    setProgressStatus(`Processing ${file.name} (${index + 1} of ${total})`);

    if (ext === "json") {
      const rawText = await file.text();
      let formatted = rawText;
      try {
        formatted = JSON.stringify(JSON.parse(rawText), null, 2);
      } catch {
        formatted = rawText;
      }
      return await textFileToPdf(formatted, file.name);
    }

    if (ext === "txt") {
      return await textFileToPdf(await file.text(), file.name);
    }

    if (ext === "md") {
      return await textFileToPdf(
        markdownToPlainText(await file.text()),
        file.name
      );
    }

    if (ext === "rtf") {
      return await textFileToPdf(rtfToText(await file.text()), file.name);
    }

    if (ext === "csv") {
      const rows = parseCSV(await file.text());
      return await textFileToPdf(csvToText(rows), file.name);
    }

    if (ext === "xls" || ext === "xlsx") {
      return await textFileToPdf(await spreadsheetToText(file), file.name);
    }

    if (ext === "docx") {
      const content = await docxToHtml(file);
      return await htmlToSinglePdf(
        createDocumentHtml(sanitizeHtml(content), file.name)
      );
    }

    if (ext === "html" || ext === "htm") {
      const raw = await file.text();
      return await htmlToSinglePdf(
        createDocumentHtml(sanitizeHtml(raw), file.name)
      );
    }

    if (ext === "pdf") {
      if (!window.PDFLib) {
        throw new Error(
          "PDF library could not be loaded. Please refresh the page."
        );
      }
      const bytes = new Uint8Array(await file.arrayBuffer());
      return {
        originalPdf: bytes,
        pages: null,
      };
    }

    throw new Error(`Unsupported file type: .${ext}`);
  };

  const mergePdfDocuments = async (documents: any[]) => {
    if (!window.PDFLib) {
      throw new Error("pdf-lib could not be loaded.");
    }
    const { PDFDocument } = window.PDFLib;
    const finalPdf = await PDFDocument.create();
    let totalPages = 0;

    for (let i = 0; i < documents.length; i++) {
      const item = documents[i];
      setProgressStatus(`Combining PDF ${i + 1} of ${documents.length}`);

      const sourcePdf = item.originalPdf
        ? await PDFDocument.load(item.originalPdf, { ignoreEncryption: true })
        : await PDFDocument.load(item.bytes);

      const copiedPages = await finalPdf.copyPages(
        sourcePdf,
        sourcePdf.getPageIndices()
      );

      for (const page of copiedPages) {
        finalPdf.addPage(page);
        totalPages++;
      }

      documents[i].bytes = null;
      documents[i].originalPdf = null;

      if (i % 2 === 0) {
        await sleep(0);
      }
    }

    finalPdf.setTitle(metaTitle.trim() || "Converted Document");
    finalPdf.setAuthor(
      metaAuthor.trim() || "Word to PDF Transfer From Conversion Word to PDF"
    );
    finalPdf.setSubject("Word to PDF transfer from conversion word to pdf");
    finalPdf.setCreator("Word to PDF Converter");

    const bytes = await finalPdf.save({ useObjectStreams: true });
    return { bytes, pages: totalPages };
  };

  const handleConvert = async () => {
    if (!files.length) {
      setAlertMessage("Please select at least one file.");
      return;
    }

    if (!window.jspdf || !window.jspdf.jsPDF) {
      setAlertMessage("jsPDF could not be loaded. Please refresh the page.");
      return;
    }

    if (!window.PDFLib) {
      setAlertMessage(
        "PDF engine could not be loaded. Please refresh the page."
      );
      return;
    }

    setConverting(true);
    setAlertMessage(null);
    setPdfBlob(null);
    setProgressPercent(0);

    const documents: any[] = [];
    let totalOriginalSize = 0;

    try {
      const total = files.length;

      for (let i = 0; i < total; i++) {
        const file = files[i];
        totalOriginalSize += file.size;

        setProgressPercent(Math.round((i / total) * 75));
        setProgressTitle(`Converting ${file.name}`);

        const result = await convertOneFile(file, i, total);
        documents.push(result);

        setProgressPercent(Math.round(((i + 1) / total) * 75));
        await sleep(0);
      }

      setProgressTitle("Combining documents...");
      setProgressPercent(85);

      const merged = await mergePdfDocuments(documents);
      setProgressPercent(95);

      const blob = new Blob([merged.bytes], { type: "application/pdf" });
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const nextUrl = URL.createObjectURL(blob);

      setPdfBlob(blob);
      setPdfUrl(nextUrl);
      setOutputFilename(
        files.length === 1 ? getBaseName(files[0].name) : "documents"
      );
      setOrigSize(formatBytes(totalOriginalSize));
      setPdfSize(formatBytes(blob.size));
      setPageCount(String(merged.pages));
      setResultQuality(quality === "high" ? "High" : "Standard");

      setProgressPercent(100);
      setProgressTitle("Conversion Complete");
      setProgressStatus("Preparing PDF preview...");

      await sleep(350);
      setConverting(false);
      setZoom(100);

      setTimeout(() => {
        resultPanelRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: any) {
      console.error("Conversion error:", err);
      setConverting(false);
      setAlertMessage(
        "Conversion failed: " +
          (err?.message || "Something went wrong during conversion.")
      );
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !pdfUrl) {
      setAlertMessage("There is no converted PDF available.");
      return;
    }

    let filename = outputFilename
      .trim()
      .replace(/[<>:"/\\|?*]/g, "_")
      .replace(/\.pdf$/i, "")
      .trim();

    if (!filename) filename = "document";

    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    showToast("Download Complete");
  };

  const handleOpenNewTab = () => {
    if (!pdfUrl) {
      setAlertMessage("There is no PDF available.");
      return;
    }
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handlePrint = () => {
    if (!pdfUrl) {
      setAlertMessage("There is no PDF available.");
      return;
    }
    const win = window.open(pdfUrl, "_blank");
    if (!win) {
      setAlertMessage("Please allow pop-ups to print the PDF.");
    }
  };

  const handleConvertAnother = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setPdfBlob(null);
    setFiles([]);
    setOutputFilename("document");
    setAlertMessage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const showDropzone = files.length === 0 && !converting && !pdfBlob;
  const showWorkspace = files.length > 0 && !converting && !pdfBlob;

  return (
    <div className="word-to-pdf1">
      {/* Required Client-Side Conversion Libraries */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js"
        strategy="afterInteractive"
      />

      {/* CONVERTER TOOL SECTION */}
      <section className="word-to-pdf3" id="tools">
        <div className="word-to-pdf4">
          {/* DROPZONE */}
          {showDropzone && (
            <div
              className={`word-to-pdf5 ${isDragOver ? "word-to-pdf6" : ""}`}
              tabIndex={0}
              role="button"
              aria-label="Upload files"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("label") || target.closest("input")) return;
                fileInputRef.current?.click();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
            >
              <div className="word-to-pdf7">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>

              <div className="word-to-pdf8">Drag &amp; Drop your files here</div>
              <p className="word-to-pdf9">or</p>

              <label className="word-to-pdf10" htmlFor="wordToPdfFileInput">
                Choose Files
              </label>

              <input
                ref={fileInputRef}
                type="file"
                id="wordToPdfFileInput"
                accept=".txt,.docx,.doc,.pdf,.rtf,.md,.html,.htm,.csv,.json,.xls,.xlsx"
                multiple
                hidden
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />

              <p className="word-to-pdf11">
                Supported: TXT, DOCX, PDF, RTF, MD, HTML, CSV, JSON, XLS, XLSX
              </p>
            </div>
          )}

          {/* Hidden input for "Add More Files" */}
          <input
            ref={fileInputMoreRef}
            type="file"
            id="wordToPdfFileInputMore"
            accept=".txt,.docx,.doc,.pdf,.rtf,.md,.html,.htm,.csv,.json,.xls,.xlsx"
            multiple
            hidden
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />

          {/* ALERT BANNER */}
          {alertMessage && (
            <div className="word-to-pdf12" role="alert">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{alertMessage}</span>
            </div>
          )}

          {/* WORKSPACE */}
          {showWorkspace && (
            <div className="word-to-pdf13">
              <div className="word-to-pdf14">
                <h2 className="word-to-pdf15">
                  Selected Files ({files.length})
                </h2>

                <div className="word-to-pdf16">
                  <label
                    className="word-to-pdf17"
                    htmlFor="wordToPdfFileInputMore"
                  >
                    Add More Files
                  </label>

                  <button
                    className="word-to-pdf18"
                    type="button"
                    onClick={clearAllFiles}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="word-to-pdf19">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="word-to-pdf20"
                  >
                    <div className="word-to-pdf21">
                      {getExtension(file.name).toUpperCase() || "FILE"}
                    </div>

                    <div className="word-to-pdf22">
                      <div className="word-to-pdf23" title={file.name}>
                        {file.name}
                      </div>
                      <div className="word-to-pdf24">
                        {formatBytes(file.size)}
                      </div>
                    </div>

                    <button
                      className="word-to-pdf25"
                      type="button"
                      title="Remove file"
                      onClick={() => removeFileAt(idx)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* SETTINGS */}
              <div className="word-to-pdf26">
                <div className="word-to-pdf27">
                  <div className="word-to-pdf28">
                    <label
                      className="word-to-pdf29"
                      htmlFor="wordToPdfPageSize"
                    >
                      Page Size
                    </label>
                    <select
                      id="wordToPdfPageSize"
                      className="word-to-pdf30"
                      value={pageSize}
                      onChange={(e) =>
                        handleSettingChange(
                          setPageSize,
                          e.target.value as "a4" | "letter" | "legal"
                        )
                      }
                    >
                      <option value="a4">A4</option>
                      <option value="letter">Letter</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>

                  <div className="word-to-pdf28">
                    <label
                      className="word-to-pdf29"
                      htmlFor="wordToPdfOrientation"
                    >
                      Orientation
                    </label>
                    <select
                      id="wordToPdfOrientation"
                      className="word-to-pdf30"
                      value={orientation}
                      onChange={(e) =>
                        handleSettingChange(
                          setOrientation,
                          e.target.value as "portrait" | "landscape"
                        )
                      }
                    >
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>

                  <div className="word-to-pdf28">
                    <label className="word-to-pdf29" htmlFor="wordToPdfQuality">
                      Quality
                    </label>
                    <select
                      id="wordToPdfQuality"
                      className="word-to-pdf30"
                      value={quality}
                      onChange={(e) =>
                        handleSettingChange(
                          setQuality,
                          e.target.value as "standard" | "high"
                        )
                      }
                    >
                      <option value="standard">Standard</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="word-to-pdf31">
                  <button
                    type="button"
                    className="word-to-pdf32"
                    onClick={() => setAdvancedOpen((prev) => !prev)}
                  >
                    <svg
                      className={`word-to-pdf33 ${
                        advancedOpen ? "word-to-pdf34" : ""
                      }`}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                    Advanced Settings (Document Metadata)
                  </button>
                </div>

                {advancedOpen && (
                  <div className="word-to-pdf35">
                    <div className="word-to-pdf27">
                      <div className="word-to-pdf28">
                        <label
                          className="word-to-pdf29"
                          htmlFor="wordToPdfMetaTitle"
                        >
                          Title
                        </label>
                        <input
                          type="text"
                          id="wordToPdfMetaTitle"
                          className="word-to-pdf30"
                          placeholder="Document Title"
                          value={metaTitle}
                          onChange={(e) => setMetaTitle(e.target.value)}
                        />
                      </div>

                      <div className="word-to-pdf28">
                        <label
                          className="word-to-pdf29"
                          htmlFor="wordToPdfMetaAuthor"
                        >
                          Author
                        </label>
                        <input
                          type="text"
                          id="wordToPdfMetaAuthor"
                          className="word-to-pdf30"
                          placeholder="Author Name"
                          value={metaAuthor}
                          onChange={(e) => setMetaAuthor(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="word-to-pdf36">
                <button
                  className="word-to-pdf37"
                  type="button"
                  disabled={converting}
                  onClick={handleConvert}
                >
                  Convert to PDF
                </button>
              </div>
            </div>
          )}

          {/* PROGRESS PANEL */}
          {converting && (
            <div className="word-to-pdf38">
              <div className="word-to-pdf39" />
              <h3 className="word-to-pdf40">{progressTitle}</h3>
              <p className="word-to-pdf41">{progressStatus}</p>
              <div className="word-to-pdf42">
                <div
                  className="word-to-pdf43"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* RESULT PANEL */}
          {pdfBlob && pdfUrl && !converting && (
            <div className="word-to-pdf44" ref={resultPanelRef}>
              <div className="word-to-pdf45">
                <div className="word-to-pdf46">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <div>
                  <h2 className="word-to-pdf47">Conversion Complete</h2>
                  <p className="word-to-pdf48">
                    Your files have been successfully converted to PDF.
                  </p>
                </div>
              </div>

              <div className="word-to-pdf49">
                <div className="word-to-pdf50">
                  <span className="word-to-pdf51">PDF Quality</span>
                  <span className="word-to-pdf52">{resultQuality}</span>
                </div>

                <div className="word-to-pdf50">
                  <span className="word-to-pdf51">Original Size</span>
                  <span className="word-to-pdf52">{origSize}</span>
                </div>

                <div className="word-to-pdf50">
                  <span className="word-to-pdf51">PDF Size</span>
                  <span className="word-to-pdf52">{pdfSize}</span>
                </div>

                <div className="word-to-pdf50">
                  <span className="word-to-pdf51">Pages</span>
                  <span className="word-to-pdf52">{pageCount}</span>
                </div>
              </div>

              <div className="word-to-pdf53">
                <label
                  className="word-to-pdf29"
                  htmlFor="wordToPdfOutputFilename"
                >
                  Output Filename
                </label>

                <div className="word-to-pdf54">
                  <input
                    type="text"
                    id="wordToPdfOutputFilename"
                    className="word-to-pdf55"
                    value={outputFilename}
                    autoComplete="off"
                    onChange={(e) => setOutputFilename(e.target.value)}
                  />
                  <span className="word-to-pdf56">.pdf</span>
                </div>
              </div>

              {/* PDF PREVIEW */}
              <div className="word-to-pdf57">
                <div className="word-to-pdf58">
                  <span className="word-to-pdf59">PDF Preview</span>

                  <div className="word-to-pdf60">
                    <button
                      className="word-to-pdf61"
                      type="button"
                      title="Zoom Out"
                      onClick={() => setZoom((z) => Math.max(50, z - 10))}
                    >
                      −
                    </button>

                    <span className="word-to-pdf62">{zoom}%</span>

                    <button
                      className="word-to-pdf61"
                      type="button"
                      title="Zoom In"
                      onClick={() => setZoom((z) => Math.min(200, z + 10))}
                    >
                      +
                    </button>

                    <button
                      className="word-to-pdf61"
                      type="button"
                      title="Open in New Tab"
                      onClick={handleOpenNewTab}
                    >
                      ↗
                    </button>
                  </div>
                </div>

                <div className="word-to-pdf63">
                  <iframe
                    className="word-to-pdf64"
                    src={pdfUrl}
                    title="PDF Preview"
                    style={{
                      transform: `scale(${zoom / 100})`,
                      width: `${10000 / zoom}%`,
                    }}
                  />
                </div>
              </div>

              <div className="word-to-pdf65">
                <button
                  className="word-to-pdf37"
                  type="button"
                  onClick={handleDownload}
                >
                  Download PDF
                </button>

                <button
                  className="word-to-pdf66"
                  type="button"
                  onClick={handlePrint}
                >
                  Print
                </button>

                <button
                  className="word-to-pdf66"
                  type="button"
                  onClick={handleConvertAnother}
                >
                  Convert Another
                </button>
              </div>

              <div className="word-to-pdf67">
                <span>🔒</span>
                <span>
                  Files are processed locally in your browser. HTML documents
                  may load external images/CSS if present in the file. Nothing
                  is permanently stored on our servers.
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEO CONTENT & INTERACTIVE ACCORDION FAQ BELOW TOOL */}
      <section className="word-to-pdf71">
        <div className="word-to-pdf72">
          <h1 className="word-to-pdf73">
            Word to PDF Transfer From Conversion Word to PDF Online
          </h1>
          <p className="word-to-pdf74">
            Complete your{" "}
            <strong>word to pdf transfer from conversion word to pdf</strong>{" "}
            effortlessly right inside your browser without uploading private
            files to external servers. Whether you need to convert DOCX reports,
            TXT notes, RTF contracts, Markdown drafts, HTML pages, CSV datasets,
            JSON logs, or Excel spreadsheets into clean, print-ready PDF
            documents, this fast browser-based converter preserves layout
            precision, supports batch file merging, and delivers instant
            downloads for free.
          </p>
        </div>

        <div className="word-to-pdf75">
          <h2 className="word-to-pdf76">
            Frequently Asked Questions About Word to PDF Transfer From
            Conversion Word to PDF
          </h2>

          <div className="word-to-pdf77">
            {wordToPdfFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="word-to-pdf78">
                  <h2
                    className="word-to-pdf79"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleFaq(index);
                      }
                    }}
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`word-to-pdf80 ${
                        isOpen ? "word-to-pdf81" : ""
                      }`}
                    >
                      +
                    </span>
                  </h2>

                  {isOpen && <p className="word-to-pdf82">{faq.answer}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TOAST NOTIFICATION */}
      <div className={`word-to-pdf68 ${toastText ? "word-to-pdf69" : ""}`}>
        <div className="word-to-pdf70">✓</div>
        <span>{toastText || "Download Complete"}</span>
      </div>
    </div>
  );
}