/** Dropdown menu + generic popover, closed by outside click or Escape. */
import { h } from '../core/util.js';

let openPopover = null;

export function closePopover() {
  openPopover?.remove();
  openPopover = null;
}

/** Shows `content` anchored below `anchor`. */
export function showPopover(anchor, content, { className = '' } = {}) {
  closePopover();
  const pop = h('div', { class: `popover ${className}` }, content);
  document.body.append(pop);
  const r = anchor.getBoundingClientRect();
  const w = pop.offsetWidth;
  const hgt = pop.offsetHeight;
  pop.style.left = `${Math.max(8, Math.min(r.left, innerWidth - w - 8))}px`;
  const below = r.bottom + 6;
  pop.style.top = `${below + hgt > innerHeight - 8 ? Math.max(8, r.top - hgt - 6) : below}px`;
  openPopover = pop;
  setTimeout(() => {
    const off = (e) => {
      if (pop.contains(e.target) || anchor.contains(e.target)) return;
      closePopover();
      document.removeEventListener('pointerdown', off, true);
    };
    document.addEventListener('pointerdown', off, true);
  });
  return pop;
}

document.addEventListener('keydown', (e) => e.key === 'Escape' && closePopover());

/**
 * items: [{label, icon?, onClick?, disabled?, checked?, separator?}]
 */
export function showMenu(anchor, items) {
  const list = h('div', { class: 'menu', role: 'menu' },
    items.map((item) =>
      item.separator
        ? h('hr', {})
        : h('button', {
            type: 'button',
            role: 'menuitem',
            class: `menu-item ${item.checked ? 'checked' : ''}`,
            disabled: item.disabled,
            onClick: () => {
              closePopover();
              item.onClick?.();
            },
          }, h('span', { class: 'menu-icon' }, item.checked ? '✔' : item.icon || ''), h('span', {}, item.label)),
    ),
  );
  return showPopover(anchor, list, { className: 'popover-menu' });
}
