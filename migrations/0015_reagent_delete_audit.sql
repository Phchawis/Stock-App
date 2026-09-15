-- Make "reagent removed from the catalogue" a recordable event.
--
-- Deleting a reagent used to write its own marker row into `transactions` with
-- lot_id = 0 and rid = 0. Both columns are foreign keys and there is no row
-- with id 0 in either parent table, so that insert always failed — and because
-- D1 runs a batch as one transaction, the whole delete rolled back with it.
-- The feature has therefore never worked once: production holds 157 reagents
-- and zero DELETE movements.
--
-- The marker belongs here rather than in `transactions` anyway. A movement
-- describes stock going in or out of a lot; removing a catalogue entry is an
-- administrative act with no lot and no quantity, which is exactly why it had
-- to invent a fake id to sit in that table at all. system_events has no
-- foreign keys and already holds this class of event.

DROP TRIGGER IF EXISTS system_events_guard_insert;
CREATE TRIGGER system_events_guard_insert BEFORE INSERT ON system_events
BEGIN
  SELECT CASE
    WHEN NEW.kind NOT IN ('BACKUP','RESTORE','CLIENT_ERROR','REAGENT_DELETED')
      THEN RAISE(ABORT, 'system_events: ชนิดเหตุการณ์ไม่ถูกต้อง')
  END;
END;
