import React from 'react';
import { css } from '../css.js';

export function Alerts({ v }) {
  const {
    isAlerts, alertRows, hasAlerts,
  } = v;
  return isAlerts ? (<>
        <div className="qms-rise" style={css(`max-width:920px; display:flex; flex-direction:column; gap:12px;`)}>
          {alertRows.map((a, aI) => (<React.Fragment key={aI}>
            <div style={css(`display:flex; align-items:center; gap:14px; padding:14px 18px; background:var(--surface-card); border:1px solid var(--border-subtle); border-left:3px solid ${a.fg}; border-radius:var(--radius-md); box-shadow:var(--shadow-sm);`)}>
              <span style={css(`width:40px; height:40px; border-radius:var(--radius-md); background:${a.bg}; color:${a.fg}; display:grid; place-items:center; flex-shrink:0;`)}>{a.icon}</span>
              <div style={css(`flex:1; min-width:0;`)}>
                <div style={css(`display:flex; align-items:center; gap:8px; margin-bottom:2px;`)}>
                  <span style={css(`padding:1px 8px; border-radius:var(--radius-pill); background:${a.bg}; color:${a.fg}; font:var(--fw-semibold) var(--text-2xs)/1.5 var(--font-body);`)}>{a.kindLabel}</span>
                  <span style={css(`font:var(--fw-semibold) var(--text-2xs)/1.5 var(--font-mono); color:${a.fg}; letter-spacing:.03em;`)}>{a.sevLabel}</span>
                </div>
                <div style={css(`font:var(--fw-semibold) var(--text-sm)/1.35 var(--font-body); color:var(--text-primary);`)}>{a.title}</div>
                <div style={css(`font:var(--text-2xs)/1.4 var(--font-body); color:var(--text-secondary);`)}>{a.sub}</div>
              </div>
              <button onClick={a.onOpen} style={css(`padding:7px 12px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-medium) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>ดูรายละเอียด</button>
              <button onClick={a.onAck} style={css(`padding:7px 12px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); white-space:nowrap;`)}>รับทราบ</button>
            </div>
          </React.Fragment>))}
          {hasAlerts ? (<></>) : null}
        </div>
      </>) : null;
}
