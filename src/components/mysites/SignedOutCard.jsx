import { useAuthDialog } from "../AuthDialog";
import { Button } from "../ui";

export default function SignedOutCard() {
  const { openAuth } = useAuthDialog();
  return (
    <section className="mx-auto grid max-w-page grid-cols-1 px-4 py-16 sm:px-6 md:py-28 lg:grid-cols-12 lg:px-8">
      <div className="sweep rounded-theme border border-line bg-surface/60 p-6 sm:p-10 lg:col-span-6 lg:col-start-4">
        <h1 className="font-display text-[clamp(1.75rem,3.2vw,2.25rem)] font-[650] leading-[1.1] tracking-[-0.03em] text-ink">
          Sign in to see your sites.
        </h1>
        <p className="mt-4 text-[17px] text-muted">
          You can build and preview without an account. Sign in to publish and return to saved sites.
        </p>
        <div className="mt-8 grid gap-3">
          <Button size="lg" className="h-14 w-full" onClick={() => openAuth({ title: "Sign in" })}>
            Continue to sign in
          </Button>
          <Button to="/builder" variant="secondary" size="lg" className="h-14 w-full">
            Start with a prompt
          </Button>
        </div>
      </div>
      <p className="mt-8 text-center font-mono text-[14px] text-muted lg:col-span-6 lg:col-start-4">
        No sample site records are being displayed.
      </p>
    </section>
  );
}
