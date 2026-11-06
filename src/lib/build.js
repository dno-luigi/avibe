import { mdToHtml, escapeHtml } from "./markdown";
import { BASE_CSS, getVibe } from "../data/vibes";

/*
  A project is { title, markdown, html, css, vibe, tokens }.
  buildDocument(project) returns one complete, self-contained HTML page:
  tokens as :root variables, the base rules, the vibe's rules, the project's CSS,
  then the Markdown (converted) and the raw HTML inside <main class="page">.
  Scripts are removed: output pages are HTML and CSS only.
*/

export function emptyProject(vibeId) {
  const vibe = getVibe(vibeId);
  return { title: "Untitled site", markdown: "", html: "", css: "", vibe: vibe.id, tokens: { ...vibe.tokens }, prompt: "" };
}

export function hasCode(p) {
  return !!(p && ((p.markdown || "").trim() || (p.html || "").trim() || (p.css || "").trim()));
}

export function tokensToCss(tokens = {}) {
  const lines = Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`);
  return `:root {\n${lines.join("\n")}\n}`;
}

const SCRIPT_BLOCK = new RegExp("\\x3cscript[\\s\\S]*?\\x3c/script\\s*>", "gi");
const SCRIPT_TAG = new RegExp("\\x3c/?script[^>]*>", "gi");

export function stripScripts(html) {
  return String(html || "")
    .replace(SCRIPT_BLOCK, "")
    .replace(SCRIPT_TAG, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"');
}

export function buildCss(p) {
  const vibe = getVibe(p.vibe);
  const tokens = { ...vibe.tokens, ...(p.tokens || {}) };
  return [tokensToCss(tokens), BASE_CSS, `/* vibe: ${vibe.name} */\n${vibe.css}`, (p.css || "").trim() ? `/* your CSS */\n${p.css}` : ""]
    .filter(Boolean)
    .join("\n\n");
}

export function buildBody(p) {
  const md = (p.markdown || "").trim() ? mdToHtml(p.markdown) : "";
  return stripScripts([md, (p.html || "").trim()].filter(Boolean).join("\n"));
}

export function buildDocument(p) {
  const title = escapeHtml((p.title || "").trim() || "Untitled site");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
${buildCss(p)}
</style>
</head>
<body>
<main class="page">
${buildBody(p)}
</main>
</body>
</html>
`;
}

/* Size of a string in kilobytes, one decimal. Call only in the browser or handlers. */
export function sizeKb(str) {
  const bytes = new TextEncoder().encode(String(str || "")).length;
  return Math.max(0.1, Math.round((bytes / 1024) * 10) / 10);
}

export function fileSlug(title) {
  return (String(title || "site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "site").slice(0, 50);
}

/* Trigger a download of text or bytes. Call only from an event handler. */
export function downloadFile(name, content, type = "text/html") {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}
