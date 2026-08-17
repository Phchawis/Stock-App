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

    // 3. Apply.
    //
    // Steps 1–2 read the balances and computed new ones from them. If a second
    // person issues the same reagent in that gap, both requests read the same
    // starting quantity and both write their own absolute result — the second
    // write silently erases the first, and the lab dispenses more than the
    // system ever records. On a shared-counter system that is a real scenario,
    // and it leaves no trace: every screen still looks correct afterwards.
    //
    // So the write is relative (`qty = qty - ?`) and guarded (`WHERE qty >= ?`).
    // Relative means concurrent issues subtract from each other instead of
    // overwriting; the guard means a lot that someone else already drained
    // updates zero rows rather than going negative. D1 runs a batch as one
    // transaction, so all lots move together or not at all.
    const by = await actorName(context);           // trust the session, not the client
    const at = nowStr();
    const refLabel = ref || (lotId ? `เบิกตรง Lot ${allocation[0].lot}` : 'เบิกจ่าย (FEFO)');

    const guardedUpdates = allocation.map((a) =>
      env.DB.prepare(
        `UPDATE lots
            SET qty = qty - ?,
                status = CASE WHEN qty - ? <= 0 THEN 'DEPLETED' ELSE 'ACTIVE' END
          WHERE id = ? AND qty >= ?`
      ).bind(a.take, a.take, a.lotId, a.take)
    );
    const updateResults = await env.DB.batch(guardedUpdates);

    // A zero-row update means the guard rejected it: the stock went away between
    // our read and our write. Undo whatever did apply and ask for a retry rather
    // than recording an issue that the shelf can't back.
    const applied = updateResults.map((r) => (r.meta ? r.meta.changes : 0) === 1);
    if (applied.some((ok) => !ok)) {
      const rollback = allocation
        .filter((_, i) => applied[i])
        .map((a) =>
          env.DB.prepare("UPDATE lots SET qty = qty + ?, status = 'ACTIVE' WHERE id = ?")
            .bind(a.take, a.lotId)
        );
      if (rollback.length) await env.DB.batch(rollback);
      return json({
        error: 'มีผู้ใช้อื่นเบิกน้ำยาตัวนี้ตัดหน้าไปพอดี ยอดคงเหลือเปลี่ยนแล้ว กรุณาตรวจสอบยอดและทำรายการใหม่อีกครั้ง'
      }, 409);
    }

    // Log the movements. `bal` is read from the row inside the same statement,
    // so it records the balance that actually resulted from this issue rather
    // than the one predicted before the write.
    await env.DB.batch(allocation.map((a) =>
      env.DB.prepare(
        `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
         SELECT ?, ?, 'ISSUE', ?, qty, ?, ?, ?, ? FROM lots WHERE id = ?`
      ).bind(a.lotId, numRid, -a.take, refLabel, scan, by, at, a.lotId)
    ));

    // Read back the committed state so the client renders what the database
    // actually holds, not what this request assumed it would hold.
    const ids = allocation.map((a) => a.lotId);
    const placeholders = ids.map(() => '?').join(',');
    const { results: freshLots } = await env.DB
      .prepare(`SELECT id, qty, status FROM lots WHERE id IN (${placeholders})`).bind(...ids).all();
    const { results: freshTxns } = await env.DB
      .prepare(
        `SELECT id, lot_id AS lotId, rid, type, qty, bal, ref, scan, by, at
           FROM transactions
          WHERE at = ? AND type = 'ISSUE' AND lot_id IN (${placeholders})
          ORDER BY id DESC LIMIT ?`
      ).bind(at, ...ids, ids.length).all();

    return json({ success: true, updatedLots: freshLots, newTransactions: freshTxns });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
