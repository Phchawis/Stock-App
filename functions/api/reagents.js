import { requirePerm, json, actorName, nowStr } from './_lib.js';

export async function onRequestGet(context) {
  try {
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS alert_acks (
        key TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        at TEXT NOT NULL,
        by TEXT NOT NULL
      )
    `).run();
    const { results } = await context.env.DB.prepare('SELECT * FROM reagents').all();
    const mapped = results.map((r) => ({
      id: r.id, code: r.code, th: r.th, en: r.en, cat: r.cat, unit: r.unit,
      subUnit: r.subUnit || '', testsPerUnit: r.testsPerUnit, storage: r.storage,
      min: r.min_qty, reorder: r.reorder_qty, supplier: r.supplier, img: r.img,
      sdsFile: r.sds_file || '', sdsUrl: r.sds_url || '', sdsSource: r.sds_source || ''
    }));
    return json(mapped);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST — register a reagent (perm: manage)
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const b = await request.json();
    const { code, th, en, cat, unit, subUnit, testsPerUnit, storage, min, reorder, supplier, img } = b;
    if (!th || !cat || !unit || !storage || min === undefined) {
      return json({ error: 'Missing required fields' }, 400);
    }
    const result = await env.DB.prepare(
      `INSERT INTO reagents (code, th, en, cat, unit, subUnit, testsPerUnit, storage, min_qty, reorder_qty, supplier, img)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      code, th, en || th, cat, unit, subUnit || '', testsPerUnit || null, storage,
      min, reorder !== undefined ? reorder : min, supplier || 'i-med', img || '/reagent_placeholder.png'
    ).run();

    return json({
      id: result.meta.last_row_id,
      code, th, en: en || th, cat, unit, subUnit: subUnit || '', testsPerUnit: testsPerUnit || null,
      storage, min, reorder: reorder !== undefined ? reorder : min, supplier: supplier || 'i-med', img: img || '/reagent_placeholder.png'
    }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// PUT — edit a reagent (perm: manage)
export async function onRequestPut(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const b = await request.json();
    const { id, th, en, cat, unit, subUnit, testsPerUnit, storage, min, reorder, supplier, img } = b;
    if (!id || !th || !cat || !unit || !storage || min === undefined) {
      return json({ error: 'Missing required fields' }, 400);
    }
    await env.DB.prepare(
      `UPDATE reagents
       SET th = ?, en = ?, cat = ?, unit = ?, subUnit = ?, testsPerUnit = ?, storage = ?, min_qty = ?, reorder_qty = ?, supplier = ?, img = ?
       WHERE id = ?`
    ).bind(
      th, en || th, cat, unit, subUnit || '', testsPerUnit || null, storage,
      min, reorder !== undefined ? reorder : min, supplier, img || '/reagent_placeholder.png', id
    ).run();
    return json({ success: true, id });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE — remove a reagent + its lots/transactions (admin only; destructive cascade)
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const id = new URL(request.url).searchParams.get('id');
    if (!id) return json({ error: 'Missing reagent id' }, 400);

    // Fetch reagent info before deletion to log it
    const reagent = await env.DB.prepare('SELECT code, th, unit FROM reagents WHERE id = ?').bind(id).first();
    if (!reagent) return json({ error: 'ไม่พบน้ำยานี้ในระบบ' }, 404);

    // Stock on the shelf outlives the catalogue row. Deleting a reagent that
    // still has quantity leaves bottles in the fridge that the system no longer
    // knows about — no expiry alert, no FEFO, nothing to count against. Summed
    // over every lot regardless of status, because a positive quantity is stock
    // whatever the row says about itself.
    const stock = await env.DB.prepare(
      'SELECT IFNULL(SUM(qty), 0) AS onHand FROM lots WHERE rid = ?'
    ).bind(id).first();
    if ((stock && stock.onHand) > 0) {
      return json({
        error: `${reagent.th} ยังมีคงเหลือ ${stock.onHand} ${reagent.unit} ในคลัง — ต้องเบิกจ่ายหรือตัดจำหน่ายให้หมดก่อนจึงจะลบได้`
      }, 409);
    }

    // Counted before the delete so the record can say what went with it.
    const counts = await env.DB.prepare(
      `SELECT (SELECT COUNT(*) FROM lots WHERE rid = ?) AS lotCount,
              (SELECT COUNT(*) FROM transactions WHERE rid = ?) AS txnCount`
    ).bind(id, id).first();

    const actor = await actorName(context);
    const timestamp = nowStr();

    await env.DB.batch([
      env.DB.prepare('DELETE FROM transactions WHERE rid = ?').bind(id),
      env.DB.prepare('DELETE FROM lots WHERE rid = ?').bind(id),
      env.DB.prepare('DELETE FROM reagents WHERE id = ?').bind(id),
      // Removing a catalogue entry is an administrative act, not a stock
      // movement: no lot, no quantity. It used to be forced into `transactions`
      // with lot_id = 0 and rid = 0, which violated both foreign keys and
      // failed the whole batch every time. How much history went with it is
      // part of the record — that is the number nobody can recover afterwards.
      env.DB.prepare(
        `INSERT INTO system_events (kind, detail, context, by, at)
         VALUES ('REAGENT_DELETED', ?, ?, ?, ?)`
      ).bind(
        `${reagent.code} · ${reagent.th}`,
        `ลบพร้อมล็อต ${counts.lotCount} รายการ และประวัติการเคลื่อนไหว ${counts.txnCount} รายการ`,
        actor, timestamp
      )
    ]);
    return json({
      success: true, id: Number(id),
      removedLots: counts.lotCount, removedTxns: counts.txnCount,
    });
  } catch (err) {
    return json({ error: 'ลบไม่สำเร็จ: ' + err.message }, 500);
  }
}

// PATCH — set or clear a reagent's SDS link (perm: manage).
// Separate from the full PUT because filling in Drive links is its own task,
// often done in bulk, and must not require re-sending every catalogue field.
export async function onRequestPatch(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  const { env, request } = context;
  try {
    const { id, sdsUrl, sdsFile } = await request.json();
    if (!id) return json({ error: 'Missing reagent id' }, 400);

    const url = (sdsUrl || '').trim();
    // Only ever store an http(s) link. A `javascript:` or `data:` URL here would
    // execute the moment somebody opened the document from the reagent page.
    if (url && !/^https?:\/\//i.test(url)) {
      return json({ error: 'ลิงก์ต้องขึ้นต้นด้วย http:// หรือ https:// เท่านั้น' }, 400);
    }

    const sets = ['sds_url = ?'];
    const binds = [url || null];
    if (sdsFile !== undefined) { sets.push('sds_file = ?'); binds.push((sdsFile || '').trim() || null); }
    binds.push(id);

    const res = await env.DB.prepare(`UPDATE reagents SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run();
    if (!res.meta || res.meta.changes === 0) return json({ error: 'ไม่พบน้ำยานี้' }, 404);
    return json({ success: true, id: +id, sdsUrl: url });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
