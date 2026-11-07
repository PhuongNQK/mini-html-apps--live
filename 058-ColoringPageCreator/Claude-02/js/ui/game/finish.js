/** Celebration screen: shows the finished object, what the child learned, and what to do next. */
import { state } from '../../core/store.js';
import { h } from '../../core/util.js';
import { t, has } from '../../core/i18n.js';
import { monochrome } from '../../svg/render.js';
import { blockCounts, colorKey, dominantColor } from '../../game/recipe.js';
import { gallery } from '../../services/gallery.js';
import { speak } from '../../game/audio.js';
import { viewAround } from './board.js';
import { countList } from './names.js';

/**
 * @param {{host:HTMLElement, name:string, svg:string, bbox:object, recipe:object[], fact?:string, revealed?:boolean,
 *          actions:{label:string, primary?:boolean, onClick:()=>void}[]}} o
 */
export function showFinish({ host, name, svg, bbox, recipe, fact, revealed = false, generic = false, actions }) {
  const { mode, mono } = state.deck.view;
  const v = viewAround(bbox, 0.08);
  const art = mode === 'uncolored' ? monochrome(svg, mono) : svg;

  const counts = blockCounts(recipe);
  const others = recipe.filter((p) => !p.block).length; // pieces taken from other gallery objects
  const color = dominantColor(recipe, (id) => gallery.get(id));
  const colorName = color && has(`color.name.${colorKey(color)}`) ? t(`color.name.${colorKey(color)}`) : null;

  const title = generic ? t('game.builtGeneric') : revealed ? t('game.revealed', { name }) : t('game.built', { name });
  const colorText = (c) => (generic ? t('game.colorGeneric', { color: c }) : t('game.colorLine', { name, color: c }));
  const lines = [
    h('p', { class: 'fin-count' }, `🧱 ${t('game.used', { n: recipe.length, list: [countList(counts), others ? t('game.otherPieces', { n: others }) : ''].filter(Boolean).join(', ') })}`),
    fact ? h('p', { class: 'fin-fact' }, `💡 ${fact}`) : null,
    colorName ? h('p', { class: 'fin-color' }, `🎨 ${colorText(colorName)}`) : null,
  ];

  const confetti = Array.from({ length: 36 }, (_, i) => {
    const s = h('i', { class: 'confetti' });
    s.style.cssText = `left:${Math.random() * 100}%;animation-delay:${Math.random() * 1.2}s;animation-duration:${2.4 + Math.random() * 2}s;--c:${['#ffd23f', '#ff6b8b', '#4ea8de', '#6bcb77', '#a78bfa', '#ff9f43'][i % 6]}`;
    return s;
  });

  const el = h('div', { class: 'game-finish', role: 'dialog', 'aria-label': title },
    h('div', { class: 'confetti-layer', 'aria-hidden': 'true' }, confetti),
    h('div', { class: 'fin-card' },
      h('h2', {}, `🎉 ${title}`),
      h('div', { class: 'fin-art', html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${v.x} ${v.y} ${v.w} ${v.h}">${art}</svg>` }),
      ...lines,
      h('div', { class: 'fin-actions' },
        actions.map((a) => h('button', { type: 'button', class: `btn ${a.primary ? 'btn-primary' : ''}`, onClick: a.onClick }, a.label))),
    ),
  );
  host.append(el);
  el.querySelector('button.btn-primary')?.focus();
  speak([title, fact, colorName ? colorText(colorName) : ''].filter(Boolean).join(' '));
  return { close: () => el.remove() };
}
