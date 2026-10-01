import React from 'react';
import { css } from '../css.js';
import { Tabs } from '../components/Tabs.jsx';

export function Inventory({ v }) {
  const {
    ic, isInv, invRows, invTabs, invTab, setInvTab,
    search, onSearch, hasInvRows, canManage, openRegister, user, invAllRows, stop,
  } = v;

  // Print options. Held as exclusions rather than selections, so "everything"
  // is the default and a machine or supplier added later is included without
  // anyone having to tick it. Hooks sit above the early return so their order
  // never changes between renders.
  const [printOpen, setPrintOpen] = React.useState(false);
  const [excl, setExcl] = React.useState({ kind: [], instrument: [], supplier: [] });
  const [includeOut, setIncludeOut] = React.useState(true);
  React.useEffect(() => {
    if (!printOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setPrintOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [printOpen]);

  if (!isInv) return null;

  // ── Stock summary for print ───────────────────────────────────────────────
  // Prints what the list is showing (tab and search included), split into what
  // is in stock and what is not, in category then name order. Tests come from
  // testsPerMainUnit — only where the registration actually carries a test
  // count; a box of wash bottles has none, and says so rather than guessing.
  const TH_MON = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  const thDate = (ymd) => {
    if (!ymd) return '—';
    const [y, m, d] = String(ymd).slice(0, 10).split('-').map(Number);
    return y && m && d ? `${d} ${TH_MON[m - 1]} ${y + 543}` : ymd;
  };
  const KIND_ORDER = { REAGENT: 0, CONTROL: 1, CALIBRATOR: 2 };
  const byCatKindName = (a, b) => (a.cat || '').localeCompare(b.cat || '')
    || (KIND_ORDER[a.kind] ?? 9) - (KIND_ORDER[b.kind] ?? 9)
    || a.th.localeCompare(b.th, 'th');
  const all = invAllRows || [];
  const NONE = '';                                   // "machine not assigned"
  const groupOpts = (field, labelOf) => {
    const counts = new Map();
    for (const r of all) counts.set(r[field], (counts.get(r[field]) || 0) + 1);
    return [...counts.entries()]
      .map(([value, count]) => ({ value, count, label: labelOf ? labelOf(value) : value }))
      .sort((a, b) => (a.value === NONE) - (b.value === NONE) || String(a.label).localeCompare(String(b.label)));
  };
  const KIND_LABEL = { REAGENT: 'Reagent', CONTROL: 'Control', CALIBRATOR: 'Calibrator' };
  const groups = [
    { field: 'kind', title: 'ประเภท', opts: groupOpts('kind', (v) => KIND_LABEL[v] || v)
        .sort((a, b) => (KIND_ORDER[a.value] ?? 9) - (KIND_ORDER[b.value] ?? 9)) },
    { field: 'instrument', title: 'เครื่อง', opts: groupOpts('instrument', (v) => v || 'ยังไม่ระบุเครื่อง') },
    { field: 'supplier', title: 'บริษัท', opts: groupOpts('supplier', (v) => v || 'ไม่ระบุ') },
  ];
  const picked = all.filter(r => groups.every(g => !excl[g.field].includes(r[g.field])));
  const printIn = picked.filter(r => r.onHand > 0).slice().sort(byCatKindName);
  const printOut = includeOut ? picked.filter(r => !(r.onHand > 0)).slice().sort(byCatKindName) : [];
  // Named on the sheet whenever a group is narrowed, so a printout for one
  // machine cannot be mistaken for the whole store.
  const scopeNote = groups
    .filter(g => excl[g.field].length > 0)
    .map(g => `${g.title}: ${g.opts.filter(o => !excl[g.field].includes(o.value)).map(o => o.label).join(', ') || '—'}`)
    .join(' · ');
  const toggle = (field, value) => setExcl(e => ({
    ...e, [field]: e[field].includes(value) ? e[field].filter(x => x !== value) : [...e[field], value],
  }));
  const setGroup = (field, on) => setExcl(e => ({
    ...e, [field]: on ? [] : groups.find(g => g.field === field).opts.map(o => o.value),
  }));
  const doPrint = () => {
    setPrintOpen(false);
    // After the dialog has gone: the print snapshot is taken from the page as
    // it is when print() is called.
    setTimeout(() => window.print(), 250);
  };
  const printedAt = (() => {
    const d = new Date();
    return `${d.getDate()} ${TH_MON[d.getMonth()]} ${d.getFullYear() + 543} เวลา ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`;
  })();

  const printStyle = `
    @page { size: A4 portrait; margin: 1.6cm 1.4cm; }
    @media print {
      *, *::before, *::after {
        background-color: transparent !important; color: #000000 !important;
        box-shadow: none !important; text-shadow: none !important;
      }
      html, body, #root, main, .qms-rise, .print-report-container, .print-report-container * {
        background: #ffffff !important; background-color: #ffffff !important; color: #000000 !important;
      }
      html, body, #root, #root > div, main, .qms-rise {
        height: auto !important; min-height: auto !important; overflow: visible !important;
        display: block !important; position: static !important;
      }
      aside, header, button, .no-print, nav, .qms-rise > *:not(.print-report-container),
      [class*="Sidebar"], [class*="Header"] { display: none !important; }
      main, .qms-rise { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
      .print-report-container {
        display: block !important; width: 18cm !important; max-width: 18cm !important;
        margin: 0 auto !important; box-sizing: border-box; padding: 0 !important;
      }
      .report-table { width: 100% !important; border-collapse: collapse !important; margin-top: 8px !important; margin-bottom: 14px !important; }
      .report-table th, .report-table td {
        border: 1px solid #bcbcbc !important; padding: 4px 6px !important;
        font-size: 10px !important; color: #000000 !important; vertical-align: middle !important;
      }
      .report-table th {
        background-color: #f2f2f2 !important; font-weight: bold !important; text-align: center !important;
        -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important;
      }
      .report-table thead { display: table-header-group !important; }
      .report-table tr { page-break-inside: avoid !important; break-inside: avoid !important; }
      .report-table .num { text-align: right !important; white-space: nowrap; }
      .report-table .mid { text-align: center !important; white-space: nowrap; }
      .report-header { border-bottom: 2px solid #000000 !important; padding-bottom: 10px !important; margin-bottom: 12px !important; }
    }
  `;

  const localStyle = `
    /* Search input animations */
    .inv-search-wrapper {
      position: relative;
      flex: 1;
      min-width: 240px;
    }
    .inv-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      display: grid;
      place-items: center;
      color: var(--text-tertiary);
      transition: color var(--dur-fast), transform var(--dur-fast);
    }
    .inv-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px 10px 36px;
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      background: var(--white);
      font: var(--fw-regular) var(--text-sm)/1.4 var(--font-body);
      color: var(--text-primary);
      outline: none;
      transition: border-color var(--dur-fast), box-shadow var(--dur-fast);
    }
    .inv-search-input:focus {
      border-color: var(--brand-700) !important;
      box-shadow: var(--focus-ring-glow);
    }
    .inv-search-input:focus + .inv-search-icon {
      color: var(--brand-700);
      transform: translateY(-50%) scale(1.1);
    }

    /* Inventory Row Hover and Active Interactions */
    .inv-row {
      display: grid;
      grid-template-columns: 1.7fr 0.8fr 1fr 1.1fr 0.7fr;
      gap: 12px;
      align-items: center;
      padding: 13px 18px;
      border-bottom: 1px solid var(--border-subtle);
      cursor: pointer;
      background: var(--white);
      transition: background var(--dur-fast), transform var(--dur-fast);
    }
    .inv-row:hover {
      background: var(--slate-50) !important;
    }
    .inv-row:active {
      transform: scale(0.995);
    }

    .inv-row-content {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      transition: transform var(--dur-medium) cubic-bezier(0.25, 1, 0.5, 1);
    }
    .inv-row:hover .inv-row-content {
      transform: translateX(4px);
    }

    .inv-thumb {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      object-fit: cover;
      border: 1px solid var(--border-subtle);
      flex-shrink: 0;
      transition: transform var(--dur-medium) cubic-bezier(0.25, 1, 0.5, 1);
    }
    .inv-row:hover .inv-thumb {
      transform: scale(1.08);
    }

    /* Pulsing Dots for Badges */
    @keyframes inv-pulse-red {
      0% { transform: scale(0.8); opacity: 0.7; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0.7; }
    }
    @keyframes inv-pulse-amber {
      0% { transform: scale(0.8); opacity: 0.7; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.8); opacity: 0.7; }
    }

    .inv-dot-red {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--red-700);
      animation: inv-pulse-red 1.8s infinite ease-in-out;
    }
    .inv-dot-amber {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--amber-700);
      animation: inv-pulse-amber 1.8s infinite ease-in-out;
    }

    .inv-badge-red {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      background: var(--red-100);
      color: var(--red-700);
      font: var(--fw-bold) var(--text-3xs)/1 var(--font-body);
      border: 1px solid rgba(226, 104, 94, 0.25);
      box-shadow: 0 1px 2px rgba(226, 104, 94, 0.04);
      white-space: nowrap;
    }

    .inv-badge-amber {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: var(--radius-pill);
      background: var(--amber-100);
      color: var(--amber-700);
      font: var(--fw-bold) var(--text-3xs)/1 var(--font-body);
      border: 1px solid rgba(214, 154, 46, 0.25);
      box-shadow: 0 1px 2px rgba(214, 154, 46, 0.04);
      white-space: nowrap;
    }

    .inv-btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: var(--radius-md);
      border: none;
      background: var(--brand-700);
      color: var(--text-on-brand);
      cursor: pointer;
      font: var(--fw-semibold) var(--text-xs)/1 var(--font-body);
      box-shadow: var(--glow-brand-soft);
      transition: all var(--dur-fast);
    }
    .inv-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(19, 135, 166, 0.3);
    }
    .inv-btn-primary:active {
      transform: translateY(1px);
    }
    /* Same shape as the primary action, without its fill: printing is a
       secondary task next to registering a reagent. */
    .inv-btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 16px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-default);
      background: var(--surface-card);
      color: var(--text-primary);
      cursor: pointer;
      font: var(--fw-semibold) var(--text-xs)/1 var(--font-body);
      transition: background-color var(--dur-fast), border-color var(--dur-fast);
    }
    .inv-btn-secondary:hover { background: var(--surface-sunken); border-color: var(--border-strong, var(--border-default)); }

    /* Print options: one toggle per value, on = included. */
    .pf-group { display: flex; flex-direction: column; gap: 8px; }
    .pf-group-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
    .pf-group-title { font: var(--fw-semibold) var(--text-xs)/1.2 var(--font-body); color: var(--text-primary); }
    .pf-group-links { display: flex; gap: 10px; }
    .pf-link { border: none; background: none; padding: 2px 0; cursor: pointer; color: var(--brand-ink, var(--brand-700)); font: var(--text-2xs)/1.2 var(--font-body); text-decoration: underline; text-underline-offset: 2px; }
    .pf-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .pf-chip {
      display: inline-flex; align-items: center; gap: 7px; padding: 7px 12px; min-height: 36px;
      border-radius: var(--radius-pill); border: 1px solid var(--border-default);
      background: var(--surface-card); color: var(--text-secondary); cursor: pointer;
      font: var(--fw-medium) var(--text-xs)/1 var(--font-body);
      transition: background-color var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast);
    }
    .pf-chip[aria-pressed="true"] { background: var(--brand-100); border-color: var(--brand-700); color: var(--text-primary); }
    .pf-chip .pf-tick { width: 14px; display: inline-grid; place-items: center; font-weight: 700; color: var(--brand-ink, var(--brand-700)); }
    /* Secondary, not tertiary: on a selected chip's tint tertiary measured 4.49:1. */
    .pf-chip .pf-count { font: var(--text-2xs)/1 var(--font-mono); color: var(--text-secondary); }

    /* Mobile card layout — the desktop 5-column grid is unusable at phone widths
       (columns squeeze until text wraps mid-word / overlaps), so below 768px each
       reagent renders as a stacked card instead. Desktop stays the grid above. */
    .inv-thead-desktop { }
    .inv-row-mobile { display: none; }
    @media (max-width: 768px) {
      .inv-thead-desktop { display: none !important; }
      .inv-row { display: none !important; }
      .inv-row-mobile {
        display: flex !important;
        flex-direction: column;
        gap: 10px;
        padding: 14px 16px;
        border-bottom: 1px solid var(--border-subtle);
        background: var(--white);
        cursor: pointer;
      }
      .inv-row-mobile:active { background: var(--slate-50); }
      .inv-row-mobile-top { display: flex; align-items: flex-start; gap: 12px; }
      .inv-row-mobile-info { flex: 1; min-width: 0; }
      .inv-row-mobile-badges { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; flex-shrink: 0; }
      .inv-row-mobile-stats {
        display: flex; flex-direction: column; gap: 6px;
        padding-top: 10px; border-top: 1px dashed var(--border-subtle);
      }
      .inv-row-mobile-stat-line { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
      .inv-row-mobile-stat-label { font: var(--text-2xs)/1.3 var(--font-body); color: var(--text-tertiary); flex-shrink: 0; }
      .inv-row-mobile-stat-value { font: var(--text-xs)/1.3 var(--font-body); color: var(--text-secondary); text-align: right; }
    }
  `;

  return (
    <>
      <style>{localStyle}</style>
      <style>{printStyle}</style>

      <div className="qms-rise no-print page-shell" style={css(`gap:16px;`)}>
        
        {/* Search, Tabs, and Optional Action button */}
        <div className="inventory-toolbar" style={css(`display:flex; align-items:center; gap:14px; flex-wrap:wrap; width:100%;`)}>
          <div className="inv-search-wrapper">
            <input 
              value={search} 
              onChange={onSearch} 
              placeholder="ค้นหาด้วยรหัส หรือชื่อน้ำยา…" 
              className="inv-search-input"
            />
            <span className="inv-search-icon">{ic.search}</span>
          </div>
          
          <Tabs tabs={invTabs} value={invTab} onChange={setInvTab} />

          {/* The actions wrap together onto their own line, as the register
              button always did on its own, so the search keeps its full width
              beside the tabs. */}
          <div className="inv-actions" style={css(`display:flex; align-items:center; gap:10px; flex-wrap:wrap;`)}>
            {canManage && (
              <button
                onClick={openRegister}
                className="inv-btn-primary"
              >
                {ic.boxes} ลงทะเบียนน้ำยาใหม่
              </button>
            )}
            <button onClick={() => setPrintOpen(true)} className="inv-btn-secondary"
              title="พิมพ์สรุปน้ำยาคงเหลือ (หน่วยหลัก และจำนวน test) เลือกได้ตามประเภท เครื่อง หรือบริษัท">
              {ic.printer} พิมพ์สรุปคงคลัง
            </button>
          </div>
        </div>

        {/* Table list view */}
        <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); box-shadow:var(--shadow-sm); overflow:hidden;`)}>
          
          {/* Header row */}
          <div className="inv-thead-desktop" style={css(`display:grid; grid-template-columns:1.7fr 0.8fr 1fr 1.1fr 0.7fr; gap:12px; padding:11px 18px; background:var(--slate-50); border-bottom:1px solid var(--border-subtle);`)}>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>น้ำยา</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>หมวด</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em; text-align:right;`)}>คงเหลือ / จุดสั่งซื้อ</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em;`)}>หมดอายุใกล้สุด</div>
            <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.05em; text-align:center;`)}>สถานะ</div>
          </div>

          {/* Body items */}
          {invRows.map((r, rI) => (
            <div 
              key={rI} 
              onClick={r.onOpen} 
              className={`qrow inv-row${r.justChanged ? ' just-changed' : ''}`}
            >
              <div className="inv-row-content">
                <img 
                  src={r.img || '/reagent_placeholder.png'} 
                  alt="" 
                  className="inv-thumb"
                />
                <div style={css(`min-width:0;`)}>
                  <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.3 var(--font-body); color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>
                    {r.th}
                  </div>
                </div>
              </div>
              
              <div title={r.catLabel} style={css(`font:var(--fw-medium) var(--text-xs)/1.3 var(--font-body); color:var(--text-secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;`)}>
                {r.catLabel}
              </div>
              
              <div style={css(`text-align:right;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-mono); color:${r.onHandColor};`)}>
                  {r.subUnit && r.subUnitQty 
                    ? `${(r.onHand * r.subUnitQty).toLocaleString()} ${r.subUnit} (${r.onHand} / ${r.min} ${r.unit})` 
                    : `${r.onHand} / ${r.min} ${r.unit}`}
                </div>
              </div>
              
              <div>
                <div style={css(`font:var(--fw-medium) var(--text-xs)/1.3 var(--font-mono); color:${r.expColor};`)}>
                  {r.expLabel}
                </div>
                <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>
                  {r.lotCount} Lot · {r.storageLabel}
                </div>
              </div>
              
              <div style={css(`display:flex; gap:5px; justify-content:center; flex-wrap:wrap;`)}>
                {r.low ? (
                  <span className="inv-badge-red">
                    <span className="inv-dot-red" />
                    สั่งซื้อ
                  </span>
                ) : null}
                {r.expiring ? (
                  <span className="inv-badge-amber">
                    <span className="inv-dot-amber" />
                    หมดอายุ
                  </span>
                ) : null}
              </div>
            </div>

            /* Mobile card — same data as the desktop row above, stacked for narrow screens */
          ))}
          {invRows.map((r, rI) => (
            <div key={'m' + rI} onClick={r.onOpen} className="inv-row-mobile" role="button" tabIndex={0} aria-label={`ดูรายละเอียด ${r.th}`} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); r.onOpen(); } }}>
              <div className="inv-row-mobile-top">
                <img src={r.img || '/reagent_placeholder.png'} alt="" className="inv-thumb" />
                <div className="inv-row-mobile-info">
                  <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.35 var(--font-body); color:var(--text-primary);`)}>
                    {r.th}
                  </div>
                  <div title={r.catLabel} style={css(`font:var(--fw-medium) var(--text-2xs)/1.3 var(--font-body); color:var(--text-secondary); margin-top:2px;`)}>
                    {r.catLabel}
                  </div>
                </div>
                {(r.low || r.expiring) && (
                  <div className="inv-row-mobile-badges">
                    {r.low ? (
                      <span className="inv-badge-red">
                        <span className="inv-dot-red" />
                        สั่งซื้อ
                      </span>
                    ) : null}
                    {r.expiring ? (
                      <span className="inv-badge-amber">
                        <span className="inv-dot-amber" />
                        หมดอายุ
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
              <div className="inv-row-mobile-stats">
                <div className="inv-row-mobile-stat-line">
                  <span className="inv-row-mobile-stat-label">คงเหลือ / จุดสั่งซื้อ</span>
                  <span className="inv-row-mobile-stat-value" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: r.onHandColor }}>
                    {r.subUnit && r.subUnitQty
                      ? `${(r.onHand * r.subUnitQty).toLocaleString()} ${r.subUnit} (${r.onHand} / ${r.min} ${r.unit})`
                      : `${r.onHand} / ${r.min} ${r.unit}`}
                  </span>
                </div>
                <div className="inv-row-mobile-stat-line">
                  <span className="inv-row-mobile-stat-label">หมดอายุใกล้สุด</span>
                  <span className="inv-row-mobile-stat-value" style={{ fontFamily: 'var(--font-mono)', color: r.expColor, fontWeight: 600 }}>
                    {r.expLabel}
                  </span>
                </div>
                <div className="inv-row-mobile-stat-line">
                  <span className="inv-row-mobile-stat-label">จำนวน Lot · จัดเก็บ</span>
                  <span className="inv-row-mobile-stat-value">{r.lotCount} Lot · {r.storageLabel}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Delightful Empty State (Helpful surprise for empty filters) */}
          {!hasInvRows && (
            <div style={css(`display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; text-align:center; background:var(--surface-card); gap:16px; border-top:1px solid var(--border-subtle);`)}>
              <div style={css(`width:64px; height:64px; border-radius:50%; background:var(--slate-50); display:grid; place-items:center; color:var(--text-tertiary); margin-bottom:8px;`)}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 style={css(`font:var(--fw-bold) var(--text-sm)/1.3 var(--font-body); color:var(--text-primary); margin:0;`)}>
                  ไม่พบรายการน้ำยาเคมีในคลัง
                </h3>
                <p style={css(`font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-tertiary); margin:6px 0 0; max-width:340px;`)}>
                  ไม่พบรหัสหรือชื่อน้ำยาที่สอดคล้องกับคำค้นหา โปรดตรวจสอบตัวสะกดหรือเลือกหมวดหมู่ตัวกรองอื่น
                </p>
              </div>
              {canManage && (
                <button 
                  onClick={openRegister}
                  className="inv-btn-primary"
                  style={css(`margin-top:8px;`)}
                >
                  {ic.boxes} ลงทะเบียนน้ำยาตัวใหม่เข้าระบบ
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {printOpen && (
        <div className="ov-in no-print" onClick={() => setPrintOpen(false)} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
          <div className="tt-in" role="dialog" aria-modal="true" aria-labelledby="pf-title" onClick={stop}
            style={css(`width:min(560px,96vw); max-height:calc(100dvh - 48px); display:flex; flex-direction:column; background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
            <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
              <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--brand-100); color:var(--brand-ink, var(--brand-700)); display:grid; place-items:center;`)}>{ic.printer}</span>
              <div style={css(`flex:1; min-width:0;`)}>
                <div id="pf-title" style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>พิมพ์สรุปคงคลัง</div>
                <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>เลือกรายการที่จะพิมพ์ — ค่าเริ่มต้นคือทั้งหมด</div>
              </div>
              <button onClick={() => setPrintOpen(false)} aria-label="ปิด" style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
            </div>

            <div style={css(`padding:18px 22px; display:flex; flex-direction:column; gap:18px; overflow:auto;`)}>
              {groups.map(g => (
                <div key={g.field} className="pf-group">
                  <div className="pf-group-head">
                    <span className="pf-group-title">{g.title}</span>
                    <span className="pf-group-links">
                      <button type="button" className="pf-link" onClick={() => setGroup(g.field, true)}>ทั้งหมด</button>
                      <button type="button" className="pf-link" onClick={() => setGroup(g.field, false)}>ไม่เลือก</button>
                    </span>
                  </div>
                  <div className="pf-chips">
                    {g.opts.map(o => {
                      const on = !excl[g.field].includes(o.value);
                      return (
                        <button key={o.value || '_none'} type="button" className="pf-chip" aria-pressed={on} onClick={() => toggle(g.field, o.value)}>
                          <span className="pf-tick" aria-hidden="true">{on ? '✓' : ''}</span>
                          {o.label}
                          <span className="pf-count">{o.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <label style={css(`display:flex; align-items:center; gap:9px; font:var(--text-xs)/1.4 var(--font-body); color:var(--text-primary); cursor:pointer;`)}>
                <input type="checkbox" checked={includeOut} onChange={(e) => setIncludeOut(e.target.checked)} style={css(`width:18px; height:18px; accent-color:var(--brand-700);`)} />
                รวมรายการที่ไม่มีคงเหลือ (พิมพ์เป็นตารางแยกท้ายเอกสาร)
              </label>
            </div>

            <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
              <div style={css(`flex:1; min-width:180px; font:var(--text-xs)/1.4 var(--font-body); color:var(--text-secondary);`)} aria-live="polite">
                จะพิมพ์ <strong style={css(`color:var(--text-primary);`)}>{printIn.length}</strong> รายการที่มีคงเหลือ
                {includeOut ? <> · <strong style={css(`color:var(--text-primary);`)}>{printOut.length}</strong> รายการที่ไม่มี</> : null}
              </div>
              <button type="button" onClick={() => setPrintOpen(false)} className="inv-btn-secondary">ยกเลิก</button>
              <button type="button" onClick={doPrint} disabled={printIn.length + printOut.length === 0} className="inv-btn-primary"
                style={printIn.length + printOut.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}>
                {ic.printer} พิมพ์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable stock summary, A4. Hidden on screen. */}
      <div className="print-report-container" style={{ display: 'none' }}>
        <div className="report-header" style={{ display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #000000', flexShrink: 0 }}>
            <img src="/assets/tuh_lab_logo.jpg" alt="" style={{ width: '102%', height: '102%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div style={css(`flex:1;`)}>
            <div style={css(`font-size:13px; font-weight:bold; font-family:var(--font-display); line-height:1.35;`)}>หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์</div>
            <div style={css(`font-size:12px; font-weight:bold; font-family:var(--font-display); line-height:1.35;`)}>ห้องปฏิบัติการเทคนิคการแพทย์ · โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ</div>
            <div style={css(`margin-top:6px; font-size:13px; font-weight:bold;`)}>สรุปน้ำยาคงเหลือในคลัง</div>
            <div style={css(`margin-top:3px; font-size:9px; color:#444;`)}>
              ข้อมูล ณ {printedAt} · ผู้พิมพ์: {user ? user.name : '—'} · มีคงเหลือ {printIn.length} รายการ · ไม่มีคงเหลือ {printOut.length} รายการ
              {scopeNote ? ` · ${scopeNote}` : ''}
            </div>
          </div>
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th style={{ width: '6%' }}>ลำดับ</th>
              <th style={{ width: '30%' }}>รายการน้ำยา</th>
              <th style={{ width: '15%' }}>หมวดงาน</th>
              <th style={{ width: '12%' }}>คงเหลือ</th>
              <th style={{ width: '10%' }}>test / หน่วย</th>
              <th style={{ width: '12%' }}>test คงเหลือ</th>
              <th style={{ width: '15%' }}>หมดอายุเร็วสุด</th>
            </tr>
          </thead>
          <tbody>
            {printIn.length > 0 ? printIn.map((r, i) => (
              <tr key={r.id}>
                <td className="mid">{i + 1}</td>
                <td>
                  <strong>{r.th}</strong>{r.en && r.en.toLowerCase() !== r.th.toLowerCase() ? <span style={{ color: '#555' }}> · {r.en}</span> : null}
                  <div style={{ fontSize: '8.5px', color: '#555' }}>
                    {[r.kindLabel, r.instrument, r.packLabel].filter(Boolean).join(' · ')}
                  </div>
                </td>
                <td>{r.catLabel}</td>
                <td className="num"><strong>{r.onHand.toLocaleString()}</strong> {r.unit}</td>
                <td className="num">{r.testsPerMain ? r.testsPerMain.toLocaleString() : '—'}</td>
                <td className="num"><strong>{r.testsTotal ? r.testsTotal.toLocaleString() : '—'}</strong></td>
                <td className="mid">{thDate(r.earliestDate)}</td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{ textAlign: 'center', color: '#666', padding: '12px' }}>ไม่มีรายการที่มีคงเหลือตามที่เลือก</td></tr>
            )}
          </tbody>
        </table>

        {printOut.length > 0 && (<>
          <div style={css(`margin-top:6px; font-size:11px; font-weight:bold; page-break-after:avoid;`)}>ไม่มีคงเหลือ ({printOut.length} รายการ)</div>
          <table className="report-table">
            <thead>
              <tr>
                <th style={{ width: '6%' }}>ลำดับ</th>
                <th style={{ width: '49%' }}>รายการน้ำยา</th>
                <th style={{ width: '25%' }}>หมวดงาน</th>
                <th style={{ width: '20%' }}>จุดสั่งซื้อ</th>
              </tr>
            </thead>
            <tbody>
              {printOut.map((r, i) => (
                <tr key={r.id}>
                  <td className="mid">{i + 1}</td>
                  <td><strong>{r.th}</strong>{r.en && r.en.toLowerCase() !== r.th.toLowerCase() ? <span style={{ color: '#555' }}> · {r.en}</span> : null}</td>
                  <td>{r.catLabel}</td>
                  <td className="num">{r.min} {r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>)}

        <div style={css(`margin-top:4px; font-size:8.5px; color:#444; line-height:1.6; page-break-inside:avoid;`)}>
          คงเหลือ = รวมทุก Lot ที่ยังใช้งานได้ตามที่บันทึกในระบบ ณ เวลาที่พิมพ์ · test คงเหลือ = คงเหลือ × test ต่อหน่วยหลัก
          · “—” คือยังไม่ได้ลงทะเบียนจำนวน test ไว้ในระบบ เช่น น้ำยาล้าง สารเจือจาง สารควบคุม (บรรทัดใต้ชื่อแสดงจำนวนหน่วยย่อยแทน)
        </div>
      </div>
    </>
  );
}
