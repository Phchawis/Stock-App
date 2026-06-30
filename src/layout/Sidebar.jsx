import React from 'react';
import { css } from '../css.js';

export function Sidebar({ v }) {
  const {
    ic, user, onLogout, nav, go, title,
    openReceive, openIssue, kpi, sidebarOpen,
  } = v;

  const localStyle = `
    .sidebar-logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 18px 14px;
      border-bottom: 1px solid var(--border-subtle);
      text-decoration: none;
      cursor: pointer;
    }

    .sidebar-logo-img-wrapper {
      width: 42px;
      height: 42px;
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

    .sidebar-logo-img-wrapper::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      box-shadow: 0 0 0 1px var(--brand-600);
      opacity: 0.5;
      transition: opacity var(--dur-fast);
    }

    .sidebar-logo-container:hover .sidebar-logo-img-wrapper {
      transform: scale(1.05);
      border-color: var(--brand-500);
      box-shadow: 0 0 16px rgba(26,147,179,0.5);
      background: rgba(26,147,179,0.15);
    }

    .sidebar-logo-container:hover .sidebar-logo-img-wrapper::after {
      opacity: 1;
    }

    .sidebar-logo-img {
      width: 32px;
      height: 32px;
      object-fit: contain;
      transition: transform var(--dur-medium) cubic-bezier(0.25, 1, 0.5, 1);
    }

    .sidebar-logo-container:hover .sidebar-logo-img {
      transform: scale(1.08) rotate(3deg);
    }

    .sidebar-logo-title {
      font: var(--fw-bold) var(--text-sm)/1.2 var(--font-display);
      color: var(--text-primary);
      transition: color var(--dur-fast);
    }

    .sidebar-logo-container:hover .sidebar-logo-title {
      color: var(--brand-800);
    }

    .sidebar-logo-subtitle {
      font: var(--text-3xs)/1.2 var(--font-mono);
      color: var(--text-tertiary);
      letter-spacing: .02em;
      transition: color var(--dur-fast);
    }

    .sidebar-logo-container:hover .sidebar-logo-subtitle {
      color: var(--text-secondary);
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

        <div style={css(`padding:12px; display:flex; flex-direction:column; gap:3px; flex:1; overflow-y:auto;`)}>
          <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.06em; padding:8px 12px 6px;`)}>เมนูหลัก</div>
          <button onClick={go.dashboard} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; transition:background var(--dur-fast); background:${nav.dashBg}; color:${nav.dashFg}; font:var(--fw-medium) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:${nav.dashIc};`)}>{ic.dashboard}</span>
            <span style={css(`flex:1;`)}>Dashboard</span>
          </button>
          <button onClick={go.alerts} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; transition:background var(--dur-fast); background:${nav.alBg}; color:${nav.alFg}; font:var(--fw-medium) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:${nav.alIc};`)}>{ic.bell}</span>
            <span style={css(`flex:1;`)}>การแจ้งเตือน</span>
            <span style={css(`min-width:20px; text-align:center; padding:1px 6px; border-radius:var(--radius-pill); background:var(--red-600); color:#fff; font:var(--fw-bold) var(--text-2xs)/1.5 var(--font-mono);`)}>{nav.alertCount}</span>
          </button>
          <button onClick={go.inventory} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; transition:background var(--dur-fast); background:${nav.invBg}; color:${nav.invFg}; font:var(--fw-medium) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:${nav.invIc};`)}>{ic.boxes}</span>
            <span style={css(`flex:1;`)}>คลังน้ำยา</span>
            <span style={css(`font:var(--fw-semibold) var(--text-2xs)/1 var(--font-mono); color:${nav.invIc};`)}>{kpi.total}</span>
          </button>
          <button onClick={go.reagentLists} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; transition:background var(--dur-fast); background:${nav.rlistBg}; color:${nav.rlistFg}; font:var(--fw-medium) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:${nav.rlistIc};`)}>{ic.list}</span>
            <span style={css(`flex:1;`)}>Reagent Lists</span>
          </button>
          <button onClick={go.audit} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; transition:background var(--dur-fast); background:${nav.auBg}; color:${nav.auFg}; font:var(--fw-medium) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:${nav.auIc};`)}>{ic.history}</span>
            <span style={css(`flex:1;`)}>ประวัติการเคลื่อนไหว</span>
          </button>
          <button onClick={go.perms} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; transition:background var(--dur-fast); background:${nav.pmBg}; color:${nav.pmFg}; font:var(--fw-medium) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:${nav.pmIc};`)}>{ic.shield}</span>
            <span style={css(`flex:1;`)}>สิทธิ์การใช้งาน</span>
          </button>
          <button onClick={go.help} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:none; cursor:pointer; transition:background var(--dur-fast); background:${nav.helpBg}; color:${nav.helpFg}; font:var(--fw-medium) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:${nav.helpIc};`)}>{ic.help || ic.list}</span>
            <span style={css(`flex:1;`)}>คู่มือการใช้งาน</span>
          </button>

          <div style={css(`font:var(--fw-semibold) var(--text-2xs)/1 var(--font-body); color:var(--text-tertiary); text-transform:uppercase; letter-spacing:.06em; padding:16px 12px 6px;`)}>การทำงาน</div>
          <button onClick={openReceive} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:1px solid var(--brand-100); cursor:pointer; background:var(--brand-50); color:var(--brand-700); font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:var(--brand-600);`)}>{ic.receive}</span>
            <span style={css(`flex:1;`)}>รับเข้า (Receive)</span>
          </button>
          <button onClick={openIssue} style={css(`display:flex; align-items:center; gap:11px; width:100%; text-align:left; padding:9px 12px; border-radius:var(--radius-sm); border:1px solid var(--accent-100); cursor:pointer; background:var(--accent-50); color:var(--accent-700); font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
            <span style={css(`width:18px; height:18px; display:grid; place-items:center; color:var(--accent-600);`)}>{ic.issue}</span>
            <span style={css(`flex:1;`)}>เบิกจ่าย (Withdraw)</span>
          </button>
        </div>

        <div style={css(`padding:12px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px;`)}>
          <span style={css(`width:34px; height:34px; border-radius:50%; background:var(--brand-700); color:#fff; display:grid; place-items:center; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); flex-shrink:0;`)}>{user.initials}</span>
          <div style={css(`flex:1; line-height:1.3; min-width:0;`)}>
            <div style={css(`font:var(--fw-semibold) var(--text-xs)/1.2 var(--font-body); color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`)}>{user.name}</div>
            <div style={css(`font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary);`)}>{user.role}</div>
          </div>
          <button onClick={onLogout} title="ออกจากระบบ" style={css(`border:none; background:transparent; cursor:pointer; padding:6px; border-radius:var(--radius-sm); color:var(--text-tertiary); display:grid; place-items:center;`)}>{ic.logout}</button>
        </div>
      </aside>
    </>
  );
}
