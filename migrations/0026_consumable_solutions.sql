-- Wash, cleaning and system solutions, diluents, lyse, dyes and stains moved
-- from REAGENT to CONSUMABLE, as marked by the lab on the stock count
-- screen on 2026-11-25: they are counted with the supplies, not with the
-- per-test reagents. 24 items, matched by id and name (trailing spaces in
-- some names are ignored), so nothing else changes on any other copy of the
-- database. ICT Reference Solution was not marked and stays a reagent.

UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 123 AND trim(th) = 'Acid Probe Wash';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 126 AND trim(th) = 'Acid Wash';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 127 AND trim(th) = 'Alkaline Wash';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 153 AND trim(th) = 'CA Clean I';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 132 AND trim(th) = 'Concentrated Wash Buffer';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 128 AND trim(th) = 'Detergent A';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 129 AND trim(th) = 'Detergent B';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 137 AND trim(th) = 'DS-Diluent';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 124 AND trim(th) = 'ICT Sample Diluent';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 142 AND trim(th) = 'M-6 DR Diluent';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 143 AND trim(th) = 'M-6 FD Dye';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 145 AND trim(th) = 'M-6 FN Dye';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 144 AND trim(th) = 'M-6 FR Dye';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 139 AND trim(th) = 'M-6LD Lyse';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 141 AND trim(th) = 'M-6LH Lyse';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 140 AND trim(th) = 'M-6 LN Lyse';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 130 AND trim(th) = 'Maintenance Solution';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 148 AND trim(th) = 'Methanol';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 134 AND trim(th) = 'Pre Trigger Solution';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 138 AND trim(th) = 'Probe Cleanser';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 133 AND trim(th) = 'Probe Conditioning Solution';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 135 AND trim(th) = 'Trigger Solution';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 150 AND trim(th) = 'Wright Giemsa Buffer';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 149 AND trim(th) = 'Wright Giemsa Stain';
