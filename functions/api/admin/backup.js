import { requirePerm, actorName, nowStr, json } from '../_lib.js';

export async function onRequestGet(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;

  const { env } = context;
  try {
    // Fetch all records from key tables
    const reagents = await env.DB.prepare('SELECT * FROM reagents').all();
    const lots = await env.DB.prepare('SELECT * FROM lots').all();
    const transactions = await env.DB.prepare('SELECT * FROM transactions').all();
    // Deliberately excludes `password` — the backup file leaves the server and
    // gets stored/emailed by staff, so it must not carry credential hashes even
    // salted ones. restore.js re-inserts these users with password = NULL; an
    // admin then re-issues passwords, which is the safer default.
    const users = await env.DB
      .prepare('SELECT username, name, role, initials, color, signature FROM users').all();
    const permissions = await env.DB.prepare('SELECT * FROM permissions').all();
    // The preparation record is the lab's ISO evidence for every label it has
    // ever produced, and it was not in the backup at all — a restore would have
    // come back with the catalogue intact and that history gone. alert_acks
    // carries which alerts were acknowledged or marked ordered, which is what
    // stops a reorder appearing twice; app_settings holds the SDS folder link.
    const stickerLogs = await env.DB.prepare('SELECT * FROM sticker_logs').all();
    const alertAcks = await env.DB.prepare('SELECT * FROM alert_acks').all();
    const appSettings = await env.DB.prepare('SELECT * FROM app_settings').all();
    // system_events is the audit trail: which reagents were deleted and why,
    // and when backups were taken. The app records a deletion there precisely
    // so a catalogue entry cannot silently stop existing — and leaving the
    // table out of the backup meant a recovery came back with no record that
    // anything had ever been deleted. Client error reports ride along; they are
    // small and they are the history of what has been failing.
    const systemEvents = await env.DB.prepare('SELECT * FROM system_events').all();

    // Not exported on purpose: `sessions` and `login_attempts` are live
    // credentials and rate-limit state that must not leave the server, and
    // `d1_migrations` describes the schema, which belongs to the deployment
    // rather than to the data.
    const backupData = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      reagents: reagents.results || [],
      lots: lots.results || [],
      transactions: transactions.results || [],
      users: users.results || [],
      permissions: permissions.results || [],
      sticker_logs: stickerLogs.results || [],
      alert_acks: alertAcks.results || [],
      app_settings: appSettings.results || [],
      system_events: systemEvents.results || []
    };

    // Leave a trace that a backup was taken, so the app can tell the lab when
    // the last one was — an untaken backup is invisible until it is needed.
    try {
      await env.DB.prepare(
        "INSERT INTO system_events (kind, detail, context, by, at) VALUES ('BACKUP', ?, 'admin/backup', ?, ?)"
      ).bind(
        `reagents=${backupData.reagents.length} lots=${backupData.lots.length} txns=${backupData.transactions.length} prep=${backupData.sticker_logs.length}`,
        await actorName(context), nowStr()
      ).run();
    } catch { /* never let bookkeeping block the download itself */ }

    return new Response(JSON.stringify(backupData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=tuh_inventory_backup_${Date.now()}.json`
      }
    });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
