-- Six manufacturer lots that were each recorded twice, under the right lot
-- number and under a mistyped one with the same expiry. Found on 2026-11-05
-- by replaying receipts against a "one character from an existing lot, same
-- expiry" check, and merged at the lab's request. The mistyped number is the
-- one that breaks the reagent's own lot pattern (every other ALT lot is
-- 5 digits + UD00, so 84441UD00 is right and 8441UD00 is not).
--
--   reagent               mistyped (lot id)     correct (lot id)    expiry
--   Glucose               6941UQ12    (258)      69414UQ12  (178)   2026-12-31
--   BUN                   6514UN26    (334)      65143UN26  (322)   2027-03-23
--   Uric Acid             831757UD00  (310)      83157UD00  (293)   2027-04-07
--   ALT                   8441UD00    (236)      84441UD00  (197)   2027-07-05
--   U/CSF Protein         574232UN26  (344)      57423UN26  (229)   2028-01-24
--   Anti HIV Ag/Ab combo  8836BE00    (376)      88362BE00  (317)   2027-03-01
--
-- For each pair, guarded on both lots' id, number and expiry so it does
-- nothing on any other copy of the database:
--   1. record the merge as DATA_FIX;
--   2. add the mistyped lot's balance and total received to the correct lot;
--   3. move its movements onto the correct lot;
--   4. recompute the correct lot's running balance (`bal`) in date order, so
--      the merged history reads as one lot;
--   5. delete the mistyped lot, now empty.
-- Sticker records keep the lot number as it was printed: they record what
-- was on the label. ALT and Anti HIV still had stock under the mistyped
-- number, so those boxes need new stickers (old QR no longer resolves).

-- ── Glucose: 6941UQ12 → 69414UQ12 ─────────────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'รวม Lot ที่พิมพ์ผิด Glucose Lot 6941UQ12 เข้ากับ Lot 69414UQ12 (วันหมดอายุเดียวกัน 2026-12-31) ย้ายคงเหลือ ' || (SELECT qty FROM lots WHERE id = 258) || ' และประวัติ ' || (SELECT COUNT(*) FROM transactions WHERE lot_id = 258) || ' รายการ',
       'migrations/0022_merge_mistyped_lots.sql', 'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 13:17'
 WHERE EXISTS (SELECT 1 FROM lots WHERE id = 258 AND lot = '6941UQ12' AND expiry = '2026-12-31') AND EXISTS (SELECT 1 FROM lots WHERE id = 178 AND lot = '69414UQ12' AND expiry = '2026-12-31');

UPDATE lots
   SET qty = qty + (SELECT qty FROM lots WHERE id = 258),
       recv = recv + (SELECT recv FROM lots WHERE id = 258),
       status = CASE WHEN qty + (SELECT qty FROM lots WHERE id = 258) > 0 THEN 'ACTIVE' ELSE 'DEPLETED' END
 WHERE id = 178 AND EXISTS (SELECT 1 FROM lots WHERE id = 258 AND lot = '6941UQ12' AND expiry = '2026-12-31') AND EXISTS (SELECT 1 FROM lots WHERE id = 178 AND lot = '69414UQ12' AND expiry = '2026-12-31');

UPDATE transactions SET lot_id = 178
 WHERE lot_id = 258 AND EXISTS (SELECT 1 FROM lots WHERE id = 258 AND lot = '6941UQ12' AND expiry = '2026-12-31') AND EXISTS (SELECT 1 FROM lots WHERE id = 178 AND lot = '69414UQ12' AND expiry = '2026-12-31');

UPDATE transactions
   SET bal = (SELECT SUM(t2.qty) FROM transactions t2
               WHERE t2.lot_id = 178 AND (t2.at < transactions.at OR (t2.at = transactions.at AND t2.id <= transactions.id)))
 WHERE lot_id = 178 AND EXISTS (SELECT 1 FROM lots WHERE id = 258 AND lot = '6941UQ12' AND expiry = '2026-12-31') AND EXISTS (SELECT 1 FROM lots WHERE id = 178 AND lot = '69414UQ12' AND expiry = '2026-12-31');

DELETE FROM lots
 WHERE id = 258 AND lot = '6941UQ12' AND expiry = '2026-12-31'
   AND EXISTS (SELECT 1 FROM lots WHERE id = 178 AND lot = '69414UQ12' AND expiry = '2026-12-31')
   AND NOT EXISTS (SELECT 1 FROM transactions WHERE lot_id = 258);

