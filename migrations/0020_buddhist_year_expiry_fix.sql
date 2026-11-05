-- Four lots saved with a Buddhist-era expiry year, found on 2026-11-05 while
-- checking the M-6 FR Dye stock count. Chrome in Thai shows date fields in
-- พ.ศ., and the year went in as typed. To the system these lots were 500
-- years from expiry: no expiry alert, issued last under FEFO, and stickers
-- printed EXP 2570. Each moves back 543 years to the Common Era date. Fixed
-- at the lab's request; receiving and lot edits now refuse such years
-- (functions/api/_lib.js expiryProblem, src/domain/stock.js buddhistYearFix).
--
--   lot id  reagent               lot          stored       corrected
--   405     DS-Diluent            2026042008   2571-04-19   2028-04-19
--   406     M-6 FR Dye            202641942    2570-04-18   2027-04-18
--   410     M-6 DR Diluent        2026042008   2571-04-19   2028-04-19
--   411     Wright Giemsa Buffer  260919       2571-09-14   2028-09-14
--
-- Each statement matches the stored date exactly, so it does nothing on any
-- other copy of the database. Each correction is recorded as DATA_FIX.

INSERT INTO system_events (kind, detail, context, by, at)
SELECT 'DATA_FIX',
       'แก้วันหมดอายุที่กรอกเป็นปี พ.ศ. ' || r.th || ' Lot ' || l.lot || ' จาก ' || l.expiry || ' เป็น ' ||
         printf('%04d', CAST(substr(l.expiry, 1, 4) AS INTEGER) - 543) || substr(l.expiry, 5),
       'migrations/0020_buddhist_year_expiry_fix.sql',
       'ระบบ (แก้ตามคำขอผู้ดูแลระบบ)', '2026-11-05 11:20'
  FROM lots l JOIN reagents r ON r.id = l.rid
 WHERE (l.id = 405 AND l.expiry = '2571-04-19')
    OR (l.id = 406 AND l.expiry = '2570-04-18')
    OR (l.id = 410 AND l.expiry = '2571-04-19')
    OR (l.id = 411 AND l.expiry = '2571-09-14');

UPDATE lots SET expiry = '2028-04-19' WHERE id = 405 AND expiry = '2571-04-19';
UPDATE lots SET expiry = '2027-04-18' WHERE id = 406 AND expiry = '2570-04-18';
UPDATE lots SET expiry = '2028-04-19' WHERE id = 410 AND expiry = '2571-04-19';
UPDATE lots SET expiry = '2028-09-14' WHERE id = 411 AND expiry = '2571-09-14';
