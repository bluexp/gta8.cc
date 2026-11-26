-- Automated continuous sync tables for gta8.cc (Cloudflare D1)

CREATE TABLE IF NOT EXISTS IntelFeed (
  id TEXT PRIMARY KEY NOT NULL,
  source TEXT NOT NULL,         -- 'gta_wiki' | 'wikipedia' | 'reddit_gta6' | 'rockstar' | 'manual'
  sourceType TEXT NOT NULL,     -- 'vehicle' | 'weapon' | 'location' | 'news' | 'update'
  externalId TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  url TEXT NOT NULL,
  tagsJson TEXT NOT NULL DEFAULT '[]',
  publishedAt TEXT NOT NULL,
  syncedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_intel_feed_source_published
  ON IntelFeed (source, publishedAt DESC);

CREATE TABLE IF NOT EXISTS SyncRun (
  id TEXT PRIMARY KEY NOT NULL,
  triggerType TEXT NOT NULL,    -- 'cron' | 'manual'
  status TEXT NOT NULL,         -- 'success' | 'partial' | 'error'
  itemsFetched INTEGER NOT NULL DEFAULT 0,
  itemsUpserted INTEGER NOT NULL DEFAULT 0,
  detailsJson TEXT NOT NULL DEFAULT '{}',
  startedAt TEXT NOT NULL DEFAULT (datetime('now')),
  finishedAt TEXT
);
