import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Undo2, Eye, Download, Upload } from "lucide-react";
import { Page, toast, scrollToSection, cn } from "@wron/kit";
import AppBar from "../components/builder/AppBar";
import PromptRail from "../components/builder/PromptRail";
import SourceEditor from "../components/builder/SourceEditor";
import Preview from "../components/builder/Preview";
import ExportDrawer from "../components/builder/ExportDrawer";
import PublishDrawer from "../components/builder/PublishDrawer";
import PublishPanel from "../components/builder/PublishPanel";
import { Button } from "../components/ui";
import { emptyProject, hasCode } from "../lib/build";
import { generateSite } from "../lib/generate";
import { loadProject, saveProject, loadVersions, pushVersion, getSavedVibe, setSavedVibe } from "../lib/project";
import { DEFAULT_VIBE_ID, VIBES, getVibe, STARTER_MARKDOWN } from "../data/vibes";

function Separator({ label, value, onMove, onKey }) {
  const start = useRef(null);
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={18}
      aria-valuemax={50}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={(e) => { start.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (start.current !== null) { onMove(e.clientX - start.current); start.current = e.clientX; } }}
      onPointerUp={() => { start.current = null; }}
      className="group hidden w-3 shrink-0 cursor-col-resize items-center justify-center hover:bg-primary/10 focus-visible:bg-primary/15 lg:flex"
    >
      <span className="h-8 w-[2px] rounded bg-line group-hover:bg-primary" aria-hidden="true" />
    </div>
  );
}

const MTABS = [["prompt", "Prompt"], ["code", "Code"], ["preview", "Preview"]];

