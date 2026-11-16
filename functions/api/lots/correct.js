import { requirePerm, actorName, json } from '../_lib.js';
import { correctLot } from '../_lotfix.js';

// POST — correct a lot number from its label, directly (perm: manage).
// Someone without that permission reports it instead: see fix_requests.js.
export async function onRequestPost(context) {
  const denied = await requirePerm(context, { perm: 'manage' });
  if (denied) return denied;
  try {
    const { lotId, newLot, labelExpiry } = await context.request.json();
    if (!lotId) return json({ error: 'Missing lotId' }, 400);
    const by = await actorName(context);
    const r = await correctLot(context.env, { lotId: +lotId, newLot, labelExpiry, by });
    if (!r.ok) return json({ error: r.error }, 400);
    return json(r);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
