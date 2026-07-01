import React from 'react';
import QRCode from 'qrcode';
import { css } from '../css.js';

export function PrintStickerModal({ v }) {
  const {
    stop, modalPrintSticker, closePrintSticker, printLotData, ic,
  } = v;

  const [qrUrl, setQrUrl] = React.useState('');
  const [qrReady, setQrReady] = React.useState(false);

  // Generate high-resolution QR base64 URL when lot data changes
  React.useEffect(() => {
    if (modalPrintSticker && printLotData) {
      setQrReady(false);
      setQrUrl('');
      const { lot } = printLotData;

      QRCode.toDataURL(lot.qr, {
        margin: 1, // standard clear margin for printing compatibility
        width: 600, // 600px high resolution for copy-pasting in MS Word
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, (err, url) => {
        if (!err) {
          setQrUrl(url);
          setQrReady(true);
        }
      });
    }
  }, [modalPrintSticker, printLotData]);

  // Trigger browser print dialog after QR code is fully loaded in state
  React.useEffect(() => {
    if (modalPrintSticker && printLotData && qrReady) {
      const timer = setTimeout(() => {
        window.print();
      }, 800); // 800ms delay for stylesheet and state stabilization
      return () => clearTimeout(timer);
    }
  }, [modalPrintSticker, printLotData, qrReady]);

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
    ADV: 'ตรวจวินิจฉัยชั้นสูง'
  };
  const catLabel = catMap[reagent.cat] || reagent.cat;

  // Storage Condition fallback if lot location is empty
  const storageLabel = ({
    REFRIGERATED_2_8: '2–8°C',
    FROZEN_40: '−40°C',
    ROOM_TEMP: 'อุณหภูมิห้อง'
  })[reagent.storage] || reagent.storage;

  const locLabel = lot.loc || storageLabel;

  // Download high-resolution QR code PNG function
  const downloadQR = () => {
    if (!qrUrl) return;
    const link = document.createElement('a');
    link.href = qrUrl;
    // Filename structure: QR_Lot_ReagentName.png
    const safeReagentName = (reagent.en || reagent.th).replace(/[^a-zA-Z0-9ก-๙]/g, '_');
    link.download = `QR_${lot.lot}_${safeReagentName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printStyle = `
    @media print {
      @page {
        size: 40mm 20mm;
        margin: 0;
      }
      /* Hide all visual interface wrappers during print */
      aside, header, main, .sidebar-backdrop, .dr-in, .toast-container, .no-print, .ov-in {
        display: none !important;
      }
      /* Reset layout wrappers to 100% viewport width/height */
      html, body, #root, #root > div {
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: transparent !important;
        background-color: transparent !important;
        min-height: auto !important;
        display: block !important;
        position: static !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      /* Force print area to display and stretch to 100% of selected paper size */
      .sticker-print-area {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        position: static !important;
        width: 100% !important;
        height: 100% !important;
        padding: 1.5mm 2mm !important;
        margin: 0 !important;
        border: none !important;
        box-shadow: none !important;
        box-sizing: border-box !important;
        background: #ffffff !important;
        color: #000000 !important;
        gap: 2mm !important;
      }
      /* Force all children (text, labels, EXP) to solid black color for thermal printheads */
      .sticker-print-area * {
        color: #000000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  `;

  return (
    <>
      <style>{printStyle}</style>

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
        {/* QR Code */}
        <div style={{ width: '1.5cm', height: '1.5cm', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {qrUrl ? (
            <img 
              src={qrUrl} 
              alt="QR Code" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: '#ffffff' }} />
          )}
        </div>

        {/* Reagent Details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '1.5cm', overflow: 'hidden', textAlign: 'left' }}>
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

      {/* 2. Visual Screen Modal (Hidden during printing) */}
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
              {/* QR Code */}
              <div style={{ width: '1.5cm', height: '1.5cm', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {qrUrl ? (
                  <img 
                    src={qrUrl} 
                    alt="QR Code" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated', display: 'block' }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#ffffff' }} />
                )}
              </div>

              {/* Reagent Details */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '1.5cm', overflow: 'hidden', textAlign: 'left' }}>
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
            <button onClick={downloadQR} disabled={!qrUrl} style={css(`padding:8px 14px; border-radius:var(--radius-md); border:1px solid var(--brand-200); background:var(--brand-50); color:var(--brand-700); cursor:pointer; font:var(--fw-semibold) var(--text-xs)/1 var(--font-body);`)}>
              📥 ดาวน์โหลดรูปภาพ QR Code (PNG)
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
