-- The last seven sheets, now in the unit's own Drive folder.
--
-- These lived under other sections' folders (Immuno New, Immuno(Phadia),
-- Coagulation #NEW, ESR) rather than ศูนย์แลปชั้น 3, because they are shared
-- with other benches — wash solutions, detergents, the coagulation Control P.
-- That is why the first move missed them.
--
-- With these, every safety sheet the system serves comes from a folder the
-- lab owns. Nothing depends on another account's sharing settings any more.

UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1IPZeseZ9SXZ72kUUqqhFiQWsLxD5UAGl/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'detergent a.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1fEYZm_iUvJsUNs42bmt8kq2R98zqCdga/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'detergent b.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Y0jTIkdrden4eHGeEnBXOY0YZHnHAPrR/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'control p.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1fzMAvJ7Cby-gdZg7BdCsBZYsxtGOkhIp/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'esr control_10435-en-esr-control-cube-msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Y-9e1Ia03rPVB2upHo2PnWNOb2gQvQ3N/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'maintenance solution kit .pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1C2omgK8pD4WrzLaUUtSshVIJ2YfveB10/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'washing solution .pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1QKUmRWvdhKiJ_NWlRc7q8c-Z_6cYh3Y5/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'acid probe wash.pdf';
