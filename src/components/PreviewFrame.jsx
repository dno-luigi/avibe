import { cn } from "@wron/kit";

/*
  A sandboxed preview of a built page. No scripts run inside (sandbox without allow-scripts).
  <PreviewFrame html={buildDocument(project)} width="desktop|tablet|phone" title="Preview" />
  When html is empty it shows the empty framed page with a hint.
*/
const WIDTHS = { phone: "390px", tablet: "768px", desktop: "100%" };

export default function PreviewFrame({ html, width = "desktop", title = "Sandboxed preview", emptyText = "Type a prompt or pick a vibe to start.", className, frameClassName }) {
  return (
    <div className={cn("relative flex h-full w-full justify-center overflow-auto bg-[#07090B]", className)}>
      <div
        className="h-full transition-[width] duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        style={{ width: WIDTHS[width] || "100%", maxWidth: "100%" }}
      >
        {html ? (
          <iframe
            title={title}
            sandbox=""
            srcDoc={html}
            className={cn("block h-full w-full border-0 bg-white", width !== "desktop" && "border-x border-line", frameClassName)}
          />
        ) : (
          <div className="flex h-full min-h-[240px] w-full items-center justify-center border border-dashed border-line p-6 text-center">
            <div>
              <p className="font-mono text-[22px] text-accent" aria-hidden="true">&lt;/&gt;</p>
              <p className="mt-2 text-[15px] text-muted">{emptyText}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
