export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    const { rid, qty, scan, ref, lotId, by } = body;

    if (!rid || !qty || !scan || !by) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const numRid = +rid;
    const numQty = +qty;
    if (isNaN(numQty) || numQty <= 0) {
      return new Response(JSON.stringify({ error: "Quantity must be a positive number" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Fetch available lots
    let query = "SELECT * FROM lots WHERE rid = ? AND qty > 0 AND status = 'ACTIVE'";
    let params = [numRid];

    if (lotId) {
      query += " AND id = ?";
      params.push(+lotId);
    } else {
      query += " ORDER BY expiry ASC"; // FEFO order
    }

    const { results: availableLots } = await env.DB.prepare(query).bind(...params).all();

    // 2. Calculate allocation
    let remainingToTake = numQty;
    const allocation = [];

    for (const lot of availableLots) {
      if (remainingToTake <= 0) break;
      const take = Math.min(remainingToTake, lot.qty);
      allocation.push({
        lotId: lot.id,
        lot: lot.lot,
        expiry: lot.expiry,
        take: take,
        after: lot.qty - take
      });
      remainingToTake -= take;
    }

    if (remainingToTake > 0) {
      return new Response(JSON.stringify({ error: `สินค้าในคลังไม่เพียงพอสำหรับเบิกจ่าย (ขาดอีก ${remainingToTake})` }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 3. Apply database updates (sequential)
    const now = new Date();
    const dateStr = `2026-06-29 ${now.toTimeString().slice(0, 5)}`; // Match mock year 2026
    const transactionResults = [];
    const updatedLotsResults = [];

    for (const alloc of allocation) {
      // Update lot qty and status
      const newStatus = alloc.after === 0 ? "DEPLETED" : "ACTIVE";
      await env.DB.prepare(
        "UPDATE lots SET qty = ?, status = ? WHERE id = ?"
      ).bind(alloc.after, newStatus, alloc.lotId).run();

      updatedLotsResults.push({
        id: alloc.lotId,
        qty: alloc.after,
        status: newStatus
      });

      // Insert transaction log
      const refLabel = ref || (lotId ? `เบิกตรง Lot ${alloc.lot}` : "เบิกจ่าย (FEFO)");
      const txnResult = await env.DB.prepare(
        `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at) 
         VALUES (?, ?, 'ISSUE', ?, ?, ?, ?, ?, ?)`
      ).bind(alloc.lotId, numRid, -alloc.take, alloc.after, refLabel, scan, by, dateStr).run();

      transactionResults.push({
        id: txnResult.meta.last_row_id,
        lotId: alloc.lotId,
        rid: numRid,
        type: 'ISSUE',
        qty: -alloc.take,
        bal: alloc.after,
        ref: refLabel,
        scan,
        by,
        at: dateStr
      });
    }

    return new Response(JSON.stringify({
      success: true,
      updatedLots: updatedLotsResults,
      newTransactions: transactionResults
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
