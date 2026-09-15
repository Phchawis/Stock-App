-- Stock booked against the wrong CRP calibrator.
--
-- The box in the photograph reads "Alinity c CRP Vario High Sensitivity
-- Calibrator Kit · CRP HS Cals", but Lot 51301Y600 was received twice against
-- "CRP vario wind range Calibrator" (id 64) instead. The high-sensitivity entry
-- (id 158) exists but only as the SDS-only stub created during the safety-sheet
-- import — no stock, no supplier, a placeholder photograph, and a storage
-- condition left at the registration default.
--
-- So this is not a delete and re-enter: the two receipts are real movements
-- with real dates and a real operator, and re-keying them would either lose
-- that history or re-date it to today. The lot and its transactions are moved
-- to the reagent they always belonged to, the details that describe the
-- physical box move with them, and only then is the empty wrong entry removed.
--
-- Not moved: the safety sheet. id 64 carries "Alinity CRP calibrator MSDS.pdf"
-- and id 158 already has "Alinity hsCRP calibrator MSDS.pdf", which is the one
-- that matches what is actually in the fridge. Copying the other over it would
-- put the wrong hazard sheet on the right reagent — the exact failure the SDS
-- work spent a week avoiding.

-- ── 1. The physical description follows the physical box ──────────────────
UPDATE reagents
   SET img          = (SELECT img FROM reagents WHERE id = 64),
       storage      = (SELECT storage FROM reagents WHERE id = 64),  -- 2–8°C, not the ROOM_TEMP default
       supplier     = (SELECT supplier FROM reagents WHERE id = 64),
       min_qty      = (SELECT min_qty FROM reagents WHERE id = 64),
       reorder_qty  = (SELECT reorder_qty FROM reagents WHERE id = 64),
       -- Promoted from an SDS-only stub to a stocked reagent, so it takes a
       -- catalogue code in the same shape as the rest rather than keeping the
       -- SDS-001 placeholder it was imported under.
       code         = 'RGT-HMS-1789552800158'
 WHERE id = 158;

-- ── 2. The lot and its history move with it ───────────────────────────────
UPDATE lots         SET rid = 158 WHERE rid = 64;
UPDATE transactions SET rid = 158 WHERE rid = 64;

-- Three QR labels were printed for this box while the catalogue was wrong, and
-- those records point at id 64 as well. The link moves so the log still reaches
-- the reagent that exists; the printed name does not, because it is a record of
-- what the sticker actually said and rewriting it would claim a label was
-- produced that never was. The sticker on the box carries the wrong name and
-- should be reprinted — that is a physical job, not a database one.
UPDATE sticker_logs SET reagent_id = 158 WHERE reagent_id = 64;

-- ── 3. The wrong entry, now empty, is removed ─────────────────────────────
-- Recorded the same way the app records a deletion, so the removal is visible
-- in the system log rather than being a row that silently stops existing.
INSERT INTO system_events (kind, detail, context, by, at)
VALUES ('REAGENT_DELETED',
        'RGT-HMS-1783058394880 · CRP vario wind range Calibrator',
        'แก้ไขข้อมูลที่ลงผิด — ย้าย Lot 51301Y600 และประวัติ 2 รายการ ไปที่ CRP Vario high sensitivity Calibrator ก่อนลบ',
        'ผู้ดูแลระบบ (แก้ไขผ่าน migration 0016)',
        '2026-09-15 12:00');

DELETE FROM reagents WHERE id = 64;
