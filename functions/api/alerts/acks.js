import { requirePerm, json, actorName, nowStr } from '../_lib.js';

// GET - retrieve all alert status records
export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare('SELECT * FROM alert_acks').all();
    return json(results);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST - insert/update an alert status record (perm: ack)
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'ack' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { key, status } = await request.json();
    if (!key || !status) {
      return json({ error: 'Missing key or status' }, 400);
    }
    const by = await actorName(context);
    const at = nowStr();
    await env.DB.prepare(
      `INSERT INTO alert_acks (key, status, at, by)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET status = ?, at = ?, by = ?`
    ).bind(key, status, at, by, status, at, by).run();
    return json({ success: true, key, status });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE - remove an alert status record (perm: ack)
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { perm: 'ack' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const key = new URL(request.url).searchParams.get('key');
    if (!key) {
      return json({ error: 'Missing key' }, 400);
    }
    await env.DB.prepare('DELETE FROM alert_acks WHERE key = ?').bind(key).run();
    return json({ success: true, key });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
