"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "./photo-image-resizer.css";
import { photoImageResizerFaqs } from "./faq";
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_DIMENSION = 16384;

type ViewMode = "after" | "split" | "before";

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const val = bytes / Math.pow(1024, i);
  return `${val < 10 && i > 0 ? val.toFixed(2) : val.toFixed(1)} ${units[i]}`;
}

function mimeToExt(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

function clampDim(val: number): number {
  const n = Math.round(Number(val));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, MAX_DIMENSION);
}

function drawHighQuality(
  sourceImg: HTMLImageElement,
  targetW: number,
  targetH: number,
  fillWhiteBg: boolean
): HTMLCanvasElement {
  let curW = sourceImg.naturalWidth;
  let curH = sourceImg.naturalHeight;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { alpha: !fillWhiteBg });
  if (!ctx) return canvas;

  if (targetW < curW * 0.5 || targetH < curH * 0.5) {
    const stepCanvas = document.createElement("canvas");
    const stepCtx = stepCanvas.getContext("2d");
    if (stepCtx) {
      stepCtx.imageSmoothingEnabled = true;
      stepCtx.imageSmoothingQuality = "high";

      let src: HTMLImageElement | HTMLCanvasElement = sourceImg;
      while (curW * 0.5 > targetW && curH * 0.5 > targetH) {
        const nextW = Math.max(targetW, Math.floor(curW * 0.5));
        const nextH = Math.max(targetH, Math.floor(curH * 0.5));
        stepCanvas.width = nextW;
        stepCanvas.height = nextH;
        stepCtx.clearRect(0, 0, nextW, nextH);
        stepCtx.drawImage(src, 0, 0, nextW, nextH);
        curW = nextW;
        curH = nextH;
        src = stepCanvas;
      }

      canvas.width = targetW;
      canvas.height = targetH;
      if (fillWhiteBg) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetW, targetH);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(src, 0, 0, targetW, targetH);
      return canvas;
    }
  }

  canvas.width = targetW;
  canvas.height = targetH;
  if (fillWhiteBg) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceImg, 0, 0, targetW, targetH);
  return canvas;
}

