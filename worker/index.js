// Cloudflare backend for Vibe Microsite Builder.
//
// The app's bundled client kit (src/wron-kit/cloud.js) was written against a
// hosted backend at /api/site/<siteId>/<action>. This Worker serves that same
// contract from Cloudflare, so forms, accounts, tables and AI calls go to your
// own Worker and D1 database instead of wron.ai:
//
//   POST /api/site/:siteId/auth    { action: signup | signin | signout | me }
//   POST /api/site/:siteId/db      { op: list | get | add | update | remove | count, ... }
//   POST /api/site/:siteId/forms   { form, data }
//   POST /api/site/:siteId/ai      { messages, system }
//   POST /api/site/:siteId/hit     page-view beacon (accepted, not stored)
//   POST /api/site/:siteId/errors  client-error beacon (accepted, not stored)
//
// Anything else falls through to the built single-page app in ./dist.
import { handleAi } from "./ai.js";
import { handleAuth, findUserBySession } from "./auth.js";
import { handleDb } from "./db.js";
import { sha256Hex } from "./crypto.js";
import { fail, json, nowIso, readBody, sessionToken } from "./util.js";

const ROUTE = /^\/api\/site\/([A-Za-z0-9_-]{1,64})\/([a-z]+)\/?$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = ROUTE.exec(url.pathname);

    if (!match) {
      if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
        return fail(404, "not_found", "No such endpoint.");
      }
      return env.ASSETS.fetch(request);
    }

    if (request.method !== "POST") return fail(405, "method_not_allowed", "Use POST.");
    if (!env.DB) return fail(503, "not_connected", "This site is not connected to its database yet.");

    let body;
    try {
      body = await readBody(request);
    } catch {
      return fail(413, "too_large", "That request is too large.");
    }

    const action = match[2];
    try {
      switch (action) {
        case "auth":
          return await handleAuth(request, env, body);
        case "db":
          return await handleDb(request, env, body);
        case "forms":
          return await handleForms(request, env, body);
        case "ai":
          return await handleAi(request, env, body);
        case "hit":
        case "errors":
          // Beacons: accepted so the page never errors, deliberately not stored.
          return new Response(null, { status: 204 });
        default:
          return fail(501, "not_supported", `"${action}" is not part of this site's backend.`);
      }
    } catch (err) {
      console.error(`${action} failed:`, err && err.stack ? err.stack : err);
      return fail(500, "server_error", "Something went wrong on the server. Please try again.");
    }
  },
};

/** A contact form entry, kept in D1: SELECT * FROM form_submissions in the dashboard. */
async function handleForms(request, env, body) {
  const form = String(body.form || "form").slice(0, 80);
  const data = body.data && typeof body.data === "object" ? body.data : {};
  const user = await findUserBySession(env.DB, sessionToken(request));
  const ip = request.headers.get("cf-connecting-ip") || "local";
  await env.DB.prepare(
    "INSERT INTO form_submissions (id, form, data, user_id, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(crypto.randomUUID(), form, JSON.stringify(data).slice(0, 100_000), user?.id || null, await sha256Hex(ip), nowIso())
    .run();
  return json({ ok: true, sent: true });
}
