// Content-area themes — three selectable looks, all built around the three
// approved swatches: #9ED7E6 (primary) · #AFDAE0 (soft) · #8DBBCC (muted).
// Scoped to the main content wrapper (and the detail drawer) so the sidebar
// keeps its own look. --brand-700 stays a deep tone of the same hue in every
// option because screens paint white text on top of it.
//
// Each option also defines three layout hooks consumed by Main.jsx:
//   --content-glass-top     header strip (translucent, sits under blur)
//   --content-glass-bottom  mobile action bar
//   --content-ambient       full background value for <main> (glow gradients)

const brandCore = `
  --brand-700:#33839E;
  --brand-600:#5FA9C0;
  --border-brand:#9ED7E6;
`;

export const contentThemes = {
  ocean: {
    id: 'ocean',
    label: 'แบบที่ 1 · Deep Ocean (น้ำเงินเข้มลึก)',
    swatch: 'linear-gradient(135deg, #081119 50%, #9ED7E6 50%)',
    vars: `
      ${brandCore}
      --surface-page:#081119;
      --surface-card:#0F1E29;
      --surface-sunken:#060D14;
      --white:#0F1E29;
      --surface-inverse:#EDF7F9;
      --text-primary:#EDF7F9;
      --text-secondary:#AFDAE0;
      --text-tertiary:#8DBBCC;
      --text-link:#9ED7E6;
      --text-disabled:#56707C;
      --border-subtle:rgba(158,215,230,.13);
      --border-default:rgba(158,215,230,.24);
      --border-strong:rgba(141,187,204,.42);
      --brand-900:#D6F1F7;
      --brand-800:#9ED7E6;
      --brand-500:#8DBBCC;
      --brand-400:#AFDAE0;
      --brand-300:#C4E7EE;
      --brand-100:rgba(158,215,230,.18);
      --brand-50:rgba(158,215,230,.10);
      --blue-700:#8DBBCC;
      --blue-600:#9ED7E6;
      --blue-100:rgba(158,215,230,.16);
      --slate-700:#A3C3D1;
      --slate-600:#8DBBCC;
      --slate-500:#7C99A8;
      --slate-400:#4A6B7E;
      --slate-300:#2E4A5E;
      --slate-200:#22394A;
      --slate-100:#182B38;
      --slate-50:#13232E;
      --glow-brand:0 10px 30px -10px rgba(158,215,230,.35);
      --glow-brand-soft:0 6px 18px -8px rgba(158,215,230,.28);
      --content-glass-top:rgba(8,17,25,0.72);
      --content-glass-bottom:rgba(8,17,25,0.85);
      --content-bar-shadow:0 -8px 24px rgba(0,0,0,.35);
      --content-ambient:radial-gradient(1100px 520px at 85% -10%, rgba(158,215,230,.10), transparent 60%), radial-gradient(900px 480px at -10% 30%, rgba(175,218,224,.06), transparent 55%), radial-gradient(760px 420px at 55% 115%, rgba(141,187,204,.08), transparent 60%), var(--surface-page);
    `,
  },

  mist: {
    id: 'mist',
    label: 'แบบที่ 2 · Slate Mist (เทาน้ำเงินนุ่ม)',
    swatch: 'linear-gradient(135deg, #243240 50%, #AFDAE0 50%)',
    vars: `
      ${brandCore}
      --surface-page:#1A2530;
      --surface-card:#243240;
      --surface-sunken:#151E27;
      --white:#243240;
      --surface-inverse:#EFF6F8;
      --text-primary:#EFF6F8;
      --text-secondary:#BFDCE3;
      --text-tertiary:#8DBBCC;
      --text-link:#9ED7E6;
      --text-disabled:#61798A;
      --border-subtle:rgba(158,215,230,.16);
      --border-default:rgba(158,215,230,.28);
      --border-strong:rgba(141,187,204,.46);
      --brand-900:#D6F1F7;
      --brand-800:#9ED7E6;
      --brand-500:#8DBBCC;
      --brand-400:#AFDAE0;
      --brand-300:#C4E7EE;
      --brand-100:rgba(158,215,230,.20);
      --brand-50:rgba(158,215,230,.12);
      --blue-700:#8DBBCC;
      --blue-600:#9ED7E6;
      --blue-100:rgba(158,215,230,.18);
      --slate-700:#A8C8D5;
      --slate-600:#8DBBCC;
      --slate-500:#7C99A8;
      --slate-400:#587880;
      --slate-300:#3E5A6E;
      --slate-200:#31485A;
      --slate-100:#263947;
      --slate-50:#20303C;
      --glow-brand:0 10px 30px -10px rgba(158,215,230,.3);
      --glow-brand-soft:0 6px 18px -8px rgba(158,215,230,.24);
      --content-glass-top:rgba(26,37,48,0.74);
      --content-glass-bottom:rgba(26,37,48,0.9);
      --content-bar-shadow:0 -8px 24px rgba(0,0,0,.3);
      --content-ambient:linear-gradient(180deg, rgba(158,215,230,.05) 0%, transparent 240px), radial-gradient(900px 460px at 100% 0%, rgba(141,187,204,.08), transparent 55%), var(--surface-page);
    `,
  },

  arctic: {
    id: 'arctic',
    label: 'แบบที่ 3 · Arctic Light (สว่าง ขาว-ฟ้า)',
    swatch: 'linear-gradient(135deg, #FFFFFF 50%, #7AA2C4 50%)',
    vars: `
      ${brandCore}
      --surface-page:#E8F1F7;
      --surface-card:#FFFFFF;
      --surface-sunken:#DCE9F1;
      --white:#FFFFFF;
      --surface-inverse:#16323F;
      --text-primary:#16323F;
      --text-secondary:#33607A;
      --text-tertiary:#587880;
      --text-link:#2E7A96;
      --text-disabled:#8FA9B5;
      --border-subtle:#C4DBE6;
      --border-default:#A7C8D6;
      --border-strong:#8DBBCC;
      --brand-900:#0F4D61;
      --brand-800:#1F6B85;
      --brand-500:#6FA9BE;
      --brand-400:#8DBBCC;
      --brand-300:#AFDAE0;
      --brand-100:rgba(51,131,158,.14);
      --brand-50:rgba(51,131,158,.08);
      --blue-700:#33607A;
      --blue-600:#2E7A96;
      --blue-100:rgba(51,131,158,.12);
      --slate-700:#3E5A68;
      --slate-600:#587880;
      --slate-500:#6E8996;
      --slate-400:#8FA9B5;
      --slate-300:#B3CCD9;
      --slate-200:#CFE1EA;
      --slate-100:#E3EEF4;
      --slate-50:#F1F7FA;
      --shadow-xs:0 1px 2px rgba(22,50,63,.08);
      --shadow-sm:0 1px 3px rgba(22,50,63,.12), 0 1px 2px rgba(22,50,63,.08);
      --shadow-md:0 4px 12px -2px rgba(22,50,63,.14);
      --shadow-lg:0 16px 32px -8px rgba(22,50,63,.2);
      --glow-brand:0 10px 30px -10px rgba(51,131,158,.3);
      --glow-brand-soft:0 6px 18px -8px rgba(51,131,158,.22);
      --content-glass-top:rgba(255,255,255,0.78);
      --content-glass-bottom:rgba(255,255,255,0.92);
      --content-bar-shadow:0 -8px 24px rgba(22,50,63,.14);
      --content-ambient:radial-gradient(1100px 520px at 85% -10%, rgba(158,215,230,.30), transparent 60%), radial-gradient(900px 480px at -10% 30%, rgba(122,162,196,.14), transparent 55%), var(--surface-page);
    `,
  },
};

export const themeChoices = Object.values(contentThemes).map(({ id, label, swatch }) => ({ id, label, swatch }));

// Default (also used as a fallback when a stored id no longer exists).
export const contentTheme = contentThemes.ocean.vars;

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
