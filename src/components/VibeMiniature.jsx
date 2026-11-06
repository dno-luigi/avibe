import { cn } from "@wron/kit";
import { getVibe } from "../data/vibes";

/*
  A live CSS miniature of a vibe, drawn in HTML (no picture). Put it inside an element with
  the "group" class so hover runs the vibe's own small motion (styles in index.css).
  <VibeMiniature id="dark-neon" tokens={optionalOverrides} className="aspect-[16/9]" />
*/
export default function VibeMiniature({ id, tokens, className }) {
  const vibe = getVibe(id);
  const t = { ...vibe.tokens, ...(tokens || {}) };
  const style = {
    "--bg": t.bg, "--surface": t.surface, "--ink": t.ink, "--muted": t.muted, "--accent": t.accent,
    "--font": t.font, "--display": t.display, "--radius": t.radius, "--border": t.border,
  };
  const isTerminal = vibe.id === "retro-terminal";
  const isZine = vibe.id === "zine-print";

  return (
    <div aria-hidden="true" style={style} className={cn("vm flex flex-col gap-[6%] p-[6%]", `vm-${vibe.id}`, className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold" style={{ color: t.muted }}>{isTerminal ? "~/site $" : "site"}</span>
        <span className="flex gap-1.5">
          <span className="vm-line w-6" />
          <span className="vm-line w-6" />
          <span className="vm-line w-6" />
        </span>
      </div>

      <div className="relative">
        <p className="vm-title text-[clamp(22px,3vw,38px)]" style={{ color: t.ink }}>
          {vibe.sample}
          {isTerminal && <span className="vm-cursor" />}
        </p>
        {isZine && (
          <span className="vm-stamp absolute right-0 top-0 px-2 py-0.5 text-[10px] font-bold">New</span>
        )}
      </div>

      <div className="grid gap-1.5">
        <span className="vm-line w-[85%]" />
        <span className="vm-line w-[60%]" />
      </div>

      <div className="mt-auto flex items-end gap-[5%]">
        <span className="vm-btn px-3 py-1.5 text-[11px] font-bold">{isTerminal ? "run" : "Open"}</span>
        <span className="vm-card h-10 flex-1" />
        <span className="vm-card h-14 flex-1" />
      </div>
    </div>
  );
}
