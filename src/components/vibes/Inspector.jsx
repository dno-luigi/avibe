import { useState } from "react";
import { Link } from "react-router";
import { TOKEN_GROUPS, FONT_OPTIONS } from "../../data/vibes";
import { builderPath, setSavedVibe } from "../../lib/project";
import { buttonClass } from "../ui";
import Miniature from "./Miniature";

const num = (v) => parseFloat(v) || 0;

function Control({ tok, value, onChange }) {
  const id = `tok-${tok.key}`;
  const cls = "h-11 rounded-theme border border-line bg-bg px-2 text-[14px] text-ink font-mono";
  if (tok.type === "color")
    return (
      <div className="flex items-center gap-2">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 cursor-pointer rounded-theme border border-line bg-bg p-1" />
        <span className="font-mono text-[13px] text-accent">{value}</span>
      </div>
    );
  if (tok.type === "font")
    return (
      <select id={id} value={FONT_OPTIONS.some((f) => f.value === value) ? value : ""} onChange={(e) => onChange(e.target.value)} className={cls + " w-full max-w-[16rem]"}>
        {!FONT_OPTIONS.some((f) => f.value === value) && <option value="">{value.split(",")[0]}</option>}
        {FONT_OPTIONS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
      </select>
    );
  return (
    <div className="flex items-center gap-3">
      <input id={id} type="range" min={tok.min} max={tok.max} step={tok.step} value={num(value)} onChange={(e) => onChange(e.target.value + tok.unit)} className="h-11 w-full max-w-[14rem] accent-[#2DD4A3]" />
      <span className="w-20 font-mono text-[13px] text-accent">{value}</span>
    </div>
  );
}

export default function Inspector({ vibe }) {
  const [tokens, setTokens] = useState({ ...vibe.tokens });
  const set = (k) => (v) => setTokens((t) => ({ ...t, [k]: v }));

  return (
    <section aria-label={`${vibe.name} variables`} className="mt-5 grid gap-6 rounded-theme border border-line bg-bg p-4 sm:p-5 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h3 className="font-display text-[20px] font-[650]">What this vibe changes</h3>
        <div className="mt-3 divide-y divide-line">
          {TOKEN_GROUPS.map((g) => (
            <div key={g.group} className="py-3">
              <p className="text-[15px] font-[600]">{g.group}</p>
              <div className="mt-2 grid gap-3">
                {g.tokens.map((tok) => (
                  <div key={tok.key} className="grid gap-1 sm:grid-cols-[8rem_1fr] sm:items-center">
                    <label htmlFor={`tok-${tok.key}`} className="text-[14px] text-muted">{tok.label}</label>
                    <Control tok={tok} value={tokens[tok.key]} onChange={set(tok.key)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lg:col-span-5">
        <Miniature vibe={vibe} tokens={tokens} className="lg:sticky lg:top-6" />
      </div>
      <div className="lg:col-span-12">
        <p className="text-[15px] text-muted">Adjust the tokens now or edit the CSS later.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button type="button" className={buttonClass("secondary", "lg", "w-full")} onClick={() => setTokens({ ...vibe.tokens })}>Reset vibe</button>
          <Link to={builderPath({ vibe: vibe.id })} onClick={() => setSavedVibe(vibe.id)} className={buttonClass("primary", "lg", "w-full")}>Open in builder</Link>
        </div>
      </div>
    </section>
  );
}
