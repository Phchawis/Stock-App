import { requirePerm, json } from './_lib.js';

export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare('SELECT * FROM transactions').all();
    return json(results);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

// DELETE — clear all movement history and reset lot balances (admin only; irreversible)
export async function onRequestDelete(context) {
  const denied = await requirePerm(context, { adminOnly: true });
  if (denied) return denied;
  try {
    await context.env.DB.prepare('DELETE FROM transactions').run();
    await context.env.DB.prepare("UPDATE lots SET qty = recv, status = 'ACTIVE'").run();
    return json({ success: true });
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
