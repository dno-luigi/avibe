import { Page } from "@wron/kit";
import { CONTACT } from "../data/site";

export default function Terms() {
  return (
    <Page title="Terms" description="The terms for using Vibe Microsite Builder: building, previewing, exporting and publishing small Markdown, HTML and CSS sites.">
      <section className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="prose prose-invert max-w-2xl prose-headings:font-display prose-headings:tracking-[-0.02em] prose-a:text-primary">
          <h1>Terms</h1>
          <p>Written November 4, 2026.</p>

          <h2>What the tool does</h2>
          <p>Vibe Microsite Builder turns a plain description into a small page written in Markdown, HTML and CSS. You can edit the code, preview it, copy it, download it as a single HTML file or a ZIP, and, with an account, publish it to a shareable link.</p>

          <h2>Free and paid use</h2>
          <p>The tool is free with limits, and paid access gives you more. Exact limits and prices are not yet set. The tool will show the limits that apply before an action uses them.</p>

          <h2>Your pages</h2>
          <p>The pages you make are yours. You are responsible for what you publish, including text, links and pictures, and for checking that custom styling stays readable and accessible.</p>

          <h2>Generated code</h2>
          <p>Generated code is a starting point. Review it before you rely on it. If generation or publishing is unavailable, the tool says so and keeps your work; it never shows a made-up result.</p>

          <h2>Published links</h2>
          <p>Anyone with the link can see a published page. You can unpublish or delete your sites from My sites.</p>

          <h2>Contact</h2>
          <p>Questions about these terms: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>.</p>
        </div>
      </section>
    </Page>
  );
}
