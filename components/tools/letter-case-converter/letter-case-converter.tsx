"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "./letter-case-converter.css";
import { letterCaseConverterFaqs } from "./faq";

type CaseMode =
  | "upper"
  | "lower"
  | "title"
  | "sentence"
  | "alternating"
  | "inverse"
  | "random"
  | "smallcaps";

interface StoredState {
  text?: string;
  mode?: CaseMode;
  live?: boolean;
}

const STORAGE_KEY = "casealchemy_state";

const SMALL_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "for",
  "nor",
  "on",
  "at",
  "to",
  "from",
  "by",
  "with",
  "of",
  "in",
  "as",
  "is",
  "if",
]);

const SMALL_CAPS_MAP: Record<string, string> = {
  a: "ᴀ",
  b: "ʙ",
  c: "ᴄ",
  d: "ᴅ",
  e: "ᴇ",
  f: "ꜰ",
  g: "ɢ",
  h: "ʜ",
  i: "ɪ",
  j: "ᴊ",
  k: "ᴋ",
  l: "ʟ",
  m: "ᴍ",
  n: "ɴ",
  o: "ᴏ",
  p: "ᴘ",
  q: "ǫ",
  r: "ʀ",
  s: "ꜱ",
  t: "ᴛ",
  u: "ᴜ",
  v: "ᴠ",
  w: "ᴡ",
  x: "x",
  y: "ʏ",
  z: "ᴢ",
};

const MODE_LABELS: { mode: CaseMode; label: string }[] = [
  { mode: "upper", label: "UPPERCASE" },
  { mode: "lower", label: "lowercase" },
  { mode: "title", label: "Title Case" },
  { mode: "sentence", label: "Sentence case" },
  { mode: "alternating", label: "aLtErNaTiNg" },
  { mode: "inverse", label: "InVeRsE" },
  { mode: "random", label: "RaNdOm" },
  { mode: "smallcaps", label: "ꜱᴍᴀʟʟ ᴄᴀᴘꜱ" },
];

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\S+/g, (word, index, full) => {
    const isFirst = index === 0;
    const isLast = index + word.length === full.length;
    if (isFirst || isLast || !SMALL_WORDS.has(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });
}

