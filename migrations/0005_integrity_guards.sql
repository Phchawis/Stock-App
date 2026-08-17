-- Integrity guards for stock data.
--
-- Every quiet arithmetic bug found so far had the same shape: application code
-- forgot an invariant and the database happily stored the result. A disposal
-- re-saved with a flipped sign added stock instead of removing it; a corrected
-- receipt left `recv` behind, so a lot ended up holding more than it had ever
-- received. None of it was visible on screen.
--
-- These rules are expressed as triggers rather than CHECK constraints on
-- purpose. Adding a CHECK to an existing SQLite table requires rebuilding it,
-- and `lots` and `transactions` are tied together by foreign keys — a rebuild
-- against live data is a far bigger risk than the problem it solves. Triggers
-- give the same refusal at write time and can be dropped or amended without
-- moving a single row.

-- ── Repair: recv must equal everything ever received into the lot ──────────
-- One production lot (Hemoglobin A1c Control, lot 69641UQ03) carried qty=3
-- against recv=1 because an edited receipt did not carry the total with it.
-- Its movement history was intact, so the true figure is recoverable from the
-- RECEIVE rows. Runs before the guards so existing data can satisfy them.
UPDATE lots
   SET recv = (
     SELECT COALESCE(SUM(t.qty), 0)
       FROM transactions t
      WHERE t.lot_id = lots.id AND t.type = 'RECEIVE'
   )
 WHERE qty > recv
   AND (SELECT COALESCE(SUM(t.qty), 0) FROM transactions t
         WHERE t.lot_id = lots.id AND t.type = 'RECEIVE') >= qty;

-- Fallback for any lot whose receipts were deleted outright: a balance has to
-- have come from somewhere, so recv is at least the quantity on hand.
UPDATE lots SET recv = qty WHERE qty > recv;

-- ── lots ──────────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS lots_guard_insert;
CREATE TRIGGER lots_guard_insert BEFORE INSERT ON lots
BEGIN
  SELECT
    CASE
      WHEN NEW.qty < 0 THEN RAISE(ABORT, 'lots: คงเหลือติดลบไม่ได้')
      WHEN NEW.recv < 0 THEN RAISE(ABORT, 'lots: ยอดรับสะสมติดลบไม่ได้')
      WHEN NEW.qty > NEW.recv THEN RAISE(ABORT, 'lots: คงเหลือมากกว่ายอดรับสะสมไม่ได้')
      WHEN NEW.status NOT IN ('ACTIVE','DEPLETED') THEN RAISE(ABORT, 'lots: สถานะไม่ถูกต้อง')
      WHEN TRIM(NEW.lot) = '' THEN RAISE(ABORT, 'lots: เลข Lot ว่างไม่ได้')
    END;
END;

DROP TRIGGER IF EXISTS lots_guard_update;
CREATE TRIGGER lots_guard_update BEFORE UPDATE ON lots
BEGIN
  SELECT
    CASE
      WHEN NEW.qty < 0 THEN RAISE(ABORT, 'lots: คงเหลือติดลบไม่ได้')
      WHEN NEW.recv < 0 THEN RAISE(ABORT, 'lots: ยอดรับสะสมติดลบไม่ได้')
      WHEN NEW.qty > NEW.recv THEN RAISE(ABORT, 'lots: คงเหลือมากกว่ายอดรับสะสมไม่ได้')
      WHEN NEW.status NOT IN ('ACTIVE','DEPLETED') THEN RAISE(ABORT, 'lots: สถานะไม่ถูกต้อง')
      WHEN TRIM(NEW.lot) = '' THEN RAISE(ABORT, 'lots: เลข Lot ว่างไม่ได้')
    END;
END;

-- ── transactions ──────────────────────────────────────────────────────────
-- A movement's direction is part of its meaning: RECEIVE adds, ISSUE and
-- DISPOSE remove, ADJUST goes either way but never nowhere. DELETE is the
-- catalogue-removal marker and deliberately carries no quantity.
DROP TRIGGER IF EXISTS txn_guard_insert;
CREATE TRIGGER txn_guard_insert BEFORE INSERT ON transactions
BEGIN
  SELECT
    CASE
      WHEN NEW.type NOT IN ('RECEIVE','ISSUE','ADJUST','DISPOSE','DELETE')
        THEN RAISE(ABORT, 'transactions: ประเภทรายการไม่ถูกต้อง')
      WHEN NEW.type = 'RECEIVE' AND NEW.qty <= 0
        THEN RAISE(ABORT, 'transactions: รับเข้าต้องเป็นจำนวนบวก')
      WHEN NEW.type IN ('ISSUE','DISPOSE') AND NEW.qty >= 0
        THEN RAISE(ABORT, 'transactions: เบิกจ่าย/ทำลายต้องเป็นจำนวนลบ')
      WHEN NEW.type = 'ADJUST' AND NEW.qty = 0
        THEN RAISE(ABORT, 'transactions: รายการปรับปรุงต้องมีส่วนต่าง')
      WHEN NEW.type = 'DELETE' AND NEW.qty <> 0
        THEN RAISE(ABORT, 'transactions: รายการลบน้ำยาต้องมีจำนวนเป็น 0')
      WHEN TRIM(NEW.by) = '' THEN RAISE(ABORT, 'transactions: ต้องระบุผู้ทำรายการ')
    END;
END;

DROP TRIGGER IF EXISTS txn_guard_update;
CREATE TRIGGER txn_guard_update BEFORE UPDATE ON transactions
BEGIN
  SELECT
    CASE
      WHEN NEW.type NOT IN ('RECEIVE','ISSUE','ADJUST','DISPOSE','DELETE')
        THEN RAISE(ABORT, 'transactions: ประเภทรายการไม่ถูกต้อง')
      WHEN NEW.type = 'RECEIVE' AND NEW.qty <= 0
        THEN RAISE(ABORT, 'transactions: รับเข้าต้องเป็นจำนวนบวก')
      WHEN NEW.type IN ('ISSUE','DISPOSE') AND NEW.qty >= 0
        THEN RAISE(ABORT, 'transactions: เบิกจ่าย/ทำลายต้องเป็นจำนวนลบ')
      WHEN NEW.type = 'ADJUST' AND NEW.qty = 0
        THEN RAISE(ABORT, 'transactions: รายการปรับปรุงต้องมีส่วนต่าง')
      -- The type of an existing movement must never change: an issue that
      -- becomes a receipt is a different event, not a correction.
      WHEN NEW.type <> OLD.type
        THEN RAISE(ABORT, 'transactions: เปลี่ยนประเภทของรายการเดิมไม่ได้')
    END;
END;

-- ── sticker_logs ──────────────────────────────────────────────────────────
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
    END;
END;
