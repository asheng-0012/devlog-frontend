import { useRef } from "react";

/* ---------- Tiny syntax highlighter ---------- */
const KEYWORDS = {
  Python: new Set(
    "def class return if elif else for while in not and or is import from as with try except finally raise pass break continue lambda yield global None True False".split(" ")
  ),
  JavaScript: new Set(
    "function const let var return if else for while of in new class import from export default try catch finally throw break continue switch case async await typeof this true false null undefined".split(" ")
  ),
  Java: new Set(
    "public private protected static final class interface extends implements void int long double boolean char String return if else for while new import try catch finally throw break continue switch case this true false null".split(" ")
  ),
};

const COMMENT = {
  Python: /#.*/,
  JavaScript: /\/\/.*|\/\*[\s\S]*?\*\//,
  Java: /\/\/.*|\/\*[\s\S]*?\*\//,
};
const STRING = /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/;
const NUMBER = /\b\d+(?:\.\d+)?\b/;
const WORD = /\b[A-Za-z_]\w*\b/;

// one regex per language: group 1 = comment, 2 = string, 3 = number, 4 = word
const PATTERNS = Object.fromEntries(
  Object.entries(COMMENT).map(([lang, comment]) => [
    lang,
    new RegExp(`(${comment.source})|(${STRING.source})|(${NUMBER.source})|(${WORD.source})`, "g"),
  ])
);

export function highlight(code, language) {
  const keywords = KEYWORDS[language];
  const nodes = [];
  let last = 0;

  for (const m of code.matchAll(PATTERNS[language])) {
    if (m.index > last) nodes.push(code.slice(last, m.index));

    const [text, comment, string, number, word] = m;
    let cls = "";
    if (comment) cls = "text-muted";
    else if (string || number) cls = "text-amber-700";
    else if (word && keywords.has(word)) cls = "text-brand";

    nodes.push(cls ? <span key={m.index} className={cls}>{text}</span> : text);
    last = m.index + text.length;
  }

  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}

/* ---------- Editor ---------- */
// both layers MUST share the same font + line-height, or the colors drift off the text
const METRICS = "font-mono text-[15px] leading-7";

export default function CodeEditor({ value, onChange, language, readOnly = false }) {
  const textRef = useRef(null);
  const preRef = useRef(null);
  const gutterRef = useRef(null);
  const trapTab = useRef(true);

  const lineCount = value.split("\n").length;

  // the textarea scrolls; the highlight layer and line numbers follow it
  const syncScroll = () => {
    const t = textRef.current;
    preRef.current.scrollTop = t.scrollTop;
    preRef.current.scrollLeft = t.scrollLeft;
    gutterRef.current.scrollTop = t.scrollTop;
  };

  const edit = (next, caret) => {
    onChange(next);
    requestAnimationFrame(() => {
      const t = textRef.current;
      if (t) t.selectionStart = t.selectionEnd = caret;
    });
  };

  const handleKeyDown = (e) => {
    if (readOnly || e.nativeEvent.isComposing) return;
    const { selectionStart: start, selectionEnd: end } = e.currentTarget;

    // Esc then Tab lets keyboard users leave the editor
    if (e.key === "Escape") {
      trapTab.current = false;
      return;
    }

    if (e.key === "Tab" && !e.shiftKey && trapTab.current) {
      e.preventDefault();
      edit(value.slice(0, start) + "    " + value.slice(end), start + 4);
      return;
    }

    // Enter keeps the current indent, and adds one level after  :  {  (  [
    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const indent = line.match(/^\s*/)[0];
      const extra = /[:{(\[]\s*$/.test(line) ? "    " : "";
      const insert = "\n" + indent + extra;
      edit(value.slice(0, start) + insert + value.slice(end), start + insert.length);
    }
  };

  return (
    <div className={`flex h-full overflow-hidden rounded-[22px] ${METRICS}`}>
      {/* line numbers */}
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden pb-12 pl-4 pr-4 pt-5 text-right text-muted/70"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      <div className="relative min-w-0 flex-1">
        {/* colored copy of the code (behind) */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre pb-12 pl-2 pr-5 pt-5"
        >
          {highlight(value, language)}
          {"\n"}
        </pre>

        {/* real textarea (in front, text invisible, caret visible) */}
        <textarea
          ref={textRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => (trapTab.current = true)}
          onScroll={syncScroll}
          readOnly={readOnly}
          aria-readonly={readOnly}
          aria-label={`${language} solution`}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          className="neu-scroll absolute inset-0 size-full resize-none overflow-auto whitespace-pre bg-transparent pb-5 pl-2 pr-5 pt-5 text-transparent caret-ink outline-none selection:bg-black/10"
        />
      </div>
    </div>
  );
}