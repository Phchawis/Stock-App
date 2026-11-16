-- Reports of a lot number recorded wrongly, raised during a stock count by
-- someone who may not change lot numbers themselves (a technician), for a
-- supervisor or admin to approve or reject on the dashboard. Approving runs
-- the same correction a supervisor can make directly: rename the lot, or
-- merge it into the lot that already carries the right number. See
-- functions/api/_lotfix.js.
--
-- The lot number and expiry as seen on the label are stored with the report,
-- so the approver decides on what was read off the box, not on a guess.

CREATE TABLE IF NOT EXISTS lot_fix_requests (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id       INTEGER NOT NULL,     -- the lot as recorded (may be gone once merged)
  rid          INTEGER NOT NULL,
  old_lot      TEXT NOT NULL,        -- the number as recorded
  new_lot      TEXT NOT NULL,        -- the number on the label
  label_expiry TEXT NOT NULL,        -- the expiry on the label
  note         TEXT,
  status       TEXT NOT NULL DEFAULT 'PENDING',   -- PENDING | APPROVED | REJECTED
  by           TEXT NOT NULL,
  at           TEXT NOT NULL,
  decided_by   TEXT,
  decided_at   TEXT,
  result       TEXT                  -- what approving did, in words
);

CREATE INDEX IF NOT EXISTS lot_fix_requests_status ON lot_fix_requests (status);

DROP TRIGGER IF EXISTS system_events_guard_insert;
CREATE TRIGGER system_events_guard_insert BEFORE INSERT ON system_events
BEGIN
  SELECT CASE
    WHEN NEW.kind NOT IN ('BACKUP','RESTORE','CLIENT_ERROR','REAGENT_DELETED','DATA_FIX','LOT_CORRECTED')
      THEN RAISE(ABORT, 'system_events: ชนิดเหตุการณ์ไม่ถูกต้อง')
  END;
END;
