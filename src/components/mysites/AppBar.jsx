import { NavLink, Link } from "react-router";
import { cn } from "@wron/kit";
import Logo from "../Logo";
import AccountButton from "../AccountButton";
import { buttonClass } from "../ui";

export default function AppBar() {
  const cls = ({ isActive }) =>
    cn(
      "hidden h-11 items-center rounded-theme px-3 text-[15px] font-[500] transition-colors hover:bg-ink/5 hover:text-ink sm:inline-flex",
      isActive ? "text-ink" : "text-muted"
    );
  return (
    <div className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-page items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Logo compact className="mr-auto" />
        <nav aria-label="Primary" className="flex items-center gap-1">
          <NavLink to="/builder" className={cls}>Builder</NavLink>
          <NavLink to="/vibes" className={cls}>Vibes</NavLink>
          <Link to="/builder" className={buttonClass("primary", "md", "mx-1")}>New site</Link>
          <AccountButton className="hidden sm:inline-flex" />
        </nav>
      </div>
    </div>
  );
}
