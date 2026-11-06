import { table } from "@wron/kit";
import { buildDocument, sizeKb } from "./build";

/*
  Publishing to the "sites" table (community: signed-in people add rows, everyone reads,
  authors edit their own). A published site is served at /s/<slug>.
  publishSite({ name, project, existingId? }) -> the saved row. Requires a signed-in user.
  My sites lists rows where mine === true (filter in JS after useTable("sites")).
*/

function baseSlug(name) {
  return (String(name || "site").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "site").slice(0, 40);
}

async function uniqueSlug(name) {
  const base = baseSlug(name);
  for (let i = 0; i < 6; i++) {
    const slug = i === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const n = await table("sites").count({ where: { slug } });
    if (!n) return slug;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export function shareUrl(slug) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/s/${slug}`;
}

export async function publishSite({ name, project, existingId }) {
  const output = buildDocument({ ...project, title: name || project.title });
  const values = {
    name: name || project.title || "Untitled site",
    markdown: project.markdown || "",
    html: project.html || "",
    css: project.css || "",
    vibe: project.vibe || "",
    tokens: project.tokens || {},
    output,
    size_kb: sizeKb(output),
    status: "published",
    published_at: new Date().toISOString(),
  };
  if (existingId) {
    return table("sites").update(existingId, values);
  }
  const slug = await uniqueSlug(values.name);
  return table("sites").add({ ...values, slug });
}

export async function unpublishSite(id) {
  return table("sites").update(id, { status: "unpublished" });
}

export async function deleteSite(id) {
  return table("sites").remove(id);
}

/* Turn a saved row back into a builder project */
export function rowToProject(row) {
  return {
    title: row.name || "Untitled site",
    markdown: row.markdown || "",
    html: row.html || "",
    css: row.css || "",
    vibe: row.vibe || "dark-neon",
    tokens: row.tokens || {},
    siteId: row.id,
    slug: row.slug,
  };
}
