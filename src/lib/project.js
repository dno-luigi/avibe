import { storage } from "@wron/kit";
import { emptyProject } from "./build";
import { DEFAULT_VIBE_ID } from "../data/vibes";

/*
  Local autosave (browser storage). Use only in effects and handlers.
  - loadProject() / saveProject(p) -> true | false (false = could not save locally)
  - loadVersions() / pushVersion(p) / clearVersions()
  - chosen vibe and editor layout remembered between visits
  - builderPath({ prompt, vibe }) builds the link that hands a prompt from Home or Vibes to the Builder:
      /builder?prompt=...&vibe=dark-neon   (Builder reads these with useSearchParams)
*/

const K = {
  project: "vmb:project",
  versions: "vmb:versions",
  vibe: "vmb:vibe",
  layout: "vmb:layout",
};

export function loadProject() {
  const p = storage.get(K.project);
  if (p && typeof p === "object") return { ...emptyProject(p.vibe), ...p };
  if (typeof p === "string") {
    try { return { ...emptyProject(), ...JSON.parse(p) }; } catch { /* ignore */ }
  }
  return null;
}

export function saveProject(p) {
  try {
    storage.set(K.project, { ...p, savedAt: new Date().toISOString() });
    return true;
  } catch {
    return false;
  }
}

export function loadVersions() {
  const v = storage.get(K.versions);
  return Array.isArray(v) ? v : [];
}

export function pushVersion(p, label) {
  const list = loadVersions();
  const entry = { id: Date.now().toString(36), at: new Date().toISOString(), label: label || "Saved", project: p };
  const next = [entry, ...list].slice(0, 30);
  try {
    storage.set(K.versions, next);
  } catch { /* storage full */ }
  return next;
}

export function clearVersions() {
  storage.remove(K.versions);
}

export function getSavedVibe() {
  return storage.get(K.vibe) || DEFAULT_VIBE_ID;
}
export function setSavedVibe(id) {
  storage.set(K.vibe, id);
}

export function getLayout(fallback) {
  return storage.get(K.layout) || fallback;
}
export function setLayout(v) {
  storage.set(K.layout, v);
}

export function builderPath({ prompt, vibe, auto } = {}) {
  const sp = new URLSearchParams();
  if (prompt) sp.set("prompt", prompt);
  if (vibe) sp.set("vibe", vibe);
  if (auto) sp.set("auto", "1");
  const q = sp.toString();
  return q ? `/builder?${q}` : "/builder";
}

/* "updated 3 minutes ago" style text for timestamps */
export function timeAgo(iso) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 45) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
