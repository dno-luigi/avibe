import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn, toast } from "@wron/kit";
import { copyText } from "../lib/build";

/*
  A bordered code sample in JetBrains Mono with line numbers, light syntax colour
  (violet for tags/properties, green for strings/values) and a Copy button.
  <CodeBlock code="..." lang="css|html|markdown" label="style.css" />
  Highlighting returns React nodes (no HTML strings).
*/

const ACCENT = "text-accent";
const PRIMARY = "text-primary";

/* Split a string by a regex and wrap matches with a class via a mapper. */
function splitWith(parts, re, mapper) {
  const out = [];
  parts.forEach((p, pi) => {
    if (typeof p !== "string") {
      out.push(p);
      return;
    }
    let last = 0;
    let m;
    const r = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
    while ((m = r.exec(p))) {
      if (m[0] === "") {
        r.lastIndex++;
        continue;
      }
      if (m.index > last) out.push(p.slice(last, m.index));
      out.push(...mapper(m, `${pi}-${m.index}`));
      last = m.index + m[0].length;
    }
    if (last < p.length) out.push(p.slice(last));
  });
  return out;
}

const span = (cls, text, key) => (
  <span key={key} className={cls}>
    {text}
  </span>
);

function colour(line, lang) {
  if (lang === "markdown") {
    if (/^#/.test(line)) return [span(ACCENT, line, "h")];
    if (/^\s*[-*]\s/.test(line)) {
      const m = line.match(/^(\s*[-*])([\s\S]*)$/);
      return [span(PRIMARY, m[1], "b"), m[2]];
    }
    return splitWith([line], /(\[[^\]]*\])(\([^)]*\))/, (m, k) => [span(ACCENT, m[1], k + "a"), span(PRIMARY, m[2], k + "b")]);
  }
  if (lang === "html") {
    let parts = splitWith([line], /"[^"]*"/, (m, k) => [span(PRIMARY, m[0], k)]);
    parts = splitWith(parts, /(<\/?)([a-zA-Z0-9-]+)/, (m, k) => [m[1], span(ACCENT, m[2], k)]);
    return parts;
  }
  if (lang === "css") {
    let parts = splitWith([line], /(--[a-z-]+|[a-z-]+)(?=\s*:)(?!\s*root)/, (m, k) => [span(ACCENT, m[1], k)]);
    parts = splitWith(parts, /#[0-9a-fA-F]{3,8}|\d+(?:\.\d+)?(?:rem|px|vw|fr|ms|s|%)?/, (m, k) => [span(PRIMARY, m[0], k)]);
    return parts;
  }
  return [line];
}

export default function CodeBlock({ code, lang = "", label, className, wrap = false }) {
  const [copied, setCopied] = useState(false);
  const lines = String(code || "").split("\n");
  return (
    <figure className={cn("overflow-hidden rounded-theme border border-line bg-[#0E1115]", className)}>
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-1.5">
        <span className="font-mono text-[13px] text-muted">{label || lang}</span>
        <button
          type="button"
          onClick={async () => {
            const ok = await copyText(code);
            if (ok) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } else toast.error("Could not copy. Select the code and copy it by hand.");
          }}
          className="inline-flex h-11 items-center gap-1.5 rounded px-2 text-[14px] text-muted hover:text-ink sm:h-9"
        >
          {copied ? <Check className="h-4 w-4 text-primary" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className={cn("pane-scroll overflow-x-auto p-4 font-mono text-[13px] leading-[1.55] text-ink sm:text-[14px]", wrap && "whitespace-pre-wrap break-words")}>
        <code>
          {lines.map((l, i) => (
            <span key={i} className="flex">
              <span className="mr-4 inline-block w-5 shrink-0 select-none text-right text-muted/50">{i + 1}</span>
              <span>{l ? colour(l, lang) : " "}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
