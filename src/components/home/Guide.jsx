import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router";
import { cn, scrollToSection } from "@wron/kit";
import { ArrowRight } from "lucide-react";
import { GUIDE, GUIDE_HEADING } from "../../data/guide";
import { SectionHeading, Select } from "../ui";
import GuideCode from "./GuideCode";

const EXTRA_CODE = {
  accessibility: { lang: "css", code: "a:focus-visible {\n  outline: 2px solid var(--glow);\n  outline-offset: 2px;\n}" },
};

const FILE = { markdown: "index.md", html: "index.html", css: "style.css" };

export default function Guide() {
  const [active, setActive] = useState(GUIDE[0].id);

  useEffect(() => {
    const els = GUIDE.map((g) => document.getElementById(g.id)).filter(Boolean);
    if (!els.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function go(id) {
    setActive(id);
    scrollToSection(id);
  }

  return (
    <section id="guide" aria-labelledby="guide-title" className="border-t border-line">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-24">
        <SectionHeading id="guide-title" className="md:!text-4xl lg:whitespace-nowrap">{GUIDE_HEADING}</SectionHeading>

        <div className="mt-8 lg:hidden">
          <Select label="Guide topic" value={active} onChange={(e) => go(e.target.value)}>
            {GUIDE.map((g, i) => (
              <option key={g.id} value={g.id}>{String(i + 1).padStart(2, "0")} {g.title}</option>
            ))}
          </Select>
        </div>

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Guide topics" className="hidden lg:block">
            <ul className="sticky top-24 grid border-l border-line">
              {GUIDE.map((g, i) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    onClick={(e) => { e.preventDefault(); go(g.id); }}
                    aria-current={active === g.id ? "location" : undefined}
                    className={cn(
                      "-ml-px flex min-h-[44px] items-center gap-3 border-l-2 pl-4 text-[15px] transition-colors duration-150",
                      active === g.id ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"
                    )}
                  >
                    <span className={cn("font-mono text-[13px]", active === g.id ? "text-primary" : "text-muted")}>{String(i + 1).padStart(2, "0")}</span>
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            {GUIDE.map((g, i) => {
              const sample = g.code ? { lang: g.lang, code: g.code } : EXTRA_CODE[g.id];
              return (
                <Fragment key={g.id}>
                  <article
                    id={g.id}
                    aria-labelledby={`${g.id}-title`}
                    className="grid scroll-mt-24 gap-5 border-b border-line py-8 first:pt-0 lg:grid-cols-2 lg:gap-8 lg:py-6"
                  >
                    <div>
                      <h3 id={`${g.id}-title`} className="font-display text-[clamp(1.6rem,2.5vw,2.25rem)] font-[650] leading-[1.08] tracking-[-0.025em] text-ink">
                        <span className="font-mono text-[0.6em] font-[500] text-primary align-middle mr-2">{String(i + 1).padStart(2, "0")}</span>
                        {g.title}
                      </h3>
                      {g.paragraphs.map((p) => (
                        <p key={p} className="mt-4 max-w-[36rem] text-[15px] leading-6 text-ink/80 md:text-base md:leading-7">{p}</p>
                      ))}
                      {g.id === "export-and-publish" && (
                        <Link to="/builder" className="group mt-5 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-[650] text-primary hover:text-[#4BE0B4]">
                          Open the builder <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                    {sample && <GuideCode code={sample.code} lang={sample.lang} label={FILE[sample.lang]} className="self-start" />}
                  </article>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
