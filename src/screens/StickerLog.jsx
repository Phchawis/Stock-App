import React from 'react';
import { css } from '../css.js';

// บันทึกการเตรียมน้ำยา (Reagent Preparation & Labelling Record)
//
// Every sticker downloaded or printed writes one row here. The screen exists to
// be shown to an inspector, so the printed output is the real deliverable: an
// A4 form with the hospital header, a form-control code, the full record table
// and sign-off blocks. The on-screen table is the working view for finding the
// rows you want on that form.
export function StickerLog({ v }) {
  const {
    isStickerLog, stickerLogRows, user, ic,
    stickerLogsFullyLoaded, loadingFullStickerLogs, loadFullStickerLogs,
    deleteStickerLog, showToast,
  } = v;

  const [kindFilter, setKindFilter] = React.useState('all');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [search, setSearch] = React.useState('');

  if (!isStickerLog) return null;

  const isAdmin = user && user.roleId === 'admin';

  const q = search.trim().toLowerCase();
  const rows = stickerLogRows.filter(r => {
    if (kindFilter !== 'all' && r.kind !== kindFilter) return false;
    const day = (r.at || '').slice(0, 10);
    if (startDate && day < startDate) return false;
    if (endDate && day > endDate) return false;
    if (q) {
      const hay = `${r.reagentName} ${r.lot} ${r.preparedBy} ${r.by} ${r.subType}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const totalLabels = rows.reduce((sum, r) => sum + (r.qty || 1), 0);
  const byKind = ['ALIQUOT', 'OPENED', 'LOT_QR'].map(k => ({
    kind: k,
    label: ({ ALIQUOT: 'ฉลากแบ่งบรรจุ', OPENED: 'ฉลากเปิดใช้', LOT_QR: 'ฉลาก QR ประจำ Lot' })[k],
    count: rows.filter(r => r.kind === k).length,
  }));

  // Thai Buddhist-era date, matching the rest of the app.
  const thaiDateTime = (at) => {
    if (!at) return '—';
    const [d, t] = at.split(' ');
    const [y, m, dd] = (d || '').split('-');
    if (!y) return at;
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${+dd} ${months[+m - 1]} ${+y + 543}${t ? ` · ${t} น.` : ''}`;
  };

  // The detail column collapses whichever fields that sticker type actually
  // carries, so one table can hold all three kinds without empty columns.
  const detailOf = (r) => {
    const bits = [];
    if (r.subType) bits.push(r.subType);
    if (r.prepDate) bits.push(`${r.kind === 'OPENED' ? 'เปิดใช้' : 'เตรียม'} ${r.prepDate}`);
    if (r.expDate) bits.push(`หมดอายุ ${r.expDate}`);
    if (r.storageTemp) bits.push(r.storageTemp);
    if (r.storageDuration) bits.push(`อายุหลังเปิด ${r.storageDuration}`);
    return bits.length ? bits.join(' · ') : '—';
  };

  const exportCSV = () => {
    if (!rows.length) { showToast('ไม่มีรายการให้ส่งออก', 'warn'); return; }
    const head = ['ลำดับ', 'วันที่-เวลา', 'ประเภทฉลาก', 'การทำรายการ', 'ชื่อน้ำยา', 'Lot', 'รายละเอียดบนฉลาก', 'จำนวน', 'ผู้เตรียม (บนฉลาก)', 'ผู้ทำรายการ (ระบบ)'];
    const esc = (s) => `"${String(s == null ? '' : s).replace(/"/g, '""')}"`;
    const body = rows.map((r, i) => [
      i + 1, r.at, r.kindLabel, r.actionLabel, r.reagentName, r.lot || '—',
      detailOf(r), r.qty, r.preparedBy || '—', r.by,
    ].map(esc).join(','));
    // BOM so Excel opens Thai text in the right encoding.
    const blob = new Blob(['﻿' + [head.map(esc).join(','), ...body].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `บันทึกการเตรียมน้ำยา_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(a.href);
  };

  const rangeLabel = startDate || endDate
    ? `${startDate ? thaiDateTime(startDate) : 'เริ่มต้น'} ถึง ${endDate ? thaiDateTime(endDate) : 'ปัจจุบัน'}`
    : 'ทั้งหมดเท่าที่มีบันทึก';

  const printStyle = `
    @page { size: A4 portrait; margin: 1.6cm; }
    @media print {
      *, *::before, *::after {
        background-color: transparent !important;
        color: #000000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      html, body, #root, main, .qms-rise, .prep-doc, .prep-doc * {
        background: #ffffff !important;
        color: #000000 !important;
      }
      html, body, #root, #root > div, main, .qms-rise {
        height: auto !important; min-height: auto !important;
        overflow: visible !important; display: block !important; position: static !important;
      }
      aside, header, button, .no-print, nav,
      .qms-rise > *:not(.prep-doc), [class*="Sidebar"], [class*="Header"] {
        display: none !important;
      }
      main, .qms-rise { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
      .prep-doc {
        display: block !important; width: 17.8cm !important; max-width: 17.8cm !important;
        margin: 0 auto !important; padding: 0 !important; box-sizing: border-box;
      }
      .prep-table { width: 100% !important; border-collapse: collapse !important; margin-top: 8px !important; }
      .prep-table th, .prep-table td {
        border: 1px solid #9a9a9a !important; padding: 4px 6px !important;
        font-size: 8.5px !important; color: #000 !important; vertical-align: top !important;
      }
      .prep-table th { background: #ececec !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-weight: bold !important; }
      /* Keep a row intact across the page break — a half-printed record is
         worse than pushing it to the next page. */
      .prep-table tr { page-break-inside: avoid !important; break-inside: avoid !important; }
      .prep-table thead { display: table-header-group !important; }
      .prep-signoff { page-break-inside: avoid !important; break-inside: avoid !important; margin-top: 18px !important; }
    }
    @media screen { .prep-doc { display: none; } }
  `;

  const cardStyle = `background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm);`;
  const fieldStyle = `padding:8px 10px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--surface-input,var(--surface-card)); color:var(--text-primary); font:var(--text-xs)/1.2 var(--font-body); min-width:0;`;

  return (
    <div className="qms-rise" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:18px;`)}>
      <style>{printStyle}</style>

      {/* ── Header + actions ───────────────────────────────────────────── */}
      <div className="no-print" style={css(`${cardStyle} padding:20px 24px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px;`)}>
        <div style={css(`min-width:0;`)}>
          <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0; display:flex; align-items:center; gap:8px;`)}>
            <span>🧾</span> บันทึกการเตรียมน้ำยา (Preparation Record)
          </h2>
          <p style={css(`margin:6px 0 0; font:var(--text-xs)/1.5 var(--font-body); color:var(--text-secondary); max-width:64ch;`)}>
            ทุกครั้งที่ดาวน์โหลดหรือสั่งพิมพ์สติกเกอร์ ระบบจะบันทึกรายละเอียดบนฉลากไว้ที่นี่โดยอัตโนมัติ
            เพื่อใช้แสดงเป็นหลักฐานย้อนหลังตอนตรวจประเมินคุณภาพห้องปฏิบัติการ
          </p>
        </div>
        <div style={css(`display:flex; gap:10px; flex-wrap:wrap;`)}>
          <button onClick={exportCSV} style={css(`padding:9px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--surface-card); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
            ⬇ ส่งออก Excel (CSV)
          </button>
          <button onClick={() => window.print()} style={css(`padding:9px 16px; border-radius:var(--radius-md); border:none; background:var(--accent-600); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-accent);`)}>
            🖨 พิมพ์เอกสาร / บันทึกเป็น PDF
          </button>
        </div>
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="no-print" style={css(`${cardStyle} padding:16px 20px; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;`)}>
        <label style={css(`display:flex; flex-direction:column; gap:5px; flex:1 1 200px;`)}>
          <span style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>ค้นหา (ชื่อน้ำยา / Lot / ผู้เตรียม)</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="พิมพ์เพื่อค้นหา..." style={css(fieldStyle)} />
        </label>
        <label style={css(`display:flex; flex-direction:column; gap:5px; flex:1 1 190px;`)}>
          <span style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>ประเภทฉลาก</span>
          <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} style={css(fieldStyle)}>
            <option value="all">ทุกประเภท</option>
            <option value="ALIQUOT">ฉลากแบ่งบรรจุ (Aliquot)</option>
            <option value="OPENED">ฉลากเปิดใช้ (Opened)</option>
            <option value="LOT_QR">ฉลาก QR ประจำ Lot</option>
          </select>
        </label>
        <label style={css(`display:flex; flex-direction:column; gap:5px; flex:0 1 150px;`)}>
          <span style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>ตั้งแต่วันที่</span>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={css(fieldStyle)} />
        </label>
        <label style={css(`display:flex; flex-direction:column; gap:5px; flex:0 1 150px;`)}>
          <span style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>ถึงวันที่</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={css(fieldStyle)} />
        </label>
        {(search || kindFilter !== 'all' || startDate || endDate) && (
          <button onClick={() => { setSearch(''); setKindFilter('all'); setStartDate(''); setEndDate(''); }}
            style={css(`padding:9px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:transparent; color:var(--text-secondary); cursor:pointer; font:var(--text-xs)/1 var(--font-body);`)}>
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* ── Summary ───────────────────────────────────────────────────── */}
      <div className="no-print" style={css(`display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px;`)}>
        <div style={css(`${cardStyle} padding:14px 18px;`)}>
          <div style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>รายการในช่วงที่เลือก</div>
          <div style={css(`margin-top:6px; font:var(--fw-bold) var(--text-xl)/1 var(--font-display); color:var(--brand-ink,var(--text-primary));`)}>{rows.length}</div>
          <div style={css(`margin-top:4px; font:var(--text-3xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>รวม {totalLabels} ดวง</div>
        </div>
        {byKind.map(k => (
          <div key={k.kind} style={css(`${cardStyle} padding:14px 18px;`)}>
            <div style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>{k.label}</div>
            <div style={css(`margin-top:6px; font:var(--fw-bold) var(--text-xl)/1 var(--font-display); color:var(--text-primary);`)}>{k.count}</div>
          </div>
        ))}
      </div>

      {!stickerLogsFullyLoaded && (
        <div className="no-print" style={css(`${cardStyle} padding:12px 18px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;`)}>
          <span style={css(`font:var(--text-xs)/1.5 var(--font-body); color:var(--text-secondary);`)}>
            กำลังแสดงบันทึกย้อนหลัง 12 เดือน หากต้องการค้นหาย้อนไปก่อนหน้านั้น กรุณาโหลดบันทึกทั้งหมด
          </span>
          <button onClick={loadFullStickerLogs} disabled={loadingFullStickerLogs}
            style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--surface-card); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>
            {loadingFullStickerLogs ? 'กำลังโหลด...' : '📜 โหลดบันทึกทั้งหมด'}
          </button>
        </div>
      )}

      {/* ── On-screen table ───────────────────────────────────────────── */}
      <div className="no-print" style={css(`${cardStyle} overflow:hidden;`)}>
        <div style={css(`overflow-x:auto;`)}>
          <table style={css(`width:100%; border-collapse:collapse; min-width:920px;`)}>
            <thead>
              <tr>
                {['วันที่ / เวลา', 'ประเภทฉลาก', 'ชื่อน้ำยา', 'Lot', 'รายละเอียดบนฉลาก', 'ผู้เตรียม', 'ผู้ทำรายการ', ''].map((h, i) => (
                  <th key={i} style={css(`text-align:left; padding:11px 14px; font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary); border-bottom:1px solid var(--border-subtle); white-space:nowrap;`)}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan="8" style={css(`padding:38px 14px; text-align:center; font:var(--text-xs)/1.6 var(--font-body); color:var(--text-tertiary);`)}>
                  ยังไม่มีบันทึกในช่วงที่เลือก · บันทึกจะถูกสร้างอัตโนมัติเมื่อดาวน์โหลดสติกเกอร์จากหน้า “สร้างสติกเกอร์”
                </td></tr>
              ) : rows.map(r => (
                <tr key={r.id} className="qrow" style={css(`border-bottom:1px solid var(--border-subtle);`)}>
                  <td style={css(`padding:11px 14px; font:var(--text-2xs)/1.4 var(--font-mono); color:var(--text-secondary); white-space:nowrap;`)}>{thaiDateTime(r.at)}</td>
                  <td style={css(`padding:11px 14px;`)}>
                    <span style={css(`display:inline-block; padding:3px 9px; border-radius:999px; font:var(--fw-semibold) var(--text-3xs)/1.4 var(--font-body); background:var(--accent-50); color:var(--accent-700); white-space:nowrap;`)}>{r.kindLabel}</span>
                    <div style={css(`margin-top:4px; font:var(--text-3xs)/1 var(--font-body); color:var(--text-tertiary);`)}>{r.actionLabel}{r.qty > 1 ? ` · ${r.qty} ดวง` : ''}</div>
                  </td>
                  <td style={css(`padding:11px 14px; font:var(--fw-semibold) var(--text-xs)/1.4 var(--font-body); color:var(--text-primary);`)}>{r.reagentName}</td>
                  <td style={css(`padding:11px 14px; font:var(--text-2xs)/1.4 var(--font-mono); color:var(--text-secondary);`)}>{r.lot || '—'}</td>
                  <td style={css(`padding:11px 14px; font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-secondary);`)}>{detailOf(r)}</td>
                  <td style={css(`padding:11px 14px; font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>{r.preparedBy || '—'}</td>
                  <td style={css(`padding:11px 14px; font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>{r.by}</td>
                  <td style={css(`padding:11px 14px; text-align:right;`)}>
                    {isAdmin && (
                      <button onClick={() => deleteStickerLog(r.id)} title="ลบบันทึกนี้ (เฉพาะผู้ดูแลระบบ)"
                        style={css(`padding:5px 10px; border-radius:var(--radius-sm); border:1px solid var(--red-fill); background:transparent; color:var(--red-700); cursor:pointer; font:var(--text-3xs)/1 var(--font-body); white-space:nowrap;`)}>
                        ลบ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Printed A4 document (screen-hidden) ───────────────────────── */}
      <div className="prep-doc" style={css(`color:#000; font-family:var(--font-body);`)}>
        <div style={css(`display:flex; align-items:center; gap:12px; border-bottom:2px solid #000; padding-bottom:8px;`)}>
          <div style={css(`width:52px; height:52px; border-radius:50%; overflow:hidden; flex-shrink:0;`)}>
            <img src="/assets/tuh_lab_logo.jpg" alt="TUH Logo" style={{ width: '102%', height: '102%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div style={css(`flex:1; text-align:left;`)}>
            {/* Unit → department → institution, the order an official Thai
                form is read in. Stacked rather than run together on one line so
                the issuing unit stays the most prominent name on the page. */}
            <h1 style={css(`margin:0; font-size:13px; font-weight:bold; color:#000; font-family:var(--font-display); line-height:1.35;`)}>หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์</h1>
            <div style={css(`margin:0; font-size:12px; font-weight:bold; color:#000; font-family:var(--font-display); line-height:1.35;`)}>ห้องปฏิบัติการเทคนิคการแพทย์</div>
            <div style={css(`margin:0; font-size:12px; font-weight:bold; color:#000; font-family:var(--font-display); line-height:1.35;`)}>โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ</div>
            <h2 style={css(`margin:2px 0 0; font-size:9px; font-weight:normal; color:#444;`)}>Thammasat University Hospital Laboratory Center</h2>
            <h3 style={css(`margin:6px 0 0; font-size:12px; font-weight:bold; color:#111;`)}>บันทึกการเตรียมและติดฉลากน้ำยา (Reagent Preparation &amp; Labelling Record)</h3>
          </div>
          <div style={css(`text-align:right; font-size:8px; color:#333; line-height:1.5; flex-shrink:0;`)}>
            <div style={css(`font-weight:bold;`)}>FM-LAB-PREP-01</div>
            <div>แก้ไขครั้งที่ 00</div>
            <div>หน้า 1 / 1</div>
          </div>
        </div>

        <div style={css(`display:flex; justify-content:space-between; gap:16px; font-size:9px; color:#222; margin-top:8px; line-height:1.6;`)}>
          <div>
            <div><strong>ช่วงเวลาของบันทึก:</strong> {rangeLabel}</div>
            <div><strong>ประเภทฉลากที่แสดง:</strong> {kindFilter === 'all' ? 'ทุกประเภท' : (byKind.find(k => k.kind === kindFilter) || {}).label}</div>
          </div>
          <div style={css(`text-align:right;`)}>
            <div><strong>จำนวนรายการ:</strong> {rows.length} รายการ (รวม {totalLabels} ดวง)</div>
            <div><strong>พิมพ์เอกสารเมื่อ:</strong> {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.</div>
            <div><strong>ผู้พิมพ์:</strong> {user ? user.name : '—'}</div>
          </div>
        </div>

        <table className="prep-table">
          <thead>
            <tr>
              <th style={{ width: '4%' }}>ลำดับ</th>
              <th style={{ width: '13%' }}>วันที่ / เวลา</th>
              <th style={{ width: '13%' }}>ประเภทฉลาก</th>
              <th style={{ width: '19%' }}>ชื่อน้ำยา</th>
              <th style={{ width: '10%' }}>Lot</th>
              <th style={{ width: '21%' }}>รายละเอียดบนฉลาก</th>
              <th style={{ width: '10%' }}>ผู้เตรียม</th>
              <th style={{ width: '10%' }}>ผู้ทำรายการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? rows.map((r, idx) => (
              <tr key={r.id}>
                <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                {/* Thai era here too — the header above already reads พ.ศ., and
                    two calendars on one official form invites a misread. */}
                <td>{thaiDateTime(r.at)}</td>
                <td>{r.kindLabel}<br /><span style={{ color: '#555' }}>{r.actionLabel}{r.qty > 1 ? ` · ${r.qty} ดวง` : ''}</span></td>
                <td><strong>{r.reagentName}</strong></td>
                <td>{r.lot || '—'}</td>
                <td>{detailOf(r)}</td>
                <td>{r.preparedBy || '—'}</td>
                <td>{r.by}</td>
              </tr>
            )) : (
              <tr><td colSpan="8" style={{ textAlign: 'center', color: '#666', padding: '14px' }}>ไม่มีบันทึกในช่วงเวลาที่เลือก</td></tr>
            )}
          </tbody>
        </table>

        <div className="prep-signoff" style={css(`display:flex; justify-content:space-around; gap:24px; margin-top:26px; font-size:9px; color:#000;`)}>
          <div style={css(`text-align:center; width:220px;`)}>
            <p style={css(`margin:0 0 26px;`)}>ลงชื่อ.......................................................</p>
            <p style={css(`margin:0; font-weight:bold;`)}>( {user ? user.name : '.....................................'} )</p>
            <p style={css(`margin:2px 0 0; color:#666;`)}>ผู้บันทึก / ผู้จัดทำเอกสาร</p>
          </div>
          <div style={css(`text-align:center; width:220px;`)}>
            <p style={css(`margin:0 0 26px;`)}>ลงชื่อ.......................................................</p>
            <p style={css(`margin:0; font-weight:bold;`)}>( ..................................................... )</p>
            <p style={css(`margin:2px 0 0; color:#666;`)}>หัวหน้าห้องปฏิบัติการ / ผู้ตรวจสอบ</p>
          </div>
        </div>

        <p style={css(`margin-top:16px; font-size:7.5px; color:#555; border-top:1px solid #ccc; padding-top:5px; line-height:1.6;`)}>
          เอกสารนี้สร้างอัตโนมัติจากระบบ CMTL Reagent Inventory · ข้อมูล “วันที่/เวลา” และ “ผู้ทำรายการ” บันทึกจากบัญชีผู้ใช้ที่เข้าสู่ระบบขณะดาวน์โหลดฉลาก ไม่สามารถแก้ไขย้อนหลังได้
        </p>
      </div>
    </div>
  );
}
