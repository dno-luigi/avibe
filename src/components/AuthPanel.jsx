import { useState } from "react";
import { auth } from "@wron/kit";
import { Field, Button } from "./ui";

/*
  Email and password sign-in / create-account. Used by the sign-in dialog,
  the Builder's publish drawer and the My sites page.
  onDone(user) runs after a successful sign in or sign up.
*/
function friendly(err, mode) {
  const msg = (err && err.message) || "";
  if (/password/i.test(msg) && /short|8/i.test(msg)) return "That password is too short. Use at least 8 characters.";
  if (/exist|taken|already/i.test(msg)) return "An account with that email already exists. Try signing in.";
  if (/invalid|incorrect|wrong|credentials/i.test(msg)) return "That email and password do not match.";
  return msg || (mode === "signup" ? "The account could not be created. Try again." : "Sign in did not work. Try again.");
}

export default function AuthPanel({ onDone, initialMode = "signin", intro }) {
  const [mode, setMode] = useState(initialMode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "").trim();
    setError("");
    if (password.length < 8) {
      setError("That password is too short. Use at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const user =
        mode === "signup"
          ? await auth.signUp({ email, password, name })
          : await auth.signIn({ email, password });
      onDone && onDone(user);
    } catch (err) {
      setError(friendly(err, mode));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {intro && <p className="mb-5 text-[15px] text-muted">{intro}</p>}
      <div role="tablist" aria-label="Account" className="mb-5 grid grid-cols-2 rounded-theme border border-line p-1">
        {[
          ["signin", "Sign in"],
          ["signup", "Create account"],
        ].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={mode === key}
            onClick={() => { setMode(key); setError(""); }}
            className={
              "h-11 rounded-[6px] text-[15px] font-[650] transition-colors duration-150 " +
              (mode === key ? "bg-ink/10 text-ink" : "text-muted hover:text-ink")
            }
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="grid gap-4" noValidate={false}>
        {mode === "signup" && <Field label="Name" name="name" autoComplete="name" />}
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          hint={mode === "signup" ? "At least 8 characters." : undefined}
        />
        <Button type="submit" size="lg" disabled={busy} loading={busy} className="w-full">
          {mode === "signup" ? "Create account" : "Sign in"}
        </Button>
        {error && <p role="alert" className="text-[14px] text-[#FCA5A5]">{error}</p>}
      </form>
    </div>
  );
}
