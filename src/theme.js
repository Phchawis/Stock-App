// Content-area theme — palette built from the three approved swatches:
//   #9ED7E6 (primary accent) · #AFDAE0 (soft accent) · #8DBBCC (muted accent)
// Scoped to the main content wrapper (and the detail drawer) so the sidebar
// keeps its own look. --brand-700 stays a deep tone of the same hue because
// screens paint white text on top of it.
export const contentTheme = `
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
  --border-brand:#9ED7E6;
  --brand-900:#D6F1F7;
  --brand-800:#9ED7E6;
  --brand-700:#33839E;
  --brand-600:#5FA9C0;
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
`;
