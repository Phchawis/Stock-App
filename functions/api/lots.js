import { requirePerm, actorName, nowStr, json, expiryProblem } from './_lib.js';

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
    const badExpiry = expiryProblem(expiry);
    if (badExpiry) return json({ error: badExpiry }, 400);

    const reagent = await env.DB.prepare('SELECT supplier FROM reagents WHERE id = ?').bind(rid).first();
    const supplierRef = reagent && reagent.supplier ? `รับจาก ${reagent.supplier}` : 'รับเข้าใหม่';
    const by = await actorName(context);           // trust the session, not the client

    // Same reagent + same lot number = the same manufacturer batch (identical
    // expiry), so receiving it again merges into the existing lot record rather
    // than creating a second row. That is the correct FEFO behaviour, and it
    // revives a fully-issued (DEPLETED) lot when its number is re-received.
    //
    // The receipt is one batch, and D1 runs a batch as one transaction with no
    // other request in between:
    //   1. create the lot, empty, only if this reagent has no such lot yet;
    //   2. add the quantity to it relatively (qty = qty + ?);
    //   3. log the movement with `bal` read from the row just written.
    // The previous version read the lot, worked out the new total in the
    // Worker, and wrote that total back. Two submits of one receipt (a double
    // click on บันทึกรับเข้า) both read the same starting quantity, so the
    // second write erased the first: two RECEIVE rows in the log, one in the
    // stock. That happened to Methanol lot 36090526 on 2026-07-28.
    //
    // The QR code is normally QR-{lot}, but the `qr` column is unique across
    // all reagents; when another reagent already holds that string the new lot
    // gets a suffix. Scanning by the lot number still finds it (the scanner
    // matches qr OR lot). The check runs inside step 1, so it sees any lot a
    // just-finished request created.
    const at = nowStr();
    const baseQr = `QR-${lot}`;
    const altQr = `${baseQr}-${Date.now().toString(36)}`;
    const [created] = await env.DB.batch([
      env.DB.prepare(
        `INSERT INTO lots (rid, lot, expiry, recv, qty, loc, qr, status)
         SELECT ?, ?, ?, 0, 0, ?, CASE WHEN EXISTS (SELECT 1 FROM lots WHERE qr = ?) THEN ? ELSE ? END, 'DEPLETED'
          WHERE NOT EXISTS (SELECT 1 FROM lots WHERE rid = ? AND lot = ?)`
      ).bind(rid, lot, expiry, loc, baseQr, altQr, baseQr, rid, lot),
      env.DB.prepare(
        `UPDATE lots SET qty = qty + ?, recv = recv + ?, expiry = ?, loc = ?, status = 'ACTIVE'
          WHERE rid = ? AND lot = ?`
      ).bind(numQty, numQty, expiry, loc, rid, lot),
      env.DB.prepare(
        `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
         SELECT id, rid, 'RECEIVE', ?, qty, ?, 'MANUAL', ?, ? FROM lots WHERE rid = ? AND lot = ?`
      ).bind(numQty, supplierRef, by, at, rid, lot),
    ]);

    const row = await env.DB.prepare('SELECT * FROM lots WHERE rid = ? AND lot = ?').bind(rid, lot).first();
    const merged = !(created.meta && created.meta.changes > 0);
    return json({ ...row, merged }, merged ? 200 : 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// PUT — correct an existing lot's qty/expiry/location (perm: manage; admin + supervisor).
// A qty change auto-logs an ADJUST transaction so the audit trail still reflects the correction.
export async function onRequestPut(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { id, expiry, qty, loc, lot } = await request.json();
    if (!id || !expiry || qty === undefined || !loc) {
      return json({ error: 'Missing required fields' }, 400);
    }
    const numQty = +qty;
    if (isNaN(numQty) || numQty < 0) return json({ error: 'Quantity must be zero or a positive number' }, 400);
    const badExpiry = expiryProblem(expiry);
    if (badExpiry) return json({ error: badExpiry }, 400);

    const existing = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(id).first();
    if (!existing) return json({ error: 'ไม่พบ Lot นี้' }, 404);

    // Correcting a mistyped lot number. `lot` is optional so existing callers
    // that only edit expiry/qty/loc keep working unchanged.
    let newLot = existing.lot;
    let newQr = existing.qr;
    if (lot !== undefined && String(lot).trim() && String(lot).trim() !== existing.lot) {
      newLot = String(lot).trim();
      // (reagent, lot) must stay unique — receiving merges on that pair, so a
      // duplicate would make two rows silently compete for the same batch.
      const clash = await env.DB.prepare('SELECT id FROM lots WHERE rid = ? AND lot = ? AND id != ?')
        .bind(existing.rid, newLot, id).first();
      if (clash) {
        return json({ error: `มี Lot "${newLot}" ของน้ำยาตัวนี้อยู่แล้ว กรุณาตรวจสอบเลข Lot อีกครั้ง` }, 400);
      }
      // Keep the QR in step with the lot number, falling back to a unique
      // suffix if another reagent already owns that QR string.
      newQr = `QR-${newLot}`;
      const qrTaken = await env.DB.prepare('SELECT id FROM lots WHERE qr = ? AND id != ?').bind(newQr, id).first();
      if (qrTaken) newQr = `QR-${newLot}-${Date.now().toString(36)}`;
    }

    const newStatus = numQty === 0 ? 'DEPLETED' : 'ACTIVE';
    // On-hand can never exceed total-ever-received. Adjusting a lot upward past
    // its recorded `recv` would break that invariant, and "ล้างประวัติทั้งหมด"
    // (which resets qty = recv) would then silently shrink the lot back down.
    const newRecv = Math.max(existing.recv, numQty);
    await env.DB.prepare('UPDATE lots SET lot = ?, qr = ?, expiry = ?, qty = ?, recv = ?, loc = ?, status = ? WHERE id = ?')
      .bind(newLot, newQr, expiry, numQty, newRecv, loc, newStatus, id).run();

    let txn = null;
    const delta = numQty - existing.qty;
    if (delta !== 0) {
      const by = await actorName(context);
      const at = nowStr();
      const result = await env.DB.prepare(
        `INSERT INTO transactions (lot_id, rid, type, qty, bal, ref, scan, by, at)
         VALUES (?, ?, 'ADJUST', ?, ?, ?, 'MANUAL', ?, ?)`
      ).bind(id, existing.rid, delta, numQty, 'ปรับปรุงคงคลังโดยผู้ดูแลระบบ/หัวหน้าคลัง', by, at).run();
      txn = { id: result.meta.last_row_id, lotId: +id, rid: existing.rid, type: 'ADJUST', qty: delta, bal: numQty, ref: 'ปรับปรุงคงคลังโดยผู้ดูแลระบบ/หัวหน้าคลัง', scan: 'MANUAL', by, at };
    }

    return json({ success: true, lot: { id: +id, lot: newLot, qr: newQr, expiry, qty: numQty, recv: newRecv, loc, status: newStatus }, txn });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
