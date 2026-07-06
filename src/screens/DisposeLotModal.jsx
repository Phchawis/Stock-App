import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';

export function DisposeLotModal({ v }) {
  const {
    stop, ic, modalDisposeLot, closeModal, dispForm, dispQty, dispReason,
    submitDisposeLot, disposalLotData
  } = v;

  if (!modalDisposeLot) return null;

  return (
    <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
      <div className="tt-in confirm-card" onClick={stop} style={css(`width:min(460px,96vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
        <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
          <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:rgba(239,68,68,0.1); color:var(--red-600); display:grid; place-items:center;`)}>🗑️</span>
          <div style={css(`flex:1;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>ตัดจำหน่ายน้ำยา</div>
            <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>
              {disposalLotData ? `${disposalLotData.reagentName} · Lot ${disposalLotData.lot}` : ''}
            </div>
          </div>
          <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
        </div>

        <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:14px;`)}>
          <div style={css(`background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.15); border-radius:var(--radius-md); padding:10px 14px; font:var(--text-xs)/1.5 var(--font-body); color:var(--red-600);`)}>
            ระบุจำนวนและเหตุผลที่คัดจ่ายออกจากคลัง การตัดจำหน่ายจะถูกบันทึกประวัติเป็นรายการ "ทำลาย (DISPOSE)" โดยไม่สามารถย้อนกลับได้
          </div>
          <Input 
            label={`จำนวนที่ตัดจำหน่าย (คงเหลือในระบบ: ${disposalLotData ? disposalLotData.qty : 0} ${disposalLotData ? disposalLotData.unit : ''})`} 
            type="number" 
            required={true} 
            placeholder="0" 
            value={dispForm.qty} 
            onChange={dispQty}
            suffix={disposalLotData ? <span style={css(`color:var(--text-tertiary); font:var(--text-xs)/1 var(--font-body);`)}>{disposalLotData.unit}</span> : null} 
          />
          <div>
            <label style={css(`font-size:10px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px;`)}>สาเหตุการตัดจำหน่าย *</label>
            <select 
              value={dispForm.reason} 
              onChange={(e) => dispReason(e.target.value)} 
              style={css(`width:100%; padding:10px 12px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); color:var(--text-primary); font-size:var(--text-sm); font-family:var(--font-body);`)}
            >
              <option value="หมดอายุ">หมดอายุ (Expired)</option>
              <option value="เสื่อมสภาพ/ชำรุด">เสื่อมสภาพ/ชำรุด (Damaged)</option>
              <option value="ตรวจวิเคราะห์ล้มเหลว/ซ้ำ">ตรวจวิเคราะห์ล้มเหลว/ซ้ำ (QC/Calibration fail)</option>
              <option value="อื่นๆ">อื่นๆ (ระบุในรายละเอียดเพิ่มเติม...)</option>
            </select>
          </div>
          {dispForm.reason === 'อื่นๆ' && (
            <Input 
              label="รายละเอียดสาเหตุเพิ่มเติม" 
              required={true} 
              placeholder="ระบุเหตุผล เช่น น้ำยาปนเปื้อนจากการใช้งาน" 
              value={dispForm.customReason || ''} 
              onChange={(v) => dispReason(v, true)} 
            />
          )}
        </div>

        <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px; background:var(--slate-50);`)}>
          <button onClick={closeModal} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>ยกเลิก</button>
          <button onClick={submitDisposeLot} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:none; background:var(--red-600); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:0 4px 12px rgba(220,38,38,0.25);`)}>ยืนยันตัดจำหน่าย</button>
        </div>
      </div>
    </div>
  );
}
