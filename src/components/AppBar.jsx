import { cn } from "@wron/kit";
import Logo from "./Logo";

/*
  The 56px product bar used by Builder and My sites (they replace the site header).
  <AppBar left={<extra after logo/>} center={...} right={...} />
*/
export default function AppBar({ left, center, right, className }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-line bg-bg/95 px-3 backdrop-blur sm:px-5",
        className
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Logo compact className="text-[15px] sm:text-[17px]" />
        {left}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-center">{center}</div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">{right}</div>
    </header>
  );
}
