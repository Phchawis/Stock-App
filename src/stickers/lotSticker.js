import QRCode from 'qrcode';

// The 40 x 20 mm lot sticker, drawn to a canvas. One renderer for the single
// download in PrintStickerModal and the batch download from the movement
// history, so a sticker looks the same whichever way it was made.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// "YYYY-MM-DD" -> "3 Jul 2026" (day, English abbreviated month, year).
export function formatStickerDate(isoDate) {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split('-');
  const mi = parseInt(m, 10) - 1;
  if (!y || !d || mi < 0 || mi > 11) return isoDate;
  return `${parseInt(d, 10)} ${MONTHS[mi]} ${y}`;
}

// Storage condition (temperature) shown on the sticker. The reagent may arrive
// as a raw record (has .storage) or as a view-model (has .storageLabel), so accept both.
export function storageLabelOf(reagent) {
  return reagent.storageLabel || ({
    REFRIGERATED_2_8: '2–8°C',
    FROZEN_40: '−40°C',
    ROOM_TEMP: 'อุณหภูมิห้อง'
  })[reagent.storage] || reagent.storage || '—';
}

// Render the WHOLE sticker (QR + all text) to a single 40x20mm canvas.
// Printing one image is far more reliable than browser HTML/CSS printing on
// ZPL thermal label printers.
export async function renderLotSticker(lot, reagent) {
  try { await document.fonts.ready; } catch (e) { /* fonts best-effort */ }
  const recvLabel = formatStickerDate(lot.recvDate) || '—';
  const expLabel = formatStickerDate(lot.expiry) || lot.expiry;
  const storageLabel = storageLabelOf(reagent);

  const scale = 20;                 // px per mm → 40x20mm label at ~500dpi
  const W = 40 * scale, H = 20 * scale; // 800 x 400
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // QR on the left — drawn module-by-module from the raw QR matrix instead of
  // scaling a pre-rendered PNG. Scaling a bitmap QR down/up onto the canvas
  // resamples its finite black/white modules, which is what most often shows
  // up as "fuzzy" or moiré detail once printed on a thermal label printer.
  // Drawing each module as its own rect keeps every edge pixel-crisp at any
  // final print resolution.
  const pad = 26;
  // Full label height — matches the width of the info column next to it
  // rather than leaving the QR looking small in comparison.
  const qrSize = H - pad * 2;
  const qrY = pad;
  const qrMatrix = QRCode.create(lot.qr, { errorCorrectionLevel: 'H' }).modules;
  const moduleCount = qrMatrix.size;
  const marginModules = 3; // matches the on-screen QR's quiet-zone margin
  const totalModules = moduleCount + marginModules * 2;
  const cellSize = qrSize / totalModules;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pad, qrY, qrSize, qrSize);
  ctx.fillStyle = '#000000';
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (!qrMatrix.get(row, col)) continue;
      // Round each cell's edges (not its width) so adjacent modules never
      // leave a hairline gap or overlap regardless of final pixel scale.
      const x0 = Math.round(pad + (marginModules + col) * cellSize);
      const x1 = Math.round(pad + (marginModules + col + 1) * cellSize);
      const y0 = Math.round(qrY + (marginModules + row) * cellSize);
      const y1 = Math.round(qrY + (marginModules + row + 1) * cellSize);
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  }

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
  // Baselines start lower than a Latin-metrics estimate would suggest — Thai
  // stacked tone marks/vowels on a bold face render noticeably taller above
  // the baseline than the nominal font size implies, confirmed by checking
  // actual rendered pixel bounds (a naive ascent estimate left only 6px of
  // margin above the label's physical top edge).
  // expFont is capped at 38px (not bumped alongside the others) — measured
  // against the actual available width once the QR went back to full label
  // height: 42px clipped a realistic "EXP: 20 Jul 2026" down to "20 Jul 20…",
  // which is not acceptable for the one safety-critical field on the label.
  let nameFontSize = 48;
  ctx.font = `bold ${nameFontSize}px 'Sarabun', sans-serif`;
  while (ctx.measureText(reagent.th).width > tw && nameFontSize > 22) {
    nameFontSize -= 2;
    ctx.font = `bold ${nameFontSize}px 'Sarabun', sans-serif`;
  }
  const dataFont = "700 40px 'IBM Plex Mono', monospace";
  const recvFont = "700 38px 'Sarabun', sans-serif";
  const expFont = "bold 38px 'IBM Plex Mono', monospace";
  const locFont = "600 32px 'Sarabun', sans-serif";
  ctx.fillText(clip(reagent.th, ctx.font), tx, 86);
  ctx.font = dataFont;
  ctx.fillText(clip('Lot: ' + lot.lot, dataFont), tx, 156);
  ctx.font = recvFont;
  ctx.fillText(clip('รับเข้า: ' + recvLabel, recvFont), tx, 226);
  ctx.font = expFont;
  ctx.fillText(clip('EXP: ' + expLabel, expFont), tx, 296);
  ctx.font = locFont;
  ctx.fillText(clip('สภาวะจัดเก็บ: ' + storageLabel, locFont), tx, 366);

  // Force every pixel to pure black or pure white — canvas text (even with a
  // solid black fillStyle) is anti-aliased, leaving grey pixels along every
  // edge. Many label/photo print pipelines run a dithering pass on any
  // greyscale content, which turns those soft anti-aliased edges into the
  // speckled halftone pattern that shows up on the printed label. Thresholding
  // here removes all grey from the source, so there's nothing left to dither —
  // biased toward black so thin Thai tone marks and QR modules don't get eaten
  // away by the cutoff — thermal printheads under-render thin strokes, so
  // erring toward bolder source text holds up better once actually printed.
  const imageData = ctx.getImageData(0, 0, W, H);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const luminance = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const v = luminance < 210 ? 0 : 255;
    data[i] = data[i + 1] = data[i + 2] = v;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

export function canvasToPngBytes(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => {
      if (!b) { reject(new Error('สร้างรูปสติกเกอร์ไม่สำเร็จ')); return; }
      b.arrayBuffer().then(buf => resolve(new Uint8Array(buf)), reject);
    }, 'image/png');
  });
}

// File-name-safe form of a reagent name (keeps Thai).
export function safeName(reagent) {
  return (reagent.en || reagent.th || '').replace(/[^a-zA-Z0-9ก-๙]/g, '_');
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
