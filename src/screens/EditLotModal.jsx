import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';

export function EditLotModal({ v }) {
  const {
    stop, ic, modalEditLot, closeModal, elForm, elExpiry, elQty, elLoc,
    submitEditLot, editingLotData,
  } = v;

  if (!modalEditLot) return null;

  return (
    <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
      <div className="tt-in" onClick={stop} style={css(`width:min(460px,96vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
        <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
          <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center;`)}>{ic.boxes}</span>
          <div style={css(`flex:1;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>แก้ไขข้อมูล Lot</div>
            <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>
              {editingLotData ? `${editingLotData.reagentName} · Lot ${editingLotData.lot}` : ''}
            </div>
          </div>
          <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
        </div>

        <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:14px;`)}>
          <div style={css(`background:var(--amber-100); border:1px solid var(--amber-100); border-radius:var(--radius-md); padding:10px 14px; font:var(--text-xs)/1.5 var(--font-body); color:var(--amber-700);`)}>
            การแก้ไขจำนวนคงเหลือจะถูกบันทึกลงประวัติการเคลื่อนไหวเป็นรายการ "ปรับปรุง (ADJUST)" โดยอัตโนมัติ
          </div>
          <Input label="วันหมดอายุ" type="date" required={true} value={elForm.expiry} onChange={elExpiry} />
          <Input label="จำนวนคงเหลือ" type="number" required={true} placeholder="0" value={elForm.qty} onChange={elQty}
            suffix={editingLotData ? <span style={css(`color:var(--text-tertiary); font:var(--text-xs)/1 var(--font-body);`)}>{editingLotData.unit}</span> : null} />
          <Input label="ตำแหน่งจัดเก็บ" required={true} placeholder="เช่น ตู้เย็น A1" value={elForm.loc} onChange={elLoc} />
        </div>

        <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px; background:var(--slate-50);`)}>
          <button onClick={closeModal} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>ยกเลิก</button>
          <button onClick={submitEditLot} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-brand-soft);`)}>บันทึกการแก้ไข</button>
        </div>
      </div>
    </div>
  );
}
