import { Accordion } from "@wron/kit";
import { FAQ } from "../../data/content";
import { SectionHeading } from "../ui";

export default function Questions() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line bg-[#0D1014]">
      <div className="mx-auto grid max-w-page gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-12 lg:px-8 lg:py-24">
        <SectionHeading id="faq-title" className="lg:col-span-4">Common questions</SectionHeading>
        <div className="text-[16px] text-ink lg:col-span-8">
          <Accordion items={FAQ.map((f) => ({ q: f.q, a: f.a }))} />
        </div>
      </div>
    </section>
  );
}
