-- Vitamin D and Acid Wash — the last four gaps, now closed.
--
-- These four had no sheet anywhere in the MSDS register: not on the
-- ศูนย์แลปชั้น 3 tab, not on Immuno, not on Hormone. The lab obtained them
-- from Abbott and they are now in the unit's own Drive folder.
--
-- Note the Alinity naming. Earlier a "Vitamin D SDS.pdf" was found in the
-- Hormone (Roche) folder and deliberately NOT used: the lab runs Vitamin D on
-- Alinity, and a sheet for another manufacturer's reagent is worse than none.
-- These files confirm that call — they are the Alinity ones.

UPDATE reagents SET sds_file = 'MSDS_Alinity Vitamin D.pdf',
                    sds_url = 'https://drive.google.com/file/d/1-wjgfz8WHMRtf_OBLwX7xxMuD0U9-z8l/view',
                    sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์'
 WHERE TRIM(en) = 'Vitamin D';

UPDATE reagents SET sds_file = 'MSDS_Alinity Vitamin D Calibrator.pdf',
                    sds_url = 'https://drive.google.com/file/d/1kYO8cMTWhaZPK2zHhAqxLbs8l6Y0UK93/view',
                    sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์'
 WHERE TRIM(en) = 'Vitamin D Calibrator';

UPDATE reagents SET sds_file = 'MSDS_Alinity Vitamin D Control.pdf',
                    sds_url = 'https://drive.google.com/file/d/10Y03oluyWskvbYUuB5f0zPjS9UKDtmp1/view',
                    sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์'
 WHERE TRIM(en) = 'Vitamin D Control';

-- "Acid Wash" and "Acid Probe Wash" are different products — the lab confirmed
-- this when the two were nearly paired by name similarity. This is the former.
UPDATE reagents SET sds_file = 'MSDS_Alinity c Acid wash.pdf',
                    sds_url = 'https://drive.google.com/file/d/1_5EVhkBABDjYHFVxjawZifykjkLN-3s0/view',
                    sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์'
 WHERE TRIM(en) = 'Acid Wash';
