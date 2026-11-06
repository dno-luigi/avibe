import { useForm, SpamTrap, cn } from "@wron/kit";
import { CheckCircle2 } from "lucide-react";
import { Field, TextArea, Button } from "./ui";
import { CONTACT } from "../data/site";

/* The home page's compact message form (form name "contact"). */
export default function ContactForm({ className }) {
  const form = useForm("contact");

  if (form.sent) {
    return (
      <div role="status" className={cn("rounded-theme border border-primary/40 bg-primary/[0.06] p-6", className)}>
        <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
        <p className="mt-3 text-[17px] font-[650] text-ink">Your message was sent.</p>
        <button type="button" onClick={form.reset} className="mt-4 inline-flex min-h-[44px] items-center text-[15px] text-muted underline underline-offset-4 hover:text-ink">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={form.onSubmit} className={cn("grid gap-4", className)} aria-label="Message the project">
      <Field label="Name" name="name" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <TextArea label="Message" name="message" rows={5} required />
      <SpamTrap />
      <Button type="submit" size="lg" disabled={form.sending} loading={form.sending} className="w-full sm:w-auto sm:justify-self-start">
        Send message
      </Button>
      {form.error && (
        <p role="alert" className="text-[15px] text-[#FCA5A5]">
          The message could not be sent. Your text is still here. Try again or email{" "}
          <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">{CONTACT.email}</a>.
        </p>
      )}
    </form>
  );
}
