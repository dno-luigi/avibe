/* The Markdown, HTML and CSS guide on the home page. `live: true` marks where the full-width live sample goes (after CSS). */

export const GUIDE_HEADING = "A practical guide to building at the edge of a tiny page.";

export const GUIDE = [
  {
    id: "markdown-basics",
    title: "Markdown basics",
    paragraphs: [
      "Use Markdown when the content matters more than the markup. Headings create structure, blank lines separate paragraphs, hyphens make lists and square brackets create links.",
      "Raw HTML can sit beside Markdown when a section needs more control.",
    ],
    lang: "markdown",
    code: "# Friday Sketch Club\nA tiny page for the next meetup.\n\n- Bring a pencil\n- Bring a friend\n\n[Join the list](#contact)",
  },
  {
    id: "semantic-html",
    title: "Semantic HTML",
    paragraphs: [
      "Use elements for their meaning before reaching for generic containers. A page should normally have one main element, a clear heading order and labelled navigation.",
      "Sections need headings, buttons perform actions and links go somewhere.",
    ],
    lang: "html",
    code: '<header>\n  <nav aria-label="Primary">...</nav>\n</header>\n<main>\n  <section class="hero">\n    <h1>Friday Sketch Club</h1>\n  </section>\n</main>',
  },
  {
    id: "css-variables",
    title: "CSS variables",
    paragraphs: [
      "Put the decisions you will change most at the top.",
      "A small token set can recolour and reshape the whole page without hunting through every rule.",
    ],
    lang: "css",
    code: ":root {\n  --bg: #0b0d10;\n  --ink: #eef2f6;\n  --glow: #2dd4a3;\n  --space: clamp(1rem, 3vw, 3rem);\n}\nbody { background: var(--bg); color: var(--ink); }",
    live: true,
  },
  {
    id: "responsive-layout",
    title: "Responsive layout",
    paragraphs: [
      "Use grid, flexbox, min(), max() and clamp() to let the design adapt rather than merely shrink.",
      "Container queries are useful when a block must respond to its own width.",
    ],
    lang: "css",
    code: ".links {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));\n  gap: var(--space);\n}\n.title { font-size: clamp(3rem, 10vw, 8rem); }",
  },
  {
    id: "motion",
    title: "Motion",
    paragraphs: [
      "Animate opacity and transforms when possible.",
      "Motion should explain a change, not block the visitor, and every animated design needs a reduced-motion path.",
    ],
    lang: "css",
    code: "@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after {\n    animation: none !important;\n    scroll-behavior: auto !important;\n  }\n}",
  },
  {
    id: "accessibility",
    title: "Accessibility",
    paragraphs: [
      "Keep text readable, preserve visible keyboard focus, label every field and check contrast after changing a vibe.",
      "The default output uses semantic HTML and readable contrast, but extreme custom styling still needs review.",
    ],
  },
  {
    id: "export-and-publish",
    title: "Export and publish",
    paragraphs: [
      "Copy the source or download the page when you want to host it yourself.",
      "Building and previewing can work without an account. An account is required to publish through the builder.",
    ],
  },
];
