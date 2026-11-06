import { Clock, Copy, Download, FileArchive, ChevronDown } from "lucide-react";
import { toast, cn } from "@wron/kit";
import { Button } from "../ui";
import { buildDocument, hasCode, sizeKb, copyText, downloadFile, fileSlug } from "../../lib/build";
import { projectZip } from "../../lib/zip";

/* Copy code / Download HTML / Download ZIP, with the export size. Shared by both builder panels. */
export function ExportActions({ project }) {
  const has = hasCode(project);
  const doc = has ? buildDocument(project) : "";

  async function copy() {
    toast((await copyText(doc)) ? "Code copied." : "Copy did not work. Select the source and copy it.");
  }
  function html() {
    downloadFile(fileSlug(project.title) + ".html", doc);
  }
  function zip() {
    const z = projectZip(project);
    downloadFile(z.name, z.blob, "application/zip");
  }

  return (
    <div>
      <p className="text-[16px] text-ink"><strong className="font-[650]">Export size:</strong> <span className="text-muted">{has ? sizeKb(doc) + " KB" : "waiting for code"}</span></p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="secondary" size="lg" onClick={copy} disabled={!has}><Copy className="h-4 w-4" aria-hidden="true" />Copy code</Button>
        <Button variant="secondary" size="lg" onClick={html} disabled={!has}><Download className="h-4 w-4" aria-hidden="true" />Download HTML</Button>
        <Button variant="secondary" size="lg" onClick={zip} disabled={!has}><FileArchive className="h-4 w-4" aria-hidden="true" />Download ZIP</Button>
      </div>
      <p className="mt-5 max-w-md text-[16px] text-muted">The final output is designed as a small page without a heavy framework.</p>
    </div>
  );
}

/* Accordion panel: version history on the left, export actions on the right. */
export default function ExportDrawer({ id, project, versions, previewId, onPreview, onRestore, onKeep, onSave, open, onToggle }) {
  const has = hasCode(project);

  return (
    <section id={id} aria-labelledby="export-h" className="scroll-mt-4 rounded-theme border border-line bg-surface/60">
      <h2 id="export-h" className="font-display text-[22px] font-[650]">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          className="flex min-h-[56px] w-full items-center gap-4 px-5 text-left hover:text-primary"
        >
          <ChevronDown className={cn("h-5 w-5 shrink-0 text-muted transition-transform duration-200", !open && "-rotate-90")} aria-hidden="true" />
          Versions and export
        </button>
      </h2>
      {open && (
        <div id={`${id}-body`} className="grid gap-6 border-t border-line p-5 lg:grid-cols-[2fr_3fr] lg:p-8">
          <div>
            {versions.length === 0 ? (
              <div className="grid gap-1 py-4">
                <Clock className="mb-2 h-8 w-8 text-muted" aria-hidden="true" />
                <p className="text-[17px] text-ink">No saved versions yet.</p>
                <p className="text-[15px] text-muted">Changes will appear here after your first save.</p>
              </div>
            ) : (
              <ul className="pane-scroll grid max-h-72 gap-2 overflow-y-auto">
                {versions.map((v) => (
                  <li key={v.id} className={"rounded-theme border p-3 " + (previewId === v.id ? "border-primary" : "border-line")}>
                    <p className="text-[15px] font-[600] text-ink">{v.label}</p>
                    <p className="font-mono text-[13px] text-muted">{new Date(v.at).toLocaleString()}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onPreview(v)}>Preview</Button>
                      <Button size="sm" variant="secondary" onClick={() => onRestore(v)}>Restore</Button>
                      {previewId === v.id && <Button size="sm" variant="ghost" onClick={onKeep}>Keep current</Button>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="secondary" className="mt-3" onClick={onSave} disabled={!has}>Save a version now</Button>
          </div>
          <div className="lg:border-l lg:border-line lg:pl-8">
            <ExportActions project={project} />
          </div>
        </div>
      )}
    </section>
  );
}
