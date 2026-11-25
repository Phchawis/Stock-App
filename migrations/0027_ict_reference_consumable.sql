-- ICT Reference Solution joins the solutions moved to CONSUMABLE in 0026, at
-- the lab's request (2026-11-25). Matched by id and name.
UPDATE reagents SET kind = 'CONSUMABLE' WHERE id = 125 AND trim(th) = 'ICT Reference Solution';
