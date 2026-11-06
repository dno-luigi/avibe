import { cn } from "@wron/kit";

/* A tiny line highlighter: green for content and values, violet for syntax. Returns React nodes. */

const span = (cls, text, key) => (
  <span key={key} className={cls}>
    {text}
  </span>
);

function splitWith(parts, re, mapper) {
  const out = [];
  parts.forEach((p, pi) => {
    if (typeof p !== "string") {
      out.push(p);
      return;
    }
    let last = 0;
    let m;
    const r = new RegExp(re.source, "g");
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

function hl(line, lang) {
  if (!line.trim()) return "\u00A0";
  if (/^\s*(\/\*|\/\/|<!--)/.test(line)) return [span("text-muted", line, "c")];
  if (lang === "markdown") {
    if (/^#/.test(line)) return [span("text-primary", line, "h")];
    let parts = [line];
    const bullet = line.match(/^(\s*-\s)([\s\S]*)$/);
    if (bullet) parts = [span("text-accent", bullet[1], "b"), bullet[2]];
    return splitWith(parts, /(\[[^\]]+\])(\([^)]+\))/, (m, k) => [span("text-ink", m[1], k + "a"), span("text-primary", m[2], k + "b")]);
  }
  if (lang === "html") {
    let parts = splitWith([line], /"[^"]*"/, (m, k) => [span("text-primary", m[0], k)]);
    parts = splitWith(parts, /(<\/?)([a-z0-9]+)/, (m, k) => [m[1], span("text-accent", m[2], k)]);
    return parts;
  }
  if (line.includes("{")) {
    const m = line.match(/^([^{]+)\{(.*)$/);
    if (m) {
      const rest = splitWith([m[2]], /([\w-]+)(:\s)([^;]+)/, (mm, k) => [mm[1], mm[2], span("text-primary", mm[3], k)]);
      return [span("text-accent", m[1], "sel"), "{", ...rest];
    }
  }
  const d = line.match(/^(\s*)([\w-]+)(:\s*)(.+?)(;?)$/);
  if (d) return [d[1], span("text-ink", d[2], "p"), d[3], span("text-primary", d[4], "v"), d[5]];
  return line;
}

export default function GuideCode({ code, lang, label, className }) {
  const lines = String(code).split("\n");
  return (
    <figure className={cn("overflow-hidden rounded-theme border border-line bg-[#0E1115]", className)}>
      {label && (
        <figcaption className="border-b border-line px-4 py-2 font-mono text-[13px] text-muted">{label}</figcaption>
      )}
      <pre className="pane-scroll overflow-x-auto p-4 font-mono text-xs leading-5 text-[#C9D1DB] sm:text-[14px] sm:leading-[1.55]">
        <code>
          {lines.map((l, i) => (
            <span key={i} className="grid grid-cols-[1.75rem_1fr]">
              <span className="select-none text-right pr-3 text-muted/60" aria-hidden="true">{i + 1}</span>
              <span className="whitespace-pre">{hl(l, lang)}</span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
