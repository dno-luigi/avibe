import { useEffect, useState } from "react";
import { Sparkles, LayoutTemplate, Link2, LayoutGrid, MessageSquare, Mail, AlignJustify, Palette, Type, Square, Zap, ChevronRight, ChevronDown, X } from "lucide-react";
import { Sheet, cn } from "@wron/kit";
import { Button, StateMessage } from "../ui";
import TokenControls from "./TokenControls";
import { BUILDER_PLACEHOLDER, REFINEMENTS, BLOCKS } from "../../data/content";
import { VIBES, TOKEN_GROUPS } from "../../data/vibes";

const BLOCK_ICONS = { hero: LayoutTemplate, links: Link2, gallery: LayoutGrid, faq: MessageSquare, contact: Mail, footer: AlignJustify };
const GROUP_ICONS = { Colour: Palette, Font: Type, Spacing: LayoutGrid, Borders: Square, Motion: Zap };

const tile = "inline-flex min-h-[44px] items-center justify-center rounded-theme border border-line bg-surface px-3 text-center text-[14px] leading-[1.25] text-ink transition-colors duration-150 hover:border-primary/60 hover:bg-[#161B21] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45";

export default function PromptRail({ project, onPrompt, onGenerate, generating, genError, onRetry, onKeepEditing, onRefine, onBlock, onVibe, onToken, hasCode }) {
  const [open, setOpen] = useState(null);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const f = () => setSmall(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  const sheetGroup = small ? TOKEN_GROUPS.find((g) => g.group === open) : null;
  const heading = "font-[650] text-[16px] text-ink";

  return (
    <div className="pane-scroll h-full overflow-y-auto p-4 lg:p-5">
      <h2 className="font-display text-[clamp(1.75rem,2.2vw,2.25rem)] font-[650] leading-[1.1] tracking-[-0.02em]">
        <label htmlFor="builder-prompt">Describe the page you want</label>
      </h2>
      <textarea
        id="builder-prompt"
        rows={6}
        value={project.prompt || ""}
        onChange={(e) => onPrompt(e.target.value)}
        placeholder={BUILDER_PLACEHOLDER}
        className="mt-4 w-full resize-y rounded-theme border border-line bg-[#0E1115] px-4 py-3 text-[16px] leading-[1.55] text-ink placeholder:text-muted/70 hover:border-[#3A4552] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
      <Button size="lg" className="mt-3 w-full" onClick={() => onGenerate()} disabled={generating} loading={generating}>
        {!generating && <Sparkles className="h-4 w-4" aria-hidden="true" />}
        {generating ? "Building your page..." : "Generate"}
      </Button>
      {genError && (
        <StateMessage
          tone="error"
          className="mt-3"
          title="The page could not be generated. Your prompt is still here."
          actions={
            <>
              <Button variant="secondary" size="sm" onClick={onRetry}>Retry</Button>
              <Button variant="secondary" size="sm" onClick={onKeepEditing}>Keep editing</Button>
            </>
          }
        >
          {genError !== true && genError}
        </StateMessage>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <h3 className={heading}>Refine your idea</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {REFINEMENTS.map((r) => (
            <button key={r} type="button" className={tile} disabled={generating || !hasCode} onClick={() => onRefine(r)}>{r}</button>
          ))}
        </div>
        {!hasCode && <p className="mt-2 text-[14px] text-muted">Generate or write some source first, then refine it.</p>}
      </div>

      <div className="mt-6">
        <h3 className={heading}>Add a block</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {BLOCKS.map((b) => {
            const Icon = BLOCK_ICONS[b.id] || LayoutGrid;
            return (
              <button key={b.id} type="button" className={cn(tile, "min-h-[76px] flex-col gap-2")} onClick={() => onBlock(b)}>
                <Icon className="h-5 w-5 text-muted" aria-hidden="true" />
                {b.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="vibe-select" className={heading}>Choose a vibe</label>
        <div className="relative mt-3">
          <Sparkles className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <select
            id="vibe-select"
            value={project.vibe}
            onChange={(e) => onVibe(e.target.value)}
            className="h-12 w-full rounded-theme border border-line bg-[#0E1115] pl-10 pr-3 text-[16px] text-ink hover:border-[#3A4552] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {VIBES.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 pb-4">
        <h3 className={heading}>Design tokens</h3>
        <ul className="mt-3 grid gap-2">
          {TOKEN_GROUPS.map((g) => {
            const Icon = GROUP_ICONS[g.group] || Palette;
            const isOpen = open === g.group && !small;
            return (
              <li key={g.group} className="sweep rounded-theme border border-line bg-surface">
                <button
                  type="button"
                  aria-expanded={open === g.group}
                  onClick={() => setOpen(open === g.group ? null : g.group)}
                  className="flex min-h-[48px] w-full items-center gap-3 px-3 text-left text-[15px] text-ink"
                >
                  <Icon className="h-5 w-5 text-muted" aria-hidden="true" />
                  <span className="flex-1">{g.group}</span>
                  {isOpen ? <ChevronDown className="h-4 w-4 text-muted" aria-hidden="true" /> : <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />}
                </button>
                {isOpen && (
                  <div className="border-t border-line p-4">
                    <TokenControls group={g} tokens={project.tokens} onChange={onToken} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <Sheet open={!!sheetGroup} onClose={() => setOpen(null)} side="bottom" panelClassName="max-h-[80vh] overflow-y-auto rounded-t-xl border-t border-line bg-surface p-5 text-ink">
        {sheetGroup && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[20px] font-[650]">{sheetGroup.group}</h3>
              <button type="button" aria-label="Close tokens" onClick={() => setOpen(null)} className="inline-flex h-11 w-11 items-center justify-center rounded-theme text-muted hover:text-ink">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <TokenControls group={sheetGroup} tokens={project.tokens} onChange={onToken} />
            <Button className="mt-5 w-full" size="lg" onClick={() => setOpen(null)}>Done</Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
