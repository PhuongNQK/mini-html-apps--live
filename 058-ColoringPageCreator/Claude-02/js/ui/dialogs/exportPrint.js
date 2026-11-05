/** Export (SVG / PNG / ZIP / deck file) and Print dialogs. */
import { state, activeSlide } from '../../core/store.js';
import { h } from '../../core/util.js';
import { t } from '../../core/i18n.js';
import { exportSlides } from '../../services/exporter.js';
import { printSlides } from '../../services/printer.js';
import { modal, toast } from '../dialog.js';

const select = (name, options, value) =>
  h('select', { class: 'field', name }, options.map(([v, label]) => h('option', { value: v, selected: v === value }, label)));

const row = (label, control) => h('label', { class: 'form-row' }, h('span', {}, label), control);

/** @param {'slide'|'deck'} scope */
export async function exportImagesDialog(scope) {
  const deck = state.deck;
  const format = select('format', [['svg', 'SVG (vector)'], ['png', 'PNG (image)']], 'png');
  const mode = select('mode', [
    ['current', t('export.modeCurrent', { mode: t(`mode.${deck.view.mode}`) })],
    ['colored', t('mode.colored')],
    ['uncolored', t('mode.uncolored')],
    ['both', t('export.modeBoth')],
  ], 'current');
  const scale = select('scale', [['1', '1×'], ['2', '2×'], ['3', '3×']], '1');
  const scaleRow = row(t('export.scale'), scale);
  const sync = () => (scaleRow.hidden = format.value !== 'png');
  format.addEventListener('change', sync);
  sync();

  const form = h('div', { class: 'form' },
    h('p', { class: 'hint' }, scope === 'deck' ? t('export.deckHint', { n: deck.slides.length }) : t('export.slideHint', { name: activeSlide().name })),
    row(t('export.format'), format), row(t('export.mode'), mode), scaleRow,
    h('p', { class: 'hint' }, t('export.bgHint')),
  );
  const ok = await modal({
    title: scope === 'deck' ? t('export.deckTitle') : t('export.slideTitle'),
    content: form,
    actions: [
      { label: t('common.cancel'), value: false },
      { label: t('common.export'), primary: true, value: true },
    ],
  });
  if (!ok) return;
  try {
    toast(t('export.working'));
    await exportSlides(deck, {
      slides: scope === 'deck' ? deck.slides : [activeSlide()],
      format: format.value,
      modeChoice: mode.value,
      scale: Number(scale.value),
    });
  } catch (err) {
    console.error(err);
    toast(t('export.failed'), 'error');
  }
}

export async function printDialog() {
  const deck = state.deck;
  const mode = select('mode', [['colored', t('mode.colored')], ['uncolored', t('mode.uncolored')]], deck.view.mode);
  const scope = select('scope', [['current', t('print.scopeCurrent')], ['all', t('print.scopeAll', { n: deck.slides.length })]], 'current');
  const paper = select('paper', [['a4', 'A4'], ['letter', 'US Letter']], 'a4');
  const orientation = select('orientation', [['auto', t('print.auto')], ['portrait', t('print.portrait')], ['landscape', t('print.landscape')]], 'auto');
  const form = h('div', { class: 'form' },
    h('p', { class: 'hint' }, t('print.hint')),
    row(t('print.mode'), mode), row(t('print.scope'), scope), row(t('print.paper'), paper), row(t('print.orientation'), orientation));
  const ok = await modal({
    title: t('print.title'),
    content: form,
    actions: [
      { label: t('common.cancel'), value: false },
      { label: `🖨️ ${t('print.go')}`, primary: true, value: true },
    ],
  });
  if (!ok) return;
  printSlides(deck, {
    slides: scope.value === 'all' ? deck.slides : [activeSlide()],
    mode: mode.value,
    paper: paper.value,
    orientation: orientation.value,
  });
}
