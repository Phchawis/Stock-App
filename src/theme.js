// Content-area theme — "Emerald Ocean", a single committed look built from the
// approved teal-green ramp:
//   #003830 · #004F4B · #006884 · #008276 · #33A593 · #70C4B4
// Scoped to the main content wrapper (and the detail drawer) so the sidebar
// keeps its own look. --brand-700 is tuned to #0E9587 — the one tone in this
// ramp readable both as text on the dark glass cards (~3.1:1) and under the
// white text screens paint on solid brand buttons (~3.8:1).
//
// Layout hooks consumed by Main.jsx:
//   --content-glass-top     header strip (translucent, sits under blur)
//   --content-glass-bottom  mobile action bar
//   --content-ambient       full background value for <main> (glow gradients)
export const contentTheme = `
  --surface-page:#03201D;
  --surface-card:rgba(6, 54, 49, 0.55);
  --surface-sunken:rgba(2, 30, 27, 0.6);
  --white:rgba(7, 58, 52, 0.75);
  --surface-inverse:#ECF7F4;
  --text-primary:#ECF7F4;
  --text-secondary:#9FD9CC;
  --text-tertiary:#70C4B4;
  --text-link:#70C4B4;
  --text-disabled:#3E7C72;
  --border-subtle:rgba(112,196,180,.15);
  --border-default:rgba(112,196,180,.27);
  --border-strong:rgba(112,196,180,.45);
  --border-brand:#70C4B4;
  --brand-900:#A8E1D6;
  --brand-800:#70C4B4;
  --brand-700:#0E9587;
  --brand-600:#1FA090;
  --brand-500:#33A593;
  --brand-400:#70C4B4;
  --brand-300:#9FD9CC;
  --brand-100:rgba(112,196,180,.18);
  --brand-50:rgba(112,196,180,.10);
  --teal-900:#A8E1D6;
  --teal-800:#70C4B4;
  --teal-700:#33A593;
  --teal-600:#1FA090;
  --teal-500:#33A593;
  --teal-300:#9FD9CC;
  --teal-100:rgba(112,196,180,.18);
  --teal-50:rgba(112,196,180,.10);
  --blue-700:#7FC9DC;
  --blue-600:#9AD6E5;
  --blue-100:rgba(0,104,132,.25);
  --slate-700:#9FD9CC;
  --slate-600:#70C4B4;
  --slate-500:#58948A;
  --slate-400:#3E7C72;
  --slate-300:#175A50;
  --slate-200:#10473F;
  --slate-100:#0A3A34;
  --slate-50:#07302B;
  --glow-brand:0 0 24px rgba(112,196,180,.28);
  --glow-brand-soft:0 6px 18px -8px rgba(112,196,180,.4);
  --content-glass-top:rgba(3, 32, 29, 0.7);
  --content-glass-bottom:rgba(3, 32, 29, 0.85);
  --content-bar-shadow:0 -8px 24px rgba(0,0,0,.35);
  --content-ambient:radial-gradient(1100px 520px at 85% -10%, rgba(112,196,180,.10), transparent 60%), radial-gradient(900px 480px at -10% 30%, rgba(0,104,132,.14), transparent 55%), radial-gradient(760px 420px at 55% 115%, rgba(51,165,147,.09), transparent 60%), var(--surface-page);
`;

// Header strip for the light-scoped modals (Receive / Issue / Register).
// Solid tone requested by the user (#7AA2C4), lifted into a subtle gradient
// with white text so it reads as an intentional banner, not a flat block.
export const modalHeaderStyle = `
  padding:18px 22px;
  display:flex;
  align-items:center;
  gap:11px;
  background:linear-gradient(135deg, #7AA2C4 0%, #93B9E1 100%);
  border-radius:10px 10px 0 0;
  border-bottom:1px solid rgba(255,255,255,.28);
  box-shadow:0 2px 10px -4px rgba(58,90,120,.45);
`;
export const modalHeaderBadgeStyle = `
  width:34px; height:34px;
  border-radius:var(--radius-md);
  background:rgba(255,255,255,.22);
  border:1px solid rgba(255,255,255,.38);
  color:#ffffff;
  display:grid;
  place-items:center;
  flex-shrink:0;
`;
export const modalHeaderTitleStyle = `font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:#ffffff;`;
export const modalHeaderSubtitleStyle = `font:var(--text-2xs)/1.3 var(--font-body); color:rgba(255,255,255,.85);`;
export const modalHeaderCloseStyle = `
  border:none;
  background:rgba(255,255,255,.2);
  cursor:pointer;
  padding:6px;
  border-radius:var(--radius-sm);
  color:#ffffff;
  display:grid;
  place-items:center;
  transition:background var(--dur-fast);
`;
