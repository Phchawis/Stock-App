---
target: dashboard page
total_score: 21
p0_count: 2
p1_count: 2
timestamp: 2026-07-04T03-40-49Z
slug: src-screens-dashboard-jsx
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | No loading/updating affordance when filters change; the Category table confidently shows "0%" everywhere, which is a bug, not a true zero — the system is lying about its own status |
| 2 | Match Between System and Real World | 3 | Thai lab terminology is fluent and correct throughout, but the Category Overview panel uses category codes (`HMS`/`ADV`) that don't match the real lab-section vocabulary (`CHE/HEM/IMM/MIP/MDC`) used everywhere else in the app |
| 3 | User Control and Freedom | 2 | "ล้างตัวกรอง" (clear filters) exists and only appears once a filter is active (good). No preview-then-confirm before "พิมพ์รายงาน PDF" fires the browser print dialog immediately |
| 4 | Consistency and Standards | 2 | Category codes are internally inconsistent — Dashboard uses `HMS/ADV`, everywhere else in the app (Inventory, RegisterModal, App.jsx) uses `CHE/HEM/IMM/MIP/MDC` |
| 5 | Error Prevention | 1 | Nothing guards against the undefined-value render on line 476; nothing validates that the hardcoded `cats` array matches real data; date range allows start > end with no check |
| 6 | Recognition Rather Than Recall | 3 | Filters are visible and labeled, KPI cards give at-a-glance orientation, chart legend sits inline next to the chart — good on desktop |
| 7 | Flexibility and Efficiency of Use | 3 | Period toggle + date range + 3 filters + reagent search is genuinely flexible; no keyboard shortcuts or saved filters, but reasonable scope for this kind of screen |
| 8 | Aesthetic and Minimalist Design | 3 | Clean grid, restrained palette, good whitespace on desktop; loses a point for the KPI top-stripe accents and a tonally mismatched 🎉 emoji |
| 9 | Help Users Recognize/Diagnose/Recover from Errors | 0 | No error state anywhere on this screen; the two live bugs below fail completely silently — worst kind of error, because nothing tells the user anything went wrong |
| 10 | Help and Documentation | 2 | App-wide "คู่มือการใช้งาน" exists, but nothing dashboard-specific — no tooltip for "หมุนเวียน %" (turnover) formula or the ≤90-day "ใกล้หมดอายุ" threshold |
| **Total** | | **21/40** | **Acceptable — significant improvements needed, and two are real bugs, not style opinions** |

#### Anti-Patterns Verdict

**Does this look AI-generated?** Not in the generic-SaaS sense — no glassmorphism, no gradient text, no hero-metric-with-gradient cliché, no numbered eyebrows. Typography, density, and Thai-first copy read as deliberately authored for a real clinical workflow.

One DESIGN.md-banned pattern shows up anyway: every KPI card has a 3px full-width colored top stripe (`position:absolute; top:0; left:0; right:0; height:3px; background:${k.color}`, Dashboard.jsx:362) — functionally the same "decorative accent instead of a real status signal" move DESIGN.md's Don'ts explicitly forbid for side-stripes, just rotated 90°. Also a stray 🎉 in the empty-state copy is the one moment the interface reaches for SaaS-cheerful instead of clinical-restrained.

