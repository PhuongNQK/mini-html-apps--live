/** Bottom strip: slide thumbnails plus add / duplicate / rename / move / delete. */
import { bus, state, setActiveSlide } from '../core/store.js';
import { debounce, h } from '../core/util.js';
import { t } from '../core/i18n.js';
import { slideSvg } from '../svg/render.js';
import * as cmd from '../editor/commands.js';
import { promptText } from './dialog.js';

export function initSlidesPanel(root) {
  const strip = h('div', { class: 'slide-strip', role: 'listbox', 'aria-label': t('slides.title') });
  const tools = h('div', { class: 'slide-tools' });
  root.replaceChildren(tools, strip);

  const btn = (icon, key, onClick, disabled = false) =>
    h('button', { type: 'button', class: 'mini-btn big', title: t(key), 'aria-label': t(key), disabled, onClick }, icon);

  async function rename(slide) {
    const name = await promptText({ title: t('slides.rename'), label: t('slides.nameLabel'), value: slide.name });
    if (name) cmd.renameSlide(slide.id, name);
  }

  function render() {
    const deck = state.deck;
    if (!deck) return;
    const index = deck.slides.findIndex((s) => s.id === state.slideId);
    tools.replaceChildren(
      h('span', { class: 'slide-count' }, t('slides.count', { current: index + 1, total: deck.slides.length })),
      btn('➕', 'slides.add', cmd.addSlide),
      btn('📑', 'slides.duplicate', cmd.duplicateSlide),
      btn('✏️', 'slides.rename', () => rename(deck.slides[index])),
      btn('◀', 'slides.moveLeft', () => cmd.moveSlide(-1), index === 0),
      btn('▶', 'slides.moveRight', () => cmd.moveSlide(1), index === deck.slides.length - 1),
      btn('🗑️', 'slides.delete', cmd.deleteSlide, deck.slides.length <= 1),
    );
    // Thumbnails keep the slide's own proportions (portrait slides get tall, narrow thumbnails).
    const ratio = deck.width / deck.height;
    let th = matchMedia('(max-width: 900px)').matches ? 52 : 70;
    let tw = th * ratio;
    if (tw > 200) [tw, th] = [200, 200 / ratio];
    strip.replaceChildren(
      ...deck.slides.map((slide, i) =>
        h('div', {
          class: `slide-thumb ${slide.id === state.slideId ? 'active' : ''}`,
          role: 'option',
          'aria-selected': slide.id === state.slideId,
          tabindex: 0,
          title: slide.name,
          onClick: () => setActiveSlide(slide.id),
          onDblclick: () => rename(slide),
          onKeydown: (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setActiveSlide(slide.id)),
        },
          h('div', { class: 'thumb-art', style: `width:${Math.round(tw)}px;height:${Math.round(th)}px`, html: slideSvg(slide, deck, { responsive: true }) }),
          h('div', { class: 'thumb-name' }, `${i + 1}. ${slide.name}`),
        ),
      ),
    );
    strip.querySelector('.active')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  const lazy = debounce(render, 120);
  bus.on('deck', lazy);
  bus.on('slide', render);
  bus.on('view', lazy);
  bus.on('deckLoaded', render);
  render();
  return { rebuild: render };
}
