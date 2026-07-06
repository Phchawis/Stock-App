import { requirePerm, actorName, nowStr, json } from '../_lib.js';

export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { lotId, qty, reason } = await request.json();
    if (!lotId || qty === undefined || !reason) {
      return json({ error: 'Missing required fields' }, 400);
    }
    const numQty = +qty;
    if (isNaN(numQty) || numQty <= 0) {
      return json({ error: 'Quantity must be a positive number' }, 400);
    }

    const lot = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(lotId).first();
    if (!lot) return json({ error: 'ไม่พบ Lot นี้' }, 404);

    if (lot.qty < numQty) {
      return json({ error: `ไม่สามารถตัดจำหน่ายได้เนื่องจากจำนวนคงเหลือไม่พอ (คงเหลือ ${lot.qty})` }, 400);
    }

    const newLotQty = lot.qty - numQty;
    const newStatus = newLotQty === 0 ? 'DEPLETED' : 'ACTIVE';
    const by = await actorName(context);
    const at = nowStr();
    const ref = `ตัดจำหน่าย: ${reason}`;

    const batchRes = await env.DB.batch([
      env.DB.prepare('UPDATE lots SET qty = ?, status = ? WHERE id = ?').bind(newLotQty, newStatus, lotId),
      env.DB.prepare(
        `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
         VALUES (?, ?, 'DISPOSE', ?, ?, ?, 'MANUAL', ?, ?)`
      ).bind(lotId, lot.rid, -numQty, newLotQty, ref, by, at)
    ]);

    const txnId = batchRes[1].meta.last_row_id || Date.now();

    return json({
      success: true,
      lot: { id: lotId, qty: newLotQty, status: newStatus },
      txn: {
        id: txnId,
        lotId: +lotId,
        rid: lot.rid,
        type: 'DISPOSE',
        qty: -numQty,
        bal: newLotQty,
        ref,
        scan: 'MANUAL',
        by,
        at
      }
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
