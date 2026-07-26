// NOTE: the live content theme is the `.theme-content-teal` class in
// styles.css (applied by Main.jsx and DetailDrawer.jsx). A duplicate JS copy
// used to live here and silently drifted out of sync — edits to it had no
// effect on the app. Change tokens in styles.css.

// Header strip for the light-scoped modals (Receive / Issue / Register).
// Base tone requested by the user (#a4b0be), lifted into a subtle gradient
// with a faint teal cast at the end so it ties back to the main content
// theme. Title text is dark (#1b2b33) for clear contrast on the light band.
export const modalHeaderStyle = `
  padding:18px 22px;
  display:flex;
  align-items:center;
  gap:11px;
  background:linear-gradient(135deg, #a4b0be 0%, #9db3bc 100%);
  border-radius:10px 10px 0 0;
  border-bottom:1px solid rgba(255,255,255,.35);
  box-shadow:0 2px 10px -4px rgba(46,66,78,.4);
`;
export const modalHeaderBadgeStyle = `
  width:34px; height:34px;
  border-radius:var(--radius-md);
  background:rgba(255,255,255,.4);
  border:1px solid rgba(255,255,255,.55);
  color:#1b2b33;
  display:grid;
  place-items:center;
  flex-shrink:0;
`;
export const modalHeaderTitleStyle = `font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:#16242c;`;
export const modalHeaderSubtitleStyle = `font:var(--text-2xs)/1.3 var(--font-body); color:#38505b;`;
export const modalHeaderCloseStyle = `
  border:none;
  background:rgba(255,255,255,.32);
  cursor:pointer;
  padding:6px;
  border-radius:var(--radius-sm);
  color:#1b2b33;
  display:grid;
  place-items:center;
  flex-shrink:0;
  transition:background var(--dur-fast);
`;

// Rendered once per modal (via a <style> tag) so the shared header keeps the
// same tidy single-row layout on phones as on desktop: on narrow screens the
// title font + padding shrink so the long Thai heading stops wrapping into the
// icon/close button. Classes are added alongside the inline styles above; the
// !important rules win over the inline font-size only inside the media query.
export const modalHeaderResponsiveCSS = `
  @media (max-width: 640px) {
    .tuh-mhead { padding: 14px 16px !important; gap: 10px !important; }
    .tuh-mhead-title { font-size: var(--text-base) !important; line-height: 1.25 !important; }
    .tuh-mhead-sub { font-size: 11px !important; }
    .tuh-mhead-badge { width: 30px !important; height: 30px !important; }
  }
`;
