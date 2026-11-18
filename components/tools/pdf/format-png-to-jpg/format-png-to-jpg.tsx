"use client";

import React, { useState, useRef, useEffect } from "react";
import "./format-png-to-jpg.css";
import { formatPngToJpgFaqs } from "./faq";
import DOMPurify from "isomorphic-dompurify";

type OutputFormat = "jpg" | "png" | "webp" | "jpeg";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

interface ConvertedResult {
  blob: Blob;
  name: string;
}

interface OverlayState {
  visible: boolean;
  title: string;
  subtitle: string;
  percent: number;
  status: string;
  isDone: boolean;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, index);
  return `${value < 10 && index > 0 ? value.toFixed(2) : value.toFixed(1)} ${units[index]}`;
}

function getMimeType(format: OutputFormat): string {
  switch (format) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

function createOutputName(originalName: string, format: OutputFormat): string {
  const lastDot = originalName.lastIndexOf(".");
  const baseName =
    lastDot > 0 ? originalName.substring(0, lastDot) : originalName;
  return `${baseName}.${format.toLowerCase()}`;
}

function isImageFile(file: File): boolean {
  if (!file) return false;
  if (file.type && file.type.startsWith("image/")) return true;
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return ["jpg", "jpeg", "png", "webp"].includes(extension);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Unable to read image."));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Image conversion failed."));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

