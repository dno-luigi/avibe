import { useState } from "react";
import { Link } from "react-router";
import { Page, cn } from "@wron/kit";
import { VIBES, VIBE_FILTERS } from "../data/vibes";
import { builderPath } from "../lib/project";
import { buttonClass, StateMessage } from "../components/ui";
import VibeCard from "../components/vibes/VibeCard";

export default function Vibes() {
  const [filter, setFilter] = useState("all");
  const [failed, setFailed] = useState(false);
  const list = filter === "all" ? VIBES : VIBES.filter((v) => v.tags.includes(filter));
  const left = list.filter((_, i) => i % 2 === 0);
  const right = list.filter((_, i) => i % 2 === 1);

  return (
    <Page title="Vibes" description="Compare six built-in visual systems, inspect their variables and start a micro site with one. Colours, fonts, spacing, borders and motion.">
      <section className="mx-auto max-w-page px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
          <h1 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-[650] leading-[1.04] tracking-[-0.03em] lg:col-span-6">
            Pick a system.
            <br />
            <span className="text-primary">Then make it yours.</span>
          </h1>
          <p className="max-w-md text-[17px] text-muted lg:col-span-5 lg:col-start-8">
            A vibe sets colours, fonts, spacing, borders and motion. Your content remains editable when you switch.
          </p>
        </div>

        <div role="group" aria-label="Filter vibes" className="mt-10 grid grid-cols-2 overflow-hidden rounded-theme border border-line sm:grid-cols-4">
          {VIBE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-12 text-[15px] font-[650] transition-colors duration-150 border-line [&:not(:first-child)]:sm:border-l",
                filter === f.key ? "bg-primary text-primary-ink" : "text-ink hover:bg-ink/5"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {failed ? (
            <StateMessage
              tone="error"
              title="The vibe previews could not load."
              actions={
                <>
                  <button type="button" className={buttonClass("secondary")} onClick={() => setFailed(false)}>Retry</button>
                  <Link to="/builder" className={buttonClass("primary")}>Open the builder without a vibe</Link>
                </>
              }
            />
          ) : list.length === 0 ? (
            <StateMessage
              title="No vibes match this filter."
              actions={<button type="button" className={buttonClass("primary")} onClick={() => setFilter("all")}>Show all vibes</button>}
            />
          ) : (
            <>
              {/* Desktop: two independent columns so heights vary naturally */}
              <div className="hidden items-start gap-6 lg:grid lg:grid-cols-2">
                {[left, right].map((col, ci) => (
                  <div key={ci} className="grid gap-6">
                    {col.map((v) => <VibeCard key={v.id} vibe={v} />)}
                  </div>
                ))}
              </div>
              <div className="grid gap-6 lg:hidden">
                {list.map((v) => <VibeCard key={v.id} vibe={v} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </Page>
  );
}
