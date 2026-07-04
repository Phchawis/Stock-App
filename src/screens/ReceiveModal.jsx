import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';
import { SearchableSelect } from '../components/SearchableSelect.jsx';

export function ReceiveModal({ v }) {
  const {
    stop, ic, modalReceive, closeModal, rf, rfRid,
    rfLot, rfExpiry, rfQty, reagentOpts,
    submitReceive, user,
  } = v;

  if (!modalReceive) return null;

  const localStyle = `
    .modal-grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    .modal-footer-responsive {
      padding: 14px 22px;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      background: var(--slate-50);
    }
    @media (max-width: 768px) {
      .modal-grid-2col {
        grid-template-columns: 1fr !important;
        gap: 12px;
      }
      .modal-footer-responsive {
        flex-direction: column !important;
        gap: 8px !important;
        padding: 16px !important;
      }
      .modal-footer-responsive button {
        width: 100% !important;
        padding: 12px 18px !important;
        font-size: 15px !important;
      }
    }
  `;

  return (
    <>
      <style>{localStyle}</style>
      <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px; --brand-700:#7AA2C4; --brand-800:#93b9e1; --brand-600:#7AA2C4; --brand-500:#93b9e1; --brand-400:#a9c7ee; --brand-100:rgba(122,162,196,0.22); --brand-50:rgba(122,162,196,0.12); --glow-brand-soft:0 6px 18px -8px rgba(122,162,196,0.5);`)}>
        <div className="tt-in theme-light-scope" onClick={stop} style={css(`width:min(720px,96vw); max-height:92vh; overflow-y:auto; background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
          
          {/* Header */}
          <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
            <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center;`)}>{ic.receive}</span>
            <div style={css(`flex:1;`)}><div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>รับน้ำยาเข้าคลัง</div><div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>บันทึก Lot ใหม่ พร้อมระบุวันหมดอายุ</div></div>
            <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
          </div>
          
          {/* Body */}
          <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:14px;`)}>
            <SearchableSelect label="น้ำยา" required={true} placeholder="ค้นหาหรือเลือกน้ำยา..." options={reagentOpts} value={rf.rid} onChange={rfRid} />
            <div className="modal-grid-2col">
              <Input label="เลข Lot" required={true} placeholder="เช่น G2412C" value={rf.lot} onChange={rfLot} />
              <Input label="วันหมดอายุ" type="date" required={true} value={rf.expiry} onChange={rfExpiry} />
            </div>
            <div className="modal-grid-2col">
              <Input label="จำนวนรับเข้า" type="number" required={true} placeholder="0" value={rf.qty} onChange={rfQty} />
              <Input label="ผู้ทำการรับน้ำยา" disabled={true} value={user ? user.name : ''} />
            </div>
          </div>
          
          {/* Footer */}
          <div className="modal-footer-responsive">
            <button 
              onClick={closeModal} 
              style={css(`padding:9px 18px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-100)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              ยกเลิก
            </button>
            <button 
              onClick={submitReceive} 
              style={css(`padding:9px 18px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-brand-soft); transition:all var(--dur-fast);`)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(19,135,166,0.35)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--glow-brand-soft)'; }}
            >
              บันทึกรับเข้า
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
