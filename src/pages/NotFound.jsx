import { Page } from "@wron/kit";
import { Button } from "../components/ui";

export default function NotFound() {
  return (
    <Page title="Page not found" description="This page does not exist. Go back to Vibe Microsite Builder to describe a page and get a small site." noindex>
      <section className="mx-auto max-w-page px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p className="font-mono text-[14px] text-muted">404 · route not found<span className="code-caret ml-1" aria-hidden="true" /></p>
        <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.5rem,5vw,4.5rem)] font-[700] leading-[1.02] tracking-[-0.045em]">
          This page does not exist.
        </h1>
        <p className="mt-5 max-w-lg text-muted">The link may be old, or the address may have a typo. Start from the home page or go straight to the builder.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button to="/" size="lg">Go to the home page</Button>
          <Button to="/builder" variant="secondary" size="lg">Open builder</Button>
        </div>
      </section>
    </Page>
  );
}
