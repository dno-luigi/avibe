import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { cn } from "@wron/kit";
import { Scene } from "@wron/kit/3d";
import { Sparkles, ChevronDown, Sparkle, Square, Terminal, FileText, Zap, CodeXml } from "lucide-react";
import { EXAMPLE_PROMPTS, HOME_PLACEHOLDER } from "../../data/content";
import { VIBES, DEFAULT_VIBE_ID } from "../../data/vibes";
import { builderPath, getSavedVibe, setSavedVibe } from "../../lib/project";
import { heroSignal, countPhrases } from "./heroSignal";

const POSTER =
  "https://firebasestorage.googleapis.com/v0/b/wron-ai.firebasestorage.app/o/site-assets%2Fsite-1793831811129%2Fab07d53c-3d80-458c-8229-384c25f84877.webp?alt=media&token=232ea72b-753c-4ce9-85da-d761f203f8ad";

const RAIL_ICON = {
  "clean-minimal": <Sparkle className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />,
  "neo-brutalist": <Square className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />,
  "retro-terminal": <Terminal className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />,
  "glassy-gradient": (
    <span aria-hidden="true" className="h-6 w-6 rounded-full bg-[radial-gradient(circle_at_30%_30%,#E9DDFF,#A78BFA_45%,#4C3A8F)]" />
  ),
  "zine-print": <FileText className="h-6 w-6" strokeWidth={1.6} aria-hidden="true" />,
  "dark-neon": <Zap className="h-6 w-6 text-primary" strokeWidth={1.6} aria-hidden="true" />,
};

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Workbench() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [vibe, setVibe] = useState(DEFAULT_VIBE_ID);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const areaRef = useRef(null);

  useEffect(() => {
    setVibe(getSavedVibe());
    heroSignal.submitted = false;
    heroSignal.length = 0;
    heroSignal.phrases = 0;
  }, []);

  useEffect(() => {
    heroSignal.length = prompt.length;
    heroSignal.phrases = countPhrases(prompt);
  }, [prompt]);

  function chooseVibe(id) {
    setVibe(id);
    setSavedVibe(id);
  }

  function pickExample(text) {
    setPrompt(text);
    setError("");
    areaRef.current?.focus();
  }

  function startWithVibe(id) {
    chooseVibe(id);
    navigate(builderPath({ prompt: prompt.trim() || undefined, vibe: id }));
  }

  function onSubmit(e) {
    e.preventDefault();
    const text = prompt.trim();
    if (!text) {
      setError("Describe your page first, or tap one of the examples.");
      areaRef.current?.focus();
      return;
    }
    setSavedVibe(vibe);
    setSending(true);
    heroSignal.submitted = true;
    const go = () => navigate(builderPath({ prompt: text, vibe, auto: true }));
    if (prefersReduced()) go();
    else setTimeout(go, 650);
  }

  return (
    <section aria-labelledby="hero-title" className="relative">
      <div className="mx-auto grid max-w-[1320px] gap-x-8 px-6 pt-12 sm:px-6 lg:grid-cols-[minmax(0,620px)_1fr] lg:gap-x-16 lg:px-8 lg:py-12">
        {/* Prompt console */}
        <div className="lg:rounded-theme lg:border lg:border-line lg:bg-surface/40 lg:p-8">
          <h1
            id="hero-title"
            className="font-display font-[700] leading-[0.98] tracking-[-0.045em] text-[40px] min-[420px]:text-[46px] md:text-[52px] lg:text-6xl lg:leading-[0.95]"
          >
            <span className="block text-ink">Describe a page.</span>
            <span className="block text-primary">Get a small site.</span>
          </h1>
          <p className="mt-4 max-w-[34rem] text-base leading-7 text-ink/85 font-mono sm:font-body sm:text-[17px]">
            Turn plain words into Markdown, HTML and CSS. Edit every line, push the styling, then export or publish.
          </p>

          <form onSubmit={onSubmit} className="mt-6 grid gap-5" noValidate>
            <div className="grid gap-2">
              <label htmlFor="hero-prompt" className="text-base font-[600] text-ink">What are you making?</label>
              <textarea
                id="hero-prompt"
                ref={areaRef}
                name="prompt"
                value={prompt}
                onChange={(e) => { setPrompt(e.target.value); if (error) setError(""); }}
                placeholder={HOME_PLACEHOLDER}
                aria-describedby={error ? "hero-error" : undefined}
                aria-invalid={error ? true : undefined}
                className="min-h-36 w-full resize-y rounded-theme border border-line bg-[#0E1115] px-4 py-3 font-mono text-[16px] leading-[1.55] text-ink placeholder:text-muted/80 transition-colors hover:border-[#3A4552] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 sm:text-[15px] lg:h-[180px]"
              />
              {error && <p id="hero-error" role="alert" className="text-[14px] text-[#FCA5A5]">{error}</p>}
            </div>

            <fieldset>
              <legend className="mb-2 text-base font-[600] text-ink">Examples</legend>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => pickExample(ex)}
                    aria-pressed={prompt === ex}
                    className={cn(
                      "sweep min-h-14 rounded-theme border px-3.5 py-2.5 text-left text-[15px] leading-[1.35] lg:min-h-12 lg:text-[14px] transition-colors duration-150 active:scale-[0.98]",
                      prompt === ex ? "border-primary/70 bg-primary/[0.06] text-ink" : "border-line text-ink/90 hover:border-[#3A4552] hover:bg-ink/[0.03]"
                    )}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="grid gap-2">
              <label htmlFor="hero-vibe" className="text-base font-[600] text-ink">Starting vibe:</label>
              <div className="relative">
                <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink/80" aria-hidden="true" />
                <select
                  id="hero-vibe"
                  name="vibe"
                  value={vibe}
                  onChange={(e) => chooseVibe(e.target.value)}
                  className="h-14 w-full appearance-none lg:h-12 rounded-theme border border-line bg-[#0E1115] pl-11 pr-10 text-[16px] text-ink transition-colors hover:border-[#3A4552] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {VIBES.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="h-14 w-full rounded-theme bg-primary text-base font-[650] lg:h-12 text-primary-ink shadow-[0_0_0_1px_rgba(45,212,163,0.4),0_0_28px_-8px_rgba(45,212,163,0.75)] transition-colors duration-150 hover:bg-[#4BE0B4] active:scale-[0.99] disabled:opacity-70"
            >
              {sending ? "Assembling your page..." : "Build preview"}
            </button>
          </form>
        </div>

        {/* The floating browser */}
        <div className="relative -mx-6 mt-10 h-[540px] min-h-[520px] overflow-visible border-t border-line lg:mx-0 lg:mt-0 lg:h-auto lg:min-h-[620px] lg:border-0">
          <Scene
            load={() => import("../../three/BrowserWindow.jsx")}
            poster={POSTER}
            className="absolute inset-0"
            lighting="dramatic"
            accent="#2DD4A3"
            camera={{ position: [0, 0.25, 7.5], fov: 35 }}
            effects={{ bloom: 0.55 }}
            mobile="lite"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[calc(50%+12px)] z-10 flex -translate-x-1/2 -translate-y-1/2 rotate-[4deg] flex-col items-center gap-3 text-center lg:top-[calc(50%+26px)]"
          >
            <CodeXml className="h-11 w-11 text-accent lg:h-12 lg:w-12" strokeWidth={1.8} />
            <span className="whitespace-nowrap text-[16px] text-[#B7B4E6] lg:text-[17px]">Your page will take shape here.</span>
          </div>
          <p className="sr-only">A 3D browser window that assembles itself as you type your prompt.</p>
        </div>

        {/* Vibe rail */}
        <div className="pb-14 pt-6 lg:col-span-2 lg:col-start-1 lg:border-t lg:border-line lg:pt-8 lg:mt-6 lg:[grid-column:1/-1]">
          <h2 className="sr-only">Or start with a vibe</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {VIBES.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  onClick={() => startWithVibe(v.id)}
                  aria-label={`Start with the ${v.name} vibe`}
                  className={cn(
                    "sweep flex min-h-20 w-full items-center gap-3 rounded-theme border px-4 text-left text-base font-[500] lg:min-h-0 text-ink transition-colors duration-150 active:scale-[0.98] lg:h-[68px] lg:gap-4 lg:px-5",
                    vibe === v.id ? "border-primary shadow-[0_0_20px_-10px_rgba(45,212,163,0.9)]" : "border-line bg-surface/30 hover:border-[#3A4552]"
                  )}
                >
                  <span className="flex w-7 shrink-0 justify-center text-ink/85">{RAIL_ICON[v.id]}</span>
                  <span className="leading-[1.2]">{v.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
