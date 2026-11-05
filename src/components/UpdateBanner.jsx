import React from 'react';
import { css } from '../css.js';

/* global __BUILD_ID__ */
const BUILD_ID = typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : null;
const CHECK_EVERY_MS = 5 * 60 * 1000;

// A tab opened before a deploy keeps the code it loaded until someone
// reloads it. Twice that meant the lab ran an old version after a fix had
// shipped: stickers still came out as Word files, and the receive button
// could still be double-clicked. This asks the server which build is live,
// every few minutes and whenever the tab comes back into view, and offers a
// reload when it is newer. It never reloads by itself, because a form may be
// half filled in.
export function UpdateBanner() {
  const [newer, setNewer] = React.useState(false);

  React.useEffect(() => {
    if (!BUILD_ID) return undefined;               // dev server: no version.json
    let stopped = false;
    const check = async () => {
      if (stopped || document.visibilityState !== 'visible') return;
      try {
        const res = await fetch('/version.json', { cache: 'no-store' });
        if (!res.ok) return;
        const { build } = await res.json();
        if (build && build !== BUILD_ID) setNewer(true);
      } catch (e) { /* offline: try again next time */ }
    };
    const timer = setInterval(check, CHECK_EVERY_MS);
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    check();
    return () => {
      stopped = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
    };
  }, []);

  if (!newer) return null;
  return (
    <div
      role="status"
      className="tt-in no-print"
      style={css(`position:fixed; top:calc(var(--topbar-height, 60px) + 10px); left:50%; transform:translateX(-50%); z-index:40; display:flex; align-items:center; gap:12px; flex-wrap:wrap; justify-content:center; padding:10px 14px 10px 16px; max-width:min(92vw, 520px); box-sizing:border-box; background:var(--surface-card); border:1px solid var(--border-brand); border-radius:var(--radius-md); box-shadow:var(--shadow-lg); font:var(--text-sm)/1.4 var(--font-body); color:var(--text-primary);`)}
    >
      <span>มีแอปเวอร์ชันใหม่ บันทึกงานที่ค้างอยู่ก่อน แล้วกดโหลดใหม่</span>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={css(`padding:8px 14px; border:none; border-radius:var(--radius-md); background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body); white-space:nowrap;`)}
      >
        โหลดใหม่
      </button>
    </div>
  );
}
