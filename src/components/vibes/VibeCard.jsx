import { useState } from "react";
import { Link } from "react-router";
import { builderPath, setSavedVibe } from "../../lib/project";
import { buttonClass } from "../ui";
import Miniature from "./Miniature";
import Inspector from "./Inspector";

function tokenLine(t) {
  return `{ color: ${t.accent}, font: ${t.font.split(",")[0].replace(/"/g, "'")}, spacing: ${t.space}, border: ${t.border} solid ${t.accent}, motion: ${t.motion} }`;
}

export default function VibeCard({ vibe }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="sweep group rounded-theme border border-line bg-surface p-4 transition-colors duration-150 focus-within:border-primary hover:border-primary/60 sm:p-5">
      <Miniature vibe={vibe} />
      <h2 className="mt-5 font-display text-[28px] font-[650] leading-[1.1] tracking-[-0.02em]">{vibe.name}</h2>
      <p className="mt-2 text-[17px] text-muted">{vibe.summary}</p>
      <p className="mt-2 text-[15px] text-muted">
        <span className="text-ink">Variables:</span> {vibe.variables}.
      </p>
      <pre className="pane-scroll mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-theme border border-line bg-bg p-4 font-mono text-[13px] leading-[1.55] text-accent">{tokenLine(vibe.tokens)}</pre>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={buttonClass("secondary", "lg", "w-full")}
        >
          Preview variables
        </button>
        <Link to={builderPath({ vibe: vibe.id })} onClick={() => setSavedVibe(vibe.id)} className={buttonClass("primary", "lg", "w-full")}>
          Start with this vibe
        </Link>
      </div>
      {open && <Inspector vibe={vibe} />}
    </article>
  );
}
