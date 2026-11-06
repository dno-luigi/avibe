import { useState } from "react";
import { MonoLabel } from "../ui";

/* Full-width live sample after the CSS topic: change a token, the page answers at once. */
const START = { bg: "#0b0d10", ink: "#eef2f6", glow: "#2dd4a3", space: 1.5 };

export default function LiveSample() {
  const [t, setT] = useState(START);
  const set = (k) => (e) => setT((p) => ({ ...p, [k]: k === "space" ? Number(e.target.value) : e.target.value }));
  const vars = { "--bg": t.bg, "--ink": t.ink, "--glow": t.glow, "--space": `${t.space}rem` };

  return (
    <div className="rounded-theme border border-line bg-surface/50 p-4 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <MonoLabel as="p" className="text-primary">live sample</MonoLabel>
        <button type="button" onClick={() => setT(START)} className="min-h-[44px] text-[14px] font-[600] text-muted hover:text-ink">
          Reset tokens
        </button>
      </div>
      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <div className="grid content-start gap-4">
          {[["bg", "Background"], ["ink", "Text"], ["glow", "Glow"]].map(([k, label]) => (
            <label key={k} className="flex min-h-[44px] items-center justify-between gap-3 border-b border-line pb-3 text-[15px] text-ink">
              <span>{label} <span className="font-mono text-[13px] text-muted">--{k}</span></span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[13px] text-muted">{t[k]}</span>
                <input type="color" value={t[k]} onChange={set(k)} className="h-9 w-11 cursor-pointer rounded border border-line bg-transparent p-0.5" />
              </span>
            </label>
          ))}
          <label className="grid gap-2 text-[15px] text-ink">
            <span className="flex justify-between">
              <span>Space <span className="font-mono text-[13px] text-muted">--space</span></span>
              <span className="font-mono text-[13px] text-muted">{t.space}rem</span>
            </span>
            <input type="range" min="0.5" max="3" step="0.25" value={t.space} onChange={set("space")} className="h-11 accent-[#2DD4A3]" />
          </label>
        </div>

        <div
          style={{ ...vars, background: "var(--bg)", color: "var(--ink)", padding: "var(--space)", gap: "calc(var(--space) * .6)" }}
          className="grid min-h-[260px] content-center overflow-hidden border border-line"
        >
          <p style={{ color: "var(--glow)" }} className="font-mono text-[13px]">Next meetup</p>
          <p
            style={{ textShadow: "0 0 24px color-mix(in srgb, var(--glow) 60%, transparent)" }}
            className="font-display text-[clamp(2rem,5vw,3.5rem)] font-[800] leading-[1] tracking-[-0.04em]"
          >
            Friday Sketch Club
          </p>
          <p className="max-w-[32rem] text-[16px] leading-[1.6] opacity-80">A tiny page for the next meetup. Bring a pencil, bring a friend.</p>
          <span
            style={{ borderColor: "var(--glow)", boxShadow: "0 0 18px -6px var(--glow)" }}
            className="inline-flex w-fit items-center rounded-[8px] border px-4 py-2 text-[15px] font-[650]"
          >
            Join the list
          </span>
        </div>
      </div>
    </div>
  );
}
