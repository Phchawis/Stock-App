import React from 'react';
import { css } from '../css.js';
import { contentThemes, themeChoices } from '../theme.js';
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
    contentThemeId, setContentTheme,
  } = v;

  const activeTheme = contentThemes[contentThemeId] || contentThemes.ocean;

  const localStyle = `
    /* Matches the sidebar's "การทำงาน" receive/withdraw buttons — same green/amber
       theme and hover language (lift + gradient fill + icon nudge) so the action
       reads the same whether it's triggered from the sidebar or the header. */
    .header-btn-receive {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      border: 1.5px solid rgba(16, 185, 129, 0.35);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
      color: #10B981 !important;
      cursor: pointer;
      font: var(--fw-bold) 14px/1 var(--font-body);
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.05);
    }
    .header-btn-receive svg {
      transition: transform 0.25s ease, color 0.25s ease;
    }
    .header-btn-receive:hover {
      transform: translateY(-2px) scale(1.02);
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      border-color: #10B981;
      color: #ffffff !important;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
    }
    .header-btn-receive:hover svg {
      color: #ffffff !important;
      transform: translateY(2px) scale(1.1);
    }
    .header-btn-receive:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow: 0 3px 10px rgba(16, 185, 129, 0.2);
    }

    .header-btn-withdraw {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: var(--radius-md);
      border: 1.5px solid rgba(245, 158, 11, 0.35);
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(245, 158, 11, 0.02) 100%);
      color: #F59E0B !important;
      cursor: pointer;
      font: var(--fw-bold) 14px/1 var(--font-body);
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
      box-shadow: 0 2px 4px rgba(245, 158, 11, 0.05);
    }
    .header-btn-withdraw svg {
      transition: transform 0.25s ease, color 0.25s ease;
    }
    .header-btn-withdraw:hover {
      transform: translateY(-2px) scale(1.02);
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      border-color: #F59E0B;
      color: #ffffff !important;
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35);
    }
    .header-btn-withdraw:hover svg {
      color: #ffffff !important;
      transform: translateY(-2px) scale(1.1);
    }
    .header-btn-withdraw:active {
      transform: translateY(-1px) scale(0.99);
      box-shadow: 0 3px 10px rgba(245, 158, 11, 0.2);
    }

    @media (max-width: 768px) {
      .mobile-action-bar {
        display: flex !important;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(8, 17, 25, 0.85);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border-top: 1px solid var(--border-default);
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 8px));
        gap: 12px;
        z-index: 40;
        box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.35);
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
        border: 1.5px solid rgba(16, 185, 129, 0.35);
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.02) 100%);
        color: #10B981 !important;
      }
      .mobile-action-btn.receive:active {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: #ffffff !important;
      }
      .mobile-action-btn.withdraw {
        border: none;
        background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        color: #ffffff !important;
        box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2);
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
    <div style={css(`flex:1; min-width:0; display:flex; flex-direction:column; background:var(--surface-page); ${activeTheme.vars}`)}>
      <style>{localStyle}</style>
      <header className="main-header" style={css(`height:var(--topbar-height,60px); flex-shrink:0; background:var(--content-glass-top); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid var(--border-default); display:flex; align-items:center; gap:16px; padding:0 var(--page-gutter,28px); position:sticky; top:0; z-index:5;`)}>
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

      <main className="main-content" style={css(`flex:1; padding:var(--page-gutter,28px); overflow-y:auto; background:radial-gradient(1100px 520px at 85% -10%, rgba(158,215,230,.10), transparent 60%), radial-gradient(900px 480px at -10% 30%, rgba(175,218,224,.06), transparent 55%), radial-gradient(760px 420px at 55% 115%, rgba(141,187,204,.08), transparent 60%), var(--surface-page);`)}>
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
