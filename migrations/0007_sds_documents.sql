-- Safety Data Sheets (SDS/MSDS) linked to each reagent.
--
-- Imported from the hospital's MSDS register (ทะเบียน MSDS ปี 68), sheet
-- "ศูนย์แลปชั้น 3", plus the four analytes whose entries live on the
-- "Immuno and Toxico (Alinity)" sheet instead.
--
-- Names were paired against an explicit alias table rather than by string
-- similarity: the catalogue uses clinical abbreviations (BUN, AST, CK) where
-- the register uses full product names, and letting a fuzzy matcher bridge that
-- gap paired "Creatinine" with "Creatine Kinase" and "Anti HBc" with "Anti-HBs"
-- — different tests, and the wrong safety sheet on a chemical is worse than no
-- sheet at all. Every pairing below is therefore written out and auditable.
--
-- sds_url stays NULL until the Drive links are filled in; the UI shows the
-- filename and marks the document as pending rather than pretending it exists.

ALTER TABLE reagents ADD COLUMN sds_file TEXT;
ALTER TABLE reagents ADD COLUMN sds_url TEXT;
ALTER TABLE reagents ADD COLUMN sds_source TEXT;

-- One place for settings the app needs but that are not reagent data — first
-- use is the Drive folder holding the SDS files, so a reagent whose own link is
-- still missing can at least open the folder.
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_by TEXT,
  updated_at TEXT
);


