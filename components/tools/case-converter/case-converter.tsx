"use client";

import React, { useState, useEffect, useRef } from "react";
import "./case-converter.css";
import { caseConverterConfig, SlugConfig } from "./faq";
import DOMPurify from "isomorphic-dompurify";

interface CaseConverterProps {
  slug?: string;
}

export default function CaseConverter({ slug = "case-converter" }: CaseConverterProps) {
  const config: SlugConfig = caseConverterConfig[slug] || caseConverterConfig["case-converter"];

  const [text, setText] = useState("");
  const [currentMode, setCurrentMode] = useState<string>("upper");
  const [live, setLive] = useState<boolean>(true);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [lastText, setLastText] = useState("");
  const [isUndoing, setIsUndoing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ msg: string; success: boolean } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const smallWords = new Set(['a','an','the','and','but','or','for','nor','on','at','to','from','by','with','of','in','as','is','if']);

  function toTitleCase(str: string) {
    return str.toLowerCase().replace(/\S+/g, (word, index, full) => {
      const isFirst = index === 0;
      const isLast = index + word.length === full.length;
      if (isFirst || isLast || !smallWords.has(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word;
    });
  }

  const converters: Record<string, (t: string) => string> = {
    upper: t => t.toUpperCase(),
    lower: t => t.toLowerCase(),
    title: t => toTitleCase(t),
    sentence: t => t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
    alternating: t => [...t].map((c, i) => i % 2 ? c.toLowerCase() : c.toUpperCase()).join(''),
    inverse: t => [...t].map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
    random: t => [...t].map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join(''),
    smallcaps: t => {
      const map: Record<string, string> = {
        a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',
        n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ'
      };
      return t.toLowerCase().split('').map(c => map[c] || c).join('');
    }
  };

  function convertText(inputVal: string, mode: string) {
    if (!inputVal) return '';
    return (converters[mode] || converters.upper)(inputVal);
  }

  const showToast = (msg: string, success = true) => {
    setToastMessage({ msg, success });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const pushToUndo = (val: string) => {
    if (isUndoing) return;
    setUndoStack(prev => (prev.length > 0 && prev[prev.length - 1] === val ? prev : [...prev, val]));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (!isUndoing && val !== lastText) {
      pushToUndo(lastText);
      setLastText(val);
    }
    setText(live ? convertText(val, currentMode) : val);
  };

  const applyConversion = () => {
    if (!text.trim()) return showToast("Please enter some text first", false);
    pushToUndo(text);
    const result = convertText(text, currentMode);
    setText(result);
    showToast(`Converted to ${currentMode.toUpperCase()}`);
  };

  const handleModeChange = (mode: string) => {
    setCurrentMode(mode);
    if (live && text) {
      pushToUndo(text);
      setText(convertText(text, mode));
    }
  };

  const themeClassName = `case-converter-wrapper theme-${slug || 'case-converter'}`;

  return (
    <div className={themeClassName}>
      <div className="case-converter-bg-animation"></div>

      <div className="case-converter-container">
        <div className="case-converter-main-card">
          <div className="case-converter-textarea-wrapper">
            {/* এখানে সম্পাদক কন্টেইনারে সঠিক ref ব্যবহার করা হয়েছে */}
            <div className="case-converter-editor-container" ref={editorContainerRef}>
              <div className="case-converter-line-numbers" ref={lineNumbersRef}>
                {text === '' ? '1' : text.split('\n').map((_, i) => i + 1).join('\n')}
              </div>
              <textarea
                ref={inputRef}
                className="case-converter-textarea"
                value={text}
                onChange={handleTextChange}
                placeholder="Type or paste your text here..."
              />
            </div>
            {!text.trim() && (
              <button className="case-converter-paste-btn" onClick={async () => {
                const clip = await navigator.clipboard.readText();
                if (clip) { setText(live ? convertText(clip, currentMode) : clip); showToast("Pasted from clipboard"); }
              }}>
                Paste
              </button>
            )}
          </div>

          <div className="case-converter-modes">
            {[
              { id: 'upper', label: 'UPPERCASE' },
              { id: 'lower', label: 'lowercase' },
              { id: 'title', label: 'Title Case' },
              { id: 'sentence', label: 'Sentence case' },
              { id: 'alternating', label: 'aLtErNaTiNg' },
              { id: 'inverse', label: 'InVeRsE' },
              { id: 'random', label: 'RaNdOm' },
              { id: 'smallcaps', label: 'ꜱᴍᴀʟʟ ᴄᴀᴘꜱ' },
            ].map(m => (
              <button
                key={m.id}
                className={`case-converter-mode-btn ${currentMode === m.id ? 'active' : ''}`}
                onClick={() => handleModeChange(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="case-converter-actions">
            <button className="case-converter-btn case-converter-btn-primary" onClick={applyConversion}>Convert</button>
            <button className="case-converter-btn case-converter-btn-secondary" onClick={() => { navigator.clipboard.writeText(text); showToast("Copied to clipboard"); }}>Copy</button>
            <button className="case-converter-btn case-converter-btn-secondary" onClick={() => {
              if (undoStack.length === 0) return showToast("Nothing to undo", false);
              setIsUndoing(true);
              setText(undoStack.pop() || "");
              setTimeout(() => setIsUndoing(false), 50);
              showToast("Undone");
            }}>Undo</button>
            <button className="case-converter-btn case-converter-btn-danger" onClick={() => { setText(""); showToast("Cleared"); }}>Clear</button>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px", fontSize: "0.88rem", color: "#a0a0b0" }}>
              <span>Live Convert</span>
              <input type="checkbox" checked={live} onChange={e => setLive(e.target.checked)} style={{ width: "20px", height: "20px", cursor: "pointer" }} />
            </div>
          </div>

          <div className="case-converter-stats">
            <div className="case-converter-stat-card"><div className="case-converter-stat-value">{text.length}</div><div className="case-converter-stat-label">Characters</div></div>
            <div className="case-converter-stat-card"><div className="case-converter-stat-value">{text.trim() ? text.trim().split(/\s+/).length : 0}</div><div className="case-converter-stat-label">Words</div></div>
            <div className="case-converter-stat-card"><div className="case-converter-stat-value">{text.trim() ? (text.match(/[.!?]+/g) || []).length || 1 : 0}</div><div className="case-converter-stat-label">Sentences</div></div>
            <div className="case-converter-stat-card"><div className="case-converter-stat-value">{Math.ceil((text.trim().split(/\s+/).length || 0) / 3.5)}s</div><div className="case-converter-stat-label">Reading Time</div></div>
          </div>
        </div>
       {/* Dynamic Tool Image - Lazy Loaded */}
<div
  style={{
    width: "100%",
    maxWidth: "800px",
    margin: "30px auto",
    textAlign: "center",
  }}
>
  <img
    src={`/images/case-converter/${slug}.webp`}
    alt={config.h1Title}
    width="800"
    height="450"
    loading="lazy"
    decoding="async"
    style={{
      display: "block",
      width: "100%",
      height: "auto",
      borderRadius: "10px",
    }}
  />
</div>
        {/* SEO & FAQ Section */}
        <section className="case-converter-seo-section">
          <h1 className="case-converter-seo-h1">{config.h1Title}</h1>
          <p className="case-converter-seo-intro">{config.introText}</p>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 600, margin: "20px 0 14px", color: "#fff" }}>{config.article.title}</h2>
          {config.article.sections.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: "16px" }}>
              <h2 style={{ fontSize: "1.15rem", fontWeight: 600, color: "#f0f0f5", marginBottom: "6px" }}>{sec.heading}</h2>
             <p
  style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#a0a0b8" }}
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(sec.content)
  }}
/>
            </div>
          ))}

          <div style={{ marginTop: "32px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#ffffff" }}>Frequently Asked Questions</h2>
            {config.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className={`case-converter-faq-item ${isOpen ? 'open' : ''}`}>
                  <button className="case-converter-faq-question" onClick={() => setOpenFaqIndex(isOpen ? null : idx)}>
                    <h2>{faq.question}</h2>
                    <span>{isOpen ? '−' : '+'}</span>
                  </button>
                  <div className="case-converter-faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {toastMessage && (
        <div className={`case-converter-toast show ${toastMessage.success ? 'success' : ''}`}>
          {toastMessage.msg}
        </div>
      )}
    </div>
  );
}