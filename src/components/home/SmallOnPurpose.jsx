import { motion } from "motion/react";
import { SMALL_ON_PURPOSE } from "../../data/content";

export default function SmallOnPurpose() {
  return (
    <section aria-labelledby="small-title" className="border-t border-line bg-[#0D1014]">
      <div className="mx-auto max-w-page px-4 py-16 sm:px-6 md:py-20 lg:px-8 lg:py-28">
        <motion.div
          aria-hidden="true"
          className="mb-14 h-px origin-left bg-primary/70 shadow-[0_0_12px_rgba(45,212,163,0.6)]"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="small-title" className="font-display text-[clamp(2.25rem,4vw,3.5rem)] font-[650] leading-[1.04] tracking-[-0.03em]">
              <span className="block text-ink">Small on purpose.</span>
              <span className="block text-primary">Wild by choice.</span>
            </h2>
            <p className="mt-6 max-w-[30rem] text-[17px] leading-[1.6] text-ink/80">
              Build focused pages for an event, launch, profile, menu, announcement or side project without carrying a heavy framework.
            </p>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {SMALL_ON_PURPOSE.map((row) => (
              <li key={row.n} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line py-7 first:pt-0 last:border-0 sm:grid-cols-[5rem_1fr]">
                <span className="font-mono text-[22px] leading-[1.2] text-primary sm:text-[26px]">{row.n}</span>
                <div>
                  <h3 className="text-[19px] font-[650] leading-[1.25] text-ink">{row.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-6 text-muted md:text-base md:leading-7">{row.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
