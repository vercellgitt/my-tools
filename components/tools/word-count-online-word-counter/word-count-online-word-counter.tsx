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
  const [kwEntries, setKwEntries] = useState<[string, number][]>([]);
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

    const sentMatch =
      text.trim() === ""
        ? 0
        : (text.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) || []).filter(
            (s) => s.trim()
          ).length;

    setSentences(sentMatch);

    const parasMatch =
      text.trim() === ""
        ? 0
        : text.split(/\n\s*\n/).filter((p) => p.trim()).length ||
          (text.trim() ? 1 : 0);

    setParagraphs(parasMatch);

    setReadTime(formatTimeMinutes(total / 200));
    setSpeakTime(formatTimeMinutes(total / 150));

    const sortedKw = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25);

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

        reader.onload = (evt) =>
          resolve((evt.target?.result as string) || "");

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

      const updated = text.trim()
        ? text + "\n\n---\n\n" + combined
        : combined;

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
      // Ignore clipboard errors
    }
  };

  const hasText = text.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <div className="word-counter1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="word-counter2">
        Word Count Online Word Counter
      </h1>

      <p className="word-counter3">
        Use the ultimate word count online word counter tool to analyze your
        text, check character count, sentence count, and keyword density easily.
      </p>

      <div className="word-counter4">
        <div className="word-counter5" ref={lineNumRef}>
          {lineNumbers}
        </div>

        <textarea
          ref={taRef}
          className="word-counter6"
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
          className={`word-counter7 ${hasText ? "word-counter8" : ""}`}
          onClick={handlePasteClick}
          type="button"
        >
          Paste
        </button>
      </div>

      <div className="word-counter9">
        <button
          className={`word-counter10 word-counter11 word-counter12 ${
            hasText ? "word-counter13" : ""
          }`}
          onClick={handleClear}
          type="button"
        >
          Clear
        </button>

        <button
          className={`word-counter10 word-counter11 ${
            hasText ? "word-counter13" : ""
          }`}
          onClick={handleCopy}
          type="button"
        >
          Copy Text
        </button>

        <label className="word-counter14" htmlFor="fileInput">
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

      <div className="word-counter15">
        {[
          ["Total Words", totalWords],
          ["Unique Words", uniqueWords],
          ["Repeated Words", repeatedWords],
          ["Sentences", sentences],
          ["Paragraphs", paragraphs],
          ["Lines", linesCount],
          ["Chars (spaces)", chars],
          ["Chars (no spaces)", charsNo],
        ].map(([label, value]) => (
          <div className="word-counter16" key={label}>
            <div className="word-counter17">{value}</div>
            <div className="word-counter18">{label}</div>
          </div>
        ))}
      </div>

      <div className="word-counter19">
        <div className="word-counter20">Time Estimate</div>

        <div className="word-counter21">
          <div className="word-counter22">
            <div className="word-counter23">{readTime}</div>
            <div className="word-counter24">
              Reading Time (~200 wpm)
            </div>
          </div>

          <div className="word-counter22">
            <div className="word-counter23">{speakTime}</div>
            <div className="word-counter24">
              Speaking Time (~150 wpm)
            </div>
          </div>
        </div>
      </div>

      <div className="word-counter19">
        <div className="word-counter20">Specific Word Counter</div>

        <div className="word-counter25">
          <input
            type="text"
            placeholder="Enter a word…"
            value={swInput}
            onChange={(e) => setSwInput(e.target.value)}
          />

          <div className="word-counter26">{swCount}</div>
        </div>

        <div className="word-counter27">
          <label>
            <input
              type="checkbox"
              checked={caseSens}
              onChange={(e) => setCaseSens(e.target.checked)}
            />
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
            />
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
            />
            Partial Match
          </label>
        </div>
      </div>

      <div className="word-counter19">
        <div className="word-counter20">
          Keyword Density — Top Words
        </div>

        <div className="word-counter28">
          {kwEntries.length === 0 ? (
            <div className="word-counter35">No words yet</div>
          ) : (
            kwEntries.map(([word, cnt], idx) => {
              const pct = totalForKw
                ? ((cnt / totalForKw) * 100).toFixed(1)
                : "0.0";

              const barW = totalForKw
                ? Math.min(100, (cnt / totalForKw) * 100 * 4)
                : 0;

              return (
                <div className="word-counter29" key={idx}>
                  <span className="word-counter30">{word}</span>

                  <div className="word-counter31">
                    <span style={{ width: `${barW}%` }} />
                  </div>

                  <span className="word-counter32">{cnt}</span>
                  <span className="word-counter33">{pct}%</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="word-counter34">
        <h2 className="word-counter20">
          Frequently Asked Questions
        </h2>

        {faqData.map((item, index) => {
          const isOpen = openFaq === index;

          const QuestionTag: "h2" | "h3" =
            item.heading === "h2" ? "h2" : "h3";

          return (
            <div
              className="word-counter36"
              key={index}
              onClick={() => setOpenFaq(isOpen ? null : index)}
            >
              <QuestionTag className="word-counter37">
                {item.question}

                <span className="word-counter38">
                  {isOpen ? "▲" : "▼"}
                </span>
              </QuestionTag>

              {isOpen && (
                <div className="word-counter39">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}