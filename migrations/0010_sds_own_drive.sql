-- Point every safety sheet at the lab's own Drive folder.
--
-- The sheets previously lived in a folder owned by another account and shared
-- with this one. That worked, but the lab controlled none of it: revoking the
-- share, deleting the folder or closing that account would have broken all 148
-- links at once, and there is no worse moment to discover that than when an
-- assessor asks to see a sheet. The files now sit in
-- "SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์", owned by the unit.
--
-- Copies get new Drive ids, so every link has to be rewritten. Nine files were
-- renamed on the way across (catalogue-number prefixes, "NEW" suffixes); those
-- pairings are written out in the generator rather than guessed, and the stored
-- filename is updated alongside the link so the two keep agreeing.
--
-- Six files did not make the move and are deliberately left pointing at the old
-- shared folder — a working link to someone else's copy beats a dead one. They
-- are listed at the end of this file.

UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/16zcfZquhjS_I1GxYGjLY_KNH9fEiYV0B/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = '6c54.58_conc. wash buffer.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1FebijraVuhCsVlImxxF7uFDMH2ocO1gb/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = '8k25.04_intact pth calibrator.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1twbeHvokjwbMZaAqftmjhAkuP6qgoDP5/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = '8k25.13_intact pth control.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Pu7aWOSkmfUUN9Hm7YSWASTCvycRIJNm/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = '8k25.28_intact pth reagent.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1qiziJ0zOi_L9dH4skano9wElhiwEicns/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'actin fs.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1PGW5b48tjRGwLZkTCdftfheRwadEpnKS/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity afp cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/15JQN0t9ruAIfmAfAWQjzP9bS_m-QLDab/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity afp msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1PJKSQL5fKKll3lWp1V2PmyRJy70UrDBp/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity albumin2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1-q2jYDFshzV2rwjv6m5nbXD42HnpnVC_/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity alp2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1YepyiYQ9NUGzeEPRc83UcPeWa9FuryGi/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity alt2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/19_dbOA3npI5ieC0xHmmxWoHD37leFdcG/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity amylase2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1OXwLeQoTUE1SSTFo3m5PTWhtbi3v8U9z/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti hcv cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1zZMWJtH1kcgilHO97zGUwOtsbjRDJYaT/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbc cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1cDMbDKioItn8b54D8d1FT2IY803dXRgy/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbc control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1gSVhUChasJalP8oL5s5mZroznumsUteD/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbc igm cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1r2dCWtU2G7OI5PXFxMnIcTzan1k-_e2s/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbc igm control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1KZJ4cE-xKAJvr8-K_ry0k3illch2ooWe/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbc igm msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1M2TImLGEmq4Z3aL8gPutK6qnusIzDxE4/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbc msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Nsf6S3AAzPy_8dm3qCvQBPJRXAScM3n0/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbe cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/10rjRcBYBJWz8aPhrUdRSabyAJAOS_8Rg/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbe control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1eFD9aw6CgOOaIpw6ABTybPTn9ObnH65h/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbe msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/13Qj8WpwNwQKk8bKGTNBErjTtqM-A3p5M/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbs cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1wZYxoWrlAuXRtCdU-YfPIOL3-TvmAi6Z/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbs control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/16Mi84hRetv0T9O0hGOiMJTNZ_Iu4GkGl/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hbs msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1_cuGFoXuPrYmCJkS2GCr3xvtF3cp2ikR/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hcv control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/12QYrO0O8tS_jsnWcY2FV-Dmi-MjrWBdb/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity anti-hcv msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1cLrda1IzgHrJYvHY0c-EgvTsI7De82yk/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ast2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1mcxshr2FwgAHWZpRwqwhLSJWJg_CXJUb/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity bilirubin calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1YdFDQs0dFBDDv36L0sOKSy3QZeR9W4dh/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity bun msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1hKpN04ik585WdF-3TOSSuNZTR8o8oiiy/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity c ict reference msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1eRqaRh3ltX05cUDB7sAwNrGfNSJEuj-E/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity c ict sample diluent msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1vdofQDDzMLPpc5LY9rRulvDgpaua3G62/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity calcium msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/10x9YZAyUyiVLoePLTPFV65gsEg_s2DVD/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity cea cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Rm0qxHa_r-Ext4s6kMTyA344h9uyref0/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity cea msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/18NgEDnvW97Sr18gQTm3jWQ36DlssYH7m/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity cholesterol2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1R_uZN8MN7a8MVTOV_QqI1aNJV-ihKgzu/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ck msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1B414Zw0gb8U2glRWGOJYyFxbX-tp3WXw/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity clinical chemistry calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1GUBJn-Rd6U6yIZwfTDaCOeBavg229F2H/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity co2 calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1xZLv2WjCUYmsdjwEJAYXcvEfrx8JTXg9/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity co2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1IUEU1SFdtlR2PDLPuuTU6M7h9RZ66VHh/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity consolidated calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1RYcxTgFW6z-z1BxEdG6oigqRALHfhP3n/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity creatinine msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1JehBG8JpiWEE3R7PGhNeYK-kcFmdKxnn/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity crp calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1WZurHEyJz7vHbA1S-4rt99vDSuK0r-t3/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity crp msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1nzFPi7Y_nC8MPdu-5JS6pH2FHBV03FRY/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity direct bilirubin msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1DgFG70y3T8HZs3Hfxa31vMqm-SRnTZdp/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ferritin cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/17aCLTPaQdlHMZTYy3QlaWvJjptW9ZiLu/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ferritin msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/13zJGhjwK2dDGirOn5m5m_sBnukdGofbE/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity free psa cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1LnV6Pv11wOqnWC1HRsg-Qt0w806_yBA_/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity free psa msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1yIpqe4P0f0k0ryHnWt60EaQAzWvPfee0/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity free t3 cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1fiNvPbAfoOGIwvwdzs6vl9bSytSVuXb1/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity free t3 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1whaaXYqDNYuNSICpJ0upfGBzcCR4jgNS/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity free t4 cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1p9He5FgOSsX6meOV53fGsRbHBa6drHIe/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity free t4 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1cPgLIBcl8qh4lDhigAIsD3KxD5Z1_Msd/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ggt2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/10YOoKyf5AgiLMDWVfR6wIcUEAQ0vPzFQ/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity glucose msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1CRb8J16d1LUaoVK86s5fTcYzyxckIABm/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hav igg cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1NGUD0DMC0MOpObKA1G0wAAzCgyUHO16G/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hav igg control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/17P_maU3uZJIeY5q5wcA0p3csEyvWXoYW/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hav igg msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1GqBsQyN7AFmV-eAGhUKyNiariQQGMJNn/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hav igm cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1CMwFs6fL4DQWH6msaxdqbI57T-lLEAfO/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hav igm control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1MZ4zmRfaKXYfr4xXaH7mGXmimyZcjPWf/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hav igm msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1YxiujAnuPIZUnBnl11Yrf6TeX50eGgZm/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hba1c msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1FOjCNNp9LTZDC54TmFTn1aao-ZFx8FUw/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbeag cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1me11lF5Ll2ygOzUxRxf6OISDveI6Q6Oy/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbeag control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1l1OyWFv0eDVfDtA9KNgGcws6SjPLE4OL/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbeag msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1va6KbYeFYAh0Ou3H1rMreGiZSPyFvukZ/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbsag quali cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1e-KOEKV1iKgyNS1Z1wUq69iZSGS2WJ_v/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbsag quali cotrol msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1wsejUAveDxJyCkTwmm4IemBJ9SPtCUpv/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbsag quali msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1ENeLyZw25fHnjY3DMnnbitxQKvihftTX/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbsag quanti cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1bvp2Vsd-rS1lzzMmVsxX3luvbYGlxIc7/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbsag quanti control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1D6w_W8PKMkv-Fh_rK7x6lwIo9_yAbPZ4/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hbsag quanti msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1TDCHjeytWMrZm1VCDAYV2W2Dsdrs1aIJ/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hdl msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1OQnDjkWeqzyypG-w9ogEFTCUAyTh7laV/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hemoglobin a1c cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1LNLyjRKvApy_8_aCA9dSs44_fTwBtfQk/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hemoglobin a1c control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1uU1AaYoOtC9b6xp8xqRTDNBmVZevnRFF/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hscrp calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1PbU3c8v5Rh7i2l3lEcWrhetL4t8ue82g/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity hscrp control msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1twxqfKp1wlvTPQGpMqYP07xALSISsYBJ/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ict serum calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/11dDkzPGmFixgzD9qkg4gKmmquuko018g/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ict urine calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1SXcT2lQpR4SxT_Qc_GrHh-hffXGZ_q7c/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity iron2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1OjKVuY0YpMDkELNZoENvil16FBzBYQBd/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ldh2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1cZnjLqJ3d159aIeeBVKNUXUgPIliYf_-/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity ldl msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1AbfiMRLtU-qgqqPZ9jNwYQYXKMyeaoeU/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity lipase cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/17woOtR9hkhU7meWp45J3GQR5lPzMoyXj/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity lipase msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1CNV23Zf4LWvpQGVtGibX8-lERrsJCBuZ/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity lipid multiconstituent cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1GPXmdY5ih0035rAtld5J7E57QWRBab4L/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity magnesium msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1ZxSNE1h4LHx5GXdpYLK91VLXZrFDfllD/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity microalbumin calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/19vC9xz4cYZJIn9MLKVgIWbI2Mz0hcS7T/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity microalbumin msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1L3LGJjLMIS2QsvshKz-43VdOMCmACsiW/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity multiconstituent calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1CdNupdNXuSVca0KGleRhDdAo3G5QgBDk/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity phos2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/181eVpsxGYrKnaBx_Etpbo4-rBw1xuNgE/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity protein (urinecsf) msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1KMAd8Ih4mrFdVs7KaOwQJfGEsFIBmJ0t/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity psa msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/18-jjcPO9bAR0ekDzDNTgtj4rN5s1cfyC/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity total bilirubin msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1p2ICEQE0_pvpuTiLHjEOMcrfbmrKq-Dw/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity total protein2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1zGQKzawlSfF5qK2fOv3RuzNocqnJMDzE/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity total psa cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1I-OllEI0oEuBs3tHQ6fQxBtDx-StucMg/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity total t3 cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/18t6PRVwDhL0MhnbVgWu0g4wZvfe9KJlp/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity total t3 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/19g2BxkFJeKZVhypnIU8odsgJ9Tj-63mu/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity total t4 cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1sOrn7EqVp7DXRhaEGOFNICcdM0rZSbKR/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity total t4 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1u-frBjHwK0TdVS7wSRyf6tdgQBxiFWks/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity triglycerides2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Pny6T-lPpSPKPiS_IX99bi9qan7PZaf4/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity tsh cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/18vihOL-cZzRkzQo-XCGQTxRwYcFLpRyb/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity tsh msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1xEH8eMyp0OormMAFImRKXETggcQ0Cqb8/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity uibc calibrator msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/13Z-4okcb3_9OfP_xIxzwXgLKEqXh4Yh9/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity uibc msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1TIfF0YQbKIZILQXrCoOPXsSLQtm9xTlU/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity uric acid2 msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1GTpYP3dNaPNT4B2MZtmXWNuc5X07FaFx/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'alinity urinecsf protein cal msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/10xcnvtHCA1cCfcisILk_F_oKWb0cpXzM/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'ca clean i.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1WlSTM-cYI8G6Ladb9RBvJHZfipR_8jaz/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'cacl2.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1jgwZ6KPetow8ixIKM0kku3clY6XT1oVn/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'citrol 2.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1VGan6tFMSMOrkNF5GlLbM0jg-MD01zBJ/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'control n.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1lfpJtLtsm9E-aBU7ylCJN5MkK2Yu8Sks/view', sds_file = '4J27.03_HIV AgAb Combo Calibrator.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'hiv ag ab combo calibrator.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/14jIi_7Bik1y8GGeOKgBkCkL9i32lSnbV/view', sds_file = '4J27.12_HIV AgAb Combo Controls.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'hiv ag ab combo controls.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/16JzGOZL-Zeh4sC3IstveHGmt2HfTutc7/view', sds_file = '4J27.37_HIV AgAb Combo Reagent.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'hiv ag ab combo reagent kit.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1tIXWBdQv5asK7wRXuVb8BFjro7WN1cVX/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds di potassium_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1C1BU3QrYQIKCsQHWd44-LMSpcaw0qVka/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds potassium phospate_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Y-fzw2LUNzvqwHtBfMWyrF91qhf1WSuU/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds wright-giemsa eng ver..pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1_8xvbLDTLDHmf_FAefmOqNjwXwKDUeyk/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds-ca1311-methanol.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1tWXKeGY2rHI4cwacCzD8Ei_vzjgWTpp2/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_bc-ret_v3.0.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/11ZSxM1bOmLXk3w8zDPWO7UZVyJFy7G4K/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_immersion oil merck_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/12fxelL0DMg8TV3OVOL9vJI5BfFrVCzfo/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_m-6dr diluent_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/12aQDtsIB1spCcbjbMGT-xziBUnQ9ovaT/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_m-6fd dye_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1PvLwrMrIa2sVLWzoCwCmQ0Qmzx_nEsSj/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_m-6fn dye_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1ewOpSXXqEW5nNaBSHTBfnJNqh7-VmP5u/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_m-6fr dye_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1i6qxIAFAbTwYRgT254-kbChVt2v9fzCl/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_m-6ld lyse_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1CDev1itICzY73ue9MoeeFTIJA3a0sIZd/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_m-6lh lyse_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1vfQCx79yoOI6olGn54ZuaYIilMpte7se/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_m-6ln lyse_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1evTy3McSMVvuWI0SUzZMpH0uJOIRh_pD/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds_probe cleanser_thai version.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1M644-GSaI-hs4wUY0Do52maswNZ5U2D4/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'multichem ia plus abbott msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1Dmtf4K047Ut64mn5ljgi0Xz1U1GxsSUh/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'multichem ia plus abbott msds.v6 en zl_architect.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1QKachZZaDEveF0ssLEU_k1UAE_-SqdLX/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'multichem s plus assayed abbott msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1CecvGyDbjONcfqT5Bkg65fnGHi9IQHHN/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'multichem u abbott msds.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1DkPkpieTnfcS1C8q3cKDl-Pg5U64J4Ff/view', sds_file = '6E23.68_Pre-Trigger Solution NEW.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'pre-trigger solution.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1hVZLYSnElALINTabJuN0mUlFIhBTwA5N/view', sds_file = '1L56.40_Probe Condition Solution.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'probe conditioning solution.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1FM9fZ1s__-MSjW2w-zmxNU4SiBIvdHu9/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'safety data sheet of bc-6d control.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1SsCosH1xqZ1IDwH3gIGg0WoM49ugi8O-/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'sc-cal plus msds 3.0.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1-uh8uLAKNDeOm90a5GJ0iIxYWTWmDOAa/view', sds_file = '8D06.04_Syphilis TP Calibrator.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'syphilis tp calibrator.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/11GEuuxmUZqeVWu-UFBDXVKv0wBh_Jxqk/view', sds_file = '8D06.13_Syphilis TP Controls.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'syphilis tp controls.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1IjtM-2q3txbhxUknFKAKzSH6XTg-A-pC/view', sds_file = '8D06.32_Syphilis TP Reagent.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'syphilis tp reagent.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1urPeHPA0DzwjETxP-tcz4iOFqzPlbLia/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'thromborel s.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1ZeXPo5yFr9p1SrcPUPXZhxNraLS3ql2X/view', sds_file = '6C55.63_Trigger Solution NEW.pdf', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'trigger solution.pdf';
UPDATE reagents SET sds_url = 'https://drive.google.com/file/d/1sx98b7YMQIh3if1KLiyNkmIVIw1f3u4Y/view', sds_source = 'SDS หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์' WHERE lower(sds_file) = 'msds potassium_baso buffer.pdf';

-- Still pointing at the old shared folder (not found in the new one):
--   · acid probe wash.pdf
--   · control p.pdf
--   · detergent a.pdf
--   · detergent b.pdf
--   · esr control_10435-en-esr-control-cube-msds.pdf
--   · maintenance solution kit .pdf
--   · washing solution .pdf