-- ── Link SDS to reagents already in the catalogue (138) ──
UPDATE reagents SET sds_file = 'Alinity Glucose MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 9;
UPDATE reagents SET sds_file = 'Alinity BUN MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 10;
UPDATE reagents SET sds_file = 'Alinity Creatinine MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 11;
UPDATE reagents SET sds_file = 'Alinity Uric acid2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 13;
UPDATE reagents SET sds_file = 'Alinity Cholesterol2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 14;
UPDATE reagents SET sds_file = 'Alinity Triglycerides2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 15;
UPDATE reagents SET sds_file = 'Alinity HDL MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 16;
UPDATE reagents SET sds_file = 'Alinity LDL MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 17;
UPDATE reagents SET sds_file = 'Alinity Total protein2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 18;
UPDATE reagents SET sds_file = 'Alinity Albumin2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 19;
UPDATE reagents SET sds_file = 'Alinity Total Bilirubin MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 20;
UPDATE reagents SET sds_file = 'Alinity Direct Bilirubin MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 21;
UPDATE reagents SET sds_file = 'Alinity AST2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 22;
UPDATE reagents SET sds_file = 'Alinity ALT2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 23;
UPDATE reagents SET sds_file = 'Alinity ALP2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 24;
UPDATE reagents SET sds_file = 'Alinity Magnesium MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 25;
UPDATE reagents SET sds_file = 'Alinity Calcium MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 26;
UPDATE reagents SET sds_file = 'Alinity Phos2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 27;
UPDATE reagents SET sds_file = 'Alinity microalbumin MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 28;
UPDATE reagents SET sds_file = 'Alinity CK MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 29;
UPDATE reagents SET sds_file = 'Alinity LDH2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 30;
UPDATE reagents SET sds_file = 'Alinity Amylase2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 31;
UPDATE reagents SET sds_file = 'Alinity Lipase MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 32;
UPDATE reagents SET sds_file = 'Alinity Iron2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 33;
UPDATE reagents SET sds_file = 'Alinity UIBC MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 34;
UPDATE reagents SET sds_file = 'Alinity Protein (UrineCSF) MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 35;
UPDATE reagents SET sds_file = 'Alinity CRP MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 36;
UPDATE reagents SET sds_file = 'Alinity GGT2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 37;
UPDATE reagents SET sds_file = 'Alinity Co2 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 38;
UPDATE reagents SET sds_file = 'Alinity HbA1c MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 39;
UPDATE reagents SET sds_file = 'Alinity Ferritin MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 40;
UPDATE reagents SET sds_file = 'Alinity CEA MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 41;
UPDATE reagents SET sds_file = 'Alinity PSA MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 42;
UPDATE reagents SET sds_file = 'Alinity AFP MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 43;
UPDATE reagents SET sds_file = 'Alinity Free PSA MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 44;
UPDATE reagents SET sds_file = 'Alinity TSH MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 45;
UPDATE reagents SET sds_file = 'Alinity Total T3 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 46;
UPDATE reagents SET sds_file = 'Alinity Total T4 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 47;
UPDATE reagents SET sds_file = 'Alinity Free T3 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 48;
UPDATE reagents SET sds_file = 'Alinity Free T4 MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 49;
UPDATE reagents SET sds_file = 'Alinity HBsAg Quali MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 50;
UPDATE reagents SET sds_file = 'Alinity Anti-HBs MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 51;
UPDATE reagents SET sds_file = 'Alinity Anti-HBc MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 52;
UPDATE reagents SET sds_file = 'Alinity Anti-HCV MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 53;
UPDATE reagents SET sds_file = 'Alinity HAV IgG MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 54;
UPDATE reagents SET sds_file = 'Alinity HAV IgM MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 55;
UPDATE reagents SET sds_file = 'Alinity Anti-HBc IgM MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 56;
UPDATE reagents SET sds_file = 'Alinity HBsAg Quanti MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 57;
UPDATE reagents SET sds_file = 'Alinity HBeAg MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 58;
UPDATE reagents SET sds_file = 'Alinity Anti-HBe MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 59;
UPDATE reagents SET sds_file = 'Alinity Consolidated calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 60;
UPDATE reagents SET sds_file = 'Alinity Multiconstituent calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 61;
UPDATE reagents SET sds_file = 'Alinity CO2 calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 62;
UPDATE reagents SET sds_file = 'Alinity Clinical Chemistry Calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 63;
UPDATE reagents SET sds_file = 'Alinity CRP calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 64;
UPDATE reagents SET sds_file = 'Alinity Bilirubin calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 65;
UPDATE reagents SET sds_file = 'Alinity Lipid Multiconstituent cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 66;
UPDATE reagents SET sds_file = 'Alinity Hemoglobin A1c Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 67;
UPDATE reagents SET sds_file = 'Alinity ICT Serum Calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 68;
UPDATE reagents SET sds_file = 'Alinity ICT Urine Calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 69;
UPDATE reagents SET sds_file = 'Alinity Microalbumin Calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 70;
UPDATE reagents SET sds_file = 'Alinity Lipase Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 71;
UPDATE reagents SET sds_file = 'Alinity UIBC Calibrator MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 72;
UPDATE reagents SET sds_file = 'Alinity UrineCSF Protein Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 73;
UPDATE reagents SET sds_file = 'Alinity CEA Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 74;
UPDATE reagents SET sds_file = 'Alinity Total PSA Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 75;
UPDATE reagents SET sds_file = 'Alinity AFP Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 76;
UPDATE reagents SET sds_file = 'Alinity Free PSA Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 77;
UPDATE reagents SET sds_file = 'Alinity TSH Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 78;
UPDATE reagents SET sds_file = 'Alinity Total T3 Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 79;
UPDATE reagents SET sds_file = 'Alinity Total T4 Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 80;
UPDATE reagents SET sds_file = 'Alinity Free T3 Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 81;
UPDATE reagents SET sds_file = 'Alinity Free T4 Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 82;
UPDATE reagents SET sds_file = 'Alinity HBsAg Quali Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 83;
UPDATE reagents SET sds_file = 'Alinity Anti-HBs Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 84;
UPDATE reagents SET sds_file = 'Alinity Anti-HBc Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 85;
UPDATE reagents SET sds_file = 'Alinity Anti HCV Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 86;
UPDATE reagents SET sds_file = 'Alinity HAV IgG Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 87;
UPDATE reagents SET sds_file = 'Alinity HAV IgM Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 88;
UPDATE reagents SET sds_file = 'Alinity Anti-HBc IgM Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 89;
UPDATE reagents SET sds_file = 'Alinity HBsAg Quanti Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 90;
UPDATE reagents SET sds_file = 'Alinity HBeAg Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 91;
UPDATE reagents SET sds_file = 'Alinity Anti-HBe Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 92;
UPDATE reagents SET sds_file = 'Alinity Ferritin Cal MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 93;
UPDATE reagents SET sds_file = 'HIV Ag Ab Combo Reagent Kit.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 94;
UPDATE reagents SET sds_file = '8K25.28_Intact PTH Reagent.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 96;
UPDATE reagents SET sds_file = 'Syphilis TP Reagent.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 97;
UPDATE reagents SET sds_file = 'HIV Ag Ab Combo Calibrator.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 98;
UPDATE reagents SET sds_file = '8K25.04_Intact PTH Calibrator.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 100;
UPDATE reagents SET sds_file = 'Syphilis TP Calibrator.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 101;
UPDATE reagents SET sds_file = 'HIV Ag Ab Combo Controls.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 102;
UPDATE reagents SET sds_file = '8K25.13_Intact PTH Control.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 104;
UPDATE reagents SET sds_file = 'Syphilis TP Controls.pdf', sds_source = 'Immuno and Toxico (Alinity)' WHERE id = 105;
UPDATE reagents SET sds_file = 'Multichem S Plus Assayed Abbott MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 106;
UPDATE reagents SET sds_file = 'Multichem S Plus Assayed Abbott MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 107;
UPDATE reagents SET sds_file = 'Multichem S Plus Assayed Abbott MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 108;
UPDATE reagents SET sds_file = 'Multichem IA Plus Abbott MSDS.V6 en ZL_Architect.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 109;
UPDATE reagents SET sds_file = 'Multichem U Abbott MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 110;
UPDATE reagents SET sds_file = 'Alinity hsCRP control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 111;
UPDATE reagents SET sds_file = 'Alinity Hemoglobin A1c Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 112;
UPDATE reagents SET sds_file = 'Alinity HBsAg Quali Cotrol MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 113;
UPDATE reagents SET sds_file = 'Alinity Anti-HBs Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 114;
UPDATE reagents SET sds_file = 'Alinity Anti-HBc Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 115;
UPDATE reagents SET sds_file = 'Alinity Anti-HCV Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 116;
UPDATE reagents SET sds_file = 'Alinity HAV IgG Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 117;
UPDATE reagents SET sds_file = 'Alinity HAV IgM Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 118;
UPDATE reagents SET sds_file = 'Alinity Anti-HBc IgM control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 119;
UPDATE reagents SET sds_file = 'Alinity HBsAg Quanti Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 120;
UPDATE reagents SET sds_file = 'Alinity HBeAg Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 121;
UPDATE reagents SET sds_file = 'Alinity Anti-HBe Control MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 122;
UPDATE reagents SET sds_file = 'Acid probe wash.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 123;
UPDATE reagents SET sds_file = 'Alinity c ICT Sample Diluent MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 124;
UPDATE reagents SET sds_file = 'Alinity c ICT reference MSDS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 125;
UPDATE reagents SET sds_file = 'Washing Solution .pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 127;
UPDATE reagents SET sds_file = 'Detergent A.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 128;
UPDATE reagents SET sds_file = 'Detergent B.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 129;
UPDATE reagents SET sds_file = 'Maintenance Solution kit .pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 130;
UPDATE reagents SET sds_file = '6C54.58_Conc. Wash Buffer.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 132;
UPDATE reagents SET sds_file = 'Probe Conditioning Solution.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 133;
UPDATE reagents SET sds_file = 'Pre-Trigger Solution.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 134;
UPDATE reagents SET sds_file = 'Trigger Solution.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 135;
UPDATE reagents SET sds_file = 'MSDS_BC-RET_V3.0.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 137;
UPDATE reagents SET sds_file = 'MSDS_Probe cleanser_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 138;
UPDATE reagents SET sds_file = 'MSDS_M-6LD LYSE_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 139;
UPDATE reagents SET sds_file = 'MSDS_M-6LN LYSE_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 140;
UPDATE reagents SET sds_file = 'MSDS_M-6LH LYSE_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 141;
UPDATE reagents SET sds_file = 'MSDS_M-6DR diluent_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 142;
UPDATE reagents SET sds_file = 'MSDS_M-6FD DYE_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 143;
UPDATE reagents SET sds_file = 'MSDS_M-6FR DYE_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 144;
UPDATE reagents SET sds_file = 'MSDS_M-6FN DYE_Thai version.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 145;
UPDATE reagents SET sds_file = 'MSDS-CA1311-Methanol.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 148;
UPDATE reagents SET sds_file = 'MSDS Wright-Giemsa Eng ver..pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 149;
UPDATE reagents SET sds_file = 'Thromborel S.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 151;
UPDATE reagents SET sds_file = 'Actin FS.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 152;
UPDATE reagents SET sds_file = 'CA clean I.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 153;
UPDATE reagents SET sds_file = 'CaCl2.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 154;
UPDATE reagents SET sds_file = 'Control N.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 156;
UPDATE reagents SET sds_file = 'Control P.pdf', sds_source = 'ศูนย์แลปชั้น 3' WHERE id = 157;

