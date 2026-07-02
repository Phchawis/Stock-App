import { requirePerm, actorName, nowStr, json } from './_lib.js';

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM lots').all();
    return json(results);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST — receive stock into a new lot (perm: receive)
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'receive' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { rid, lot, expiry, qty, loc } = await request.json();
    if (!rid || !lot || !expiry || !qty || !loc) {
      return json({ error: 'Missing required fields' }, 400);
    }
    const numQty = +qty;
    if (isNaN(numQty) || numQty <= 0) return json({ error: 'Quantity must be a positive number' }, 400);

    const reagent = await env.DB.prepare('SELECT supplier FROM reagents WHERE id = ?').bind(rid).first();
    const supplierRef = reagent && reagent.supplier ? `รับจาก ${reagent.supplier}` : 'รับเข้าใหม่';
    const by = await actorName(context);           // trust the session, not the client
    const qrCode = `QR-${lot}`;

    const lotResult = await env.DB.prepare(
      `INSERT INTO lots (rid, lot, expiry, recv, qty, loc, qr, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`
    ).bind(rid, lot, expiry, numQty, numQty, loc, qrCode).run();

    const lotId = lotResult.meta.last_row_id;
    await env.DB.prepare(
      `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
       VALUES (?, ?, 'RECEIVE', ?, ?, ?, 'MANUAL', ?, ?)`
    ).bind(lotId, rid, numQty, numQty, supplierRef, by, nowStr()).run();

    return json({ id: lotId, rid, lot, expiry, recv: numQty, qty: numQty, loc, qr: qrCode, status: 'ACTIVE' }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
