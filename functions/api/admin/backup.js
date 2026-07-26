import { requirePerm, json } from '../_lib.js';

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

    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      reagents: reagents.results || [],
      lots: lots.results || [],
      transactions: transactions.results || [],
      users: users.results || [],
      permissions: permissions.results || []
    };

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
