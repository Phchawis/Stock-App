import React from 'react';
import { css } from '../css.js';
import { Dashboard } from '../screens/Dashboard.jsx';
import { Inventory } from '../screens/Inventory.jsx';
import { Alerts } from '../screens/Alerts.jsx';
import { Audit } from '../screens/Audit.jsx';
import { Perms } from '../screens/Perms.jsx';
import { ReagentLists } from '../screens/ReagentLists.jsx';
import { Help } from '../screens/Help.jsx';

export function Main({ v }) {
  const {
    ic, title, subtitle, openReceive, openIssue, toggleSidebar,
  } = v;
  return (
<div style={css(`flex:1; min-width:0; display:flex; flex-direction:column;`)}>
    <header className="main-header" style={css(`height:var(--topbar-height,60px); flex-shrink:0; background:var(--white); border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:16px; padding:0 var(--page-gutter,28px); position:sticky; top:0; z-index:5;`)}>
      <button 
        onClick={toggleSidebar} 
        className="hamburger-btn"
        style={css(`display:grid; place-items:center; background:none; border:none; color:var(--text-primary); cursor:pointer; padding:6px; margin-left:-6px; border-radius:var(--radius-sm);`)}
      >
        {ic.menu}
      </button>
      <div style={css(`min-width:0;`)}>
        <div className="title-text" style={css(`font:var(--fw-bold) var(--text-lg)/1.1 var(--font-display); color:var(--text-primary);`)}>{title}</div>
        <div className="subtitle-text" style={css(`font:var(--text-2xs)/1.2 var(--font-body); color:var(--text-tertiary);`)}>{subtitle}</div>
      </div>
      <div style={css(`flex:1;`)}></div>
      <button onClick={openReceive} style={css(`display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
        <span style={css(`width:16px; height:16px; display:grid; place-items:center;`)}>{ic.receive}</span>รับเข้า
      </button>
      <button onClick={openIssue} style={css(`display:inline-flex; align-items:center; gap:7px; padding:8px 14px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); box-shadow:var(--glow-brand-soft);`)}>
        <span style={css(`width:16px; height:16px; display:grid; place-items:center;`)}>{ic.issue}</span>เบิกจ่าย (Withdraw)
      </button>
    </header>

    <main className="main-content" style={css(`flex:1; padding:var(--page-gutter,28px); overflow-y:auto;`)}>
      <Dashboard v={v} />
      <Inventory v={v} />
      <ReagentLists v={v} />
      <Alerts v={v} />
      <Audit v={v} />
      <Perms v={v} />
      <Help v={v} />
    </main>
  </div>
  );
}
