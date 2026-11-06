import { Page } from "@wron/kit";
import { CONTACT } from "../data/site";

export default function Privacy() {
  return (
    <Page title="Privacy" description="What Vibe Microsite Builder collects when you build, sign in, publish a site or send a message, where it goes and how to ask for a copy or deletion.">
      <section className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="prose prose-invert max-w-2xl prose-headings:font-display prose-headings:tracking-[-0.02em] prose-a:text-primary">
          <h1>Privacy</h1>
          <p>Written November 4, 2026. This page says what Vibe Microsite Builder collects and why, in plain words.</p>

          <h2>Building and previewing</h2>
          <p>You can build and preview without an account. Your prompt, your code, your chosen vibe and your editor layout are saved in your own browser so your work is there when you come back. They are not sent to us unless you generate a page, sign in or publish.</p>

          <h2>Generating a page</h2>
          <p>When you press Generate or ask for a change, your prompt and your current code are sent to the AI service connected to this tool so it can write the page. Do not put private details in a prompt.</p>

          <h2>Accounts</h2>
          <p>An account is required to publish. When you create one we keep your name (if you give it), your email and a secure form of your password, so you can sign in and see your sites.</p>

          <h2>Published sites</h2>
          <p>When you publish, the site's name, its Markdown, HTML and CSS, and the finished page are saved with your account. A published page can be seen by anyone with its link. You can unpublish or delete it from My sites.</p>

          <h2>Messages</h2>
          <p>The contact form sends your name, email and message to the project's inbox and email so we can reply. We use it only to answer you.</p>

          <h2>Cookies</h2>
          <p>The site uses the storage your browser needs to keep your drafts and keep you signed in. If any measuring tools are switched on later, you will be asked first, and you can change your choice with Cookie settings at the bottom of every page.</p>

          <h2>Your choices</h2>
          <p>To ask for a copy of your data or to have it deleted, email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> or call <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>.</p>
        </div>
      </section>
    </Page>
  );
}
