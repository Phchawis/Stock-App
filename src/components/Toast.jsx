import React from 'react';
import { css } from '../css.js';

export function Toast({ v }) {
  const {
    ic, toast, toastBg,
  } = v;
  return toast ? (<>
    <div className="tt-in" style={css(`position:fixed; bottom:24px; left:50%; transform:translateX(-50%); z-index:60; display:flex; align-items:center; gap:10px; padding:12px 18px; border-radius:var(--radius-md); background:${toastBg}; color:#fff; box-shadow:var(--shadow-lg); font:var(--fw-medium) var(--text-sm)/1.3 var(--font-body);`)}>
      <span style={css(`width:22px; height:22px; border-radius:50%; background:rgba(255,255,255,.18); display:grid; place-items:center;`)}>{ic.check}</span>
      {toast.msg}
    </div>
  </>) : null;
}
