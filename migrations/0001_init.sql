-- D1 schema for Vibe Microsite Builder.
-- Mirrors db/schema.json (the "sites" table, community access) and adds what the
-- backend needs to serve it: accounts, sessions, form entries and AI usage.

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email ON users (email);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS sessions_user ON sessions (user_id);

CREATE TABLE IF NOT EXISTS sites (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL DEFAULT '',
  slug         TEXT NOT NULL UNIQUE,
  markdown     TEXT NOT NULL DEFAULT '',
  html         TEXT NOT NULL DEFAULT '',
  css          TEXT NOT NULL DEFAULT '',
  vibe         TEXT NOT NULL DEFAULT '',
  tokens       TEXT NOT NULL DEFAULT '{}',
  output       TEXT NOT NULL DEFAULT '',
  size_kb      REAL NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'published',
  published_at TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  user_id      TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS sites_slug ON sites (slug);
CREATE INDEX IF NOT EXISTS sites_user ON sites (user_id);
CREATE INDEX IF NOT EXISTS sites_status ON sites (status);

CREATE TABLE IF NOT EXISTS form_submissions (
  id         TEXT PRIMARY KEY,
  form       TEXT NOT NULL,
  data       TEXT NOT NULL DEFAULT '{}',
  user_id    TEXT,
  ip_hash    TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS form_submissions_form ON form_submissions (form, created_at);

CREATE TABLE IF NOT EXISTS ai_usage (
  id         TEXT PRIMARY KEY,
  ip_hash    TEXT NOT NULL,
  day        TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS ai_usage_day ON ai_usage (day, ip_hash);
