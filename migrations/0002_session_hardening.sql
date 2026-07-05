-- Migration 0002 — session hardening: CSRF token per session + login rate limiting.
-- Safe to run on the existing D1 database (additive only, no existing data touched).

-- Paired with the session token so the server can verify the double-submit
-- CSRF header on every mutating request (see functions/api/_middleware.js).
ALTER TABLE sessions ADD COLUMN csrf TEXT NOT NULL DEFAULT '';

-- Throttles repeated failed logins per username (brute-force / credential
-- stuffing protection). See checkLoginLock/recordLoginFailure in _lib.js.
CREATE TABLE IF NOT EXISTS login_attempts (
  username     TEXT PRIMARY KEY,
  fail_count   INTEGER NOT NULL DEFAULT 0,
  locked_until TEXT
);
