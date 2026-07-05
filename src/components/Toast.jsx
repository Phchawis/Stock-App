import React from 'react';
import { css } from '../css.js';

export function Toast({ v }) {
  const {
    ic, toast, toastBg,
  } = v;
  return toast ? (<>
    <div className="tt-in" style={css(`position:fixed; bottom:calc(24px + env(safe-area-inset-bottom, 0px)); left:50%; transform:translateX(-50%); z-index:60; display:flex; align-items:center; gap:10px; padding:12px 18px; border-radius:var(--radius-md); background:${toastBg}; color:#fff; box-shadow:var(--shadow-lg); font:var(--fw-medium) var(--text-sm)/1.35 var(--font-body); max-width:min(92vw, 440px); box-sizing:border-box; word-break:break-word;`)}>
      <span style={css(`width:22px; height:22px; border-radius:50%; background:rgba(255,255,255,.18); display:grid; place-items:center; flex-shrink:0;`)}>{ic.check}</span>
      <span style={css(`min-width:0;`)}>{toast.msg}</span>
    </div>
  </>) : null;
}
