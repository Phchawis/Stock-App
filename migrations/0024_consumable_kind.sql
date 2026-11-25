-- A fourth kind, CONSUMABLE, for supplies that are stocked and counted but are
-- not liquids: so the stock count and the printed summary can take them as
-- their own group. Requested by the lab on 2026-11-25.
--
-- Moved here: the five catalogue items that are plainly hardware, found among
-- the reagents carrying no test count. Wash solutions, diluents, lyse, dyes,
-- trigger solutions and the like stay reagents: they are analyser reagents
-- without a per-test figure, not supplies. Anything else can be moved in the
-- reagent edit form ("ประเภท"). Matched by id and name, so this does nothing
-- on any other copy of the database.

UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 155 AND th LIKE 'Cuvette%';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 146 AND th LIKE 'Glass Slide%';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 136 AND th LIKE 'Reaction Vessel%';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 147 AND th LIKE 'Ribbon%';
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 131 AND th LIKE 'Sample Cup%';
