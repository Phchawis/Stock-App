import { requirePerm, actorName, nowStr, json } from './_lib.js';

// POST — issue stock (FEFO or a specific lot). perm: issue
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'issue' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { rid, qty, scan, ref, lotId } = await request.json();
    if (!rid || !qty || !scan) return json({ error: 'Missing required fields' }, 400);

    const numRid = +rid;
    const numQty = +qty;
    if (isNaN(numQty) || numQty <= 0) return json({ error: 'Quantity must be a positive number' }, 400);

    // 1. Fetch available lots (specific lot, or all in FEFO order)
    let query = "SELECT * FROM lots WHERE rid = ? AND qty > 0 AND status = 'ACTIVE'";
    const params = [numRid];
    if (lotId) { query += ' AND id = ?'; params.push(+lotId); }
    else { query += ' ORDER BY expiry ASC'; }
    const { results: availableLots } = await env.DB.prepare(query).bind(...params).all();

    // 2. Allocate
    let remaining = numQty;
    const allocation = [];
    for (const lot of availableLots) {
      if (remaining <= 0) break;
      const take = Math.min(remaining, lot.qty);
      allocation.push({ lotId: lot.id, lot: lot.lot, take, after: lot.qty - take });
      remaining -= take;
    }
    if (remaining > 0) {
      return json({ error: `สินค้าในคลังไม่เพียงพอสำหรับเบิกจ่าย (ขาดอีก ${remaining})` }, 400);
    }

    // 3. Apply
    const by = await actorName(context);           // trust the session, not the client
    const at = nowStr();
    const updatedLots = [];
    const newTransactions = [];
    for (const alloc of allocation) {
      const newStatus = alloc.after === 0 ? 'DEPLETED' : 'ACTIVE';
      await env.DB.prepare('UPDATE lots SET qty = ?, status = ? WHERE id = ?')
        .bind(alloc.after, newStatus, alloc.lotId).run();
      updatedLots.push({ id: alloc.lotId, qty: alloc.after, status: newStatus });

      const refLabel = ref || (lotId ? `เบิกตรง Lot ${alloc.lot}` : 'เบิกจ่าย (FEFO)');
      const txn = await env.DB.prepare(
        `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
         VALUES (?, ?, 'ISSUE', ?, ?, ?, ?, ?, ?)`
      ).bind(alloc.lotId, numRid, -alloc.take, alloc.after, refLabel, scan, by, at).run();
      newTransactions.push({
        id: txn.meta.last_row_id, lotId: alloc.lotId, rid: numRid, type: 'ISSUE',
        qty: -alloc.take, bal: alloc.after, ref: refLabel, scan, by, at
      });
    }

    return json({ success: true, updatedLots, newTransactions });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
