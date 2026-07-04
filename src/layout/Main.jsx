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

  const themeStyles = {
    option1: `
      --surface-page: #060b13;
      --surface-card: rgba(15, 24, 42, 0.75);
      --surface-sunken: rgba(7, 13, 25, 0.6);
      --white: rgba(15, 24, 42, 0.85);
      --surface-inverse: #f0f7f8;
      --text-primary: #f0f7f8;
      --text-secondary: #afdae0;
      --text-tertiary: #8DBBCC;
      --text-link: #9ED7E6;
      --text-disabled: #4f6170;
      --border-subtle: rgba(175, 218, 224, 0.16);
      --border-default: rgba(175, 218, 224, 0.28);
      --border-strong: rgba(141, 187, 204, 0.45);
      --border-brand: #9ED7E6;
      --brand-900: #8DBBCC;
      --brand-800: #9ED7E6;
      --brand-700: #8DBBCC;
      --brand-600: #9ED7E6;
      --brand-500: #afdae0;
      --brand-400: #8DBBCC;
      --brand-300: #9ED7E6;
      --brand-100: rgba(158, 215, 230, 0.18);
      --brand-50: rgba(158, 215, 230, 0.1);
      --glow-brand: 0 0 20px rgba(158, 215, 230, 0.25);
      --glow-brand-soft: 0 4px 12px rgba(158, 215, 230, 0.15);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    `,
    option2: `
      --surface-page: #f0f7f8;
      --surface-card: #ffffff;
      --surface-sunken: #e2eff1;
      --white: #ffffff;
      --surface-inverse: #101c24;
      --text-primary: #101c24;
      --text-secondary: #354e5b;
      --text-tertiary: #5d7c8d;
      --text-link: #8DBBCC;
      --text-disabled: #94a8b5;
      --border-subtle: #e2eff1;
      --border-default: #cfdfE2;
      --border-strong: #8DBBCC;
      --border-brand: #8DBBCC;
      --brand-900: #354e5b;
      --brand-800: #5d7c8d;
      --brand-700: #8DBBCC;
      --brand-600: #8DBBCC;
      --brand-500: #9ED7E6;
      --brand-400: #afdae0;
      --brand-300: #cfdfE2;
      --brand-100: rgba(141, 187, 204, 0.18);
      --brand-50: rgba(141, 187, 204, 0.1);
      --glow-brand: 0 8px 24px rgba(141, 187, 204, 0.15);
      --glow-brand-soft: 0 4px 12px rgba(141, 187, 204, 0.1);
    `,
    option3: `
      --surface-page: #19222c;
      --surface-card: #222d3a;
      --surface-sunken: #141b23;
      --white: #222d3a;
      --surface-inverse: #e8ecef;
      --text-primary: #e8ecef;
      --text-secondary: #a3b8cc;
      --text-tertiary: #7d96ae;
      --text-link: #9ED7E6;
      --text-disabled: #4f6173;
      --border-subtle: #2d3b4b;
      --border-default: #394d61;
      --border-strong: #8DBBCC;
      --border-brand: #9ED7E6;
      --brand-900: #8DBBCC;
      --brand-800: #9ED7E6;
      --brand-700: #8DBBCC;
      --brand-600: #9ED7E6;
      --brand-500: #afdae0;
      --brand-400: #8DBBCC;
      --brand-300: #9ED7E6;
      --brand-100: rgba(158, 215, 230, 0.18);
      --brand-50: rgba(158, 215, 230, 0.1);
      --glow-brand: 0 8px 24px rgba(158, 215, 230, 0.2);
      --glow-brand-soft: 0 4px 12px rgba(158, 215, 230, 0.1);
    `
  };

  const selectedThemeStyle = themeStyles[v.themeOption || 'option1'];

  const switcherStyles = {
    option1: {
      bg: '#0f182a',
      border: '1.5px solid #9ED7E6',
      titleColor: '#ffffff',
      btnActiveBg: '#9ED7E6',
      btnActiveText: '#060b13',
      btnInactiveBg: 'rgba(255, 255, 255, 0.05)',
      btnInactiveBorder: '1px solid rgba(255, 255, 255, 0.15)',
      btnInactiveText: '#afdae0'
    },
    option2: {
      bg: '#ffffff',
      border: '2px solid #8DBBCC',
      titleColor: '#101c24',
      btnActiveBg: '#8DBBCC',
      btnActiveText: '#ffffff',
      btnInactiveBg: '#f0f7f8',
      btnInactiveBorder: '1px solid #cfdfE2',
      btnInactiveText: '#354e5b'
    },
    option3: {
      bg: '#222d3a',
      border: '1.5px solid #8DBBCC',
      titleColor: '#e8ecef',
      btnActiveBg: '#8DBBCC',
      btnActiveText: '#19222c',
      btnInactiveBg: 'rgba(255, 255, 255, 0.04)',
      btnInactiveBorder: '1px solid rgba(255, 255, 255, 0.1)',
      btnInactiveText: '#a3b8cc'
    }
  };

  const currentSwitcher = switcherStyles[v.themeOption || 'option1'];

  return (
    <div style={css(`flex:1; min-width:0; display:flex; flex-direction:column; background:var(--surface-page); transition:all 0.35s cubic-bezier(0.4, 0, 0.2, 1); ${selectedThemeStyle}`)}>
      <style>{localStyle}</style>
      <header className="main-header" style={css(`height:var(--topbar-height,60px); flex-shrink:0; background:var(--white); border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:16px; padding:0 var(--page-gutter,28px); position:sticky; top:0; z-index:5; transition:background 0.35s ease, border-color 0.35s ease;`)}>
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

        {/* Live Theme Switcher Option Selector */}
        <div className="no-print" style={css(`display:flex; align-items:center; gap:6px; background:${currentSwitcher.btnInactiveBg}; padding:4px; border-radius:var(--radius-pill); border:1px solid ${v.themeOption === 'option2' ? '#cfdfE2' : 'rgba(255,255,255,0.15)'}; transition:all 0.3s ease;`)}>
          <button
            onClick={() => v.changeThemeOption('option1')}
            title="แบบที่ 1: Ice-Cool Glassmorphic Dark"
            style={css(`border:none; cursor:pointer; padding:5px 12px; border-radius:var(--radius-pill); font:var(--fw-bold) var(--text-3xs)/1 var(--font-body); transition:all 0.2s ease; ${v.themeOption === 'option1' ? `background:${currentSwitcher.btnActiveBg}; color:${currentSwitcher.btnActiveText}; box-shadow:var(--shadow-sm);` : `background:transparent; color:${currentSwitcher.btnInactiveText};`}`)}
          >
            แบบที่ 1 (Glass Dark)
          </button>
          <button
            onClick={() => v.changeThemeOption('option2')}
            title="แบบที่ 2: Soft Arctic Light"
            style={css(`border:none; cursor:pointer; padding:5px 12px; border-radius:var(--radius-pill); font:var(--fw-bold) var(--text-3xs)/1 var(--font-body); transition:all 0.2s ease; ${v.themeOption === 'option2' ? `background:${currentSwitcher.btnActiveBg}; color:${currentSwitcher.btnActiveText}; box-shadow:var(--shadow-sm);` : `background:transparent; color:${currentSwitcher.btnInactiveText};`}`)}
          >
            แบบที่ 2 (Arctic Light)
          </button>
          <button
            onClick={() => v.changeThemeOption('option3')}
            title="แบบที่ 3: Nord Slate Matte"
            style={css(`border:none; cursor:pointer; padding:5px 12px; border-radius:var(--radius-pill); font:var(--fw-bold) var(--text-3xs)/1 var(--font-body); transition:all 0.2s ease; ${v.themeOption === 'option3' ? `background:${currentSwitcher.btnActiveBg}; color:${currentSwitcher.btnActiveText}; box-shadow:var(--shadow-sm);` : `background:transparent; color:${currentSwitcher.btnInactiveText};`}`)}
          >
            แบบที่ 3 (Nord Slate)
          </button>
        </div>
        
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

      {/* Floating Theme Switcher Widget */}
      <div className="no-print" style={css(`position:fixed; bottom:24px; right:24px; z-index:100; display:flex; flex-direction:column; gap:8px; background:${currentSwitcher.bg}; padding:10px 12px; border-radius:var(--radius-lg); border:${currentSwitcher.border}; box-shadow:var(--shadow-lg); transition:all 0.3s ease;`)}>
        <div style={css(`font:var(--fw-bold) var(--text-3xs)/1 var(--font-body); color:${currentSwitcher.titleColor}; margin-bottom:4px; display:flex; align-items:center; gap:4px;`)}>
          🎨 ปรับธีมอินเตอร์เฟสหลัก:
        </div>
        <div style={css(`display:flex; flex-direction:column; gap:6px;`)}>
          <button
            onClick={() => v.changeThemeOption('option1')}
            style={css(`cursor:pointer; padding:7px 12px; border-radius:var(--radius-md); text-align:left; font:var(--fw-bold) var(--text-2xs)/1 var(--font-body); transition:all 0.2s ease; ${v.themeOption === 'option1' ? `background:${currentSwitcher.btnActiveBg}; color:${currentSwitcher.btnActiveText}; border:none; box-shadow:var(--shadow-sm);` : `background:${currentSwitcher.btnInactiveBg}; border:${currentSwitcher.btnInactiveBorder}; color:${currentSwitcher.btnInactiveText};`}`)}
          >
            {v.themeOption === 'option1' ? '✓ ' : ''}แบบที่ 1 (Glass Dark)
          </button>
          <button
            onClick={() => v.changeThemeOption('option2')}
            style={css(`cursor:pointer; padding:7px 12px; border-radius:var(--radius-md); text-align:left; font:var(--fw-bold) var(--text-2xs)/1 var(--font-body); transition:all 0.2s ease; ${v.themeOption === 'option2' ? `background:${currentSwitcher.btnActiveBg}; color:${currentSwitcher.btnActiveText}; border:none; box-shadow:var(--shadow-sm);` : `background:${currentSwitcher.btnInactiveBg}; border:${currentSwitcher.btnInactiveBorder}; color:${currentSwitcher.btnInactiveText};`}`)}
          >
            {v.themeOption === 'option2' ? '✓ ' : ''}แบบที่ 2 (Arctic Light)
          </button>
          <button
            onClick={() => v.changeThemeOption('option3')}
            style={css(`cursor:pointer; padding:7px 12px; border-radius:var(--radius-md); text-align:left; font:var(--fw-bold) var(--text-2xs)/1 var(--font-body); transition:all 0.2s ease; ${v.themeOption === 'option3' ? `background:${currentSwitcher.btnActiveBg}; color:${currentSwitcher.btnActiveText}; border:none; box-shadow:var(--shadow-sm);` : `background:${currentSwitcher.btnInactiveBg}; border:${currentSwitcher.btnInactiveBorder}; color:${currentSwitcher.btnInactiveText};`}`)}
          >
            {v.themeOption === 'option3' ? '✓ ' : ''}แบบที่ 3 (Nord Slate)
          </button>
        </div>
      </div>
    </div>
  );
}
