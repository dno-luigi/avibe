/* Copy the home page and builder share. All wording from the approved direction. */

export const EXAMPLE_PROMPTS = [
  "Make a dark neon launch page",
  "Create a one-page event invite",
  "Build a tiny portfolio with three projects",
  "Design a playful cafe menu",
  "Make a link page that feels like a zine",
  "Create a bold announcement page",
];

export const HOME_PLACEHOLDER =
  "A one-page invite with an oversized date, a playful RSVP section and a warm retro look...";

export const BUILDER_PLACEHOLDER =
  "A dark neon launch page for a side project, with a bold hero, three links and a contact section...";

export const REFINEMENTS = ["Make it bolder", "Add a contact section", "Reduce the motion", "Improve the contrast"];

export const BLOCKS = [
  { id: "hero", label: "Hero", markdown: `# A bold headline\nOne sentence that says what this page is for.\n\n[Start here](#contact)` },
  { id: "links", label: "Links", markdown: `## Links\n- [First link](#first)\n- [Second link](#second)\n- [Third link](#third)` },
  { id: "gallery", label: "Gallery", markdown: `## Gallery\n<div class="gallery" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:var(--space)">\n  <figure><figcaption>First piece</figcaption></figure>\n  <figure><figcaption>Second piece</figcaption></figure>\n  <figure><figcaption>Third piece</figcaption></figure>\n</div>` },
  { id: "faq", label: "FAQ", markdown: `## Questions\n### What is this?\nA short answer.\n\n### How do I join?\nA short answer.` },
  { id: "contact", label: "Contact", markdown: `## Contact\nWrite to your email address, or add a contact link here.` },
  { id: "footer", label: "Footer", markdown: `---\nMade with care. Last updated today.` },
];

export const SMALL_ON_PURPOSE = [
  { n: "01", title: "Single-file thinking.", body: "Keep the final page compact and easy to take with you." },
  { n: "02", title: "Code you can touch.", body: "Work in Markdown, add raw HTML, and change the CSS directly." },
  { n: "03", title: "Styling without the training wheels.", body: "Explore modern grids, variable fonts, gradients, animation, brutalist layouts, retro systems and neon effects." },
];

export const PROCESS = [
  { n: 1, title: "Describe.", body: "Say what the page is for, what it should contain and how it should feel." },
  { n: 2, title: "Shape.", body: "Pick a vibe, add blocks, adjust colour, type and spacing, or edit the source yourself." },
  { n: 3, title: "Take it with you.", body: "Copy the code, download a single HTML file or ZIP, or sign in to publish a shareable link." },
];

export const FAQ = [
  { q: "Do I need an account?", a: "You can build and preview without one. You need an account when you publish." },
  { q: "What can I make?", a: "Link pages, one-page invites, landing pages, mini portfolios, menus, announcements and other focused micro sites." },
  { q: "Can I edit the generated code?", a: "Yes. Edit Markdown, raw HTML and CSS directly, or adjust colour, font and spacing controls." },
  { q: "What can I export?", a: "Copy the code, download a single HTML file or download a ZIP." },
  { q: "What are the free and paid limits?", a: "Free use has limits and paid access provides more. Exact limits and prices are not yet set." },
  { q: "Are custom domains supported?", a: "Custom domain support has not been confirmed." },
  { q: "What happens if generation or publishing is unavailable?", a: "Your text stays in place. You can retry, copy the code or download your work rather than receiving a made-up result." },
  { q: "Will the pages be accessible?", a: "The default output uses semantic HTML and readable contrast. The preview also lets you check phone, tablet and desktop widths, but custom styling still needs review." },
];

export const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const PLANS = {
  free: { title: "Free with limits", body: "Build and preview before signing in. The product will show the applicable limits before an action uses them.", action: "Start building" },
  paid: { title: "Paid for more", body: "Exact allowances and prices are not yet set.", action: "Ask about paid access" },
  note: "An account is required to publish. Building and previewing can work without one.",
};
