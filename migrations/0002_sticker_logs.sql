-- Sticker preparation / labelling record.
--
-- Every sticker the lab downloads or prints is a physical label that ends up on
-- a bottle, so an inspector asking "who prepared this aliquot, when, and from
-- which lot?" needs an answer that outlives the PNG file. One row per download
-- or print action, capturing exactly what was on the label at that moment —
-- deliberately denormalised (reagent_name is stored as text, not a foreign key)
-- because the record must stay readable even if the reagent is later renamed or
-- removed from the catalogue.

CREATE TABLE IF NOT EXISTS sticker_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,               -- ALIQUOT | OPENED | LOT_QR
  action TEXT NOT NULL,             -- DOWNLOAD | PRINT
  reagent_name TEXT NOT NULL,
  reagent_id INTEGER,               -- best-effort link; NULL for free-typed names
  lot TEXT,
  sub_type TEXT,                    -- Control / Calibrator (OPENED stickers)
  prep_date TEXT,                   -- วันที่เตรียม (ALIQUOT) / วันที่เปิดใช้ (OPENED)
  exp_date TEXT,                    -- วันหมดอายุบนฉลาก
  storage_temp TEXT,                -- e.g. 2-8 °C
  storage_duration TEXT,            -- e.g. 28 days / Until exp.
  prepared_by TEXT,                 -- ชื่อที่พิมพ์ลงบนฉลาก
  qty INTEGER NOT NULL DEFAULT 1,   -- จำนวนดวงที่สั่งพิมพ์/ดาวน์โหลดครั้งนั้น
  by TEXT NOT NULL,                 -- บัญชีผู้ใช้ที่ทำรายการ (จาก session, เชื่อถือได้)
  at TEXT NOT NULL                  -- 'YYYY-MM-DD HH:MM' เวลาไทย
);

-- The screen always reads newest-first, and filters by date range.
CREATE INDEX IF NOT EXISTS idx_sticker_logs_at ON sticker_logs (at DESC);
