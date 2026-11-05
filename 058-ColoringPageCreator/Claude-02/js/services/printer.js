/**
 * Printing. Slides are rendered into #printRoot (hidden on screen, the only visible thing
 * when printing – see css/print.css). Every slide gets its own page sized to the paper.
 */
import { slideSvg } from '../svg/render.js';

const PAPER_MM = { a4: [210, 297], letter: [215.9, 279.4] };
const MARGIN_MM = 10;

/**
 * @param {object} deck
 * @param {{scope:'current'|'all', slides:object[], mode:'colored'|'uncolored', paper:'a4'|'letter', orientation:'auto'|'portrait'|'landscape'}} opts
 */
export function printSlides(deck, { slides, mode, paper, orientation }) {
  const root = document.getElementById('printRoot');
  const [pw, ph] = PAPER_MM[paper] || PAPER_MM.a4;
  const pages = slides.map((slide) => {
    const landscape = orientation === 'auto' ? deck.width >= deck.height : orientation === 'landscape';
    return { slide, landscape };
  });

  // One @page rule per print job; mixed orientation falls back to the first slide's.
  const landscapeJob = pages[0].landscape;
  const pageW = (landscapeJob ? ph : pw) - MARGIN_MM * 2;
  const pageH = (landscapeJob ? pw : ph) - MARGIN_MM * 2;

  const style = document.createElement('style');
  style.id = 'printPageRule';
  style.textContent = `@page { size: ${paper === 'letter' ? 'letter' : 'A4'} ${landscapeJob ? 'landscape' : 'portrait'}; margin: ${MARGIN_MM}mm; }`;
  document.head.append(style);

  root.innerHTML = pages
    .map(({ slide }) => `<div class="print-page" style="width:${pageW}mm;height:${pageH}mm">${slideSvg(slide, deck, { mode, responsive: true })}</div>`)
    .join('');

  const cleanup = () => {
    root.innerHTML = '';
    style.remove();
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  // Give the browser one frame to lay the pages out before opening the print dialog.
  requestAnimationFrame(() => setTimeout(() => window.print(), 50));
}
