/*
  A small Markdown to HTML converter for the builder.
  Supports: # headings (with ids), paragraphs, **bold**, *italic*, ~~strike~~, `code`,
  fenced code blocks, links, images, - / * / + lists, 1. lists, > quotes, --- rules,
  and raw HTML blocks (any block starting with "<" passes through as written).
*/

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function safeUrl(u) {
  return /^\s*(javascript|vbscript|data:text\/html)/i.test(u) ? "#" : u;
}

export function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

function inline(text) {
  const codes = [];
  let s = text.replace(/`([^`]+)`/g, (_, c) => {
    codes.push(`<code>${escapeHtml(c)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  s = escapeHtml(s);
  s = s
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+&quot;([^&]*)&quot;)?\)/g, (_, alt, url) => ["<", "img src=\"", safeUrl(url), "\" alt=\"", alt, "\">"].join(""))
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, url) => `<a href="${safeUrl(url)}">${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>")
    .replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/ {2,}\n/g, "<br>\n");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)]);
}

const RE = {
  fence: /^\s*(```|~~~)\s*([\w-]*)\s*$/,
  heading: /^(#{1,6})\s+(.*?)\s*#*\s*$/,
  hr: /^\s*([-*_])(\s*\1){2,}\s*$/,
  quote: /^\s*>\s?/,
  ul: /^\s*[-*+]\s+/,
  ol: /^\s*\d+[.)]\s+/,
  html: /^\s*<[a-zA-Z!/]/,
};

function startsBlock(line) {
  return RE.fence.test(line) || RE.heading.test(line) || RE.hr.test(line) || RE.quote.test(line) || RE.ul.test(line) || RE.ol.test(line) || RE.html.test(line);
}

export function mdToHtml(md) {
  const lines = String(md || "").replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    const fence = line.match(RE.fence);
    if (fence) {
      const buf = [];
      i++;
      while (i < lines.length && !RE.fence.test(lines[i])) buf.push(lines[i++]);
      i++;
      const cls = fence[2] ? ` class="language-${fence[2]}"` : "";
      out.push(`<pre><code${cls}>${escapeHtml(buf.join("\n"))}</code></pre>`);
      continue;
    }

    const h = line.match(RE.heading);
    if (h) {
      const level = h[1].length;
      const html = inline(h[2]);
      out.push(`<h${level} id="${slugify(h[2])}">${html}</h${level}>`);
      i++;
      continue;
    }

    if (RE.hr.test(line)) { out.push("<hr>"); i++; continue; }

    if (RE.quote.test(line)) {
      const buf = [];
      while (i < lines.length && lines[i].trim() && RE.quote.test(lines[i])) buf.push(lines[i++].replace(RE.quote, ""));
      out.push(`<blockquote>${mdToHtml(buf.join("\n"))}</blockquote>`);
      continue;
    }

    if (RE.ul.test(line) || RE.ol.test(line)) {
      const ordered = RE.ol.test(line);
      const re = ordered ? RE.ol : RE.ul;
      const items = [];
      while (i < lines.length && lines[i].trim()) {
        if (re.test(lines[i])) items.push(lines[i].replace(re, ""));
        else if (/^\s{2,}/.test(lines[i]) && items.length) items[items.length - 1] += " " + lines[i].trim();
        else break;
        i++;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
      continue;
    }

    if (RE.html.test(line)) {
      const buf = [];
      while (i < lines.length && lines[i].trim()) buf.push(lines[i++]);
      out.push(buf.join("\n"));
      continue;
    }

    const buf = [];
    while (i < lines.length && lines[i].trim() && (buf.length === 0 || !startsBlock(lines[i]))) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join("\n"))}</p>`);
  }
  return out.join("\n");
}
