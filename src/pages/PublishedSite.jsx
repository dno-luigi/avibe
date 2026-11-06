import { useParams, Link } from "react-router";
import { Page, useTable } from "@wron/kit";
import { Button, StateMessage } from "../components/ui";

/* A published micro site at /s/:slug, shown full screen in a sandboxed frame. */
export default function PublishedSite() {
  const { slug } = useParams();
  const { rows, loading, error, reload } = useTable("sites", { where: { slug }, limit: 1 });
  const site = rows && rows[0];
  const live = site && site.status === "published" && site.output;

  return (
    <Page title={site?.name || "Published site"} description={`${site?.name || "A micro site"} made with Vibe Microsite Builder: a small page in Markdown, HTML and CSS.`}>
      {loading ? (
        <div className="flex h-[100svh] items-center justify-center">
          <p className="font-mono text-[14px] text-muted">Loading the page...<span className="code-caret ml-1" aria-hidden="true" /></p>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-lg px-4 py-24">
          <StateMessage tone="error" title="This page could not load." actions={<Button onClick={reload}>Retry</Button>}>
            Check your connection and try again.
          </StateMessage>
        </div>
      ) : !live ? (
        <div className="mx-auto max-w-lg px-4 py-24">
          <h1 className="font-display text-[32px] font-[700] tracking-[-0.03em]">This page is not published.</h1>
          <p className="mt-3 text-muted">The link may be old, or its owner took the page down.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/builder" size="lg">Build your own page</Button>
            <Button to="/" variant="secondary" size="lg">Go home</Button>
          </div>
        </div>
      ) : (
        <div className="flex h-[100svh] flex-col">
          <h1 className="sr-only">{site.name}</h1>
          <iframe title={site.name} sandbox="" srcDoc={site.output} className="block w-full flex-1 border-0 bg-white" />
          <div className="flex h-11 items-center justify-between border-t border-line bg-bg px-4 text-[14px] text-muted">
            <span className="truncate">{site.name}</span>
            <Link to="/" className="inline-flex h-11 items-center hover:text-ink">
              Made with <span className="ml-1 text-primary">Vibe</span>&nbsp;Microsite Builder
            </Link>
          </div>
        </div>
      )}
    </Page>
  );
}
