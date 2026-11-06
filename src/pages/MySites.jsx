import { Link } from "react-router";
import { Page, useUser } from "@wron/kit";
import AppBar from "../components/mysites/AppBar";
import SignedOutCard from "../components/mysites/SignedOutCard";
import SitesList from "../components/mysites/SitesList";
import { CONTACT } from "../data/site";

export default function MySites() {
  const { user, loading } = useUser();
  return (
    <Page
      title="My sites"
      description="See the micro sites you saved and published with Vibe Microsite Builder. Open, edit, copy the link or unpublish."
      noindex
    >
      <div className="flex min-h-screen flex-col">
      <AppBar />
      <div className="flex-1">
        {loading ? (
          <p role="status" className="px-4 py-24 text-center font-mono text-[14px] text-muted">Loading your sites...</p>
        ) : user ? (
          <SitesList />
        ) : (
          <SignedOutCard />
        )}
      </div>
      <footer className="mt-auto border-t border-line">
        <div className="mx-auto flex max-w-page flex-wrap items-center justify-center gap-x-6 px-4 py-4 font-mono text-[14px] text-muted">
          <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-[44px] items-center break-all hover:text-primary">{CONTACT.email}</a>
          <a href={CONTACT.phoneHref} className="inline-flex min-h-[44px] items-center hover:text-primary">{CONTACT.phoneDisplay}</a>
          <Link to="/privacy" className="inline-flex min-h-[44px] items-center hover:text-ink">Privacy</Link>
          <Link to="/terms" className="inline-flex min-h-[44px] items-center hover:text-ink">Terms</Link>
        </div>
      </footer>
      </div>
    </Page>
  );
}
