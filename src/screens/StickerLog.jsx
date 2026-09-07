import React from 'react';
import { css } from '../css.js';

const KIND_OPTIONS = [
  { value: 'ALIQUOT', label: 'ฉลากแบ่งบรรจุ (Aliquot)' },
  { value: 'OPENED', label: 'ฉลากเปิดใช้ (Opened)' },
  { value: 'LOT_QR', label: 'ฉลาก QR ประจำ Lot' },
];

const fieldCss = `padding:8px 10px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--surface-input,var(--surface-card)); color:var(--text-primary); font:var(--text-xs)/1.2 var(--font-body); min-width:0; width:100%; box-sizing:border-box;`;

function Field({ label, hint, required, children, span }) {
  return (
    <label style={css(`display:flex; flex-direction:column; gap:5px; min-width:0; ${span ? `grid-column:span ${span};` : ''}`)}>
      <span style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-secondary);`)}>
        {label}{required ? <span style={css(`color:var(--red-700);`)}> *</span> : null}
      </span>
      {children}
      {hint ? <span style={css(`font:var(--text-3xs)/1.4 var(--font-body); color:var(--text-tertiary);`)}>{hint}</span> : null}
    </label>
  );
}

// Entering a label that was made before this screen existed.
//
// It stays open after each save and keeps the fields that repeat across a
// stack of paper records — the date, the label type, whose handwriting it is,
// which book it came from — while clearing the ones that change every row.
// Copying a month of records in is the actual task; a modal that closes and
// forgets after every entry would make it miserable.
function BackfillPanel({ reagentsList, usersList, user, onSubmit, onClose }) {
  const blank = {
    date: '', time: '09:00', kind: 'ALIQUOT', action: 'PRINT',
    reagentName: '', lot: '', subType: '', prepDate: '', expDate: '',
    storageTemp: '', storageDuration: '', preparedBy: '', qty: '1',
    by: user ? user.name : '', sourceNote: '',
  };
  const [f, setF] = React.useState(blank);
  const [saving, setSaving] = React.useState(false);
  const nameRef = React.useRef(null);
  const set = (k) => (e) => setF(s => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const ok = await onSubmit({
      at: `${f.date} ${f.time}`,
      kind: f.kind, action: f.action,
      reagentName: f.reagentName.trim(),
      reagentId: (reagentsList.find(r => r.th === f.reagentName.trim() || r.en === f.reagentName.trim()) || {}).id,
      lot: f.lot.trim(), subType: f.subType.trim(),
      prepDate: f.prepDate, expDate: f.expDate,
      storageTemp: f.storageTemp.trim(), storageDuration: f.storageDuration.trim(),
      preparedBy: f.preparedBy.trim(), qty: f.qty,
      by: f.by.trim(), sourceNote: f.sourceNote.trim(),
    });
    setSaving(false);
    if (ok) {
      // Keep what repeats down a page of the old record; clear what does not.
      setF(s => ({
        ...blank, date: s.date, time: s.time, kind: s.kind, action: s.action,
        by: s.by, sourceNote: s.sourceNote, storageTemp: s.storageTemp,
      }));
      if (nameRef.current) nameRef.current.focus();
    }
  };

  const isOpened = f.kind === 'OPENED';

  return (
    <form onSubmit={submit} className="no-print"
      style={css(`background:var(--surface-card); border:1px solid var(--amber-fill); border-radius:var(--radius-lg); box-shadow:var(--shadow-sm); padding:20px 24px; display:flex; flex-direction:column; gap:16px;`)}>

      <div style={css(`display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap;`)}>
        <div style={css(`min-width:0;`)}>
          <h3 style={css(`margin:0; font:var(--fw-bold) var(--text-md)/1.2 var(--font-display); color:var(--text-primary);`)}>
            เพิ่มบันทึกย้อนหลัง
          </h3>
          <p style={css(`margin:6px 0 0; font:var(--text-xs)/1.6 var(--font-body); color:var(--text-secondary); max-width:78ch;`)}>
            ใช้สำหรับฉลากที่ทำก่อนระบบจะเริ่มบันทึกอัตโนมัติ (ก่อน 7 ส.ค. 2569) โดยคัดลอกจากบันทึกเดิมที่หน่วยงานเก็บไว้
            รายการที่กรอกที่นี่จะถูกทำเครื่องหมายว่า <strong>“กรอกย้อนหลัง”</strong> ทั้งบนหน้าจอและบนเอกสารที่พิมพ์
            พร้อมบันทึกว่าใครเป็นผู้กรอกและกรอกเมื่อใด เพื่อให้ผู้ตรวจประเมินแยกออกจากรายการที่ระบบบันทึกเองได้
          </p>
        </div>
        <button type="button" onClick={onClose}
          style={css(`padding:7px 13px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:transparent; color:var(--text-secondary); cursor:pointer; font:var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>
          ปิด
        </button>
      </div>

      <div style={css(`display:grid; grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr)); gap:14px;`)}>
        <Field label="วันที่ทำฉลาก" required>
          <input type="date" required value={f.date} onChange={set('date')} style={css(fieldCss)} />
        </Field>
        <Field label="เวลา" required hint="ถ้าบันทึกเดิมไม่ได้ระบุเวลา ใช้เวลาโดยประมาณได้">
          <input type="time" required value={f.time} onChange={set('time')} style={css(fieldCss)} />
        </Field>
        <Field label="ประเภทฉลาก" required>
          <select value={f.kind} onChange={set('kind')} style={css(fieldCss)}>
            {KIND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="การทำรายการ" required>
          <select value={f.action} onChange={set('action')} style={css(fieldCss)}>
            <option value="PRINT">สั่งพิมพ์</option>
            <option value="DOWNLOAD">ดาวน์โหลด</option>
          </select>
        </Field>

        <Field label="ชื่อน้ำยา" required span="2">
          <input ref={nameRef} required list="backfill-reagents" value={f.reagentName} onChange={set('reagentName')}
            placeholder="พิมพ์ชื่อ หรือเลือกจากรายการ" style={css(fieldCss)} />
          <datalist id="backfill-reagents">
            {reagentsList.map(r => <option key={r.id} value={r.th}>{r.en && r.en !== r.th ? r.en : ''}</option>)}
          </datalist>
        </Field>
        <Field label="Lot">
          <input value={f.lot} onChange={set('lot')} style={css(fieldCss)} />
        </Field>
        <Field label="จำนวนดวง" required>
          <input type="number" min="1" required value={f.qty} onChange={set('qty')} style={css(fieldCss)} />
        </Field>

        <Field label={isOpened ? 'วันที่เปิดใช้' : 'วันที่เตรียม'}>
          <input type="date" value={f.prepDate} onChange={set('prepDate')} style={css(fieldCss)} />
        </Field>
        <Field label="วันหมดอายุบนฉลาก">
          <input type="date" value={f.expDate} onChange={set('expDate')} style={css(fieldCss)} />
        </Field>
        <Field label="อุณหภูมิจัดเก็บ">
          <input value={f.storageTemp} onChange={set('storageTemp')} placeholder="เช่น 2-8 °C" style={css(fieldCss)} />
        </Field>
        {isOpened ? (
          <Field label="ชนิดย่อย">
            <input value={f.subType} onChange={set('subType')} placeholder="Control / Calibrator" style={css(fieldCss)} />
          </Field>
        ) : (
          <Field label="อายุหลังเปิด/หลังเตรียม">
            <input value={f.storageDuration} onChange={set('storageDuration')} placeholder="เช่น 28 วัน" style={css(fieldCss)} />
          </Field>
        )}

        <Field label="ผู้เตรียม (ชื่อบนฉลาก)">
          <input value={f.preparedBy} onChange={set('preparedBy')} style={css(fieldCss)} />
        </Field>
        <Field label="ผู้ทำรายการเดิม" required hint="ชื่อผู้ที่ทำฉลากนั้นจริงตามบันทึกเดิม">
          <input required list="backfill-users" value={f.by} onChange={set('by')} style={css(fieldCss)} />
          <datalist id="backfill-users">
            {(usersList || []).map(u => <option key={u.username} value={u.name} />)}
          </datalist>
        </Field>
        <Field label="อ้างอิงจาก" span="2" hint="ระบุแหล่งที่คัดลอกมา เพื่อให้ผู้ตรวจตามกลับไปดูต้นฉบับได้">
          <input value={f.sourceNote} onChange={set('sourceNote')} placeholder="เช่น สมุดบันทึกการเตรียมน้ำยา ก.ค. 2569 หน้า 12" style={css(fieldCss)} />
        </Field>
      </div>

      <div style={css(`display:flex; align-items:center; gap:12px; flex-wrap:wrap; border-top:1px solid var(--border-subtle); padding-top:14px;`)}>
        <button type="submit" disabled={saving}
          style={css(`padding:9px 18px; border-radius:var(--radius-md); border:none; background:var(--accent-600); color:#fff; cursor:${saving ? 'wait' : 'pointer'}; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); opacity:${saving ? '.6' : '1'};`)}>
          {saving ? 'กำลังบันทึก...' : 'บันทึกรายการนี้'}
        </button>
        <span style={css(`font:var(--text-3xs)/1.5 var(--font-body); color:var(--text-tertiary);`)}>
          ฟอร์มจะยังเปิดค้างไว้หลังบันทึก และคงค่า วันที่ · ประเภทฉลาก · ผู้ทำรายการเดิม · อ้างอิงจาก ไว้ให้กรอกรายการถัดไปต่อได้เลย
        </span>
      </div>
    </form>
  );
}

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
    canBackfillStickerLog, addStickerLogBackfill, reagentsList, usersList,
  } = v;

  // The form is a *preparation* record, so it opens on preparation events only.
  //
  // A QR label is an identity tag stuck on a box so it can be scanned; nothing
  // was prepared, opened or given a new expiry when one was printed. They are
  // also the overwhelming majority — over nine in ten rows — so leaving them in
  // by default buried the twenty-odd rows the form exists to show. They are
  // still recorded and still one dropdown away; they are just not what
  // FM-LAB-PREP-01 is about.
  const [kindFilter, setKindFilter] = React.useState('PREP');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [showBackfill, setShowBackfill] = React.useState(false);

  if (!isStickerLog) return null;

  const isAdmin = user && user.roleId === 'admin';

  const matchesKind = (r) => {
    if (kindFilter === 'all') return true;
    if (kindFilter === 'PREP') return r.kind !== 'LOT_QR';
    return r.kind === kindFilter;
  };

  const q = search.trim().toLowerCase();
  // Split in two so the summary tiles can report the true mix for the period
  // while the table and the printed form show only the selected kinds. A tile
  // reading "ฉลาก QR 0" under the default filter would look like data loss.
  const inPeriod = stickerLogRows.filter(r => {
    const day = (r.at || '').slice(0, 10);
    if (startDate && day < startDate) return false;
    if (endDate && day > endDate) return false;
    if (q) {
      const hay = `${r.reagentName} ${r.lot} ${r.preparedBy} ${r.by} ${r.subType}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const rows = inPeriod.filter(matchesKind);

  const totalLabels = rows.reduce((sum, r) => sum + (r.qty || 1), 0);
  const byKind = ['ALIQUOT', 'OPENED', 'LOT_QR'].map(k => ({
    kind: k,
    label: ({ ALIQUOT: 'ฉลากแบ่งบรรจุ', OPENED: 'ฉลากเปิดใช้', LOT_QR: 'ฉลาก QR ประจำ Lot' })[k],
    count: inPeriod.filter(r => r.kind === k).length,
    included: matchesKind({ kind: k }),
  }));
  const hiddenCount = inPeriod.length - rows.length;

  const kindFilterLabel = ({
    all: 'ทุกประเภท (รวมฉลาก QR ประจำ Lot)',
    PREP: 'เฉพาะการเตรียมและเปิดใช้ (ไม่รวมฉลาก QR ประจำ Lot)',
    ALIQUOT: 'ฉลากแบ่งบรรจุ (Aliquot)',
    OPENED: 'ฉลากเปิดใช้ (Opened)',
    LOT_QR: 'ฉลาก QR ประจำ Lot',
  })[kindFilter] || kindFilter;

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

  // Everything known about where a hand-entered row came from, in one string.
  const manualTitle = (r) => [
    'รายการนี้กรอกย้อนหลัง ไม่ได้บันทึกโดยระบบขณะทำฉลาก',
    r.enteredBy ? `ผู้กรอก: ${r.enteredBy}` : '',
    r.enteredAt ? `กรอกเมื่อ: ${thaiDateTime(r.enteredAt)}` : '',
    r.sourceNote ? `อ้างอิงจาก: ${r.sourceNote}` : '',
  ].filter(Boolean).join('\n');

  const manualCount = rows.filter(r => r.isManual).length;

  const exportCSV = () => {
    if (!rows.length) { showToast('ไม่มีรายการให้ส่งออก', 'warn'); return; }
    const head = ['ลำดับ', 'วันที่-เวลา', 'ประเภทฉลาก', 'การทำรายการ', 'ชื่อน้ำยา', 'Lot', 'รายละเอียดบนฉลาก', 'จำนวน', 'ผู้เตรียม (บนฉลาก)', 'ผู้ทำรายการ', 'ที่มาของบันทึก', 'ผู้กรอกย้อนหลัง', 'กรอกเมื่อ', 'อ้างอิงจาก'];
    const esc = (s) => `"${String(s == null ? '' : s).replace(/"/g, '""')}"`;
    const body = rows.map((r, i) => [
      i + 1, r.at, r.kindLabel, r.actionLabel, r.reagentName, r.lot || '—',
      detailOf(r), r.qty, r.preparedBy || '—', r.by,
      r.isManual ? 'กรอกย้อนหลัง' : 'ระบบบันทึกอัตโนมัติ',
      r.enteredBy || '—', r.enteredAt || '—', r.sourceNote || '—',
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
  const fieldStyle = fieldCss;

  return (
    <div className="qms-rise page-shell" style={css(`gap:18px;`)}>
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
            หน้านี้ตั้งต้นแสดงเฉพาะ<strong>การเตรียมและการเปิดใช้น้ำยา</strong> ซึ่งเป็นเนื้อหาของเอกสาร ส่วนฉลาก QR ประจำ Lot ดูได้จากตัวกรอง
            · ระบบเริ่มบันทึกอัตโนมัติตั้งแต่ 7 ส.ค. 2569 ฉลากที่ทำก่อนหน้านั้นเพิ่มได้จากปุ่ม “เพิ่มบันทึกย้อนหลัง”
          </p>
        </div>
        <div style={css(`display:flex; gap:10px; flex-wrap:wrap;`)}>
          {canBackfillStickerLog && (
            <button onClick={() => setShowBackfill(x => !x)}
              style={css(`padding:9px 16px; border-radius:var(--radius-md); border:1px solid var(--amber-fill); background:transparent; color:var(--amber-700); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
              {showBackfill ? '✕ ปิดฟอร์มย้อนหลัง' : '➕ เพิ่มบันทึกย้อนหลัง'}
            </button>
          )}
          <button onClick={exportCSV} style={css(`padding:9px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--surface-card); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
            ⬇ ส่งออก Excel (CSV)
          </button>
          <button onClick={() => window.print()} style={css(`padding:9px 16px; border-radius:var(--radius-md); border:none; background:var(--accent-600); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-accent);`)}>
            🖨 พิมพ์เอกสาร / บันทึกเป็น PDF
          </button>
        </div>
      </div>

      {canBackfillStickerLog && showBackfill && (
        <BackfillPanel
          reagentsList={reagentsList || []}
          usersList={usersList}
          user={user}
          onSubmit={addStickerLogBackfill}
          onClose={() => setShowBackfill(false)}
        />
      )}

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div className="no-print" style={css(`${cardStyle} padding:16px 20px; display:flex; gap:12px; flex-wrap:wrap; align-items:flex-end;`)}>
        <label style={css(`display:flex; flex-direction:column; gap:5px; flex:1 1 200px;`)}>
          <span style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>ค้นหา (ชื่อน้ำยา / Lot / ผู้เตรียม)</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="พิมพ์เพื่อค้นหา..." style={css(fieldStyle)} />
        </label>
        <label style={css(`display:flex; flex-direction:column; gap:5px; flex:1 1 190px;`)}>
          <span style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>ประเภทฉลาก</span>
          <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value)} style={css(fieldStyle)}>
            <option value="PREP">เฉพาะการเตรียม / เปิดใช้ (ค่าตั้งต้น)</option>
            <option value="all">ทุกประเภท (รวมฉลาก QR)</option>
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
        {(search || kindFilter !== 'PREP' || startDate || endDate) && (
          <button onClick={() => { setSearch(''); setKindFilter('PREP'); setStartDate(''); setEndDate(''); }}
            style={css(`padding:9px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:transparent; color:var(--text-secondary); cursor:pointer; font:var(--text-xs)/1 var(--font-body);`)}>
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* ── Summary ───────────────────────────────────────────────────── */}
      <div className="no-print" style={css(`display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px;`)}>
        <div style={css(`${cardStyle} padding:14px 18px;`)}>
          <div style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>รายการที่จะแสดงในเอกสาร</div>
          <div style={css(`margin-top:6px; font:var(--fw-bold) var(--text-xl)/1 var(--font-display); color:var(--brand-ink,var(--text-primary));`)}>{rows.length}</div>
          <div style={css(`margin-top:4px; font:var(--text-3xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>รวม {totalLabels} ดวง</div>
        </div>
        {byKind.map(k => (
          // Excluded kinds are dimmed rather than hidden. The count still has
          // to be visible — someone must be able to see that 264 QR labels
          // exist and are simply not part of this form.
          <div key={k.kind} style={css(`${cardStyle} padding:14px 18px; opacity:${k.included ? '1' : '.5'};`)}>
            <div style={css(`font:var(--text-2xs)/1 var(--font-body); color:var(--text-secondary);`)}>{k.label}</div>
            <div style={css(`margin-top:6px; font:var(--fw-bold) var(--text-xl)/1 var(--font-display); color:var(--text-primary);`)}>{k.count}</div>
            {!k.included && k.count > 0 && (
              <div style={css(`margin-top:4px; font:var(--text-3xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>ไม่รวมในเอกสาร</div>
            )}
          </div>
        ))}
      </div>

      {kindFilter === 'PREP' && hiddenCount > 0 && (
        <div className="no-print" style={css(`${cardStyle} padding:12px 18px; display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap;`)}>
          <span style={css(`font:var(--text-xs)/1.6 var(--font-body); color:var(--text-secondary); max-width:82ch;`)}>
            เอกสารนี้คือ <strong>บันทึกการเตรียมน้ำยา</strong> จึงแสดงเฉพาะฉลากแบ่งบรรจุและฉลากเปิดใช้
            · ซ่อนฉลาก QR ประจำ Lot ไว้ <strong>{hiddenCount}</strong> รายการ (เป็นฉลากระบุตัวตนสำหรับแปะข้างกล่องเพื่อสแกน ไม่ใช่การเตรียมน้ำยา — ยังเก็บไว้ในระบบครบ)
          </span>
          <button onClick={() => setKindFilter('all')}
            style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--surface-card); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>
            แสดงทุกประเภท
          </button>
        </div>
      )}

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
                  {hiddenCount > 0
                    ? `ไม่มีการเตรียม/เปิดใช้น้ำยาในช่วงที่เลือก · มีเฉพาะฉลาก QR ประจำ Lot ${hiddenCount} รายการ ซึ่งไม่นับเป็นการเตรียม`
                    : 'ยังไม่มีบันทึกในช่วงที่เลือก · บันทึกจะถูกสร้างอัตโนมัติเมื่อดาวน์โหลดสติกเกอร์จากหน้า “สร้างสติกเกอร์”'}
                </td></tr>
              ) : rows.map(r => (
                <tr key={r.id} className="qrow" style={css(`border-bottom:1px solid var(--border-subtle);`)}>
                  <td style={css(`padding:11px 14px; font:var(--text-2xs)/1.4 var(--font-mono); color:var(--text-secondary); white-space:nowrap;`)}>{thaiDateTime(r.at)}</td>
                  <td style={css(`padding:11px 14px;`)}>
                    <span style={css(`display:inline-block; padding:3px 9px; border-radius:999px; font:var(--fw-semibold) var(--text-3xs)/1.4 var(--font-body); background:var(--accent-50); color:var(--accent-700); white-space:nowrap;`)}>{r.kindLabel}</span>
                    <div style={css(`margin-top:4px; font:var(--text-3xs)/1 var(--font-body); color:var(--text-tertiary);`)}>{r.actionLabel}{r.qty > 1 ? ` · ${r.qty} ดวง` : ''}</div>
                    {r.isManual && (
                      // The provenance mark sits with the row, not in a column
                      // of its own: someone scanning this table for evidence
                      // must not be able to miss it by scrolling sideways.
                      <div title={manualTitle(r)}
                        style={css(`margin-top:5px; display:inline-block; padding:2px 8px; border-radius:999px; font:var(--fw-semibold) var(--text-3xs)/1.4 var(--font-body); background:var(--amber-100); color:var(--amber-700); white-space:nowrap; cursor:help;`)}>
                        ✎ กรอกย้อนหลัง
                      </div>
                    )}
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
            <div><strong>ประเภทฉลากที่แสดง:</strong> {kindFilterLabel}</div>
          </div>
          <div style={css(`text-align:right;`)}>
            <div><strong>จำนวนรายการ:</strong> {rows.length} รายการ (รวม {totalLabels} ดวง)</div>
            {/* Stated on the form itself, not only in the footnote: an
                inspector reading the summary block should learn the mix before
                they start reading rows. */}
            <div>
              <strong>ที่มา:</strong> ระบบบันทึกอัตโนมัติ {rows.length - manualCount} รายการ
              {manualCount > 0 ? ` · กรอกย้อนหลัง ${manualCount} รายการ` : ''}
            </div>
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
                {/* Provenance is printed inside the row, since the printed
                    form is the artefact the inspector actually keeps. Marking
                    only the screen would let a hand-entered row leave the
                    building looking machine-recorded. */}
                <td>
                  {r.by}
                  {r.isManual && (
                    <><br /><span style={{ color: '#555' }}>
                      ✎ กรอกย้อนหลัง{r.enteredBy ? ` โดย ${r.enteredBy}` : ''}
                      {r.sourceNote ? <><br />อ้างอิง: {r.sourceNote}</> : null}
                    </span></>
                  )}
                </td>
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

        {/* The old wording claimed every row was machine-witnessed and
            unalterable. That is still true of the automatic rows and must not
            be watered down — but it is not true of a backfilled one, so the
            two are stated separately rather than blurred into one sentence. */}
        <p style={css(`margin-top:16px; font-size:7.5px; color:#555; border-top:1px solid #ccc; padding-top:5px; line-height:1.6;`)}>
          เอกสารนี้สร้างอัตโนมัติจากระบบ CMTL Reagent Inventory · รายการที่ไม่ได้ทำเครื่องหมายใด ๆ คือรายการที่ระบบบันทึกเองขณะดาวน์โหลด/สั่งพิมพ์ฉลาก
          โดย “วันที่/เวลา” และ “ผู้ทำรายการ” มาจากบัญชีผู้ใช้ที่เข้าสู่ระบบขณะนั้น ไม่สามารถแก้ไขย้อนหลังได้
          {manualCount > 0 ? (
            <> · รายการที่ทำเครื่องหมาย <strong>“✎ กรอกย้อนหลัง”</strong> เป็นฉลากที่ทำขึ้นก่อนระบบจะเริ่มบันทึกอัตโนมัติ (ก่อน 7 ส.ค. 2569)
              และคัดลอกเข้าระบบภายหลังจากบันทึกเดิมของหน่วยงาน โดยระบุผู้กรอกและแหล่งอ้างอิงกำกับไว้ทุกรายการ</>
          ) : null}
        </p>
      </div>
    </div>
  );
}