-- ── Reagents that exist only in the MSDS register (9) ──
-- Created so their safety sheet is reachable from the system. Stock
-- details (unit, minimum, supplier) are placeholders for the lab to fill in;
-- the code prefix SDS- makes them easy to find and complete later.
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-001', 'CRP Vario high sensitivity Calibrator', 'CRP Vario high sensitivity Calibrator', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'Alinity hsCRP calibrator MSDS.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-001');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-002', 'CBC BC-6D Control', 'CBC BC-6D Control', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'Safety Data Sheet of BC-6D Control.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-002');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-003', 'CBC BC-RET Control', 'CBC BC-RET Control', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'MSDS_BC-RET_V3.0.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-003');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-004', 'Immersion oil for microscopy', 'Immersion oil for microscopy', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'MSDS_Immersion oil Merck_Thai version.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-004');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-005', 'SC Cal plus', 'SC Cal plus', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'SC-CAL PLUS MSDS 3.0.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-005');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-006', 'Potassium phosphate, monobasic', 'Potassium phosphate, monobasic', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'MSDS Potassium phospate_Thai version.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-006');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-007', 'Di-potassium hydrogen orthophosphate anhydrous', 'Di-potassium hydrogen orthophosphate anhydrous', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'MSDS Di potassium_Thai version.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-007');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-008', 'Citrol 2', 'Citrol 2', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'Citrol 2.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-008');
INSERT INTO reagents (code, th, en, cat, unit, storage, min_qty, reorder_qty, supplier, img, sds_file, sds_source)
  SELECT 'SDS-009', 'ESR', 'ESR', 'HMS', 'Box', 'ROOM_TEMP', 0, 0, 'รอระบุ', '/reagent_placeholder.png', 'ESR Control_10435-EN-ESR-CONTROL-CUBE-MSDS.pdf', 'ศูนย์แลปชั้น 3'
  WHERE NOT EXISTS (SELECT 1 FROM reagents WHERE code = 'SDS-009');
