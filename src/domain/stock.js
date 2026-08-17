// Pure domain rules for the reagent store.
//
// These used to live as methods on the App component, which meant the only way
// to check them was to click through the UI — and that is exactly how a set of
// quiet arithmetic bugs survived (a flipped sign that doubled a stock
// adjustment, a `recv` total that stopped tracking its lot, an expiry countdown
// measured from a hardcoded date). Nothing here touches React, the network or
// the clock unless a date is handed in, so every rule below is directly
// testable, and App.jsx keeps one implementation instead of its own copy.

export const SEVERITY = { CRITICAL: 'critical', WARNING: 'warning', OK: 'ok' };

// Expiry thresholds in days. Shared so a lot can never read "วิกฤต" on one
// screen and "เฝ้าระวัง" on another — they diverged once already.
export const CRITICAL_DAYS = 15;
export const WARNING_DAYS = 60;

/** Whole days from `today` until `expiry` ('YYYY-MM-DD'). Negative = expired. */
export function daysUntil(expiry, today = new Date()) {
  if (!expiry) return null;
  const end = new Date(expiry + 'T00:00:00');
  if (Number.isNaN(end.getTime())) return null;
  // Compare midnight to midnight so the answer matches a wall calendar rather
  // than shifting with the time of day the question is asked.
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  return Math.round((end - start) / 86400000);
}

export function severityOf(days) {
  if (days == null) return SEVERITY.OK;
  if (days <= CRITICAL_DAYS) return SEVERITY.CRITICAL;
  if (days <= WARNING_DAYS) return SEVERITY.WARNING;
  return SEVERITY.OK;
}

export function dayLabel(days) {
  if (days == null) return '—';
  if (days < 0) return 'หมดอายุแล้ว';
  if (days === 0) return 'หมดอายุวันนี้';
  return 'เหลือ ' + days + ' วัน';
}

/** Lots of one reagent that can actually be dispensed right now. */
export function activeLots(lots, rid) {
  return lots.filter((l) => l.rid === rid && l.qty > 0 && l.status === 'ACTIVE');
}

export function onHand(lots, rid) {
  return activeLots(lots, rid).reduce((sum, l) => sum + l.qty, 0);
}

/** Expiry date of the lot that should be dispensed next, or null. */
export function earliestExpiry(lots, rid) {
  const dates = activeLots(lots, rid).map((l) => l.expiry).sort();
  return dates[0] || null;
}

/**
 * FEFO allocation: consume the soonest-expiring lots first.
 *
 * Returns { rows, shortBy } — `shortBy` is how much could NOT be covered, so
 * callers decide whether a partial plan is worth showing. Ties on expiry fall
 * back to lot id so the plan is deterministic; without that, two calls could
 * order the same stock differently and the preview would not match the result.
 */
export function planFefo(lots, rid, wanted) {
  const qty = Number(wanted);
  if (!Number.isFinite(qty) || qty <= 0) return { rows: [], shortBy: 0 };

  const queue = activeLots(lots, rid).slice().sort((a, b) => {
    if (a.expiry !== b.expiry) return a.expiry < b.expiry ? -1 : 1;
    return a.id - b.id;
  });

  const rows = [];
  let remaining = qty;
  for (const lot of queue) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, lot.qty);
    rows.push({ lotId: lot.id, lot: lot.lot, expiry: lot.expiry, take, after: lot.qty - take });
    remaining -= take;
  }
  return { rows, shortBy: remaining };
}

/**
 * The stored quantity for a movement. RECEIVE adds, ISSUE and DISPOSE subtract,
 * and an ADJUST keeps whichever direction it was recorded with.
 *
 * Editing a past movement only ever shows its magnitude, so the direction has
 * to be restored on save. Losing it flips the sign, and the server then applies
 * twice the intended delta — a disposal of 5 silently *added* 10 back to stock.
 */
export function signedQuantity(type, magnitude, originalQty = 0) {
  const size = Math.abs(Number(magnitude) || 0);
  const outbound = type === 'ISSUE' || type === 'DISPOSE' || (type === 'ADJUST' && originalQty < 0);
  return outbound ? -size : size;
}

/**
 * Invariants every lot row must satisfy. Returns a list of human-readable
 * violations (empty means valid) so the same rules can back a test, an import
 * check and a data-repair report.
 */
export function lotViolations(lot) {
  const bad = [];
  if (lot.qty < 0) bad.push(`คงเหลือติดลบ (${lot.qty})`);
  if (lot.recv < 0) bad.push(`ยอดรับสะสมติดลบ (${lot.recv})`);
  if (lot.qty > lot.recv) bad.push(`คงเหลือ (${lot.qty}) มากกว่ายอดรับสะสม (${lot.recv})`);
  if (lot.qty === 0 && lot.status === 'ACTIVE') bad.push('คงเหลือ 0 แต่สถานะยัง ACTIVE');
  if (lot.qty > 0 && lot.status === 'DEPLETED') bad.push(`คงเหลือ ${lot.qty} แต่สถานะเป็น DEPLETED`);
  return bad;
}

/** Status a lot should carry for a given balance. */
export function statusFor(qty) {
  return qty <= 0 ? 'DEPLETED' : 'ACTIVE';
}
