import { requirePerm, hashPassword, json } from './_lib.js';

// GET — any authenticated user. NEVER returns password hashes.
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB
      .prepare('SELECT username, name, role, initials, color, signature FROM users').all();
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
    return json({ success: true, username });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
