-- schema.sql

CREATE TABLE IF NOT EXISTS entries (
  id           INTEGER  PRIMARY KEY AUTOINCREMENT,
  lang         TEXT     NOT NULL CHECK(lang IN ('id', 'fr')),
  category     TEXT     NOT NULL,
  seq_no       INTEGER,
  term         TEXT     NOT NULL,
  term_norm    TEXT     NOT NULL,
  definition   TEXT     NOT NULL,
  def_citation TEXT,
  ex_source    TEXT,
  ex_date      TEXT,
  ex_quote     TEXT,
  ex_analysis  TEXT,
  UNIQUE(term_norm, lang, category)
);

CREATE INDEX IF NOT EXISTS idx_browse
  ON entries(lang, category, term_norm);

CREATE INDEX IF NOT EXISTS idx_category
  ON entries(category, lang);

CREATE VIRTUAL TABLE IF NOT EXISTS entries_fts
  USING fts5(
    term,
    content      = 'entries',
    content_rowid = 'id',
    tokenize     = 'unicode61'
  );

CREATE TRIGGER IF NOT EXISTS fts_ai
  AFTER INSERT ON entries BEGIN
    INSERT INTO entries_fts(rowid, term)
    VALUES (new.id, new.term);
  END;

CREATE TRIGGER IF NOT EXISTS fts_ad
  AFTER DELETE ON entries BEGIN
    INSERT INTO entries_fts(entries_fts, rowid, term)
    VALUES ('delete', old.id, old.term);
  END;

-- Auth: user accounts (offline-first)
CREATE TABLE IF NOT EXISTS users (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  name           TEXT    NOT NULL,
  email          TEXT    NOT NULL UNIQUE,
  password       TEXT    NOT NULL,
  created_at     TEXT    DEFAULT (datetime('now')),
  last_active_at TEXT    DEFAULT (datetime('now')),
  synced         INTEGER DEFAULT 0
);