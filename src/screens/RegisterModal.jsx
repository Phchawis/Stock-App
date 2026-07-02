import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';

export function RegisterModal({ v }) {
  const {
    stop, ic, modalRegister, closeModal, mform,
    mfCode, mfTh, mfEn, mfCat, mfUnit, mfSubUnit, mfTestsPerUnit, mfStorage,
    mfMin, mfReorder, mfSupplier, mfImg,
    submitRegister, submitEditReagent, editReagentId, supplierOpts,
  } = v;

  if (!modalRegister) return null;

  const catOpts = [
    { value: 'HMS', label: 'บริการศูนย์การแพทย์' },
    { value: 'ADV', label: 'ตรวจวินิจฉัยขั้นสูง' }
  ];

  const parentCatOpts = [
    { value: 'MDC', label: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์' }
  ];

  const unitOpts = [
    { value: 'Vial', label: 'Vial (ขวด)' },
    { value: 'Bottle', label: 'Bottle (ขวด)' },
    { value: 'Box', label: 'Box (กล่อง)' },
    { value: 'Pack', label: 'Pack (แพ็ค)' },
    { value: 'Packet', label: 'Packet (ซอง)' }
  ];

  const subUnitOpts = [
    { value: '', label: 'ไม่มี' },
    { value: 'Cassette', label: 'Cassette' },
    { value: 'Bottle', label: 'Bottle' },
    { value: 'Kit', label: 'Kit' },
    { value: 'Packet', label: 'Packet' }
  ];

  const storageOpts = [
    { value: 'ROOM_TEMP', label: 'อุณหภูมิห้อง (Room Temperature)' },
    { value: 'REFRIGERATED_2_8', label: '2–8°C (ตู้เย็นแช่เย็น)' },
    { value: 'FROZEN_40', label: '−40°C (ตู้แช่แข็งทั่วไป)' }
  ];

  const imgPresets = [
    { value: '/reagent_placeholder.png', label: 'ขวดน้ำยาเคมีหลอดฟ้า (CYAN-ZYME)' },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target.result;
        mfImg(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const localStyle = `
    .upload-btn {
      padding: 0 12px;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-default);
      background: var(--white);
      color: var(--text-secondary);
      cursor: pointer;
      font: var(--fw-semibold) var(--text-2xs)/1 var(--font-body);
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-sizing: border-box;
      transition: background var(--dur-fast), border-color var(--dur-fast), box-shadow var(--dur-fast);
    }
    .upload-btn:hover {
      background: var(--slate-50);
      border-color: var(--border-strong);
    }
    .upload-btn:focus-within {
      box-shadow: 0 0 0 2px var(--focus-ring);
      outline: none;
    }
  `;

  return (
    <>
      <style>{localStyle}</style>

      <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px;`)}>
        <div className="tt-in" onClick={stop} style={css(`width:min(600px,96vw); max-height:92vh; overflow-y:auto; background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg);`)}>
          <div style={css(`padding:18px 22px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:11px;`)}>
            <span style={css(`width:34px; height:34px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center;`)}>{ic.boxes || ic.shield}</span>
            <div style={css(`flex:1;`)}>
              <div style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary);`)}>{editReagentId ? 'แก้ไขข้อมูลน้ำยาห้องปฏิบัติการ' : 'ลงทะเบียนทะเบียนน้ำยาห้องปฏิบัติการ'}</div>
              <div style={css(`font:var(--text-2xs)/1.3 var(--font-body); color:var(--text-tertiary);`)}>{editReagentId ? 'แก้ไขข้อมูลหลัก (Master Catalog) ของน้ำยาในระบบ' : 'เพิ่มรายการข้อมูลหลัก (Master Catalog) ของน้ำยาตัวใหม่ในระบบ'}</div>
            </div>
            <button onClick={closeModal} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>{ic.close}</button>
          </div>

          <div style={css(`padding:20px 22px; display:flex; flex-direction:column; gap:16px;`)}>
            
            {/* Visual Reagent Card Preview */}
            <div style={css(`display:flex; gap:16px; background:var(--surface-sunken); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:12px; align-items:center;`)}>
              <img 
                src={mform.img || '/reagent_placeholder.png'} 
                alt="Reagent Preview" 
                style={css(`width:76px; height:76px; border-radius:var(--radius-md); object-fit:cover; border:1px solid var(--border-strong);`)}
              />
              <div style={css(`flex:1;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.3 var(--font-body); color:var(--text-primary);`)}>
                  {mform.th || 'ชื่อน้ำยาเคมีคลังหลัก'}
                </div>
                <span style={css(`display:inline-block; margin-top:6px; padding:1px 6px; border-radius:var(--radius-pill); background:var(--brand-50); color:var(--brand-700); font:var(--fw-semibold) var(--text-3xs)/1.3 var(--font-body);`)}>
                  {editReagentId ? 'กำลังแก้ไขข้อมูลน้ำยา' : 'พร้อมลงทะเบียนน้ำยาหลัก'}
                </span>
              </div>
            </div>

            <div style={css(`display:grid; grid-template-columns:1fr; gap:14px;`)}>
              <Input 
                label="ชื่อน้ำยา (Reagent Name)" 
                required={true} 
                placeholder="เช่น น้ำยาตรวจระดับน้ำตาลกลูโคส (Glucose)" 
                value={mform.th} 
                onChange={(e) => {
                  const val = e.target.value;
                  mfTh(val);
                  mfEn(val);
                }} 
              />
            </div>

            <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:14px;`)}>
              <Select label="หมวดงาน" required={true} options={parentCatOpts} value="MDC" disabled={true} />
              <Select label="หมวด" required={true} options={catOpts} value={mform.cat} onChange={mfCat} />
            </div>

            <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:14px;`)}>
              <Select label="หน่วยนับของสินค้า" required={true} options={unitOpts} value={mform.unit} onChange={mfUnit} />
              <div style={css(`display:grid; grid-template-columns:100px 1fr; gap:10px; align-items:flex-end;`)}>
                <Input 
                  label="จำนวนย่อย" 
                  type="number" 
                  placeholder="เช่น 400" 
                  value={mform.testsPerUnit || ''} 
                  onChange={mfTestsPerUnit} 
                />
                <Select 
                  label="หน่วยนับย่อย (ถ้ามี)" 
                  options={subUnitOpts} 
                  value={mform.subUnit || ''} 
                  onChange={mfSubUnit} 
                />
              </div>
            </div>

            <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:14px;`)}>
              <Select label="สภาวะจัดเก็บน้ำยา" required={true} options={storageOpts} value={mform.storage} onChange={mfStorage} />
              <Input label="เกณฑ์แจ้งเตือนสต็อกต่ำสุด (Min)" type="number" required={true} placeholder="เช่น 50" value={mform.min} onChange={mfMin} />
            </div>

            <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:14px;`)}>
              <Select label="ผู้จัดจำหน่าย / Supplier" options={supplierOpts} value={mform.supplier} onChange={mfSupplier} />
              <div />
            </div>

            <div style={css(`display:grid; grid-template-columns:1fr; gap:14px;`)}>
              {/* Custom Image Selector & File Uploader */}
              <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                <label style={css(`font:var(--fw-semibold) var(--text-2xs)/1.2 var(--font-body); color:var(--text-secondary);`)}>
                  รูปภาพประจำน้ำยา
                </label>
                <div style={css(`display:flex; gap:8px; align-items:center;`)}>
                  <div style={css(`flex:1; min-width:0;`)}>
                    <select
                      value={mform.img && mform.img.startsWith('data:') ? 'custom' : mform.img}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== 'custom') {
                          mfImg(val);
                        }
                      }}
                      style={css(`width:100%; box-sizing:border-box; padding:9px 12px; border:1px solid var(--border-default); border-radius:var(--radius-md); background:var(--white); font:var(--fw-regular) var(--text-sm)/1.4 var(--font-body); color:var(--text-primary); outline:none; height:38px;`)}
                    >
                      {imgPresets.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                      {mform.img && mform.img.startsWith('data:') && (
                        <option value="custom">รูปภาพที่อัปโหลดเอง (*.png, *.jpg)</option>
                      )}
                    </select>
                  </div>
                  <label 
                    className="upload-btn" 
                    style={css(`display:inline-flex; align-items:center; gap:8px; padding:9px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); transition:all var(--dur-fast); height:38px; box-sizing:border-box;`)}
                  >
                    📂 อัปโหลดรูปภาพ
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      style={css(`display:none;`)} 
                    />
                  </label>
                </div>
              </div>
            </div>

          </div>

          <div style={css(`padding:14px 22px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px;`)}>
            <button onClick={closeModal} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>ยกเลิก</button>
            <button onClick={editReagentId ? submitEditReagent : submitRegister} style={css(`padding:9px 18px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-brand-soft);`)}>
              {editReagentId ? 'บันทึกการแก้ไข' : 'ยืนยันลงทะเบียน'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
