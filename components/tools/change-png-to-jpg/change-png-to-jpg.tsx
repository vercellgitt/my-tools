"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  DragEvent,
  ChangeEvent,
} from "react";

import { changePngToJpgConfig } from "./faq";
import "./change-png-to-jpg.css";

interface ConvertedResult {
  blob: Blob;
  name: string;
}

interface ChangePngToJpgProps {
  slug: string;
}

interface ProgressState {
  show: boolean;
  title: string;
  subtitle: string;
  percent: number;
  statusText: string;
  isDone: boolean;
}

export default function ChangePngToJpg({
  slug,
}: ChangePngToJpgProps) {

  // Current SEO Content
  const currentContent =
    changePngToJpgConfig[slug] ||
    changePngToJpgConfig["change-png-to-jpg"];

  const [files, setFiles] = useState<File[]>([]);

  const [results, setResults] = useState<
    Map<File, ConvertedResult>
  >(() => new Map<File, ConvertedResult>());

  const [outputFormat, setOutputFormat] =
    useState<string>("jpg");

  const [converting, setConverting] =
    useState<boolean>(false);

  const [isConverted, setIsConverted] =
    useState<boolean>(false);

  const [widthVal, setWidthVal] =
    useState<string>("");

  const [heightVal, setHeightVal] =
    useState<string>("");

  const [progressState, setProgressState] =
    useState<ProgressState>({
      show: false,
      title: "",
      subtitle: "",
      percent: 0,
      statusText: "",
      isDone: false,
    });

  const [openFaqIndex, setOpenFaqIndex] =
    useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image Preview URLs
  const previewUrls = useMemo(() => {
    return files.map((file) =>
      URL.createObjectURL(file)
    );
  }, [files]);

  // Cleanup Object URLs
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) =>
        URL.revokeObjectURL(url)
      );
    };
  }, [previewUrls]);

  // Progress Overlay
  const showProgressOverlay = (
    title: string,
    subtitle: string
  ) => {
    setProgressState({
      show: true,
      title: title || "Processing...",
      subtitle: subtitle || "Please wait...",
      percent: 0,
      statusText: "Starting...",
      isDone: false,
    });
  };

  const updateProgressOverlay = (
    percent: number,
    statusText: string,
    isDone = false
  ) => {
    const rounded = Math.min(
      100,
      Math.max(0, Math.round(percent))
    );

    setProgressState((prev) => ({
      ...prev,
      percent: rounded,
      statusText: statusText || prev.statusText,
      isDone,
    }));
  };

  const hideProgressOverlay = () => {
    setProgressState((prev) => ({
      ...prev,
      show: false,
    }));
  };

  // Reset Conversion Results
  const notifySettingsChange = () => {
    setIsConverted(false);
    setResults(new Map<File, ConvertedResult>());
  };

  // Format File Size
  const formatBytes = (bytes: number): string => {
    if (!Number.isFinite(bytes) || bytes <= 0) {
      return "0 B";
    }

    const units = ["B", "KB", "MB", "GB"];

    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

    const value = bytes / Math.pow(1024, index);

    return `${
      value < 10 && index > 0
        ? value.toFixed(2)
        : value.toFixed(1)
    } ${units[index]}`;
  };

  // Get Extension
  const getExtension = (format: string): string => {
    return format.toLowerCase();
  };

  // Get MIME Type
  const getMimeType = (format: string): string => {
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
  };

  // Create Output File Name
  const createOutputName = (
    originalName: string,
    format: string
  ): string => {
    const lastDot = originalName.lastIndexOf(".");

    const baseName =
      lastDot > 0
        ? originalName.substring(0, lastDot)
        : originalName;

    return `${baseName}.${getExtension(format)}`;
  };

  // Validate Image Files
  const isImageFile = (file: File): boolean => {
    if (!file) return false;

    if (file.type && file.type.startsWith("image/")) {
      return [
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type);
    }

    const extension = file.name
      .split(".")
      .pop()
      ?.toLowerCase();

    return [
      "jpg",
      "jpeg",
      "png",
      "webp",
    ].includes(extension || "");
  };

  // Add Files
  const addFiles = async (
    fileList: FileList | null
  ) => {
    if (!fileList || !fileList.length) return;
    if (converting) return;

    const incoming = Array.from(fileList);

    showProgressOverlay(
      "Uploading Images",
      "Reading file data..."
    );

    const validFiles: File[] = [];

    for (let i = 0; i < incoming.length; i++) {
      const file = incoming[i];

      if (isImageFile(file)) {
        const duplicate = files.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!duplicate) {
          validFiles.push(file);
        }
      }

      const percent =
        ((i + 1) / incoming.length) * 100;

      updateProgressOverlay(
        percent,
        `Uploaded ${i + 1} of ${incoming.length}`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 30)
      );
    }

    setFiles((prev) => [...prev, ...validFiles]);

    notifySettingsChange();

    updateProgressOverlay(
      100,
      "Upload Completed!",
      true
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 400)
    );

    hideProgressOverlay();
  };

  // Remove File
  const removeFile = (index: number) => {
    if (converting) return;

    const file = files[index];

    if (file) {
      setResults((prev) => {
        const updated = new Map(prev);
        updated.delete(file);
        return updated;
      });
    }

    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setIsConverted(false);
  };

  // Load Image
  const loadImage = (
    file: File
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(
          new Error("Unable to read image.")
        );
      };

      img.src = url;
    });
  };

  // Calculate Dimensions
  const calculateDimensions = (
    originalWidth: number,
    originalHeight: number
  ) => {
    const requestedWidth = parseInt(widthVal, 10);
    const requestedHeight = parseInt(heightVal, 10);

    const hasWidth =
      Number.isFinite(requestedWidth) &&
      requestedWidth > 0;

    const hasHeight =
      Number.isFinite(requestedHeight) &&
      requestedHeight > 0;

    if (!hasWidth && !hasHeight) {
      return {
        width: originalWidth,
        height: originalHeight,
      };
    }

    if (hasWidth && hasHeight) {
      return {
        width: requestedWidth,
        height: requestedHeight,
      };
    }

    if (hasWidth) {
      const ratio = originalHeight / originalWidth;

      return {
        width: requestedWidth,
        height: Math.max(
          1,
          Math.round(requestedWidth * ratio)
        ),
      };
    }

    const ratio = originalWidth / originalHeight;

    return {
      width: Math.max(
        1,
        Math.round(requestedHeight * ratio)
      ),
      height: requestedHeight,
    };
  };

  // Canvas To Blob
  const canvasToBlob = (
    canvas: HTMLCanvasElement,
    type: string,
    quality?: number
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(
              new Error("Image conversion failed.")
            );
            return;
          }

          resolve(blob);
        },
        type,
        quality
      );
    });
  };

  // Convert Single Image
  const convertImage = async (
    file: File
  ): Promise<ConvertedResult> => {
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
    });

    if (!ctx) {
      throw new Error("Canvas is not supported.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // White Background For JPG/JPEG
    if (
      outputFormat === "jpg" ||
      outputFormat === "jpeg"
    ) {
      ctx.fillStyle = "#ffffff";

      ctx.fillRect(
        0,
        0,
        dimensions.width,
        dimensions.height
      );
    }

    ctx.drawImage(
      img,
      0,
      0,
      dimensions.width,
      dimensions.height
    );

    const mime = getMimeType(outputFormat);

    let blob: Blob;

    if (outputFormat === "png") {
      blob = await canvasToBlob(
        canvas,
        "image/png"
      );
    } else if (outputFormat === "webp") {
      blob = await canvasToBlob(
        canvas,
        "image/webp",
        0.85
      );
    } else {
      blob = await canvasToBlob(
        canvas,
        mime,
        0.88
      );
    }

    return {
      blob,
      name: createOutputName(
        file.name,
        outputFormat
      ),
    };
  };

  // Convert All Images
  const convertAll = async () => {
    if (converting || files.length === 0) {
      return;
    }

    setConverting(true);

    showProgressOverlay(
      "Converting Images...",
      "Optimizing & formatting your images"
    );

    const newResults = new Map<
      File,
      ConvertedResult
    >();

    const total = files.length;

    try {
      for (let i = 0; i < total; i++) {
        const file = files[i];

        const percent = Math.round(
          (i / total) * 100
        );

        updateProgressOverlay(
          percent,
          `Converting ${i + 1} of ${total}: ${file.name}`
        );

        try {
          const res = await convertImage(file);
          newResults.set(file, res);
        } catch (error) {
          console.error(
            `Conversion failed for ${file.name}:`,
            error
          );
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 50)
        );
      }

      setResults(newResults);

      updateProgressOverlay(
        100,
        "Conversion Process Completed!",
        true
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 600)
      );

      setIsConverted(true);

    } finally {
      setConverting(false);
      hideProgressOverlay();
    }
  };

  // Download Single Image
  const downloadResult = async (
    result: ConvertedResult
  ) => {
    if (!result || !result.blob) return;

    showProgressOverlay(
      "Downloading File...",
      "Preparing image for save"
    );

    updateProgressOverlay(
      50,
      "Generating link..."
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 200)
    );

    const url = URL.createObjectURL(result.blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = result.name;

    document.body.appendChild(link);

    link.click();
    link.remove();

    updateProgressOverlay(
      100,
      "Download Completed Successfully!",
      true
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    hideProgressOverlay();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  // Download All Images
  const downloadAll = async () => {
    const resArr: ConvertedResult[] =
      Array.from(results.values());

    if (resArr.length <= 1) return;

    showProgressOverlay(
      "Downloading All Images...",
      "Saving files to your device"
    );

    for (let i = 0; i < resArr.length; i++) {
      const result = resArr[i];

      const percent = Math.round(
        ((i + 1) / resArr.length) * 100
      );

      updateProgressOverlay(
        percent,
        `Downloaded ${i + 1} of ${resArr.length}: ${result.name}`
      );

      const url = URL.createObjectURL(
        result.blob
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = result.name;

      document.body.appendChild(link);

      link.click();
      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );
    }

    updateProgressOverlay(
      100,
      "All Downloads Completed Successfully!",
      true
    );

    await new Promise((resolve) =>
      setTimeout(resolve, 800)
    );

    hideProgressOverlay();
  };

  // Reset All
  const resetAll = () => {
    if (converting) return;

    setFiles([]);

    setResults(
      new Map<File, ConvertedResult>()
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setWidthVal("");
    setHeightVal("");
    setOutputFormat("jpg");
    setIsConverted(false);
    setOpenFaqIndex(null);
  };

  return (
    <div className="converter-wrapper">

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: currentContent.metaTitle,
            operatingSystem: "All",
            applicationCategory: "UtilitiesApplication",
            description:
              currentContent.metaDescription,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      <div className="converter-container">

        {/* Header */}
        <header className="converter-header">
          <h1>{currentContent.h1Title}</h1>

          <div className="converter-intro">
            <p>{currentContent.introText}</p>
          </div>
        </header>

        {/* Upload Area */}
        <section
          className="converter-upload-area"
          onDragOver={(
            e: DragEvent<HTMLElement>
          ) => {
            e.preventDefault();
            e.stopPropagation();

            e.currentTarget.classList.add(
              "dragover"
            );
          }}
          onDragLeave={(
            e: DragEvent<HTMLElement>
          ) => {
            e.preventDefault();
            e.stopPropagation();

            e.currentTarget.classList.remove(
              "dragover"
            );
          }}
          onDrop={(
            e: DragEvent<HTMLElement>
          ) => {
            e.preventDefault();
            e.stopPropagation();

            e.currentTarget.classList.remove(
              "dragover"
            );

            addFiles(
              e.dataTransfer?.files || null
            );
          }}
        >
          <div className="converter-upload-icon">
            ⬆
          </div>

          <h2>
            Drag &amp; Drop images here or browse
          </h2>

          <p>
            Upload one or multiple images to begin
          </p>

          <button
            type="button"
            className="converter-browse-btn"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            Browse Images
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="converter-file-input"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            multiple
            onChange={(
              e: ChangeEvent<HTMLInputElement>
            ) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </section>

        {/* Controls */}
        <section
          className={`converter-controls ${
            files.length > 0 ? "show" : ""
          }`}
        >
          <div className="converter-control-grid">

            {/* Output Format */}
            <div className="converter-control-box">
              <h3>Output Format</h3>

              <div className="converter-format-buttons">
                {["jpg", "png", "webp", "jpeg"].map(
                  (fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      className={`converter-format-btn ${
                        outputFormat === fmt
                          ? "active"
                          : ""
                      }`}
                      onClick={() => {
                        if (!converting) {
                          setOutputFormat(fmt);
                          notifySettingsChange();
                        }
                      }}
                    >
                      {fmt.toUpperCase()}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Custom Dimensions */}
            <div className="converter-control-box">
              <h3>Custom Dimensions</h3>

              <div className="converter-dimension-row">

                <div className="converter-input-group">
                  <label>Width</label>

                  <input
                    type="number"
                    min="1"
                    placeholder="Auto"
                    value={widthVal}
                    disabled={converting}
                    onChange={(
                      e: ChangeEvent<HTMLInputElement>
                    ) => {
                      setWidthVal(e.target.value);
                      notifySettingsChange();
                    }}
                  />
                </div>

                <div className="converter-input-group">
                  <label>Height</label>

                  <input
                    type="number"
                    min="1"
                    placeholder="Auto"
                    value={heightVal}
                    disabled={converting}
                    onChange={(
                      e: ChangeEvent<HTMLInputElement>
                    ) => {
                      setHeightVal(e.target.value);
                      notifySettingsChange();
                    }}
                  />
                </div>

              </div>

              <p className="converter-dimension-note">
                Leave both fields empty to keep original dimensions.
              </p>
            </div>
          </div>

          <div className="converter-add-more">
            <button
              type="button"
              className="converter-add-more-btn"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={converting}
            >
              + Add More Images
            </button>
          </div>
        </section>

        {/* Image List */}
        <section
          className={`converter-image-list ${
            files.length > 0 ? "show" : ""
          }`}
        >
          <div className="converter-image-list-header">
            <h2>Images</h2>

            <span className="converter-image-count">
              {files.length}{" "}
              {files.length === 1
                ? "image"
                : "images"}
            </span>
          </div>

          <div className="converter-images-grid">
            {files.map((file, index) => {
              const currentRes = results.get(file);

              return (
                <article
                  key={`${file.name}-${file.lastModified}-${index}`}
                  className="converter-image-card"
                >
                  <div className="converter-preview">
                    <img
                      src={previewUrls[index]}
                      alt={file.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="converter-file-info">
                    <div
                      className="converter-file-name"
                      title={file.name}
                    >
                      {file.name}
                    </div>

                    <div className="converter-file-meta">
                      <span className="converter-extension">
                        {file.name
                          .split(".")
                          .pop()
                          ?.toUpperCase() || "IMAGE"}
                      </span>

                      <span>
                        {formatBytes(file.size)}
                      </span>

                      {currentRes && (
                        <>
                          <span className="converter-arrow">
                            →
                          </span>

                          <span className="converter-extension">
                            {outputFormat.toUpperCase()}
                          </span>

                          <span className="converter-output-meta">
                            {formatBytes(
                              currentRes.blob.size
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="converter-card-actions">
                    <button
                      type="button"
                      className="converter-download-btn"
                      disabled={!currentRes || converting}
                      style={{
                        opacity: !currentRes ? 0.5 : 1,
                        cursor: !currentRes
                          ? "not-allowed"
                          : "pointer",
                      }}
                      onClick={() => {
                        if (currentRes) {
                          downloadResult(currentRes);
                        }
                      }}
                    >
                      Download
                    </button>

                    <button
                      type="button"
                      className="converter-remove-btn"
                      onClick={() =>
                        removeFile(index)
                      }
                      disabled={converting}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Bottom Actions */}
        <div
          className={`converter-bottom-actions ${
            files.length > 0 ? "show" : ""
          }`}
        >
          <button
            type="button"
            className="converter-action-btn converter-reset-btn"
            onClick={resetAll}
            disabled={converting}
          >
            {files.length > 1
              ? "Reset All"
              : "Reset"}
          </button>

          {files.length > 1 && results.size > 1 && (
            <button
              type="button"
              className="converter-action-btn converter-download-all-btn"
              onClick={downloadAll}
              disabled={converting}
            >
              Download All
            </button>
          )}

          {!isConverted && (
            <button
              type="button"
              className="converter-action-btn converter-convert-btn"
              onClick={convertAll}
              disabled={
                converting || files.length === 0
              }
            >
              {files.length > 1
                ? "Convert All"
                : "Convert"}
            </button>
          )}
        </div>

        {/* SEO Article Section */}
        <section className="converter-article-section">
          <h2>{currentContent.article.title}</h2>

          {currentContent.article.sections.map(
            (section, index) => {
              const Heading =
                section.level === "h2"
                  ? "h2"
                  : section.level === "h3"
                  ? "h3"
                  : "h4";

              return (
                <div key={index}>
                  <Heading>
                    {section.heading}
                  </Heading>

                  <p>{section.content}</p>
                </div>
              );
            }
          )}
        </section>

        {/* FAQ Section */}
        <section className="converter-faq-section">
          <h2>
            Frequently Asked Questions
          </h2>

          {currentContent.faqs.map(
            (faq, index) => {
              const isOpen =
                openFaqIndex === index;

              return (
                <div
                  key={index}
                  className="converter-faq-item"
                >
                  <button
                    type="button"
                    className="converter-faq-question"
                    onClick={() =>
                      setOpenFaqIndex(
                        isOpen ? null : index
                      )
                    }
                  >
                    <span>
                      {faq.question}
                    </span>

                    <span>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  <div
                    className={`converter-faq-answer ${
                      isOpen ? "open" : ""
                    }`}
                  >
                    {faq.answer}
                  </div>
                </div>
              );
            }
          )}
        </section>

      </div>

      {/* Fullscreen Progress Overlay */}
      <div
        className={`converter-fullscreen-progress-overlay ${
          progressState.show ? "show" : ""
        }`}
      >
        <div className="converter-progress-modal-card">

          <div
            className={`converter-progress-spinner ${
              progressState.isDone
                ? "completed"
                : ""
            }`}
          />

          <h3 className="converter-progress-title">
            {progressState.title}
          </h3>

          <p className="converter-progress-subtitle">
            {progressState.subtitle}
          </p>

          <div className="converter-progress-bar-wrap">
            <div
              className={`converter-progress-bar-fill ${
                progressState.isDone
                  ? "completed"
                  : ""
              }`}
              style={{
                width: `${progressState.percent}%`,
              }}
            />
          </div>

          <div className="converter-progress-meta-text">
            <span>
              {progressState.statusText}
            </span>

            <span>
              {progressState.percent}%
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}