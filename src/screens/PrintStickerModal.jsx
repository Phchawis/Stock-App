import React from 'react';
import QRCode from 'qrcode';
import { css } from '../css.js';
import { renderLotSticker, formatStickerDate, storageLabelOf, safeName } from '../stickers/lotSticker.js';

export function PrintStickerModal({ v }) {
  const {
    stop, modalPrintSticker, closePrintSticker, printLotData, ic, logSticker, user,
    downloadStickers, stickerBusy, stickerFileName,
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
  const [count, setCount] = React.useState('');
  // Reset the sticker count to the receipt's whenever another lot opens.
  React.useEffect(() => {
    if (modalPrintSticker && printLotData) setCount(String(printLotData.count || 1));
  }, [modalPrintSticker, printLotData]);

  if (!modalPrintSticker || !printLotData) return null;

  const { lot, reagent, qty, unit, subUnit } = printLotData;
  const storageLabel = storageLabelOf(reagent);
  // Date the lot was received into stock (from its RECEIVE transaction). Older
  // lots created before this field existed won't have one — fall back to '—'.
  const recvLabel = formatStickerDate(lot.recvDate) || '—';
  const expLabel = formatStickerDate(lot.expiry) || lot.expiry;

  const n = Math.floor(Number(count));
  const countOk = n >= 1 && n <= 500;
  // How the suggested count was reached, so a reader can see why it is 20 and not 2.
  const basis = qty > 0
    ? (subUnit ? `ค่าแนะนำ: รับ ${qty} ${unit || ''} × ${subUnit.per} ${subUnit.name} = ${qty * subUnit.per} ดวง` : `ค่าแนะนำ: รับ ${qty} ${unit || ''} = ${qty} ดวง`)
    : '';

  // Every copy in one Word file: page 40 x 20 mm, one sticker per page.
  const downloadWord = async () => {
    if (!countOk || stickerBusy) return;
    const job = { lot, reagent, count: n };
    await downloadStickers([job], stickerFileName([job]));
  };

  // A single PNG, for printing through the label printer's own software.
  const downloadSticker = async () => {
    if (!qrUrl || downloading) return;
    setDownloading(true);
    try {
      const canvas = await renderLotSticker(lot, reagent);
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `Sticker_${lot.lot}_${safeName(reagent)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // File the same preparation record the Aliquot/Opened stickers write, so
      // every label the lab produces is traceable from one screen.
      if (logSticker) {
        logSticker({
          kind: 'LOT_QR', action: 'DOWNLOAD',
          reagentName: reagent.th || reagent.en || '',
          reagentId: reagent.id ?? null,
          lot: lot.lot, expDate: lot.expiry,
          // A lot sticker records where the bottle lives rather than a storage
          // temperature; label it so the printed record can't be misread.
          storageTemp: lot.loc ? `ตำแหน่งเก็บ ${lot.loc}` : '',
          preparedBy: (user && user.name) || '',
        });
      }
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

  const getNameStyle = () => {
    const len = (reagent.th || '').length;
    let fSize = '8.5px';
    if (len > 28) {
      fSize = '6px';
    } else if (len > 18) {
      fSize = '7px';
    }
    return {
      fontSize: fSize,
      fontWeight: 'bold',
      color: '#000',
      lineHeight: 1.2,
      wordBreak: 'break-word',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      margin: 0
    };
  };

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
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5mm', textAlign: 'left' }}>
        <div style={getNameStyle()}>
          {reagent.th}
        </div>
        <div style={{ fontSize: '7.5px', color: '#000', fontFamily: 'monospace', lineHeight: 1.3 }}>
          Lot: <strong>{lot.lot}</strong>
        </div>
        <div style={{ fontSize: '7px', color: '#333', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
          รับเข้า: {recvLabel}
        </div>
        <div style={{ fontSize: '7.5px', fontWeight: 'bold', color: '#c2410c', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
          EXP: {expLabel}
        </div>
        <div style={{ fontSize: '7px', color: '#333', lineHeight: 1.4, whiteSpace: 'nowrap' }}>
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
      background: var(--brand-700);
      color: #ffffff;
      cursor: pointer;
      font: var(--fw-bold) var(--text-sm)/1 var(--font-body);
      white-space: nowrap;
      box-shadow: 0 6px 18px rgba(26,147,179,0.35);
      transition: transform .18s cubic-bezier(.25,.8,.25,1), box-shadow .18s ease, filter .18s ease;
      -webkit-tap-highlight-color: transparent;
    }
    @media (max-width: 480px) {
      .sticker-dl-btn { padding: 12px; gap: 6px; }
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

            <div style={css(`width:100%; display:flex; flex-direction:column; align-items:center; gap:6px;`)}>
              <label htmlFor="sticker-count" style={css(`display:flex; align-items:center; gap:10px; font:var(--fw-semibold) var(--text-sm)/1.2 var(--font-body); color:var(--text-primary);`)}>
                จำนวนสติกเกอร์
                <input
                  id="sticker-count"
                  type="number" inputMode="numeric" min="1" max="500"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') downloadWord(); }}
                  style={css(`width:84px; height:38px; box-sizing:border-box; padding:0 10px; text-align:center; background:var(--white); border:1px solid ${countOk ? 'var(--border-default)' : 'var(--red-600)'}; border-radius:var(--radius-md); font:var(--fw-bold) var(--text-md)/1 var(--font-mono); color:var(--text-primary); outline:none;`)}
                />
                ดวง
              </label>
              <div style={css(`font:var(--text-3xs)/1.4 var(--font-body); color:${countOk ? 'var(--text-secondary)' : 'var(--red-700)'}; text-align:center; min-height:1.4em; text-wrap:balance;`)}>
                {countOk ? basis : 'ใส่จำนวน 1–500 ดวง'}
              </div>
            </div>

            <div style={css(`font:var(--text-3xs)/1.5 var(--font-body); color:var(--text-secondary); text-align:center; max-width:320px;`)}>
              💡 ได้ไฟล์ <strong>Word</strong> ไฟล์เดียว หน้าละ 1 ดวง ขนาด <strong>40 x 20 mm</strong> เปิดแล้วสั่งพิมพ์ไปที่เครื่องพิมพ์ฉลากได้ทันที
              <br />
              ใช้โปรแกรมฉลากของเครื่องพิมพ์?{' '}
              <button type="button" onClick={downloadSticker} disabled={!qrUrl || downloading}
                style={css(`border:none; background:transparent; padding:0; color:var(--brand-ink); cursor:pointer; font:var(--fw-semibold) var(--text-3xs)/1.5 var(--font-body); text-decoration:underline;`)}>
                {downloading ? 'กำลังสร้างไฟล์…' : 'ดาวน์โหลดเป็นรูป PNG (1 ดวง)'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={css(`padding:14px 20px; border-top:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px;`)}>
            <button onClick={closePrintSticker} style={css(`padding:11px 16px; border-radius:var(--radius-md); border:1px solid var(--border-default); background:var(--white); color:var(--text-secondary); cursor:pointer; font:var(--fw-semibold) var(--text-sm)/1 var(--font-body);`)}>
              ยกเลิก
            </button>
            <button className="sticker-dl-btn" onClick={downloadWord} disabled={!countOk || stickerBusy}>
              <span className="sticker-dl-ic" style={{ display: 'grid', placeItems: 'center' }}>{ic.receive}</span>
              {stickerBusy ? 'กำลังสร้างไฟล์…' : `ดาวน์โหลด ${countOk ? n : '–'} ดวง`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
