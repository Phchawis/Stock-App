import { requirePerm, actorName, nowStr, json } from './_lib.js';

const KINDS = new Set(['ALIQUOT', 'OPENED', 'LOT_QR']);
const ACTIONS = new Set(['DOWNLOAD', 'PRINT']);

// GET ?months=N — preparation records, newest first. Same windowing rule as
// /api/transactions: the screen opens on a recent window and can ask for the
// full history on demand, so the default response stays small as the table
// grows (it is append-only and never pruned).
export async function onRequestGet(context) {
  try {
    const months = parseInt(new URL(context.request.url).searchParams.get('months'), 10);
    let query = 'SELECT * FROM sticker_logs';
    const binds = [];
    if (Number.isFinite(months) && months > 0) {
      query += ` WHERE at >= datetime('now', ?)`;
      binds.push(`-${months} months`);
    }
    query += ' ORDER BY at DESC, id DESC';
    const { results } = await context.env.DB.prepare(query).bind(...binds).all();
    return json(results);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST — record one sticker download/print. Any authenticated user may write
// here: producing a label IS the act being recorded, so gating it behind a
// permission would just create unlogged labels, which defeats the point.
export async function onRequestPost(context) {
  const { env } = context;
  try {
    const b = await context.request.json();
    const kind = String(b.kind || '').toUpperCase();
    const action = String(b.action || 'DOWNLOAD').toUpperCase();
    if (!KINDS.has(kind)) return json({ error: 'ประเภทฉลากไม่ถูกต้อง' }, 400);
    if (!ACTIONS.has(action)) return json({ error: 'ชนิดการทำรายการไม่ถูกต้อง' }, 400);

    const reagentName = String(b.reagentName || '').trim();
    if (!reagentName) return json({ error: 'ไม่พบชื่อน้ำยาบนฉลาก' }, 400);

    const qty = Number.isFinite(+b.qty) && +b.qty > 0 ? Math.floor(+b.qty) : 1;
    // `by` and `at` come from the session and the server clock, never the
    // client — an audit record the caller can forge is worthless.
    const by = await actorName(context);
    const at = nowStr();

    const res = await env.DB.prepare(
      `INSERT INTO sticker_logs
         (kind, action, reagent_name, reagent_id, lot, sub_type, prep_date, exp_date,
          storage_temp, storage_duration, prepared_by, qty, by, at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      kind, action, reagentName,
      Number.isFinite(+b.reagentId) ? +b.reagentId : null,
      b.lot || null, b.subType || null, b.prepDate || null, b.expDate || null,
      b.storageTemp || null, b.storageDuration || null, b.preparedBy || null,
      qty, by, at
    ).run();

    return json({
      id: res.meta.last_row_id,
      kind, action, reagent_name: reagentName,
      reagent_id: Number.isFinite(+b.reagentId) ? +b.reagentId : null,
      lot: b.lot || null, sub_type: b.subType || null,
      prep_date: b.prepDate || null, exp_date: b.expDate || null,
      storage_temp: b.storageTemp || null, storage_duration: b.storageDuration || null,
      prepared_by: b.preparedBy || null, qty, by, at
    }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE ?id=X — remove one mistaken record (admin only).
// DELETE with no id — clear the whole log (admin only; irreversible).
// Deliberately admin-only in both forms: this table exists to be shown to an
// inspector, so the people it records must not be able to edit it themselves.
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (id) {
      const row = await env.DB.prepare('SELECT id FROM sticker_logs WHERE id = ?').bind(id).first();
      if (!row) return json({ error: 'ไม่พบรายการนี้' }, 404);
      await env.DB.prepare('DELETE FROM sticker_logs WHERE id = ?').bind(id).run();
      return json({ success: true, id: +id });
    }
    await env.DB.prepare('DELETE FROM sticker_logs').run();
    return json({ success: true, cleared: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
