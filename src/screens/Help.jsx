import React from 'react';
import { css } from '../css.js';

export function Help({ v }) {
  const { isHelp, ic } = v;

  if (!isHelp) return null;

  const [activeTab, setActiveTab] = React.useState('general');

  const tabs = [
    { id: 'general', label: 'ภาพรวมระบบ & บทบาท', icon: ic.dashboard || '📋' },
    { id: 'receive', label: 'การรับเข้าน้ำยา (Receive)', icon: ic.receive || '📥' },
    { id: 'issue', label: 'การเบิกจ่าย (หมดอายุก่อน–เบิกก่อน)', icon: ic.issue || '📤' },
    { id: 'register', label: 'การลงทะเบียนหลัก (Catalog)', icon: ic.boxes || '📦' },
    { id: 'reports', label: 'รายงานประจำเดือน (PDF)', icon: ic.list || '📄' },
  ];

  return (
    <div className="qms-rise" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:20px;`)}>
      {/* Help Tabs Header */}
      <div style={css(`display:flex; border-bottom:1px solid var(--border-subtle); gap:8px; flex-wrap:wrap;`)}>
        {tabs.map(t => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={css(`display:flex; align-items:center; gap:8px; padding:10px 16px; border:none; border-bottom:2px solid ${active ? 'var(--brand-700)' : 'transparent'}; background:none; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); color:${active ? 'var(--brand-800)' : 'var(--text-secondary)'}; transition:all var(--dur-fast);`)}
            >
              <span style={css(`color:${active ? 'var(--brand-700)' : 'var(--text-tertiary)'}; display:grid; place-items:center; width:16px; height:16px;`)}>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Help Content Area */}
      <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:24px; box-sizing:border-box; min-height:400px; display:flex; flex-direction:column; gap:20px;`)}>

        {/* Tab 1: General & Roles */}
        {activeTab === 'general' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                คู่มือการใช้งานระบบคลังน้ำยา TUH Reagent Inventory
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                ระบบจัดการคลังน้ำยาเคมีสำหรับห้องปฏิบัติการ ธรรมศาสตร์เฉลิมพระเกียรติ พัฒนาขึ้นเพื่อช่วยบริหารสต็อก ติดตามล็อตน้ำยา 
                และควบคุมการใช้งานแบบ **หมดอายุก่อน–เบิกก่อน (First-Expired, First-Out)** เพื่อประสิทธิภาพสูงสุดในการตรวจวินิจฉัยทางการแพทย์
              </p>
            </div>

            {/* Visual Dashboard Card Mockup */}
            <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; display:flex; flex-direction:column; gap:16px;`)}>
              <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.2 var(--font-body); color:var(--text-secondary); display:flex; align-items:center; gap:6px;`)}>
                <span>🖥️</span> <strong>แผนผังภาพรวมหน้าหลักแอปพลิเคชัน (Dashboard Overview)</strong>
              </div>
              <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;`)}>
                <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:12px; display:flex; gap:10px; align-items:center;`)}>
                  <span style={css(`font-size:24px;`)}>📦</span>
                  <div>
                    <div style={css(`font-size:10px; color:var(--text-tertiary);`)}>คลังสินค้าทั้งหมด</div>
                    <div style={css(`font:var(--fw-bold) var(--text-md)/1.1 var(--font-mono); color:var(--brand-700);`)}>1,250 <span style={css(`font-size:11px;`)}>หน่วย</span></div>
                  </div>
                </div>
                <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:12px; display:flex; gap:10px; align-items:center;`)}>
                  <span style={css(`font-size:24px;`)}>⚠️</span>
                  <div>
                    <div style={css(`font-size:10px; color:var(--text-tertiary);`)}>น้ำยาต่ำกว่าเกณฑ์ (Min)</div>
                    <div style={css(`font:var(--fw-bold) var(--text-md)/1.1 var(--font-mono); color:var(--amber-700);`)}>3 <span style={css(`font-size:11px;`)}>รายการ</span></div>
                  </div>
                </div>
                <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:12px; display:flex; gap:10px; align-items:center;`)}>
                  <span style={css(`font-size:24px;`)}>🚨</span>
                  <div>
                    <div style={css(`font-size:10px; color:var(--text-tertiary);`)}>หมดอายุ / ใกล้หมดอายุ</div>
                    <div style={css(`font:var(--fw-bold) var(--text-md)/1.1 var(--font-mono); color:var(--red-700);`)}>1 <span style={css(`font-size:11px;`)}>ล็อตค้าง</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={css(`border-top:1px solid var(--border-subtle); padding-top:20px;`)}>
              <h3 style={css(`font:var(--fw-semibold) var(--text-md)/1.3 var(--font-display); color:var(--text-primary); margin:0 0 14px 0;`)}>
                สิทธิ์การเข้าใช้งานแบ่งตามบทบาท (Roles & Permissions)
              </h3>
              <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;`)}>
                
                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--brand-700);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Admin (ผู้ดูแลระบบ)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    สิทธิ์สูงสุด จัดการสิทธิ์ผู้ใช้งาน ตารางทะเบียนน้ำยาหลัก บันทึกรับเข้า เบิกจ่าย และพิมพ์รายงาน PDF ทุกชนิด
                  </p>
                </div>

                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--green-700);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Supervisor (หัวหน้าแล็บ)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    สิทธิ์ระดับจัดการ สามารถจัดการคลังน้ำยาหลัก รับน้ำยาเข้าคลัง เบิกจ่ายยา และพิมพ์รายงาน PDF ได้ทั้งหมด
                  </p>
                </div>

                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--blue-700);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Technician (เจ้าหน้าที่)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    ทำรายการเบิกจ่ายน้ำยาเป็นหลักผ่านระบบอัตโนมัติ ดูสถานะคลัง แจ้งเตือนจุดสั่งซื้อซ้ำ และรายการประวัติของตนเอง
                  </p>
                </div>

                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--text-tertiary);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Viewer (ผู้ดูข้อมูล)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    เรียกดูและสังเกตการณ์ได้อย่างเดียว (Read-Only) ดูสรุปยอดคงคลัง รายชื่อน้ำยาหลัก และรายงานความเคลื่อนไหว
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Receive Lot */}
        {activeTab === 'receive' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                ขั้นตอนการรับน้ำยาเคมีเข้าคลัง (Reagent Lot Intake Process)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                เมื่อแล็บได้รับกล่องสารเคมีหรือล็อตน้ำยาใหม่เข้ามา ให้ทำการคีย์บันทึกข้อมูลเพื่ออัปเดตสต็อกคงคลังและจัดเก็บเข้าระบบคิว
              </p>
            </div>

            <div style={css(`display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;`)}>
              {/* Steps Text */}
              <div style={css(`flex:1; min-width:280px; display:flex; flex-direction:column; gap:14px;`)}>
                <h3 style={css(`font:var(--fw-semibold) var(--text-sm)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                  ขั้นตอนการปฏิบัติงาน:
                </h3>
                <div style={css(`display:flex; flex-direction:column; gap:12px;`)}>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>1</span>
                    <div>คลิกปุ่ม **"รับเข้า Lot"** หรือปุ่มนำเข้าบริเวณด้านขวาบนหน้าจอหลัก</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>2</span>
                    <div>ค้นหาหรือเลือกชื่อน้ำยา เช่น **Glucose** จากช่องเลือกน้ำยาหลัก</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>3</span>
                    <div>กรอก **เลข Lot** ของน้ำยา (ตรวจสอบจากข้างขวดหรือกล่องบรรจุให้ถูกต้อง)</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>4</span>
                    <div>ระบุ **วันหมดอายุ (Expiry Date)** *เป็นส่วนที่สำคัญที่สุดเพราะระบบจะเรียงคิวเบิกจ่ายอัตโนมัติตามจุดนี้*</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>5</span>
                    <div>ระบุ **จำนวนรับเข้า** และกด **"บันทึกรับเข้า"** เพื่อเสร็จสิ้นขั้นตอน</div>
                  </div>
                </div>
              </div>

              {/* Visual Interface Simulator */}
              <div style={css(`flex:1; min-width:320px; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-xs)/1.2 var(--font-display); color:var(--brand-800); margin-bottom:12px; display:flex; align-items:center; gap:6px;`)}>
                  <span>📥</span> จำลองหน้าต่างฟอร์มการรับเข้าคลัง (Form Simulation)
                </div>
                
                <div style={css(`display:flex; flex-direction:column; gap:12px; font-family:var(--font-body);`)}>
                  <div>
                    <label style={css(`font-size:10px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px;`)}>น้ำยา *</label>
                    <div style={css(`padding:8px 12px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font-size:11px; color:var(--text-primary); font-weight:600;`)}>Glucose</div>
                  </div>
                  <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:10px;`)}>
                    <div>
                      <label style={css(`font-size:10px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px;`)}>เลข Lot *</label>
                      <div style={css(`padding:8px 12px; border:1px solid var(--brand-400); border-radius:var(--radius-sm); background:var(--white); font-size:11px; color:var(--text-primary); font-family:var(--font-mono);`)}>G2412C</div>
                    </div>
                    <div>
                      <label style={css(`font-size:10px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px;`)}>วันหมดอายุ *</label>
                      <div style={css(`padding:8px 12px; border:2px solid var(--brand-700); border-radius:var(--radius-sm); background:var(--white); font-size:11px; color:var(--brand-800); font-family:var(--font-mono); font-weight:600; display:flex; justify-content:space-between;`)}>
                        <span>31/12/2026</span>
                        <span>📅</span>
                      </div>
                    </div>
                  </div>
                  <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:10px;`)}>
                    <div>
                      <label style={css(`font-size:10px; font-weight:600; color:var(--text-secondary); display:block; margin-bottom:4px;`)}>จำนวนรับเข้า *</label>
                      <div style={css(`padding:8px 12px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font-size:11px; color:var(--text-primary); font-family:var(--font-mono);`)}>100</div>
                    </div>
                    <div>
                      <label style={css(`font-size:10px; font-weight:600; color:var(--text-tertiary); display:block; margin-bottom:4px;`)}>ผู้ทำธุรกรรม</label>
                      <div style={css(`padding:8px 12px; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); background:var(--slate-100); font-size:11px; color:var(--text-tertiary);`)}>ภาคย์ชวิศ พรประสิทธิ์แสง</div>
                    </div>
                  </div>
                  
                  <div style={css(`display:flex; justify-content:flex-end; gap:8px; margin-top:8px;`)}>
                    <div style={css(`padding:8px 14px; border:1px solid var(--border-default); border-radius:var(--radius-sm); font-size:11px; color:var(--text-secondary);`)}>ยกเลิก</div>
                    <div style={css(`padding:8px 14px; background:var(--brand-700); border-radius:var(--radius-sm); font-size:11px; color:#fff; font-weight:bold; box-shadow:var(--glow-brand-soft); display:flex; align-items:center; gap:4px;`)}>
                      <span>✔️</span> บันทึกรับเข้า
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Withdraw FEFO */}
        {activeTab === 'issue' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                การเบิกจ่ายระบบจ่ายตามเกณฑ์หมดอายุก่อน–เบิกก่อน (Withdraw Process)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                ระบบบังคับระบบคิวจ่าย **FEFO (First-Expired, First-Out)** โดยเรียงลำดับวันหมดอายุเป็นหลักอัตโนมัติ เพื่อป้องกันแล็บใช้น้ำยาข้ามล็อตจนเหลือล็อตเก่าหมดอายุคาตู้
              </p>
            </div>

            <div style={css(`display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;`)}>
              {/* Process Steps */}
              <div style={css(`flex:1; min-width:280px; display:flex; flex-direction:column; gap:14px;`)}>
                <h3 style={css(`font:var(--fw-semibold) var(--text-sm)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                  หลักการและขั้นตอนเบิกจ่าย:
                </h3>
                <div style={css(`display:flex; flex-direction:column; gap:12px;`)}>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--accent-600); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>1</span>
                    <div>กดปุ่ม **"เบิกจ่าย (Withdraw)"** บนหน้าจอหลัก</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--accent-600); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>2</span>
                    <div>ค้นหาและคลิกเลือกชนิดน้ำยาที่ต้องการเบิกออกจากคลัง</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--accent-600); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>3</span>
                    <div>กรอกปริมาณที่เบิก ระบบจะแสดง **แผนเบิกคิวล็อต (FEFO Allocation Queue)** ให้ดูด้านล่างทันที</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--accent-600); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>4</span>
                    <div>กดปุ่มยืนยันเบิกจ่าย ระบบจะตัดสัดส่วนจากล็อตที่หมดอายุก่อนให้อัตโนมัติ</div>
                  </div>
                </div>
              </div>

              {/* Visual Queue Simulator */}
              <div style={css(`flex:1; min-width:320px; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-xs)/1.2 var(--font-display); color:var(--accent-700); margin-bottom:12px; display:flex; align-items:center; gap:6px;`)}>
                  <span>📊</span> แบบจำลองระบบเรียงลำดับคิวเบิกจ่าย (FEFO Queue Demo)
                </div>

                <div style={css(`display:flex; flex-direction:column; gap:10px;`)}>
                  <div style={css(`background:var(--white); border:2px solid var(--brand-600); border-radius:var(--radius-md); padding:10px 12px; display:flex; justify-content:space-between; align-items:center;`)}>
                    <div>
                      <div style={css(`font-weight:bold; font-size:11px; color:var(--text-primary);`)}>Lot 07601UN23</div>
                      <div style={css(`font-size:9px; color:var(--red-700); font-family:var(--font-mono);`)}>หมดอายุ: 26/10/2026 (ใกล้สุด)</div>
                    </div>
                    <div style={css(`text-align:right;`)}>
                      <span style={css(`font:var(--fw-semibold) 9px/1.2 var(--font-body); background:var(--red-100); color:var(--red-700); padding:2px 6px; border-radius:var(--radius-pill);`)}>คิวเบิกจ่ายอันดับ 1</span>
                      <div style={css(`font-size:10px; font-weight:bold; color:var(--text-secondary); margin-top:2px;`)}>เบิกออก: 1 กล่อง</div>
                    </div>
                  </div>

                  <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px 12px; display:flex; justify-content:space-between; align-items:center; opacity:0.65;`)}>
                    <div>
                      <div style={css(`font-weight:bold; font-size:11px; color:var(--text-primary);`)}>Lot 09201UN24</div>
                      <div style={css(`font-size:9px; color:var(--text-secondary); font-family:var(--font-mono);`)}>หมดอายุ: 31/12/2026</div>
                    </div>
                    <div style={css(`text-align:right;`)}>
                      <span style={css(`font:var(--fw-semibold) 9px/1.2 var(--font-body); background:var(--slate-100); color:var(--text-secondary); padding:2px 6px; border-radius:var(--radius-pill);`)}>คิวถัดไป</span>
                      <div style={css(`font-size:10px; color:var(--text-tertiary); margin-top:2px;`)}>เบิกออก: 0 กล่อง</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Register */}
        {activeTab === 'register' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                การลงทะเบียนรายชื่อน้ำยาใหม่ (Master Reagent Catalogue Setup)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                สิทธิ์ Admin หรือ Supervisor เท่านั้นที่สามารถเพิ่มน้ำยาเคมีชนิดใหม่เข้ามาเป็นสารบัญหลักในระบบ เพื่อให้ผู้อื่นสามารถเลือกรับเข้าคลังได้
              </p>
            </div>

            <div style={css(`display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;`)}>
              {/* Form guidelines */}
              <div style={css(`flex:1; min-width:280px; display:flex; flex-direction:column; gap:14px;`)}>
                <h3 style={css(`font:var(--fw-semibold) var(--text-sm)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                  หลักการกำหนดค่าหน่วยนับสินค้าที่ถูกต้อง:
                </h3>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div>1. **ชื่อน้ำยา:** ระบุชื่อเรียกทางการแพทย์ให้ครบถ้วนทั้งภาษาไทยและอังกฤษ</div>
                  <div>2. **เกณฑ์สั่งซื้อซ้ำ (Min):** ระบุจำนวนกล่องขั้นต่ำเพื่อเตือนสต็อกสั่งซื้อ</div>
                  <div>3. **หน่วยนับหลัก และหน่วยนับย่อย:** 
                    <div style={css(`padding-left:14px; margin-top:4px; border-left:2px solid var(--brand-300); color:var(--text-primary);`)}>
                      ตัวอย่าง: น้ำยา BUN บรรจุเป็นกล่องหลัก คือ **`Box (กล่อง)`** และมีหน่วยย่อยข้างใน คือ **`Cassette`** โดยกำหนดปริมาณบรรจุ **`2`** Cassette ต่อกล่อง ระบบจะคำนวณและแสดงค่าคลังเป็น `2 Cassette (1 Box)` อัตโนมัติ
                    </div>
                  </div>
                  <div>4. **อัปโหลดภาพ:** สามารถเลือกไฟล์รูปภาพขวดน้ำยาจริงบันทึกประกอบหน้าต่างสารบัญได้</div>
                </div>
              </div>

              {/* Visual Form Simulation */}
              <div style={css(`flex:1; min-width:320px; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-xs)/1.2 var(--font-display); color:var(--brand-800); margin-bottom:12px; display:flex; align-items:center; gap:6px;`)}>
                  <span>📦</span> ตัวอย่างการตั้งค่าหน่วยย่อยในระบบ (Unit Setup Demo)
                </div>

                <div style={css(`display:flex; flex-direction:column; gap:12px; font-family:var(--font-body);`)}>
                  <div style={css(`display:grid; grid-template-columns:1fr 1fr; gap:10px;`)}>
                    <div>
                      <label style={css(`font-size:9px; font-weight:600; color:var(--text-secondary);`)}>หน่วยนับของสินค้า *</label>
                      <div style={css(`padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font-size:11px; color:var(--text-primary);`)}>Box (กล่อง)</div>
                    </div>
                    <div>
                      <label style={css(`font-size:9px; font-weight:600; color:var(--text-secondary);`)}>หน่วยนับย่อย (ถ้ามี)</label>
                      <div style={css(`padding:6px 10px; border:1px solid var(--border-default); border-radius:var(--radius-sm); background:var(--white); font-size:11px; color:var(--text-primary);`)}>Cassette</div>
                    </div>
                  </div>

                  <div style={css(`background:var(--brand-50); border:1px solid var(--brand-100); border-radius:var(--radius-md); padding:10px; display:flex; flex-direction:column; gap:6px;`)}>
                    <label style={css(`font-size:9px; font-weight:600; color:var(--brand-800);`)}>จำนวน Cassette ต่อ Box *</label>
                    <div style={css(`padding:6px 10px; border:2px solid var(--brand-700); border-radius:var(--radius-sm); background:var(--white); font-size:11px; font-family:var(--font-mono); font-weight:600; color:var(--text-primary);`)}>2</div>
                    <div style={css(`font-size:9px; color:var(--brand-800); display:flex; align-items:center; gap:4px; font-weight:bold;`)}>
                      <span>💡</span> แสดงทั้งหมด: 2 Cassette ต่อ Box
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Reports */}
        {activeTab === 'reports' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                การสั่งพิมพ์รายงานประจำเดือน A4 ขาวสะอาด (Clean PDF Printing Guide)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                แอปพลิเคชันรองรับการพิมพ์ใบรายงานยอดใช้จ่ายคลังน้ำยาในลักษณะเอกสารราชการสีขาวสะอาด ปราศจากปุ่มและรหัสน้ำยารกกระดาษ เพื่อใช้แนบเสนอประเมิน QMS
              </p>
            </div>

            <div style={css(`display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;`)}>
              {/* Text instructions */}
              <div style={css(`flex:1; min-width:280px; display:flex; flex-direction:column; gap:14px;`)}>
                <h3 style={css(`font:var(--fw-semibold) var(--text-sm)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                  การตั้งค่าเครื่องพิมพ์บราวเซอร์เพื่อให้ได้ผลลัพธ์ที่ดีที่สุด:
                </h3>
                <div style={css(`display:flex; flex-direction:column; gap:12px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div>1. ไปที่เมนู **Dashboard** จากนั้นเลือกช่วงเวลาประเมินที่ต้องการ และคลิกปุ่ม **"พิมพ์รายงาน PDF"**</div>
                  <div>2. หน้าต่างเครื่องมือพิมพ์ของ Google Chrome/Safari จะเปิดขึ้น</div>
                  <div>3. กำหนดตัวเลือกในแถบการพิมพ์ดังต่อไปนี้:
                    <ul style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:4px; color:var(--text-primary);`)}>
                      <li>**ปลายทาง (Destination):** บันทึกเป็น PDF (Save as PDF) หรือเลือกเครื่องพิมพ์</li>
                      <li>**การจัดวาง (Layout):** แนวตั้ง (Portrait)</li>
                      <li>**ขนาดกระดาษ (Paper size):** A4</li>
                      <li>**ส่วนหัวและส่วนท้าย (Headers & Footers):** *ไม่เช็คถูก (Uncheck)* เพื่อลบ URL และวันที่ขอบกระดาษออก</li>
                    </ul>
                  </div>
                  <div>4. กดปุ่ม **"พิมพ์ (Print)"** หรือ **"บันทึก (Save)"** เพื่อเซฟไฟล์เอกสารสวยงามลงคอมพิวเตอร์</div>
                </div>
              </div>

              {/* Visual Setup Simulation */}
              <div style={css(`flex:1; min-width:320px; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-xs)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:6px;`)}>
                  <span>🖨️</span> แบบจำลองการพิมพ์และการตั้งค่า (Print Setup Preview)
                </div>

                <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:14px; display:flex; flex-direction:column; gap:10px; font-family:var(--font-body); font-size:10px;`)}>
                  <div style={css(`border-bottom:1px solid var(--border-subtle); padding-bottom:8px; font-weight:bold; color:var(--text-primary);`)}>การตั้งค่าการพิมพ์ (Print Settings)</div>
                  
                  <div style={css(`display:flex; justify-content:space-between; align-items:center;`)}>
                    <span style={css(`color:var(--text-secondary);`)}>Layout</span>
                    <span style={css(`font-weight:600; color:var(--text-primary);`)}>แนวตั้ง (Portrait) ✔️</span>
                  </div>
                  <div style={css(`display:flex; justify-content:space-between; align-items:center;`)}>
                    <span style={css(`color:var(--text-secondary);`)}>Paper size</span>
                    <span style={css(`font-weight:600; color:var(--text-primary);`)}>A4 ✔️</span>
                  </div>
                  <div style={css(`display:flex; justify-content:space-between; align-items:center;`)}>
                    <span style={css(`color:var(--text-secondary);`)}>Headers and footers</span>
                    <span style={css(`font-weight:600; color:var(--red-700);`)}>เอาออก (Uncheck) ❌</span>
                  </div>
                  <div style={css(`display:flex; justify-content:space-between; align-items:center;`)}>
                    <span style={css(`color:var(--text-secondary);`)}>Background graphics</span>
                    <span style={css(`font-weight:600; color:var(--green-700);`)}>แสดง (Check) ✔️</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
