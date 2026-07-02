-- Migration 0001 — server-side auth (sessions) + persisted permissions matrix.
-- Safe to run on the existing D1 database (does not touch existing data).

-- Session tokens issued at login, validated on every /api/* request.
CREATE TABLE IF NOT EXISTS sessions (
  token      TEXT PRIMARY KEY,
  username   TEXT NOT NULL,
  role       TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

-- Role → permission matrix, editable by admins and enforced on the server.
CREATE TABLE IF NOT EXISTS permissions (
  role    TEXT NOT NULL,
  perm    TEXT NOT NULL,
  allowed INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (role, perm)
);

INSERT OR IGNORE INTO permissions (role, perm, allowed) VALUES
('admin','view',1),('admin','receive',1),('admin','issue',1),('admin','manage',1),('admin','ack',1),('admin','users',1),('admin','settings',1),
('supervisor','view',1),('supervisor','receive',1),('supervisor','issue',1),('supervisor','manage',1),('supervisor','ack',1),('supervisor','users',0),('supervisor','settings',0),
('technician','view',1),('technician','receive',0),('technician','issue',1),('technician','manage',0),('technician','ack',1),('technician','users',0),('technician','settings',0),
('viewer','view',1),('viewer','receive',0),('viewer','issue',0),('viewer','manage',0),('viewer','ack',0),('viewer','users',0),('viewer','settings',0);