export default function Builder() {
  const [params] = useSearchParams();
  const [project, setProject] = useState(() => emptyProject(DEFAULT_VIBE_ID));
  const projRef = useRef(project);
  const hist = useRef({ past: [], future: [], key: "", at: 0 });
  const [loaded, setLoaded] = useState(false);
  const [save, setSave] = useState("saved");
  const [tab, setTab] = useState("markdown");
  const [mtab, setMtab] = useState("prompt");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [previewV, setPreviewV] = useState(null);
  const [drawer, setDrawer] = useState(true);
  const [pub, setPub] = useState(false);
  const [cols, setCols] = useState({ a: 29, b: 33 });
  const ws = useRef(null);
  const editorRef = useRef(null);
  const lastRun = useRef(null);

  const setQuiet = useCallback((next) => {
    const n = typeof next === "function" ? next(projRef.current) : next;
    projRef.current = n;
    setProject(n);
  }, []);

  const apply = useCallback((next, key) => {
    const h = hist.current;
    const cur = projRef.current;
    const n = typeof next === "function" ? next(cur) : next;
    const now = Date.now();
    if (!(key && key === h.key && now - h.at < 1200)) {
      h.past.push(cur);
      if (h.past.length > 60) h.past.shift();
    }
    h.key = key || "";
    h.at = now;
    h.future = [];
    projRef.current = n;
    setProject(n);
  }, []);

  const undo = () => {
    const h = hist.current;
    if (!h.past.length) return;
    h.future.push(projRef.current);
    h.key = "";
    setQuiet(h.past.pop());
  };
  const redo = () => {
    const h = hist.current;
    if (!h.future.length) return;
    h.past.push(projRef.current);
    h.key = "";
    setQuiet(h.future.pop());
  };

  const runGenerate = useCallback(async (base, instruction) => {
    lastRun.current = instruction || null;
    if (!(base.prompt || "").trim()) {
      setGenError("Write a few words about the page first.");
      return;
    }
    setGenerating(true);
    setGenError(null);
    try {
      const out = await generateSite({ prompt: base.prompt, vibe: base.vibe, current: instruction ? base : undefined, instruction });
      const title = base.title && base.title !== "Untitled site" ? base.title : out.title || base.title;
      const next = { ...projRef.current, title, markdown: out.markdown, html: out.html, css: out.css };
      apply(next, "");
      setVersions(pushVersion(next, instruction || "Generated from prompt"));
      setMtab("preview");
    } catch {
      setGenError(true);
    } finally {
      setGenerating(false);
    }
  }, [apply]);

  useEffect(() => {
    let p = loadProject();
    const qv = params.get("vibe");
    const qp = params.get("prompt");
    if (qv && VIBES.some((v) => v.id === qv)) {
      p = { ...(p || emptyProject(qv)), vibe: qv, tokens: { ...getVibe(qv).tokens } };
    } else if (!p) {
      p = emptyProject(getSavedVibe());
    }
    if (qp) p = { ...p, prompt: qp };
    setQuiet(p);
    setVersions(loadVersions());
    setLoaded(true);
    if (qp && params.get("auto")) runGenerate(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setSave("saving");
    const t = setTimeout(() => {
      setSave(saveProject(project) ? "saved" : "failed");
      setSavedVibe(project.vibe);
    }, 500);
    return () => clearTimeout(t);
  }, [project, loaded]);

  useEffect(() => {
    const f = () => setPub(true);
    window.addEventListener("vmb:publish", f);
    return () => window.removeEventListener("vmb:publish", f);
  }, []);

  const setField = (k, v) => apply((p) => ({ ...p, [k]: v }), "f-" + k);
  const onVibe = (id) => {
    const v = getVibe(id);
    apply((p) => ({ ...p, vibe: id, tokens: { ...v.tokens }, markdown: hasCode(p) ? p.markdown : STARTER_MARKDOWN }), "");
  };
  const onBlock = (b) => {
    apply((p) => ({ ...p, markdown: (p.markdown || "").trim() ? p.markdown.replace(/\s+$/, "") + "\n\n" + b.markdown : b.markdown }), "");
    setTab("markdown");
    toast(b.label + " block added.");
  };
  const openDrawer = () => {
    setDrawer(true);
    setTimeout(() => scrollToSection("versions-export"), 60);
  };
  const openSource = () => { setMtab("code"); editorRef.current?.focus(); };
  const has = hasCode(project);
  const shown = previewV ? previewV.project : project;
  const h = hist.current;

  const banner = previewV && (
    <div role="status" className="flex shrink-0 flex-wrap items-center gap-2 rounded-theme border border-accent/50 bg-accent/10 px-3 py-2 text-[14px]">
      <span className="flex-1 text-ink">Previewing a saved version.</span>
      <Button size="sm" variant="secondary" onClick={() => { apply(previewV.project, ""); setPreviewV(null); }}>Restore</Button>
      <Button size="sm" variant="ghost" onClick={() => setPreviewV(null)}>Keep current</Button>
    </div>
  );

  const move = (key, dx) => {
    const w = ws.current?.offsetWidth || 1200;
    setCols((c) => ({ ...c, [key]: Math.min(50, Math.max(18, c[key] + (dx / w) * 100)) }));
  };
  const keyOf = (key) => (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); move(key, -w2px(ws, 2)); }
    if (e.key === "ArrowRight") { e.preventDefault(); move(key, w2px(ws, 2)); }
  };

  const pane = (id) => cn("min-h-0 min-w-0 flex-col overflow-hidden rounded-theme border border-line bg-surface/40 lg:flex", mtab === id ? "flex" : "hidden", id === "preview" ? "flex-1" : "flex-1 lg:flex-none");

  return (
    <Page title="Builder" description="Write a prompt, edit Markdown, HTML and CSS, preview in phone, tablet and desktop widths, then export or publish your small site." noindex>
      <div className="min-h-screen w-full max-w-none bg-bg pb-0">
        <AppBar
          title={project.title}
          onTitle={(v) => setField("title", v)}
          save={save}
          canUndo={h.past.length > 0}
          canRedo={h.future.length > 0}
          onUndo={undo}
          onRedo={redo}
          onHistory={openDrawer}
          onExport={openDrawer}
          onPublish={() => setPub(true)}
        />
        <div ref={ws} className="flex h-[calc(100dvh-56px-64px)] flex-col gap-2 p-2 lg:h-[max(900px,calc(100vh-56px))] lg:flex-row lg:gap-0 lg:p-3">
          <div role="tablist" aria-label="Builder views" className="grid shrink-0 grid-cols-3 rounded-theme border border-line p-1 lg:hidden">
            {MTABS.map(([k, l]) => (
              <button key={k} role="tab" type="button" aria-selected={mtab === k} onClick={() => setMtab(k)} className={cn("min-h-[44px] rounded-[6px] text-[15px] font-[650] transition-colors duration-[140ms]", mtab === k ? "bg-ink/10 text-ink shadow-[inset_0_-2px_0_#2DD4A3]" : "text-muted")}>{l}</button>
            ))}
          </div>
          <div className={cn(pane("prompt"), "lg:w-[var(--w)]")} style={{ "--w": cols.a + "%" }}>
            <div className="min-h-0 flex-1">
              <PromptRail
                project={project}
                onPrompt={(v) => setQuiet((p) => ({ ...p, prompt: v }))}
                onGenerate={() => { setPreviewV(null); runGenerate(projRef.current); }}
                generating={generating}
                genError={genError}
                onRetry={() => runGenerate(projRef.current, lastRun.current)}
                onKeepEditing={() => { setGenError(null); openSource(); }}
                onRefine={(r) => runGenerate(projRef.current, r)}
                onBlock={onBlock}
                onVibe={onVibe}
                onToken={(k, v) => apply((p) => ({ ...p, tokens: { ...p.tokens, [k]: v } }), "t-" + k)}
                hasCode={has}
              />
            </div>
          </div>
          <Separator label="Resize prompt and source panes" value={cols.a} onMove={(dx) => move("a", dx)} onKey={keyOf("a")} />
          <div className={cn(pane("code"), "lg:w-[var(--w)]")} style={{ "--w": cols.b + "%" }}>
            <div className="min-h-0 flex-1">
              <SourceEditor project={project} tab={tab} setTab={setTab} onChange={setField} generating={generating} textareaRef={editorRef} />
            </div>
          </div>
          <Separator label="Resize source and preview panes" value={cols.b} onMove={(dx) => move("b", dx)} onKey={keyOf("b")} />
          <div className={cn(pane("preview"), "lg:min-w-0 lg:flex-1")}>
            <Preview project={shown} generating={generating} onOpenSource={openSource} banner={banner} />
          </div>
        </div>

        <div className="mx-auto max-w-[1380px] space-y-6 px-2 pb-24 pt-6 sm:px-4 lg:pb-12">
          <ExportDrawer
            id="versions-export"
            project={project}
            versions={versions}
            previewId={previewV?.id}
            onPreview={(v) => { setPreviewV(v); setMtab("preview"); }}
            onRestore={(v) => { apply(v.project, ""); setPreviewV(null); toast("Version restored."); }}
            onKeep={() => setPreviewV(null)}
            onSave={() => { setVersions(pushVersion(project, "Saved by you")); toast("Version saved."); }}
            open={drawer}
            onToggle={() => setDrawer((d) => !d)}
          />
          <PublishPanel project={project} onPublish={() => setPub(true)} />
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 gap-1 border-t border-line bg-bg/95 px-2 py-2 backdrop-blur lg:hidden">
          {[
            ["Undo", Undo2, undo, h.past.length === 0],
            ["Preview", Eye, () => setMtab("preview"), false],
            ["Export", Download, openDrawer, false],
          ].map(([l, Icon, fn, dis]) => (
            <button key={l} type="button" onClick={fn} disabled={dis} className="inline-flex min-h-[44px] flex-col items-center justify-center gap-0.5 rounded-theme text-[13px] text-muted active:scale-[0.98] enabled:hover:text-ink disabled:opacity-40">
              <Icon className="h-4 w-4" aria-hidden="true" />{l}
            </button>
          ))}
          <Button className="h-full" onClick={() => setPub(true)}><Upload className="h-4 w-4" aria-hidden="true" />Publish</Button>
        </div>

        <PublishDrawer
          open={pub}
          onClose={() => setPub(false)}
          project={project}
          onPublished={(row, name) => setQuiet((p) => ({ ...p, title: name || p.title, siteId: row.id, slug: row.slug }))}
        />
      </div>
    </Page>
  );
}

function w2px(ws, pct) {
  return ((ws.current?.offsetWidth || 1200) * pct) / 100;
}
