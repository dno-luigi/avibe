# Vibe Microsite Builder

Describe a page in plain words and get Markdown, HTML and CSS back. Edit every
line, push the styling, then export or publish a tiny site.

    npm install
    npm run dev      # http://localhost:5173  (the app)
    npm run api      # http://127.0.0.1:8787  (the backend, in another terminal)
    npm run build    # static files in dist/
    npm run deploy   # build, then deploy the Worker and the app to Cloudflare

Every page is in `src/pages`, shared parts in `src/components`, and the design tokens
(colors, fonts, radius) in `site.json` and `tailwind.config.js`.

## Backend: Cloudflare, not Wron

The site was exported from Wron, whose hosted backend served accounts, the
`sites` table, contact forms and AI generation. That connection is replaced by a
Cloudflare Worker in this repo, so the data lives in your own account:

| What | Where |
| --- | --- |
| API (`/api/site/:id/auth`, `/db`, `/forms`, `/ai`) | `worker/index.js` |
| Accounts and sessions | `worker/auth.js`, tables `users` and `sessions` |
| The `sites` table (from `db/schema.json`) | `worker/db.js`, table `sites` |
| Contact form entries | table `form_submissions` |
| AI usage counting | `worker/ai.js`, table `ai_usage` |
| Schema and indexes | `migrations/0001_init.sql` |
| Worker, assets and D1 binding | `wrangler.jsonc` |

The client kit in `src/wron-kit` keeps its API (`useUser`, `auth`, `table`,
`useForm`, `ai`) and now talks to this Worker: `index.html` sets
`window.__SITE__` to the site's own origin, and the kit calls
`/api/site/<siteId>/<action>` there.

Access rules for `sites` are enforced in the Worker, not the browser: anyone can
read a site (a published page is public), signed-in people can publish, and only
the author can update or delete their row.

### First deploy

1. `npx wrangler login` (or set `CLOUDFLARE_API_TOKEN` in CI).
2. Create the database and copy its id into `wrangler.jsonc`:

       npx wrangler d1 create vibe-microsite-builder

   Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with the `database_id` it prints.
3. Create the tables (remote, and `--local` for your dev database):

       npm run db:migrate
       npm run db:migrate:local

4. `npm run deploy`.

The Worker serves `dist/` and every non-API path falls back to `index.html`, so
`/builder` and `/s/<slug>` load the app.

### AI generation

Pick one, on your own account:

- Workers AI: uncomment `"ai": { "binding": "AI" }` in `wrangler.jsonc`.
- An OpenAI-compatible key: `npx wrangler secret put OPENAI_API_KEY`, and
  optionally `OPENAI_BASE_URL` / `AI_MODEL` (defaults to OpenAI and `gpt-4o-mini`).

With neither, the builder still works by hand: only the prompt button reports
that generation is not connected. `AI_DAILY_LIMIT` (default 20 per IP per day)
keeps an open builder from spending without limit.

### Notes

- Contact form entries are stored in D1, not emailed. Read them with
  `npx wrangler d1 execute vibe-microsite-builder --remote --command "SELECT form, data, created_at FROM form_submissions ORDER BY created_at DESC"`,
  or add email delivery with a provider of your choice.
- Passwords are hashed with PBKDF2-SHA256 (100,000 iterations) in WebCrypto.
  Sign-in signs up on the Workers Paid plan with a larger CPU budget if the free
  plan's 10 ms per request is too tight.
- Google sign-in, owner passes, Stripe checkout, file uploads and appointments
  were Wron features and are not implemented here; those endpoints answer with a
  readable "not set up" error.
