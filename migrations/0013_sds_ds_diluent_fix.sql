-- DS-Diluent was carrying the wrong safety sheet.
--
-- The MSDS register lists MSDS_BC-RET_V3.0.pdf against both "CBC BC-RET
-- Control" (row 113) and "DS Diluent" (row 114) — the same file on two
-- consecutive rows, which reads like a copied line rather than an intent. They
-- are different products, and a dedicated sheet for the diluent exists in the
-- same folder.
--
-- Caught by comparing each reagent's name against its sheet's filename after
-- the Drive migration; confirmed by the lab before changing. The register
-- itself still has the duplicate and should be corrected at source.

UPDATE reagents
   SET sds_file = 'MSDS_DS diluent_Thai version.pdf',
       sds_url  = 'https://drive.google.com/file/d/1fwJ_Se88tRzeST2TMPMZiAyzuTjq55Yh/view',
       sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์'
 WHERE TRIM(en) = 'DS-Diluent';
