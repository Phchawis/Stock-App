import React from 'react';
import { css } from '../css.js';

export function SignatureModal({ v }) {
  const {
    modalSignature, closeModal, user, onSaveSignature, stop, ic
  } = v;

  const [preview, setPreview] = React.useState(user ? user.signature : null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (user) {
      setPreview(user.signature);
    }
  }, [user, modalSignature]);

  if (!modalSignature) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPreview(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveSignature(preview);
  };

  return (
    <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
      <div className="tt-in confirm-card" onClick={stop} style={css(`width:min(440px,96vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
        <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
          <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center; font-size:18px;`)}>✍️</span>
          <div style={css(`flex:1;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>ตั้งค่าลายเซ็นอิเล็กทรอนิกส์</div>
            <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>
              ใช้สำหรับการลงนามในเอกสารรายงานสรุปและประวัติคลังน้ำยา
            </div>
          </div>
          <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
        </div>

        <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:16px;`)}>
          {/* User details */}
          <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px 16px; display:flex; flex-direction:column; gap:4px; font-size:var(--text-xs);`)}>
            <div style={css(`display:flex; justify-content:space-between;`)}>
              <span style={css(`color:var(--text-secondary);`)}>ผู้ใช้งานปัจจุบัน:</span>
              <span style={css(`font-weight:600; color:var(--text-primary);`)}>{user ? user.name : '—'}</span>
            </div>
            <div style={css(`display:flex; justify-content:space-between;`)}>
              <span style={css(`color:var(--text-secondary);`)}>ตำแหน่ง:</span>
              <span style={css(`font-weight:600; color:var(--text-primary);`)}>{user ? user.role : '—'}</span>
            </div>
            <div style={css(`display:flex; justify-content:space-between;`)}>
              <span style={css(`color:var(--text-secondary);`)}>หัวหน้าคลังน้ำยา:</span>
              <span style={css(`font-weight:600; color:var(--text-primary);`)}>ทนพญ.เบญจวรรณ รุ่งเรือง</span>
            </div>
          </div>

          {/* Signature Upload Area */}
          <div>
            <label style={css(`font-size:10px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:6px;`)}>แนบรูปภาพลายมือชื่อ (PNG/JPG)</label>
            <div 
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              style={css(`border:2px dashed var(--border-default); border-radius:var(--radius-md); padding:20px; text-align:center; cursor:pointer; background:var(--white); transition:all var(--dur-fast); display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:120px;`)}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-700)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
            >
              {preview ? (
                <div style={css(`position:relative; width:100%; display:flex; flex-direction:column; align-items:center;`)}>
                  <img src={preview} alt="E-Signature Preview" style={css(`max-height:80px; max-width:100%; object-fit:contain; background:#fff; border:1px solid var(--border-subtle); padding:4px; border-radius:var(--radius-sm);`)} />
                  <div style={css(`font-size:9px; color:var(--text-tertiary); margin-top:8px;`)}>คลิกเพื่อเปลี่ยนรูปภาพ</div>
                </div>
              ) : (
                <div style={css(`color:var(--text-tertiary); display:flex; flex-direction:column; gap:6px; align-items:center;`)}>
                  <span style={css(`font-size:24px;`)}>📁</span>
                  <span style={css(`font-size:var(--text-xs);`)}>คลิกเพื่อเลือกไฟล์รูปภาพลายเซ็น</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleFileChange} 
              style={css(`display:none;`)} 
            />
          </div>
        </div>

        <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px; background:var(--slate-50);`)}>
          <button onClick={closeModal} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>ยกเลิก</button>
          <button onClick={handleSave} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-brand-soft);`)}>บันทึกการตั้งค่า</button>
        </div>
      </div>
    </div>
  );
}
