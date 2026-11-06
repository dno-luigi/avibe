import { useRef } from "react";
import { cn } from "@wron/kit";
import { CodeSkeleton } from "../ui";

const TABS = [
  { key: "markdown", label: "Markdown" },
  { key: "html", label: "HTML" },
  { key: "css", label: "CSS" },
];

export default function SourceEditor({ project, tab, setTab, onChange, generating, textareaRef }) {
  const gutter = useRef(null);
  const value = project[tab] || "";
  const count = Math.max(20, value.split("\n").length);
  const idx = TABS.findIndex((t) => t.key === tab);

  function onKey(e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (idx + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[n].key);
    document.getElementById("src-tab-" + TABS[n].key)?.focus();
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div role="tablist" aria-label="Source" onKeyDown={onKey} className="relative flex shrink-0 gap-1 border-b border-line px-3">
        {TABS.map((t) => (
          <button
            key={t.key}
            id={"src-tab-" + t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            tabIndex={tab === t.key ? 0 : -1}
            onClick={() => setTab(t.key)}
            className={cn(
              "relative min-h-[48px] px-3 text-[15px] font-[650] transition-colors duration-[140ms]",
              tab === t.key ? "text-ink" : "text-muted hover:text-ink"
            )}
          >
            {t.label}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-3 bottom-0 h-[2px] origin-left bg-primary shadow-[0_0_10px_rgba(45,212,163,0.8)] transition-transform duration-[140ms]",
                tab === t.key ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        ))}
      </div>
      <div className="relative flex min-h-0 flex-1">
        <div
          ref={gutter}
          aria-hidden="true"
          className="w-12 shrink-0 select-none overflow-hidden border-r border-line py-4 text-right font-mono text-[13px] leading-[22px] text-muted/60"
        >
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="pr-3">{i + 1}</div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          id="source-editor"
          aria-label={TABS[idx].label + " source"}
          value={value}
          wrap="off"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          onChange={(e) => onChange(tab, e.target.value)}
          onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.currentTarget.scrollTop; }}
          className="pane-scroll min-w-0 flex-1 resize-none bg-transparent px-4 py-4 font-mono text-[14px] leading-[22px] text-ink focus:outline-none focus-visible:outline-none"
        />
        {!value && !generating && (
          <p className="pointer-events-none absolute inset-x-12 top-40 mx-auto max-w-[360px] break-words whitespace-normal font-mono text-[14px] leading-7 text-muted">
            Generated source will appear here. You can also start typing.
          </p>
        )}
        {generating && (
          <div className="absolute inset-0 grid content-start gap-5 bg-bg/95 p-6" role="status" aria-live="polite">
            <div className="h-1 w-full overflow-hidden rounded bg-ink/10" role="progressbar" aria-label="Building your page">
              <div className="h-full w-1/3 animate-pulse rounded bg-primary" />
            </div>
            <CodeSkeleton rows={3} />
            <div>
              <p className="font-[650] text-ink">Building your page...</p>
              <p className="text-[15px] text-muted">Your prompt is safe while the source is prepared.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
