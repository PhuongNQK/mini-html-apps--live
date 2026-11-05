/** Exporting slides (SVG / PNG) and whole decks (ZIP of images, or the custom JSON file). */
import { downloadBlob, slug } from '../core/util.js';
import { slideSvg } from '../svg/render.js';
import { serializeDeck } from './deckFile.js';
import { ZipWriter } from './zip.js';

const MAX_CANVAS = 8192;

export const svgDocument = (deck, slide, mode) => `<?xml version="1.0" encoding="UTF-8"?>\n${slideSvg(slide, deck, { mode })}`;

export async function svgToPngBlob(svgText, width, height, scale = 1) {
  const k = Math.min(scale, MAX_CANVAS / Math.max(width, height));
  const img = new Image();
  img.decoding = 'async';
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => reject(new Error('Could not rasterise the SVG'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
  });
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * k);
  canvas.height = Math.round(height * k);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encoding failed'))), 'image/png'));
}

async function renderFile(deck, slide, format, mode, scale) {
  const svg = svgDocument(deck, slide, mode);
  if (format === 'svg') return new Blob([svg], { type: 'image/svg+xml' });
  return svgToPngBlob(svg, deck.width, deck.height, scale);
}

/** Resolves 'current' to the deck's active mode and 'both' to two modes. */
const modesFor = (deck, choice) => (choice === 'both' ? ['colored', 'uncolored'] : [choice === 'current' ? deck.view.mode : choice]);

/**
 * Exports some slides. One file is downloaded directly, several are packed into a ZIP.
 * @param {{slides:object[], format:'svg'|'png', modeChoice:string, scale:number}} opts
 */
export async function exportSlides(deck, { slides, format, modeChoice, scale = 1 }) {
  const modes = modesFor(deck, modeChoice);
  const files = [];
  for (const slide of slides) {
    const index = String(deck.slides.indexOf(slide) + 1).padStart(2, '0');
    for (const mode of modes) {
      const suffix = modes.length > 1 || modeChoice !== 'current' ? `-${mode}` : '';
      files.push({ name: `${index}-${slug(slide.name)}${suffix}.${format}`, blob: await renderFile(deck, slide, format, mode, scale) });
    }
  }
  if (files.length === 1) {
    downloadBlob(files[0].blob, `${slug(deck.name)}-${files[0].name}`);
    return;
  }
  const zip = new ZipWriter();
  for (const f of files) zip.add(`${slug(deck.name)}/${f.name}`, new Uint8Array(await f.blob.arrayBuffer()));
  downloadBlob(zip.toBlob(), `${slug(deck.name)}-${format}.zip`);
}

/** The custom file that can be re-imported to fully reconstruct the deck. */
export function exportDeckFile(deck) {
  downloadBlob(new Blob([serializeDeck(deck)], { type: 'application/json' }), `${slug(deck.name)}.mcc-deck.json`);
}
