import React from 'react';
import { css } from '../css.js';

export function Sidebar({ v }) {
  const {
    ic, user, onLogout, nav, go, title,
    openReceive, openIssue, kpi, sidebarOpen, canManage,
  } = v;

  const localStyle = `
    .sidebar-logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 18px 16px;
      border-bottom: 1px solid var(--border-subtle);
      text-decoration: none;
      cursor: pointer;
      transition: background-color var(--dur-fast);
    }
    .sidebar-logo-container:hover {
      background-color: var(--neutral-sunken);
    }

    .sidebar-logo-img-wrapper {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--brand-50);
      display: grid;
      place-items: center;
      flex-shrink: 0;
      border: 1px solid var(--brand-600);
      box-shadow: 0 0 10px rgba(26,147,179,0.25);
      position: relative;
      transition: all var(--dur-medium) cubic-bezier(0.25, 1, 0.5, 1);
    }

    .sidebar-logo-img {
      width: 34px;
      height: 34px;
      object-fit: contain;
      transition: transform var(--dur-medium) cubic-bezier(0.25, 1, 0.5, 1);
    }

    .sidebar-logo-container:hover .sidebar-logo-img {
      transform: scale(1.08) rotate(3deg);
    }

    .sidebar-logo-title {
      font: var(--fw-bold) 16px/1.2 var(--font-display);
      color: var(--text-primary);
      transition: color var(--dur-fast);
    }

    .sidebar-logo-subtitle {
      font: var(--text-3xs)/1.2 var(--font-mono);
      color: var(--text-tertiary);
      letter-spacing: .02em;
    }

    /* Menu Header styles */
    .sidebar-section-title {
      font: var(--fw-bold) 12px/1 var(--font-body);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: .08em;
      padding: 16px 12px 6px;
    }

    /* Larger Menu Buttons */
    .sidebar-btn-item {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      text-align: left;
      padding: 12px 16px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--dur-fast) ease;
      font: var(--fw-semibold) 16px/1.2 var(--font-body) !important;
    }

    .sidebar-btn-item svg {
      transition: transform var(--dur-fast) ease, color var(--dur-fast) ease;
    }

    .sidebar-btn-item:hover {
      transform: translateX(6px);
      background-color: var(--brand-50) !important;
      color: var(--brand-800) !important;
    }

    .sidebar-btn-item:hover svg {
      color: var(--brand-700) !important;
      transform: scale(1.15);
    }

    .sidebar-btn-item:active {
      transform: translateX(3px);
    }

    /* Receive Button (Green theme) */
    .sidebar-op-receive {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      text-align: left;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      border: 2px solid rgba(16, 185, 129, 0.35);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
      color: #10B981 !important;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
      font: var(--fw-bold) 16px/1.2 var(--font-body) !important;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.05);
    }

    .sidebar-op-receive svg {
      color: #10B981;
      transition: transform 0.25s ease, color 0.25s ease;
    }

    .sidebar-op-receive:hover {
      transform: translateY(-3px) scale(1.02);
      background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;
      border-color: #10B981;
      color: #ffffff !important;
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
    }

    .sidebar-op-receive:hover svg {
      color: #ffffff !important;
      transform: translateY(2px) scale(1.1); /* download direction nudge */
    }

    .sidebar-op-receive:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow: 0 3px 10px rgba(16, 185, 129, 0.2);
    }

    /* Withdraw Button (Orange/Amber theme) */
    .sidebar-op-withdraw {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      text-align: left;
      padding: 14px 18px;
      border-radius: var(--radius-md);
      border: 2px solid rgba(245, 158, 11, 0.35);
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%);
      color: #F59E0B !important;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
      font: var(--fw-bold) 16px/1.2 var(--font-body) !important;
      box-shadow: 0 2px 4px rgba(245, 158, 11, 0.05);
    }

    .sidebar-op-withdraw svg {
      color: #F59E0B;
      transition: transform 0.25s ease, color 0.25s ease;
    }

    .sidebar-op-withdraw:hover {
      transform: translateY(-3px) scale(1.02);
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
      border-color: #F59E0B;
      color: #ffffff !important;
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
    }

    .sidebar-op-withdraw:hover svg {
      color: #ffffff !important;
      transform: translateY(-2px) scale(1.1); /* upload/withdraw direction nudge */
    }

    .sidebar-op-withdraw:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow: 0 3px 10px rgba(245, 158, 11, 0.2);
    }

    .sidebar-logout-btn {
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 8px;
      border-radius: var(--radius-sm);
      color: var(--text-tertiary);
      display: grid;
      place-items: center;
      transition: all var(--dur-fast) ease;
    }

    .sidebar-logout-btn:hover {
      color: var(--red-600) !important;
      background-color: var(--red-50);
      transform: scale(1.1);
    }
  `;

  return (
    <>
      <style>{localStyle}</style>

      <aside className={`main-sidebar ${sidebarOpen ? 'open' : ''}`} style={css(`width:var(--sidebar-width,264px); flex-shrink:0; background:var(--white); border-right:1px solid var(--border-subtle); display:flex; flex-direction:column; position:sticky; top:0; height:100vh;`)}>
        <div onClick={go.dashboard} className="sidebar-logo-container">
          <div className="sidebar-logo-img-wrapper">
            <img 
              src="/assets/b082f9ab-2a3d-47e8-a44f-c9a7574496ec.png" 
              alt="ตรา รพธ." 
              className="sidebar-logo-img"
            />
          </div>
          <div style={css(`line-height:1.25;`)}>
            <div className="sidebar-logo-title">คลังน้ำยาห้องปฏิบัติการ</div>
            <div className="sidebar-logo-subtitle">TUH · Reagent Inventory</div>
          </div>
        </div>

        <div style={css(`padding:14px 12px; display:flex; flex-direction:column; gap:6px; flex:1; overflow-y:auto;`)}>
          <div className="sidebar-section-title">เมนูหลัก</div>
          
          <button onClick={go.dashboard} className="sidebar-btn-item" style={css(`background:${nav.dashBg}; color:${nav.dashFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.dashIc};`)}>{ic.dashboard}</span>
            <span style={css(`flex:1;`)}>Dashboard</span>
          </button>
          
          <button onClick={go.alerts} className="sidebar-btn-item" style={css(`background:${nav.alBg}; color:${nav.alFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.alIc};`)}>{ic.bell}</span>
            <span style={css(`flex:1;`)}>การแจ้งเตือน</span>
            <span style={css(`min-width:22px; height:20px; display:inline-flex; align-items:center; justify-content:center; padding:0 6px; border-radius:var(--radius-pill); background:var(--red-600); color:#fff; font:var(--fw-bold) 12px/1 var(--font-mono);`)}>{nav.alertCount}</span>
          </button>
          
          <button onClick={go.inventory} className="sidebar-btn-item" style={css(`background:${nav.invBg}; color:${nav.invFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.invIc};`)}>{ic.boxes}</span>
            <span style={css(`flex:1;`)}>คลังน้ำยา</span>
            <span style={css(`font:var(--fw-semibold) 12px/1 var(--font-mono); color:${nav.invIc};`)}>{kpi.total}</span>
          </button>
          
          <button onClick={go.reagentLists} className="sidebar-btn-item" style={css(`background:${nav.rlistBg}; color:${nav.rlistFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.rlistIc};`)}>{ic.list}</span>
            <span style={css(`flex:1;`)}>Reagent Lists</span>
          </button>
          
          <button onClick={go.audit} className="sidebar-btn-item" style={css(`background:${nav.auBg}; color:${nav.auFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.auIc};`)}>{ic.history}</span>
            <span style={css(`flex:1;`)}>ประวัติการเคลื่อนไหว</span>
          </button>
          
          <button onClick={go.perms} className="sidebar-btn-item" style={css(`background:${nav.pmBg}; color:${nav.pmFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.pmIc};`)}>{ic.shield}</span>
            <span style={css(`flex:1;`)}>สิทธิ์การใช้งาน</span>
          </button>
          
          {canManage && (
            <button onClick={go.stockCount} className="sidebar-btn-item" style={css(`background:${nav.scBg}; color:${nav.scFg};`)}>
              <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.scIc};`)}>📋</span>
              <span style={css(`flex:1;`)}>ตรวจนับคลัง</span>
            </button>
          )}
          
          <button onClick={go.help} className="sidebar-btn-item" style={css(`background:${nav.helpBg}; color:${nav.helpFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.helpIc};`)}>{ic.help || ic.list}</span>
            <span style={css(`flex:1;`)}>คู่มือการใช้งาน</span>
          </button>

          <button onClick={go.createSticker} className="sidebar-btn-item" style={css(`background:${nav.csBg}; color:${nav.csFg};`)}>
            <span style={css(`width:22px; height:22px; display:grid; place-items:center; color:${nav.csIc};`)}>🏷️</span>
            <span style={css(`flex:1;`)}>สร้างสติกเกอร์</span>
          </button>

          <div className="sidebar-section-title" style={css(`margin-top:10px;`)}>การทำงาน</div>
          
          <button onClick={openReceive} className="sidebar-op-receive">
            <span style={css(`width:22px; height:22px; display:grid; place-items:center;`)}>{ic.receive}</span>
            <span style={css(`flex:1;`)}>รับเข้า (Receive)</span>
          </button>
          
          <button onClick={openIssue} className="sidebar-op-withdraw">
            <span style={css(`width:22px; height:22px; display:grid; place-items:center;`)}>{ic.issue}</span>
            <span style={css(`flex:1;`)}>เบิกจ่าย (Withdraw)</span>
          </button>
        </div>

        <div 
          onClick={v.openSignature}
          title="ตั้งค่าลายเซ็นอิเล็กทรอนิกส์"
          className="sidebar-footer" 
          style={css(`padding:14px 12px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px; cursor:pointer; transition:background var(--dur-fast);`)}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--slate-100)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <span style={css(`width:38px; height:38px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font:var(--fw-semibold) 15px/1 var(--font-body); flex-shrink:0;`)}>{user.initials}</span>
          <div style={css(`flex:1; line-height:1.3; min-width:0;`)}>
            <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.2 var(--font-body); color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>{user.name}</div>
            <div style={css(`font:var(--text-xs)/1.2 var(--font-body); color:var(--text-tertiary);`)}>{user.role}</div>
          </div>
          <button onClick={onLogout} title="ออกจากระบบ" className="sidebar-logout-btn">{ic.logout}</button>
        </div>
      </aside>
    </>
  );
}
