# CLAUDE.md — Architecture & handoff notes

Context for any AI/developer continuing this project. The app is a **single-lab
reagent (น้ำยา) inventory prototype** for TUH (โรงพยาบาลธรรมศาสตร์ฯ) medical-lab,
originally authored in Claude Design and converted to a standard React + Vite app.

## Stack & entry

- React 18, Vite 6, plain JSX (no TypeScript), ES modules.
- `src/main.jsx` mounts `<App>` inside an `ErrorBoundary`, and sets
  `window.lucide = { icons }` from the `lucide` npm package. **Important:** lucide
  exports each icon as a full `["svg", attrs, children]` node, but `App.icon()`
  expects just the **children array**, so main.jsx unwraps `node[2]`. Keep this if
  you change the icon source.
- No router, no global state lib. One class component (`App`) holds all UI state.
- **Backend**: Cloudflare Pages Functions in `functions/api/*` backed by a **D1
  (SQLite) database** bound as `env.DB`. The frontend talks to it over `/api/*`.
  The binding is configured per Pages project (dashboard → Settings → Functions →
  D1 bindings) and documented in `wrangler.toml` — it does NOT travel with the Git
  repo, so a new Pages project needs the binding re-added or login breaks.

## Backend & auth (`functions/api/`)

- `_middleware.js` runs before every `/api/*` request: it validates the session
  token (D1 `sessions` table) and attaches `context.data.auth = { username, role }`.
  Only `/api/login` and `/api/logout` are public.
- `_lib.js` — shared helpers: PBKDF2 password hashing/verify, session token
  issue/lookup, `requirePerm(context, { perm | adminOnly })` authorization guard,
  `actorName()` (trustworthy audit "by"), and `nowStr()` (Bangkok UTC+7 timestamp).
- **Authorization is enforced server-side**, not just in the UI. Each write
  endpoint calls `requirePerm`: reagents POST/PUT → `manage`, DELETE → adminOnly;
  lots POST → `receive`; issue POST → `issue`; users POST/DELETE → `users`;
  transactions DELETE + permissions PUT → adminOnly. The role→perm matrix lives in
  the D1 `permissions` table and is editable by admins (persisted, not just state).
- Passwords are salted+hashed (PBKDF2). Legacy plaintext rows upgrade transparently
  on the user's next successful login. `GET /api/users` never returns passwords.
- Login flow: `POST /api/login` → `{ token, user }`; the frontend stores the token
  in `localStorage` (`authToken`/`authUser`) and sends `Authorization: Bearer` via
  `App.api()`, which auto-signs-out on 401.

## Database

- Schema + seed: `migrations/0000_init.sql`; auth tables: `migrations/0001_auth_permissions.sql`.
- Apply with `wrangler d1 execute <db> --file=migrations/000X_*.sql` (add `--local`
  for local dev). Local end-to-end dev: `wrangler pages dev dist` (serves Functions
  + D1). Plain `npm run dev` serves the UI only — `/api/*` will 404.

## Component structure

`App` (`src/App.jsx`) is a `React.Component` subclass holding **all state, domain
logic, and the `renderVals()` view-model** (~330 lines). Its `render()` is thin:
it computes `const v = this.renderVals()` once and passes `v` to presentational
components, each of which destructures the keys it needs:

```
App (state + logic + renderVals)
├─ layout/Sidebar.jsx     nav rail
├─ layout/Main.jsx        top bar + <main>, composes the 5 screens:
│   ├─ screens/Dashboard.jsx
│   ├─ screens/Inventory.jsx
│   ├─ screens/Alerts.jsx
│   ├─ screens/Audit.jsx
│   └─ screens/Perms.jsx
├─ screens/DetailDrawer.jsx   reagent detail (slide-over)
├─ screens/ReceiveModal.jsx
├─ screens/IssueModal.jsx     FEFO issue
├─ components/Toast.jsx
└─ screens/Login.jsx
```

Every presentational component has the same shape: `function X({ v }) { const {…} =
v; return (…jsx…); }`. **All data and event handlers live in `App.renderVals()`** —
to add UI, add a value there and read it via `v` in the relevant component. Screen
components keep their own `{isX ? … : null}` visibility guard internally.

`App` itself was ported verbatim from the prototype's controller class.

### Data model (mock, in `constructor` → `this.state`)

- `reagents[]` — master list. `{ id, code, th, en, cat, unit, storage, min, reorder, supplier }`
  - `cat`: CHE/HEM/IMM/MIP/MDC (lab section). `storage`: REFRIGERATED_2_8 / FROZEN_20 / FROZEN_80 / ROOM_TEMP.
