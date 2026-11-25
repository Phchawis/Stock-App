import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';

const ROLE_OPTS = [
  { value: 'admin', label: 'ผู้ดูแลระบบ (Administrator)' },
  { value: 'supervisor', label: 'หัวหน้าคลังน้ำยา (Store Supervisor)' },
  { value: 'technician', label: 'นักเทคนิคการแพทย์ (Medical Technologist)' },
  { value: 'viewer', label: 'ผู้ดูข้อมูล (Viewer)' },
];

// Editing an existing account. The role decides what the person may do; the
// หัวหน้าหมวดงาน title decides whose name and signature go on documents that
// need the section head's sign-off. They are separate on purpose: the
// warehouse head and the section head are not the same job.
export function EditUserModal({ v }) {
  const { modalEditUser, closeModal, eform, setEform, submitEditUser, sectionHead, stop, ic, saving } = v;
  const fileRef = React.useRef(null);
  if (!modalEditUser || !eform) return null;

  const set = (k) => (e) => {
    const val = e && e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setEform({ ...eform, [k]: val });
  };
  const pickSignature = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEform({ ...eform, signature: ev.target.result });
    reader.readAsDataURL(file);
  };
  const sig = eform.signature !== undefined ? eform.signature : eform.currentSignature;
  const otherHead = sectionHead && sectionHead.username !== eform.username ? sectionHead : null;

  return (
    <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
      <div className="tt-in" role="dialog" aria-label="แก้ไขผู้ใช้งาน" onClick={stop} style={css(`width:min(500px,96vw); max-height:92vh; overflow-y:auto; background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:1px solid var(--border-subtle);`)}>
        <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
          <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center;`)}>{ic.shield}</span>
          <div style={css(`flex:1; min-width:0;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-md)/1.2 var(--font-display); color:var(--text-primary);`)}>แก้ไขผู้ใช้งาน</div>
            <div style={css(`font:var(--text-2xs)/1.3 var(--font-mono); color:var(--text-secondary);`)}>{eform.username}</div>
          </div>
          <button onClick={closeModal} aria-label="ปิดหน้าต่าง" style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
        </div>

        <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:16px;`)}>
          <Input label="ชื่อ-นามสกุล (ตามที่พิมพ์ในเอกสาร)" required={true} value={eform.name} onChange={set('name')} />
          <Input label="อักษรย่อ" required={true} value={eform.initials} onChange={set('initials')} />
          <Select label="บทบาทหน้าที่ (สิทธิ์ใช้งานระบบ)" required={true} options={ROLE_OPTS} value={eform.role} onChange={set('role')} />

          <label style={css(`display:flex; gap:10px; align-items:flex-start; padding:12px 14px; border:1px solid var(--border-default); border-radius:var(--radius-md); cursor:pointer;`)}>
            <input type="checkbox" checked={!!eform.sectionHead} onChange={set('sectionHead')} style={css(`width:18px; height:18px; margin:2px 0 0; accent-color:var(--brand-700); flex-shrink:0;`)} />
            <span style={css(`font:var(--text-xs)/1.5 var(--font-body); color:var(--text-primary);`)}>
              <strong>หัวหน้าหมวดงาน</strong> (ลงนามในรายงานสั่งซื้อและรายงานการใช้งาน)
              <span style={css(`display:block; color:var(--text-secondary);`)}>
                {otherHead && eform.sectionHead
                  ? `จะแทนที่ ${otherHead.name} ซึ่งเป็นหัวหน้าหมวดงานอยู่ตอนนี้`
                  : 'เป็นตำแหน่งสำหรับลงนามในเอกสาร แยกจากบทบาทหัวหน้าคลังน้ำยา มีได้คนเดียว'}
              </span>
            </span>
          </label>

          <div style={css(`display:flex; flex-direction:column; gap:8px;`)}>
            <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary);`)}>ลายมือชื่อ</div>
            <div style={css(`display:flex; align-items:center; gap:12px; flex-wrap:wrap;`)}>
              <div style={css(`width:180px; height:56px; border:1px dashed var(--border-default); border-radius:var(--radius-sm); background:#fff; display:grid; place-items:center; color:#555; font-size:11px;`)}>
                {sig ? <img src={sig} alt="ลายมือชื่อ" style={css(`max-width:170px; max-height:48px; object-fit:contain;`)} /> : 'ยังไม่มีลายมือชื่อ'}
              </div>
              <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={pickSignature} style={{ display: 'none' }} />
              <button type="button" onClick={() => fileRef.current && fileRef.current.click()}
                style={css(`padding:8px 12px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>
                {sig ? 'เปลี่ยนรูป' : 'แนบรูป PNG/JPG'}
              </button>
              {sig && (
                <button type="button" onClick={() => setEform({ ...eform, signature: '' })}
                  style={css(`padding:8px 12px; border-radius:var(--radius-md); border:none; background:transparent; color:var(--red-700); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>
                  ลบ
                </button>
              )}
            </div>
          </div>

          <Input label="ตั้งรหัสผ่านใหม่ (เว้นว่างถ้าไม่เปลี่ยน)" type="password" value={eform.password || ''} onChange={set('password')} />
        </div>

        <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px; background:var(--slate-50);`)}>
          <button onClick={closeModal} style={css(`padding:8px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>ยกเลิก</button>
          <button onClick={submitEditUser} disabled={saving}
            style={css(`padding:8px 16px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:${saving ? 'progress' : 'pointer'}; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>
            {saving ? 'กำลังบันทึก…' : 'บันทึกการแก้ไข'}
          </button>
        </div>
      </div>
    </div>
  );
}
