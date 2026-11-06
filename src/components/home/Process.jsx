import { useState } from "react";
import { Link } from "react-router";
import { cn } from "@wron/kit";
import { Sparkle, CodeXml, Hash, AppWindow, ArrowRight, ArrowDown, Copy, FileCode, FolderArchive, Link2 } from "lucide-react";
import { PROCESS, REFINEMENTS } from "../../data/content";
import { SectionHeading, MonoLabel } from "../ui";

const NODES = [
  { id: "prompt", label: "Prompt", sub: "Your idea in plain words", icon: <Sparkle className="h-6 w-6" strokeWidth={1.6} /> },
  { id: "markdown", label: "Markdown", sub: "Structured content", icon: <span className="font-mono text-[20px] font-[700] leading-none">M↓</span> },
  { id: "html", label: "HTML", sub: "Semantic markup", icon: <CodeXml className="h-6 w-6 text-accent" strokeWidth={1.8} /> },
  { id: "css", label: "CSS", sub: "Custom styles", icon: <Hash className="h-6 w-6 text-primary" strokeWidth={1.8} /> },
  { id: "preview", label: "Sandboxed preview", sub: "Live, editable result", icon: <AppWindow className="h-6 w-6" strokeWidth={1.6} /> },
];

const ACTIVE = [["prompt", "markdown"], ["markdown", "html", "css"], ["preview"]];

const REFINE_CODE = {
  "Make it bolder": ["/* style.css */", "h1 {", "  font-weight: 900;", "  letter-spacing: -0.05em;", "}"],
  "Add a contact section": ["<!-- index.md -->", "## Contact", "Write to [Add your email](#)."],
};

function Line({ children, tone = "ink" }) {
  const c = { ink: "text-ink/90", muted: "text-muted", green: "text-primary", violet: "text-accent" }[tone];
  return <div className={cn("whitespace-pre-wrap break-words", c)}>{children}</div>;
}

function Detail({ step }) {
  const [refine, setRefine] = useState(REFINEMENTS[0]);
  if (step === 0) {
    return (
      <div key="d0" className="block-in grid gap-4 font-mono text-[14px] leading-[1.55] md:grid-cols-2">
        <div>
          <MonoLabel as="p" className="mb-2">prompt</MonoLabel>
          <Line>A one-page invite with an oversized date, a playful RSVP section and a warm retro look.<span className="code-caret ml-1" aria-hidden="true" /></Line>
        </div>
        <div>
          <MonoLabel as="p" className="mb-2">index.md</MonoLabel>
          <Line tone="green"># You're invited</Line>
          <Line tone="muted">Add your date</Line>
          <Line tone="green">## RSVP</Line>
          <Line><span className="text-accent">- </span>Add your reply link</Line>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div key="d1" className="block-in">
        <MonoLabel as="p" className="mb-3">try a refinement</MonoLabel>
        <div className="flex flex-wrap gap-2">
          {REFINEMENTS.slice(0, 2).map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={refine === r}
              onClick={() => setRefine(r)}
              className={cn(
                "min-h-[44px] rounded-theme border px-4 text-[14px] font-[600] transition-colors duration-150",
                refine === r ? "border-primary text-ink bg-primary/[0.07]" : "border-line text-muted hover:text-ink"
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div key={refine} className="block-in mt-4 font-mono text-[14px] leading-[1.55]">
          {REFINE_CODE[refine].map((l, i) => (
            <Line key={i} tone={i === 0 ? "muted" : /[{}]/.test(l) ? "violet" : l.startsWith("#") ? "green" : "ink"}>{l}</Line>
          ))}
        </div>
      </div>
    );
  }
  const items = [
    [<Copy key="c" className="h-4 w-4" />, "Copy the code"],
    [<FileCode key="f" className="h-4 w-4" />, "Download a single HTML file"],
    [<FolderArchive key="z" className="h-4 w-4" />, "Download a ZIP"],
    [<Link2 key="l" className="h-4 w-4" />, "Sign in and publish a shareable link"],
  ];
  return (
    <div key="d2" className="block-in">
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map(([icon, label]) => (
          <li key={label} className="flex items-center gap-3 border-b border-line py-2.5 text-[15px] text-ink/90">
            <span className="text-primary" aria-hidden="true">{icon}</span>{label}
          </li>
        ))}
      </ul>
      <Link to="/builder" className="group mt-5 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-[650] text-primary hover:text-[#4BE0B4]">
        Open the builder <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function Process() {
  const [step, setStep] = useState(0);
  const active = ACTIVE[step];

  return (
    <section aria-labelledby="process-title" className="border-t border-line bg-surface/60">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
        <SectionHeading id="process-title">Your words stay connected to the code.</SectionHeading>
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <ol className="lg:col-span-4">
            {PROCESS.map((p, i) => (
              <li key={p.n}>
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  aria-pressed={step === i}
                  className={cn(
                    "grid w-full grid-cols-[2.5rem_1fr] gap-4 border-l-2 py-4 pl-4 pr-2 text-left transition-colors duration-150",
                    step === i ? "border-primary bg-primary/[0.04]" : "border-line hover:border-[#3A4552] hover:bg-ink/[0.02]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full font-mono text-[14px] font-[600]",
                      step === i ? "bg-primary text-primary-ink" : "border border-line text-muted"
                    )}
                  >
                    {p.n}
                  </span>
                  <span>
                    <span className="block text-[18px] font-[650] text-ink">{p.title}</span>
                    <span className="mt-1 block text-[15px] leading-[1.55] text-muted">{p.body}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(5,minmax(0,1fr))] sm:gap-0">
              {NODES.map((n, i) => {
                const on = active.includes(n.id);
                return (
                  <div key={n.id} className="flex items-stretch">
                    <div
                      className={cn(
                        "flex min-h-28 flex-1 flex-col items-center justify-center gap-2 rounded-theme border p-5 text-center sm:min-h-[132px] sm:px-2 sm:py-4 transition-[border-color,box-shadow,opacity] duration-200",
                        on ? "border-primary/80 bg-[#0E1318] shadow-[0_0_22px_-10px_rgba(45,212,163,0.9)]" : "border-line bg-bg/60 opacity-70"
                      )}
                    >
                      <span className="text-ink" aria-hidden="true">{n.icon}</span>
                      <span className="text-[15px] font-[650] leading-[1.2] text-ink">{n.label}</span>
                      <span className="text-[13px] leading-[1.35] text-muted">{n.sub}</span>
                    </div>
                    {i < NODES.length - 1 && (
                      <span className="hidden w-6 shrink-0 items-center justify-center text-primary sm:flex" aria-hidden="true">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-center text-primary sm:hidden" aria-hidden="true"><ArrowDown className="h-4 w-4" /></div>
            <div className="mt-6 rounded-theme border border-line bg-bg/70 p-5 sm:p-6" aria-live="polite">
              <Detail step={step} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
