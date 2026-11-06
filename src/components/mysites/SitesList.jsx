import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useTable, toast, cn } from "@wron/kit";
import { Button, CodeSkeleton, Select, StateMessage } from "../ui";
import { VIBES } from "../../data/vibes";
import { builderPath, loadProject, saveProject, timeAgo } from "../../lib/project";
import { rowToProject, shareUrl, unpublishSite, deleteSite } from "../../lib/sites";
import { copyText } from "../../lib/build";

const COLS = "lg:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_9rem_10rem_minmax(0,17rem)]";

function Row({ row, onChanged }) {
  const navigate = useNavigate();
  const [more, setMore] = useState(false);
  const [busy, setBusy] = useState(false);
  const published = row.status === "published";
  const when = timeAgo(row.updated_at || row.created_at);

  async function run(fn, msg) {
    setBusy(true);
    try {
      await fn();
      toast.success(msg);
      onChanged();
    } catch (e) {
      toast.error((e && e.message) || "That did not work. Try again.");
    } finally {
      setBusy(false);
      setMore(false);
    }
  }
  const act = "inline-flex h-11 items-center rounded-theme px-3 text-[14px] font-[600] text-ink transition-colors hover:bg-ink/10 lg:h-9";

  return (
    <li className="block-in rounded-theme border border-line bg-surface/60 p-4 lg:rounded-none lg:border-0 lg:border-b lg:bg-transparent lg:px-4 lg:py-3">
      <div className={cn("grid gap-2 lg:items-center lg:gap-4", COLS.replace("lg:", "lg:").length && "lg:grid " + COLS)}>
        <p className="font-[650] text-ink">{row.name || "Untitled site"}</p>
        <p className="min-w-0 break-all font-mono text-[14px] text-muted">
          {published ? (
            <a href={`/s/${row.slug}`} className="hover:text-primary">/s/{row.slug}</a>
          ) : (
            <span>/s/{row.slug}</span>
          )}
        </p>
        <p className="text-[14px]">
          <span className={cn("inline-flex items-center gap-2", published ? "text-primary" : "text-muted")}>
            <span className={cn("h-2 w-2 rounded-full", published ? "bg-primary shadow-[0_0_8px_#2DD4A3]" : "bg-muted")} aria-hidden="true" />
            {published ? "Published" : "Unpublished"}
          </span>
        </p>
        <p className="text-[14px] text-muted">{when}</p>
        <div className="-mx-1 mt-1 flex flex-wrap items-center gap-1 lg:mx-0 lg:mt-0 lg:justify-end">
          {published && <Link to={`/s/${row.slug}`} className={act}>Open</Link>}
          <button
            type="button"
            className={act}
            onClick={() => {
              saveProject(rowToProject(row));
              navigate("/builder");
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className={act}
            onClick={async () => ((await copyText(shareUrl(row.slug))) ? toast.success("Link copied.") : toast.error("Could not copy the link."))}
          >
            Copy link
          </button>
          <button type="button" className={act} aria-expanded={more} onClick={() => setMore((m) => !m)}>
            More
          </button>
        </div>
      </div>
      {more && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3 lg:justify-end">
          {published ? (
            <Button variant="secondary" size="sm" disabled={busy} onClick={() => run(() => unpublishSite(row.id), "Site unpublished.")}>
              Unpublish
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={() => run(() => import("../../lib/sites").then((m) => m.publishSite({ name: row.name, project: rowToProject(row), existingId: row.id })), "Site published.")}
            >
              Publish again
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            disabled={busy}
            onClick={() => window.confirm(`Delete "${row.name}"? This cannot be undone.`) && run(() => deleteSite(row.id), "Site deleted.")}
          >
            Delete
          </Button>
        </div>
      )}
    </li>
  );
}

export default function SitesList() {
  const navigate = useNavigate();
  const { rows, loading, error, reload } = useTable("sites");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("updated");

  const mine = useMemo(() => {
    const list = (rows || []).filter((r) => r.mine);
    const needle = q.trim().toLowerCase();
    const filtered = needle ? list.filter((r) => `${r.name} ${r.slug}`.toLowerCase().includes(needle)) : list;
    return [...filtered].sort((a, b) =>
      sort === "name"
        ? String(a.name).localeCompare(String(b.name))
        : new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
    );
  }, [rows, q, sort]);
  const total = (rows || []).filter((r) => r.mine).length;

  function openDraft() {
    if (loadProject()) navigate("/builder");
    else toast("No local draft yet. Start with a prompt.");
  }

  if (loading)
    return (
      <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8" aria-busy="true">
        <h1 className="mb-6 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-[650] tracking-[-0.03em]">My sites</h1>
        <p role="status" className="mb-4 font-mono text-[14px] text-muted">Loading your sites...</p>
        <CodeSkeleton rows={4} />
      </section>
    );

  if (error)
    return (
      <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-display text-[clamp(1.75rem,3vw,2.25rem)] font-[650] tracking-[-0.03em]">My sites</h1>
        <StateMessage
          tone="error"
          title="Your sites could not be loaded."
          actions={
            <>
              <Button size="md" onClick={reload}>Retry</Button>
              <Button variant="secondary" size="md" onClick={openDraft}>Open local draft</Button>
            </>
          }
        >
          Your drafts are still saved in this browser.
        </StateMessage>
      </section>
    );

  if (total === 0)
    return (
      <section className="mx-auto grid max-w-page gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-6">
          <h1 className="font-display text-[clamp(1.75rem,3.2vw,2.25rem)] font-[650] leading-[1.1] tracking-[-0.03em]">No sites yet.</h1>
          <p className="mt-3 text-[17px] text-muted">Start with a prompt or pick a vibe.</p>
          <Button to="/builder" size="lg" className="mt-6">Start with a prompt</Button>
        </div>
        <nav aria-label="Start with a vibe" className="lg:col-span-5 lg:col-start-8">
          <ul className="grid grid-cols-2 gap-x-4 lg:grid-cols-1">
            {VIBES.map((v) => (
              <li key={v.id}>
                <Link
                  to={builderPath({ vibe: v.id })}
                  className="group inline-flex min-h-[44px] items-center gap-2 text-[17px] font-[550] text-ink hover:text-primary"
                >
                  {v.name}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    );

  return (
    <section className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-[clamp(1.75rem,3vw,2.25rem)] font-[650] tracking-[-0.03em]">My sites</h1>
        <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-[16rem_11rem]">
          <div className="grid gap-2">
            <label htmlFor="site-search" className="text-[15px] font-[600]">Search sites</label>
            <input
              id="site-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-12 w-full rounded-theme border border-line bg-[#0E1115] px-4 text-[16px] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <Select label="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="updated">Last updated</option>
            <option value="name">Name</option>
          </Select>
        </div>
      </div>

      <div
        className={cn(
          "sticky top-14 z-20 mt-6 hidden gap-4 border-b border-line bg-bg px-4 py-3 font-mono text-[13px] text-muted lg:grid",
          COLS
        )}
      >
        <span>Site</span>
        <span>Address</span>
        <span>Status</span>
        <span>Last updated</span>
        <span className="text-right">Actions</span>
      </div>

      {mine.length === 0 ? (
        <p role="status" className="mt-6 text-[15px] text-muted">No sites match "{q}".</p>
      ) : (
        <ul className="mt-4 grid gap-3 lg:mt-0 lg:gap-0">
          {mine.map((r) => (
            <Row key={r.id} row={r} onChanged={reload} />
          ))}
        </ul>
      )}
    </section>
  );
}
