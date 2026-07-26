// Single source of truth for reagent categories.
//
// This used to be duplicated in 5+ places (App.jsx CAT_LABEL, App.jsx
// topCatLabel, Dashboard, Alerts, ReagentLists, RegisterModal). When the old
// CHE/HEM/IMM/MIP/MDC set was retired for HMS/ADV, one copy was missed and the
// Inventory screen silently rendered the raw code "HMS" for every reagent.
// Import from here instead of re-declaring the mapping.

export const CATEGORIES = [
  { value: 'HMS', label: 'บริการศูนย์การแพทย์' },
  { value: 'ADV', label: 'ตรวจวินิจฉัยขั้นสูง' },
];

// Falls back to the raw code so an unknown/legacy value is still visible
// (and obviously wrong) rather than rendering blank.
export function categoryLabel(code) {
  const hit = CATEGORIES.find(c => c.value === code);
  return hit ? hit.label : (code || '');
}

// Category codes in display order — for filter dropdowns and grouped tables.
export const CATEGORY_CODES = CATEGORIES.map(c => c.value);

// Default category for a brand-new reagent. Must be one of CATEGORIES, or the
// registration form will show the first option while silently saving this
// value (the bug that put "CHE" on 28 reagents after the set changed).
export const DEFAULT_CATEGORY = 'HMS';
