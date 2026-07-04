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

  const localStyle = `
    .header-btn-receive {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      border: 1.5px solid var(--brand-300);
      background: var(--white);
      color: var(--brand-700) !important;
      cursor: pointer;
      font: var(--fw-semibold) 14px/1 var(--font-body);
      transition: all var(--dur-fast) ease-in-out;
    }
    .header-btn-receive:hover {
      border-color: var(--brand-600);
      background: var(--brand-50);
      color: var(--brand-800) !important;
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(52, 62, 155, 0.12);
    }
    .header-btn-receive:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(52, 62, 155, 0.08);
    }

    .header-btn-withdraw {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      border: none;
      background: linear-gradient(135deg, var(--brand-700) 0%, var(--brand-800) 100%);
      color: #ffffff !important;
      cursor: pointer;
      font: var(--fw-semibold) 14px/1 var(--font-body);
      transition: all var(--dur-fast) ease-in-out;
      box-shadow: 0 2px 8px rgba(52, 62, 155, 0.2);
    }
    .header-btn-withdraw:hover {
      background: linear-gradient(135deg, var(--brand-600) 0%, var(--brand-700) 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 14px rgba(52, 62, 155, 0.3);
    }
    .header-btn-withdraw:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(52, 62, 155, 0.15);
    }

    @media (max-width: 768px) {
      .mobile-action-bar {
        display: flex !important;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-top: 1px solid var(--border-subtle);
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 8px));
        gap: 12px;
        z-index: 40;
        box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.08);
      }
      .mobile-action-btn {
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px;
        border-radius: var(--radius-md);
        font: var(--fw-bold) 15px/1 var(--font-body) !important;
        cursor: pointer;
        transition: all var(--dur-fast);
      }
      .mobile-action-btn.receive {
        border: 1.5px solid var(--brand-300);
        background: var(--white);
        color: var(--brand-600) !important;
      }
      .mobile-action-btn.withdraw {
        border: none;
        background: linear-gradient(135deg, var(--brand-700) 0%, var(--brand-800) 100%);
        color: #ffffff !important;
        box-shadow: 0 2px 8px rgba(52, 62, 155, 0.2);
      }
      .header-btn-receive, .header-btn-withdraw {
        display: none !important;
      }
      main.main-content {
        padding-bottom: 90px !important;
      }
    }
  `;

  return (
    <div style={css(`flex:1; min-width:0; display:flex; flex-direction:column;`)}>
      <style>{localStyle}</style>
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
        
        <button onClick={openReceive} className="header-btn-receive">
          <span style={css(`width:16px; height:16px; display:grid; place-items:center;`)}>{ic.receive}</span>
          รับเข้า
        </button>
        
        <button onClick={openIssue} className="header-btn-withdraw">
          <span style={css(`width:16px; height:16px; display:grid; place-items:center;`)}>{ic.issue}</span>
          เบิกจ่าย (Withdraw)
        </button>
      </header>

      {/* Mobile Bottom Action Bar */}
      <div className="mobile-action-bar" style={css(`display:none;`)}>
        <button onClick={openReceive} className="mobile-action-btn receive">
          <span style={css(`width:18px; height:18px; display:grid; place-items:center;`)}>{ic.receive}</span>
          รับเข้า
        </button>
        <button onClick={openIssue} className="mobile-action-btn withdraw">
          <span style={css(`width:18px; height:18px; display:grid; place-items:center;`)}>{ic.issue}</span>
          เบิกจ่าย
        </button>
      </div>

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
