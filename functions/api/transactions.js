import { requirePerm, json } from './_lib.js';

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM transactions').all();
    return json(results);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// PUT — correct a past RECEIVE/ISSUE/ADJUST record's quantity or reference
// (perm: manage; admin + supervisor). Applies the qty delta directly to the
// linked lot's current balance so stock stays consistent with the correction.
export async function onRequestPut(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { id, qty, ref } = await request.json();
    if (!id || qty === undefined) return json({ error: 'Missing required fields' }, 400);
    const newQty = +qty;
    if (isNaN(newQty) || newQty === 0) return json({ error: 'Quantity must be a non-zero number' }, 400);

    const txn = await env.DB.prepare('SELECT * FROM transactions WHERE id = ?').bind(id).first();
    if (!txn) return json({ error: 'ไม่พบรายการนี้' }, 404);
    const lot = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(txn.lot_id).first();
    if (!lot) return json({ error: 'ไม่พบ Lot ที่เชื่อมโยงกับรายการนี้' }, 404);

    const delta = newQty - txn.qty;
    const newLotQty = lot.qty + delta;
    if (newLotQty < 0) {
      return json({ error: `แก้ไขไม่ได้ — จะทำให้คงเหลือใน Lot ติดลบ (${newLotQty})` }, 400);
    }

    const newStatus = newLotQty === 0 ? 'DEPLETED' : 'ACTIVE';
    await env.DB.batch([
      env.DB.prepare('UPDATE transactions SET qty = ?, bal = ?, ref = ? WHERE id = ?')
        .bind(newQty, newLotQty, ref !== undefined ? ref : txn.ref, id),
      env.DB.prepare('UPDATE lots SET qty = ?, status = ? WHERE id = ?')
        .bind(newLotQty, newStatus, txn.lot_id)
    ]);

    return json({
      success: true,
      txn: { id: +id, qty: newQty, bal: newLotQty, ref: ref !== undefined ? ref : txn.ref },
      lot: { id: txn.lot_id, qty: newLotQty, status: newStatus }
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE — clear all movement history and reset lot balances (admin only; irreversible)
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;
  try {
    await context.env.DB.prepare('DELETE FROM transactions').run();
    await context.env.DB.prepare("UPDATE lots SET qty = recv, status = 'ACTIVE'").run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
