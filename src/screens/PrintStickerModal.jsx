import React from 'react';
import { css } from '../css.js';

export function QRCodeSVG({ value = '' }) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const cells = [];
  for (let r = 0; r < 12; r++) {
    for (let c = 0; c < 12; c++) {
      // finder patterns at top-left, bottom-left, top-right corners
      const isTL = r < 4 && c < 4;
      const isBL = r > 7 && c < 4;
      const isTR = r < 4 && c > 7;
      if (isTL || isBL || isTR) {
        const subR = isTL ? r : (isBL ? r - 8 : r);
        const subC = isTL ? c : (isBL ? c : c - 8);
        const isFinderDot = (subR === 0 || subR === 3 || subC === 0 || subC === 3) || (subR === 1.5 || subC === 1.5) || (subR === 1 && subC === 1) || (subR === 2 && subC === 2) || (subR === 1 && subC === 2) || (subR === 2 && subC === 1);
        cells.push(isFinderDot);
      } else {
        const val = ((hash >> (r + c * 2)) & 1) === 1;
        cells.push(val);
      }
    }
  }
  return (
    <svg width="100%" height="100%" viewBox="0 0 12 12" style={{ shapeRendering: 'crispEdges' }}>
      <rect width="12" height="12" fill="#fff" />
      {cells.map((fill, idx) => {
        if (!fill) return null;
        const r = Math.floor(idx / 12);
        const c = idx % 12;
        return <rect key={idx} x={c} y={r} width="1" height="1" fill="#000" />;
      })}
    </svg>
  );
}

export function PrintStickerModal({ v }) {
  const {
    stop, modalPrintSticker, closePrintSticker, printLotData, ic,
  } = v;

  if (!modalPrintSticker || !printLotData) return null;

  const { lot, reagent } = printLotData;

  // Category translation
  const catMap = {
    CHE: 'เคมีคลินิก',
    HEM: 'โลหิตวิทยา',
    IMM: 'ภูมิคุ้มกันวิทยา',
    MIP: 'จุลทรรศนศาสตร์',
    MDC: 'หมวดงานศูนย์ปฏิบัติการตรวจวินิจฉัยทางการแพทย์',
    HMS: 'บริการศูนย์การแพทย์',
    ADV: 'ตรวจวินิจฉัยขั้นสูง'
  };
  const catLabel = catMap[reagent.cat] || reagent.cat;

  // Storage Condition fallback if lot location is empty
  const storageLabel = ({
    REFRIGERATED_2_8: '2–8°C',
    FROZEN_40: '−40°C',
    ROOM_TEMP: 'อุณหภูมิห้อง'
  })[reagent.storage] || reagent.storage;

  const locLabel = lot.loc || storageLabel;

  const printStyle = `
    @media print {
      body * {
        visibility: hidden !important;
      }
      .sticker-print-area, .sticker-print-area * {
        visibility: visible !important;
      }
      .sticker-print-area {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 4cm !important;
        height: 2cm !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
      }
    }
  `;

  return (
    <>
      <style>{printStyle}</style>

      <div className="ov-in no-print" onClick={closePrintSticker} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:99; display:grid; place-items:center; padding:24px;`)}>
        <div className="tt-in" onClick={stop} style={css(`width:min(440px,96vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); overflow:hidden; border:1px solid var(--border-subtle);`)}>
          {/* Header */}
          <div style={css(`padding:16px 20px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px;`)}>
            <span style={css(`width:30px; height:30px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center;`)}>
              {ic.qr}
            </span>
            <div style={css(`flex:1;`)}>
              <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary);`)}>พิมพ์สติกเกอร์รหัส QR Code</div>
              <div style={css(`font:var(--text-3xs)/1.2 var(--font-body); color:var(--text-tertiary);`)}>ขนาดสติกเกอร์มาตรฐาน 2 x 4 เซนติเมตร (Landscape)</div>
            </div>
            <button onClick={closePrintSticker} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:5px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>
              {ic.close}
            </button>
          </div>

          {/* Body */}
          <div style={css(`padding:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; background:var(--slate-50);`)}>
            
            {/* Sticker Preview Box (2x4 cm) */}
            <div className="sticker-print-area" style={{
              width: '4cm',
              height: '2cm',
              border: '1px dashed var(--border-strong)',
              borderRadius: '2px',
              padding: '1.5mm 2mm',
              boxSizing: 'border-box',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              gap: '1.5mm',
              fontFamily: "'Inter', 'Sarabun', sans-serif"
            }}>
              {/* QR Code */}
              <div style={{ width: '1.5cm', height: '1.5cm', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center' }}>
                <QRCodeSVG value={lot.qr} />
              </div>

              {/* Reagent Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden', textAlign: 'left', alignSelf: 'center' }}>
                {/* Name */}
                <div style={{ fontSize: '7.5px', fontWeight: 'bold', color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.2' }}>
                  {reagent.th}
                </div>

                <div style={{ fontSize: '6.8px', color: '#000', fontFamily: 'monospace', lineHeight: '1.1' }}>
                  Lot: <strong>{lot.lot}</strong>
                </div>

                {/* Expiry */}
                <div style={{ fontSize: '6.8px', fontWeight: 'bold', color: '#c2410c', lineHeight: '1.1' }}>
                  EXP: {lot.expiry}
                </div>

                {/* Category & Location */}
                <div style={{ fontSize: '6px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.1' }}>
                  หมวด: {catLabel}
                </div>
                <div style={{ fontSize: '6px', color: '#444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.1' }}>
                  ที่เก็บ: {locLabel}
                </div>
              </div>
            </div>

            <div style={css(`font:var(--text-3xs)/1.4 var(--font-body); color:var(--text-secondary); text-align:center; max-width:280px;`)}>
              💡 แนะนำให้ตั้งค่าการพิมพ์ในเบราว์เซอร์เป็นขนาดกระดาษสติกเกอร์ <strong>2x4 cm (หรือ 40x20 mm)</strong> และปรับขอบกระดาษ (Margins) เป็น <strong>None (ไม่มี)</strong> ก่อนสั่งพิมพ์
            </div>
          </div>

          {/* Footer */}
          <div style={css(`padding:12px 20px; border-top:1px solid var(--border-subtle); display:flex; justify-content:flex-end; gap:10px;`)}>
            <button onClick={closePrintSticker} style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>
              ยกเลิก
            </button>
            <button onClick={() => window.print()} style={css(`padding:8px 14px; border-radius:var(--radius-md); border:none; background:var(--brand-700); color:#fff; cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body); box-shadow:var(--glow-brand-soft);`)}>
              🖨️ สั่งพิมพ์สติกเกอร์
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
