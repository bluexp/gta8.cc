-- Cloudflare D1 (SQLite) initial migration for gta8.cc

CREATE TABLE IF NOT EXISTS MapMarker (
  id TEXT PRIMARY KEY NOT NULL,
  gameVersion TEXT NOT NULL DEFAULT 'gta6',
  category TEXT NOT NULL,
  subType TEXT NOT NULL,
  titleZh TEXT NOT NULL,
  titleEn TEXT NOT NULL,
  region TEXT,
  x REAL NOT NULL,
  y REAL NOT NULL,
  descriptionMd TEXT,
  mediaUrls TEXT NOT NULL DEFAULT '[]',
  linkedEntityId TEXT,
  contributor TEXT,
  isVerified INTEGER NOT NULL DEFAULT 1,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_map_marker_version_category
  ON MapMarker (gameVersion, category);

CREATE TABLE IF NOT EXISTS WikiEntity (
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  gameVersion TEXT NOT NULL DEFAULT 'gta6',
  entityType TEXT NOT NULL,
  category TEXT NOT NULL,
  titleZh TEXT NOT NULL,
  titleEn TEXT NOT NULL,
  coverImage TEXT,
  statsJson TEXT NOT NULL DEFAULT '{}',
  contentMd TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_wiki_entity_type
  ON WikiEntity (gameVersion, entityType);

CREATE TABLE IF NOT EXISTS UserProgress (
  userId TEXT PRIMARY KEY NOT NULL,
  completedMarkers TEXT NOT NULL DEFAULT '[]',
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS MarkerSubmission (
  id TEXT PRIMARY KEY NOT NULL,
  markerId TEXT,
  payloadJson TEXT NOT NULL,
  nickname TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  createdAt TEXT NOT NULL DEFAULT (datetime('now'))
);
