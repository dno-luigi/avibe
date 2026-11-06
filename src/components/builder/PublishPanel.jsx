import { useState } from "react";
import { ChevronDown, UserRound, Upload, X } from "lucide-react";
import { useUser, cn } from "@wron/kit";
import { Button } from "../ui";
import { useAuthDialog } from "../AuthDialog";
import { ExportActions } from "./ExportDrawer";

/* "Sign in to publish" accordion under the workspace. Signed in, it opens the publish sheet. */
export default function PublishPanel({ project, onPublish }) {
  const { user, loading } = useUser();
  const { openAuth } = useAuthDialog();
  const [open, setOpen] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const title = user ? "Publish your site" : "Sign in to publish";

  return (
    <section aria-labelledby="publish-h" className="rounded-theme border border-line bg-surface/60">
      <div className="flex items-center gap-2 pr-2">
        <h2 id="publish-h" className="flex-1 font-display text-[22px] font-[650]">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="publish-body"
            className="flex min-h-[56px] w-full items-center gap-4 px-5 text-left hover:text-primary"
          >
            <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted transition-transform duration-200", !open && "-rotate-90")} aria-hidden="true" />
            {title}
          </button>
        </h2>
        <button type="button" onClick={() => setDismissed(true)} aria-label="Hide this panel" className="inline-flex h-11 w-11 items-center justify-center rounded-theme text-muted hover:bg-ink/5 hover:text-ink">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div id="publish-body" className="grid gap-6 border-t border-line p-5 lg:grid-cols-[2fr_3fr] lg:p-8">
          <div>
            <UserRound className="h-9 w-9 text-primary" aria-hidden="true" />
            {loading ? (
              <p className="mt-4 text-muted" role="status">Checking your account...</p>
            ) : user ? (
              <>
                <p className="mt-4 text-[17px] text-ink">You are signed in.</p>
                <p className="text-[15px] text-muted">Name your site and publish it to a shareable link.</p>
                <Button size="lg" className="mt-5" onClick={onPublish}><Upload className="h-4 w-4" aria-hidden="true" />Publish</Button>
              </>
            ) : (
              <>
                <p className="mt-4 text-[17px] text-ink">You can keep building yet.</p>
                <p className="text-[15px] text-muted">An account is required to publish.</p>
                <Button
                  size="lg"
                  className="mt-5"
                  onClick={() => openAuth({ title: "Sign in to publish", intro: "You can keep building and previewing without an account. An account is required to publish.", onDone: () => setTimeout(onPublish, 50) })}
                >
                  Sign in
                </Button>
              </>
            )}
          </div>
          <div className="lg:border-l lg:border-line lg:pl-8">
            <ExportActions project={project} />
          </div>
        </div>
      )}
    </section>
  );
}
