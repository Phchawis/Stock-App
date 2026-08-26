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
    { id: 'reconciliation', label: 'การปรับปรุงสต็อก & ตัดจ่าย', icon: '⚖️' },
    { id: 'sticker', label: 'การสร้างสติกเกอร์ (Sticker)', icon: '🏷️' },
    { id: 'alerts', label: 'การแจ้งเตือน & บอท LINE', icon: '🔔' },
    { id: 'optimization', label: 'การควบคุม & เพิ่มประสิทธิภาพ', icon: '✨' },
    { id: 'preplog', label: 'บันทึกการเตรียมน้ำยา', icon: '🧾' },
    { id: 'downtime', label: 'แผนรองรับเมื่อระบบใช้งานไม่ได้', icon: '🚨' },
  ];

  return (
    <div className="qms-rise" style={css(`max-width:1180px; display:flex; flex-direction:column; gap:20px;`)}>
      {/* Motion layer. Only two things move: the panel acknowledges a tab
          change, and the FEFO / severity infographics demonstrate the rule they
          document (soonest-expiring leaves first; red is more urgent than
          amber). Nothing here is ambient decoration, and everything collapses
          to instant under prefers-reduced-motion. */}
      <style>{`
        @keyframes hlpFadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        /* Urgent, fast heartbeat — critical/red. */
        @keyframes hlpPulseCrit { 0%,100% { transform:scale(1); filter:drop-shadow(0 0 0 rgba(226,104,94,0)); } 50% { transform:scale(1.22); filter:drop-shadow(0 0 6px rgba(226,104,94,.7)); } }
        /* Calmer breathing — warning/amber. */
        @keyframes hlpBreathe { 0%,100% { transform:scale(1); } 50% { transform:scale(1.12); } }
        /* FEFO "next out" — the front-of-queue lot glows and lifts, teaching
           that the soonest-expiring lot is dispensed first. */
        @keyframes hlpGlowNext { 0%,100% { box-shadow:0 0 0 0 rgba(226,104,94,.0), 0 4px 14px -6px rgba(226,104,94,.35); } 50% { box-shadow:0 0 0 3px rgba(226,104,94,.28), 0 8px 22px -8px rgba(226,104,94,.6); } }
        /* Conveyor arrow flowing toward dispense. */
        @keyframes hlpFlow { 0% { transform:translateY(-3px); opacity:.35; } 50% { opacity:1; } 100% { transform:translateY(5px); opacity:.35; } }

        /* One short fade on tab change — it confirms "the panel swapped", which
           is state feedback. Deliberately NOT a staggered per-section reveal:
           this is a reference doc people scan, and an orchestrated load sequence
           makes them wait to read. It also never starts from opacity:0, so the
           content is readable even if the animation never runs (background tab,
           headless render). */
        .hlp-panel { animation:hlpFadeUp .18s ease-out; }

        .hlp-dot-crit { display:inline-block; animation:hlpPulseCrit 1.1s ease-in-out infinite; transform-origin:center; }
        .hlp-dot-warn { display:inline-block; animation:hlpBreathe 2.6s ease-in-out infinite; transform-origin:center; }

        .hlp-fefo-next { animation:hlpGlowNext 2s ease-in-out infinite; }
        .hlp-flow { animation:hlpFlow 1.4s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .hlp-panel { animation:none !important; }
          .hlp-dot-crit, .hlp-dot-warn, .hlp-fefo-next, .hlp-flow { animation:none !important; }
        }
      `}</style>
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

      {/* Help Content Area — keyed by activeTab so the entrance motion replays
          each time the reader opens a new section. */}
      <div key={activeTab} className="hlp-panel" style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:24px; box-sizing:border-box; min-height:400px; display:flex; flex-direction:column; gap:20px;`)}>

        {/* Tab 1: General & Roles */}
        {activeTab === 'general' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                คู่มือการใช้งานระบบคลังน้ำยา CMTL Reagent Inventory
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                ระบบจัดการคลังน้ำยาเคมีสำหรับห้องปฏิบัติการ ธรรมศาสตร์เฉลิมพระเกียรติ พัฒนาขึ้นเพื่อช่วยบริหารสต็อก ติดตามล็อตน้ำยา 
                และควบคุมการใช้งานแบบ <strong>หมดอายุก่อน–เบิกก่อน (First-Expired, First-Out)</strong> เพื่อประสิทธิภาพสูงสุดในการตรวจวินิจฉัยทางการแพทย์
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
                    <div style={css(`font:var(--fw-bold) var(--text-md)/1.1 var(--font-mono); color:var(--brand-ink);`)}>1,250 <span style={css(`font-size:11px;`)}>หน่วย</span></div>
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
              <h3 style={css(`font:var(--fw-semibold) var(--text-md)/1.3 var(--font-display); color:var(--text-primary); margin:0 0 12px 0;`)}>
                เกณฑ์การแจ้งเตือนและระดับสี (Alerts & Color Severity Criteria)
              </h3>
              <p style={css(`font:var(--text-sm)/1.5 var(--font-body); color:var(--text-secondary); margin:0 0 16px 0;`)}>
                ระบบจะตรวจสอบอายุการใช้งานของน้ำยาเคมีวิเคราะห์คลังหลักและระดับปริมาณเพื่อจัดทำประเภทสีการแจ้งเตือนตามเงื่อนไขดังนี้:
              </p>

              <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;`)}>
                {/* 1. Expiry alerts table card */}
                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:16px; display:flex; flex-direction:column; gap:10px;`)}>
                  <div style={css(`font:var(--fw-bold) var(--text-xs)/1.2 var(--font-body); color:var(--text-primary); display:flex; align-items:center; gap:6px;`)}>
                    <span>📅</span> <strong>การจัดกลุ่มวันหมดอายุ (Expiry Conditions)</strong>
                  </div>
                  <div style={css(`display:flex; flex-direction:column; gap:8px;`)}>
                    <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px; display:flex; justify-content:space-between; align-items:center;`)}>
                      <div>
                        <span style={css(`font-weight:bold; font-size:11px; background:var(--red-100); color:var(--red-700); padding:2px 8px; border-radius:var(--radius-pill);`)}>วิกฤต (Critical)</span>
                        <div style={css(`font-size:10px; color:var(--text-secondary); margin-top:4px;`)}>หมดอายุแล้ว หรือเหลือ ≤ 15 วัน</div>
                      </div>
                      <span className="hlp-dot-crit" style={css(`font-size:20px;`)}>🔴</span>
                    </div>
                    <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px; display:flex; justify-content:space-between; align-items:center;`)}>
                      <div>
                        <span style={css(`font-weight:bold; font-size:11px; background:var(--amber-100); color:var(--amber-700); padding:2px 8px; border-radius:var(--radius-pill);`)}>เฝ้าระวัง (Warning)</span>
                        <div style={css(`font-size:10px; color:var(--text-secondary); margin-top:4px;`)}>มีอายุใช้งานเหลือ 16 - 60 วัน</div>
                      </div>
                      <span className="hlp-dot-warn" style={css(`font-size:20px;`)}>🟡</span>
                    </div>
                    <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px; display:flex; justify-content:space-between; align-items:center;`)}>
                      <div>
                        <span style={css(`font-weight:bold; font-size:11px; background:var(--green-100); color:var(--green-700); padding:2px 8px; border-radius:var(--radius-pill);`)}>ปกติ (OK)</span>
                        <div style={css(`font-size:10px; color:var(--text-secondary); margin-top:4px;`)}>มีอายุใช้งานเหลือมากกว่า 60 วันขึ้นไป</div>
                      </div>
                      <span style={css(`font-size:20px;`)}>🟢</span>
                    </div>
                  </div>
                </div>

                {/* 2. Reorder level alerts table card */}
                <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:16px; display:flex; flex-direction:column; gap:10px;`)}>
                  <div style={css(`font:var(--fw-bold) var(--text-xs)/1.2 var(--font-body); color:var(--text-primary); display:flex; align-items:center; gap:6px;`)}>
                    <span>📦</span> <strong>การจัดกลุ่มระดับปริมาณสินค้า (Stock Level Conditions)</strong>
                  </div>
                  <div style={css(`display:flex; flex-direction:column; gap:8px;`)}>
                    <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px; display:flex; justify-content:space-between; align-items:center;`)}>
                      <div>
                        <span style={css(`font-weight:bold; font-size:11px; background:var(--red-100); color:var(--red-700); padding:2px 8px; border-radius:var(--radius-pill);`)}>วิกฤต (Critical)</span>
                        <div style={css(`font-size:10px; color:var(--text-secondary); margin-top:4px;`)}>ยอดของคงคลังเหลือ 0 (หมดเกลี้ยง)</div>
                      </div>
                      <span className="hlp-dot-crit" style={css(`font-size:20px;`)}>🔴</span>
                    </div>
                    <div style={css(`background:var(--white); border:1px solid var(--border-default); border-radius:var(--radius-md); padding:10px; display:flex; justify-content:space-between; align-items:center;`)}>
                      <div>
                        <span style={css(`font-weight:bold; font-size:11px; background:var(--amber-100); color:var(--amber-700); padding:2px 8px; border-radius:var(--radius-pill);`)}>เฝ้าระวัง (Warning)</span>
                        <div style={css(`font-size:10px; color:var(--text-secondary); margin-top:4px;`)}>ยอดคงคลัง ≤ จุดสั่งซื้อขั้นต่ำ (Min) แต่มากกว่า 0</div>
                      </div>
                      <span className="hlp-dot-warn" style={css(`font-size:20px;`)}>🟡</span>
                    </div>
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
                    <div>คลิกปุ่ม <strong>"รับเข้า Lot"</strong> หรือปุ่มนำเข้าบริเวณด้านขวาบนหน้าจอหลัก</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>2</span>
                    <div>ค้นหาหรือเลือกชื่อน้ำยา เช่น <strong>Glucose</strong> จากช่องเลือกน้ำยาหลัก</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>3</span>
                    <div>กรอก <strong>เลข Lot</strong> ของน้ำยา (ตรวจสอบจากข้างขวดหรือกล่องบรรจุให้ถูกต้อง)</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>4</span>
                    <div>ระบุ <strong>วันหมดอายุ (Expiry Date)</strong> *เป็นส่วนที่สำคัญที่สุดเพราะระบบจะเรียงคิวเบิกจ่ายอัตโนมัติตามจุดนี้*</div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>5</span>
                    <div>ระบุ <strong>จำนวนรับเข้า</strong> และกด <strong>"บันทึกรับเข้า"</strong> เพื่อเสร็จสิ้นขั้นตอน</div>
                  </div>
                </div>
              </div>

              {/* Visual Interface Simulator */}
              <div style={css(`position:relative; overflow:hidden; flex:1; min-width:320px; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
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
                      <div style={css(`padding:8px 12px; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); background:var(--slate-100); font-size:11px; color:var(--text-tertiary);`)}>ทนพ. ภาคย์ชวิศ พรประสิทธิ์แสง</div>
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
                ระบบจ่ายคิวอัตโนมัติแบบ <strong>หมดอายุก่อน–เบิกก่อน (First-Expired, First-Out)</strong> โดยยุบขั้นตอนเหลือเพียง 2 ขั้นตอนสั้นๆ เพื่อความรวดเร็วในการเบิกจ่ายที่หน้างานจริง
              </p>
            </div>

            <div style={css(`display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;`)}>
              {/* Process Steps */}
              <div style={css(`flex:1; min-width:280px; display:flex; flex-direction:column; gap:14px;`)}>
                <h3 style={css(`font:var(--fw-semibold) var(--text-sm)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                  ขั้นตอนการเบิกจ่าย (2 ขั้นตอน):
                </h3>
                <div style={css(`display:flex; flex-direction:column; gap:12px;`)}>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--accent-600); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>1</span>
                    <div><strong>สแกนบาร์โค้ด หรือ ระบุ Lot:</strong> กดเบิกจ่ายแล้วสแกนคิวอาร์โค้ดฉลากขวด หรือพิมพ์เลข Lot ทันที ระบบจะผูกข้อมูลล็อตและชื่อน้ำยาให้อัตโนมัติ (สามารถกดเลือกชื่อน้ำยาด้วยตนเองเป็นทางเลือกสำรองได้) แล้วกด <strong>"ถัดไป"</strong></div>
                  </div>
                  <div style={css(`display:flex; gap:10px; font-size:var(--text-xs); color:var(--text-secondary);`)}>
                    <span style={css(`width:20px; height:20px; border-radius:50%; background:var(--accent-600); color:#fff; display:grid; place-items:center; font-weight:bold; flex-shrink:0;`)}>2</span>
                    <div><strong>ระบุจำนวนเบิกจ่าย:</strong> ระบุจำนวนที่ต้องการเบิก (โดยไม่ต้องกรอกเลขที่ใบเบิก/เลขเอกสารอ้างอิงให้เสียเวลา) ตรวจสอบแผนการจัดสรรคิวล็อต FEFO ด้านล่าง แล้วกด <strong>"ยืนยันเบิกจ่าย"</strong> เพื่อตัดยอดคงคลังทันที</div>
                  </div>
                </div>
              </div>

              {/* Visual Queue Simulator */}
              <div style={css(`flex:1; min-width:320px; background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-xs)/1.2 var(--font-display); color:var(--accent-700); margin-bottom:12px; display:flex; align-items:center; gap:6px;`)}>
                  <span>📊</span> แบบจำลองระบบเรียงลำดับคิวเบิกจ่าย (หมดอายุก่อน–เบิกก่อน)
                </div>

                <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
                  <div className="hlp-fefo-next" style={css(`background:var(--white); border:2px solid var(--brand-600); border-radius:var(--radius-md); padding:10px 12px; display:flex; justify-content:space-between; align-items:center;`)}>
                    <div>
                      <div style={css(`font-weight:bold; font-size:11px; color:var(--text-primary);`)}>Lot 07601UN23</div>
                      <div style={css(`font-size:9px; color:var(--red-700); font-family:var(--font-mono);`)}>หมดอายุ: 26/10/2026 (ใกล้สุด)</div>
                    </div>
                    <div style={css(`text-align:right;`)}>
                      <span style={css(`font:var(--fw-semibold) 9px/1.2 var(--font-body); background:var(--red-100); color:var(--red-700); padding:2px 6px; border-radius:var(--radius-pill);`)}>คิวเบิกจ่ายอันดับ 1</span>
                      <div style={css(`font-size:10px; font-weight:bold; color:var(--text-secondary); margin-top:2px;`)}>เบิกออก: 1 กล่อง</div>
                    </div>
                  </div>

                  {/* Conveyor arrow: dispensing pulls from the front of the queue. */}
                  <div className="hlp-flow" style={css(`text-align:center; font-size:13px; line-height:1; color:var(--accent-600);`)}>⬇</div>

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
                  <div>1. <strong>ชื่อน้ำยา:</strong> ระบุชื่อเรียกทางการแพทย์ให้ครบถ้วนทั้งภาษาไทยและอังกฤษ</div>
                  <div>2. <strong>เกณฑ์สั่งซื้อซ้ำ (Min):</strong> ระบุจำนวนกล่องขั้นต่ำเพื่อเตือนสต็อกสั่งซื้อ</div>
                  <div>3. <strong>หน่วยนับหลัก และหน่วยนับย่อย:</strong> 
                    <div style={css(`padding-left:14px; margin-top:4px; border-left:2px solid var(--brand-300); color:var(--text-primary);`)}>
                      ตัวอย่าง: น้ำยา BUN บรรจุเป็นกล่องหลัก คือ <strong>`Box (กล่อง)`</strong> และมีหน่วยย่อยข้างใน คือ <strong>`Cassette`</strong> โดยกำหนดปริมาณบรรจุ <strong>`2`</strong> Cassette ต่อกล่อง ระบบจะคำนวณและแสดงค่าคลังเป็น `2 Cassette (1 Box)` อัตโนมัติ
                    </div>
                  </div>
                  <div>4. <strong>อัปโหลดภาพ:</strong> สามารถเลือกไฟล์รูปภาพขวดน้ำยาจริงบันทึกประกอบหน้าต่างสารบัญได้</div>
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
                แอปพลิเคชันรองรับการพิมพ์ใบรายงานยอดใช้จ่ายคลังน้ำยาในลักษณะเอกสารราชการสีขาวสะอาด ปราศจากปุ่มและรหัสน้ำยารกกระดาษ เพื่อใช้แนบเสนอประเมิน QMS โดยระบบได้ล็อกระยะขอบกระดาษทุกด้านไว้ที่ <strong>2 cm (20mm)</strong> เป็นมาตรฐานเรียบร้อยแล้ว
              </p>
            </div>

            <div style={css(`display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;`)}>
              {/* Text instructions */}
              <div style={css(`flex:1; min-width:280px; display:flex; flex-direction:column; gap:14px;`)}>
                <h3 style={css(`font:var(--fw-semibold) var(--text-sm)/1.3 var(--font-display); color:var(--text-primary); margin:0;`)}>
                  การตั้งค่าเครื่องพิมพ์บราวเซอร์เพื่อให้ได้ผลลัพธ์ที่ดีที่สุด:
                </h3>
                <div style={css(`display:flex; flex-direction:column; gap:12px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div>1. ไปที่เมนู <strong>Dashboard</strong> จากนั้นเลือกช่วงเวลาประเมินที่ต้องการ และคลิกปุ่ม <strong>"พิมพ์รายงาน PDF"</strong></div>
                  <div>2. หน้าต่างเครื่องมือพิมพ์ของ Google Chrome/Safari จะเปิดขึ้น</div>
                  <div>3. กำหนดตัวเลือกในแถบการพิมพ์ดังต่อไปนี้:
                    <ul style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:4px; color:var(--text-primary);`)}>
                      <li><strong>ปลายทาง (Destination):</strong> บันทึกเป็น PDF (Save as PDF) หรือเลือกเครื่องพิมพ์</li>
                      <li><strong>การจัดวาง (Layout):</strong> แนวตั้ง (Portrait)</li>
                      <li><strong>ขนาดกระดาษ (Paper size):</strong> A4</li>
                      <li><strong>ระยะขอบ (Margins):</strong> เลือกค่าเริ่มต้น (Default) *ระบบจัดระยะขอบ 2 cm ทุกด้านให้อัตโนมัติในสไตล์ชีทแล้ว*</li>
                      <li><strong>ส่วนหัวและส่วนท้าย (Headers & Footers):</strong> *ไม่เช็คถูก (Uncheck)* เพื่อลบ URL และวันที่ขอบกระดาษออก</li>
                    </ul>
                  </div>
                  <div>4. กดปุ่ม <strong>"พิมพ์ (Print)"</strong> หรือ <strong>"บันทึก (Save)"</strong> เพื่อเซฟไฟล์เอกสารสวยงามลงคอมพิวเตอร์</div>
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
                    <span style={css(`color:var(--text-secondary);`)}>Margins (ระยะขอบ)</span>
                    <span style={css(`font-weight:600; color:var(--text-primary);`)}>เริ่มต้น (2 cm อัตโนมัติ) ✔️</span>
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

        {/* Tab 6: Reconciliation */}
        {activeTab === 'reconciliation' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                การจัดการข้อยกเว้น: การปรับปรุงยอดสต็อกคลาดเคลื่อนและการตัดจำหน่ายน้ำยาชำรุด/หมดอายุ
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                เมื่อเกิดความไม่สอดคล้องกันระหว่างขวดจริงในคลังกับระบบคอมพิวเตอร์ หรือพบน้ำยาหมดอายุ/เสื่อมสภาพคาคลังก่อนเบิกใช้งาน ให้ทำตามคู่มือแนะนำดังนี้
              </p>
            </div>

            <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; align-items:flex-start;`)}>
              {/* Section 1: Disposal */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:var(--red-600);`)}>🗑️</span> 1. การตัดจำหน่ายน้ำยาหมดอายุ/ชำรุด (DISPOSE)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>กรณีใช้งาน:</strong> เมื่อน้ำยาหมดอายุคาคลัง หรือเกิดการแตกร้าว ปนเปื้อน หรือเสื่อมสภาพก่อนเบิกใช้งานปกติ</div>
                  <div><strong>ขั้นตอนดำเนินการ:</strong>
                    <ol style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:4px; color:var(--text-primary);`)}>
                      <li>ไปที่หน้า <strong>คลังน้ำยา (Inventory)</strong> คลิกรายการน้ำยาที่ต้องการ</li>
                      <li>ดูที่ตารางรายการ Lot ค้นหา Lot ที่หมดอายุหรือชำรุด</li>
                      <li>คลิกปุ่ม <strong>"🗑️ ตัดจำหน่าย"</strong> (เฉพาะ Admin/Supervisor)</li>
                      <li>ระบุจำนวนกล่อง/ขวดที่ต้องการคัดทิ้ง และเลือกสาเหตุ (เช่น หมดอายุ, เสื่อมสภาพ/ชำรุด)</li>
                      <li>กด <strong>"ยืนยันตัดจำหน่าย"</strong> ระบบจะตัดสต็อกและสร้างประวัติประเภท `DISPOSE`</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Section 2: Reconciliation */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:var(--brand-ink);`)}>📋</span> 2. การตรวจนับสต็อกและปรับยอดคลาดเคลื่อน (ADJUST)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>กรณีใช้งาน:</strong> หลังการนับสต็อกประจำสัปดาห์หรือประจำเดือน (Physical Count) แล้วพบยอดน้ำยาจริงไม่ตรงกับระบบคอมพิวเตอร์</div>
                  <div><strong>ขั้นตอนดำเนินการ:</strong>
                    <ol style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:4px; color:var(--text-primary);`)}>
                      <li>คลิกเมนูหลัก <strong>"ตรวจนับคลัง"</strong> ที่แถบเมนูด้านซ้าย (เฉพาะ Admin/Supervisor)</li>
                      <li>ตารางจะรวบรวม Lot ที่เปิดใช้งานอยู่ทั้งหมดมาแสดงผล</li>
                      <li>กรอกจำนวนที่นับได้จริงลงในช่อง <strong>"นับได้จริง"</strong> ระบบจะคำนวณส่วนต่างคลาดเคลื่อนให้อัตโนมัติ</li>
                      <li>กรอกเหตุผลที่ยอดไม่ตรงลงในช่องหมายเหตุ (เช่น ลืมคีย์เบิกจ่าย, นับผิดพลาด)</li>
                      <li>คลิก <strong>"บันทึกผลการตรวจนับทั้งหมด"</strong> และกดยืนยันในป๊อปอัปเพื่อลงบันทึกธุรกรรมปรับยอดประเภท `ADJUST`</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: Sticker Generator */}
        {activeTab === 'sticker' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                การพิมพ์สติกเกอร์ติดขวดน้ำยา (Sticker Generator Utility)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                ระบบสร้างและส่งออกไฟล์ภาพสติกเกอร์สำหรับขวดทดสอบน้ำยาแบ่งส่วน (Aliquot) และขวดเปิดใช้งาน (Opened) ความละเอียดสูง เพื่อนำไปพิมพ์ออกทางเครื่องพิมพ์สติกเกอร์ความร้อนโดยตรง
              </p>
            </div>

            <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; align-items:flex-start;`)}>
              {/* Aliquot Sticker Guide */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>🏷️</span> 1. Aliquot Sticker Form (3x2 cm)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>จุดประสงค์:</strong> ใช้ติดขวดแบ่งส่วนน้ำยา (Aliquot Tube) เพื่อบันทึกข้อมูลย้อนกลับ</div>
                  <div><strong>รายละเอียดข้อมูลและองค์ประกอบ:</strong>
                    <ul style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:4px; color:var(--text-primary);`)}>
                      <li><strong>ชื่อน้ำยาเคมี:</strong> มีระบบค้นหาและเลือกจากฐานข้อมูลอัจฉริยะ (พิมพ์และเลือกได้ทันที)</li>
                      <li><strong>เลข Lot:</strong> ดึงข้อมูล Lot เพื่อเชื่อมโยงการสืบย้อน</li>
                      <li><strong>วันที่เตรียม / วัน Exp.:</strong> บันทึกช่วงเวลาการทำ Aliquot</li>
                      <li><strong>ชื่อผู้เตรียม:</strong> ดึงชื่อผู้ใช้ปัจจุบันที่ Login อัตโนมัติ (โดยตัดคำนำหน้าวิชาชีพ ทนพ./ทนพญ. ออกให้โดยอัตโนมัติ)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Opened Sticker Guide */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>🧴</span> 2. Opened Sticker Form (4.5x2 cm)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>จุดประสงค์:</strong> ใช้ติดขวดหลักเมื่อเริ่มมีการเปิดจุกขวดน้ำยาใช้งานจริงครั้งแรก</div>
                  <div><strong>รายละเอียดข้อมูลและองค์ประกอบ:</strong>
                    <ul style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:4px; color:var(--text-primary);`)}>
                      <li><strong>ชื่อน้ำยาเคมี:</strong> ค้นหาอัจฉริยะพร้อมกล่องพิมพ์แยกสีทึบแสง (Opaque) บังส่วนอื่นป้องกันการสับสน</li>
                      <li><strong>วันที่เปิด (Opened Date) / ผู้เปิดใช้งาน:</strong> ระบุวันที่เปิดขวดและผู้รับผิดชอบ</li>
                      <li><strong>การเก็บรักษาระยะยาว:</strong> แสดงอุณหภูมิเก็บรักษา (After open storage 2-8 °C) พร้อมระบุระยะเวลาที่น้ำยาอยู่ได้หลังเปิด (7 วัน, 14 วัน, 30 วัน หรือ จนกว่าจะหมดอายุ)</li>
                      <li><strong>รูปแบบสติกเกอร์:</strong> ดีไซน์แบบไม่มีขอบตัวการ์ดเพื่อขยายข้อความให้คมชัดที่สุด</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Printing Guidelines */}
            <div style={css(`background:var(--brand-50); border:1px solid var(--brand-300); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
              <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--brand-ink); margin-bottom:8px; display:flex; align-items:center; gap:8px;`)}>
                <span>🖨️</span> คำแนะนำในการดาวน์โหลดและสั่งพิมพ์ให้คมชัดที่สุด
              </div>
              <div style={css(`font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6; display:flex; flex-direction:column; gap:8px;`)}>
                <div>1. เมื่อพิมพ์กรอกข้อมูลครบถ้วนแล้ว ให้คลิกปุ่ม <strong>"📥 ดาวน์โหลดไฟล์ PNG"</strong> เพื่อเซฟไฟล์ภาพสติกเกอร์ความละเอียดระดับ HD ลงในเครื่อง</div>
                <div>2. เพื่อความคมชัดสูงสุด แนะนำให้นำไฟล์ภาพที่ได้ไปสั่งพิมพ์ผ่านโปรแกรมพิมพ์สลากโดยเฉพาะของตัวเครื่องพิมพ์ความร้อน (เช่น <strong>BarTender</strong> หรือ <strong>GoLabel</strong>) เพื่อให้ไดรเวอร์เครื่องพิมพ์ทำการจับคู่พิกเซล 1-to-1 แบบขาวดำคมกริบ</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: Alerts & LINE */}
        {activeTab === 'alerts' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                ระบบแจ้งเตือนอัจฉริยะ & ตัวเชื่อมต่อบอท LINE (Alerts & LINE Notification System)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                คู่มือการทำรายการจัดการแจ้งเตือนภายในหน้าเว็บบราวเซอร์ และพฤติกรรมระบบการยิงแจ้งเตือนผ่านบอทไลน์เข้าห้องแชทกลุ่มอัตโนมัติ
              </p>
            </div>

            <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; align-items:flex-start;`)}>
              {/* Section 1: In-App Alerts */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:#f97316;`)}>🔔</span> 1. การจัดการการแจ้งเตือนในระบบ (In-App Alerts)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>ประเภทและเกณฑ์การแสดงผล:</strong>
                    <ul style={css(`margin:4px 0; padding-left:14px;`)}>
                      <li><strong>สีแดง (วิกฤต):</strong> น้ำยาหมดสต็อกคาคลัง หรือสารเคมีเหลืออายุใช้งาน ≤ 15 วัน</li>
                      <li><strong>สีส้ม (สั่งซื้อแล้ว):</strong> รายการสั่งซื้อซ้ำที่ได้รับการจัดการสั่งของไปแล้วและรอนำส่งมอบ</li>
                    </ul>
                  </div>
                  <div><strong>วิธีการจัดการสถานะใบสั่งซื้อ (แนวทางที่ 2):</strong>
                    <ol style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:6px; color:var(--text-primary);`)}>
                      <li>เมื่อมีรายการ <strong>"ต่ำกว่าจุดสั่งซื้อ"</strong> โผล่ขึ้นมา ให้กดปุ่ม <strong>"สั่งซื้อแล้ว / รอของ"</strong> บาร์จะเปลี่ยนเป็นสีส้มพาสเทลและดันลงไปด้านล่าง</li>
                      <li>ตัวเลขวงกลมสีแดงในแถบเมนูข้างๆ จะลดลงโดยอัตโนมัติเพื่อลดความซ้ำซ้อน</li>
                      <li>เมื่อของมาส่งมอบแล้ว ให้คลิกปุ่ม <strong>"รับเข้า Lot"</strong> สีเขียวเพื่อคีย์จำนวน ระบบจะเคลียร์การแจ้งเตือนทิ้งให้อัตโนมัติเมื่อสต็อกสูงกว่าจุด Min</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Section 2: LINE Notification */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:#06C755;`)}>💬</span> 2. ระบบบอท LINE แจ้งเตือนอัตโนมัติ (LINE Notification)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>พฤติกรรมการยิงเตือน:</strong>
                    <ul style={css(`margin:4px 0; padding-left:14px;`)}>
                      <li>บอทจะสแกนและส่งข้อความแจ้งเตือน <strong>"น้ำยาหมดอายุ / วิกฤตใกล้หมดอายุ (สีแดง: ≤ 15 วัน)"</strong> เข้ากลุ่มโดยตรง</li>
                      <li><strong>แจ้งเตือนอัตโนมัติ:</strong> ระบบจะทำงานส่งข้อมูลให้อัตโนมัติทุกวันในเวลา <strong>08:00 น.</strong> (ตั้งเวลาทำงานผ่าน Cron Job)</li>
                      <li><strong>ส่งแมนนวล:</strong> เจ้าหน้าที่สามารถกดปุ่มสีเขียว <strong>"ส่งแจ้งเตือนน้ำยาใกล้หมดอายุเข้า LINE"</strong> บนหน้าเว็บเพื่อส่งทันทีได้ตลอดเวลา</li>
                    </ul>
                  </div>
                  <div><strong>เงื่อนไขการหยุดส่งเตือน:</strong>
                    <ol style={css(`margin:6px 0 0 0; padding-left:18px; display:flex; flex-direction:column; gap:6px; color:var(--text-primary);`)}>
                      <li>บอทจะส่งซ้ำทุกวันตราบใดที่น้ำยาล็อตนั้นยังแช่อยู่ในสต็อก (แม้จะกดรับทราบแล้ว) เพื่อความปลอดภัยสูงสุด</li>
                      <li>บอทจะหยุดส่งข้อความเตือนเมื่อมีการกด <strong>"เบิกจ่ายจนเหลือ 0"</strong> หรือกด <strong>"ตัดจำหน่าย (Dispose)"</strong> ล็อตที่เสื่อมสภาพทิ้งแล้วเท่านั้น</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Optimization & Security */}
        {activeTab === 'optimization' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                การควบคุมความปลอดภัย & เพิ่มประสิทธิภาพวิเคราะห์คลัง (Security & Optimization Guide)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0;`)}>
                คู่มือการควบคุมความปลอดภัยหน้าจอกลางแล็บด้วยระบบตัดสิทธิ์เมื่อไม่มีการเคลื่อนไหว, การวิเคราะห์จุดสั่งซื้อแนะนำ, การตรวจสอบน้ำยาแช่ตกค้าง, และการติดตั้งเว็บแอปพลิเคชันลงเครื่องคอมพิวเตอร์/มือถือ (PWA)
              </p>
            </div>

            <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; align-items:flex-start;`)}>
              
              {/* Section 1: Auto Logout & Security */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:#d97706;`)}>⏰</span> 1. ระบบออกจากระบบอัตโนมัติ (Idle Auto-Logout)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>เกณฑ์ความปลอดภัยสำหรับ Shared PC:</strong>
                    <ul style={css(`margin:4px 0; padding-left:14px;`)}>
                      <li>หากหน้าจอค้างไว้และ <strong>ไม่มีการเคลื่อนไหวเมาส์ พิมพ์คีย์บอร์ด คลิก หรือเลื่อนหน้าจอ เกิน 20 นาที</strong> ระบบจะเตรียมการเซฟตี้</li>
                      <li><strong>กล่องแจ้งเตือนเวลานับถอยหลัง</strong>: ระบบจะแสดงป๊อปอัปแจ้งเตือนล่วงหน้า <strong>30 วินาที</strong> พร้อมตัวเลขนับถอยหลัง เพื่อป้องกันการตัดสิทธิ์ระหว่างใช้งานค้าง</li>
                      <li><strong>ปุ่มยืนยัน</strong>: เจ้าหน้าที่สามารถกด <strong>"ทำงานต่อ (Resume)"</strong> เพื่อต่ออายุเซสชัน หรือเลือกกดออกจากระบบทันทีได้</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 2: PWA Installation */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:var(--brand-ink);`)}>📱</span> 2. การติดตั้งแอปพลิเคชันลงบนเครื่องคอมพิวเตอร์/มือถือ (PWA)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>ประโยชน์ของระบบ PWA:</strong>
                    <ul style={css(`margin:4px 0; padding-left:14px;`)}>
                      <li>ระบบรองรับการติดตั้งลงบนแท็บเล็ต มือถือ หรือเครื่อง PC ประจำเคาน์เตอร์วิเคราะห์โดยขึ้นไอคอนบนหน้าจอเหมือนแอปพลิเคชันปกติ (ไม่ต้องเข้า Browser ค้นหา URL)</li>
                      <li><strong>การติดตั้งบน Google Chrome (PC)</strong>: สังเกตที่ช่องกรอก URL ด้านบนขวา จะมีสัญลักษณ์ <strong>"ติดตั้งแอป (Install App)"</strong> หรือรูปหน้าต่างพร้อมลูกศรชี้ลง ให้กดตกลง</li>
                      <li><strong>การติดตั้งบน iOS Safari (iPhone/iPad)</strong>: กดปุ่ม <strong>"แชร์ (Share)"</strong> ตรงแถบเมนูด้านล่าง แล้วเลือก <strong>"เพิ่มไปยังหน้าจอโฮม (Add to Home Screen)"</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Section 3: Optimization Metrics */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:var(--green-700);`)}>📈</span> 3. ระบบวิเคราะห์และปรับปรุงคลัง (Inventory Optimization)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.5;`)}>
                  <div><strong>การใช้งานระบบวิเคราะห์สต็อก:</strong>
                    <ul style={css(`margin:4px 0; padding-left:14px;`)}>
                      <li><strong>Dead Stock (น้ำยาแช่ตกค้าง)</strong>: แสดงยอดน้ำยาที่มีของในตู้เย็น แต่ไม่มีบันทึกการเบิกใช้เลยติดต่อกันเกิน <strong>60 วัน</strong> เพื่อป้องกันการหมดอายุคาตู้</li>
                      <li><strong>Dynamic Min (จุดสั่งซื้อแนะนำ)</strong>: ระบบคำนวณยอดใช้เฉลี่ยรายเดือนจริงในช่วง 90 วันล่าสุด และแนะค่า Min ที่เหมาะสม เช่น หากใช้น้อยลง ระบบจะแนะนำให้ลดค่า Min เพื่อลดพื้นที่เก็บ และลดภาระทุนจม</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 10: Preparation record — what the sticker log is for and how it
            is meant to be used when an inspector asks for it. */}
        {activeTab === 'preplog' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                บันทึกการเตรียมน้ำยา (Reagent Preparation Record)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0; max-width:78ch;`)}>
                ทุกครั้งที่ดาวน์โหลดสติกเกอร์จากหน้า <strong>สร้างสติกเกอร์</strong> หรือพิมพ์ฉลาก QR ประจำ Lot ระบบจะบันทึกรายละเอียดบนฉลากไว้อัตโนมัติ ไม่ต้องกดบันทึกเอง เพื่อใช้เป็นหลักฐานย้อนหลังตอนตรวจประเมิน
              </p>
            </div>

            <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; align-items:flex-start;`)}>
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>🏷️</span> 1. ระบบเก็บอะไรบ้าง
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li><strong>ฉลากแบ่งบรรจุ (Aliquot)</strong> — ชื่อน้ำยา · เลข Lot · วันที่เตรียม · วันหมดอายุ · ผู้เตรียม</li>
                    <li><strong>ฉลากเปิดใช้ (Opened)</strong> — ชื่อน้ำยา · Control/Calibrator · วันที่เปิดใช้ · อุณหภูมิเก็บ · อายุหลังเปิด · ผู้เปิด</li>
                    <li><strong>ฉลาก QR ประจำ Lot</strong> — ชื่อน้ำยา · เลข Lot · วันหมดอายุ · ตำแหน่งเก็บ</li>
                  </ul>
                </div>
              </div>

              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>🔍</span> 2. ทำไมเชื่อถือได้
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li>ระบบแยก 2 ชื่อ: <strong>ผู้เตรียม</strong> คือชื่อที่พิมพ์ลงบนฉลาก (แก้ได้) ส่วน <strong>ผู้ทำรายการ</strong> ดึงจากบัญชีที่เข้าสู่ระบบ</li>
                    <li><strong>วันเวลาและผู้ทำรายการปลอมไม่ได้</strong> — บันทึกจากนาฬิกาเซิร์ฟเวอร์และเซสชันผู้ใช้ ไม่ได้รับค่าจากหน้าจอ</li>
                    <li><strong>ผู้ใช้ทั่วไปลบบันทึกไม่ได้</strong> เฉพาะผู้ดูแลระบบเท่านั้น และปุ่มลบจะไม่ปรากฏให้บทบาทอื่นเห็น</li>
                  </ul>
                </div>
              </div>

              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>🖨</span> 3. ใช้ตอนตรวจประเมินอย่างไร
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li>เข้าเมนู <strong>บันทึกการเตรียมน้ำยา</strong> แล้วกรองตาม <strong>ช่วงวันที่</strong> หรือ <strong>ประเภทฉลาก</strong> ที่ผู้ตรวจขอดู</li>
                    <li>กด <strong>พิมพ์เอกสาร / บันทึกเป็น PDF</strong> จะได้ฟอร์ม <strong>FM-LAB-PREP-01</strong> พร้อมหัวกระดาษและช่องลงนาม 2 ช่อง</li>
                    <li>เอกสารจะพิมพ์<strong>เฉพาะรายการที่กรองไว้</strong> ไม่ใช่ทั้งหมด</li>
                    <li>ต้องการเปิดใน Excel ให้กด <strong>ส่งออก Excel (CSV)</strong> ภาษาไทยไม่เพี้ยน</li>
                  </ul>
                </div>
              </div>

              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:var(--amber-700);`)}>⚠️</span> 4. ข้อควรระวัง
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li>ต้อง<strong>เลือกชื่อน้ำยาก่อน</strong>จึงจะดาวน์โหลดได้ ระบบไม่ยอมให้บันทึกฉลากที่ไม่มีชื่อน้ำยา</li>
                    <li>ดาวน์โหลดซ้ำหลายครั้งจะถูกบันทึกเป็น<strong>หลายรายการ</strong> ตามความจริงที่เกิดขึ้น</li>
                    <li>หน้าจอแสดงย้อนหลัง <strong>12 เดือน</strong> ถ้าต้องการเก่ากว่านั้นให้กด <strong>โหลดบันทึกทั้งหมด</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: Downtime plan.
            The app is browser-only with no offline mode, so an internet or
            platform outage takes away expiry checking, FEFO issuing and every
            movement record at once. This tab is the paper procedure for that
            window, plus the form the lab writes on while the system is down. */}
        {activeTab === 'downtime' && (
          <div style={css(`display:flex; flex-direction:column; gap:24px;`)}>
            <div>
              <h2 style={css(`font:var(--fw-bold) var(--text-lg)/1.2 var(--font-display); color:var(--text-primary); margin:0 0 8px 0;`)}>
                แผนรองรับเมื่อระบบใช้งานไม่ได้ (Downtime Plan)
              </h2>
              <p style={css(`font:var(--text-sm)/1.6 var(--font-body); color:var(--text-secondary); margin:0; max-width:78ch;`)}>
                ระบบนี้ทำงานผ่านอินเทอร์เน็ตทั้งหมด ไม่มีโหมดออฟไลน์ หากเปิดใช้งานไม่ได้จะ<strong> ตรวจสอบวันหมดอายุ เบิกจ่ายตามหลัก FEFO และบันทึกการเคลื่อนไหวไม่ได้ทันที</strong> ขั้นตอนด้านล่างคือสิ่งที่ต้องทำระหว่างนั้น เพื่อให้งานเดินต่อได้และข้อมูลไม่สูญหาย
              </p>
            </div>

            {/* Print the paper fallback form */}
            <div style={css(`background:var(--amber-100); border:1px solid var(--amber-fill); border-radius:var(--radius-lg); padding:16px 20px; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap;`)}>
              <div style={css(`font:var(--text-xs)/1.6 var(--font-body); color:var(--amber-700); max-width:64ch;`)}>
                <strong>เตรียมล่วงหน้า:</strong> พิมพ์ฟอร์มกระดาษสำรองเก็บใส่แฟ้มไว้ที่คลังน้ำยาอย่างน้อย 10 ชุด — ตอนระบบล่มจะเปิดหน้านี้เพื่อสั่งพิมพ์ไม่ได้
              </div>
              <button onClick={() => window.print()}
                style={css(`padding:10px 18px; border-radius:var(--radius-md); border:none; background:var(--accent-600); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); white-space:nowrap; box-shadow:var(--glow-accent);`)}>
                🖨 พิมพ์ฟอร์มกระดาษสำรอง
              </button>
            </div>

            <div style={css(`display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px; align-items:flex-start;`)}>

              {/* Step 1 — triage */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span className="hlp-dot-crit" style={css(`color:var(--red-700);`)}>●</span> 1. ตรวจสอบก่อนว่าเป็นที่อะไร
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li><strong>เข้าสู่ระบบไม่ได้ ขึ้นว่าผิดหลายครั้ง</strong> — ระบบล็อกบัญชี 15 นาทีเพื่อกันการเดารหัส ให้รอครบเวลาแล้วลองใหม่ ไม่ใช่ระบบล่ม</li>
                    <li><strong>เว็บเปิดไม่ขึ้นทั้งหน้า</strong> — ลองเปิดเว็บอื่นดู ถ้าเปิดไม่ได้เหมือนกันคือ<strong>อินเทอร์เน็ตของห้องแล็บ</strong> ให้แจ้งฝ่าย IT โรงพยาบาล</li>
                    <li><strong>เว็บเปิดได้แต่ข้อมูลไม่ขึ้น / ขึ้นแจ้งเตือนสีแดง</strong> — เป็นที่ฐานข้อมูลหรือผู้ให้บริการ ให้แจ้งผู้ดูแลระบบตามข้อ 5</li>
                  </ul>
                  <div style={css(`background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:10px 12px;`)}>
                    ⏱ <strong>ไม่ต้องรอนาน</strong> — ถ้าเกิน 10 นาทีแล้วยังใช้ไม่ได้ ให้เปลี่ยนไปใช้ฟอร์มกระดาษทันที อย่าหยุดงานรอระบบ
                  </div>
                </div>
              </div>

              {/* Step 2 — work on paper */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>📝</span> 2. ระหว่างระบบใช้ไม่ได้ — บันทึกลงกระดาษ
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li>หยิบ <strong>ฟอร์มบันทึกสำรอง (FM-LAB-DT-01)</strong> จากแฟ้มที่คลังน้ำยา</li>
                    <li>ทุกครั้งที่ <strong>รับเข้า</strong> หรือ <strong>เบิกจ่าย</strong> ให้เขียนลงฟอร์ม ห้ามข้าม แม้จะจำได้ก็ตาม</li>
                    <li>เขียนให้ครบ: วันเวลา · ชื่อน้ำยา · <strong>เลข Lot</strong> · วันหมดอายุ · จำนวน · ผู้ทำรายการ · ลงชื่อ</li>
                    <li>การเบิกจ่ายยังต้องยึด <strong>หมดอายุก่อน–เบิกก่อน (FEFO)</strong> เหมือนเดิม โดยดูจากวันหมดอายุที่ฉลากขวดจริง</li>
                    <li>ถ้าต้องติดฉลากน้ำยาที่เตรียมใหม่ ให้เขียนฉลากด้วยมือ แล้วบันทึกลงฟอร์มด้วย เพื่อคีย์เข้าระบบย้อนหลังภายหลัง</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 — catch up */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>⏪</span> 3. เมื่อระบบกลับมา — คีย์ย้อนหลัง
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li>คีย์รายการจากฟอร์มกระดาษเข้าระบบ <strong>เรียงตามลำดับเวลาที่เกิดจริง</strong> (รายการแรกสุดก่อน) เพื่อให้ยอดคงเหลือเดินถูกต้อง</li>
                    <li>ใส่วันเวลาที่เกิดจริงลงในช่อง <strong>เลขที่อ้างอิง</strong> เช่น <code>ตามฟอร์ม DT 6 ส.ค. 69 เวลา 09:15</code></li>
                    <li>คีย์ครบแล้วให้ไปที่ <strong>ตรวจนับคลัง</strong> เพื่อตรวจว่ายอดในระบบตรงกับของจริงในตู้</li>
                    <li>ลงชื่อผู้คีย์และผู้ตรวจสอบในท้ายฟอร์ม แล้ว<strong>เก็บฟอร์มเข้าแฟ้ม ห้ามทิ้ง</strong></li>
                  </ul>
                  <div style={css(`background:var(--amber-100); border:1px solid var(--amber-fill); border-radius:var(--radius-md); padding:10px 12px; color:var(--amber-700);`)}>
                    ⚠️ <strong>ข้อควรรู้:</strong> รายการที่คีย์ย้อนหลังจะถูกบันทึกด้วย<strong>เวลาที่คีย์</strong> ไม่ใช่เวลาที่ทำจริง ระบบออกแบบให้แก้ย้อนหลังไม่ได้เพื่อกันการปลอมแปลง ดังนั้น <strong>ฟอร์มกระดาษคือหลักฐานหลักของช่วงเวลานั้น</strong>
                  </div>
                </div>
              </div>

              {/* Step 4 — prevention */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span style={css(`color:var(--green-700);`)}>🛡️</span> 4. เตรียมล่วงหน้า (ทำเป็นประจำ)
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <ul style={css(`margin:0; padding-left:16px; display:flex; flex-direction:column; gap:7px;`)}>
                    <li><strong>สำรองข้อมูลทุกสัปดาห์</strong> — ผู้ดูแลระบบกดปุ่มสำรองข้อมูล แล้วเก็บไฟล์ไว้อย่างน้อย 2 ที่ (เครื่องคอมพ์ + ไดรฟ์ของหน่วยงาน) ไฟล์สำรอง<strong>ไม่มีรหัสผ่านติดไปด้วย</strong> จึงเก็บได้อย่างปลอดภัย</li>
                    <li><strong>พิมพ์รายการ Lot ใกล้หมดอายุทุกสัปดาห์</strong> จากหน้าการแจ้งเตือน เก็บใส่แฟ้ม — ตอนระบบล่มจะได้ยังตรวจสอบวันหมดอายุและเบิกตาม FEFO ได้</li>
                    <li><strong>เก็บฟอร์มกระดาษสำรองไว้อย่างน้อย 10 ชุด</strong> ในแฟ้มที่คลังน้ำยา</li>
                    <li>อย่าให้เหลือผู้ดูแลระบบ (Admin) เพียงคนเดียว ควรมีอย่างน้อย 2 คน เผื่อคนหนึ่งลาหรือติดต่อไม่ได้</li>
                  </ul>
                </div>
              </div>

              {/* Step 5 — contacts */}
              <div style={css(`background:var(--slate-50); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:20px; box-sizing:border-box;`)}>
                <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;`)}>
                  <span>📞</span> 5. ติดต่อใคร
                </div>
                <div style={css(`display:flex; flex-direction:column; gap:10px; font-size:var(--text-xs); color:var(--text-secondary); line-height:1.6;`)}>
                  <div style={css(`background:var(--surface-card); border:1px dashed var(--border-default); border-radius:var(--radius-md); padding:12px 14px; display:flex; flex-direction:column; gap:8px;`)}>
                    <div>ผู้ดูแลระบบคลังน้ำยา: <strong>............................................</strong> โทร <strong>........................</strong></div>
                    <div>หัวหน้าห้องปฏิบัติการ: <strong>............................................</strong> โทร <strong>........................</strong></div>
                    <div>ฝ่าย IT โรงพยาบาล (กรณีเน็ตล่ม): โทร <strong>........................</strong></div>
                  </div>
                  <div style={css(`color:var(--text-tertiary);`)}>
                    ※ ช่องว่างด้านบนให้เขียนเติมลงในเอกสารที่พิมพ์ออกมา หรือแจ้งผู้พัฒนาให้ใส่ชื่อ–เบอร์ลงในระบบถาวรก็ได้
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ── Printed paper fallback form (screen-hidden) ─────────────────── */}
      <style>{`
        @page { size: A4 portrait; margin: 1.5cm; }
        @media print {
          *, *::before, *::after {
            background-color: transparent !important; color: #000 !important;
            box-shadow: none !important; text-shadow: none !important;
          }
          html, body, #root, main, .qms-rise, .dt-doc, .dt-doc * {
            background: #ffffff !important; color: #000000 !important;
          }
          html, body, #root, #root > div, main, .qms-rise {
            height: auto !important; min-height: auto !important;
            overflow: visible !important; display: block !important; position: static !important;
          }
          aside, header, button, .no-print, nav,
          .qms-rise > *:not(.dt-doc), [class*="Sidebar"], [class*="Header"] { display: none !important; }
          main, .qms-rise { padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          .dt-doc {
            display: block !important; width: 17.8cm !important; max-width: 17.8cm !important;
            margin: 0 auto !important; padding: 0 !important; box-sizing: border-box;
          }
          .dt-table { width: 100% !important; border-collapse: collapse !important; margin-top: 6px !important; }
          .dt-table th, .dt-table td {
            border: 1px solid #7a7a7a !important; padding: 3px 5px !important;
            font-size: 8px !important; color: #000 !important; vertical-align: middle !important;
          }
          .dt-table th { background: #ececec !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-weight: bold !important; }
          /* Hand-written rows need real height to write in. */
          .dt-table tbody tr { height: 26px !important; page-break-inside: avoid !important; }
          .dt-signoff { page-break-inside: avoid !important; }
        }
        @media screen { .dt-doc { display: none; } }
      `}</style>

      <div className="dt-doc" style={css(`color:#000; font-family:var(--font-body);`)}>
        <div style={css(`display:flex; align-items:center; gap:12px; border-bottom:2px solid #000; padding-bottom:8px;`)}>
          <div style={css(`width:52px; height:52px; border-radius:50%; overflow:hidden; flex-shrink:0;`)}>
            <img src="/assets/tuh_lab_logo.jpg" alt="TUH Logo" style={{ width: '102%', height: '102%', objectFit: 'cover', borderRadius: '50%' }} />
          </div>
          <div style={css(`flex:1; text-align:left;`)}>
            <h1 style={css(`margin:0; font-size:13px; font-weight:bold; color:#000; font-family:var(--font-display); line-height:1.35;`)}>หมวดงานปฏิบัติการตรวจวินิจฉัยทางการแพทย์</h1>
            <div style={css(`margin:0; font-size:12px; font-weight:bold; color:#000; font-family:var(--font-display); line-height:1.35;`)}>ห้องปฏิบัติการเทคนิคการแพทย์</div>
            <div style={css(`margin:0; font-size:12px; font-weight:bold; color:#000; font-family:var(--font-display); line-height:1.35;`)}>โรงพยาบาลธรรมศาสตร์เฉลิมพระเกียรติ</div>
            <h3 style={css(`margin:6px 0 0; font-size:12px; font-weight:bold; color:#111;`)}>ฟอร์มบันทึกสำรองเมื่อระบบคลังน้ำยาใช้งานไม่ได้ (Downtime Log)</h3>
          </div>
          <div style={css(`text-align:right; font-size:8px; color:#333; line-height:1.5; flex-shrink:0;`)}>
            <div style={css(`font-weight:bold;`)}>FM-LAB-DT-01</div>
            <div>แก้ไขครั้งที่ 00</div>
            <div>หน้า ........ / ........</div>
          </div>
        </div>

        <div style={css(`font-size:9px; color:#000; margin-top:8px; line-height:2.1;`)}>
          <div>วันที่เกิดเหตุ ................................................ ระบบใช้งานไม่ได้ตั้งแต่เวลา .................... น. ถึงเวลา .................... น.</div>
          <div>อาการ / สาเหตุที่พบ ..............................................................................................................................................................</div>
          <div>ผู้บันทึกประจำเวร ................................................................ แจ้งผู้ดูแลระบบเมื่อเวลา .................... น.</div>
        </div>

        <table className="dt-table">
          <thead>
            <tr>
              <th style={{ width: '4%' }}>ที่</th>
              <th style={{ width: '11%' }}>วัน–เวลาที่ทำจริง</th>
              <th style={{ width: '11%' }}>รับเข้า / เบิกจ่าย</th>
              <th style={{ width: '21%' }}>ชื่อน้ำยา</th>
              <th style={{ width: '12%' }}>เลข Lot</th>
              <th style={{ width: '11%' }}>วันหมดอายุ</th>
              <th style={{ width: '8%' }}>จำนวน</th>
              <th style={{ width: '11%' }}>ผู้ทำรายการ</th>
              <th style={{ width: '11%' }}>ลงชื่อ</th>
            </tr>
          </thead>
          <tbody>
            {/* Blank rows to write on. 14 fills an A4 page without crowding. */}
            {Array.from({ length: 14 }, (_, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center' }}>{i + 1}</td>
                <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={css(`margin-top:10px; border:1px solid #7a7a7a; padding:8px 10px; font-size:8.5px; line-height:1.9; color:#000;`)}>
          <div style={css(`font-weight:bold; margin-bottom:3px;`)}>ส่วนที่ 2 — ยืนยันการคีย์ข้อมูลย้อนหลังเข้าระบบ (กรอกเมื่อระบบกลับมาใช้งานได้แล้ว)</div>
          <div>คีย์ข้อมูลย้อนหลังครบถ้วนเมื่อวันที่ ............................ เวลา .................... น. · จำนวนรายการที่คีย์ ............ รายการ</div>
          <div>ตรวจนับคลังเทียบยอดหลังคีย์: ☐ ตรงกัน ☐ ไม่ตรงกัน (ระบุส่วนต่างและการแก้ไข) ..........................................................</div>
        </div>

        <div className="dt-signoff" style={css(`display:flex; justify-content:space-around; gap:24px; margin-top:22px; font-size:9px; color:#000;`)}>
          <div style={css(`text-align:center; width:200px;`)}>
            <p style={css(`margin:0 0 24px;`)}>ลงชื่อ.................................................</p>
            <p style={css(`margin:0; font-weight:bold;`)}>( ............................................. )</p>
            <p style={css(`margin:2px 0 0; color:#666;`)}>ผู้คีย์ข้อมูลย้อนหลัง</p>
          </div>
          <div style={css(`text-align:center; width:200px;`)}>
            <p style={css(`margin:0 0 24px;`)}>ลงชื่อ.................................................</p>
            <p style={css(`margin:0; font-weight:bold;`)}>( ............................................. )</p>
            <p style={css(`margin:2px 0 0; color:#666;`)}>หัวหน้าห้องปฏิบัติการ / ผู้ตรวจสอบ</p>
          </div>
        </div>

        <p style={css(`margin-top:14px; font-size:7.5px; color:#555; border-top:1px solid #ccc; padding-top:5px; line-height:1.6;`)}>
          ฟอร์มนี้เป็นหลักฐานหลักของการรับเข้า–เบิกจ่ายในช่วงที่ระบบใช้งานไม่ได้ เนื่องจากรายการที่คีย์ย้อนหลังจะถูกบันทึกด้วยเวลาที่คีย์ ไม่ใช่เวลาที่เกิดจริง · เก็บเข้าแฟ้มหลังคีย์ข้อมูลและลงนามครบถ้วนแล้ว
        </p>
      </div>
    </div>
  );
}