-- ── BUN: 6514UN26 → 65143UN26 ─────────────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'รวม Lot ที่พิมพ์ผิด BUN Lot 6514UN26 เข้ากับ Lot 65143UN26 (วันหมดอายุเดียวกัน 2027-03-23) ย้ายคงเหลือ ' || (SELECT qty FROM lots WHERE id = 334) || ' และประวัติ ' || (SELECT COUNT(*) FROM transactions WHERE lot_id = 334) || ' รายการ',
       'migrations/0022_merge_mistyped_lots.sql', 'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 13:17'
 WHERE EXISTS (SELECT 1 FROM lots WHERE id = 334 AND lot = '6514UN26' AND expiry = '2027-03-23') AND EXISTS (SELECT 1 FROM lots WHERE id = 322 AND lot = '65143UN26' AND expiry = '2027-03-23');

UPDATE lots
   SET qty = qty + (SELECT qty FROM lots WHERE id = 334),
       recv = recv + (SELECT recv FROM lots WHERE id = 334),
       status = CASE WHEN qty + (SELECT qty FROM lots WHERE id = 334) > 0 THEN 'ACTIVE' ELSE 'DEPLETED' END
 WHERE id = 322 AND EXISTS (SELECT 1 FROM lots WHERE id = 334 AND lot = '6514UN26' AND expiry = '2027-03-23') AND EXISTS (SELECT 1 FROM lots WHERE id = 322 AND lot = '65143UN26' AND expiry = '2027-03-23');

UPDATE transactions SET lot_id = 322
 WHERE lot_id = 334 AND EXISTS (SELECT 1 FROM lots WHERE id = 334 AND lot = '6514UN26' AND expiry = '2027-03-23') AND EXISTS (SELECT 1 FROM lots WHERE id = 322 AND lot = '65143UN26' AND expiry = '2027-03-23');

UPDATE transactions
   SET bal = (SELECT SUM(t2.qty) FROM transactions t2
               WHERE t2.lot_id = 322 AND (t2.at < transactions.at OR (t2.at = transactions.at AND t2.id <= transactions.id)))
 WHERE lot_id = 322 AND EXISTS (SELECT 1 FROM lots WHERE id = 334 AND lot = '6514UN26' AND expiry = '2027-03-23') AND EXISTS (SELECT 1 FROM lots WHERE id = 322 AND lot = '65143UN26' AND expiry = '2027-03-23');

DELETE FROM lots
 WHERE id = 334 AND lot = '6514UN26' AND expiry = '2027-03-23'
   AND EXISTS (SELECT 1 FROM lots WHERE id = 322 AND lot = '65143UN26' AND expiry = '2027-03-23')
   AND NOT EXISTS (SELECT 1 FROM transactions WHERE lot_id = 334);

-- ── Uric Acid: 831757UD00 → 83157UD00 ─────────────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'รวม Lot ที่พิมพ์ผิด Uric Acid Lot 831757UD00 เข้ากับ Lot 83157UD00 (วันหมดอายุเดียวกัน 2027-04-07) ย้ายคงเหลือ ' || (SELECT qty FROM lots WHERE id = 310) || ' และประวัติ ' || (SELECT COUNT(*) FROM transactions WHERE lot_id = 310) || ' รายการ',
       'migrations/0022_merge_mistyped_lots.sql', 'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 13:17'
 WHERE EXISTS (SELECT 1 FROM lots WHERE id = 310 AND lot = '831757UD00' AND expiry = '2027-04-07') AND EXISTS (SELECT 1 FROM lots WHERE id = 293 AND lot = '83157UD00' AND expiry = '2027-04-07');

UPDATE lots
   SET qty = qty + (SELECT qty FROM lots WHERE id = 310),
       recv = recv + (SELECT recv FROM lots WHERE id = 310),
       status = CASE WHEN qty + (SELECT qty FROM lots WHERE id = 310) > 0 THEN 'ACTIVE' ELSE 'DEPLETED' END
 WHERE id = 293 AND EXISTS (SELECT 1 FROM lots WHERE id = 310 AND lot = '831757UD00' AND expiry = '2027-04-07') AND EXISTS (SELECT 1 FROM lots WHERE id = 293 AND lot = '83157UD00' AND expiry = '2027-04-07');

UPDATE transactions SET lot_id = 293
 WHERE lot_id = 310 AND EXISTS (SELECT 1 FROM lots WHERE id = 310 AND lot = '831757UD00' AND expiry = '2027-04-07') AND EXISTS (SELECT 1 FROM lots WHERE id = 293 AND lot = '83157UD00' AND expiry = '2027-04-07');

