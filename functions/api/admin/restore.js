import { requirePerm, nowStr, json } from '../_lib.js';

export async function onRequestPost(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;

  const { env, request } = context;
  try {
    const backup = await request.json();
    if (!backup || backup.version === undefined) {
      return json({ error: 'ไฟล์สำรองข้อมูลไม่ถูกต้องหรือไม่รองรับ' }, 400);
    }

    // Backups deliberately carry no password hashes (see backup.js). Restoring
    // them verbatim would write NULL into every password, and verifyPassword()
    // rejects a NULL outright — so a restore would lock every single account
    // out of the system, with no way back in through the UI. Carry the live
    // hashes forward by username instead: a restore replaces inventory data,
    // not the people who work here.
    const { results: liveUsers } = await env.DB.prepare('SELECT username, password FROM users').all();
    const livePasswords = new Map(liveUsers.map((u) => [u.username, u.password]));

    // The admin running the restore must still be able to get back in even if
    // the backup came from another system and doesn't list them at all.
    const actorUsername = context.data.auth.username;
    const actor = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(actorUsername).first();

    const queries = [];

    // Clear existing data (in order of foreign key dependency)
    queries.push(env.DB.prepare('DELETE FROM transactions'));
    queries.push(env.DB.prepare('DELETE FROM lots'));
    queries.push(env.DB.prepare('DELETE FROM reagents'));
    queries.push(env.DB.prepare('DELETE FROM sessions')); // Clear old sessions
    queries.push(env.DB.prepare('DELETE FROM users'));

    // Only replace the role→permission matrix when the backup actually carries
    // one. Wiping it against an older backup that has no `permissions` array
    // leaves every role with no rows, and requirePerm() reads a missing row as
    // "denied" — so even an admin would lose รับเข้า / เบิกจ่าย / จัดการ.
    const hasPermissions = Array.isArray(backup.permissions) && backup.permissions.length > 0;
    if (hasPermissions) queries.push(env.DB.prepare('DELETE FROM permissions'));

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
          // Older backup files can contain lots whose `recv` drifted below
          // `qty` (a bug since fixed). Repairing on the way in keeps a restore
          // from aborting wholesale on historical data the lab can't edit.
          ).bind(l.id, l.rid, l.lot, l.expiry, Math.max(l.recv ?? 0, l.qty ?? 0), l.qty, l.loc, l.qr, l.status)
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
    const restoredNames = new Set();
    let needPasswordReset = 0;
    if (Array.isArray(backup.users)) {
      for (const u of backup.users) {
        if (!u.username || restoredNames.has(u.username)) continue;
        restoredNames.add(u.username);
        // Prefer the hash this account already has on this system; the backup's
        // own `password` field is only a fallback for older backup files that
        // still carried one.
        const password = livePasswords.get(u.username) ?? u.password ?? null;
        if (!password) needPasswordReset++;
        queries.push(
          env.DB.prepare(
            `INSERT INTO users (username, name, role, initials, color, password, signature)
             VALUES (?, ?, ?, ?, ?, ?, ?)`
          ).bind(u.username, u.name, u.role, u.initials, u.color, password, u.signature || null)
        );
      }
    }
    // Last line of defence against a lockout: whoever ran the restore keeps
    // their account, their password and their admin role no matter what the
    // backup file contained.
    if (actor && !restoredNames.has(actor.username)) {
      restoredNames.add(actor.username);
      queries.push(
        env.DB.prepare(
          `INSERT INTO users (username, name, role, initials, color, password, signature)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        ).bind(actor.username, actor.name, 'admin', actor.initials, actor.color, actor.password, actor.signature || null)
      );
    }

    // Restore Permissions
    if (hasPermissions) {
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

    try {
      await env.DB.prepare(
        "INSERT INTO system_events (kind, detail, context, by, at) VALUES ('RESTORE', ?, 'admin/restore', ?, ?)"
      ).bind(`lots=${(backup.lots||[]).length} txns=${(backup.transactions||[]).length}`, actorUsername, nowStr()).run();
    } catch { /* bookkeeping only */ }

    const message = needPasswordReset > 0
      ? `กู้คืนข้อมูลระบบเสร็จสิ้น · มีผู้ใช้ ${needPasswordReset} รายที่ไม่เคยมีอยู่ในระบบนี้ ต้องตั้งรหัสผ่านใหม่ให้ก่อนจึงจะเข้าใช้งานได้`
      : 'กู้คืนข้อมูลระบบเสร็จสิ้น · รหัสผ่านของผู้ใช้เดิมยังใช้ได้ตามปกติ';
    return json({ success: true, needPasswordReset, message });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
