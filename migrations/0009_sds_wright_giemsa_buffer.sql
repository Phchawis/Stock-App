-- Wright Giemsa Buffer — SDS confirmed by the lab.
--
-- The buffer is the phosphate buffer used with the BASO / Wright-Giemsa stain
-- on the Mindray analyser, and its sheet lives in the "CBC Mindray ชั้น 3"
-- folder rather than with the Alinity chemistry sheets, which is why the
-- earlier folder-by-folder import did not pick it up.
--
-- Note for whoever revisits this: the buffer is made from two phosphate salts
-- and the folder holds a sheet for each —
--   MSDS Potassium_Baso Buffer.pdf      (monobasic, linked below)
--   MSDS di-Potassium_Baso Buffer.pdf   (dibasic, id 1_xRnga2h2Lbgh5xkRp2_0ZWsw_CVX_nQ)
-- A reagent row carries one document, so the monobasic sheet is attached here.
-- The two individual salts already exist as their own catalogue entries with
-- their own Thai-language sheets, so the dibasic component is not unreachable.

UPDATE reagents
   SET sds_file = 'MSDS Potassium_Baso Buffer.pdf',
       sds_url  = 'https://drive.google.com/file/d/19j5wOCJrN4jquxiufv2UxrccS18GkQ42/view',
       sds_source = 'CBC Mindray ชั้น 3'
 WHERE TRIM(en) = 'Wright Giemsa Buffer';
