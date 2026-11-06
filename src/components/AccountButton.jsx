import { useUser, auth, toast, cn } from "@wron/kit";
import { useAuthDialog } from "./AuthDialog";

/* "Sign in" when signed out, "Sign out" when signed in. */
export default function AccountButton({ className }) {
  const { user, loading } = useUser();
  const { openAuth } = useAuthDialog();
  const cls = cn(
    "inline-flex h-11 items-center rounded-theme px-3 text-[15px] font-[500] text-muted transition-colors hover:text-ink hover:bg-ink/5",
    className
  );
  if (loading) return <span className={cn(cls, "opacity-0")} aria-hidden="true">Sign in</span>;
  if (user) {
    return (
      <button
        type="button"
        className={cls}
        title={user.email}
        onClick={async () => {
          await auth.signOut();
          toast("You are signed out.");
        }}
      >
        Sign out
      </button>
    );
  }
  return (
    <button type="button" className={cls} onClick={() => openAuth()}>
      Sign in
    </button>
  );
}
