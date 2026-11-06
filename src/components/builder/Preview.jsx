import { useEffect, useMemo, useState } from "react";
import { Smartphone, Tablet, Monitor, Code } from "lucide-react";
import { cn } from "@wron/kit";
import { buildDocument, hasCode } from "../../lib/build";
import { CodeSkeleton, StateMessage, Button } from "../ui";

const DEVICES = [
  { key: "phone", label: "Phone", width: 390, Icon: Smartphone },
  { key: "tablet", label: "Tablet", width: 768, Icon: Tablet },
  { key: "desktop", label: "Desktop", width: null, Icon: Monitor },
];

export default function Preview({ project, generating, onOpenSource, banner }) {
  const [device, setDevice] = useState("desktop");
  const [resetKey, setResetKey] = useState(0);
  const [doc, setDoc] = useState({ html: "", error: false });

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        setDoc({ html: hasCode(project) ? buildDocument(project) : "", error: false });
      } catch {
        setDoc({ html: "", error: true });
      }
    }, 120);
    return () => clearTimeout(t);
  }, [project, resetKey]);

  const dev = DEVICES.find((d) => d.key === device);
  const empty = !hasCode(project);
  const frameStyle = useMemo(() => ({ width: dev.width ? dev.width + "px" : "100%" }), [dev]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-3">
      <div role="group" aria-label="Preview width" className="grid shrink-0 grid-cols-3 gap-1 rounded-theme border border-line p-1">
        {DEVICES.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            aria-pressed={device === key}
            onClick={() => setDevice(key)}
            className={cn(
              "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[6px] border px-2 text-[14px] font-[600] transition-colors duration-150 lg:min-h-[40px]",
              device === key ? "border-primary text-ink" : "border-transparent text-muted hover:text-ink"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
      {banner}
      <div className="pane-scroll relative min-h-0 flex-1 overflow-auto rounded-theme border border-line bg-[#0E1115]">
        {generating ? (
          <div className="grid h-full content-center gap-5 p-8" role="status" aria-live="polite">
            <CodeSkeleton rows={3} />
            <div>
              <p className="font-[650] text-ink">Building your page...</p>
              <p className="text-[15px] text-muted">Your prompt is safe while the source is prepared.</p>
            </div>
          </div>
        ) : doc.error ? (
          <div className="grid h-full place-items-center p-6">
            <StateMessage
              tone="error"
              title="The preview could not render this code."
              actions={
                <>
                  <Button variant="secondary" onClick={onOpenSource}>Open source</Button>
                  <Button variant="secondary" onClick={() => setResetKey((k) => k + 1)}>Reset preview</Button>
                </>
              }
            />
          </div>
        ) : empty ? (
          <div className="grid h-full place-items-center p-6 text-center">
            <div>
              <Code className="mx-auto h-14 w-14 text-accent" aria-hidden="true" />
              <p className="mx-auto mt-4 max-w-[16rem] text-[17px] text-muted">Type a prompt or pick a vibe to start.</p>
            </div>
          </div>
        ) : (
          <div className="flex h-full justify-center">
            <div className="h-full max-w-full transition-[width] duration-[240ms] ease-out motion-reduce:transition-none" style={frameStyle}>
              <iframe
                key={resetKey}
                title="Live preview of your page"
                sandbox=""
                srcDoc={doc.html}
                className="block h-full w-full border-0 bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
