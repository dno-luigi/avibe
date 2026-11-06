import { ai } from "@wron/kit";
import { getVibe } from "../data/vibes";

/*
  AI generation. Works once the owner connects an AI key in Wron.
  generateSite({ prompt, vibe, current?, instruction? }) -> { title, markdown, html, css }
  Throws an Error with a message a visitor can read. Never returns a made-up result.
*/

const SYSTEM = `You write tiny single-page websites ("micro sites") for a builder tool.
Return ONLY a JSON object, no prose, no code fences:
{"title": string, "markdown": string, "html": string, "css": string}

Rules:
- "markdown" holds the page's content in Markdown (headings, paragraphs, lists, links). Use "## " sections with clear headings. One "# " heading only.
- "html" holds optional extra raw HTML sections appended after the Markdown (semantic elements: section, nav, figure, form-less buttons as links). It may be "".
- "css" holds the page's own CSS. The tool already defines these variables in :root and base rules for body, .page, headings, links, lists and buttons:
  --bg --surface --ink --muted --accent (colours), --font --display (font stacks), --space --radius --border (lengths), --motion (duration).
  Use those variables. Push styling hard: modern grid, clamp(), gradients, blend modes, @keyframes, scroll-snap, variable font axes, brutalist, retro and neon effects, whatever fits the brief.
- Always include a @media (prefers-reduced-motion: reduce) path for any animation, keep text contrast readable, keep visible focus styles.
- No JavaScript, no scripts of any kind, no external files, no frameworks, no web fonts. Keep the whole page small.
- Never invent real people's names, phone numbers, addresses or prices: use clear placeholders like "Your name" or "Add your date".`;

function extractJson(reply) {
  const text = typeof reply === "string" ? reply : reply?.content || reply?.text || reply?.message?.content || "";
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("The page could not be generated. Your prompt is still here.");
  let obj;
  try {
    obj = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new Error("The page could not be generated. Your prompt is still here.");
  }
  const out = {
    title: String(obj.title || "").slice(0, 80),
    markdown: String(obj.markdown || ""),
    html: String(obj.html || ""),
    css: String(obj.css || ""),
  };
  if (!out.markdown.trim() && !out.html.trim()) throw new Error("The page could not be generated. Your prompt is still here.");
  return out;
}

export async function generateSite({ prompt, vibe, current, instruction }) {
  const v = getVibe(vibe);
  let user = `Vibe: ${v.name} (${v.summary} Variables: ${v.variables}).\n\nThe page: ${prompt || "(no description)"}`;
  if (current && instruction) {
    user += `\n\nHere is the current source. Apply this change and return the full updated source: "${instruction}".\n\nMARKDOWN:\n${current.markdown || ""}\n\nHTML:\n${current.html || ""}\n\nCSS:\n${current.css || ""}`;
  }
  let reply;
  try {
    reply = await ai.chat([{ role: "user", content: user }], { system: SYSTEM });
  } catch (err) {
    const e = new Error("The page could not be generated. Your prompt is still here.");
    e.detail = err && err.message;
    throw e;
  }
  return extractJson(reply);
}
