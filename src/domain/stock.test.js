import { describe, it, expect } from 'vitest';
import {
  daysUntil, severityOf, dayLabel, activeLots, onHand, earliestExpiry,
  planFefo, signedQuantity, lotViolations, statusFor, SEVERITY,
} from './stock.js';

// Fixed reference date so these assertions mean the same thing next year.
const TODAY = new Date('2026-08-15T09:30:00');

const lot = (over = {}) => ({
  id: 1, rid: 10, lot: 'L1', expiry: '2027-01-01',
  recv: 10, qty: 10, loc: 'ตู้เย็น A', status: 'ACTIVE', ...over,
});

describe('daysUntil', () => {
  it('counts whole days to expiry', () => {
    expect(daysUntil('2026-08-20', TODAY)).toBe(5);
  });

  it('is negative once expired', () => {
    expect(daysUntil('2026-08-10', TODAY)).toBe(-5);
  });

  it('is 0 on the expiry date itself', () => {
    expect(daysUntil('2026-08-15', TODAY)).toBe(0);
  });

  it('ignores the time of day it is asked', () => {
    const morning = daysUntil('2026-09-01', new Date('2026-08-15T00:05:00'));
    const night = daysUntil('2026-09-01', new Date('2026-08-15T23:55:00'));
    expect(morning).toBe(night);
  });

  it('returns null for a missing or unparseable date', () => {
    expect(daysUntil('', TODAY)).toBeNull();
    expect(daysUntil('not-a-date', TODAY)).toBeNull();
  });

  // Regression: the reagent list measured expiry from a hardcoded 2026-06-29,
  // so an already-expired lot displayed as "เหลือ 11 วัน" in green.
  it('does not measure from a fixed date (expired reads as expired)', () => {
    expect(daysUntil('2026-07-10', new Date('2026-07-29T12:00:00'))).toBeLessThan(0);
  });
});

describe('severityOf', () => {
  it.each([
    [-3, SEVERITY.CRITICAL],
    [0, SEVERITY.CRITICAL],
    [15, SEVERITY.CRITICAL],
    [16, SEVERITY.WARNING],
    [60, SEVERITY.WARNING],
    [61, SEVERITY.OK],
  ])('%i days -> %s', (days, expected) => {
    expect(severityOf(days)).toBe(expected);
  });

  it('treats an unknown date as ok rather than crying wolf', () => {
    expect(severityOf(null)).toBe(SEVERITY.OK);
  });
});

describe('dayLabel', () => {
  it('reads naturally either side of the expiry date', () => {
    expect(dayLabel(-1)).toBe('หมดอายุแล้ว');
    expect(dayLabel(0)).toBe('หมดอายุวันนี้');
    expect(dayLabel(7)).toBe('เหลือ 7 วัน');
  });
});

describe('stock rollups', () => {
  const lots = [
    lot({ id: 1, rid: 10, qty: 4, expiry: '2027-03-01' }),
    lot({ id: 2, rid: 10, qty: 6, expiry: '2026-12-01' }),
    lot({ id: 3, rid: 10, qty: 0, status: 'DEPLETED', expiry: '2026-01-01' }),
    lot({ id: 4, rid: 99, qty: 5, expiry: '2026-02-01' }),
  ];

  it('counts only dispensable lots of the requested reagent', () => {
    expect(activeLots(lots, 10).map(l => l.id)).toEqual([1, 2]);
  });

  it('sums on-hand across those lots', () => {
    expect(onHand(lots, 10)).toBe(10);
  });

  it('ignores depleted stock when reporting the next expiry', () => {
    // The 2026-01-01 lot is empty, so it must not be reported as expiring next.
    expect(earliestExpiry(lots, 10)).toBe('2026-12-01');
  });

  it('reports nothing for a reagent with no stock', () => {
    expect(onHand(lots, 12345)).toBe(0);
    expect(earliestExpiry(lots, 12345)).toBeNull();
  });
});

