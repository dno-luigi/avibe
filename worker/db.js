// The "sites" table from db/schema.json, implemented on D1.
//
// Access is the "community" rule the schema declares: anyone may read (a
// published site is a public page), signed-in people may add, and only the
// author may update or delete their own rows. The rules live here, on the
// server, never in the browser.
//
// Column names are never taken from the request: only the names in COLUMNS can
// reach the SQL, and every value is bound as a parameter.
import { findUserBySession } from "./auth.js";
import { fail, json, nowIso, sessionToken } from "./util.js";

const TABLE = "sites";
const MAX_LIMIT = 200;

const COLUMNS = {
  name: "text",
  slug: "text",
  markdown: "text",
  html: "text",
  css: "text",
  vibe: "text",
  tokens: "json",
  output: "text",
  size_kb: "number",
  status: "text",
  published_at: "text",
};

/** Keep only known columns and store each value in the type the schema declares. */
function pick(values) {
  const out = {};
  for (const [key, raw] of Object.entries(values || {})) {
    const type = COLUMNS[key];
    if (!type) continue;
    if (type === "number") {
      const number = Number(raw);
      if (Number.isFinite(number)) out[key] = number;
    } else if (type === "json") {
      out[key] = JSON.stringify(raw ?? {});
    } else {
      out[key] = raw == null ? null : String(raw);
    }
  }
  return out;
}

function shape(row, user) {
  if (!row) return null;
  // `mine` is what My sites filters on; the author's user id itself stays private.
  const out = {
    id: row.id,
    created_at: row.created_at,
    updated_at: row.updated_at,
    mine: !!user && row.user_id === user.id,
  };
  for (const key of Object.keys(COLUMNS)) {
    out[key] = COLUMNS[key] === "json" ? parseJson(row[key]) : row[key];
  }
  return out;
}

function parseJson(value) {
  if (value == null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function conditions(where) {
  const parts = [];
  const values = [];
  for (const [key, value] of Object.entries(where || {})) {
    if (key === "id") {
      parts.push("id = ?");
      values.push(String(value));
      continue;
    }
    if (!COLUMNS[key]) continue;
    if (value == null) {
      parts.push(`${key} IS NULL`);
      continue;
    }
    parts.push(`${key} = ?`);
    values.push(COLUMNS[key] === "number" ? Number(value) : String(value));
  }
  return { clause: parts.length ? ` WHERE ${parts.join(" AND ")}` : "", values };
}

function uniqueViolation(err) {
  return /UNIQUE constraint failed/i.test(String((err && err.message) || ""));
}

export async function handleDb(request, env, body) {
  const db = env.DB;
  if (String(body.table || "") !== TABLE) return fail(404, "unknown_table", "That table is not available on this site.");

  const op = String(body.op || "list");
  const user = await findUserBySession(db, sessionToken(request));

  if (op === "list" || op === "count") {
    const { clause, values } = conditions(body.where);
    if (op === "count") {
      const row = await db.prepare(`SELECT COUNT(*) AS n FROM ${TABLE}${clause}`).bind(...values).first();
      return json({ count: Number(row?.n || 0) });
    }
    // `where` is what a slug lookup uses, and it is allowed to come back first: one row.
    const limit = Math.min(Math.max(Number(body.limit) || MAX_LIMIT, 1), MAX_LIMIT);
    const orderBy = Object.prototype.hasOwnProperty.call(COLUMNS, body.orderBy)
      ? body.orderBy
      : body.where && Object.keys(body.where).length && Number(body.limit) === 1
        ? "created_at"
        : "updated_at";
    const direction = body.desc === false ? "ASC" : "DESC";
    const { results } = await db
      .prepare(`SELECT * FROM ${TABLE}${clause} ORDER BY ${orderBy} ${direction} LIMIT ?`)
      .bind(...values, limit)
      .all();
    return json({ rows: (results || []).map((row) => shape(row, user)) });
  }

  if (op === "get") {
    const row = await db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`).bind(String(body.id || "")).first();
    return json({ row: shape(row, user) });
  }

  if (op === "add") {
    if (!user) return fail(401, "sign_in_required", "Sign in to publish a site.");
    const values = pick(body.values);
    if (!values.slug) return fail(400, "missing_slug", "A site needs an address.");
    const at = nowIso();
    const row = { id: crypto.randomUUID(), ...values, created_at: at, updated_at: at, user_id: user.id };
    const keys = Object.keys(row);
    try {
      await db
        .prepare(`INSERT INTO ${TABLE} (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`)
        .bind(...Object.values(row))
        .run();
    } catch (err) {
      if (uniqueViolation(err)) return fail(409, "slug_taken", "That address is already taken. Publish again to pick another.");
      throw err;
    }
    return json({ row: shape(row, user) });
  }

  if (op === "update" || op === "remove") {
    if (!user) return fail(401, "sign_in_required", "Sign in to change this site.");
    const row = await db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`).bind(String(body.id || "")).first();
    if (!row) return fail(404, "not_found", "That site no longer exists.");
    if (row.user_id !== user.id) return fail(403, "not_allowed", "Only the author can change this site.");

    if (op === "remove") {
      await db.prepare(`DELETE FROM ${TABLE} WHERE id = ?`).bind(row.id).run();
      return json({ ok: true });
    }

    const values = pick(body.values);
    const keys = Object.keys(values);
    if (!keys.length) return json({ row: shape(row, user) });
    await db
      .prepare(`UPDATE ${TABLE} SET ${keys.map((key) => `${key} = ?`).join(", ")}, updated_at = ? WHERE id = ?`)
      .bind(...Object.values(values), nowIso(), row.id)
      .run();
    const next = await db.prepare(`SELECT * FROM ${TABLE} WHERE id = ?`).bind(row.id).first();
    return json({ row: shape(next, user) });
  }

  return fail(400, "unknown_op", "That database action does not exist.");
}
