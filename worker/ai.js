// AI generation for the builder (src/lib/generate.js -> ai.chat).
//
// Two ways to run it, both on your own account, never on Wron's:
//   Workers AI    add the "ai" binding in wrangler.jsonc
//   OpenAI-compatible  `wrangler secret put OPENAI_API_KEY` (+ OPENAI_BASE_URL, AI_MODEL)
//
// With neither configured the endpoint refuses with a readable message instead
// of silently failing, and every call is counted per visitor IP so an open
// builder cannot spend credits without limit.
import { sha256Hex } from "./crypto.js";
import { fail, json, nowIso } from "./util.js";

const DEFAULT_WORKERS_AI_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";

function clean(messages, system) {
  const list = [];
  if (system) list.push({ role: "system", content: String(system).slice(0, 20_000) });
  for (const message of Array.isArray(messages) ? messages : []) {
    const role = message && ["system", "user", "assistant"].includes(message.role) ? message.role : "user";
    const content = String((message && message.content) || "").slice(0, 60_000);
    if (content) list.push({ role, content });
  }
  // The newest turns are what matter; the full history is not sent again.
  return list.slice(-20);
}

export async function handleAi(request, env, body) {
  if (body.op === "image") return fail(501, "not_supported", "Image generation is not set up on this site.");

  const configured = !!env.AI || !!env.OPENAI_API_KEY;
  if (!configured) {
    return fail(
      503,
      "ai_not_configured",
      "AI generation is not connected. Add an OPENAI_API_KEY secret to the Worker, or bind Workers AI (see README.md).",
    );
  }

  const messages = clean(body.messages, body.system);
  if (!messages.length) return fail(400, "empty_prompt", "Describe the page you want first.");

  const db = env.DB;
  const day = nowIso().slice(0, 10);
  const ip = request.headers.get("cf-connecting-ip") || "local";
  const ipHash = await sha256Hex(ip);
  const limit = Number(env.AI_DAILY_LIMIT || 20) || 20;
  if (db) {
    const used = await db
      .prepare("SELECT COUNT(*) AS n FROM ai_usage WHERE day = ? AND ip_hash = ?")
      .bind(day, ipHash)
      .first();
    if (Number(used?.n || 0) >= limit) {
      return fail(429, "rate_limited", "The daily limit for generated pages is used up. Try again tomorrow.");
    }
  }

  let text;
  try {
    text = await ask(env, messages);
  } catch (err) {
    console.error("ai failed:", err && err.stack ? err.stack : err);
    return fail(502, "ai_failed", "The page could not be generated right now. Try again.");
  }

  if (db) {
    await db
      .prepare("INSERT INTO ai_usage (id, ip_hash, day, created_at) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), ipHash, day, nowIso())
      .run();
  }
  return json({ text });
}

async function ask(env, messages) {
  if (env.AI) {
    const out = await env.AI.run(env.AI_MODEL || DEFAULT_WORKERS_AI_MODEL, { messages });
    const text = typeof out === "string" ? out : out && out.response;
    if (!text) throw new Error("The model returned nothing.");
    return String(text);
  }

  const base = (env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: env.AI_MODEL || DEFAULT_OPENAI_MODEL, messages, temperature: 0.8 }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data && data.error && data.error.message) || `The AI provider answered ${res.status}.`);
  const text = data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!text) throw new Error("The model returned nothing.");
  return String(text);
}