export default function FormatPngToJpgTool() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [results, setResults] = useState<Record<string, ConvertedResult>>({});
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("jpg");
  const [widthInput, setWidthInput] = useState<string>("");
  const [heightInput, setHeightInput] = useState<string>("");
  const [converting, setConverting] = useState<boolean>(false);
  const [isConverted, setIsConverted] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [overlay, setOverlay] = useState<OverlayState>({
    visible: false,
    title: "Processing Images...",
    subtitle: "Please wait while we process your request.",
    percent: 0,
    status: "Preparing...",
    isDone: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const itemsRef = useRef<ImageItem[]>(items);
  itemsRef.current = items;

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const showProgressOverlay = (title: string, subtitle: string) => {
    setOverlay({
      visible: true,
      title: title || "Processing...",
      subtitle: subtitle || "Please wait...",
      percent: 0,
      status: "Starting...",
      isDone: false,
    });
  };

  const updateProgressOverlay = (
    percent: number,
    statusText?: string,
    isDone = false
  ) => {
    const rounded = Math.min(100, Math.max(0, Math.round(percent)));
    setOverlay((prev) => ({
      ...prev,
      percent: rounded,
      status: statusText || prev.status,
      isDone,
    }));
  };

  const hideProgressOverlay = () => {
    setOverlay((prev) => ({ ...prev, visible: false }));
  };

  const resetConversionState = () => {
    setIsConverted(false);
    setResults({});
  };

  const addFiles = async (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const incoming = Array.from(fileList);

    showProgressOverlay("Uploading Images", "Reading file data...");

    const validNewItems: ImageItem[] = [];
    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];
      if (isImageFile(file)) {
        const duplicate =
          items.some(
            (existing) =>
              existing.file.name === file.name &&
              existing.file.size === file.size &&
              existing.file.lastModified === file.lastModified
          ) ||
          validNewItems.some(
            (existing) =>
              existing.file.name === file.name &&
              existing.file.size === file.size &&
              existing.file.lastModified === file.lastModified
          );

        if (!duplicate) {
          validNewItems.push({
            id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
              .toString(36)
              .slice(2, 9)}`,
            file,
            previewUrl: URL.createObjectURL(file),
          });
        }
      }
      const percent = ((i + 1) / incoming.length) * 100;
      updateProgressOverlay(percent, `Uploaded ${i + 1} of ${incoming.length}`);
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    if (validNewItems.length > 0) {
      setItems((prev) => [...prev, ...validNewItems]);
      resetConversionState();
    }

    updateProgressOverlay(100, "Upload Completed!", true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    hideProgressOverlay();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer?.files) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFormatChange = (format: OutputFormat) => {
    if (converting) return;
    setOutputFormat(format);
    resetConversionState();
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidthInput(e.target.value);
    resetConversionState();
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeightInput(e.target.value);
    resetConversionState();
  };

  const removeFile = (id: string) => {
    if (converting) return;
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setIsConverted(false);
  };

  const calculateDimensions = (
    originalWidth: number,
    originalHeight: number
  ) => {
    const requestedWidth = parseInt(widthInput, 10);
    const requestedHeight = parseInt(heightInput, 10);
    const hasWidth = Number.isFinite(requestedWidth) && requestedWidth > 0;
    const hasHeight = Number.isFinite(requestedHeight) && requestedHeight > 0;

    if (!hasWidth && !hasHeight) {
      return { width: originalWidth, height: originalHeight };
    }
    if (hasWidth && hasHeight) {
      return { width: requestedWidth, height: requestedHeight };
    }
    if (hasWidth) {
      const ratio = originalHeight / originalWidth;
      return {
        width: requestedWidth,
        height: Math.max(1, Math.round(requestedWidth * ratio)),
      };
    }
    const ratio = originalWidth / originalHeight;
    return {
      width: Math.max(1, Math.round(requestedHeight * ratio)),
      height: requestedHeight,
    };
  };

  const convertSingleImage = async (file: File): Promise<ConvertedResult> => {
    const img = await loadImage(file);
    const dimensions = calculateDimensions(
      img.naturalWidth || img.width,
      img.naturalHeight || img.height
    );

    const canvas = document.createElement("canvas");
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: false,
    });
    if (!ctx) throw new Error("Canvas is not supported.");

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    if (outputFormat === "jpg" || outputFormat === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
    const mime = getMimeType(outputFormat);

    if (outputFormat === "png") {
      const blob = await canvasToBlob(canvas, "image/png");
      return { blob, name: createOutputName(file.name, outputFormat) };
    }

    if (outputFormat === "webp") {
      const blob = await canvasToBlob(canvas, "image/webp", 0.85);
      return { blob, name: createOutputName(file.name, outputFormat) };
    }

    const blob = await canvasToBlob(canvas, mime, 0.88);
    return { blob, name: createOutputName(file.name, outputFormat) };
  };

  const convertAll = async () => {
    if (converting || items.length === 0) return;
    setConverting(true);

    showProgressOverlay(
      "Converting Images...",
      "Optimizing & formatting your images"
    );
    const newResults: Record<string, ConvertedResult> = {};
    const total = items.length;

    for (let i = 0; i < total; i++) {
      const item = items[i];
      const percent = Math.round((i / total) * 100);
      updateProgressOverlay(
        percent,
        `Converting ${i + 1} of ${total}: ${item.file.name}`
      );

      try {
        const result = await convertSingleImage(item.file);
        newResults[item.id] = result;
      } catch (error) {
        console.error(`Conversion failed for ${item.file.name}:`, error);
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setResults(newResults);
    updateProgressOverlay(100, "All Images Converted Successfully!", true);

    await new Promise((resolve) => setTimeout(resolve, 600));
    hideProgressOverlay();

    setConverting(false);
    setIsConverted(true);
  };

  const downloadResult = async (result: ConvertedResult) => {
    if (!result || !result.blob) return;

    showProgressOverlay("Downloading File...", "Preparing image for save");
    updateProgressOverlay(50, "Generating link...");

    await new Promise((resolve) => setTimeout(resolve, 200));

    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = result.name;
    document.body.appendChild(link);
    link.click();
    link.remove();

    updateProgressOverlay(100, "Download Completed Successfully!", true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    hideProgressOverlay();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const downloadAll = async () => {
    const resultValues = items
      .map((item) => results[item.id])
      .filter((r): r is ConvertedResult => Boolean(r));

    if (resultValues.length <= 1) return;

    showProgressOverlay(
      "Downloading All Images...",
      "Saving files to your device"
    );

    for (let i = 0; i < resultValues.length; i++) {
      const percent = Math.round(((i + 1) / resultValues.length) * 100);
      updateProgressOverlay(
        percent,
        `Downloaded ${i + 1} of ${resultValues.length}: ${resultValues[i].name}`
      );

      const url = URL.createObjectURL(resultValues[i].blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = resultValues[i].name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    updateProgressOverlay(100, "All Downloads Completed Successfully!", true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    hideProgressOverlay();
  };

  const resetAll = () => {
    if (converting) return;
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setResults({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setWidthInput("");
    setHeightInput("");
    setOutputFormat("jpg");
    setIsConverted(false);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const hasFiles = items.length > 0;
  const convertedCount = Object.keys(results).length;
  const showDownloadAll = items.length > 1 && convertedCount > 1;
  const formats: OutputFormat[] = ["jpg", "png", "webp", "jpeg"];

  return (
    <div className="png-to-jpg1">
      <div className="png-to-jpg2">
        {/* Upload Area */}
        <section
          className={`png-to-jpg3 ${isDragOver ? "png-to-jpg4" : ""}`}
          onDragEnter={handleDragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="png-to-jpg5">⬆</div>
          <div className="png-to-jpg6">Drag &amp; Drop images here or browse</div>
          <p className="png-to-jpg7">Upload one or multiple images to begin</p>
          <button
            type="button"
            className="png-to-jpg8"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Images
          </button>
        <input
            ref={fileInputRef}
            type="file"
            id="formatPngToJpgFileInput"
            aria-label="Upload image files to convert"
            className="png-to-jpg9"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            onChange={handleFileChange}
          />
        </section>

        {/* Controls */}
        {hasFiles && (
          <section className="png-to-jpg10">
            <div className="png-to-jpg11">
              <div className="png-to-jpg12">
                <h3 className="png-to-jpg13">Output Format</h3>
                <div className="png-to-jpg14">
                  {formats.map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      className={`png-to-jpg15 ${
                        outputFormat === fmt ? "png-to-jpg16" : ""
                      }`}
                      onClick={() => handleFormatChange(fmt)}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="png-to-jpg12">
                <h3 className="png-to-jpg13">Custom Dimensions</h3>
                <div className="png-to-jpg17">
                  <div className="png-to-jpg18">
                    <label htmlFor="pngToJpgWidthInput">Width</label>
                    <input
                      id="pngToJpgWidthInput"
                      type="number"
                      min={1}
                      placeholder="Auto"
                      value={widthInput}
                      onChange={handleWidthChange}
                    />
                  </div>
                  <div className="png-to-jpg18">
                    <label htmlFor="pngToJpgHeightInput">Height</label>
                    <input
                      id="pngToJpgHeightInput"
                      type="number"
                      min={1}
                      placeholder="Auto"
                      value={heightInput}
                      onChange={handleHeightChange}
                    />
                  </div>
                </div>
                <p className="png-to-jpg19">
                  Leave both fields empty to keep the original dimensions.
                </p>
              </div>
            </div>

            <div className="png-to-jpg20">
              <button
                type="button"
                className="png-to-jpg21"
                disabled={converting}
                onClick={() => fileInputRef.current?.click()}
              >
                + Add More Images
              </button>
            </div>
          </section>
        )}

        {/* Image List */}
        {hasFiles && (
          <section className="png-to-jpg22">
            <div className="png-to-jpg23">
              <h2 className="png-to-jpg24">Images</h2>
              <span className="png-to-jpg25">
                {items.length} {items.length === 1 ? "image" : "images"}
              </span>
            </div>

            <div className="png-to-jpg26">
              {items.map((item) => {
                const currentResult = results[item.id];
                const ext =
                  item.file.name.split(".").pop()?.toUpperCase() || "IMAGE";

                return (
                  <article key={item.id} className="png-to-jpg27">
                    <div className="png-to-jpg28">
                      <img
                        src={item.previewUrl}
                        alt={item.file.name}
                        className="png-to-jpg29"
                        loading="lazy"
                      />
                    </div>

                    <div className="png-to-jpg30">
                      <div className="png-to-jpg31" title={item.file.name}>
                        {item.file.name}
                      </div>

                      <div className="png-to-jpg32">
                        <span className="png-to-jpg33">{ext}</span>
                        <span>{formatBytes(item.file.size)}</span>

                        {currentResult && (
                          <>
                            <span className="png-to-jpg34">→</span>
                            <span className="png-to-jpg33">
                              {outputFormat.toUpperCase()}
                            </span>
                            <span className="png-to-jpg35">
                              {formatBytes(currentResult.blob.size)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="png-to-jpg36">
                      <button
                        type="button"
                        className="png-to-jpg37"
                        disabled={!currentResult}
                        onClick={() =>
                          currentResult && downloadResult(currentResult)
                        }
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        className="png-to-jpg38"
                        onClick={() => removeFile(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Actions */}
        {hasFiles && (
          <div className="png-to-jpg39">
            <button
              type="button"
              className="png-to-jpg40 png-to-jpg41"
              disabled={converting}
              onClick={resetAll}
            >
              {items.length > 1 ? "Reset All" : "Reset"}
            </button>

            {showDownloadAll && (
              <button
                type="button"
                className="png-to-jpg40 png-to-jpg43"
                onClick={downloadAll}
              >
                Download All
              </button>
            )}

            {!isConverted && (
              <button
                type="button"
                className="png-to-jpg40 png-to-jpg42"
                disabled={converting}
                onClick={convertAll}
              >
                {items.length > 1 ? "Convert All" : "Convert"}
              </button>
            )}
          </div>
        )}

        {/* Below Tool: H1 Main Heading + First Paragraph (Introduction) */}
        <section className="png-to-jpg56">
          <h1 className="png-to-jpg57">
            Format PNG to JPG Online – Free Batch Image Converter Tool
          </h1>
          <p className="png-to-jpg58">
            Need a quick, reliable way to format PNG to JPG without losing visual
            sharpness or uploading private files to unknown servers? Our free
            online image converter lets you transform single or multiple PNG
            pictures into lightweight, web-ready JPG files directly inside your
            browser. Whether you are optimizing screenshots for email, shrinking
            large product photos for faster website loading, or customizing pixel
            dimensions before publishing, this batch converter handles everything
            instantly with automatic white background replacement and zero
            watermarks.
          </p>
        </section>
        {/* Internal and External Links */}
<div className="maintenance-links">
  <p>
    You may also find these useful tools and guides:
  </p>

  <p
    dangerouslySetInnerHTML={{
      __html: DOMPurify.sanitize(`
        <a href="/pdf-to-image">How to Convert pdf to image</a>
        <a href="/image-to-pdf">Converted Image to pdf</a>
      `)
    }}
  />

  <p>
    For Related Ai To Png, visit the
    <a href="https://polotno.com/tools/ai-to-png" target="_blank" rel="noopener noreferrer">
      polotno
    </a>.
  </p>
</div>


        {/* Below Intro: Interactive Accordion FAQ Section with H2 */}
        <section className="png-to-jpg59">
          <h2 className="png-to-jpg60">
            Frequently Asked Questions About How to Format PNG to JPG
          </h2>

          <div className="png-to-jpg61">
            {formatPngToJpgFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`png-to-jpg62 ${isOpen ? "png-to-jpg63" : ""}`}
                >
                  <button
                    type="button"
                    className="png-to-jpg64"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaq(index)}
                  >
                    <h2>{faq.question}</h2>
                    <span className="png-to-jpg65">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="png-to-jpg66">{faq.answer}</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Fullscreen Overlay Progress Modal */}
      <div
        className={`png-to-jpg44 ${overlay.visible ? "png-to-jpg45" : ""}`}
      >
        <div className="png-to-jpg46">
          <div
            className={`png-to-jpg47 ${overlay.isDone ? "png-to-jpg48" : ""}`}
          />
          <h3 className="png-to-jpg49">{overlay.title}</h3>
          <p className="png-to-jpg50">{overlay.subtitle}</p>

          <div className="png-to-jpg51">
            <div
              className={`png-to-jpg52 ${
                overlay.isDone ? "png-to-jpg53" : ""
              }`}
              style={{ width: `${overlay.percent}%` }}
            />
          </div>

          <div className="png-to-jpg54">
            <span className="png-to-jpg55">{overlay.status}</span>
            <span>{overlay.percent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}