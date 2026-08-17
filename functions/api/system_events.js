import { requirePerm, actorName, nowStr, json } from './_lib.js';

const KINDS = new Set(['BACKUP', 'RESTORE', 'CLIENT_ERROR']);

// GET — the app asks for two things on load: when the last backup happened, and
// whether anything has been failing. Returns a small summary plus the most
// recent errors rather than the whole table.
export async function onRequestGet(context) {
  const { env } = context;
  try {
    const lastBackup = await env.DB
      .prepare("SELECT at, by FROM system_events WHERE kind = 'BACKUP' ORDER BY at DESC LIMIT 1")
      .first();
    const { results: recentErrors } = await env.DB
      .prepare("SELECT id, detail, context, by, at FROM system_events WHERE kind = 'CLIENT_ERROR' ORDER BY id DESC LIMIT 20")
      .all();
    const errorCount = await env.DB
      .prepare("SELECT COUNT(*) AS n FROM system_events WHERE kind = 'CLIENT_ERROR' AND at >= datetime('now','-7 days')")
      .first();

    return json({
      lastBackupAt: lastBackup ? lastBackup.at : null,
      lastBackupBy: lastBackup ? lastBackup.by : null,
      errorsLast7Days: errorCount ? errorCount.n : 0,
      recentErrors,
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// POST — record an event. Any signed-in user may report a client error: the
// whole point is to hear about failures from the people who hit them, and a
// permission gate would silence exactly the reports worth having.
export async function onRequestPost(context) {
  const { env } = context;
  try {
    const b = await context.request.json();
    const kind = String(b.kind || '').toUpperCase();
    if (!KINDS.has(kind)) return json({ error: 'ชนิดเหตุการณ์ไม่ถูกต้อง' }, 400);

    // Cap the stored text. A runaway stack trace should not be able to bloat
    // the database, and the first few lines are the useful part anyway.
    const detail = String(b.detail || '').slice(0, 1000);
    const ctx = String(b.context || '').slice(0, 300);
    const by = await actorName(context);

    await env.DB.prepare(
      'INSERT INTO system_events (kind, detail, context, by, at) VALUES (?, ?, ?, ?, ?)'
    ).bind(kind, detail, ctx, by, nowStr()).run();

    return json({ success: true }, 201);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE — clear the error log (admin only). Backup history is deliberately not
// clearable: it is the evidence that backups are being taken.
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;
  try {
    await context.env.DB.prepare("DELETE FROM system_events WHERE kind = 'CLIENT_ERROR'").run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
