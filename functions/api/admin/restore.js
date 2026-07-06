import { requirePerm, json } from '../_lib.js';

export async function onRequestPost(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;

  const { env, request } = context;
  try {
    const backup = await request.json();
    if (!backup || backup.version === undefined) {
      return json({ error: 'ไฟล์สำรองข้อมูลไม่ถูกต้องหรือไม่รองรับ' }, 400);
    }

    const queries = [];

    // Clear existing data (in order of foreign key dependency)
    queries.push(env.DB.prepare('DELETE FROM transactions'));
    queries.push(env.DB.prepare('DELETE FROM lots'));
    queries.push(env.DB.prepare('DELETE FROM reagents'));
    queries.push(env.DB.prepare('DELETE FROM permissions'));
    queries.push(env.DB.prepare('DELETE FROM sessions')); // Clear old sessions
    queries.push(env.DB.prepare('DELETE FROM users'));

    // Restore Reagents
    if (Array.isArray(backup.reagents)) {
      for (const r of backup.reagents) {
        queries.push(
          env.DB.prepare(
            `INSERT INTO reagents (id, code, th, en, cat, unit, subUnit, testsPerUnit, storage, min_qty, reorder_qty, supplier, img)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(r.id, r.code, r.th, r.en, r.cat, r.unit, r.subUnit || null, r.testsPerUnit || null, r.storage, r.min_qty ?? 0, r.reorder_qty ?? 0, r.supplier, r.img)
        );
      }
    }

    // Restore Lots
    if (Array.isArray(backup.lots)) {
      for (const l of backup.lots) {
        queries.push(
          env.DB.prepare(
            `INSERT INTO lots (id, rid, lot, expiry, recv, qty, loc, qr, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(l.id, l.rid, l.lot, l.expiry, l.recv, l.qty, l.loc, l.qr, l.status)
        );
      }
    }

    // Restore Transactions
    if (Array.isArray(backup.transactions)) {
      for (const t of backup.transactions) {
        queries.push(
          env.DB.prepare(
            `INSERT INTO transactions (id, lot_id, rid, type, qty, bal, ref, scan, by, at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(t.id, t.lot_id, t.rid, t.type, t.qty, t.bal, t.ref || null, t.scan, t.by, t.at)
        );
      }
    }

    // Restore Users
    if (Array.isArray(backup.users)) {
      for (const u of backup.users) {
        queries.push(
          env.DB.prepare(
            `INSERT INTO users (username, name, role, initials, color, password, signature)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(u.username, u.name, u.role, u.initials, u.color, u.password || null, u.signature || null)
        );
      }
    }

    // Restore Permissions
    if (Array.isArray(backup.permissions)) {
      for (const p of backup.permissions) {
        queries.push(
          env.DB.prepare(
            `INSERT INTO permissions (role, perm, allowed)
             VALUES (?, ?, ?)`
          ).bind(p.role, p.perm, p.allowed)
        );
      }
    }

    // Execute everything in a single transactional batch
    if (queries.length > 0) {
      await env.DB.batch(queries);
    }

    return json({ success: true, message: 'กู้คืนข้อมูลระบบเสร็จสิ้น' });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