The more consequential finding isn't stylistic at all: **two logic bugs only surface when the screen runs against live data** — confirmed by direct code inspection, not assumption:
- `Dashboard.jsx:63` — `const cats = ['HMS', 'ADV'];` is hardcoded to category codes that don't exist on any real reagent (every seeded reagent uses `CHE/HEM/IMM/MIP/MDC`, confirmed in `migrations/0000_init.sql`). The Category Overview table will show 0 types / 0 stock / 0% turnover forever.
- `Dashboard.jsx:476` — references `insights.juneRec` / `insights.juneIssue`, but the local `insights` object built at Dashboard.jsx:119 never defines those keys (only `totalRecInRange`/`totalIssueInRange`, which line 691's print-template version uses correctly). The on-screen sentence literally renders "มีจำนวนยอดรับเข้ารวม **ชิ้น**" — bold empty space where a number belongs.

**Deterministic scan**: The CLI detector (`detect.mjs`) returned 33 findings, all `design-system-color`/`design-system-radius` (colors/radii not in DESIGN.md's documented palette). Every one sits inside the hidden `.print-report-container` (Dashboard.jsx:534, `display:'none'`, only rendered via `window.print()`) or its `@media print` style block — this is the PDF-export template intentionally forced to black-on-white regardless of the app's dark theme, not design-system drift. Two exceptions worth reconciling: the chart-legend swatches at lines 414/418 (`#2E9E63`, `#1387A6`) and a related glow at line 286 (`rgba(19,135,166,0.25)`) are near-misses of the documented brand teal that could be tokenized instead of hardcoded.

The browser-side scan added real signal the CLI and the manual review both missed: a **WCAG contrast failure** — `button.mobile-action-btn.receive` text renders at 4.4:1 against its background, just under the 4.5:1 AA minimum DESIGN.md itself mandates ("Body text must have a minimum contrast ratio of 4.5:1"). It also flagged 24 "cyan neon on dark" (`ai-color-palette`) and 4 `dark-glow` findings on sidebar/header buttons — these are very likely false positives: CLAUDE.md documents that the root `<div>` intentionally overrides all tokens into a dark theme, and DESIGN.md's own `--brand-*`/`--teal-*` family is the first-class documented brand color, not an ad hoc AI color pick. This is exactly where the LLM review and the detector converge from different angles: the manual review independently flagged (as a Minor Observation) that DESIGN.md documents a *light* palette (`#F6F7FB` background) while the shipped app runs dark throughout — the same underlying contradiction the detector's heuristic is tripping on without that context. **Recommendation: reconcile DESIGN.md to document the dark theme as canonical**, which would silence this whole class of false positive going forward.

**Visual overlays**: not persisted from this run (server was stopped per the isolated-assessment cleanup step); the structured JSON evidence above is the reliable record.

#### Overall Impression

This is a genuinely well-composed clinical dashboard undercut by two silent data bugs that make the two panels most responsible for building trust — Category Overview and Executive Insights — actively lie to the user. The visual craft is ahead of most first-pass AI output (real print-template engineering, correct Thai lab terminology, thoughtful empty states); the biggest opportunity isn't a redesign, it's fixing what's already there and adding a mobile layout for two panels that currently break at 375px.

#### What's Working

1. **The Critical Reorders empty state** (Dashboard.jsx:519-524) — icon + reassuring headline + calm copy in actual green status color, not a generic gray "no data" box. It treats "nothing is wrong" as worth designing for distinctly, which matters a lot in a safety-critical context.
2. **The filter bar** — a labeled "ตัวกรองข้อมูล:" group, three scoped selects, and a "ล้างตัวกรอง" reset that only appears once a filter is active. Correct progressive disclosure; no dead disabled button cluttering the default state.
3. **The print-report scaffolding** — a fully separate signature-block, hospital-letterhead, forced-black-on-white print template. This is usually an afterthought; here it's clearly built for the real downstream use case (a signed monthly report), not a bolted-on `window.print()`.

#### Priority Issues

**[P0] Category Overview table always shows zero stock, contradicting the KPI cards two inches above it.**
Why it matters: `Dashboard.jsx:63` hardcodes `const cats = ['HMS', 'ADV']`, but no reagent in the system uses those codes — every one uses `CHE/HEM/IMM/MIP/MDC`. In a clinical stock system, a manager glancing at a zeroed category panel during a real shortage could read it as confirmation there's stock, rather than a UI defect.
Fix: replace the hardcoded array with the real category map already defined identically in `App.jsx`, or derive it dynamically: `[...new Set(reagents.map(r => r.cat))]`.
Suggested command: `/impeccable harden` (or a direct one-line fix — this doesn't need a design pass, just the correct data source).

**[P0] Executive Insights renders a broken sentence with a missing number.**
Why it matters: `Dashboard.jsx:476` reads `insights.juneRec`/`insights.juneIssue`, keys that don't exist on the local `insights` object (Dashboard.jsx:119) — only `totalRecInRange`/`totalIssueInRange` exist, which the correct print-template version (line 691) already uses. The panel meant to build confidence in the system's analysis instead visibly breaks, live, on every page load.
Fix: swap `insights.juneRec`/`insights.juneIssue` for `insights.totalRecInRange`/`insights.totalIssueInRange` at line 476.
Suggested command: `/impeccable harden`.

**[P1] The Executive Insights / Critical Reorders grid doesn't stack on mobile.**
Why it matters: at 375px, `grid-template-columns:1fr 1.2fr` squeezes into ~180px columns, forcing the Critical Reorders table into horizontal scroll and clipping cell values (e.g. "vial" truncates). This is the same class of problem already fixed elsewhere in the app (Audit, Alerts, Inventory, Perms screens all got mobile-card treatment this session) — this grid was missed.
Fix: add a `max-width:768px` breakpoint switching this grid (and the Category-table/Chart grid above it) to a single column, matching the care already given elsewhere.
Suggested command: `/impeccable adapt`.

**[P1] KPI summary cards disappear entirely on mobile with nothing replacing them.**
Why it matters: this was an intentional, user-requested change earlier in this project (the cards were overflowing/breaking on narrow screens, so they were hidden below 768px via `.kpi-cards-grid { display:none !important }`). That fixed the immediate breakage, but it also means a mobile user now sees zero headline numbers — the single most scannable piece of "how are we doing" information is just gone, right when the (also broken) Category table is the next thing they see.
Fix: replace outright hiding with a condensed mobile variant (2×2 grid or horizontal scroll) so the KPI numbers survive on mobile without the overflow that caused the original removal.
Suggested command: `/impeccable adapt`.

**[P2] One WCAG AA contrast failure, caught only by the automated scan.**
Why it matters: `button.mobile-action-btn.receive` renders text at 4.4:1 against its background — just under the 4.5:1 minimum DESIGN.md itself mandates. Easy to miss visually; exactly the kind of near-miss a manual review won't catch reliably.
Fix: darken the button's background or lighten the text by a shade to clear 4.5:1.
Suggested command: `/impeccable audit`.

#### Persona Red Flags

**Alex (impatient power user)**: Filters by category expecting the Category Overview table to match the KPI cards above it, and immediately hits a contradiction — filtered KPIs say 6 reagents, the table says 0. Alex will assume either the filter or the whole report is broken, and will stop trusting the turnover % figure entirely — exactly the user who'd otherwise rely on it most.

**Sam (accessibility-dependent, keyboard/screen-reader, WCAG AA)**: The Critical Reorders count badge (`{criticalReorders.length} รายการ`) is a plain `<span>` with no `aria-live` region — a screen-reader user changing filters gets no announcement that the reorder count changed, so a newly-filtered-in critical item could go unnoticed. Separately, the 4.4:1 contrast miss on the mobile receive button directly affects Sam's ability to read it at all under AA-compliant assumptions.

#### Minor Observations

- DESIGN.md documents a light palette (`#F6F7FB` background, white cards); the shipped app renders dark-navy throughout, which CLAUDE.md confirms is intentional. Whichever doc is authoritative should be reconciled — this single gap is very likely the root cause of most of the detector's "cyan on dark" / "dark glow" false positives.
- The 🎉 emoji in the empty state is the one moment of visual register mismatch against an otherwise clinical, restrained screen.
- "เบิกสะสม" (cumulative issued) column header in the Category table doesn't state its time range — ambiguous whether it's all-time or scoped to the period toggle above it.
- Chart-legend swatch colors (`#2E9E63`, `#1387A6`) are hardcoded rather than tokenized; both are near-misses of the documented brand teal family and could be pulled from tokens instead.
- IBM Plex Mono is correctly used for the chart's numeric axis/value labels, consistent with DESIGN.md's mono-for-numbers rule — nice attention to detail there specifically.

#### Questions to Consider

1. If the Category Overview table has been silently showing all zeros since it shipped, has anyone using this dashboard actually noticed — and if not, is it dead weight nobody looks at, which changes whether it's worth fixing vs. removing?
2. This screen is simultaneously a live filtering tool and a formal printable report. Should those be two modes (a lightweight daily-glance dashboard vs. a separate "generate report" flow with the date-range/print machinery), rather than one screen serving a 10-second glance and a formal monthly sign-off?
3. Given this is safety-critical clinical stock data, should any filter-dependent computed value (turnover %, top category, KPI counts) carry a lightweight self-check — e.g. "reagent count > 0 but every category shows 0 → data-integrity warning" — so a bug like this one fails loudly instead of silently next time?
