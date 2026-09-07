-- Backfilling the preparation record from the lab's own earlier records.
--
-- The app went live on 7 Jul 2026, but the preparation-record screen was only
-- built a month later: the first machine-written row is 7 Aug 2026 10:06. The
-- labels printed in between exist, just not in here. Those rows need to be
-- enterable by hand.
--
-- The risk in allowing that is not data loss, it is the opposite: 285 rows the
-- system genuinely witnessed become worth less the moment a typed-in row is
-- indistinguishable from them. An inspector must be able to separate the two
-- without being told. So provenance travels with every row, and a hand-entered
-- one additionally names the account that typed it, when, and which record it
-- was copied from.
--
-- Existing rows take source='AUTO' from the default, which is what they are.

ALTER TABLE sticker_logs ADD COLUMN source TEXT NOT NULL DEFAULT 'AUTO';  -- AUTO | MANUAL
ALTER TABLE sticker_logs ADD COLUMN entered_by TEXT;    -- account that typed a MANUAL row
ALTER TABLE sticker_logs ADD COLUMN entered_at TEXT;    -- when they typed it
ALTER TABLE sticker_logs ADD COLUMN source_note TEXT;   -- where it was copied from

-- The insert guard is replaced rather than extended: SQLite has no ALTER
-- TRIGGER, and the original checks have to survive alongside the new ones.
DROP TRIGGER IF EXISTS sticker_logs_guard_insert;
CREATE TRIGGER sticker_logs_guard_insert BEFORE INSERT ON sticker_logs
BEGIN
  SELECT
    CASE
      WHEN NEW.kind NOT IN ('ALIQUOT','OPENED','LOT_QR')
        THEN RAISE(ABORT, 'sticker_logs: ประเภทฉลากไม่ถูกต้อง')
      WHEN NEW.action NOT IN ('DOWNLOAD','PRINT')
        THEN RAISE(ABORT, 'sticker_logs: ชนิดการทำรายการไม่ถูกต้อง')
      WHEN NEW.qty <= 0 THEN RAISE(ABORT, 'sticker_logs: จำนวนต้องมากกว่า 0')
      WHEN TRIM(NEW.reagent_name) = '' THEN RAISE(ABORT, 'sticker_logs: ต้องระบุชื่อน้ำยา')
      WHEN NEW.source NOT IN ('AUTO','MANUAL')
        THEN RAISE(ABORT, 'sticker_logs: ที่มาของบันทึกไม่ถูกต้อง')
      -- A hand-entered row without a name attached to it is an anonymous claim
      -- about the past, which is exactly what this column exists to prevent.
      WHEN NEW.source = 'MANUAL' AND (NEW.entered_by IS NULL OR TRIM(NEW.entered_by) = '')
        THEN RAISE(ABORT, 'sticker_logs: บันทึกย้อนหลังต้องระบุผู้กรอก')
      WHEN NEW.source = 'MANUAL' AND (NEW.entered_at IS NULL OR TRIM(NEW.entered_at) = '')
        THEN RAISE(ABORT, 'sticker_logs: บันทึกย้อนหลังต้องระบุเวลาที่กรอก')
      -- And the reverse: an automatic row must not carry a typist, or the flag
      -- stops meaning anything.
      WHEN NEW.source = 'AUTO' AND NEW.entered_by IS NOT NULL
        THEN RAISE(ABORT, 'sticker_logs: บันทึกอัตโนมัติต้องไม่มีผู้กรอกย้อนหลัง')
      -- 'YYYY-MM-DD HH:MM', checked by round-tripping through strftime rather
      -- than by a GLOB of twelve character classes: SQLite refuses that
      -- pattern as "too complex" at runtime, which would have rejected every
      -- insert, automatic ones included. The round trip is also stricter — it
      -- rejects 2026-13-45, which a shape-only pattern would wave through.
      -- strftime returns NULL for anything unparseable, hence the IFNULL.
      WHEN IFNULL(strftime('%Y-%m-%d %H:%M', NEW.at), '') <> NEW.at
        THEN RAISE(ABORT, 'sticker_logs: รูปแบบวันที่-เวลาไม่ถูกต้อง')
    END;
END;

-- Provenance is a property of the row, not an editable field. Nothing in the
-- app updates sticker_logs at all today, and if something ever does, it must
-- not be able to launder a typed-in row into a witnessed one.
DROP TRIGGER IF EXISTS sticker_logs_guard_update;
CREATE TRIGGER sticker_logs_guard_update BEFORE UPDATE ON sticker_logs
BEGIN
  SELECT
    CASE
      WHEN NEW.source <> OLD.source
        THEN RAISE(ABORT, 'sticker_logs: เปลี่ยนที่มาของบันทึกไม่ได้')
      WHEN IFNULL(NEW.entered_by,'') <> IFNULL(OLD.entered_by,'')
        THEN RAISE(ABORT, 'sticker_logs: เปลี่ยนผู้กรอกย้อนหลังไม่ได้')
      WHEN IFNULL(NEW.entered_at,'') <> IFNULL(OLD.entered_at,'')
        THEN RAISE(ABORT, 'sticker_logs: เปลี่ยนเวลาที่กรอกย้อนหลังไม่ได้')
    END;
END;
