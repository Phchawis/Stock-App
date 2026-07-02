import { requirePerm, json } from './_lib.js';

// GET /api/permissions — role→perm matrix, e.g. { admin: { view:1, ... }, ... }
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare('SELECT role, perm, allowed FROM permissions').all();
    const map = {};
    for (const r of results) {
      (map[r.role] ||= {})[r.perm] = r.allowed ? 1 : 0;
    }
    return json(map);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// PUT /api/permissions — admin only. Body: { role, perm, allowed }
export async function onRequestPut(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;
  try {
    const { role, perm, allowed } = await context.request.json();
    if (!role || !perm) return json({ error: 'Missing role or perm' }, 400);
    await context.env.DB.prepare(
      `INSERT INTO permissions (role, perm, allowed) VALUES (?, ?, ?)
       ON CONFLICT(role, perm) DO UPDATE SET allowed = excluded.allowed`
    ).bind(role, perm, allowed ? 1 : 0).run();
    return json({ success: true, role, perm, allowed: allowed ? 1 : 0 });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
