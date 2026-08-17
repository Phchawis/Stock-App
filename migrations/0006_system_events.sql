-- Operational記録 the app itself needs to answer two questions it currently can't:
--   "เมื่อไหร่ที่สำรองข้อมูลครั้งล่าสุด?"  — nothing recorded backups, so a lab
--      could go months without one and nobody would notice until they needed it.
--   "มีใครเจอ error บ้างไหม?"           — a failure in the browser was visible
--      only to the person in front of it; no one else ever heard about it.
--
-- One narrow table rather than a third-party service: the data stays inside the
-- hospital's own database, needs no account, and costs nothing to keep.

CREATE TABLE IF NOT EXISTS system_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,          -- BACKUP | RESTORE | CLIENT_ERROR
  detail TEXT,                 -- error message / filename / short note
  context TEXT,                -- screen or URL where it happened
  by TEXT NOT NULL,            -- account that triggered it ('-' when unauthenticated)
  at TEXT NOT NULL             -- 'YYYY-MM-DD HH:MM' Bangkok time
);

CREATE INDEX IF NOT EXISTS idx_system_events_kind_at ON system_events (kind, at DESC);

DROP TRIGGER IF EXISTS system_events_guard_insert;
CREATE TRIGGER system_events_guard_insert BEFORE INSERT ON system_events
BEGIN
  SELECT CASE
    WHEN NEW.kind NOT IN ('BACKUP','RESTORE','CLIENT_ERROR')
      THEN RAISE(ABORT, 'system_events: ชนิดเหตุการณ์ไม่ถูกต้อง')
  END;
END;
