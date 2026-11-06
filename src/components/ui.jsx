import { forwardRef, useId } from "react";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";
import { cn } from "@wron/kit";

/* Buttons: 15px / 650. primary = green action, secondary = bordered, ghost = text, violet = the one violet line. */
const VARIANTS = {
  primary: "bg-primary text-primary-ink hover:bg-[#4BE0B4] shadow-[0_0_0_1px_rgba(45,212,163,0.4),0_0_24px_-8px_rgba(45,212,163,0.7)]",
  secondary: "border border-line bg-surface text-ink hover:border-primary/60 hover:bg-[#161B21]",
  ghost: "text-muted hover:text-ink hover:bg-ink/5",
  violet: "border border-accent/70 text-ink hover:bg-accent/10",
  danger: "border border-[#F87171]/50 text-[#FCA5A5] hover:bg-[#F87171]/10",
};
const SIZES = {
  sm: "h-9 px-3 text-[14px] min-h-[44px] sm:min-h-0",
  md: "h-11 px-4 text-[15px]",
  lg: "h-12 px-5 text-[15px]",
};

export function buttonClass(variant = "primary", size = "md", className) {
  return cn(
    "group inline-flex items-center justify-center gap-2 rounded-theme font-[650] leading-none whitespace-nowrap transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
    VARIANTS[variant],
    SIZES[size],
    className
  );
}

export const Button = forwardRef(function Button(
  { to, href, variant = "primary", size = "md", className, children, loading, ...rest },
  ref
) {
  const cls = buttonClass(variant, size, className);
  const inner = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </>
  );
  if (to) return <Link ref={ref} to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a ref={ref} href={href} className={cls} {...rest}>{inner}</a>;
  return <button ref={ref} type="button" className={cls} {...rest}>{inner}</button>;
});

/* Small mono label: allowed by the look, sentence case. */
export function MonoLabel({ className, children, as: As = "span" }) {
  return <As className={cn("font-mono text-[13px] leading-[1.55] text-muted", className)}>{children}</As>;
}

/* Section heading: 40-56px at 650, line-height 1.04 */
export function SectionHeading({ as: As = "h2", className, children, id }) {
  return (
    <As id={id} className={cn("font-display text-3xl leading-[1.05] sm:text-4xl md:text-[clamp(2.25rem,4vw,3.5rem)] md:leading-[1.04] font-[650] tracking-[-0.03em] text-ink", className)}>
      {children}
    </As>
  );
}

const fieldBase =
  "w-full rounded-theme border border-line bg-[#0E1115] px-4 text-[16px] text-ink placeholder:text-muted/70 transition-colors hover:border-[#3A4552] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export function Field({ label, hint, error, className, inputClassName, id, ...props }) {
  const auto = useId();
  const fid = id || auto;
  return (
    <div className={cn("grid gap-2", className)}>
      <label htmlFor={fid} className="text-[15px] font-[600] text-ink">{label}</label>
      <input id={fid} className={cn(fieldBase, "h-12", inputClassName)} aria-invalid={error ? true : undefined} {...props} />
      {hint && !error && <p className="text-[14px] text-muted">{hint}</p>}
      {error && <p className="text-[14px] text-[#FCA5A5]">{error}</p>}
    </div>
  );
}

export function TextArea({ label, hint, error, className, inputClassName, id, rows = 5, ...props }) {
  const auto = useId();
  const fid = id || auto;
  return (
    <div className={cn("grid gap-2", className)}>
      {label && <label htmlFor={fid} className="text-[15px] font-[600] text-ink">{label}</label>}
      <textarea id={fid} rows={rows} className={cn(fieldBase, "py-3 leading-[1.55] resize-y", inputClassName)} aria-invalid={error ? true : undefined} {...props} />
      {hint && !error && <p className="text-[14px] text-muted">{hint}</p>}
      {error && <p className="text-[14px] text-[#FCA5A5]">{error}</p>}
    </div>
  );
}

export function Select({ label, className, selectClassName, id, children, ...props }) {
  const auto = useId();
  const fid = id || auto;
  return (
    <div className={cn("grid gap-2", className)}>
      {label && <label htmlFor={fid} className="text-[15px] font-[600] text-ink">{label}</label>}
      <select id={fid} className={cn(fieldBase, "h-12 appearance-auto", selectClassName)} {...props}>{children}</select>
    </div>
  );
}

/* A bordered message for states (empty, failed). */
export function StateMessage({ tone = "neutral", title, children, actions, className }) {
  const toneCls = tone === "error" ? "border-[#F87171]/40 bg-[#F87171]/[0.06]" : "border-line bg-surface";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-theme border p-5", toneCls, className)}>
      {title && <p className="font-[650] text-ink">{title}</p>}
      {children && <div className="mt-1 text-[15px] text-muted">{children}</div>}
      {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/* Static code-row placeholders for loading */
export function CodeSkeleton({ rows = 3, className }) {
  const widths = ["w-3/4", "w-1/2", "w-2/3", "w-5/6", "w-2/5"];
  return (
    <div className={cn("grid gap-3", className)} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-5 text-right font-mono text-[12px] text-muted/50">{i + 1}</span>
          <span className={cn("h-3 rounded bg-ink/10", widths[i % widths.length])} />
        </div>
      ))}
    </div>
  );
}
