// Content-area themes — four selectable looks, all built around the three
// approved swatches: #A9C7EE (light periwinkle) · #93B9E1 (mid) · #7AA2C4 (muted).
// Scoped to the main content wrapper (and the detail drawer) so the sidebar
// keeps its own look. --brand-700 stays a deep tone of the same hue in every
// option because screens paint white text on top of it.
//
// Each option also defines three layout hooks consumed by Main.jsx:
//   --content-glass-top     header strip (translucent, sits under blur)
//   --content-glass-bottom  mobile action bar
//   --content-ambient       full background value for <main> (glow gradients)

const brandCore = `
  --brand-700:#4E7CB0;
  --brand-600:#6390BE;
  --border-brand:#A9C7EE;
`;

export const contentThemes = {
  indigo: {
    id: 'indigo',
    label: 'แบบที่ 1 · Indigo Night (น้ำเงินเข้มกลางคืน)',
    swatch: 'linear-gradient(135deg, #0A1220 50%, #A9C7EE 50%)',
    vars: `
      ${brandCore}
      --surface-page:#0A1220;
      --surface-card:#121D31;
      --surface-sunken:#070D18;
      --white:#121D31;
      --surface-inverse:#EEF4FC;
      --text-primary:#EEF4FC;
      --text-secondary:#A9C7EE;
      --text-tertiary:#93B9E1;
      --text-disabled:#55688A;
      --text-link:#A9C7EE;
      --border-subtle:rgba(169,199,238,.14);
      --border-default:rgba(169,199,238,.26);
      --border-strong:rgba(147,185,225,.44);
      --brand-900:#D8E6FA;
      --brand-800:#A9C7EE;
      --brand-500:#7AA2C4;
      --brand-400:#93B9E1;
      --brand-300:#C3D8F4;
      --brand-100:rgba(169,199,238,.18);
      --brand-50:rgba(169,199,238,.10);
      --blue-700:#93B9E1;
      --blue-600:#A9C7EE;
      --blue-100:rgba(169,199,238,.16);
      --slate-700:#AECBEE;
      --slate-600:#93B9E1;
      --slate-500:#7C90AE;
      --slate-400:#4A5F82;
      --slate-300:#2F4260;
      --slate-200:#233350;
      --slate-100:#182740;
      --slate-50:#131F33;
      --glow-brand:0 10px 30px -10px rgba(169,199,238,.35);
      --glow-brand-soft:0 6px 18px -8px rgba(169,199,238,.28);
      --content-glass-top:rgba(10,18,32,0.72);
      --content-glass-bottom:rgba(10,18,32,0.85);
      --content-bar-shadow:0 -8px 24px rgba(0,0,0,.35);
      --content-ambient:radial-gradient(1100px 520px at 85% -10%, rgba(169,199,238,.10), transparent 60%), radial-gradient(900px 480px at -10% 30%, rgba(147,185,225,.06), transparent 55%), radial-gradient(760px 420px at 55% 115%, rgba(122,162,196,.09), transparent 60%), var(--surface-page);
    `,
  },

  slate: {
    id: 'slate',
    label: 'แบบที่ 2 · Slate Dusk (เทาน้ำเงินนุ่ม)',
    swatch: 'linear-gradient(135deg, #273448 50%, #93B9E1 50%)',
    vars: `
      ${brandCore}
      --surface-page:#1C2534;
      --surface-card:#273448;
      --surface-sunken:#161E2B;
      --white:#273448;
      --surface-inverse:#EFF4FB;
      --text-primary:#EFF4FB;
      --text-secondary:#BCD2F1;
      --text-tertiary:#93B9E1;
      --text-disabled:#64789A;
      --text-link:#A9C7EE;
      --border-subtle:rgba(169,199,238,.16);
      --border-default:rgba(169,199,238,.28);
      --border-strong:rgba(147,185,225,.46);
      --brand-900:#D8E6FA;
      --brand-800:#A9C7EE;
      --brand-500:#7AA2C4;
      --brand-400:#93B9E1;
      --brand-300:#C3D8F4;
      --brand-100:rgba(169,199,238,.20);
      --brand-50:rgba(169,199,238,.12);
      --blue-700:#93B9E1;
      --blue-600:#A9C7EE;
      --blue-100:rgba(169,199,238,.18);
      --slate-700:#B4CDEE;
      --slate-600:#93B9E1;
      --slate-500:#7C90AE;
      --slate-400:#5A7092;
      --slate-300:#41557A;
      --slate-200:#344663;
      --slate-100:#293A54;
      --slate-50:#223146;
      --glow-brand:0 10px 30px -10px rgba(169,199,238,.3);
      --glow-brand-soft:0 6px 18px -8px rgba(169,199,238,.24);
      --content-glass-top:rgba(28,37,52,0.74);
      --content-glass-bottom:rgba(28,37,52,0.9);
      --content-bar-shadow:0 -8px 24px rgba(0,0,0,.3);
      --content-ambient:linear-gradient(180deg, rgba(169,199,238,.05) 0%, transparent 240px), radial-gradient(900px 460px at 100% 0%, rgba(122,162,196,.09), transparent 55%), var(--surface-page);
    `,
  },

  sky: {
    id: 'sky',
    label: 'แบบที่ 3 · Sky Light (สว่าง ขาว-ฟ้า)',
    swatch: 'linear-gradient(135deg, #FFFFFF 50%, #7AA2C4 50%)',
    vars: `
      ${brandCore}
      --surface-page:#E9F0FA;
      --surface-card:#FFFFFF;
      --surface-sunken:#DCE7F5;
      --white:#FFFFFF;
      --surface-inverse:#1B3049;
      --text-primary:#1B3049;
      --text-secondary:#3A5A80;
      --text-tertiary:#5A7192;
      --text-disabled:#93A6BE;
      --text-link:#35608F;
      --border-subtle:#C6D8EE;
      --border-default:#A9C7EE;
      --border-strong:#93B9E1;
      --border-brand:#4E7CB0;
      --brand-900:#274E79;
      --brand-800:#35608F;
      --brand-500:#7AA2C4;
      --brand-400:#93B9E1;
      --brand-300:#A9C7EE;
      --brand-100:rgba(78,124,176,.14);
      --brand-50:rgba(78,124,176,.08);
      --blue-700:#3A5A80;
      --blue-600:#35608F;
      --blue-100:rgba(78,124,176,.12);
      --green-700:#1E8E5C;
      --amber-700:#A9700F;
      --red-700:#C64B40;
      --slate-700:#3E5468;
      --slate-600:#5A7192;
      --slate-500:#7288A6;
      --slate-400:#93A6BE;
      --slate-300:#B6C8DE;
      --slate-200:#D0DEF0;
      --slate-100:#E3ECF8;
      --slate-50:#F1F6FC;
      --shadow-xs:0 1px 2px rgba(27,48,73,.08);
      --shadow-sm:0 1px 3px rgba(27,48,73,.12), 0 1px 2px rgba(27,48,73,.08);
      --shadow-md:0 4px 12px -2px rgba(27,48,73,.14);
      --shadow-lg:0 16px 32px -8px rgba(27,48,73,.2);
      --glow-brand:0 10px 30px -10px rgba(78,124,176,.3);
      --glow-brand-soft:0 6px 18px -8px rgba(78,124,176,.22);
      --content-glass-top:rgba(255,255,255,0.78);
      --content-glass-bottom:rgba(255,255,255,0.92);
      --content-bar-shadow:0 -8px 24px rgba(27,48,73,.14);
      --content-ambient:radial-gradient(1100px 520px at 85% -10%, rgba(169,199,238,.32), transparent 60%), radial-gradient(900px 480px at -10% 30%, rgba(122,162,196,.14), transparent 55%), var(--surface-page);
    `,
  },

  royal: {
    id: 'royal',
    label: 'แบบที่ 4 · Royal Blue (น้ำเงินเต็มพื้น)',
    swatch: 'linear-gradient(135deg, #26436E 50%, #A9C7EE 50%)',
    vars: `
      --brand-700:#203D63;
      --brand-600:#2C4E7D;
      --border-brand:#A9C7EE;
      --surface-page:#26436E;
      --surface-card:#2F4B78;
      --surface-sunken:#1E3A5F;
      --white:#2F4B78;
      --surface-inverse:#F2F6FD;
      --text-primary:#F2F6FD;
      --text-secondary:#C9DAF4;
      --text-tertiary:#A9C7EE;
      --text-disabled:#7B95BC;
      --text-link:#C9DAF4;
      --border-subtle:rgba(169,199,238,.22);
      --border-default:rgba(169,199,238,.34);
      --border-strong:rgba(201,218,244,.5);
      --brand-900:#E2ECFB;
      --brand-800:#C9DAF4;
      --brand-500:#7AA2C4;
      --brand-400:#93B9E1;
      --brand-300:#C3D8F4;
      --brand-100:rgba(169,199,238,.24);
      --brand-50:rgba(169,199,238,.14);
      --blue-700:#A9C7EE;
      --blue-600:#C9DAF4;
      --blue-100:rgba(169,199,238,.2);
      --green-700:#8FE6BC;
      --amber-700:#F5D48E;
      --red-700:#F5A8A2;
      --slate-700:#C9DAF4;
      --slate-600:#A9C7EE;
      --slate-500:#8AA6CC;
      --slate-400:#6C89B2;
      --slate-300:#52719F;
      --slate-200:#40608F;
      --slate-100:#33517F;
      --slate-50:#2B4874;
      --glow-brand:0 10px 30px -10px rgba(10,25,50,.5);
      --glow-brand-soft:0 6px 18px -8px rgba(10,25,50,.4);
      --content-glass-top:rgba(30,58,95,0.75);
      --content-glass-bottom:rgba(30,58,95,0.9);
      --content-bar-shadow:0 -8px 24px rgba(10,25,50,.4);
      --content-ambient:radial-gradient(1100px 520px at 85% -10%, rgba(169,199,238,.16), transparent 60%), radial-gradient(900px 480px at -10% 40%, rgba(147,185,225,.1), transparent 55%), var(--surface-page);
    `,
  },
};

export const themeChoices = Object.values(contentThemes).map(({ id, label, swatch }) => ({ id, label, swatch }));

// Default (also used as a fallback when a stored id no longer exists).
export const contentTheme = contentThemes.indigo.vars;

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
