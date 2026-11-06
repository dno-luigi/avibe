import { NavLink, Link, Outlet, useLocation } from "react-router";
import { CookieSettingsLink, cn } from "@wron/kit";
import { SmoothScroll } from "@wron/kit/scroll";
import Logo from "./Logo";
import AccountButton from "./AccountButton";
import { AuthDialogProvider } from "./AuthDialog";
import { buttonClass } from "./ui";
import { NAV, CONTACT, APP_ROUTES } from "../data/site";

function SiteHeader() {
  const navCls = ({ isActive }) =>
    cn(
      "inline-flex h-11 items-center rounded-theme px-3 text-[15px] font-[500] transition-colors hover:text-ink hover:bg-ink/5",
      isActive ? "text-ink" : "text-muted"
    );
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-[1320px] grid-cols-[1fr_auto] items-center gap-3 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="min-w-0 lg:col-span-4">
          <Logo />
        </div>
        <nav aria-label="Primary" className="hidden items-center justify-end gap-1 lg:col-span-5 lg:flex">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={navCls}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center justify-end gap-1 sm:gap-2 lg:col-span-3">
          <NavLink to="/vibes" className={(s) => cn(navCls(s), "px-2 lg:hidden")}>Vibes</NavLink>
          <AccountButton className="hidden lg:inline-flex" />
          <Link to="/builder" className={buttonClass("primary", "md", "h-11 px-4 text-sm sm:px-5")}>
            Open builder
          </Link>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-page gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <Logo />
          <p className="mt-3 max-w-sm text-[15px] text-muted">
            Describe a page. Get a small site in Markdown, HTML and CSS you can edit, export or publish.
          </p>
        </div>
        <nav aria-label="Product" className="lg:col-span-3">
          <ul className="grid gap-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="inline-flex min-h-[44px] items-center text-[15px] text-muted hover:text-ink">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid content-start gap-1 lg:col-span-4">
          <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-[44px] items-center font-mono text-[14px] text-ink hover:text-primary break-all">
            {CONTACT.email}
          </a>
          <a href={CONTACT.phoneHref} className="inline-flex min-h-[44px] items-center font-mono text-[14px] text-ink hover:text-primary">
            {CONTACT.phoneDisplay}
          </a>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-5 gap-y-1 px-4 py-4 text-[14px] text-muted sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Vibe Microsite Builder</span>
          <Link to="/privacy" className="inline-flex min-h-[44px] items-center hover:text-ink">Privacy</Link>
          <Link to="/terms" className="inline-flex min-h-[44px] items-center hover:text-ink">Terms</Link>
          <CookieSettingsLink className="inline-flex min-h-[44px] items-center hover:text-ink">Cookie settings</CookieSettingsLink>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  const isApp = APP_ROUTES.some((r) => pathname === r || pathname.startsWith(r.endsWith("/") ? r : r + "/"));

  return (
    <AuthDialogProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-theme focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-ink"
      >
        Skip to content
      </a>
      {!isApp && <SmoothScroll />}
      {!isApp && <SiteHeader />}
      <div id="main" className="min-h-[60vh] bg-bg text-ink">
        <Outlet />
      </div>
      {!isApp && <SiteFooter />}
    </AuthDialogProvider>
  );
}
