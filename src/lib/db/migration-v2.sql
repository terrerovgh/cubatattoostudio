-- Cuba Tattoo Studio — D1 Database Migration v2
-- Adds: users, chat system, portfolio items, promotions, chat tokens
-- Run with: wrangler d1 execute cubatattoostudio-db --file=src/lib/db/migration-v2.sql

-- ─── Users (admin, artist, client accounts) ────────────
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'artist', 'client')),
  artist_id TEXT,
  client_id TEXT,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  is_active INTEGER DEFAULT 1,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_artist_id ON users(artist_id);
CREATE INDEX IF NOT EXISTS idx_users_client_id ON users(client_id);

-- ─── Chat Rooms ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_rooms (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  client_id TEXT NOT NULL REFERENCES clients(id),
  artist_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
  last_message_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chat_rooms_artist ON chat_rooms(artist_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_client ON chat_rooms(client_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_rooms_pair ON chat_rooms(client_id, artist_id);

-- ─── Chat Messages ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  room_id TEXT NOT NULL REFERENCES chat_rooms(id),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('artist', 'client')),
  sender_id TEXT NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'booking_link')),
  is_read INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- ─── Chat Access Tokens (link-based client access) ─────
CREATE TABLE IF NOT EXISTS chat_tokens (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  token TEXT NOT NULL UNIQUE,
  room_id TEXT NOT NULL REFERENCES chat_rooms(id),
  client_id TEXT NOT NULL REFERENCES clients(id),
  expires_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chat_tokens_token ON chat_tokens(token);

-- ─── Portfolio Items (artist-managed) ──────────────────
CREATE TABLE IF NOT EXISTS portfolio_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  artist_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  style TEXT,
  tags TEXT,
  is_featured INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_portfolio_artist ON portfolio_items(artist_id);

-- ─── Promotions ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  artist_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed', 'custom')),
  discount_value REAL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active, start_date, end_date);
