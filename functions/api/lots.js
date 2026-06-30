export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT * FROM lots").all();
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  try {
    const body = await request.json();
    const { rid, lot, expiry, qty, loc, by } = body;

    if (!rid || !lot || !expiry || !qty || !loc || !by) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const numQty = +qty;
    if (isNaN(numQty) || numQty <= 0) {
      return new Response(JSON.stringify({ error: "Quantity must be a positive number" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 1. Get supplier name of reagent for transaction reference
    const reagent = await env.DB.prepare("SELECT supplier FROM reagents WHERE id = ?").bind(rid).first();
    const supplierRef = reagent && reagent.supplier ? `รับจาก ${reagent.supplier}` : "รับเข้าใหม่";

    // 2. Insert into lots
    const qrCode = `QR-${lot}`;
    const lotResult = await env.DB.prepare(
      `INSERT INTO lots (rid, lot, expiry, recv, qty, loc, qr, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`
    ).bind(rid, lot, expiry, numQty, numQty, loc, qrCode).run();

    const lotId = lotResult.meta.last_row_id;

    // 3. Insert into transactions
    const now = new Date();
    const dateStr = `2026-06-29 ${now.toTimeString().slice(0, 5)}`; // Anchor year to 2026 as per mock app specs
    
    await env.DB.prepare(
      `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at) 
       VALUES (?, ?, 'RECEIVE', ?, ?, ?, 'MANUAL', ?, ?)`
    ).bind(lotId, rid, numQty, numQty, supplierRef, by, dateStr).run();

    const newLotObj = {
      id: lotId,
      rid,
      lot,
      expiry,
      recv: numQty,
      qty: numQty,
      loc,
      qr: qrCode,
      status: 'ACTIVE'
    };

    return new Response(JSON.stringify(newLotObj), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
