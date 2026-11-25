import { requirePerm, hashPassword, json, actorName, nowStr } from './_lib.js';

// หัวหน้าหมวดงาน (section head) is a title, not a permission role: the person
// whose name and signature go on documents that need the section head's
// sign-off. It is held by one account, kept in app_settings.
const SECTION_HEAD = 'section_head';

// GET — any authenticated user. NEVER returns password hashes.
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB
      .prepare(`SELECT username, name, role, initials, color, signature,
                       CASE WHEN username = (SELECT value FROM app_settings WHERE key = '${SECTION_HEAD}') THEN 1 ELSE 0 END AS isSectionHead
                  FROM users`).all();
    return json(results);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST — create a user (admin only). Password is salted+hashed before storage.
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'users' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const body = await request.json();
    const { username, name, role, initials, color, password } = body;
    if (!username || !name || !role || !initials || !color) {
      return json({ error: 'Missing required fields' }, 400);
    }
    // The `users` permission is grantable to any role from the permissions
    // screen, so this endpoint can legitimately be reached by a non-admin.
    // Minting an admin account is the one thing that must stay admin-only,
    // otherwise granting `users` silently hands out full control of the system.
    if (role === 'admin' && context.data.auth.role !== 'admin') {
      return json({ error: 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สร้างบัญชีระดับ Admin ได้' }, 403);
    }
    // Login looks accounts up case-insensitively, so storing mixed case would
    // let "Somchai" and "somchai" both exist and resolve unpredictably.
    const uname = String(username).trim().toLowerCase();
    if (!uname) return json({ error: 'ชื่อผู้ใช้ไม่ถูกต้อง' }, 400);
    const taken = await env.DB.prepare('SELECT 1 FROM users WHERE lower(username) = ?').bind(uname).first();
    if (taken) return json({ error: `มีชื่อผู้ใช้ "${uname}" อยู่ในระบบแล้ว` }, 400);

    const hashed = await hashPassword(password || 'tuh1234');
    await env.DB.prepare(
      `INSERT INTO users (username, name, role, initials, color, password)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(uname, name, role, initials, color, hashed).run();

    return json({ username: uname, name, role, initials, color }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE — remove a user (admin only). Keeps at least one admin.
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { perm: 'users' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const username = new URL(request.url).searchParams.get('username');
    if (!username) return json({ error: 'Missing username' }, 400);

    const target = await env.DB.prepare('SELECT role FROM users WHERE username = ?').bind(username).first();
    if (target && target.role === 'admin') {
      // Same reasoning as POST: a non-admin holding `users` must not be able to
      // remove the admins and take over the system.
      if (context.data.auth.role !== 'admin') {
        return json({ error: 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่ลบบัญชีระดับ Admin ได้' }, 403);
      }
      const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
      if (count <= 1) return json({ error: 'ต้องมีผู้ดูแลระบบ (Admin) เหลืออยู่อย่างน้อย 1 คน' }, 400);
    }

    await env.DB.prepare('DELETE FROM users WHERE username = ?').bind(username).run();
    await env.DB.prepare('DELETE FROM sessions WHERE username = ?').bind(username).run();
    await env.DB.prepare('DELETE FROM app_settings WHERE key = ? AND value = ?').bind(SECTION_HEAD, username).run();
    return json({ success: true, username });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// PUT — edit a user (perm: users): name, initials, role, an optional new
// password, whether they hold the หัวหน้าหมวดงาน title, and optionally a
// signature image attached on their behalf. The username is the key and
// cannot change.
export async function onRequestPut(context) {
  const denied = await requirePerm(context, { perm: 'users' });
  if (denied) return denied;
  const { env } = context;
  try {
    const b = await context.request.json();
    const username = String(b.username || '').trim().toLowerCase();
    const target = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
    if (!target) return json({ error: 'ไม่พบผู้ใช้นี้' }, 404);

    const name = String(b.name ?? target.name).trim();
    const initials = String(b.initials ?? target.initials).trim().slice(0, 3);
    const role = String(b.role ?? target.role);
    if (!name) return json({ error: 'กรุณากรอกชื่อ-นามสกุล' }, 400);
    if (!initials) return json({ error: 'กรุณากรอกอักษรย่อ' }, 400);
    if (!['admin', 'supervisor', 'technician', 'viewer'].includes(role)) return json({ error: 'บทบาทไม่ถูกต้อง' }, 400);

    const isAdmin = context.data.auth.role === 'admin';
    // As in POST and DELETE: someone granted `users` who isn't an admin must
    // not be able to make or unmake admins.
    if ((role === 'admin' || target.role === 'admin') && role !== target.role && !isAdmin) {
      return json({ error: 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่เปลี่ยนบทบาทระดับ Admin ได้' }, 403);
    }
    if (target.role === 'admin' && role !== 'admin') {
      const { count } = await env.DB.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'").first();
      if (count <= 1) return json({ error: 'ต้องมีผู้ดูแลระบบ (Admin) เหลืออยู่อย่างน้อย 1 คน' }, 400);
    }

    const stmts = [env.DB.prepare('UPDATE users SET name = ?, initials = ?, role = ? WHERE username = ?')
      .bind(name, initials, role, username)];
    if (b.password) {
      if (String(b.password).length < 6) return json({ error: 'รหัสผ่านใหม่ต้องยาวอย่างน้อย 6 ตัวอักษร' }, 400);
      stmts.push(env.DB.prepare('UPDATE users SET password = ? WHERE username = ?').bind(await hashPassword(String(b.password)), username));
    }
    if (typeof b.signature === 'string') {
      if (b.signature && !/^data:image\/(png|jpe?g);base64,/.test(b.signature)) return json({ error: 'ลายเซ็นต้องเป็นรูป PNG หรือ JPG' }, 400);
      if (b.signature.length > 700000) return json({ error: 'ไฟล์ลายเซ็นใหญ่เกินไป' }, 400);
      stmts.push(env.DB.prepare('UPDATE users SET signature = ? WHERE username = ?').bind(b.signature || null, username));
    }
    const by = await actorName(context);
    if (b.sectionHead === true) {
      stmts.push(env.DB.prepare(
        `INSERT INTO app_settings (key, value, updated_by, updated_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated_at = excluded.updated_at`
      ).bind(SECTION_HEAD, username, by, nowStr()));
    } else if (b.sectionHead === false) {
      stmts.push(env.DB.prepare('DELETE FROM app_settings WHERE key = ? AND value = ?').bind(SECTION_HEAD, username));
    }
    // A role change takes effect at the next sign-in; end their sessions so
    // it applies now rather than when their session happens to expire.
    if (role !== target.role) stmts.push(env.DB.prepare('DELETE FROM sessions WHERE username = ?').bind(username));
    await env.DB.batch(stmts);
    return json({ success: true, username, name, initials, role });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
