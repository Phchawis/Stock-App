-- Which analyzer a reagent is used on, so the stock summary can be printed per
-- machine. Free text, nullable: nothing in the existing data says which
-- machine anything belongs to (every lot is in "ตู้เย็น A1"), so every
-- reagent starts unassigned and the lab fills it in. Guessing from the
-- supplier would print a summary with reagents under the wrong machine.
ALTER TABLE reagents ADD COLUMN instrument TEXT;
