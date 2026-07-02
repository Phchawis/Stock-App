import { requirePerm, hashPassword, json } from './_lib.js';

// GET — any authenticated user. NEVER returns password hashes.
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB
      .prepare('SELECT username, name, role, initials, color FROM users').all();
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
    const hashed = await hashPassword(password || 'tuh1234');
    await env.DB.prepare(
      `INSERT INTO users (username, name, role, initials, color, password)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(username, name, role, initials, color, hashed).run();

    return json({ username, name, role, initials, color }, 201);
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
