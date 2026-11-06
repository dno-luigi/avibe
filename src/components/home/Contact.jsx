import { useEffect, useState } from "react";
import { useForm, SpamTrap } from "@wron/kit";
import { Mail, Phone, CheckCircle2 } from "lucide-react";
import { CONTACT } from "../../data/site";
import { Button, Field, TextArea, SectionHeading } from "../ui";

export default function Contact() {
  const form = useForm("contact");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onPrefill = (e) => setMessage((m) => m || e.detail || "");
    window.addEventListener("vmb:prefill-contact", onPrefill);
    return () => window.removeEventListener("vmb:prefill-contact", onPrefill);
  }, []);

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto grid max-w-page gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
        <div className="lg:col-span-5">
          <SectionHeading id="contact-title">Questions about the builder?</SectionHeading>
          <p className="mt-4 text-[17px] text-ink/80">Contact the project directly.</p>
          <ul className="mt-8 grid gap-2">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="group inline-flex min-h-[52px] items-center gap-3 text-[17px] font-[600] text-ink hover:text-primary break-all">
                <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="group inline-flex min-h-[52px] items-center gap-3 text-[17px] font-[600] text-ink hover:text-primary">
                <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                {CONTACT.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {form.sent ? (
            <div role="status" className="block-in flex items-start gap-3 rounded-theme border border-primary/50 bg-primary/[0.06] p-6">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-[17px] font-[600] text-ink">Your message was sent.</p>
            </div>
          ) : (
            <form onSubmit={form.onSubmit} className="grid gap-5">
              <SpamTrap />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" autoComplete="name" placeholder="Your name" required />
                <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@domain.com" required />
              </div>
              <TextArea
                label="Message"
                name="message"
                rows={5}
                required
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" size="lg" className="w-full" disabled={form.sending} loading={form.sending}>
                {form.sending ? "Sending..." : "Send message"}
              </Button>
              {form.error && (
                <p role="alert" className="text-[15px] text-[#FCA5A5]">
                  The message could not be sent. Your text is still here. Try again or email {CONTACT.email}.
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
