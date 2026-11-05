"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import "./word-count-online-word-counter.css";
import { faqData } from "./faq";

export default function WordCountOnlineWordCounter() {
  const [text, setText] = useState("");
  const [lineNumbers, setLineNumbers] = useState("1");
  const [totalWords, setTotalWords] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  const [repeatedWords, setRepeatedWords] = useState(0);
  const [sentences, setSentences] = useState(0);
  const [paragraphs, setParagraphs] = useState(0);
  const [linesCount, setLinesCount] = useState(0);
  const [chars, setChars] = useState(0);
  const [charsNo, setCharsNo] = useState(0);
  const [readTime, setReadTime] = useState("0 min");
  const [speakTime, setSpeakTime] = useState("0 min");
  
  const [swInput, setSwInput] = useState("");
  const [swCount, setSwCount] = useState(0);
  const [caseSens, setCaseSens] = useState(false);
  const [wholeWord, setWholeWord] = useState(true);
  const [partialMatch, setPartialMatch] = useState(false);
  const [kwEntries, setKwEntries] = useState<[string, number][]>([])
  const [totalForKw, setTotalForKw] = useState(0);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const taRef = useRef<HTMLTextAreaElement>(null);
  const lineNumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("savedText");
    if (saved) {
      setText(saved);
    }
  }, []);

  const getWords = (t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return [];
    return trimmed.split(/\s+/).filter(Boolean);
  };

  const formatTimeMinutes = (minutes: number) => {
    if (minutes < 1) {
      const sec = Math.round(minutes * 60);
      return sec + " sec";
    }
    if (minutes < 60) {
      const m = Math.floor(minutes);
      const s = Math.round((minutes - m) * 60);
      return s > 0 ? m + " min " + s + " sec" : m + " min";
    }
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return h + " hr " + m + " min";
  };

  useEffect(() => {
    localStorage.setItem("savedText", text);

    const linesArr = text.split("\n");
    let numStr = "";
    for (let i = 1; i <= linesArr.length; i++) {
      numStr += i + "\n";
    }
    setLineNumbers(numStr);
    setLinesCount(text === "" ? 0 : linesArr.length);

    const words = getWords(text);
    const total = words.length;
    setTotalWords(total);
    setTotalForKw(total);

    const freq: Record<string, number> = {};
    words.forEach((w) => {
      const key = w.toLowerCase();
      freq[key] = (freq[key] || 0) + 1;
    });

    const uniqueKeys = Object.keys(freq).length;
    setUniqueWords(uniqueKeys);

    let rep = 0;
    Object.values(freq).forEach((c) => {
      if (c > 1) rep += c;
    });
    setRepeatedWords(rep);

    setChars(text.length);
    setCharsNo(text.replace(/\s/g, "").length);

    const sentMatch = text.trim() === "" ? 0 : (text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || []).filter((s) => s.trim()).length;
    setSentences(sentMatch);

    const parasMatch = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
    setParagraphs(parasMatch);

    setReadTime(formatTimeMinutes(total / 200));
    setSpeakTime(formatTimeMinutes(total / 150));

    const sortedKw = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 25);
    setKwEntries(sortedKw);
  }, [text]);

  useEffect(() => {
    if (!swInput) {
      setSwCount(0);
      return;
    }

    let count = 0;
    if (partialMatch && !wholeWord) {
      const src = caseSens ? text : text.toLowerCase();
      const q = caseSens ? swInput : swInput.toLowerCase();
      let pos = 0;
      while ((pos = src.indexOf(q, pos)) !== -1) {
        count++;
        pos += q.length || 1;
      }
    } else {
      const words = getWords(text);
      words.forEach((w) => {
        const a = caseSens ? w : w.toLowerCase();
        const b = caseSens ? swInput : swInput.toLowerCase();
        if (wholeWord) {
          if (a === b) count++;
        } else if (partialMatch) {
          if (a.includes(b)) count++;
        } else {
          if (a === b) count++;
        }
      });
    }
    setSwCount(count);
  }, [swInput, caseSens, wholeWord, partialMatch, text]);

  const handleClear = () => {
    setText("");
    setSwInput("");
    localStorage.removeItem("savedText");
    taRef.current?.focus();
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readFile = (file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => resolve((evt.target?.result as string) || "");
        reader.onerror = () => resolve("");
        reader.readAsText(file);
      });
    };

    try {
      const promises = Array.from(files).map((file) => readFile(file));
      const contents = await Promise.all(promises);
      const valid = contents.filter((c) => c.trim() !== "");
      if (valid.length === 0) return;

      const combined = valid.join("\n\n---\n\n");
      const updated = text.trim() ? text + "\n\n---\n\n" + combined : combined;
      setText(updated);
      taRef.current?.focus();
    } catch (err) {
      console.error(err);
    } finally {
      e.target.value = "";
    }
  };

  const handlePasteClick = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
      taRef.current?.focus();
    } catch (err) {
      // ignore
    }
  };

  const hasText = text.length > 0;

  // Schema Markup JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="main-h1">Word Count Online Word Counter</h1>
      <p className="sub">
        Use the ultimate word count online word counter tool to analyze your text, check character count, sentence count, and keyword density easily.
      </p>

      <div className="ta-box">
        <div className="line-numbers" ref={lineNumRef}>
          {lineNumbers}
        </div>
        <textarea
          ref={taRef}
          className="textarea-field"
          placeholder="Enter your text (English, Arabic, etc.)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onScroll={() => {
            if (lineNumRef.current && taRef.current) {
              lineNumRef.current.scrollTop = taRef.current.scrollTop;
            }
          }}
          autoFocus
        />
        <button
          className={`paste-btn ${hasText ? "hidden" : ""}`}
          onClick={handlePasteClick}
          type="button"
        >
          Paste
        </button>
      </div>

      <div className="actions">
        <button
          className={`act dark conditional-act ${hasText ? "show" : ""}`}
          onClick={handleClear}
          type="button"
        >
          Clear
        </button>
        <button
          className={`act conditional-act ${hasText ? "show" : ""}`}
          onClick={handleCopy}
          type="button"
        >
          Copy Text
        </button>
        <label className="upload-label" htmlFor="fileInput">
          Upload File
        </label>
        <input
          type="file"
          id="fileInput"
          multiple
          accept=".txt,.html,.js,.css,.csv,.md,.json"
          style={{ display: "none" }}
          onChange={handleFileUpload}
        />
      </div>

      {/* Stats grid */}
      <div className="stats">
        <div className="stat">
          <div className="num">{totalWords}</div>
          <div className="label">Total Words</div>
        </div>
        <div className="stat">
          <div className="num">{uniqueWords}</div>
          <div className="label">Unique Words</div>
        </div>
        <div className="stat">
          <div className="num">{repeatedWords}</div>
          <div className="label">Repeated Words</div>
        </div>
        <div className="stat">
          <div className="num">{sentences}</div>
          <div className="label">Sentences</div>
        </div>
        <div className="stat">
          <div className="num">{paragraphs}</div>
          <div className="label">Paragraphs</div>
        </div>
        <div className="stat">
          <div className="num">{linesCount}</div>
          <div className="label">Lines</div>
        </div>
        <div className="stat">
          <div className="num">{chars}</div>
          <div className="label">Chars (spaces)</div>
        </div>
        <div className="stat">
          <div className="num">{charsNo}</div>
          <div className="label">Chars (no spaces)</div>
        </div>
      </div>

      {/* Reading / Speaking time */}
      <div className="card">
        <div className="card-title">Time Estimate</div>
        <div className="time-row">
          <div className="time-box">
            <div className="t-val">{readTime}</div>
            <div className="t-label">Reading Time (~200 wpm)</div>
          </div>
          <div className="time-box">
            <div className="t-val">{speakTime}</div>
            <div className="t-label">Speaking Time (~150 wpm)</div>
          </div>
        </div>
      </div>

      {/* Specific word counter */}
      <div className="card">
        <div className="card-title">Specific Word Counter</div>
        <div className="sw-row">
          <input
            type="text"
            placeholder="Enter a word…"
            value={swInput}
            onChange={(e) => setSwInput(e.target.value)}
          />
          <div className="sw-result">{swCount}</div>
        </div>
        <div className="opts">
          <label>
            <input
              type="checkbox"
              checked={caseSens}
              onChange={(e) => setCaseSens(e.target.checked)}
            />{" "}
            Case Sensitive
          </label>
          <label>
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => {
                setWholeWord(e.target.checked);
                if (e.target.checked) setPartialMatch(false);
              }}
            />{" "}
            Whole Word Only
          </label>
          <label>
            <input
              type="checkbox"
              checked={partialMatch}
              onChange={(e) => {
                setPartialMatch(e.target.checked);
                if (e.target.checked) setWholeWord(false);
              }}
            />{" "}
            Partial Match
          </label>
        </div>
      </div>

      {/* Keyword density */}
      <div className="card">
        <div className="card-title">Keyword Density — Top Words</div>
        <div className="kw-list">
          {kwEntries.length === 0 ? (
            <div className="empty-msg">No words yet</div>
          ) : (
            kwEntries.map(([word, cnt], idx) => {
              const pct = totalForKw ? ((cnt / totalForKw) * 100).toFixed(1) : "0.0";
              const barW = totalForKw ? Math.min(100, (cnt / totalForKw) * 100 * 4) : 0;
              return (
                <div className="kw-item" key={idx}>
                  <span className="kw-word">{word}</span>
                  <div className="kw-bar">
                    <span style={{ width: `${barW}%` }}></span>
                  </div>
                  <span className="kw-count">{cnt}</span>
                  <span className="kw-pct">{pct}%</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FAQ Section with collapsible behavior and uniform H2/H3/H4 font sizing */}
      <div className="faq-section">
        <h2 className="card-title">Frequently Asked Questions</h2>
        {faqData.map((item, index) => {
          const isOpen = openFaq === index;
          return (
            <div
              className="faq-card"
              key={index}
              onClick={() => setOpenFaq(isOpen ? null : index)}
            >
              <h3 className="faq-question">
                {item.question}
                <span>{isOpen ? "▲" : "▼"}</span>
              </h3>
              {isOpen && <div className="faq-answer">{item.answer}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}