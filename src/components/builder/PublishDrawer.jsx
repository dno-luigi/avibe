import { useEffect, useState } from "react";
import { Link } from "react-router";
import { UserRound, X, Check } from "lucide-react";
import { Sheet, useUser, toast } from "@wron/kit";
import { Button, Field } from "../ui";
import { useAuthDialog } from "../AuthDialog";
import { publishSite, shareUrl } from "../../lib/sites";
import { buildDocument, hasCode, copyText, downloadFile, fileSlug } from "../../lib/build";

export default function PublishDrawer({ open, onClose, project, onPublished }) {
  const { user, loading } = useUser();
  const { openAuth } = useAuthDialog();
  const [name, setName] = useState("");
  const [state, setState] = useState("idle"); // idle | pending | done | failed
  const [result, setResult] = useState(null);
  const has = hasCode(project);

  useEffect(() => {
    if (open) {
      setName(project.title && project.title !== "Untitled site" ? project.title : "");
      setState("idle");
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function run(e) {
    e && e.preventDefault();
    setState("pending");
    try {
      const row = await publishSite({ name: name.trim(), project, existingId: project.siteId });
      setResult(row);
      setState("done");
      onPublished && onPublished(row, name.trim());
    } catch {
      setState("failed");
    }
  }
  async function copyCode() {
    toast((await copyText(buildDocument(project))) ? "Code copied." : "Copy did not work.");
  }
  function html() {
    downloadFile(fileSlug(project.title) + ".html", buildDocument(project));
  }
  async function copyLink() {
    toast((await copyText(shareUrl(result.slug))) ? "Share link copied." : "Copy did not work.");
  }
  function handoff() {
    onClose();
    openAuth({ title: "Sign in to publish", intro: "You can keep building and previewing without an account. An account is required to publish.", onDone: () => setTimeout(() => window.dispatchEvent(new CustomEvent("vmb:publish")), 50) });
  }

  return (
    <Sheet open={open} onClose={onClose} side="right" panelClassName="w-[420px] max-w-full overflow-y-auto border-l border-line bg-surface p-6 text-ink">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-[28px] font-[650] leading-[1.1]">
          {!user && !loading ? "Sign in to publish" : state === "done" ? "Your site is live." : "Publish your site"}
        </h2>
        <button type="button" onClick={onClose} aria-label="Close publish panel" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-theme text-muted hover:bg-ink/5 hover:text-ink">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-muted" role="status">Checking your account...</p>
      ) : !user ? (
        <div className="mt-6">
          <UserRound className="h-9 w-9 text-primary" aria-hidden="true" />
          <p className="mt-4 text-[17px] text-ink">You can keep building and previewing without an account. An account is required to publish.</p>
          <div className="mt-6 grid gap-2">
            <Button size="lg" onClick={handoff}>Continue to sign in</Button>
            <Button size="lg" variant="ghost" onClick={onClose}>Not now</Button>
          </div>
        </div>
      ) : state === "done" && result ? (
        <div className="mt-6 grid gap-4">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary"><Check className="h-5 w-5" aria-hidden="true" /></span>
          <p className="break-all rounded-theme border border-line bg-[#0E1115] p-3 font-mono text-[14px] text-ink">{shareUrl(result.slug)}</p>
          <Button size="lg" onClick={copyLink}>Copy share link</Button>
          <Link to={`/s/${result.slug}`} className="inline-flex min-h-[44px] items-center text-[15px] text-primary hover:underline">Open your site</Link>
        </div>
      ) : (
        <form onSubmit={run} className="mt-6 grid gap-4">
          {!has && <p className="text-[15px] text-muted">Add some source or generate a page first, then publish it.</p>}
          <Field label="Site name" name="site-name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit" size="lg" disabled={state === "pending" || !has || !name.trim()} loading={state === "pending"}>
            {state === "pending" ? "Publishing your site..." : "Publish site"}
          </Button>
          {state === "failed" && (
            <div role="alert" className="rounded-theme border border-[#F87171]/40 bg-[#F87171]/[0.06] p-4">
              <p className="text-[15px] text-ink">Publishing is unavailable right now. Your work is saved. Copy the code, download it, or try again.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={run}>Retry</Button>
                <Button type="button" size="sm" variant="secondary" onClick={copyCode}>Copy code</Button>
                <Button type="button" size="sm" variant="secondary" onClick={html}>Download HTML</Button>
              </div>
            </div>
          )}
        </form>
      )}
    </Sheet>
  );
}