describe('planFefo', () => {
  const lots = [
    lot({ id: 1, rid: 10, qty: 3, expiry: '2027-05-01' }),
    lot({ id: 2, rid: 10, qty: 2, expiry: '2026-09-01' }), // expires soonest
    lot({ id: 3, rid: 10, qty: 5, expiry: '2026-12-01' }),
  ];

  it('takes the soonest-expiring lot first', () => {
    expect(planFefo(lots, 10, 2).rows).toEqual([
      { lotId: 2, lot: 'L1', expiry: '2026-09-01', take: 2, after: 0 },
    ]);
  });

  it('walks forward through lots in expiry order', () => {
    const { rows, shortBy } = planFefo(lots, 10, 6);
    expect(rows.map(r => [r.lotId, r.take])).toEqual([[2, 2], [3, 4]]);
    expect(shortBy).toBe(0);
  });

  it('never allocates more than a lot holds', () => {
    const { rows } = planFefo(lots, 10, 100);
    for (const r of rows) expect(r.after).toBeGreaterThanOrEqual(0);
  });

  it('reports the shortfall instead of over-promising', () => {
    const { rows, shortBy } = planFefo(lots, 10, 12);
    expect(rows.reduce((s, r) => s + r.take, 0)).toBe(10);
    expect(shortBy).toBe(2);
  });

  it('conserves quantity: taken + remaining always equals the original', () => {
    const { rows } = planFefo(lots, 10, 7);
    for (const r of rows) {
      const source = lots.find(l => l.id === r.lotId);
      expect(r.take + r.after).toBe(source.qty);
    }
  });

  it('is deterministic when two lots share an expiry date', () => {
    const tied = [
      lot({ id: 7, rid: 10, qty: 1, expiry: '2026-09-01' }),
      lot({ id: 4, rid: 10, qty: 1, expiry: '2026-09-01' }),
    ];
    expect(planFefo(tied, 10, 2).rows.map(r => r.lotId)).toEqual([4, 7]);
    expect(planFefo(tied.slice().reverse(), 10, 2).rows.map(r => r.lotId)).toEqual([4, 7]);
  });

  it('refuses nonsense quantities', () => {
    expect(planFefo(lots, 10, 0).rows).toEqual([]);
    expect(planFefo(lots, 10, -5).rows).toEqual([]);
    expect(planFefo(lots, 10, 'abc').rows).toEqual([]);
  });
});

describe('signedQuantity', () => {
  it('keeps a receipt positive', () => {
    expect(signedQuantity('RECEIVE', 5)).toBe(5);
  });

  it('makes issues and disposals negative', () => {
    expect(signedQuantity('ISSUE', 5)).toBe(-5);
    expect(signedQuantity('DISPOSE', 5)).toBe(-5);
  });

  // Regression: editing a disposal re-saved it as +5, so the server applied a
  // delta of +10 and stock grew by ten units that were physically destroyed.
  it('keeps a disposal negative when its magnitude is edited', () => {
    expect(signedQuantity('DISPOSE', 5, -5)).toBe(-5);
  });

  it('preserves the direction an adjustment was recorded with', () => {
    expect(signedQuantity('ADJUST', 3, -3)).toBe(-3);
    expect(signedQuantity('ADJUST', 3, 3)).toBe(3);
  });

  it('ignores a sign supplied by the caller and trusts the type', () => {
    expect(signedQuantity('ISSUE', -5)).toBe(-5);
    expect(signedQuantity('RECEIVE', -5)).toBe(5);
  });
});

describe('lotViolations', () => {
  it('accepts a healthy lot', () => {
    expect(lotViolations(lot())).toEqual([]);
  });

  it('rejects negative stock', () => {
    expect(lotViolations(lot({ qty: -1 })).join()).toMatch(/ติดลบ/);
  });

  // Regression: correcting a receipt from 10 to 4 left `recv` at 10, so
  // "clear all history" (which resets qty = recv) restored the wrong balance.
  it('rejects a balance larger than the total ever received', () => {
    expect(lotViolations(lot({ qty: 12, recv: 10 })).join()).toMatch(/มากกว่ายอดรับสะสม/);
  });

  it('rejects a status that disagrees with the balance', () => {
    expect(lotViolations(lot({ qty: 0, status: 'ACTIVE' }))).toHaveLength(1);
    expect(lotViolations(lot({ qty: 5, status: 'DEPLETED' }))).toHaveLength(1);
  });

  it('accepts a properly depleted lot', () => {
    expect(lotViolations(lot({ qty: 0, status: 'DEPLETED' }))).toEqual([]);
  });
});

describe('statusFor', () => {
  it('marks an empty lot depleted and a stocked lot active', () => {
    expect(statusFor(0)).toBe('DEPLETED');
    expect(statusFor(3)).toBe('ACTIVE');
  });
});
