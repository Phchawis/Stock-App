-- Reagent, control or calibrator — so the stock summary can be printed for
-- one kind at a time.
--
-- Unlike the analyzer, this is on the label: manufacturers name these
-- products "… Calibrator" and "… Control", and every one in the catalogue
-- says so in its name. The exception is Technopath's Multichem line (IA Plus,
-- S Plus levels 1–3, U), which is third-party QC material sold under a brand
-- name with no "Control" in it. Everything else starts as a reagent —
-- including consumables and wash solutions, which the lab may reclassify in
-- the edit form.
ALTER TABLE reagents ADD COLUMN kind TEXT NOT NULL DEFAULT 'REAGENT';

UPDATE reagents SET kind = 'CALIBRATOR'
 WHERE lower(th) LIKE '%calibrator%' OR lower(en) LIKE '%calibrator%';

UPDATE reagents SET kind = 'CONTROL'
 WHERE lower(th) LIKE '%control%' OR lower(en) LIKE '%control%'
    OR lower(th) LIKE 'multichem%' OR lower(en) LIKE 'multichem%';
