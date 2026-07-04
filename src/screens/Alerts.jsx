import React from 'react';
import { css } from '../css.js';

export function Alerts({ v }) {
  const {
    isAlerts, alertRows, hasAlerts, ic, user, reorderReportRows,
  } = v;

  if (!isAlerts) return null;

  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedSupplier, setSelectedSupplier] = React.useState('all');

  const cats = ['CHE', 'HEM', 'IMM', 'MIP', 'MDC', 'HMS', 'ADV'];
  const getCategoryLabel = (c) => ({
    CHE: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    HEM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    IMM: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    MIP: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    MDC: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    HMS: 'บริการศูนย์การแพทย์',
    ADV: 'ตรวจวินิจฉัยขั้นสูง'
  })[c] || c;

  const suppliers = Array.from(new Set(reorderReportRows.map(r => r.supplier).filter(Boolean)));

  const filteredReportRows = reorderReportRows.filter(r => {
    if (selectedCategory !== 'all' && r.cat !== selectedCategory) return false;
    if (selectedSupplier !== 'all' && r.supplier !== selectedSupplier) return false;
    return true;
  });

  const printStyle = `
    @media print {
      @page {
        size: A4 portrait;
        margin: 15mm 12mm 15mm 12mm;
      }
      *, *::before, *::after {
        background-color: transparent !important;
        color: #000000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      html, body, #root, main, .qms-rise, .print-report-container, .print-report-container * {
        background: #ffffff !important;
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      aside, header, button, .no-print, nav, .qms-rise > *:not(.print-report-container), [class*="Sidebar"], [class*="Header"] {
        display: none !important;
      }
      main, .qms-rise {
        padding: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      .print-report-container {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box;
        padding: 10mm 10mm !important;
        margin: 0 !important;
      }
      .report-table {
        width: 100% !important;
        border-collapse: collapse !important;
        margin-top: 10px !important;
        margin-bottom: 15px !important;
      }
      .report-table th, .report-table td {
        border: 1px solid #bcbcbc !important;
        padding: 5px 7px !important;
        text-align: left !important;
        font-size: 9px !important;
        color: #000000 !important;
      }
      .report-table th {
        background-color: #f2f2f2 !important;
        font-weight: bold !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .report-header {
        border-bottom: 2px solid #000000 !important;
        padding-bottom: 12px !important;
        margin-bottom: 15px !important;
      }
    }
  `;

  const buttonStyle = `
    .alert-print-btn {
      position: relative;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 16px;
      border-radius: var(--radius-md);
      border: none;
      background: linear-gradient(135deg, var(--brand-700) 0%, var(--brand-800) 100%);
      color: #ffffff;
      cursor: pointer;
      font: var(--fw-semibold) var(--text-xs)/1 var(--font-body);
      box-shadow: 0 4px 12px rgba(19,135,166,0.25);
      transition: transform var(--dur-fast) ease-in-out, box-shadow var(--dur-fast) ease-in-out;
    }
    .alert-print-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(19,135,166,0.35);
    }
    .alert-print-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(19,135,166,0.2);
    }
    .alert-print-btn::after {
      content: '';
      position: absolute;
      top: 0;
      left: -130%;
      width: 55%;
      height: 100%;
      background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.35) 50%, transparent 100%);
      transform: skewX(-20deg);
      pointer-events: none;
    }
    .alert-print-btn:hover::after {
      animation: alert-print-shine .85s ease;
    }
    @keyframes alert-print-shine {
      from { left: -130%; }
      to { left: 140%; }
    }
    @media (max-width: 768px) {
      .alert-row {
        flex-direction: column !important;
        align-items: stretch !important;
        gap: 12px !important;
        padding: 14px 16px !important;
      }
      .alert-actions {
        width: 100%;
        padding-top: 12px;
        border-top: 1px dashed var(--border-subtle);
      }
      .alert-actions button {
        flex: 1;
      }
      .alerts-header-row {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .alert-print-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  return (
    <>
      <style>{printStyle}</style>
      <style>{buttonStyle}</style>

      <div className="qms-rise no-print" style={css(`max-width:920px; display:flex; flex-direction:column; gap:16px;`)}>

        {/* Header row with print action */}
        <div className="alerts-header-row" style={css(`display:flex; align-items:center; justify-content:space-between; gap:12px;`)}>
          <div style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>
            พบน้ำยาที่ต้องสั่งซื้อ <strong style={css(`color:var(--text-primary);`)}>{filteredReportRows.length}</strong> รายการ
          </div>
          <button className="alert-print-btn" onClick={() => window.print()}>
            <span style={css(`display:grid; place-items:center;`)}>{ic.list}</span>
            พิมพ์รายงาน PDF (น้ำยาที่ต้องสั่งซื้อ)
          </button>
        </div>

        {/* Filters Row */}
        <div className="no-print" style={css(`display:flex; gap:12px; flex-wrap:wrap; background:var(--surface-sunken); padding:10px 14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); align-items:center; margin-bottom:4px;`)}>
          <div style={css(`font:var(--fw-semibold) var(--text-3xs)/1 var(--font-body); color:var(--text-secondary); text-transform:uppercase;`)}>ตัวกรองใบสั่งซื้อ:</div>
          <div style={css(`display:flex; flex-direction:column; min-width:140px;`)}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={css(`box-sizing:border-box; padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-primary); outline:none; height:34px; cursor:pointer;`)}
            >
              <option value="all">ทุกหมวดงาน</option>
              {cats.map((c) => (
                <option key={c} value={c}>{getCategoryLabel(c)} ({c})</option>
              ))}
            </select>
          </div>
          <div style={css(`display:flex; flex-direction:column; min-width:160px;`)}>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              style={css(`box-sizing:border-box; padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-primary); outline:none; height:34px; cursor:pointer;`)}
            >
              <option value="all">ทุกผู้จัดจำหน่าย</option>
              {suppliers.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={css(`display:flex; flex-direction:column; gap:12px;`)}>
          {alertRows.map((a, aI) => (<React.Fragment key={aI}>
            <div className="alert-row" style={css(`display:flex; align-items:center; gap:14px; padding:14px 18px; background:var(--surface-card); border:1px solid var(--border-subtle); border-left:3px solid ${a.fg}; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);`)}>
              <div style={css(`display:flex; align-items:center; gap:14px; flex:1; min-width:0;`)}>
                <span style={css(`width:40px; height:40px; border-radius:var(--radius-md); background:${a.bg}; color:${a.fg}; display:grid; place-items:center; flex-shrink:0;`)}>{a.icon}</span>
                <div style={css(`flex:1; min-width:0;`)}>
                  <div style={css(`display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:2px;`)}>
                    <span style={css(`padding:1px 8px; border-radius:var(--radius-pill); background:${a.bg}; color:${a.fg}; font:var(--fw-semibold) var(--text-2xs)/1.5 var(--font-body); white-space:nowrap;`)}>{a.kindLabel}</span>
                    <span style={css(`font:var(--fw-semibold) var(--text-2xs)/1.5 var(--font-mono); color:${a.fg}; letter-spacing:.03em; white-space:nowrap;`)}>{a.sevLabel}</span>
                  </div>
                  <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.35 var(--font-body); color:var(--text-primary);`)}>{a.title}</div>
                  <div style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>{a.sub}</div>
                </div>
              </div>
              <div className="alert-actions" style={css(`display:flex; gap:8px; flex-shrink:0;`)}>
                <button onClick={a.onOpen} style={css(`padding:7px 12px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-medium) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>ดูรายละเอียด</button>
                <button onClick={a.onAck} style={css(`padding:7px 12px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>รับทราบ</button>
              </div>
            </div>
          </React.Fragment>))}
          {hasAlerts ? (<></>) : null}
        </div>
      </div>

      {/* Printable PDF Report Template — reagents needing reorder, A4 */}
      <div className="print-report-container" style={{ display: 'none' }}>
        <div className="report-header" style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '2px solid #000000', paddingBottom: '12px', marginBottom: '15px', textAlign: 'left' }}>
          <img src="/assets/b082f9ab-2a3d-47e8-a44f-c9a7574496ec.png" alt="TUH Logo" style={css(`width:55px; height:55px; object-fit:contain; flex-shrink:0;`)} />
          <div style={css(`flex:1; text-align:left;`)}>
            <h1 style={css(`margin:0; font-size:15px; font-weight:bold; color:#000; font-family:var(--font-display);`)}>โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ</h1>
            <h2 style={css(`margin:1px 0 0; font-size:10px; font-weight:normal; color:#444;`)}>Thammasat University Hospital Laboratory Center</h2>
            <h3 style={css(`margin:6px 0 0; font-size:12px; font-weight:bold; color:#111;`)}>รายงานน้ำยาที่ต้องสั่งซื้อ (Reorder Report)</h3>
            <p style={css(`margin:3px 0 0; font-size:9px; color:#555;`)}>
              พิมพ์เอกสารเมื่อ: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น. · ผู้พิมพ์: {user.name}
              &nbsp;· จำนวนรายการที่ต้องสั่งซื้อ: {filteredReportRows.length} รายการ
            </p>
          </div>
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th>ชื่อน้ำยา</th>
              <th>หมวดงาน</th>
              <th style={{ textAlign: 'right' }}>คงเหลือ</th>
              <th style={{ textAlign: 'right' }}>จุดสั่งซื้อ (Min)</th>
              <th style={{ textAlign: 'right' }}>แนะนำสั่ง</th>
              <th>ผู้จัดจำหน่าย</th>
            </tr>
          </thead>
          <tbody>
            {filteredReportRows.length > 0 ? filteredReportRows.map((r, idx) => (
              <tr key={idx}>
                <td><strong>{r.th}</strong>{r.en && r.en.toLowerCase() !== r.th.toLowerCase() ? <span style={{ color: '#666' }}> · {r.en}</span> : null}</td>
                <td>{r.catLabel}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold', color: r.onHand === 0 ? '#a31621' : '#000' }}>{r.onHand} {r.unit}</td>
                <td style={{ textAlign: 'right' }}>{r.min} {r.unit}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{r.reorder} {r.unit}</td>
                <td>{r.supplier || '—'}</td>
              </tr>
            )) : (
              <tr><td colSpan="6" style={{ textAlign: 'center', color: '#666', padding: '14px' }}>ไม่มีรายการน้ำยาที่ต้องสั่งซื้อในขณะนี้</td></tr>
            )}
          </tbody>
        </table>

        {/* Sign-off signatures */}
        <div style={css(`margin-top:35px; display:flex; justify-content:space-between; page-break-inside:avoid;`)}>
          <div style={css(`text-align:center; width:220px; font-size:10px; color:#333;`)}>
            <p>ลงชื่อ.......................................................</p>
            <p style={css(`margin-top:6px; font-weight:bold;`)}>( {user.name} )</p>
            <p style={css(`margin-top:2px; color:#666;`)}>ผู้จัดทำรายการสั่งซื้อ ( {user.role} )</p>
          </div>
          <div style={css(`text-align:center; width:220px; font-size:10px; color:#333;`)}>
            <p>ลงชื่อ.......................................................</p>
            <p style={css(`margin-top:6px; font-weight:bold;`)}>( ทนพ. ธนวัฒน์ ผู้ดูแลระบบ )</p>
            <p style={css(`margin-top:2px; color:#666;`)}>หัวหน้าห้องปฏิบัติการ</p>
          </div>
        </div>
      </div>
    </>
  );
}
