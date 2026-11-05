-- Fingerprints of the last few seconds of receipts and issues, so that the
-- same movement submitted twice in a row (a double click, a retried request,
-- or a tab still running an older version of the app) is saved once.
--
-- The transaction log can't answer this itself: its `at` is to the minute,
-- and two real scans of the same lot by the same person inside one minute are
-- normal. A double submit lands within a second. So each request upserts its
-- fingerprint (type|reagent|lot|qty|account) with a millisecond time, and the
-- upsert only succeeds when the stored one is older than the window; see
-- claimSubmit() in functions/api/_lib.js. Rows older than a minute are
-- deleted as requests come in, so the table stays a handful of rows.
--
-- Not part of backups: it holds nothing but the last few seconds.

CREATE TABLE IF NOT EXISTS recent_submits (
  fp    TEXT PRIMARY KEY,
  at_ms INTEGER NOT NULL
);
