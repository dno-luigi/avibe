import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Dialog, toast } from "@wron/kit";
import AuthPanel from "./AuthPanel";

/*
  Site-wide sign-in dialog.
  const { openAuth } = useAuthDialog();
  openAuth({ title, intro, mode: "signin" | "signup", onDone: (user) => {} })
*/
const Ctx = createContext({ openAuth: () => {}, closeAuth: () => {} });

export function AuthDialogProvider({ children }) {
  const [state, setState] = useState(null);
  const doneRef = useRef(null);

  const openAuth = useCallback((opts = {}) => {
    doneRef.current = opts.onDone || null;
    setState({ title: opts.title || "Sign in", intro: opts.intro || "You can build and preview without an account. Sign in to publish and return to saved sites.", mode: opts.mode || "signin" });
  }, []);
  const closeAuth = useCallback(() => setState(null), []);
  const value = useMemo(() => ({ openAuth, closeAuth }), [openAuth, closeAuth]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Dialog open={!!state} onClose={closeAuth} title={state?.title || "Sign in"} panelClassName="bg-surface border border-line text-ink max-w-md">
        {state && (
          <AuthPanel
            initialMode={state.mode}
            intro={state.intro}
            onDone={(user) => {
              const cb = doneRef.current;
              setState(null);
              toast.success("You are signed in.");
              cb && cb(user);
            }}
          />
        )}
      </Dialog>
    </Ctx.Provider>
  );
}

export function useAuthDialog() {
  return useContext(Ctx);
}
