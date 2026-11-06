import { Link } from "react-router";
import { cn } from "@wron/kit";

/* Typographic wordmark: "Vibe" in green, the rest in ink. */
export default function Logo({ className, compact = false }) {
  return (
    <Link
      to="/"
      aria-label="Vibe Microsite Builder, home"
      className={cn(
        "inline-flex min-h-[44px] items-center whitespace-nowrap font-display font-[700] tracking-[-0.03em] leading-[1.05] text-ink hover:opacity-90",
        compact ? "text-[17px]" : "text-[16px] sm:text-[20px] lg:text-[22px]",
        className
      )}
    >
      <span>
        <span className="text-primary">Vibe</span> Microsite Builder
      </span>
    </Link>
  );
}