UPDATE transactions
   SET bal = (SELECT SUM(t2.qty) FROM transactions t2
               WHERE t2.lot_id = 293 AND (t2.at < transactions.at OR (t2.at = transactions.at AND t2.id <= transactions.id)))
 WHERE lot_id = 293 AND EXISTS (SELECT 1 FROM lots WHERE id = 310 AND lot = '831757UD00' AND expiry = '2027-04-07') AND EXISTS (SELECT 1 FROM lots WHERE id = 293 AND lot = '83157UD00' AND expiry = '2027-04-07');

DELETE FROM lots
 WHERE id = 310 AND lot = '831757UD00' AND expiry = '2027-04-07'
   AND EXISTS (SELECT 1 FROM lots WHERE id = 293 AND lot = '83157UD00' AND expiry = '2027-04-07')
   AND NOT EXISTS (SELECT 1 FROM transactions WHERE lot_id = 310);

-- ── ALT: 8441UD00 → 84441UD00 ─────────────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'รวม Lot ที่พิมพ์ผิด ALT Lot 8441UD00 เข้ากับ Lot 84441UD00 (วันหมดอายุเดียวกัน 2027-07-05) ย้ายคงเหลือ ' || (SELECT qty FROM lots WHERE id = 236) || ' และประวัติ ' || (SELECT COUNT(*) FROM transactions WHERE lot_id = 236) || ' รายการ',
       'migrations/0022_merge_mistyped_lots.sql', 'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 13:17'
 WHERE EXISTS (SELECT 1 FROM lots WHERE id = 236 AND lot = '8441UD00' AND expiry = '2027-07-05') AND EXISTS (SELECT 1 FROM lots WHERE id = 197 AND lot = '84441UD00' AND expiry = '2027-07-05');

UPDATE lots
   SET qty = qty + (SELECT qty FROM lots WHERE id = 236),
       recv = recv + (SELECT recv FROM lots WHERE id = 236),
       status = CASE WHEN qty + (SELECT qty FROM lots WHERE id = 236) > 0 THEN 'ACTIVE' ELSE 'DEPLETED' END
 WHERE id = 197 AND EXISTS (SELECT 1 FROM lots WHERE id = 236 AND lot = '8441UD00' AND expiry = '2027-07-05') AND EXISTS (SELECT 1 FROM lots WHERE id = 197 AND lot = '84441UD00' AND expiry = '2027-07-05');

UPDATE transactions SET lot_id = 197
 WHERE lot_id = 236 AND EXISTS (SELECT 1 FROM lots WHERE id = 236 AND lot = '8441UD00' AND expiry = '2027-07-05') AND EXISTS (SELECT 1 FROM lots WHERE id = 197 AND lot = '84441UD00' AND expiry = '2027-07-05');

UPDATE transactions
   SET bal = (SELECT SUM(t2.qty) FROM transactions t2
               WHERE t2.lot_id = 197 AND (t2.at < transactions.at OR (t2.at = transactions.at AND t2.id <= transactions.id)))
 WHERE lot_id = 197 AND EXISTS (SELECT 1 FROM lots WHERE id = 236 AND lot = '8441UD00' AND expiry = '2027-07-05') AND EXISTS (SELECT 1 FROM lots WHERE id = 197 AND lot = '84441UD00' AND expiry = '2027-07-05');

DELETE FROM lots
 WHERE id = 236 AND lot = '8441UD00' AND expiry = '2027-07-05'
   AND EXISTS (SELECT 1 FROM lots WHERE id = 197 AND lot = '84441UD00' AND expiry = '2027-07-05')
   AND NOT EXISTS (SELECT 1 FROM transactions WHERE lot_id = 236);

-- ── U/CSF Protein: 574232UN26 → 57423UN26 ─────────────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'รวม Lot ที่พิมพ์ผิด U/CSF Protein Lot 574232UN26 เข้ากับ Lot 57423UN26 (วันหมดอายุเดียวกัน 2028-01-24) ย้ายคงเหลือ ' || (SELECT qty FROM lots WHERE id = 344) || ' และประวัติ ' || (SELECT COUNT(*) FROM transactions WHERE lot_id = 344) || ' รายการ',
       'migrations/0022_merge_mistyped_lots.sql', 'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 13:17'
 WHERE EXISTS (SELECT 1 FROM lots WHERE id = 344 AND lot = '574232UN26' AND expiry = '2028-01-24') AND EXISTS (SELECT 1 FROM lots WHERE id = 229 AND lot = '57423UN26' AND expiry = '2028-01-24');

