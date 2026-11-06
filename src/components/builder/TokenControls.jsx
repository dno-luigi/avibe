import { FONT_OPTIONS } from "../../data/vibes";

/* Controls for one token group. Every change calls onChange(key, value) and the preview updates at once. */
export default function TokenControls({ group, tokens, onChange }) {
  return (
    <div className="grid gap-4">
      {group.tokens.map((t) => {
        const id = "tok-" + t.key;
        const v = tokens[t.key] ?? "";
        if (t.type === "color") {
          return (
            <div key={t.key} className="flex items-center justify-between gap-3">
              <label htmlFor={id} className="text-[15px] text-ink">{t.label}</label>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[13px] text-muted">{String(v).toUpperCase()}</span>
                <input id={id} type="color" value={/^#[0-9a-f]{6}$/i.test(v) ? v : "#000000"} onChange={(e) => onChange(t.key, e.target.value)} className="h-11 w-14 cursor-pointer rounded-theme border border-line bg-transparent p-1" />
              </span>
            </div>
          );
        }
        if (t.type === "font") {
          return (
            <div key={t.key} className="grid gap-2">
              <label htmlFor={id} className="text-[15px] text-ink">{t.label}</label>
              <select id={id} value={FONT_OPTIONS.some((f) => f.value === v) ? v : ""} onChange={(e) => e.target.value && onChange(t.key, e.target.value)} className="h-12 rounded-theme border border-line bg-[#0E1115] px-3 text-[16px] text-ink">
                {!FONT_OPTIONS.some((f) => f.value === v) && <option value="">Custom</option>}
                {FONT_OPTIONS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          );
        }
        const num = parseFloat(v) || 0;
        return (
          <div key={t.key} className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor={id} className="text-[15px] text-ink">{t.label}</label>
              <span className="font-mono text-[13px] text-muted">{num}{t.unit}</span>
            </div>
            <input id={id} type="range" min={t.min} max={t.max} step={t.step} value={num} onChange={(e) => onChange(t.key, e.target.value + t.unit)} className="h-11 w-full accent-[#2DD4A3]" />
          </div>
        );
      })}
    </div>
  );
}
