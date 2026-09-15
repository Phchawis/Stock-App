# Design and mobile handoff — 2026-09-15

The requested design, semantic-color and mobile interface work is implemented.
The user requested pushing the local `main` branch so Claude can continue from
GitHub. This change accompanies the earlier local design commits already on main.

## Where to continue

- `src/main.jsx` imports CSS in order: `styles.css`, `redesign.css`, `mobile.css`.
  Preserve this order: later files override legacy inline/component styles.
- `src/redesign.css`: shared surfaces, teal primary actions, neutral issue
  launchers, semantic status colors and pale teal form scopes.
- `src/mobile.css`: full-width mobile workspace, navigation drawer, bottom action
  bar, content-sized forms, stacked issue summaries, responsive stock-count and
  preparation records, filters and narrow layouts. Mobile breakpoint is 768px.
- `src/layout/Sidebar.jsx`: mobile focus containment, Escape, focus return and
  workspace inert handling. Desktop keeps the persistent sidebar.
- `src/components/StockOverview.jsx`: existing dashboard expiry infographic;
  counts come from `App.renderVals()`, independently of report filters.
- `DESIGN.md` contains palette roles and the detailed mobile refinement notes.

## Validation and limits

- `npm run build` passed; the existing >500 kB chunk warning remains.
- `npm test` passed all 36 domain tests.
- `git diff --check` passed.
- Browser review used temporary sample data at 320, 360 and 390px, plus 740×360
  landscape and a desktop sidebar check. Reviewed menu/keyboard navigation,
  inventory with long names, receive form, issue lot lookup and allocation
  preview, count inputs/differences/reasons, audit filters, sticker creation and
  preparation records. All temporary preview entry files were removed.
- No live stock writes were performed. Physical iOS/Android keyboard, camera and
  safe-area behavior still need device validation. Printed output was not
  exercised during this pass; new responsive rules are screen-scoped.
- A Git push does not by itself verify a Cloudflare deployment or D1 behavior.

## Existing project notes that are stale

AGENTS.md describes the original prototype in places. Follow the current source:
`App.api()` uses same-origin cookies and CSRF headers, `authUser` in sessionStorage
is a display cache, the system date is live, icons come from `src/icons.js`, and
there are more screens than the original five. Plain `npm run dev` serves the
frontend only; use the documented Cloudflare Pages/D1 setup for full API testing.
