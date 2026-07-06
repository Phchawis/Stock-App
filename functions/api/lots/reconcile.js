import { requirePerm, actorName, nowStr, json } from '../_lib.js';

export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { items } = await request.json();
    if (!items || !Array.isArray(items)) {
      return json({ error: 'Items array is required' }, 400);
    }

    const by = await actorName(context);
    const at = nowStr();
    const queries = [];
    const updatedLots = [];

    for (const item of items) {
      const { lotId, qty, reason } = item;
      if (!lotId || qty === undefined) continue;

      const numQty = +qty;
      if (isNaN(numQty) || numQty < 0) continue;

      const lot = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(lotId).first();
      if (!lot) continue;

      const delta = numQty - lot.qty;
      if (delta === 0) continue; // no change

      const newStatus = numQty === 0 ? 'DEPLETED' : 'ACTIVE';
      const ref = reason ? `ตรวจนับคลัง: ${reason}` : 'ตรวจนับคลังประจำช่วงเวลา';

      queries.push(
        env.DB.prepare('UPDATE lots SET qty = ?, status = ? WHERE id = ?').bind(numQty, newStatus, lotId)
      );
      queries.push(
        env.DB.prepare(
          `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
           VALUES (?, ?, 'ADJUST', ?, ?, ?, 'MANUAL', ?, ?)`
        ).bind(lotId, lot.rid, delta, numQty, ref, by, at)
      );

      updatedLots.push({ id: lotId, qty: numQty, status: newStatus });
    }

    if (queries.length > 0) {
      await env.DB.batch(queries);
    }

    return json({
      success: true,
      updatedLots
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
