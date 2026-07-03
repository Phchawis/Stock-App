import React from 'react';
import QRCode from 'qrcode';
import { css } from '../css.js';

export function PrintStickerModal({ v }) {
  const {
    stop, modalPrintSticker, closePrintSticker, printLotData, ic,
  } = v;

  const [qrUrl, setQrUrl] = React.useState('');

  // Generate high-resolution QR base64 URL when lot data changes
  React.useEffect(() => {
    if (modalPrintSticker && printLotData) {
      setQrUrl('');
      const { lot } = printLotData;

      QRCode.toDataURL(lot.qr, {
        errorCorrectionLevel: 'H', // 30% damage tolerance for reliable scanning at small print sizes
        margin: 3,                 // wider quiet zone so scanners lock onto the finder patterns
        width: 600,                // high resolution
        color: { dark: '#000000', light: '#ffffff' }
      }, (err, url) => {
        if (!err) setQrUrl(url);
      });
    }
  }, [modalPrintSticker, printLotData]);

  const [downloading, setDownloading] = React.useState(false);

  if (!modalPrintSticker || !printLotData) return null;

  const { lot, reagent } = printLotData;

  // Storage condition (temperature) shown on the sticker. The reagent may arrive
  // as a raw record (has .storage) or as a view-model (has .storageLabel), so accept both.
  const storageLabel = reagent.storageLabel || ({
    REFRIGERATED_2_8: '2–8°C',
    FROZEN_40: '−40°C',
    ROOM_TEMP: 'อุณหภูมิห้อง'
  })[reagent.storage] || reagent.storage || '—';

  // Render the WHOLE sticker (QR + all text) to a single 40x20mm PNG and download it.
  // Printing one image via the printer's own label utility is far more reliable than
  // browser HTML/CSS printing on ZPL thermal label printers.
  const downloadSticker = async () => {
    if (!qrUrl || downloading) return;
    setDownloading(true);
    try {
      try { await document.fonts.ready; } catch (e) { /* fonts best-effort */ }
      const scale = 20;                 // px per mm → 40x20mm label at ~500dpi
      const W = 40 * scale, H = 20 * scale; // 800 x 400
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // QR on the left
      const pad = 26;
      const qrSize = H - pad * 2;
      await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => { ctx.imageSmoothingEnabled = false; ctx.drawImage(img, pad, pad, qrSize, qrSize); resolve(); };
        img.onerror = resolve;
        img.src = qrUrl;
      });

      // Text on the right
      const tx = pad + qrSize + 22;
      const tw = W - tx - pad;
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'alphabetic';
      const clip = (text, font) => {
        ctx.font = font;
        if (ctx.measureText(text).width <= tw) return text;
        let t = text;
        while (t.length > 1 && ctx.measureText(t + '…').width > tw) t = t.slice(0, -1);
        return t + '…';
      };
      const nameFont = "bold 40px 'Sarabun', sans-serif";
      const locFont = "30px 'Sarabun', sans-serif";
      ctx.font = nameFont;
      ctx.fillText(clip(reagent.th, nameFont), tx, 92);
      ctx.font = "600 34px 'IBM Plex Mono', monospace";
      ctx.fillText('Lot: ' + lot.lot, tx, 158);
      ctx.font = "bold 34px 'IBM Plex Mono', monospace";
      ctx.fillText('EXP: ' + lot.expiry, tx, 222);
      ctx.font = locFont;
      ctx.fillText(clip('สภาวะจัดเก็บ: ' + storageLabel, locFont), tx, 288);

      const url = canvas.toDataURL('image/png');
      const safe = (reagent.en || reagent.th).replace(/[^a-zA-Z0-9ก-๙]/g, '_');
      const link = document.createElement('a');
      link.href = url;
      link.download = `Sticker_${lot.lot}_${safe}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(false);
    }
  };

  const printStyle = `
    @media print {
      @page {
        size: 40mm 20mm;
        margin: 0;
      }
      /* Bulletproof "print only the sticker": hide EVERYTHING via visibility, then
         re-show just the sticker. This avoids stray fixed elements (e.g. the mobile
         action bar) leaking onto the label — enumerating elements to hide missed them. */
      body * {
        visibility: hidden !important;
      }
      .sticker-print-area,
      .sticker-print-area * {
        visibility: visible !important;
      }
      /* Pin the sticker to the top-left of the page and fill the 40x20mm label */
      .sticker-print-area {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 40mm !important;
        height: 20mm !important;
        padding: 1.5mm 2mm !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        background: #ffffff !important;
        gap: 2mm !important;
        overflow: hidden !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      /* Force text to solid black for thermal printheads (keep the QR image as-is) */
      .sticker-print-area div,
      .sticker-print-area strong {
        color: #000000 !important;
      }
      .sticker-print-area img {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;

  // Shared sticker content (QR + details) — used by BOTH the print area and the
  // on-screen preview so they can never drift apart. No fixed-height + overflow:hidden
  // on the text column (that was clipping the tops of Thai vowels/tone marks).
  const stickerBody = (
    <>
      <div style={{ width: '1.5cm', height: '1.5cm', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {qrUrl ? (
          <img src={qrUrl} alt="QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#ffffff' }} />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.7mm', textAlign: 'left' }}>
        <div style={{ fontSize: '8.5px', fontWeight: 'bold', color: '#000', lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {reagent.th}
        </div>
        <div style={{ fontSize: '7.5px', color: '#000', fontFamily: 'monospace', lineHeight: 1.4 }}>
          Lot: <strong>{lot.lot}</strong>
        </div>
        <div style={{ fontSize: '7.5px', fontWeight: 'bold', color: '#c2410c', lineHeight: 1.4 }}>
          EXP: {lot.expiry}
        </div>
        <div style={{ fontSize: '7px', color: '#333', lineHeight: 1.5, whiteSpace: 'nowrap' }}>
          สภาวะจัดเก็บ: {storageLabel}
        </div>
      </div>
    </>
  );

  const buttonStyle = `
    .sticker-dl-btn {
      position: relative;
      overflow: hidden;
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 12px 18px;
      border: none;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--brand-600) 0%, var(--brand-800) 100%);
      color: #ffffff;
      cursor: pointer;
      font: var(--fw-bold) var(--text-sm)/1 var(--font-body);
      box-shadow: 0 6px 18px rgba(26,147,179,0.35);
      transition: transform .18s cubic-bezier(.25,.8,.25,1), box-shadow .18s ease, filter .18s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .sticker-dl-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(26,147,179,0.5);
    }
    .sticker-dl-btn:active:not(:disabled) {
      transform: translateY(0) scale(.98);
      box-shadow: 0 4px 12px rgba(26,147,179,0.4);
    }
    .sticker-dl-btn:disabled {
      opacity: .6;
      cursor: default;
      filter: grayscale(.3);
    }
    .sticker-dl-btn .sticker-dl-ic {
      transition: transform .25s ease;
    }
    .sticker-dl-btn:hover:not(:disabled) .sticker-dl-ic {
      transform: translateY(2px);
    }
    /* diagonal shine sweep on hover */
    .sticker-dl-btn::after {
      content: '';
      position: absolute;
      top: 0;
      left: -130%;
      width: 55%;
      height: 100%;
      background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.38) 50%, transparent 100%);
      transform: skewX(-20deg);
      pointer-events: none;
    }
    .sticker-dl-btn:hover:not(:disabled)::after {
      animation: sticker-shine .85s ease;
    }
    @keyframes sticker-shine {
      from { left: -130%; }
      to { left: 140%; }
    }
  `;

  return (
    <>
      <style>{printStyle}</style>
      <style>{buttonStyle}</style>

      {/* 1. Real Sticker Print Area (Only rendered in printing, hidden on screen) */}
      <div className="sticker-print-area" style={{
        display: 'none',
        width: '100%',
        height: '100%',
        padding: '1.5mm 2mm',
        boxSizing: 'border-box',
        background: '#ffffff',
        color: '#000000',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '2mm',
        fontFamily: "'Inter', 'Sarabun', sans-serif"
      }}>
        {stickerBody}
      </div>

      {/* 2. Visual Screen Modal (Hidden during printing) */}
      <div className="ov-in no-print" onClick={closePrintSticker} style={css(`position:fixed; inset:0; background:rgba(24,27,42,.46); z-index:99; display:grid; place-items:center; padding:24px;`)}>
        <div className="tt-in" onClick={stop} style={css(`width:min(440px,96vw); background:var(--surface-card); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); overflow:hidden; border:1px solid var(--border-subtle);`)}>
          {/* Header */}
          <div style={css(`padding:16px 20px; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px;`)}>
            <span style={css(`width:30px; height:30px; border-radius:var(--radius-md); background:var(--brand-50); color:var(--brand-700); display:grid; place-items:center;`)}>
              {ic.qr}
            </span>
            <div style={css(`flex:1;`)}>
              <div style={css(`font:var(--fw-bold) var(--text-sm)/1.2 var(--font-display); color:var(--text-primary);`)}>สติกเกอร์ QR Code น้ำยา</div>
              <div style={css(`font:var(--text-3xs)/1.2 var(--font-body); color:var(--text-tertiary);`)}>ขนาดมาตรฐาน 2 x 4 เซนติเมตร (40 x 20 mm)</div>
            </div>
            <button onClick={closePrintSticker} style={css(`border:none; background:var(--slate-100); cursor:pointer; padding:5px; border-radius:var(--radius-sm); color:var(--text-secondary); display:grid; place-items:center;`)}>
              {ic.close}
            </button>
          </div>

          {/* Body */}
          <div style={css(`padding:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; background:var(--slate-50);`)}>
            
            {/* Sticker Visual Preview (Dashed border, only on screen, side-by-side layout) */}
            <div style={{
              width: '4cm',
              height: '2cm',
              border: '1px dashed var(--border-strong)',
              borderRadius: '2px',
              padding: '1.5mm 2mm',
              boxSizing: 'border-box',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '2mm',
              fontFamily: "'Inter', 'Sarabun', sans-serif"
            }}>
              {stickerBody}
            </div>

            <div style={css(`font:var(--text-3xs)/1.5 var(--font-body); color:var(--text-secondary); text-align:center; max-width:300px;`)}>
              💡 กด <strong>ดาวน์โหลดสติกเกอร์</strong> เพื่อบันทึกเป็นไฟล์รูป PNG แล้วนำไปสั่งพิมพ์ผ่านโปรแกรมฉลากของเครื่องพิมพ์ (หรือ Windows Photos) โดยเลือกกระดาษ <strong>40 x 20 mm</strong>
            </div>
          </div>

          {/* Footer */}
          <div style={css(`padding:14px 20px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px;`)}>
            <button onClick={closePrintSticker} style={css(`padding:11px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
              ยกเลิก
            </button>
            <button className="sticker-dl-btn" onClick={downloadSticker} disabled={!qrUrl || downloading}>
              <span className="sticker-dl-ic" style={{ display: 'grid', placeItems: 'center' }}>{ic.receive}</span>
              {downloading ? 'กำลังสร้างไฟล์…' : 'ดาวน์โหลดสติกเกอร์ (PNG)'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
