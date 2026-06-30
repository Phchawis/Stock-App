-- Cloudflare D1 Database Schema & Seed Script (TUH Reagent Inventory)

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS reagents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  th TEXT NOT NULL,
  en TEXT NOT NULL,
  cat TEXT NOT NULL,
  unit TEXT NOT NULL,
  subUnit TEXT,
  testsPerUnit INTEGER,
  storage TEXT NOT NULL,
  min_qty INTEGER NOT NULL,
  reorder_qty INTEGER NOT NULL,
  supplier TEXT NOT NULL,
  img TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS lots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rid INTEGER NOT NULL,
  lot TEXT NOT NULL,
  expiry TEXT NOT NULL,
  recv INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  loc TEXT NOT NULL,
  qr TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  FOREIGN KEY(rid) REFERENCES reagents(id)
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER NOT NULL,
  rid INTEGER NOT NULL,
  type TEXT NOT NULL,
  qty INTEGER NOT NULL,
  bal INTEGER NOT NULL,
  ref TEXT,
  scan TEXT NOT NULL,
  by TEXT NOT NULL,
  at TEXT NOT NULL,
  FOREIGN KEY(lot_id) REFERENCES lots(id),
  FOREIGN KEY(rid) REFERENCES reagents(id)
);

CREATE TABLE IF NOT EXISTS users (
  username TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  initials TEXT NOT NULL,
  color TEXT NOT NULL,
  password TEXT
);

-- 2. Seed Initial Mock Data
-- Reagents
INSERT OR IGNORE INTO reagents (id, code, th, en, cat, unit, testsPerUnit, storage, min_qty, reorder_qty, supplier, img) VALUES
(1, 'RGT-CHE-001', 'น้ำยาตรวจระดับน้ำตาลกลูโคส', 'Glucose (GLU)', 'CHE', 'vial', 100, 'REFRIGERATED_2_8', 2, 5, 'i-med', '/reagent_placeholder.png'),
(2, 'RGT-HEM-002', 'น้ำยาเจือจางสำหรับเครื่อง CBC', 'CBC Diluent', 'HEM', 'mL', NULL, 'ROOM_TEMP', 5, 20, 'Firmer', '/reagent_placeholder.png'),
(3, 'RGT-IMM-003', 'น้ำยาตรวจหาแอนติบอดี Anti-HIV', 'Anti-HIV', 'IMM', 'kit', 50, 'REFRIGERATED_2_8', 2, 6, 'i-med', '/reagent_placeholder.png'),
(4, 'RGT-CHE-004', 'ซีรัมควบคุมคุณภาพ ระดับ 2', 'Control Serum L2', 'CHE', 'vial', NULL, 'FROZEN_40', 10, 30, 'Med-one', '/reagent_placeholder.png'),
(5, 'RGT-MIP-005', 'ชุดน้ำยาย้อมแกรม', 'Gram Stain Kit', 'MIP', 'kit', NULL, 'ROOM_TEMP', 3, 10, 'Firmer', '/reagent_placeholder.png'),
(6, 'RGT-HEM-006', 'น้ำยาย้อม Reticulocyte', 'Reticulocyte Stain', 'HEM', 'mL', NULL, 'REFRIGERATED_2_8', 2, 8, 'Med-one', '/reagent_placeholder.png');

-- Lots
INSERT OR IGNORE INTO lots (id, rid, lot, expiry, recv, qty, loc, qr, status) VALUES
(101, 1, 'G2407A', '2026-07-20', 2, 1, 'ตู้เย็น A1', 'QR-G2407A', 'ACTIVE'),
(102, 1, 'G2410B', '2026-10-15', 2, 1, 'ตู้เย็น A1', 'QR-G2410B', 'ACTIVE'),
(103, 2, 'CBC-2508', '2026-08-05', 20, 8, 'ชั้นวาง B2', 'QR-CBC2508', 'ACTIVE'),
(104, 2, 'CBC-2601', '2027-01-10', 20, 15, 'ชั้นวาง B2', 'QR-CBC2601', 'ACTIVE'),
(105, 3, 'HIV-2509', '2026-09-12', 2, 1, 'ตู้เย็น A2', 'QR-HIV2509', 'ACTIVE'),
(106, 3, 'HIV-2512', '2026-12-01', 3, 2, 'ตู้เย็น A2', 'QR-HIV2512', 'ACTIVE'),
(107, 4, 'CS2-2507', '2026-07-05', 30, 4, 'ตู้แช่แข็ง F1', 'QR-CS2507', 'ACTIVE'),
(108, 5, 'GRAM-2603', '2027-03-01', 10, 6, 'ชั้นวาง C1', 'QR-GRAM2603', 'ACTIVE'),
(109, 6, 'RET-2508', '2026-08-28', 8, 1, 'ตู้เย็น A1', 'QR-RET2508', 'ACTIVE');

-- Transactions
INSERT OR IGNORE INTO transactions (id, lot_id, rid, type, qty, bal, ref, scan, by, at) VALUES
(1001, 101, 1, 'RECEIVE', 2, 2, 'PO-2604-018', 'MANUAL', 'ภญ. สมหญิง รักษ์ดี', '2026-04-10 09:12'),
(1002, 101, 1, 'ISSUE', -1, 1, 'REQ-2606-101', 'QR', 'ทนพ. สมชาย ใจดี', '2026-06-20 13:40'),
(1003, 102, 1, 'RECEIVE', 2, 2, 'PO-2605-022', 'MANUAL', 'ภญ. สมหญิง รักษ์ดี', '2026-05-15 10:05'),
(1004, 102, 1, 'ISSUE', -1, 1, 'REQ-2606-140', 'MANUAL', 'ทนพ. วิภา แสงทอง', '2026-06-25 11:20'),
(1005, 107, 4, 'RECEIVE', 30, 30, 'PO-2603-009', 'MANUAL', 'ภญ. สมหญิง รักษ์ดี', '2026-03-02 14:30'),
(1006, 107, 4, 'ISSUE', -26, 4, 'REQ-2606-088', 'QR', 'ทนพ. สมชาย ใจดี', '2026-06-18 08:55'),
(1007, 103, 2, 'ISSUE', -12, 8, 'REQ-2606-150', 'BARCODE', 'ทนพ. วิภา แสงทอง', '2026-06-27 15:10');

-- Users
INSERT OR IGNORE INTO users (username, name, role, initials, color, password) VALUES
('admin', 'ทนพ. ธนวัฒน์ ผู้ดูแลระบบ', 'admin', 'ธว', '#1387A6', 'tuh1234'),
('supervisor', 'ภญ. สมหญิง รักษ์ดี', 'supervisor', 'สญ', '#4E7CB0', 'tuh1234'),
('technician', 'ทนพ. สมชาย ใจดี', 'technician', 'สช', '#2E9E63', 'tuh1234'),
('viewer', 'คุณวิภา (ผู้สังเกตการณ์)', 'viewer', 'วภ', '#6E8694', 'tuh1234');
