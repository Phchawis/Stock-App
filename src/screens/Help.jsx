import React from 'react';
import { css } from '../css.js';

export function Help({ v }) {
  const { isHelp, ic } = v;

  if (!isHelp) return null;

  const [activeTab, setActiveTab] = React.useState('general');

  const tabs = [
    { id: 'general', label: 'ภาพรวมระบบ & บทบาท', icon: ic.dashboard || '📋' },
    { id: 'receive', label: 'การรับเข้าน้ำยา (Receive)', icon: ic.receive || '📥' },
    { id: 'issue', label: 'การเบิกจ่าย (FEFO Withdraw)', icon: ic.issue || '📤' },
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
          <div style={css(`display:flex; flex-direction:column; gap:20px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 6px 0;`)}>
                คู่มือการใช้งานระบบคลังน้ำยา TUH Reagent Inventory
              </h2>
              <p style={css(`font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                ระบบจัดการคลังน้ำยาสำหรับห้องปฏิบัติการธรรมศาสตร์เฉลิมพระเกียรติ พัฒนาขึ้นเพื่อช่วยติดตาม ควบคุม และบันทึกข้อมูลน้ำยาเคมีวิเคราะห์อย่างเป็นระบบ 
                โดยเน้นความแม่นยำในการหมุนเวียนแบบเข้าก่อน-ออกก่อน (FEFO) เพื่อลดโอกาสของน้ำยาหมดอายุค้างคลัง
              </p>
            </div>

            <div style={css(`border-top:1px solid var(--border-subtle); padding-top:16px;`)}>
              <h3 style={css(`font:var(--fw-semibold) var(--text-md)/1.3 var(--font-display); color:var(--text-primary); margin:0 0 12px 0;`)}>
                สิทธิ์การเข้าใช้งานแบ่งตามบทบาท (Roles & Permissions)
              </h3>
              <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:14px;`)}>
                
                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--brand-700);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Admin (ผู้ดูแลระบบ)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    มีสิทธิ์สูงสุดในการจัดการระบบ: สามารถลงทะเบียนน้ำยาหลัก, รับน้ำยาเข้า, เบิกจ่าย, แก้ไขสิทธิ์ผู้ใช้งานอื่น ๆ ในตาราง และจัดพิมพ์รายงานประจำเดือนได้ทุกส่วน
                  </p>
                </div>

                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--green-700);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Supervisor (หัวหน้าห้องปฏิบัติการ)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    สามารถบริหารจัดการคลังสินค้า: ลงทะเบียนน้ำยาหลัก, นำเข้ารายการล็อตใหม่, ทำธุรกรรมเบิกจ่ายปกติ และส่งออกเอกสารรายงานผลประเมินประจำเดือนได้ทั้งหมด
                  </p>
                </div>

                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--blue-700);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Technician (เจ้าหน้าที่แล็บ)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    มีสิทธิ์การเบิกจ่ายน้ำยาออกไปใช้งานเป็นหลัก สามารถดูสถานะสต็อก การแจ้งเตือนจุดสั่งซื้อซ้ำ และรายการประวัติการเบิกจ่ายย้อนหลังของตนเองได้
                  </p>
                </div>

                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:16px; display:flex; flex-direction:column; gap:8px;`)}>
                  <div style={css(`display:flex; align-items:center; gap:8px;`)}>
                    <span style={css(`width:8px; height:8px; border-radius:50%; background:var(--text-tertiary);`)} />
                    <strong style={css(`font:var(--fw-bold) var(--text-sm)/1 var(--font-body); color:var(--text-primary);`)}>Viewer (ผู้สังเกตการณ์)</strong>
                  </div>
                  <p style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                    มีสิทธิ์เปิดอ่านข้อมูล (Read-Only) เท่านั้น เพื่อติดตามจำนวนสินค้า ประวัตินำเข้า-จ่ายออก และหน้ารายงานผลงานวิจัยโดยไม่มีสิทธิ์ทำธุรกรรมแก้ไขใด ๆ
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Receive Lot */}
        {activeTab === 'receive' && (
          <div style={css(`display:flex; flex-direction:column; gap:20px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 6px 0;`)}>
                การบันทึกรับเข้าน้ำยาเข้าคลัง (Reagent Lot Intake Process)
              </h2>
              <p style={css(`font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                ขั้นตอนนี้ใช้สำหรับเพิ่มล็อตใหม่ของน้ำยาที่เคยลงทะเบียนหลักไว้แล้วในระบบ เพื่อเพิ่มจำนวนสต็อกตามวันหมดอายุและตำแหน่งตู้จัดเก็บจริง
              </p>
            </div>

            <div style={css(`border-top:1px solid var(--border-subtle); padding-top:16px; display:flex; flex-direction:column; gap:12px;`)}>
              <h3 style={css(`font:var(--fw-semibold) var(--text-md)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                ขั้นตอนการปฏิบัติงาน:
              </h3>
              <ol style={css(`margin:0; padding-left:20px; display:flex; flex-direction:column; gap:8px; font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary);`)}>
                <li>คลิกปุ่มสีขาว <strong>"รับเข้า"</strong> ที่แถบหัวข้อด้านบนสุดขวาของหน้าต่าง หรือในเมนู Sidebar</li>
                <li>เลือกชื่อหรือรหัสผ่านน้ำยาที่ต้องการนำเข้าจากกล่องรายการ <strong>"เลือกน้ำยาหลัก"</strong></li>
                <li>ระบุหมายเลขล็อต (Lot Number) เช่น <code>LOT-2026A</code> และสถานที่ตู้เก็บความเย็น เช่น <code>ตู้เย็นช่อง 2 (A2)</code></li>
                <li>กรอกจำนวนรับเข้าจริง (เช่น 150) และระบุวันหมดอายุ (Expiry Date) ของล็อตนั้น ๆ อย่างถูกต้อง</li>
                <li>กดยืนยันปุ่ม <strong>"บันทึกรับเข้าน้ำยา"</strong> เพื่อนำสินค้าเข้าคลังทันที รายการประวัติธุรกรรมจะบันทึกอัตโนมัติ</li>
              </ol>

              <div style={css(`background:var(--slate-50); border-left:4px solid var(--brand-700); padding:12px 16px; border-radius:0 var(--radius-md) var(--radius-md) 0; margin-top:8px; font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>
                <strong>💡 ข้อแนะนำทางเทคนิค:</strong> วันหมดอายุมีความสำคัญสูงสุดต่อระบบ FEFO ตรวจสอบให้มั่นใจว่ากรอกวันหมดอายุตรงตามเอกสารสติ๊กเกอร์ข้างขวดสารเคมี
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Withdraw FEFO */}
        {activeTab === 'issue' && (
          <div style={css(`display:flex; flex-direction:column; gap:20px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 6px 0;`)}>
                การเบิกจ่ายน้ำยาเคมีตามเกณฑ์หมดอายุก่อน (FEFO Withdraw Process)
              </h2>
              <p style={css(`font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                เพื่อลดการเน่าเสียของสารเคมีและน้ำยาค้างคลัง ระบบจะใช้วิธี **First-Expired, First-Out (FEFO)** บังคับจ่ายสารเคมีล็อตที่ใกล้หมดอายุมากที่สุดออกไปก่อนโดยอัตโนมัติ
              </p>
            </div>

            <div style={css(`border-top:1px solid var(--border-subtle); padding-top:16px; display:flex; flex-direction:column; gap:12px;`)}>
              <h3 style={css(`font:var(--fw-semibold) var(--text-md)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                ขั้นตอนการเบิกจ่าย:
              </h3>
              <ol style={css(`margin:0; padding-left:20px; display:flex; flex-direction:column; gap:8px; font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary);`)}>
                <li>คลิกปุ่มสีน้ำเงินหลัก <strong>"เบิกจ่าย (Withdraw)"</strong> ด้านขวาบน</li>
                <li>ค้นหาหรือเลือกน้ำยาเคมีที่ต้องการเบิกจ่าย</li>
                <li>ระบุปริมาณที่ต้องการเบิก (จำนวนชิ้น/กล่อง)</li>
                <li>
                  สังเกตที่แผง **"ล็อตคิวเบิกจ่ายอัตโนมัติ"**: ระบบจะคำนวณล็อตที่มีวันหมดอายุใกล้ที่สุดและตัดสัดส่วนจำนวนให้อัตโนมัติ 
                  เพื่อไม่ให้ผู้ปฏิบัติงานเบิกข้ามล็อตโดยไม่มีความจำเป็น
                </li>
                <li>คลิกปุ่ม <strong>"ยืนยันการเบิกจ่าย"</strong> เพื่อหักสต็อกออกจากระบบ</li>
              </ol>

              <div style={css(`background:var(--slate-50); border-left:4px solid var(--accent-500); padding:12px 16px; border-radius:0 var(--radius-md) var(--radius-md) 0; margin-top:8px; font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>
                <strong>⚠️ หมายเหตุ:</strong> ในกรณีที่มีความต้องการพิเศษที่จะข้ามคิว FEFO (เช่น ขวดน้ำยาล็อตแรกขวดแตกชำรุด) ให้ทำเครื่องหมายหมายเหตุระบุสาเหตุในฟิลด์ข้อมูลเสริมก่อนกดยืนยันธุรกรรมเบิกจ่าย
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Register */}
        {activeTab === 'register' && (
          <div style={css(`display:flex; flex-direction:column; gap:20px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 6px 0;`)}>
                การลงทะเบียนรายชื่อน้ำยาใหม่ (Master Catalog Registration)
              </h2>
              <p style={css(`font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                สำหรับแอดมินหรือหัวหน้าแล็บ ในการเพิ่มรายการน้ำยาเคมีชนิดใหม่เข้ามาในระบบสารบัญหลักก่อนจึงจะสามารถนำเข้าน้ำยาล็อตจริงได้
              </p>
            </div>

            <div style={css(`border-top:1px solid var(--border-subtle); padding-top:16px; display:flex; flex-direction:column; gap:12px;`)}>
              <h3 style={css(`font:var(--fw-semibold) var(--text-md)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                ข้อมูลสำคัญที่ต้องลงทะเบียน:
              </h3>
              <ul style={css(`margin:0; padding-left:20px; display:flex; flex-direction:column; gap:8px; font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary);`)}>
                <li><strong>รหัสทะเบียนน้ำยา (Reagent Code)</strong>: เช่น RGT-CHE-005 (ใช้จำแนกสินค้าและค้นหา)</li>
                <li><strong>ชื่อไทย/อังกฤษ</strong>: ระบุชื่อเรียกสารเคมีตามเอกสารทางการแพทย์</li>
                <li><strong>เกณฑ์แจ้งเตือนสต็อกต่ำสุด (Min Value)</strong>: หากจำนวนรวมลดลงต่ำกว่าหรือเท่ากับจุดนี้ ระบบจะขึ้นแถบเตือนสีส้ม "สต็อกต่ำ" บนแดชบอร์ดทันที</li>
                <li><strong>การนำเข้ารูปภาพน้ำยา</strong>: สามารถคลิกปุ่ม **"📂 อัปโหลดรูปภาพ"** เพื่อเลือกภาพถ่ายขวดน้ำยาจริงจากในโฟลเดอร์เครื่องคอมพิวเตอร์ของคุณเพื่อนำเข้ามาในคลังได้ทันที</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 5: Reports */}
        {activeTab === 'reports' && (
          <div style={css(`display:flex; flex-direction:column; gap:20px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 6px 0;`)}>
                การดาวน์โหลดและการสั่งพิมพ์รายงานกระดาษ A4 (Monthly Report PDF)
              </h2>
              <p style={css(`font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                แดชบอร์ด KPI รองรับการส่งออกรายงานแบบเป็นทางการตามสัดส่วนหน้ากระดาษ A4 เพื่อใช้ยื่นสรุปยอดนำส่งประจำเดือน
              </p>
            </div>

            <div style={css(`border-top:1px solid var(--border-subtle); padding-top:16px; display:flex; flex-direction:column; gap:12px;`)}>
              <h3 style={css(`font:var(--fw-semibold) var(--text-md)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                วิธีการสั่งพิมพ์ PDF:
              </h3>
              <ol style={css(`margin:0; padding-left:20px; display:flex; flex-direction:column; gap:8px; font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary);`)}>
                <li>เข้าสู่เมนู <strong>Dashboard</strong></li>
                <li>คลิกปุ่มเรืองแสงสีน้ำเงิน <strong>"พิมพ์รายงาน PDF"</strong> ที่ขอบขวาบนของหน้าจอ</li>
                <li>หน้าพรีวิวสำหรับสั่งพิมพ์เอกสารของบราวเซอร์จะทำงานโดยอัตโนมัติ</li>
                <li>
                  <strong>ตั้งค่าการพิมพ์ของบราวเซอร์:</strong> 
                  ตรวจสอบว่าได้เลือกปลายทางเป็น **"บันทึกเป็น PDF" (Save as PDF)**, เลือกขนาดกระดาษเป็น **A4** และตั้งค่า Layout เป็น **แนวตั้ง (Portrait)**
                </li>
                <li>กดยืนยันเพื่อบันทึกไฟล์รายงาน PDF ลงเครื่องและนำไปพิมพ์ส่งหัวหน้างาน</li>
              </ol>

              <div style={css(`background:var(--slate-50); border-left:4px solid var(--brand-700); padding:12px 16px; border-radius:0 var(--radius-md) var(--radius-md) 0; margin-top:8px; font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>
                <strong>✨ หมายเหตุพิเศษ:</strong> ในโหมดจัดพิมพ์กระดาษ ระบบจะซ่อน Sidebar แถบตัวเลือก และปุ่มการทำงานต่าง ๆ ออกทั้งหมดโดยอัตโนมัติ เพื่อให้ได้เอกสารขาวดำที่สะอาด มีทางการ เหมาะสมกับเกณฑ์ประเมิน QMS ของโรงพยาบาล
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
