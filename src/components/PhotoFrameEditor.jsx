import React from 'react';
import { css } from '../css.js';

// Fits a reagent photo into the catalogue's 4:3 frame before it is saved:
// drag to move, zoom, and turn a few degrees to level a box shot at a slant.
// Every reagent photo then frames its box the same way, and the box fills
// the frame so the name printed on it can be read. Output is 800x600 JPEG;
// the old 480px limit was what left box names a few pixels tall.
export const FRAME_W = 800;
export const FRAME_H = 600;
const MAT = '#eef1f0';                   // light mat behind a photo zoomed out past its edges

function draw(ctx, img, w, h, { zoom, rot, ox, oy }) {
  ctx.fillStyle = MAT;
  ctx.fillRect(0, 0, w, h);
  if (!img) return;
  // zoom 1 = the photo just covers the frame
  const base = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const s = base * zoom;
  ctx.save();
  ctx.translate(w / 2 + ox * w, h / 2 + oy * h);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.scale(s, s);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  ctx.restore();
}

// Every reagent photo is sent with the whole catalogue (GET /api/reagents), so
// each one is held to a budget: step the JPEG quality down until it fits.
const MAX_DATAURL_CHARS = 140 * 1024;    // ≈105 KB of JPEG once base64 is decoded

export function renderFramed(img, view) {
  const c = document.createElement('canvas');
  c.width = FRAME_W; c.height = FRAME_H;
  draw(c.getContext('2d'), img, FRAME_W, FRAME_H, view);
  let out = '';
  for (let q = 0.86; q >= 0.5; q -= 0.06) {
    out = c.toDataURL('image/jpeg', q);
    if (out.length <= MAX_DATAURL_CHARS) break;
  }
  return out;
}

export function PhotoFrameEditor({ src, onDone, onCancel }) {
  const canvasRef = React.useRef(null);
  const [img, setImg] = React.useState(null);
  const [view, setView] = React.useState({ zoom: 1, rot: 0, ox: 0, oy: 0 });
  const drag = React.useRef(null);

  React.useEffect(() => {
    const i = new Image();
    i.onload = () => setImg(i);
    i.src = src;
  }, [src]);

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth, h = c.clientHeight;
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    const ctx = c.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(ctx, img, w, h, view);
  }, [img, view]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: view.ox, oy: view.oy };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    setView(v => ({ ...v, ox: drag.current.ox + (e.clientX - drag.current.x) / r.width, oy: drag.current.oy + (e.clientY - drag.current.y) / r.height }));
  };
  const onPointerUp = () => { drag.current = null; };
  const onWheel = (e) => {
    e.preventDefault();
    setView(v => ({ ...v, zoom: Math.min(4, Math.max(0.5, v.zoom * (e.deltaY < 0 ? 1.06 : 1 / 1.06))) }));
  };
  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return undefined;
    c.addEventListener('wheel', onWheel, { passive: false });
    return () => c.removeEventListener('wheel', onWheel);
  });

  const nudge = (k, d) => setView(v => ({ ...v, [k]: Math.round((v[k] + d) * 10) / 10 }));
  const slider = `width:100%; accent-color:var(--brand-700);`;
  const label = `display:flex; flex-direction:column; gap:4px; font:var(--fw-semibold) var(--text-xs)/1.3 var(--font-body); color:var(--text-primary);`;
  const small = `padding:6px 10px; border-radius:var(--radius-sm); border:1px solid var(--border-default); background:var(--white); color:var(--text-primary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`;

  return (
    <div className="ov-in" onClick={onCancel} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:120; display:grid; place-items:center; padding:16px;`)}>
      <div role="dialog" aria-label="จัดกรอบรูปน้ำยา" className="tt-in" onClick={(e) => e.stopPropagation()} style={css(`width:min(560px,96vw); max-height:94vh; overflow-y:auto; background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); padding:18px; display:flex; flex-direction:column; gap:12px;`)}>
        <div>
          <div style={css(`font:var(--fw-bold) var(--text-base)/1.3 var(--font-display); color:var(--text-primary);`)}>จัดกรอบรูปน้ำยา</div>
          <div style={css(`font:var(--text-xs)/1.5 var(--font-body); color:var(--text-secondary); margin-top:2px;`)}>
            ลากรูปเพื่อเลื่อน ซูมให้หน้ากล่องเต็มกรอบ และหมุนให้กล่องตรง ให้ชื่อน้ำยาบนกล่องอยู่ในกรอบชัดเจน
          </div>
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label="ตัวอย่างรูปในกรอบ ลากเพื่อเลื่อน"
          style={css(`width:100%; aspect-ratio:4/3; border-radius:var(--radius-md); border:1px solid var(--border-strong); cursor:grab; touch-action:none; background:${MAT};`)}
        />
        <label style={css(label)}>
          ซูม ({Math.round(view.zoom * 100)}%)
          <input type="range" min="0.5" max="4" step="0.01" value={view.zoom} onChange={(e) => setView(v => ({ ...v, zoom: +e.target.value }))} style={css(slider)} />
        </label>
        {/* a div, not a label: a label would forward clicks on its text to the ↺ button */}
        <div style={css(label)}>
          <span id="pfe-rot">หมุน ({view.rot > 0 ? '+' : ''}{view.rot}°)</span>
          <div style={css(`display:flex; align-items:center; gap:8px;`)}>
            <button type="button" onClick={() => nudge('rot', -0.5)} style={css(small)} aria-label="หมุนทวนเข็ม 0.5 องศา">↺</button>
            <input type="range" aria-labelledby="pfe-rot" min="-20" max="20" step="0.5" value={view.rot} onChange={(e) => setView(v => ({ ...v, rot: +e.target.value }))} style={css(slider)} />
            <button type="button" onClick={() => nudge('rot', 0.5)} style={css(small)} aria-label="หมุนตามเข็ม 0.5 องศา">↻</button>
          </div>
        </div>
        <div style={css(`display:flex; flex-wrap:wrap; justify-content:space-between; gap:10px; padding-top:4px;`)}>
          <button type="button" onClick={() => setView({ zoom: 1, rot: 0, ox: 0, oy: 0 })} style={css(small)}>เริ่มใหม่</button>
          <div style={css(`display:flex; gap:10px;`)}>
            <button type="button" onClick={onCancel} style={css(`padding:9px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>ยกเลิก</button>
            <button type="button" disabled={!img} onClick={() => onDone(renderFramed(img, view))} style={css(`padding:9px 16px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>ใช้รูปนี้</button>
          </div>
        </div>
      </div>
    </div>
  );
}
