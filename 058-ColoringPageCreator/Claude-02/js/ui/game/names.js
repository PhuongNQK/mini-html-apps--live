/** Spoken/printed names for blocks, parts and colours (all go through i18n so they can be translated). */
import { t, has } from '../../core/i18n.js';
import { gallery } from '../../services/gallery.js';
import { slug } from '../../core/util.js';

/** "triangle" / "triangles". Override plurals with i18n key  block.<id>.plural. */
export function blockName(id, n = 1) {
  const item = gallery.get(id);
  const base = (item ? gallery.displayName(item) : id).toLowerCase();
  if (n === 1) return base;
  return has(`block.${id}.plural`) ? t(`block.${id}.plural`) : `${base}s`;
}

export const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

/** Part labels such as "left ear" can be translated with  part.<slug>  keys. */
export function partLabel(label) {
  if (!label) return '';
  const key = `part.${slug(label)}`;
  return has(key) ? t(key) : label;
}

/** "2 triangles, 1 circle" */
export function countList(counts) {
  return [...counts].map(([id, n]) => `${n} ${blockName(id, n)}`).join(', ');
}
