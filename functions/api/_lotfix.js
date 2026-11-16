import { expiryProblem, nowStr } from './_lib.js';

// Corrects a lot recorded under the wrong number, using what is printed on
// the box: `newLot` and `labelExpiry`. Two cases, chosen here rather than by
// the person at the shelf:
//
//   rename  no other lot of the reagent has `newLot`. The lot keeps its id,
//           so its balance and every movement go with it; its QR becomes
//           QR-{newLot}, so the boxes need new stickers.
//   merge   the reagent already has a lot `newLot`: one manufacturer batch
//           recorded twice (8441UD00 beside 84441UD00). The wrong lot's
//           balance, total received and movements move to the right one, the
//           running balance is recomputed in date order, and the empty wrong
//           lot is deleted.
//
// Not a stock count adjustment. Counting the wrong lot as 0 and the right one
// as +2 would log a loss and a gain that never happened and leave the boxes'
// receipts under the wrong number.
//
// Returns { ok: true, action, lot, removedLotId?, detail } or { ok: false, error }.
export async function correctLot(env, { lotId, newLot, labelExpiry, by }) {
  const lot = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(lotId).first();
  if (!lot) return { ok: false, error: 'ไม่พบ Lot นี้ในระบบแล้ว อาจถูกแก้ไขไปก่อนหน้า' };
  const name = String(newLot || '').trim();
  if (!name) return { ok: false, error: 'กรุณากรอกเลข Lot ตามฉลาก' };
  if (name === lot.lot) return { ok: false, error: 'เลข Lot เหมือนเดิม ไม่มีอะไรต้องแก้' };
  const badExpiry = expiryProblem(labelExpiry);
  if (badExpiry) return { ok: false, error: badExpiry };

  const reagent = await env.DB.prepare('SELECT th FROM reagents WHERE id = ?').bind(lot.rid).first();
  const rname = reagent ? reagent.th : `#${lot.rid}`;
  const at = nowStr();
  const target = await env.DB.prepare('SELECT * FROM lots WHERE rid = ? AND lot = ? AND id <> ?')
    .bind(lot.rid, name, lot.id).first();

  if (target) {
    // Same batch means same expiry. If the label, the wrong lot and the right
    // lot don't all agree, these may be two real batches: stop and let a
    // person look, rather than fold one into the other.
    if (target.expiry !== labelExpiry || lot.expiry !== labelExpiry) {
      return {
        ok: false,
        error: `รวมไม่ได้: วันหมดอายุไม่ตรงกัน (ฉลาก ${labelExpiry}, Lot ${lot.lot} ในระบบ ${lot.expiry}, Lot ${target.lot} ในระบบ ${target.expiry}) อาจเป็นคนละ Lot กรุณาตรวจฉลากอีกครั้ง`,
      };
    }
    const detail = `รวม Lot ${rname} ${lot.lot} เข้ากับ Lot ${target.lot} (ฉลาก ${name}, หมดอายุ ${labelExpiry}) ย้ายคงเหลือ ${lot.qty} และประวัติการเคลื่อนไหว`;
    const t = target.id, w = lot.id;
    await env.DB.batch([
      env.DB.prepare(
        `UPDATE lots SET qty = qty + ?, recv = recv + ?,
                status = CASE WHEN qty + ? > 0 THEN 'ACTIVE' ELSE 'DEPLETED' END
          WHERE id = ?`
      ).bind(lot.qty, lot.recv, lot.qty, t),
      env.DB.prepare('UPDATE transactions SET lot_id = ? WHERE lot_id = ?').bind(t, w),
      env.DB.prepare(
        `UPDATE transactions
            SET bal = (SELECT SUM(t2.qty) FROM transactions t2
                        WHERE t2.lot_id = ? AND (t2.at < transactions.at OR (t2.at = transactions.at AND t2.id <= transactions.id)))
          WHERE lot_id = ?`
      ).bind(t, t),
      env.DB.prepare('DELETE FROM lots WHERE id = ? AND NOT EXISTS (SELECT 1 FROM transactions WHERE lot_id = ?)').bind(w, w),
      env.DB.prepare("INSERT INTO system_events (kind, detail, context, by, at) VALUES ('LOT_CORRECTED', ?, 'stock_count', ?, ?)")
        .bind(detail, by, at),
    ]);
    const merged = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(t).first();
    return { ok: true, action: 'merge', lot: merged, removedLotId: w, detail };
  }

  // Rename. The qr column is unique across all reagents; another reagent may
  // already use QR-{newLot}, in which case this lot gets a suffix.
  let qr = `QR-${name}`;
  const qrTaken = await env.DB.prepare('SELECT 1 FROM lots WHERE qr = ? AND id <> ?').bind(qr, lot.id).first();
  if (qrTaken) qr = `${qr}-${Date.now().toString(36)}`;
  const expiryNote = labelExpiry !== lot.expiry ? ` และวันหมดอายุจาก ${lot.expiry} เป็น ${labelExpiry}` : '';
  const detail = `แก้เลข Lot ${rname} จาก ${lot.lot} เป็น ${name} ตามฉลาก${expiryNote}`;
  const [upd] = await env.DB.batch([
    // Guarded on the old number, so two people correcting the same lot at
    // once can't both apply.
    env.DB.prepare('UPDATE lots SET lot = ?, qr = ?, expiry = ? WHERE id = ? AND lot = ?')
      .bind(name, qr, labelExpiry, lot.id, lot.lot),
    env.DB.prepare(
      "INSERT INTO system_events (kind, detail, context, by, at) SELECT 'LOT_CORRECTED', ?, 'stock_count', ?, ? WHERE EXISTS (SELECT 1 FROM lots WHERE id = ? AND lot = ?)"
    ).bind(detail, by, at, lot.id, name),
  ]);
  if (!(upd.meta && upd.meta.changes > 0)) return { ok: false, error: 'Lot นี้ถูกแก้ไขไปก่อนหน้าแล้ว กรุณาโหลดหน้าใหม่' };
  const renamed = await env.DB.prepare('SELECT * FROM lots WHERE id = ?').bind(lot.id).first();
  return { ok: true, action: 'rename', lot: renamed, detail };
}
