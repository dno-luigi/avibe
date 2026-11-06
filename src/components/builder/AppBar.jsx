import { Link } from "react-router";
import { ArrowLeft, Undo2, Redo2, History, Download } from "lucide-react";
import { cn } from "@wron/kit";
import Logo from "../Logo";
import { Button } from "../ui";

const ghost = "inline-flex min-h-[44px] items-center gap-1.5 rounded-theme px-2.5 text-[14px] font-[500] text-muted transition-colors hover:bg-ink/5 hover:text-ink active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const STATUS = {
  saving: ["Saving locally", "bg-muted"],
  saved: ["Saved locally", "bg-primary"],
  failed: ["Could not save locally. Copy or download your work.", "bg-[#F87171]"],
};

export default function AppBar({ title, onTitle, save, canUndo, canRedo, onUndo, onRedo, onHistory, onExport, onPublish }) {
  const [label, dot] = STATUS[save] || STATUS.saved;
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-bg/95 px-3 backdrop-blur lg:gap-4 lg:px-5">
      <Logo compact className="shrink-0 !text-[15px] min-[1100px]:!text-[20px]" />
      <Link to="/" className={cn(ghost, "hidden lg:inline-flex")}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to home
      </Link>
      <div className="flex min-w-0 flex-1 items-center justify-center gap-3">
        <label htmlFor="project-name" className="sr-only">Project name</label>
        <input
          id="project-name"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          placeholder="Untitled site"
          maxLength={80}
          className="h-11 w-full min-w-0 max-w-[16rem] rounded-theme border border-line bg-surface px-3 text-[14px] text-ink placeholder:text-muted hover:border-[#3A4552] focus:border-primary focus:outline-none"
        />
        <span role="status" className="hidden items-center gap-2 font-mono text-[13px] text-muted xl:flex">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", dot)} aria-hidden="true" />
          {label}
        </span>
        <span role="status" className="xl:hidden"><span className={cn("block h-2.5 w-2.5 rounded-full", dot)} aria-hidden="true" /><span className="sr-only">{label}</span></span>
      </div>
      <div className="hidden items-center gap-0.5 lg:flex">
        <button type="button" className={ghost} onClick={onUndo} disabled={!canUndo}><Undo2 className="h-4 w-4" aria-hidden="true" />Undo</button>
        <button type="button" className={ghost} onClick={onRedo} disabled={!canRedo}><Redo2 className="h-4 w-4" aria-hidden="true" />Redo</button>
        <button type="button" className={ghost} onClick={onHistory}><History className="h-4 w-4" aria-hidden="true" />History</button>
        <button type="button" className={ghost} onClick={onExport}><Download className="h-4 w-4" aria-hidden="true" />Export</button>
        <div className="ml-2 grid justify-items-end">
          <Button size="md" onClick={onPublish}>Publish</Button>
          <span className="sr-only">Account required to publish.</span>
        </div>
      </div>
      <Link to="/" aria-label="Back to home" className={cn(ghost, "px-2 lg:hidden")}><ArrowLeft className="h-5 w-5" aria-hidden="true" /></Link>
    </header>
  );
}
