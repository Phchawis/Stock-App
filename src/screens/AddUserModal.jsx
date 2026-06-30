import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';

export function AddUserModal({ v }) {
  const {
    stop, ic, modalAddUser, closeModal, uform,
    ufName, ufUsername, ufRole, submitAddUser,
  } = v;

  if (!modalAddUser) return null;

  const roleOpts = [
    { value: 'admin', label: 'ผู้ดูแลระบบ (Administrator)' },
    { value: 'supervisor', label: 'หัวหน้าคลังน้ำยา (Store Supervisor)' },
    { value: 'technician', label: 'นักเทคนิคการแพทย์ (Medical Technologist)' },
    { value: 'viewer', label: 'ผู้ดูข้อมูล (Viewer)' },
  ];

  return (
    <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
      <div className="tt-in" onClick={stop} style={css(`width:min(480px,96vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); overflow:hidden; border:1px solid var(--border-subtle);`)}>
        {/* Header */}
        <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
          <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center;`)}>
            {ic.shield}
          </span>
          <div style={css(`flex:1;`)}>
            <div style={css(`font:var(--fw-bold) var(--text-md)/1.2 var(--font-display); color:var(--text-primary);`)}>เพิ่มผู้ใช้งานใหม่</div>
            <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>เพิ่มบัญชีผู้ใช้งานเพื่อเข้าใช้งานและจำแนกสิทธิ์ตามบทบาท</div>
          </div>
          <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>
            {ic.close}
          </button>
        </div>

        {/* Form Body */}
        <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:16px;`)}>
          <Input 
            label="ชื่อ-นามสกุลจริง" 
            required={true} 
            placeholder="เช่น ทนพ. สมเกียรติ ยิ่งเจริญ" 
            value={uform.name} 
            onChange={ufName} 
          />
          
          <Input 
            label="ชื่อเข้าใช้งานระบบ (Username)" 
            required={true} 
            placeholder="เช่น somkiat" 
            value={uform.username} 
            onChange={ufUsername} 
          />

          <Select 
            label="บทบาทหน้าที่ (Role)" 
            required={true} 
            options={roleOpts} 
            value={uform.role} 
            onChange={ufRole} 
          />
        </div>

        {/* Footer */}
        <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px; background:var(--slate-50);`)}>
          <button 
            onClick={closeModal} 
            style={css(`padding:8px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}
          >
            ยกเลิก
          </button>
          <button 
            onClick={submitAddUser} 
            style={css(`padding:8px 16px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); box-shadow:var(--glow-brand-soft);`)}
          >
            บันทึกผู้ใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
}
