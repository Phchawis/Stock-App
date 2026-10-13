import { renderLotSticker, canvasToPngBytes } from './lotSticker.js';
import { buildStickerDocx } from './stickerDocx.js';

const DOCX_TYPE = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * One Word file holding every sticker for the given lots, `count` copies each.
 * Each lot's sticker is drawn once and repeated, so a 20-bottle receipt costs
 * one render.
 * @param {{ lot: object, reagent: object, count: number }[]} jobs
 */
export async function stickerDocxBlob(jobs) {
  const stickers = [];
  for (const j of jobs) {
    if (!(j.count > 0)) continue;
    const png = await canvasToPngBytes(await renderLotSticker(j.lot, j.reagent));
    stickers.push({ png, copies: j.count, name: j.reagent.th || j.reagent.en || 'Sticker' });
  }
  return new Blob([buildStickerDocx(stickers)], { type: DOCX_TYPE });
}
