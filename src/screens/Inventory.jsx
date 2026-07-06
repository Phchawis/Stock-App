import React from 'react';
import { css } from '../css.js';
import { Tabs } from '../components/Tabs.jsx';

export function Inventory({ v }) {
  const {
    ic, isInv, invRows, invTabs, invTab, setInvTab,
    search, onSearch, hasInvRows, canManage, openRegister,
  } = v;

  if (!isInv) return null;

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
      background: linear-gradient(135deg, var(--brand-700), var(--brand-800));
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

      <div className="qms-rise" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:16px;`)}>
        
        {/* Search, Tabs, and Optional Action button */}
        <div style={css(`display:flex; align-items:center; gap:14px; flex-wrap:wrap; width:100%;`)}>
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

          {canManage && (
            <button
              onClick={openRegister}
              className="inv-btn-primary"
            >
              {ic.boxes} ลงทะเบียนน้ำยาใหม่
            </button>
          )}
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
              className="qrow inv-row"
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
              
              <div title={r.catLabel} style={css(`font:var(--fw-medium) var(--text-xs)/1.3 var(--font-body); color:var(--text-secondary); cursor:help; text-decoration:underline; text-decoration-style:dotted; text-underline-offset:2px;`)}>
                {r.cat}
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
            <div key={'m' + rI} onClick={r.onOpen} className="inv-row-mobile">
              <div className="inv-row-mobile-top">
                <img src={r.img || '/reagent_placeholder.png'} alt="" className="inv-thumb" />
                <div className="inv-row-mobile-info">
                  <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.35 var(--font-body); color:var(--text-primary);`)}>
                    {r.th}
                  </div>
                  <div title={r.catLabel} style={css(`font:var(--fw-medium) var(--text-2xs)/1.3 var(--font-body); color:var(--text-secondary); margin-top:2px; cursor:help; display:inline-block; border-bottom:1px dotted var(--border-strong);`)}>
                    {r.cat}
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
    </>
  );
}
