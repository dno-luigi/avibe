/*
  The six built-in vibes. Each is a set of CSS variables (tokens) plus a few
  rules that use them. buildDocument() (src/lib/build.js) writes the tokens
  as :root variables, then BASE_CSS, then the project's CSS.

  Token keys: bg, surface, ink, muted, accent (hex colours), font, display (font stacks),
  space, radius, border (CSS lengths), motion (duration).
*/

export const FONT_OPTIONS = [
  { label: "System sans", value: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { label: "Heavy grotesk", value: "'Arial Black', 'Helvetica Neue', Arial, sans-serif" },
  { label: "Monospace", value: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace" },
  { label: "Classic serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Condensed poster", value: "Impact, 'Arial Narrow Bold', 'Franklin Gothic Bold', sans-serif" },
  { label: "Rounded", value: "ui-rounded, 'SF Pro Rounded', 'Nunito', system-ui, sans-serif" },
];

/* For the token controls: Colour, Font, Spacing, Borders, Motion */
export const TOKEN_GROUPS = [
  { group: "Colour", tokens: [
    { key: "bg", label: "Background", type: "color" },
    { key: "surface", label: "Surface", type: "color" },
    { key: "ink", label: "Text", type: "color" },
    { key: "muted", label: "Quiet text", type: "color" },
    { key: "accent", label: "Accent", type: "color" },
  ] },
  { group: "Font", tokens: [
    { key: "font", label: "Body font", type: "font" },
    { key: "display", label: "Heading font", type: "font" },
  ] },
  { group: "Spacing", tokens: [
    { key: "space", label: "Space", type: "range", min: 0.5, max: 5, step: 0.25, unit: "rem" },
  ] },
  { group: "Borders", tokens: [
    { key: "border", label: "Border width", type: "range", min: 0, max: 8, step: 1, unit: "px" },
    { key: "radius", label: "Corner radius", type: "range", min: 0, max: 32, step: 1, unit: "px" },
  ] },
  { group: "Motion", tokens: [
    { key: "motion", label: "Motion speed", type: "range", min: 0, max: 1200, step: 20, unit: "ms" },
  ] },
];

export const BASE_CSS = `*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font);line-height:1.6;-webkit-font-smoothing:antialiased}
.page{max-width:62rem;margin:0 auto;padding:var(--space);display:grid;gap:calc(var(--space) * .75)}
h1,h2,h3,h4{font-family:var(--display);line-height:1.05;margin:0 0 .35em}
h1{font-size:clamp(2.5rem,8vw,5.5rem)}
h2{font-size:clamp(1.6rem,4vw,2.6rem)}
h3{font-size:clamp(1.2rem,2.4vw,1.6rem)}
p{margin:0 0 1em;max-width:62ch}
a{color:var(--accent);text-underline-offset:.2em}
a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
img{max-width:100%;height:auto;display:block}
ul,ol{padding-left:1.25em;margin:0 0 1em}
pre{overflow:auto;padding:1rem;background:var(--surface);border:var(--border) solid var(--muted);border-radius:var(--radius)}
code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.9em}
blockquote{margin:0 0 1em;padding-left:1rem;border-left:calc(var(--border) + 2px) solid var(--accent)}
hr{border:0;border-top:var(--border) solid var(--muted);margin:var(--space) 0}
button,.button{font:inherit;cursor:pointer;background:var(--accent);color:var(--bg);border:var(--border) solid var(--ink);border-radius:var(--radius);padding:.7em 1.2em;transition:transform var(--motion) ease}
@media (prefers-reduced-motion: reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`;

export const VIBES = [
  {
    id: "clean-minimal",
    name: "Clean minimal",
    tags: ["quiet"],
    short: "Quiet spacing, crisp type and almost no decoration.",
    summary: "Quiet spacing, crisp type and almost no decoration.",
    variables: "light canvas, dark text, fine rules, low motion",
    sample: "Quiet notes",
    tokens: { bg: "#FAFAF7", surface: "#FFFFFF", ink: "#16181B", muted: "#5E636B", accent: "#1F5FD1", font: FONT_OPTIONS[0].value, display: FONT_OPTIONS[0].value, space: "2.5rem", radius: "6px", border: "1px", motion: "200ms" },
    css: `h1{font-weight:600;letter-spacing:-.04em}
h2{font-weight:600;letter-spacing:-.02em;padding-top:var(--space);border-top:var(--border) solid color-mix(in srgb,var(--ink) 15%,transparent)}
a{text-decoration-thickness:1px}
a:hover{text-decoration-thickness:2px}`,
  },
  {
    id: "neo-brutalist",
    name: "Neo-brutalist",
    tags: ["loud"],
    short: "Heavy rules, direct colour and unapologetic structure.",
    summary: "Heavy borders, direct colour and unapologetic structure.",
    variables: "hard contrast, thick rules, abrupt motion",
    sample: "Loud page",
    tokens: { bg: "#F4F1E8", surface: "#FFE14D", ink: "#000000", muted: "#222222", accent: "#E8361E", font: "'Helvetica Neue', Arial, sans-serif", display: FONT_OPTIONS[1].value, space: "2rem", radius: "0px", border: "4px", motion: "90ms" },
    css: `h1{text-transform:uppercase;letter-spacing:-.03em;background:var(--surface);border:var(--border) solid var(--ink);box-shadow:8px 8px 0 var(--ink);padding:.15em .25em;display:inline-block}
h2{text-transform:uppercase;border-bottom:var(--border) solid var(--ink);padding-bottom:.2em}
a{color:var(--ink);background:var(--accent);padding:0 .2em;text-decoration:none;font-weight:700}
a:hover{background:var(--ink);color:var(--bg)}
button,.button{box-shadow:6px 6px 0 var(--ink);transition:transform var(--motion) steps(2),box-shadow var(--motion) steps(2)}
button:hover,.button:hover{transform:translate(6px,6px);box-shadow:0 0 0 var(--ink)}`,
  },
  {
    id: "retro-terminal",
    name: "Retro terminal",
    tags: ["dark", "loud"],
    short: "Phosphor colour, monospaced rhythm and command-line framing.",
    summary: "Phosphor colour and command-line framing.",
    variables: "mono type, green glow, compact spacing",
    sample: "hello_world",
    tokens: { bg: "#050A06", surface: "#0B140D", ink: "#A6FFB8", muted: "#62B276", accent: "#39FF6A", font: FONT_OPTIONS[2].value, display: FONT_OPTIONS[2].value, space: "1.5rem", radius: "0px", border: "1px", motion: "120ms" },
    css: `body{text-shadow:0 0 6px color-mix(in srgb,var(--accent) 55%,transparent)}
body::after{content:"";position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0 1px,transparent 1px 3px)}
h1::before{content:"> ";color:var(--muted)}
h1::after{content:"";display:inline-block;width:.55em;height:.9em;margin-left:.15em;background:var(--accent);animation:blink 1s steps(1) infinite;vertical-align:-.05em}
h2::before{content:"## ";color:var(--muted)}
li::marker{content:"$ "}
@keyframes blink{50%{opacity:0}}`,
  },
  {
    id: "glassy-gradient",
    name: "Glassy gradient",
    tags: ["quiet"],
    short: "Layered light, translucent surfaces and soft colour fields.",
    summary: "Translucent layers over soft colour fields.",
    variables: "blurred surfaces, luminous gradient, gentle motion",
    sample: "Soft light",
    tokens: { bg: "#2A1B5C", surface: "#FFFFFF", ink: "#FFFFFF", muted: "#E6DEFF", accent: "#FFB3E6", font: FONT_OPTIONS[5].value, display: FONT_OPTIONS[0].value, space: "2.5rem", radius: "22px", border: "1px", motion: "600ms" },
    css: `body{min-height:100vh;background:radial-gradient(60% 50% at 15% 10%,#ff8ad8 0,transparent 60%),radial-gradient(55% 50% at 90% 20%,#6c8bff 0,transparent 60%),radial-gradient(70% 60% at 50% 100%,#36d6c8 0,transparent 60%),var(--bg);background-attachment:fixed}
.page>*{background:color-mix(in srgb,var(--surface) 12%,transparent);border:var(--border) solid color-mix(in srgb,var(--surface) 35%,transparent);border-radius:var(--radius);padding:var(--space);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.page>hr{display:none}
h1{font-weight:700;letter-spacing:-.03em}
a{color:var(--ink)}`,
  },
  {
    id: "zine-print",
    name: "Zine / print",
    tags: ["loud"],
    short: "Editorial type, hard crops and deliberately irregular composition.",
    summary: "Editorial type and deliberately irregular composition.",
    variables: "paper colour, hard crops, mixed scale",
    sample: "Issue 01",
    tokens: { bg: "#F2EBDD", surface: "#FFFDF6", ink: "#141210", muted: "#4A443C", accent: "#D42A16", font: FONT_OPTIONS[3].value, display: FONT_OPTIONS[4].value, space: "2rem", radius: "0px", border: "2px", motion: "300ms" },
    css: `h1{text-transform:uppercase;font-size:clamp(3rem,12vw,8rem);letter-spacing:-.02em;transform:rotate(-2deg);margin-left:-.05em}
h2{display:inline-block;background:var(--accent);color:var(--surface);padding:.1em .35em;transform:rotate(1.5deg)}
.page>:nth-child(odd){margin-left:calc(var(--space) * .5)}
img{filter:grayscale(1) contrast(1.3);border:var(--border) solid var(--ink)}
blockquote{font-size:1.4em;font-style:italic}`,
  },
  {
    id: "dark-neon",
    name: "Dark neon",
    tags: ["dark", "loud"],
    short: "Deep surfaces, luminous edges and restrained glow.",
    summary: "Deep surfaces with controlled luminous edges.",
    variables: "charcoal canvas, bright focus colour, precise glow",
    sample: "Launch night",
    tokens: { bg: "#0B0D10", surface: "#12161B", ink: "#EEF2F6", muted: "#9AA4B1", accent: "#2DD4A3", font: FONT_OPTIONS[0].value, display: FONT_OPTIONS[0].value, space: "2.5rem", radius: "10px", border: "1px", motion: "400ms" },
    css: `h1{font-weight:800;letter-spacing:-.04em;text-shadow:0 0 28px color-mix(in srgb,var(--accent) 55%,transparent);animation:glow calc(var(--motion) * 6) ease-in-out infinite alternate}
h2{color:var(--accent)}
.page>section,.page>pre{background:var(--surface);border:var(--border) solid color-mix(in srgb,var(--accent) 45%,transparent);border-radius:var(--radius);padding:var(--space);box-shadow:0 0 24px -10px var(--accent)}
a{text-shadow:0 0 12px color-mix(in srgb,var(--accent) 60%,transparent)}
@keyframes glow{to{text-shadow:0 0 44px color-mix(in srgb,var(--accent) 80%,transparent)}}`,
  },
];

export const DEFAULT_VIBE_ID = "dark-neon";

export function getVibe(id) {
  return VIBES.find((v) => v.id === id) || VIBES.find((v) => v.id === DEFAULT_VIBE_ID);
}

/* Filters on /vibes: they only reorganize the six built-in vibes. */
export const VIBE_FILTERS = [
  { key: "all", label: "All" },
  { key: "quiet", label: "Quiet" },
  { key: "loud", label: "Loud" },
  { key: "dark", label: "Dark" },
];

/* Plain starter content used when someone picks a vibe before writing anything. */
export const STARTER_MARKDOWN = `# Your page title
One line about what this page is for.

## What to know
- The first detail
- The second detail
- The third detail

[Get in touch](#contact)`;
