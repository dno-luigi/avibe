import { useNavigate, Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { VIBES } from "../../data/vibes";
import { builderPath, setSavedVibe } from "../../lib/project";
import { SectionHeading } from "../ui";

function tokenStyle(tokens) {
  const s = {};
  Object.entries(tokens).forEach(([k, v]) => { s[`--${k}`] = v; });
  return s;
}

function Miniature({ vibe }) {
  const terminal = vibe.id === "retro-terminal";
  return (
    <div className={`vm vm-${vibe.id} aspect-[4/3] border border-line p-4`} style={tokenStyle(vibe.tokens)} aria-hidden="true">
      <div className="flex h-full flex-col justify-between gap-2">
        <div>
          <p className="vm-title text-[22px] font-[700]">
            {terminal ? `> ${vibe.sample}` : vibe.sample}
            {terminal && <span className="vm-cursor" />}
          </p>
          <div className="mt-3 grid gap-1.5">
            <div className="vm-line w-4/5" />
            <div className="vm-line w-3/5" />
          </div>
        </div>
        <div className="vm-card flex items-center justify-between gap-2 p-2">
          <div className="vm-line w-1/2" />
          <span className="vm-btn px-2.5 py-1 text-[11px] font-[700]">Go</span>
        </div>
        {vibe.id === "zine-print" && (
          <span className="vm-stamp absolute right-3 top-3 px-1.5 py-0.5 font-mono text-[10px] font-[700]">No. 01</span>
        )}
      </div>
    </div>
  );
}

export default function VibeSampler() {
  const navigate = useNavigate();
  function pickVibe(id) {
    setSavedVibe(id);
    navigate(builderPath({ vibe: id }));
  }

  return (
    <section aria-labelledby="sampler-title" className="border-t border-line bg-[#0D1014]">
      <div className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="sampler-title" className="lg:col-span-7">Start with a visual system, then break it.</SectionHeading>
          <p className="text-[17px] leading-[1.6] text-ink/80 lg:col-span-5">
            Each vibe is a set of colour, font, spacing, border and motion variables. Switch later without replacing your content.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {VIBES.map((v) => (
            <li key={v.id} className="group flex flex-col">
              <Miniature vibe={v} />
              <h3 className="mt-3 text-[17px] font-[650] text-ink">{v.name}</h3>
              <p className="mt-1 flex-1 text-[15px] leading-[1.5] text-muted">{v.short}</p>
              <button
                type="button"
                onClick={() => pickVibe(v.id)}
                aria-label={`Use the ${v.name} vibe`}
                className="mt-4 h-11 w-full rounded-theme bg-primary text-[15px] font-[650] text-primary-ink transition-colors duration-150 hover:bg-[#4BE0B4] active:scale-[0.98]"
              >
                Use this vibe
              </button>
            </li>
          ))}
        </ul>

        <Link to="/vibes" className="group mt-12 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-[650] text-primary hover:text-[#4BE0B4]">
          Explore all vibes <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
