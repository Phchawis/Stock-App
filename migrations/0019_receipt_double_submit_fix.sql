-- Two lots whose records disagreed with their own movement history, found by
-- reconciling every in-stock lot against its transactions on 2026-11-05
-- (180 of 182 matched). Fixed at the lab's request.
--
-- 1. Methanol, lot 36090526 (lot id 118)
--    Transactions 1201 and 1202 are the same receipt: "รับจาก Firmer", +2,
--    same operator, same minute (2026-07-28 18:40), and both record a balance
--    of 5. A second, real receipt would have recorded 7. This is a double
--    submit that raced the old read-then-write receive endpoint: both requests
--    read 3, both wrote 5, and both logged a row. The lot itself grew by 2
--    once, so its quantity (8) is right and the log holds one row too many,
--    adding up to 10. 1202 is removed; the lot is not touched. The endpoint
--    was made a single transaction in the same change (functions/api/lots.js),
--    and the receive button now takes one click at a time.
--
-- 2. Hemoglobin A1C (HbA1C), lot 68897UQ08 (lot id 193)
--    recv (total ever received) reads 11, but the lot has three receipts of 5
--    in its history: 2026-07-24, 2026-09-22 and 2026-11-05. Its balance (6)
--    agrees with the history. No current code path lowers recv, so this dates
--    from an earlier version; recv is set to what the history says.
--
-- Every statement matches the exact values seen before the fix, so on any
-- database where they differ (local dev, a restored backup) it does nothing.

-- DATA_FIX joins the event vocabulary so corrections like this one are on
-- record inside the system, not only in this file.
DROP TRIGGER IF EXISTS system_events_guard_insert;
CREATE TRIGGER system_events_guard_insert BEFORE INSERT ON system_events
BEGIN
  SELECT CASE
    WHEN NEW.kind NOT IN ('BACKUP','RESTORE','CLIENT_ERROR','REAGENT_DELETED','DATA_FIX')
      THEN RAISE(ABORT, 'system_events: ชนิดเหตุการณ์ไม่ถูกต้อง')
  END;
END;

-- ── 1. Methanol: the duplicate receive row ─────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'ลบรายการรับเข้าซ้ำ id 1202 (Methanol Lot 36090526, +2, 2026-07-28 18:40) ซึ่งบันทึกซ้ำกับ id 1201 จากการกดบันทึกสองครั้ง ยอดคงเหลือ 8 ไม่เปลี่ยน',
       'migrations/0019_receipt_double_submit_fix.sql',
       'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 09:06'
 WHERE EXISTS (SELECT 1 FROM transactions
                WHERE id = 1202 AND lot_id = 118 AND type = 'RECEIVE' AND qty = 2 AND bal = 5
                  AND at = '2026-07-28 18:40');

DELETE FROM transactions
 WHERE id = 1202 AND lot_id = 118 AND type = 'RECEIVE' AND qty = 2 AND bal = 5
   AND at = '2026-07-28 18:40';

-- ── 2. HbA1C: total received ───────────────────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'แก้ยอดรับสะสมของ Hemoglobin A1C Lot 68897UQ08 จาก 11 เป็น 15 ตามประวัติรับเข้า 3 ครั้ง ครั้งละ 5 ยอดคงเหลือ 6 ไม่เปลี่ยน',
       'migrations/0019_receipt_double_submit_fix.sql',
       'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 09:06'
 WHERE EXISTS (SELECT 1 FROM lots WHERE id = 193 AND lot = '68897UQ08' AND recv = 11)
   AND (SELECT SUM(qty) FROM transactions WHERE lot_id = 193 AND type = 'RECEIVE') = 15;

UPDATE lots SET recv = 15
 WHERE id = 193 AND lot = '68897UQ08' AND recv = 11
   AND (SELECT SUM(qty) FROM transactions WHERE lot_id = 193 AND type = 'RECEIVE') = 15;
