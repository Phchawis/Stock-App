import { requirePerm, json, actorName, nowStr } from './_lib.js';

export async function onRequestGet(context) {
  try {
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS alert_acks (
        key TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        at TEXT NOT NULL,
        by TEXT NOT NULL
      )
    `).run();
    const { results } = await context.env.DB.prepare('SELECT * FROM reagents').all();
    const mapped = results.map((r) => ({
      id: r.id, code: r.code, th: r.th, en: r.en, cat: r.cat, unit: r.unit,
      subUnit: r.subUnit || '', testsPerUnit: r.testsPerUnit, storage: r.storage,
      min: r.min_qty, reorder: r.reorder_qty, supplier: r.supplier, img: r.img
    }));
    return json(mapped);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST — register a reagent (perm: manage)
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const b = await request.json();
    const { code, th, en, cat, unit, subUnit, testsPerUnit, storage, min, reorder, supplier, img } = b;
    if (!th || !cat || !unit || !storage || min === undefined) {
      return json({ error: 'Missing required fields' }, 400);
    }
    const result = await env.DB.prepare(
      `INSERT INTO reagents (code, th, en, cat, unit, subUnit, testsPerUnit, storage, min_qty, reorder_qty, supplier, img)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      code, th, en || th, cat, unit, subUnit || '', testsPerUnit || null, storage,
      min, reorder !== undefined ? reorder : min, supplier || 'i-med', img || '/reagent_placeholder.png'
    ).run();

    return json({
      id: result.meta.last_row_id,
      code, th, en: en || th, cat, unit, subUnit: subUnit || '', testsPerUnit: testsPerUnit || null,
      storage, min, reorder: reorder !== undefined ? reorder : min, supplier: supplier || 'i-med', img: img || '/reagent_placeholder.png'
    }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// PUT — edit a reagent (perm: manage)
export async function onRequestPut(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const b = await request.json();
    const { id, th, en, cat, unit, subUnit, testsPerUnit, storage, min, reorder, supplier, img } = b;
    if (!id || !th || !cat || !unit || !storage || min === undefined) {
      return json({ error: 'Missing required fields' }, 400);
    }
    await env.DB.prepare(
      `UPDATE reagents
       SET th = ?, en = ?, cat = ?, unit = ?, subUnit = ?, testsPerUnit = ?, storage = ?, min_qty = ?, reorder_qty = ?, supplier = ?, img = ?
       WHERE id = ?`
    ).bind(
      th, en || th, cat, unit, subUnit || '', testsPerUnit || null, storage,
      min, reorder !== undefined ? reorder : min, supplier, img || '/reagent_placeholder.png', id
    ).run();
    return json({ success: true, id });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE — remove a reagent + its lots/transactions (admin only; destructive cascade)
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'Missing reagent id' }, 400);

    // Fetch reagent info before deletion to log it
    const reagent = await env.DB.prepare('SELECT code, th FROM reagents WHERE id = ?').bind(id).first();
    if (!reagent) return json({ error: 'Reagent not found' }, 404);

    const actor = await actorName(context);
    const timestamp = nowStr();
    const refString = `${reagent.code} - ${reagent.th}`;

    await env.DB.batch([
      env.DB.prepare('DELETE FROM transactions WHERE rid = ?').bind(id),
      env.DB.prepare('DELETE FROM lots WHERE rid = ?').bind(id),
      env.DB.prepare('DELETE FROM reagents WHERE id = ?').bind(id),
      env.DB.prepare(
        `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
         VALUES (0, 0, 'DELETE', 0, 0, ?, 'MANUAL', ?, ?)`
      ).bind(refString, actor, timestamp)
    ]);
    return json({ success: true, id: Number(id) });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
