---
score: 2.3
p0: 1
p1: 1
timestamp: 2026-06-30T12-48-15Z
slug: src-screens-dashboard-jsx
---
Method: dual-agent (A: c8701f10-833c-4735-852d-d06e05c8ed3b · B: 93c82325-fec7-4416-a3e0-7dec10b4d709)

# Design Critique: Dashboard (`src/screens/Dashboard.jsx`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3/4 | Dashboard displays status/insights, but the SVG charts utilize static scaled mocks rather than live transaction query calculations. |
| 2 | Match between System & Real World | 2/4 | Thai domain-specific terms are accurate, but hotel metric comments (like `RevPar`) indicate domain leakage. |
| 3 | User Control and Freedom | 3/4 | Reset options are fully integrated, but date filters lack verification to prevent start > end dates. |
| 4 | Consistency and Standards | 1/4 | Inconsistent palette on SVG charts (rainbow tones) and undocumented box shadows deviate from `DESIGN.md` tokens. |
| 5 | Error Prevention | 2/4 | No form boundary check to prevent illogical date ranges (Start date after End date). |
| 6 | Recognition Rather Than Recall | 2/4 | Very high visual density with 7 distinct chart panels causes cognitive overload and screen clutter. |
| 7 | Flexibility and Efficiency of Use | 3/4 | Preset periods (3m, 6m, 12m) are highly efficient. |
| 8 | Aesthetic & Minimalist Design | 1/4 | "Chart fatigue" with visual overkill; too many small charts packed together without clean spacing. |
| 9 | Help Users with Errors | 3/4 | Toast notifications are reliable. |
| 10 | Help and Documentation | 3/4 | Help tab is accessible. |

**Overall Score: 2.3/4.0 (Need Refinement)**

## AI Slop Verdict: High Warning

1. **Hotel Metric Template Remnants:**
   - Line 416 contains a comment `// Panel B: Line Chart of RevPar % change` (Revenue Per Available Room). This is a hotel booking KPI, proving template copy-paste from an unrelated domain.
2. **Fake SVG Interactive Trends:**
   - SVG charts render data using hardcoded mock arrays scaled by a simple `filterRatio`, rather than calculating values from actual transaction logs (`txns`). Points have `cursor: pointer` but no click events.

## Cognitive Load & Emotional Journey

- **Cognitive Load:** High due to visual noise, too many chart variants, and lack of visual groupings.
- **Emotional Journey:** Initial excitement at the colorful panels shifts to confusion and distrust once users notice the charts do not react to date range changes dynamically or calculate real log values.

## Strengths
- **Executive Insights Summary:** Translates complex telemetry into high-quality Thai text guidelines.
- **Dedicated Print Media Layout:** Provides clean, formal print layouts with signatures for lab reports.

## Priority Issues

### P0 - Fake Data Logic (Data Integrity)
- SVG charts use hardcoded mock coordinates rather than querying live transactions from `txns`.

### P1 - Hotel Domain Leakage
- Leftover template comment `RevPar` and chart fatigue.

### P2 - Design System Token Drift
- Use of undocumented CSS values (e.g. `#333`, `#666`, `#cccccc`) and border-radius `4px` outside the allowed `sm: 5px`, `md: 8px`, `lg: 12px` scale.

### P3 - Non-interactive Pointers
- SVG circles have `cursor: pointer` but lack active handlers.

## Minor Observations
- Fallback suppliers use hardcoded strings rather than design tokens.
- Hardcoded system reference date `2026-06-29` is fragile and will decay over time.
