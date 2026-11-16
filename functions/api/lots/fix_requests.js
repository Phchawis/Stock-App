import { requirePerm, actorName, nowStr, json, expiryProblem } from '../_lib.js';
import { correctLot } from '../_lotfix.js';

// A lot number found wrong during a stock count by someone who may not change
// it, reported for a supervisor or admin to approve. Approving runs the same
// correction as /api/lots/correct, so both paths rename or merge the same way.

// GET — pending reports (any signed-in user; the dashboard shows them to
// those who can decide).
export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(
      `SELECT f.id, f.lot_id AS lotId, f.rid, r.th AS reagent, f.old_lot AS oldLot, f.new_lot AS newLot,
              f.label_expiry AS labelExpiry, f.note, f.by, f.at,
              l.qty, l.expiry AS systemExpiry, l.lot AS currentLot
         FROM lot_fix_requests f
         LEFT JOIN reagents r ON r.id = f.rid
         LEFT JOIN lots l ON l.id = f.lot_id
        WHERE f.status = 'PENDING'
        ORDER BY f.id`
    ).all();
    return json(results);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST — report a wrong lot number (perm: view, i.e. anyone counting).
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'view' });
  if (denied) return denied;
  const { env } = context;
  try {
    const b = await context.request.json();
    const lot = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(+b.lotId).first();
    if (!lot) return json({ error: 'ไม่พบ Lot นี้ในระบบ' }, 404);
    const newLot = String(b.newLot || '').trim();
    if (!newLot || newLot === lot.lot) return json({ error: 'กรุณากรอกเลข Lot ตามฉลากที่ต่างจากในระบบ' }, 400);
    const badExpiry = expiryProblem(b.labelExpiry);
    if (badExpiry) return json({ error: badExpiry }, 400);
    const dup = await env.DB.prepare(
      "SELECT 1 FROM lot_fix_requests WHERE lot_id = ? AND new_lot = ? AND status = 'PENDING'"
    ).bind(lot.id, newLot).first();
    if (dup) return json({ error: 'มีการแจ้งแก้ Lot นี้เป็นเลขเดียวกันรออนุมัติอยู่แล้ว' }, 409);
    const by = await actorName(context);
    await env.DB.prepare(
      `INSERT INTO lot_fix_requests (lot_id, rid, old_lot, new_lot, label_expiry, note, by, at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(lot.id, lot.rid, lot.lot, newLot, b.labelExpiry, String(b.note || '').slice(0, 200) || null, by, nowStr()).run();
    return json({ success: true }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// PUT — approve or reject a report (perm: manage).
export async function onRequestPut(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env } = context;
  try {
    const { id, decision } = await context.request.json();
    const req = await env.DB.prepare("SELECT * FROM lot_fix_requests WHERE id = ? AND status = 'PENDING'").bind(+id).first();
    if (!req) return json({ error: 'ไม่พบรายการนี้ หรือมีผู้ตัดสินไปแล้ว' }, 404);
    const by = await actorName(context);
    const at = nowStr();

    if (decision === 'reject') {
      await env.DB.prepare("UPDATE lot_fix_requests SET status = 'REJECTED', decided_by = ?, decided_at = ? WHERE id = ?")
        .bind(by, at, req.id).run();
      return json({ success: true, decision: 'reject' });
    }
    if (decision !== 'approve') return json({ error: 'decision ต้องเป็น approve หรือ reject' }, 400);

    // The lot must still be the one reported. If someone has corrected it
    // since, approving would apply a correction to a number that is gone.
    const lot = await env.DB.prepare('SELECT lot FROM lots WHERE id = ?').bind(req.lot_id).first();
    if (!lot || lot.lot !== req.old_lot) {
      return json({ error: 'Lot นี้ถูกแก้ไขหรือรวมไปแล้วหลังจากแจ้ง กรุณาปฏิเสธรายการนี้' }, 409);
    }
    const r = await correctLot(env, { lotId: req.lot_id, newLot: req.new_lot, labelExpiry: req.label_expiry, by: `${by} (อนุมัติจากที่ ${req.by} แจ้ง)` });
    if (!r.ok) return json({ error: r.error }, 400);
    await env.DB.prepare(
      "UPDATE lot_fix_requests SET status = 'APPROVED', decided_by = ?, decided_at = ?, result = ? WHERE id = ?"
    ).bind(by, at, r.detail, req.id).run();
    return json({ ...r, decision: 'approve' });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
