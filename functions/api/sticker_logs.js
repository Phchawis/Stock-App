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

const TIMESTAMP_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

// POST — record one sticker.
//
// Two shapes share this endpoint because they produce the same row:
//
//   the normal one — a label was just downloaded or printed. Any authenticated
//   user may write it: producing the label IS the act being recorded, so gating
//   it behind a permission would only create unlogged labels.
//
//   backfill: true — a label produced before this screen existed, copied in
//   from the lab's earlier records. The timestamp and the operator's name are
//   necessarily supplied by the caller here; that is the whole point, and it is
//   also why the row is stamped MANUAL and carries the account that typed it.
//   Restricted to roles that may manage master data.
export async function onRequestPost(context) {
  const { env } = context;
  try {
    const b = await context.request.json();
    const backfill = b.backfill === true || b.backfill === 'true';

    if (backfill) {
      const denied = await requirePerm(context, { perm: 'manage' });
      if (denied) return denied;
    }

    const kind = String(b.kind || '').toUpperCase();
    const action = String(b.action || 'DOWNLOAD').toUpperCase();
    if (!KINDS.has(kind)) return json({ error: 'ประเภทฉลากไม่ถูกต้อง' }, 400);
    if (!ACTIONS.has(action)) return json({ error: 'ชนิดการทำรายการไม่ถูกต้อง' }, 400);

    const reagentName = String(b.reagentName || '').trim();
    if (!reagentName) return json({ error: 'ไม่พบชื่อน้ำยาบนฉลาก' }, 400);

    const qty = Number.isFinite(+b.qty) && +b.qty > 0 ? Math.floor(+b.qty) : 1;
    const now = nowStr();

    // For a live label `by` and `at` come from the session and the server
    // clock, never the client — an audit record the caller can forge is
    // worthless. A backfilled row cannot work that way: the person who made
    // the label and the moment they made it are both in the past. So the
    // caller supplies them, and `entered_by` records who made that claim.
    let by, at, source, enteredBy, enteredAt, sourceNote;
    if (backfill) {
      at = String(b.at || '').trim();
      if (!TIMESTAMP_RE.test(at)) {
        return json({ error: 'รูปแบบวันที่-เวลาไม่ถูกต้อง (ต้องเป็น YYYY-MM-DD HH:MM)' }, 400);
      }
      // A record of the past cannot be dated in the future. Compared as
      // strings, which is exact for this format and needs no timezone maths.
      if (at > now) return json({ error: 'วันที่-เวลาของบันทึกย้อนหลังต้องไม่เกินเวลาปัจจุบัน' }, 400);
      if (at < '2020-01-01 00:00') return json({ error: 'วันที่-เวลาย้อนหลังเกินกว่าที่ระบบรองรับ' }, 400);

      by = String(b.by || '').trim();
      if (!by) return json({ error: 'ต้องระบุผู้ทำรายการเดิมตามบันทึกที่มีอยู่' }, 400);

      source = 'MANUAL';
      enteredBy = await actorName(context);
      enteredAt = now;
      sourceNote = String(b.sourceNote || '').trim() || null;
    } else {
      by = await actorName(context);
      at = now;
      source = 'AUTO';
      enteredBy = null;
      enteredAt = null;
      sourceNote = null;
    }

    const res = await env.DB.prepare(
      `INSERT INTO sticker_logs
         (kind, action, reagent_name, reagent_id, lot, sub_type, prep_date, exp_date,
          storage_temp, storage_duration, prepared_by, qty, by, at,
          source, entered_by, entered_at, source_note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      kind, action, reagentName,
      Number.isFinite(+b.reagentId) ? +b.reagentId : null,
      b.lot || null, b.subType || null, b.prepDate || null, b.expDate || null,
      b.storageTemp || null, b.storageDuration || null, b.preparedBy || null,
      qty, by, at,
      source, enteredBy, enteredAt, sourceNote
    ).run();

    return json({
      id: res.meta.last_row_id,
      kind, action, reagent_name: reagentName,
      reagent_id: Number.isFinite(+b.reagentId) ? +b.reagentId : null,
      lot: b.lot || null, sub_type: b.subType || null,
      prep_date: b.prepDate || null, exp_date: b.expDate || null,
      storage_temp: b.storageTemp || null, storage_duration: b.storageDuration || null,
      prepared_by: b.preparedBy || null, qty, by, at,
      source, entered_by: enteredBy, entered_at: enteredAt, source_note: sourceNote
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