UPDATE lots
   SET qty = qty + (SELECT qty FROM lots WHERE id = 344),
       recv = recv + (SELECT recv FROM lots WHERE id = 344),
       status = CASE WHEN qty + (SELECT qty FROM lots WHERE id = 344) > 0 THEN 'ACTIVE' ELSE 'DEPLETED' END
 WHERE id = 229 AND EXISTS (SELECT 1 FROM lots WHERE id = 344 AND lot = '574232UN26' AND expiry = '2028-01-24') AND EXISTS (SELECT 1 FROM lots WHERE id = 229 AND lot = '57423UN26' AND expiry = '2028-01-24');

UPDATE transactions SET lot_id = 229
 WHERE lot_id = 344 AND EXISTS (SELECT 1 FROM lots WHERE id = 344 AND lot = '574232UN26' AND expiry = '2028-01-24') AND EXISTS (SELECT 1 FROM lots WHERE id = 229 AND lot = '57423UN26' AND expiry = '2028-01-24');

UPDATE transactions
   SET bal = (SELECT SUM(t2.qty) FROM transactions t2
               WHERE t2.lot_id = 229 AND (t2.at < transactions.at OR (t2.at = transactions.at AND t2.id <= transactions.id)))
 WHERE lot_id = 229 AND EXISTS (SELECT 1 FROM lots WHERE id = 344 AND lot = '574232UN26' AND expiry = '2028-01-24') AND EXISTS (SELECT 1 FROM lots WHERE id = 229 AND lot = '57423UN26' AND expiry = '2028-01-24');

DELETE FROM lots
 WHERE id = 344 AND lot = '574232UN26' AND expiry = '2028-01-24'
   AND EXISTS (SELECT 1 FROM lots WHERE id = 229 AND lot = '57423UN26' AND expiry = '2028-01-24')
   AND NOT EXISTS (SELECT 1 FROM transactions WHERE lot_id = 344);

-- ── Anti HIV Ag/Ab combo: 8836BE00 → 88362BE00 ─────────────────────────────────────────
INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'รวม Lot ที่พิมพ์ผิด Anti HIV Ag/Ab combo Lot 8836BE00 เข้ากับ Lot 88362BE00 (วันหมดอายุเดียวกัน 2027-03-01) ย้ายคงเหลือ ' || (SELECT qty FROM lots WHERE id = 376) || ' และประวัติ ' || (SELECT COUNT(*) FROM transactions WHERE lot_id = 376) || ' รายการ',
       'migrations/0022_merge_mistyped_lots.sql', 'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 13:17'
 WHERE EXISTS (SELECT 1 FROM lots WHERE id = 376 AND lot = '8836BE00' AND expiry = '2027-03-01') AND EXISTS (SELECT 1 FROM lots WHERE id = 317 AND lot = '88362BE00' AND expiry = '2027-03-01');

UPDATE lots
   SET qty = qty + (SELECT qty FROM lots WHERE id = 376),
       recv = recv + (SELECT recv FROM lots WHERE id = 376),
       status = CASE WHEN qty + (SELECT qty FROM lots WHERE id = 376) > 0 THEN 'ACTIVE' ELSE 'DEPLETED' END
 WHERE id = 317 AND EXISTS (SELECT 1 FROM lots WHERE id = 376 AND lot = '8836BE00' AND expiry = '2027-03-01') AND EXISTS (SELECT 1 FROM lots WHERE id = 317 AND lot = '88362BE00' AND expiry = '2027-03-01');

UPDATE transactions SET lot_id = 317
 WHERE lot_id = 376 AND EXISTS (SELECT 1 FROM lots WHERE id = 376 AND lot = '8836BE00' AND expiry = '2027-03-01') AND EXISTS (SELECT 1 FROM lots WHERE id = 317 AND lot = '88362BE00' AND expiry = '2027-03-01');

UPDATE transactions
   SET bal = (SELECT SUM(t2.qty) FROM transactions t2
               WHERE t2.lot_id = 317 AND (t2.at < transactions.at OR (t2.at = transactions.at AND t2.id <= transactions.id)))
 WHERE lot_id = 317 AND EXISTS (SELECT 1 FROM lots WHERE id = 376 AND lot = '8836BE00' AND expiry = '2027-03-01') AND EXISTS (SELECT 1 FROM lots WHERE id = 317 AND lot = '88362BE00' AND expiry = '2027-03-01');

DELETE FROM lots
 WHERE id = 376 AND lot = '8836BE00' AND expiry = '2027-03-01'
   AND EXISTS (SELECT 1 FROM lots WHERE id = 317 AND lot = '88362BE00' AND expiry = '2027-03-01')
   AND NOT EXISTS (SELECT 1 FROM transactions WHERE lot_id = 376);
