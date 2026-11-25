-- หัวหน้าหมวดงาน (section head) as its own title, separate from the
-- supervisor role (หัวหน้าคลังน้ำยา). Documents that need the section head's
-- sign-off (the order report, the usage report) were taking the name and
-- signature of whichever account had the supervisor role, so they could carry
-- the warehouse head's signature over the section head's title. The title is
-- now held by one named account, set in the user edit form.
--
-- Set to ทนพญ.เบญจวรรณ รุ่งเรือง (username aopaop) at the lab's request,
-- 2026-11-25. Only if that account exists, so other copies are untouched.
INSERT INTO app_settings (key, value, updated_by, updated_at)
SELECT 'section_head', 'aopaop', 'ระบบ (ตามคำขอผู้ดูแลระบบ)', '2026-11-25 00:00'
 WHERE EXISTS (SELECT 1 FROM users WHERE username = 'aopaop')
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at;