export default function PhotoImageResizer() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const decodedImgRef = useRef<HTMLImageElement | null>(null);
  const origUrlRef = useRef<string | null>(null);
  const outUrlRef = useRef<string | null>(null);
  const outBlobRef = useRef<Blob | null>(null);
  const renderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderSeqRef = useRef<number>(0);

  const [hasImage, setHasImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [rendering, setRendering] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("after");

  const [baseName, setBaseName] = useState("image");
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [origSize, setOrigSize] = useState(0);
  const [origType, setOrigType] = useState("");
  const [origUrl, setOrigUrl] = useState("");
  const [outUrl, setOutUrl] = useState("");
  const [outMeta, setOutMeta] = useState("—");
  const [canDownload, setCanDownload] = useState(false);

  const [widthInput, setWidthInput] = useState("");
  const [heightInput, setHeightInput] = useState("");
  const [targetWidth, setTargetWidth] = useState(0);
  const [targetHeight, setTargetHeight] = useState(0);
  const [aspectLocked, setAspectLocked] = useState(true);
  const [preset, setPreset] = useState("");
  const [scalePct, setScalePct] = useState(100);
  const [format, setFormat] = useState("image/jpeg");
  const [qualityPct, setQualityPct] = useState(88);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const revokeUrl = useCallback((url: string | null) => {
    if (url) URL.revokeObjectURL(url);
  }, []);

  const performRender = useCallback(
    (w: number, h: number, mime: string, qPct: number, srcSize: number) => {
      const img = decodedImgRef.current;
      if (!img || w < 1 || h < 1) return;

      const seq = ++renderSeqRef.current;
      const quality = mime === "image/png" ? undefined : qPct / 100;
      const fillWhite = mime === "image/jpeg";

      try {
        const canvas = drawHighQuality(img, w, h, fillWhite);
        canvas.toBlob(
          (blob) => {
            if (seq !== renderSeqRef.current) return;
            setRendering(false);

            if (!blob) {
              setErrorMsg(
                "Unable to encode image at the requested dimensions or format."
              );
              return;
            }

            revokeUrl(outUrlRef.current);
            outBlobRef.current = blob;
            const nextUrl = URL.createObjectURL(blob);
            outUrlRef.current = nextUrl;
            setOutUrl(nextUrl);

            const delta = srcSize > 0 ? ((blob.size - srcSize) / srcSize) * 100 : 0;
            const sign = delta > 0 ? "+" : "";
            const ext = mimeToExt(mime).toUpperCase();
            setOutMeta(
              `${w} x ${h} px | ${ext} | ${formatBytes(blob.size)} (${sign}${delta.toFixed(0)}%)`
            );
            setCanDownload(true);
          },
          mime,
          quality
        );
      } catch {
        setRendering(false);
        setErrorMsg(
          "Processing failed due to browser memory limits. Try smaller dimensions."
        );
      }
    },
    [revokeUrl]
  );

  const scheduleRender = useCallback(
    (w: number, h: number, mime: string, qPct: number, srcSize: number) => {
      if (!decodedImgRef.current) return;
      setRendering(true);
      if (renderTimerRef.current) clearTimeout(renderTimerRef.current);
      renderTimerRef.current = setTimeout(() => {
        performRender(w, h, mime, qPct, srcSize);
      }, 90);
    },
    [performRender]
  );

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      setErrorMsg("");
      if (!file) return;

      if (!ALLOWED_TYPES.has(file.type)) {
        setErrorMsg(
          "Unsupported file format. Please upload a JPG, JPEG, PNG, or WebP image."
        );
        return;
      }

      if (file.size > MAX_FILE_BYTES) {
        setErrorMsg(
          `File exceeds the 50 MB limit (${formatBytes(file.size)}).`
        );
        return;
      }

      const tempUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        const natW = img.naturalWidth;
        const natH = img.naturalHeight;

        if (!natW || !natH) {
          revokeUrl(tempUrl);
          setErrorMsg(
            "The selected image appears corrupted or has zero dimensions."
          );
          return;
        }

        if (natW > MAX_DIMENSION || natH > MAX_DIMENSION) {
          revokeUrl(tempUrl);
          setErrorMsg(
            `Image dimensions (${natW} x ${natH}) exceed the maximum supported ${MAX_DIMENSION}px limit.`
          );
          return;
        }

        revokeUrl(origUrlRef.current);
        revokeUrl(outUrlRef.current);

        origUrlRef.current = tempUrl;
        outUrlRef.current = null;
        outBlobRef.current = null;
        decodedImgRef.current = img;

        const cleanName = file.name.replace(/\.[^/.]+$/, "") || "image";
        const initialFormat = ALLOWED_TYPES.has(file.type)
          ? file.type
          : "image/jpeg";

        setBaseName(cleanName);
        setOrigWidth(natW);
        setOrigHeight(natH);
        setOrigSize(file.size);
        setOrigType(file.type);
        setOrigUrl(tempUrl);
        setOutUrl("");
        setCanDownload(false);

        setAspectLocked(true);
        setTargetWidth(natW);
        setTargetHeight(natH);
        setWidthInput(String(natW));
        setHeightInput(String(natH));
        setPreset("");
        setScalePct(100);
        setFormat(initialFormat);
        setHasImage(true);

        scheduleRender(natW, natH, initialFormat, qualityPct, file.size);
      };

      img.onerror = () => {
        revokeUrl(tempUrl);
        setErrorMsg("Could not decode the image file. It may be damaged.");
      };

      img.src = tempUrl;
    },
    [qualityPct, revokeUrl, scheduleRender]
  );

  const handleReset = useCallback(() => {
    const img = decodedImgRef.current;
    if (!img || !origWidth || !origHeight) return;

    const defaultFormat =
      origType && ALLOWED_TYPES.has(origType) ? origType : "image/jpeg";
    const defaultQuality = 88;

    setErrorMsg("");
    setAspectLocked(true);
    setTargetWidth(origWidth);
    setTargetHeight(origHeight);
    setWidthInput(String(origWidth));
    setHeightInput(String(origHeight));
    setPreset("");
    setScalePct(100);
    setFormat(defaultFormat);
    setQualityPct(defaultQuality);

    if (renderTimerRef.current) {
      clearTimeout(renderTimerRef.current);
    }
    setRendering(true);
    performRender(
      origWidth,
      origHeight,
      defaultFormat,
      defaultQuality,
      origSize
    );
  }, [origHeight, origSize, origType, origWidth, performRender]);
  
  const handleWidthChange = (rawVal: string) => {
    setWidthInput(rawVal);
    if (!decodedImgRef.current || !origWidth || !origHeight) return;
    const w = clampDim(Number(rawVal));
    let h = targetHeight;
    setTargetWidth(w);
    if (aspectLocked) {
      const ratio = origHeight / origWidth;
      h = clampDim(w * ratio);
      setTargetHeight(h);
      setHeightInput(String(h));
    }
    setPreset("");
    setScalePct(Math.max(5, Math.min(200, Math.round((w / origWidth) * 100))));
    scheduleRender(w, h, format, qualityPct, origSize);
  };

  const handleHeightChange = (rawVal: string) => {
    setHeightInput(rawVal);
    if (!decodedImgRef.current || !origWidth || !origHeight) return;
    const h = clampDim(Number(rawVal));
    let w = targetWidth;
    setTargetHeight(h);
    if (aspectLocked) {
      const ratio = origWidth / origHeight;
      w = clampDim(h * ratio);
      setTargetWidth(w);
      setWidthInput(String(w));
    }
    setPreset("");
    setScalePct(Math.max(5, Math.min(200, Math.round((h / origHeight) * 100))));
    scheduleRender(w, h, format, qualityPct, origSize);
  };

  const handleAspectToggle = () => {
    const nextLocked = !aspectLocked;
    setAspectLocked(nextLocked);
    if (nextLocked && decodedImgRef.current && origWidth && origHeight) {
      const ratio = origHeight / origWidth;
      const h = clampDim(targetWidth * ratio);
      setTargetHeight(h);
      setHeightInput(String(h));
      scheduleRender(targetWidth, h, format, qualityPct, origSize);
    }
  };

  const handlePresetChange = (val: string) => {
    setPreset(val);
    if (!val || !decodedImgRef.current || !origWidth || !origHeight) return;
    const [pw, ph] = val.split("x").map(Number);

    let nextW: number;
    let nextH: number;
    if (aspectLocked) {
      const scale = Math.min(pw / origWidth, ph / origHeight);
      nextW = clampDim(origWidth * scale);
      nextH = clampDim(origHeight * scale);
    } else {
      nextW = clampDim(pw);
      nextH = clampDim(ph);
    }

    setTargetWidth(nextW);
    setTargetHeight(nextH);
    setWidthInput(String(nextW));
    setHeightInput(String(nextH));
    setScalePct(Math.max(5, Math.min(200, Math.round((nextW / origWidth) * 100))));
    scheduleRender(nextW, nextH, format, qualityPct, origSize);
  };

  const handleScaleChange = (pct: number) => {
    if (!decodedImgRef.current || !origWidth || !origHeight) return;
    const clampedPct = Math.max(5, Math.min(200, Math.round(pct)));
    const factor = clampedPct / 100;
    const nextW = clampDim(origWidth * factor);
    const nextH = clampDim(origHeight * factor);

    setScalePct(clampedPct);
    setTargetWidth(nextW);
    setTargetHeight(nextH);
    setWidthInput(String(nextW));
    setHeightInput(String(nextH));
    setPreset("");
    scheduleRender(nextW, nextH, format, qualityPct, origSize);
  };

  const handleFormatChange = (nextFormat: string) => {
    setFormat(nextFormat);
    if (decodedImgRef.current && targetWidth && targetHeight) {
      scheduleRender(targetWidth, targetHeight, nextFormat, qualityPct, origSize);
    }
  };

  const handleQualityChange = (nextQualityPct: number) => {
    setQualityPct(nextQualityPct);
    if (decodedImgRef.current && targetWidth && targetHeight) {
      scheduleRender(targetWidth, targetHeight, format, nextQualityPct, origSize);
    }
  };

  const handleDownload = () => {
    if (!outUrlRef.current || !outBlobRef.current) return;
    const ext = mimeToExt(format);
    const filename = `${baseName}-${targetWidth}x${targetHeight}.${ext}`;
    const link = document.createElement("a");
    link.href = outUrlRef.current;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  useEffect(() => {
    return () => {
      if (renderTimerRef.current) clearTimeout(renderTimerRef.current);
      revokeUrl(origUrlRef.current);
      revokeUrl(outUrlRef.current);
    };
  }, [revokeUrl]);

  const isLossless = format === "image/png";
  const origMetaText =
    origWidth && origHeight
      ? `${origWidth} x ${origHeight} px | ${mimeToExt(origType).toUpperCase()} | ${formatBytes(origSize)}`
      : "—";

  return (
    <div className="photo-image-resizer1">
      <div className="photo-image-resizer2">
        <header className="photo-image-resizer3">
          <div className="photo-image-resizer4">
            <div className="photo-image-resizer5">Photo Image Resizer</div>
            <span className="photo-image-resizer6">Local Browser Processing</span>
          </div>
          <div className="photo-image-resizer7">
            <label htmlFor="photoFileInput" className="photo-image-resizer57">
              Upload photo or image file
            </label>
            <input
              id="photoFileInput"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload photo or image file"
              className="photo-image-resizer57"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              className="photo-image-resizer54"
              disabled={!hasImage}
              onClick={() => fileInputRef.current?.click()}
            >
              Replace Image
            </button>
            <button
              type="button"
              className="photo-image-resizer54"
              disabled={!hasImage}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </header>

        <div
          className={`photo-image-resizer8 ${errorMsg ? "photo-image-resizer9" : ""}`}
          role="alert"
          aria-live="assertive"
        >
          <span>{errorMsg}</span>
          <button
            type="button"
            className="photo-image-resizer10"
            onClick={() => setErrorMsg("")}
          >
            Dismiss
          </button>
        </div>

        <main className="photo-image-resizer11">
          <section
            className="photo-image-resizer12"
            aria-label="Image Preview Workspace"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer?.files?.[0];
              if (file) handleFile(file);
            }}
          >
            {!hasImage ? (
              <div
                className={`photo-image-resizer13 ${dragActive ? "photo-image-resizer14" : ""}`}
                tabIndex={0}
                role="button"
                aria-label="Upload image by clicking or dragging and dropping"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
              >
                <svg
                  className="photo-image-resizer15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                <p className="photo-image-resizer16">
                  Drop an image here or click to browse
                </p>
                <p className="photo-image-resizer17">
                  Supports JPG, JPEG, PNG, and WebP up to 50 MB. Files remain
                  strictly on your device.
                </p>
                <span className="photo-image-resizer54">Select File</span>
              </div>
            ) : (
              <div className="photo-image-resizer18 photo-image-resizer19">
                <div className="photo-image-resizer20">
                  <div
                    className="photo-image-resizer21"
                    role="tablist"
                    aria-label="Preview comparison mode"
                  >
                    <button
                      type="button"
                      className="photo-image-resizer22"
                      role="tab"
                      aria-selected={viewMode === "after"}
                      onClick={() => setViewMode("after")}
                    >
                      Resized
                    </button>
                    <button
                      type="button"
                      className="photo-image-resizer22"
                      role="tab"
                      aria-selected={viewMode === "split"}
                      onClick={() => setViewMode("split")}
                    >
                      Side-by-Side
                    </button>
                    <button
                      type="button"
                      className="photo-image-resizer22"
                      role="tab"
                      aria-selected={viewMode === "before"}
                      onClick={() => setViewMode("before")}
                    >
                      Original
                    </button>
                  </div>
                  <span
                    className={`photo-image-resizer23 ${rendering ? "photo-image-resizer24" : ""}`}
                    aria-live="polite"
                  >
                    Rendering...
                  </span>
                </div>

                <div className="photo-image-resizer25">
                  <div
                    className={`photo-image-resizer26 ${viewMode === "split" ? "photo-image-resizer29" : ""}`}
                  >
                    <div
                      className={`photo-image-resizer27 ${viewMode === "after" ? "photo-image-resizer28" : ""}`}
                    >
                      <span className="photo-image-resizer30">Original</span>
                      {origUrl ? (
                        <img
                          src={origUrl}
                          className="photo-image-resizer31"
                          alt="Original uploaded image preview"
                        />
                      ) : null}
                    </div>
                    <div
                      className={`photo-image-resizer27 ${viewMode === "before" ? "photo-image-resizer28" : ""}`}
                    >
                      <span className="photo-image-resizer30">Output</span>
                      {outUrl ? (
                        <img
                          src={outUrl}
                          className="photo-image-resizer31"
                          alt="Resized output image preview"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="photo-image-resizer32">
                  <div className="photo-image-resizer33">
                    <span className="photo-image-resizer34">Original File</span>
                    <span className="photo-image-resizer35">
                      {origMetaText}
                    </span>
                  </div>
                  <div className="photo-image-resizer33">
                    <span className="photo-image-resizer34">
                      Estimated Output
                    </span>
                    <span className="photo-image-resizer35">{outMeta}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          <aside
            className={`photo-image-resizer36 ${!hasImage ? "photo-image-resizer37" : ""}`}
            aria-label="Resize and Export Settings"
          >
            <div className="photo-image-resizer38">
              <div className="photo-image-resizer39">Dimensions</div>
              <div className="photo-image-resizer40">
                <div className="photo-image-resizer41">
                  <label
                    htmlFor="photoWidthInput"
                    className="photo-image-resizer43"
                  >
                    Width (px)
                  </label>
                  <input
                    id="photoWidthInput"
                    type="number"
                    min={1}
                    max={16384}
                    step={1}
                    className="photo-image-resizer44"
                    value={widthInput}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    onBlur={() => {
                      if (hasImage) setWidthInput(String(targetWidth));
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="photo-image-resizer46"
                  aria-pressed={aspectLocked}
                  title="Lock aspect ratio"
                  aria-label="Lock aspect ratio"
                  onClick={handleAspectToggle}
                >
                  {aspectLocked ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="11"
                        width="18"
                        height="11"
                        rx="2"
                        ry="2"
                      />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </svg>
                  )}
                </button>

                <div className="photo-image-resizer41">
                  <label
                    htmlFor="photoHeightInput"
                    className="photo-image-resizer43"
                  >
                    Height (px)
                  </label>
                  <input
                    id="photoHeightInput"
                    type="number"
                    min={1}
                    max={16384}
                    step={1}
                    className="photo-image-resizer44"
                    value={heightInput}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    onBlur={() => {
                      if (hasImage) setHeightInput(String(targetHeight));
                    }}
                  />
                </div>
              </div>

              <div className="photo-image-resizer41">
                <label
                  htmlFor="photoPresetSelect"
                  className="photo-image-resizer43"
                >
                  Dimension Presets
                </label>
                <select
                  id="photoPresetSelect"
                  className="photo-image-resizer45"
                  value={preset}
                  onChange={(e) => handlePresetChange(e.target.value)}
                >
                  <option value="">Custom dimensions</option>
                  <option value="3840x2160">4K UHD (3840 x 2160)</option>
                  <option value="1920x1080">Full HD 1080p (1920 x 1080)</option>
                  <option value="1280x720">HD 720p (1280 x 720)</option>
                  <option value="1200x630">
                    Social Open Graph (1200 x 630)
                  </option>
                  <option value="1080x1080">Square Post (1080 x 1080)</option>
                  <option value="1080x1350">Portrait 4:5 (1080 x 1350)</option>
                  <option value="800x600">Web Standard (800 x 600)</option>
                </select>
              </div>
            </div>

            <div className="photo-image-resizer38">
              <div className="photo-image-resizer39">Percentage Scale</div>
              <div
                className="photo-image-resizer47"
                role="group"
                aria-label="Percentage scale shortcuts"
              >
                {[25, 50, 75, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    className={`photo-image-resizer48 ${scalePct === val ? "photo-image-resizer49" : ""}`}
                    onClick={() => handleScaleChange(val)}
                  >
                    {val}%
                  </button>
                ))}
              </div>

              <div className="photo-image-resizer50">
                <label
                  htmlFor="photoScaleSlider"
                  className="photo-image-resizer43"
                >
                  Custom Scale
                </label>
                <span className="photo-image-resizer51">{scalePct}%</span>
              </div>
              <input
                id="photoScaleSlider"
                type="range"
                min={5}
                max={200}
                step={1}
                value={scalePct}
                className="photo-image-resizer52"
                onChange={(e) => handleScaleChange(Number(e.target.value))}
              />
            </div>

            <div className="photo-image-resizer38">
              <div className="photo-image-resizer39">Export Format & Quality</div>
              <div className="photo-image-resizer41 photo-image-resizer42">
                <label
                  htmlFor="photoFormatSelect"
                  className="photo-image-resizer43"
                >
                  Output Format
                </label>
                <select
                  id="photoFormatSelect"
                  className="photo-image-resizer45"
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value)}
                >
                  <option value="image/jpeg">JPG (.jpg)</option>
                  <option value="image/png">PNG (.png — Lossless)</option>
                  <option value="image/webp">WebP (.webp)</option>
                </select>
              </div>

              <div>
                <div className="photo-image-resizer50">
                  <label
                    htmlFor="photoQualitySlider"
                    className="photo-image-resizer43"
                  >
                    Compression Quality
                  </label>
                  <span className="photo-image-resizer51">
                    {isLossless ? "Lossless" : `${qualityPct}%`}
                  </span>
                </div>
                <input
                  id="photoQualitySlider"
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={qualityPct}
                  disabled={isLossless}
                  className="photo-image-resizer52"
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                />
                <p className="photo-image-resizer53">
                  {isLossless
                    ? "PNG uses lossless compression; quality slider does not apply."
                    : "Higher quality preserves detail with a larger file size."}
                </p>
              </div>
            </div>

            <div className="photo-image-resizer56">
              <button
                type="button"
                className="photo-image-resizer54 photo-image-resizer55"
                disabled={!canDownload}
                onClick={handleDownload}
              >
                Download Resized Image
              </button>
            </div>
          </aside>
        </main>
      </div>

      <section
        className="photo-image-resizer58"
        aria-label="Photo Image Resizer Guide and FAQ"
      >
        <div className="photo-image-resizer59">
          <h1 className="photo-image-resizer60">
            Photo Image Resizer — Resize Any Photo or Image Online
          </h1>
          <p className="photo-image-resizer61">
            Use this photo image resizer to adjust the width, height, scale, and
            format of any photo or image directly in your browser without
            uploading files to an external server. Whether you need to shrink
            large camera photos for faster websites, prepare social media
            dimensions, or convert images between JPG, PNG, and WebP, every
            change updates with a live preview and instant download while keeping
            your files private on your device.
          </p>
        </div>
        {/* Internal and External Links */}
<div className="maintenance-1">
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

        <div className="photo-image-resizer62">
          {photoImageResizerFaqs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={item.question} className="photo-image-resizer63">
                <button
                  type="button"
                  className="photo-image-resizer64"
                  aria-expanded={isOpen}
                  onClick={() => toggleFaq(idx)}
                >
                  <h2 className="photo-image-resizer65">{item.question}</h2>
                  <span className="photo-image-resizer66" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`photo-image-resizer67 ${isOpen ? "photo-image-resizer68" : ""}`}
                >
                  <p className="photo-image-resizer69">{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}