const HEIGHTS = {
  "clean-minimal": "h-[300px]",
  "neo-brutalist": "h-[280px]",
  "retro-terminal": "h-[260px]",
  "glassy-gradient": "h-[270px]",
  "zine-print": "h-[300px]",
  "dark-neon": "h-[240px]",
};

export function tokenStyle(t) {
  return {
    "--bg": t.bg, "--surface": t.surface, "--ink": t.ink, "--muted": t.muted, "--accent": t.accent,
    "--font": t.font, "--display": t.display, "--space": t.space, "--radius": t.radius, "--border": t.border, "--motion": t.motion,
  };
}

/* A real miniature HTML layout, styled by the vibe's tokens and the .vm-* rules. */
export default function Miniature({ vibe, tokens, className = "" }) {
  const t = tokens || vibe.tokens;
  return (
    <div
      className={`vm vm-${vibe.id} ${HEIGHTS[vibe.id] || "h-[260px]"} p-5 ${className}`}
      style={tokenStyle(t)}
      role="img"
      aria-label={`${vibe.name} sample page`}
    >
      <div className="flex items-center justify-between text-[11px]" aria-hidden="true">
        <span>Your Brand</span>
        <span className="flex gap-3"><span>About</span><span>Work</span><span>Contact</span></span>
      </div>
      <div className="mt-6 grid gap-3" aria-hidden="true">
        <div className="vm-title text-[34px]">{vibe.sample}</div>
        <div className="vm-card p-3">
          <div className="vm-line w-4/5" />
          <div className="vm-line mt-2 w-3/5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="vm-btn px-3 py-1.5 text-[12px] font-bold">Get started</span>
          {vibe.id === "retro-terminal" && <span className="vm-cursor" />}
          {vibe.id === "zine-print" && <span className="vm-stamp px-2 py-1 text-[11px] font-bold">NEW</span>}
        </div>
      </div>
    </div>
  );
}