function convertTextByMode(text: string, mode: CaseMode): string {
  if (!text) return "";

  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return toTitleCase(text);
    case "sentence":
      return text
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case "alternating":
      return [...text]
        .map((c, i) => (i % 2 ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    case "inverse":
      return [...text]
        .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
        .join("");
    case "random":
      return [...text]
        .map((c) => (Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()))
        .join("");
    case "smallcaps":
      return text
        .toLowerCase()
        .split("")
        .map((c) => SMALL_CAPS_MAP[c] || c)
        .join("");
    default:
      return text;
  }
}

export default function LetterCaseConverter() {
  const [text, setText] = useState<string>("");
  const [currentMode, setCurrentMode] = useState<CaseMode>("upper");
  const [liveConvert, setLiveConvert] = useState<boolean>(true);
  const [toast, setToast] = useState<{
    message: string;
    success: boolean;
    visible: boolean;
  }>({
    message: "",
    success: true,
    visible: false,
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const undoStackRef = useRef<string[]>([]);
  const lastTextRef = useRef<string>("");
  const isUndoingRef = useRef<boolean>(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const lineNumbersRef = useRef<HTMLDivElement | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  const showToast = useCallback((msg: string, success = true) => {
    setToast({ message: msg, success, visible: true });
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  }, []);

  const saveState = useCallback(
    (nextText: string, nextMode: CaseMode, nextLive: boolean) => {
      try {
        const payload: StoredState = {
          text: nextText,
          mode: nextMode,
          live: nextLive,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage errors
      }
    },
    []
  );

  const pushToUndo = useCallback((prevValue: string) => {
    if (isUndoingRef.current) return;
    const stack = undoStackRef.current;
    if (stack.length === 0 || stack[stack.length - 1] !== prevValue) {
      stack.push(prevValue);
      if (stack.length > 40) {
        stack.shift();
      }
    }
  }, []);

  const increaseHeightOnPaste = useCallback(() => {
    const container = editorContainerRef.current;
    if (!container) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;
    const extra = isMobile ? 10 : 15;
    const currentHeight = container.offsetHeight;
    container.style.height = `${currentHeight + extra}px`;
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: StoredState = JSON.parse(raw);
        const restoredText = typeof parsed.text === "string" ? parsed.text : "";
        const restoredMode: CaseMode = parsed.mode || "upper";
        const restoredLive =
          typeof parsed.live === "boolean" ? parsed.live : true;

        setText(restoredText);
        lastTextRef.current = restoredText;
        setCurrentMode(restoredMode);
        setLiveConvert(restoredLive);
      }
    } catch {
      // Ignore invalid stored state
    }

    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleScrollSync = () => {
    if (inputRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = inputRef.current.scrollTop;
    }
  };

  const applyConversion = useCallback(
    (targetText: string = text, targetMode: CaseMode = currentMode) => {
      if (!targetText.trim()) {
        showToast("Please enter some text first", false);
        return;
      }
      pushToUndo(targetText);
      const result = convertTextByMode(targetText, targetMode);
      setText(result);
      lastTextRef.current = result;
      saveState(result, targetMode, liveConvert);
      showToast(`Converted to ${targetMode.toUpperCase()}`);
    },
    [text, currentMode, liveConvert, pushToUndo, saveState, showToast]
  );

  const handleModeSelect = (mode: CaseMode) => {
    setCurrentMode(mode);
    saveState(text, mode, liveConvert);
    if (liveConvert && text) {
      pushToUndo(text);
      const converted = convertTextByMode(text, mode);
      setText(converted);
      lastTextRef.current = converted;
      saveState(converted, mode, liveConvert);
      showToast(`Converted to ${mode.toUpperCase()}`);
    }
  };

  const copyToClipboard = async (value: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {
      // Fallback below
    }

    try {
      const helperArea = document.createElement("textarea");
      helperArea.value = value;
      helperArea.style.position = "fixed";
      helperArea.style.left = "-9999px";
      document.body.appendChild(helperArea);
      helperArea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(helperArea);
      return ok;
    } catch {
      return false;
    }
  };

  const pasteFromClipboard = async (): Promise<string | null> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        return await navigator.clipboard.readText();
      }
    } catch {
      // Fallback toast below
    }
    showToast("Please use Ctrl+V or allow clipboard permission", false);
    return null;
  };

  const handlePasteClick = async () => {
    const pasted = await pasteFromClipboard();
    if (pasted) {
      pushToUndo(text);
      increaseHeightOnPaste();
      if (liveConvert) {
        const converted = convertTextByMode(pasted, currentMode);
        setText(converted);
        lastTextRef.current = converted;
        saveState(converted, currentMode, liveConvert);
        showToast(`Converted to ${currentMode.toUpperCase()}`);
      } else {
        setText(pasted);
        lastTextRef.current = pasted;
        saveState(pasted, currentMode, liveConvert);
        showToast("Pasted from clipboard");
      }
    }
  };

  const handleCopyClick = async () => {
    if (!text) {
      showToast("Nothing to copy", false);
      return;
    }
    const ok = await copyToClipboard(text);
    showToast(ok ? "Copied to clipboard" : "Copy failed", ok);
  };

  const handleClearClick = () => {
    if (!text) return;
    pushToUndo(text);
    setText("");
    lastTextRef.current = "";
    if (editorContainerRef.current) {
      editorContainerRef.current.style.height = "";
    }
    saveState("", currentMode, liveConvert);
    showToast("Cleared");
  };

  const handleUndoClick = useCallback(() => {
    if (undoStackRef.current.length === 0) {
      showToast("Nothing to undo", false);
      return;
    }
    isUndoingRef.current = true;
    const previousText = undoStackRef.current.pop() ?? "";
    setText(previousText);
    lastTextRef.current = previousText;
    saveState(previousText, currentMode, liveConvert);
    showToast("Undone");
    setTimeout(() => {
      isUndoingRef.current = false;
    }, 50);
  }, [currentMode, liveConvert, saveState, showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    if (!isUndoingRef.current && rawValue !== lastTextRef.current) {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      typingTimerRef.current = setTimeout(() => {
        if (lastTextRef.current !== rawValue) {
          pushToUndo(lastTextRef.current);
          lastTextRef.current = rawValue;
        }
      }, 600);
    }

    if (liveConvert) {
      const converted = convertTextByMode(rawValue, currentMode);
      setText(converted);
      lastTextRef.current = converted;
      saveState(converted, currentMode, liveConvert);

      if (converted !== rawValue) {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPos, cursorPos);
          }
        });
      }
    } else {
      setText(rawValue);
      lastTextRef.current = rawValue;
      saveState(rawValue, currentMode, liveConvert);
    }
  };

  const handleLiveToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setLiveConvert(checked);
    saveState(text, currentMode, checked);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        handleUndoClick();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        applyConversion(text, currentMode);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [applyConversion, currentMode, handleUndoClick, text]);

  const linesCount = text === "" ? 1 : text.split("\n").length;
  const lineNumbersContent = Array.from(
    { length: linesCount },
    (_, idx) => `${idx + 1}`
  ).join("\n");

  const charsCount = text.length;
  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentencesCount = text.trim()
    ? (text.match(/[.!?]+/g) || []).length || 1
    : 0;
  const readSeconds = Math.ceil(wordsCount / 3.5);
  const readTimeLabel =
    readSeconds < 60
      ? `${readSeconds}s`
      : `${Math.floor(readSeconds / 60)}m ${readSeconds % 60}s`;

  const toggleFaqItem = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="case-converter1">
      <div className="case-converter2" aria-hidden="true" />

      <div className="case-converter3">
        <div className="case-converter4">
          <div className="case-converter5">
            <div
              className="case-converter6"
              id="editorContainer"
              ref={editorContainerRef}
            >
              <div
                className="case-converter7"
                id="lineNumbers"
                ref={lineNumbersRef}
                aria-hidden="true"
              >
                {lineNumbersContent}
              </div>
              <textarea
                id="inputText"
                ref={inputRef}
                className="case-converter8"
                value={text}
                onChange={handleInputChange}
                onScroll={handleScrollSync}
                placeholder="Type or paste your text here..."
                aria-label="Text input area"
              />
            </div>

            <button
              type="button"
              className={`case-converter9 ${
                text.trim() !== "" ? "case-converter10" : ""
              }`}
              id="pasteBtn"
              onClick={handlePasteClick}
              aria-label="Paste from clipboard"
            >
              Paste
            </button>
          </div>

          <div
            className="case-converter11"
            id="modes"
            role="group"
            aria-label="Case conversion modes"
          >
            {MODE_LABELS.map((item) => {
              const isActive = currentMode === item.mode;
              return (
                <button
                  key={item.mode}
                  type="button"
                  className={`case-converter12 ${
                    isActive ? "case-converter13" : ""
                  }`}
                  data-mode={item.mode}
                  aria-pressed={isActive}
                  onClick={() => handleModeSelect(item.mode)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="case-converter14">
            <button
              type="button"
              className="case-converter15 case-converter16"
              id="convertBtn"
              onClick={() => applyConversion(text, currentMode)}
              aria-label="Convert text"
            >
              Convert
            </button>

            <button
              type="button"
              className="case-converter15 case-converter17"
              id="copyBtn"
              onClick={handleCopyClick}
              aria-label="Copy to clipboard"
            >
              Copy
            </button>

            <button
              type="button"
              className="case-converter15 case-converter17"
              id="undoBtn"
              onClick={handleUndoClick}
              aria-label="Undo last change"
            >
              Undo
            </button>

            <button
              type="button"
              className="case-converter15 case-converter18"
              id="clearBtn"
              onClick={handleClearClick}
              aria-label="Clear all text"
            >
              Clear
            </button>

           <div className="case-converter19">
              <span id="liveLabel">Live Convert</span>
              <div className="case-converter20">
                <input
                  type="checkbox"
                  id="liveToggle"
                  className="case-converter21"
                  checked={liveConvert}
                  onChange={handleLiveToggleChange}
                />
                <label htmlFor="liveToggle" className="case-converter22">
                  <span
                    style={{
                      position: "absolute",
                      width: "1px",
                      height: "1px",
                      padding: 0,
                      margin: "-1px",
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                  >
                    Live Convert
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="case-converter23" aria-live="polite">
            <div className="case-converter24">
              <div className="case-converter25" id="charCount">
                {charsCount.toLocaleString()}
              </div>
              <div className="case-converter26">Characters</div>
            </div>

            <div className="case-converter24">
              <div className="case-converter25" id="wordCount">
                {wordsCount.toLocaleString()}
              </div>
              <div className="case-converter26">Words</div>
            </div>

            <div className="case-converter24">
              <div className="case-converter25" id="sentenceCount">
                {sentencesCount}
              </div>
              <div className="case-converter26">Sentences</div>
            </div>

            <div className="case-converter24">
              <div className="case-converter25" id="readTime">
                {readTimeLabel}
              </div>
              <div className="case-converter26">Reading Time</div>
            </div>
          </div>
        </div>

        <section className="case-converter30">
          <h1 className="case-converter31">
            Letter Case Converter — Transform Text Case Online
          </h1>
          <p className="case-converter32">
            This free online letter case converter helps you switch text
            between uppercase, lowercase, title case, sentence case, alternating
            case, inverse case, random case, and small caps in seconds. Paste or
            type your draft into the line-numbered editor to format headlines,
            clean messy capitalization, track character and word counts, and
            copy polished text without leaving your browser.
          </p>
        </section>

        <section
          className="case-converter33"
          aria-labelledby="letterCaseFaqHeading"
        >
          <h2 id="letterCaseFaqHeading" className="case-converter34">
            Frequently Asked Questions About Letter Case Converter Tools
          </h2>

          <div className="case-converter35">
            {letterCaseConverterFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.question} className="case-converter36">
                  <button
                    type="button"
                    className="case-converter37"
                    aria-expanded={isOpen}
                    onClick={() => toggleFaqItem(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="case-converter38" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="case-converter39">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div
        className={`case-converter27 ${
          toast.visible ? "case-converter28" : ""
        } ${toast.success ? "case-converter29" : ""}`}
        id="toast"
        role="status"
        aria-live="polite"
      >
        {toast.message}
      </div>
    </div>
  );
}