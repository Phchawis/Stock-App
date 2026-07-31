import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';

export function EditTransactionModal({ v }) {
  const {
    stop, ic, modalEditTxn, closeModal, etForm, etQty, etRef, etLot, etExpiry,
    submitEditTxn, editingTxnData,
  } = v;

  if (!modalEditTxn) return null;

  // A RECEIVE row is the record that created the lot, so its identity fields
  // are correctable here. For ISSUE/ADJUST the lot already exists and is shared
  // with other records, so only the movement itself is editable.
  const isReceive = editingTxnData && editingTxnData.type === 'RECEIVE';

  return (
    <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
      <div className="tt-in" onClick={stop} style={css(`width:min(460px,96vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
        <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
          <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--accent-50); color:var(--accent-600); display:grid; place-items:center;`)}>{ic.history}</span>
          <div style={css(`flex:1;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>แก้ไขรายการเคลื่อนไหว</div>
            <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>
              {editingTxnData ? `${editingTxnData.typeLabel} · ${editingTxnData.reagentName} · Lot ${editingTxnData.lot}` : ''}
            </div>
          </div>
          <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
        </div>

        <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:14px;`)}>
          <div style={css(`background:var(--amber-100); border:1px solid var(--amber-100); border-radius:var(--radius-md); padding:10px 14px; font:var(--text-xs)/1.5 var(--font-body); color:var(--amber-700);`)}>
            แก้ไขจำนวนของรายการนี้จะปรับยอดคงเหลือของ Lot ที่เชื่อมโยงให้ตรงกันโดยอัตโนมัติ (ไม่สามารถทำให้คงเหลือติดลบได้)
          </div>
          <Input label={`จำนวน (${editingTxnData ? editingTxnData.typeLabel : ''})`} type="number" required={true} placeholder="0" value={etForm.qty} onChange={etQty}
            suffix={editingTxnData ? <span style={css(`color:var(--text-tertiary); font:var(--text-xs)/1 var(--font-body);`)}>{editingTxnData.unit}</span> : null} />

          {isReceive && (
            <>
              <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:12px;`)}>
                <Input label="เลข Lot" required={true} placeholder="เช่น G2412C" value={etForm.lot} onChange={etLot} />
                <Input label="วันหมดอายุ" type="date" required={true} value={etForm.expiry} onChange={etExpiry} />
              </div>
              <div style={css(`font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-tertiary); margin-top:-4px;`)}>
                แก้ได้หากคีย์ผิดตอนรับเข้า · เปลี่ยนเลข Lot แล้ว QR Code จะถูกสร้างใหม่ตามเลขที่แก้ ต้องพิมพ์สติกเกอร์ใหม่
              </div>
            </>
          )}

          <Input label="เลขที่อ้างอิง (ถ้ามี)" placeholder="เช่น PO-2604-018 หรือ REQ-2606-101" value={etForm.ref} onChange={etRef} />
        </div>

        <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px; background:var(--slate-50);`)}>
          <button onClick={closeModal} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>ยกเลิก</button>
          <button onClick={submitEditTxn} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:none; background:var(--accent-600); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-accent);`)}>บันทึกการแก้ไข</button>
        </div>
      </div>
    </div>
  );
}