- `lots[]` — stock lots per reagent. `{ id, rid, lot, expiry, recv, qty, loc, qr, status }` (status ACTIVE/DEPLETED).
- `txns[]` — movement log. `{ id, lotId, rid, type, qty, bal, ref, scan, by, at }` (type RECEIVE/ISSUE/ADJUST/DISPOSE).
- `perms` — `{ roleId: { view, receive, issue, manage, ack, users, settings } }` (0/1).
- UI state: `view`, `role`, `invTab`, `search`, `detailId`, `modal`, `toast`, `acked`, `rf` (receive form), `iform` (issue form), `loginForm`, `seqLot`/`seqTxn` (id counters).
- `this.today = 2026-06-29` is **pinned** so expiry math is deterministic. `nowStr()` also hardcodes that date.

### Domain logic (key methods)

- `onHand(rid)`, `activeLots(rid)`, `earliest(rid)` — stock rollups.
- `days(date)` → days until expiry; `sev(days, crit)` → `critical|warning|watch|ok`
  (thresholds: ≤crit, ≤2·crit, ≤3·crit). `crit` = `props.criticalDays` (default 30).
- `buildAlerts(crit)` — expiry + reorder alerts, minus `acked`.
- `issuePlan(crit)` / `submitIssue()` — **FEFO**: consume lots sorted by earliest expiry.
- `submitReceive()` — append a new lot + RECEIVE txn.
- `can(perm)`, `login(id)`, `togglePerm()` — role/permission gating.
- `icon(name, size, color, sw)` — builds an SVG from `window.lucide.icons[name]`.

### View-model pattern (how rendering works)

`renderVals()` returns a **flat object** (~77 keys) — every label, style flag,
list, and event handler the UI needs, fully derived from state. `render()` does:

```jsx
render() {
  const { /* all 77 keys */ } = this.renderVals();
  return ( /* JSX referencing those names directly */ );
}
```

So **all UI-facing data/handlers live in `renderVals()`**; the JSX is mostly
presentational. When adding a feature: compute new values in `renderVals()`, then
reference them in the JSX. Loop variables in `.map(...)` (named `r`, `k`, `a`, `t`,
`p`, `d`, `l`, `c`) are local and do not collide with the destructured names.

## Styling

- Design tokens (`--brand-*`, `--text-*`, `--radius-*`, `--type-*`, `--teal-*`,
  fonts, keyframes, `.qms-rise`/`.qrow`) live in `src/styles.css`.
- The app's **root `<div>` sets all color/spacing tokens inline** (dark theme),
  scoping them to the app subtree.
- Inline styles use the `css()` helper (`src/css.js`): it parses a CSS string into
  a React style object, keeping `--custom-properties` verbatim and camelCasing the
  rest. Pattern: `style={css(\`display:flex; color:${someColor}\`)}`. This is why
  the converted markup reads like CSS rather than JS objects.

## Components (`src/components/`)

`Input`, `Select`, `Tabs` — ported from the **TUH Lab QMS Design System**. They
spread `...rest` onto native elements, so `value` + `onChange` work as normal
controlled inputs. `Tabs`/`Select` call `onChange(value)`; the form-binding
handlers in `App` accept either an event or a raw value.

## Suggested next steps (not yet done)

- **Bundle size**: importing all of `lucide` is ~1 MB. Switch to per-icon imports
  (or `lucide-react`) and adapt `icon()` to trim it.
- **Session hardening**: tokens live in `localStorage` (12 h expiry). For higher
  security consider httpOnly cookies and CSRF protection; add rate-limiting on
  `/api/login`.
- **Pagination**: `transactions`/`lots` GET return the whole table — add paging
  once history grows large.
- Form validation is minimal (toast-based); add inline field errors via the
  `Input`/`Select` `error`/`hint` props (already supported by the components).

Done previously: converted from the standalone prototype to Vite+React, split into
components, moved to a D1 backend with **server-side auth + hashed passwords +
persisted permissions**, and un-pinned the system date (`new Date()`).

## History

`index.html` + the original 1.3 MB standalone export were unpacked, then the
`dc`-runtime template (`{{ }}` / `<sc-for>` / `<sc-if>` / `<x-import>`) was
mechanically converted to JSX. Verified working: login, dashboard, inventory
(tabs/search/rows), receive modal (select/input/date), role permissions.
