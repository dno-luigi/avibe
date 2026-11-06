// Accounts: email and password, with sessions kept in D1.
//
// The client kit (src/wron-kit/cloud.js) asks for the same shapes it asked Wron
// for: sign-up and sign-in return { user, session }, and every later request
// carries the session token in X-Wron-Session.
import { randomToken, sha256Hex, verifyPassword, hashPassword } from "./crypto.js";
import { fail, json, nowIso, sessionToken } from "./util.js";

const SESSION_DAYS = 30;
const EMAIL = /^[^@\s]{1,64}@[^@\s]{1,190}\.[^@\s]{2,24}$/;

function publicUser(row) {
  if (!row) return null;
  return { id: row.id, email: row.email, name: row.name || "", created_at: row.created_at };
}

export async function findUserBySession(db, token) {
  if (!token) return null;
  const row = await db
    .prepare("SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?")
    .bind(await sha256Hex(token), nowIso())
    .first();
  return row || null;
}

async function startSession(db, userId) {
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString();
  await db
    .prepare("INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(await sha256Hex(token), userId, nowIso(), expiresAt)
    .run();
  return token;
}

export async function handleAuth(request, env, body) {
  const db = env.DB;
  const action = String(body.action || "");

  if (action === "me") {
    const user = await findUserBySession(db, sessionToken(request));
    if (!user) return fail(401, "sign_in_required", "Sign in to continue.");
    return json({ user: publicUser(user) });
  }

  if (action === "signup") {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim().slice(0, 80);
    if (!EMAIL.test(email)) return fail(400, "invalid_email", "That email address does not look right.");
    if (password.length < 8) return fail(400, "weak_password", "Use a password of at least 8 characters.");
    if (password.length > 200) return fail(400, "weak_password", "Use a password of 200 characters or fewer.");

    const existing = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
    if (existing) return fail(409, "email_taken", "An account with that email already exists. Try signing in.");

    const { hash, salt } = await hashPassword(password);
    const user = { id: crypto.randomUUID(), email, name, created_at: nowIso() };
    await db
      .prepare("INSERT INTO users (id, email, name, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(user.id, user.email, user.name, hash, salt, user.created_at)
      .run();
    return json({ user: publicUser(user), session: await startSession(db, user.id) });
  }

  if (action === "signin") {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const row = await db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    // One reply for a missing account and a wrong password: neither should tell a stranger which emails exist.
    if (!row || !(await verifyPassword(password, row.password_salt, row.password_hash))) {
      return fail(401, "invalid_credentials", "That email and password do not match.");
    }
    return json({ user: publicUser(row), session: await startSession(db, row.id) });
  }

  if (action === "signout") {
    const token = sessionToken(request);
    if (token) await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
    return json({ ok: true });
  }

  // Wron-only flows (Google sign-in, owner passes). Present so the kit gets a
  // readable message instead of a crash; configure your own if you need them.
  if (action === "google_start" || action === "google_finish") {
    return fail(501, "not_supported", "Google sign-in is not set up on this site. Use email and password.");
  }
  if (action === "owner_check" || action === "owner_redeem") {
    return fail(501, "not_supported", "Owner sign-in is not set up on this site.");
  }
  return fail(400, "unknown_action", "That account action does not exist.");
}
