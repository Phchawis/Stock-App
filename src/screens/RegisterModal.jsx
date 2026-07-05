import React from 'react';
import { css } from '../css.js';
import { Input } from '../components/Input.jsx';
import { Select } from '../components/Select.jsx';
import { modalHeaderStyle, modalHeaderBadgeStyle, modalHeaderTitleStyle, modalHeaderSubtitleStyle, modalHeaderCloseStyle, modalHeaderResponsiveCSS } from '../theme.js';

export function RegisterModal({ v }) {
  const {
    stop, ic, modalRegister, closeModal, mform,
    mfCode, mfTh, mfEn, mfCat, mfUnit, mfSubUnit, mfTestsPerUnit, mfStorage,
    mfMin, mfReorder, mfSupplier, mfImg,
    submitRegister, submitEditReagent, editReagentId, supplierOpts,
    mfSubUnitQty, mfTestsPerSubUnit, showToast,
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

  // Uploaded photos are stored inline as a base64 string in D1 (no object storage
  // configured), so downscale + recompress here — an uncompressed phone photo
  // (several MB) exceeds D1's per-value size limit and fails with SQLITE_TOOBIG.
  const MAX_IMG_DIM = 480;
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // A 0-byte file usually means the OS hasn't actually downloaded it yet —
    // common with iCloud Drive/Photos "Optimize Mac Storage", OneDrive Files
    // On-Demand, or Dropbox smart sync placeholders that Finder shows as present.
    if (file.size === 0) {
      showToast(`ไฟล์ "${file.name}" มีขนาด 0 ไบต์ — อาจเป็นไฟล์ที่ยังไม่ได้ดาวน์โหลดเต็ม (เช่น จาก iCloud/OneDrive) กรุณาเปิดไฟล์ในเครื่องก่อนแล้วลองใหม่`, 'warn');
      e.target.value = '';
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, MAX_IMG_DIM / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      mfImg(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      showToast(`ไม่สามารถอ่านไฟล์ "${file.name}" เป็นรูปภาพได้ (${(file.size / 1024).toFixed(0)} KB) กรุณาเลือกไฟล์ภาพอื่น`, 'warn');
      e.target.value = '';
    };
    img.src = objectUrl;
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

      <div className="ov-in" onClick={closeModal} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:50; display:grid; place-items:center; padding:24px; --brand-700:#006884; --brand-800:#008276; --brand-600:#004F4B; --brand-500:#33A593; --brand-400:#70C4B4; --brand-100:rgba(0,104,132,0.18); --brand-50:rgba(0,104,132,0.10); --glow-brand-soft:0 6px 18px -8px rgba(0,104,132,0.30);`)}>
        <div className="tt-in theme-light-scope" onClick={stop} style={css(`width:min(600px,96vw); max-height:92vh; overflow-y:auto; background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); border:2px solid #b2d1da; --surface-card:#e0ecf0; --text-primary:#10222a; --text-secondary:#2d444e; --text-tertiary:#526d79; --border-subtle:#b2d1da; --border-default:#b2d1da; --border-strong:#b2d1da; --slate-50:#d1e2e6; --slate-100:#b2d1da; --slate-200:#9abdc6;`)}>
          <style>{modalHeaderResponsiveCSS}</style>
          <div className="tuh-mhead" style={css(modalHeaderStyle)}>
            <span className="tuh-mhead-badge" style={css(modalHeaderBadgeStyle)}>{ic.boxes || ic.shield}</span>
            <div style={css(`flex:1; min-width:0;`)}>
              <div className="tuh-mhead-title" style={css(modalHeaderTitleStyle)}>{editReagentId ? 'แก้ไขข้อมูลน้ำยาห้องปฏิบัติการ' : 'ลงทะเบียนทะเบียนน้ำยาห้องปฏิบัติการ'}</div>
              <div className="tuh-mhead-sub" style={css(modalHeaderSubtitleStyle)}>{editReagentId ? 'แก้ไขข้อมูลหลัก (Master Catalog) ของน้ำยาในระบบ' : 'เพิ่มรายการข้อมูลหลัก (Master Catalog) ของน้ำยาตัวใหม่ในระบบ'}</div>
            </div>
            <button
              onClick={closeModal}
              style={css(modalHeaderCloseStyle)}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.55)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.32)'; }}
            >{ic.close}</button>
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
              <Select 
                label="หมวดงาน" 
                required={true}
                options={[
                  { value: 'MDC', label: 'ศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์' }
                ]}
                value="MDC"
                onChange={() => {}}
              />
              <Select 
                label="หมวด" 
                required={true} 
                options={[
                  { value: 'HMS', label: 'บริการศูนย์การแพทย์' },
                  { value: 'ADV', label: 'ตรวจวินิจฉัยขั้นสูง' }
                ]}
                value={mform.cat} 
                onChange={mfCat} 
              />
            </div>

            <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:14px;`)}>
              <Select label="หน่วยนับของสินค้า" required={true} options={unitOpts} value={mform.unit} onChange={mfUnit} />
              <Select 
                label="หน่วยนับย่อย (ถ้ามี)" 
                options={subUnitOpts} 
                value={mform.subUnit || ''} 
                onChange={mfSubUnit} 
              />
            </div>

            {mform.subUnit ? (
              <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:14px; background:var(--brand-50); border:1px solid var(--brand-100); border-radius:var(--radius-md); padding:12px 14px; margin-top:-6px;`)}>
                <div>
                  <Input 
                    label={`จำนวน ${mform.subUnit} ต่อ ${unitOpts.find(o => o.value === mform.unit)?.label || mform.unit || 'หน่วยหลัก'} *`}
                    type="number" 
                    placeholder="เช่น 10" 
                    required={true}
                    value={mform.subUnitQty || ''} 
                    onChange={mfSubUnitQty} 
                  />
                </div>
                <div>
                  <Input 
                    label={`จำนวน test ต่อ ${mform.subUnit} (ถ้ามี)`}
                    type="number" 
                    placeholder="เช่น 400" 
                    value={mform.testsPerSubUnit || ''} 
                    onChange={mfTestsPerSubUnit} 
                  />
                </div>
                <div style={css(`grid-column: span 2; font:var(--fw-bold) var(--text-2xs)/1.2 var(--font-body); color:var(--brand-800); margin-top:4px; display:flex; align-items:center; gap:6px;`)}>
                  <span>💡</span>
                  <span>
                    แสดงทั้งหมด: {(() => {
                      const qty = parseInt(mform.subUnitQty, 10);
                      const tps = parseInt(mform.testsPerSubUnit, 10);
                      const unitLabel = unitOpts.find(o => o.value === mform.unit)?.label || mform.unit || 'หน่วยหลัก';
                      if (!isNaN(qty) && qty > 0) {
                        if (!isNaN(tps) && tps > 0) {
                          return `${(qty * tps).toLocaleString()} test ต่อ ${unitLabel}`;
                        }
                        return `${qty} ${mform.subUnit} ต่อ ${unitLabel}`;
                      }
                      return '—';
                    })()}
                  </span>
                </div>
              </div>
            ) : (
              <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:14px;`)}>
                <Input 
                  label="จำนวน test ต่อหน่วยหลัก (ถ้ามี)" 
                  type="number" 
                  placeholder="เช่น 100" 
                  value={mform.testsPerUnit || ''} 
                  onChange={mfTestsPerUnit} 
                />
                <div />
              </div>
            )}

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
