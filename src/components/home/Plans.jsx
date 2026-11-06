import { scrollToSection } from "@wron/kit";
import { PLANS } from "../../data/content";
import { Button, SectionHeading } from "../ui";

export default function Plans() {
  function askPaid() {
    window.dispatchEvent(new CustomEvent("vmb:prefill-contact", { detail: "I would like to ask about paid access." }));
    scrollToSection("contact");
  }

  return (
    <section aria-labelledby="plans-title" className="border-t border-line">
      <div className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading id="plans-title">Start free. Use more when you need more.</SectionHeading>
        <div className="mt-10 grid rounded-theme border border-line bg-surface md:grid-cols-2">
          <div className="p-6 sm:p-8">
            <h3 className="text-[22px] font-[650] text-ink">{PLANS.free.title}</h3>
            <p className="mt-2 max-w-[30rem] text-[16px] leading-[1.6] text-muted">{PLANS.free.body}</p>
            <Button to="/builder" size="lg" className="mt-6">{PLANS.free.action}</Button>
          </div>
          <div className="border-t border-line p-6 sm:p-8 md:border-l md:border-t-0">
            <h3 className="text-[22px] font-[650] text-ink">{PLANS.paid.title}</h3>
            <p className="mt-2 max-w-[30rem] text-[16px] leading-[1.6] text-muted">{PLANS.paid.body}</p>
            <Button variant="violet" size="lg" className="mt-6" onClick={askPaid}>{PLANS.paid.action}</Button>
          </div>
        </div>
        <p className="mt-4 text-[15px] text-muted">{PLANS.note}</p>
      </div>
    </section>
  );
}
