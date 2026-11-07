/**
 * Gallery service: loads the built-in galleries, the extra galleries listed in
 * meta/config.json, and the user's own (custom) items; handles search, rename, delete,
 * export and import.
 *
 * Item shape:  { id, name, category, svg, bbox:{x,y,w,h}, source:'builtin'|'file'|'user' }
 */
import { Emitter } from '../core/events.js';
import { uid } from '../core/util.js';
import { has, t } from '../core/i18n.js';
import { prepareSvg } from '../svg/annotate.js';
import { BUILTIN_GALLERIES, CATEGORIES } from '../data/builtin/index.js';
import { local } from './storage.js';
import { workdir } from './workdir.js';
import { composeRecipe, difficultyOf, blockCounts } from '../game/recipe.js';

export const GALLERY_FORMAT = 'magic-color-gallery';
const CATEGORY_CODES = new Set(CATEGORIES.map((c) => c.code));
const USER_KEY = 'gallery.user';
const OVERRIDES_KEY = 'gallery.overrides';

class GalleryService extends Emitter {
  #items = new Map();
  #overrides = { names: {}, deleted: [] };

  async init(config) {
    for (const g of BUILTIN_GALLERIES) this.#addMany(g.items, g.category, 'builtin');

    for (const path of config.galleries) {
      try {
        const res = await fetch(path, { cache: 'no-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.items;
        this.#addMany(list, (!Array.isArray(data) && data.category) || 'props', 'file');
      } catch (err) {
        console.warn(`Gallery "${path}" could not be loaded`, err);
      }
    }

    this.#overrides = { names: {}, deleted: [], ...local.get(OVERRIDES_KEY, {}) };
    for (const item of local.get(USER_KEY, [])) this.#items.set(item.id, item);
    this.#resolveRecipes();
  }

  /** Recipe items without their own svg are drawn from their blocks once every gallery is loaded. */
  #resolveRecipes() {
    for (const item of [...this.#items.values()]) {
      if (!item.pending) continue;
      const composed = composeRecipe(item.recipe, (id) => this.#items.get(id));
      if (!composed) {
        console.warn(`Recipe "${item.id}" uses a missing block – skipped`);
        this.#items.delete(item.id);
        continue;
      }
      const prepared = prepareSvg(composed);
      item.svg = composed;
      item.bbox = prepared.bbox;
      delete item.pending;
    }
  }

  /** Validated copy of a recipe, or null. */
  static cleanRecipe(list) {
    if (!Array.isArray(list)) return null;
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const parts = list
      .filter((p) => p && typeof p.block === 'string')
      .map((p) => ({
        block: p.block,
        x: num(p.x, 50),
        y: num(p.y, 50),
        sx: num(p.sx, 1) || 1,
        sy: num(p.sy, 1) || 1,
        rot: num(p.rot, 0),
        flip: !!p.flip,
        fill: /^#[0-9a-f]{6}$/i.test(p.fill || '') ? p.fill.toLowerCase() : null,
        label: typeof p.label === 'string' ? p.label.slice(0, 40) : '',
        z: num(p.z, 0),
      }));
    return parts.length ? parts : null;
  }

  /** Copies the game fields of a raw entry onto a normalised item. */
  #attachRecipe(item, raw) {
    const recipe = GalleryService.cleanRecipe(raw.recipe);
    if (!recipe) return;
    item.recipe = recipe;
    item.partCount = recipe.length;
    item.difficulty = ['easy', 'medium', 'hard'].includes(raw.difficulty) ? raw.difficulty : difficultyOf(recipe.length);
    item.blocksUsed = Object.fromEntries(blockCounts(recipe));
    if (typeof raw.fact === 'string' && raw.fact.trim()) item.fact = raw.fact.trim().slice(0, 200);
  }

  /** Normalises raw gallery entries (sanitises SVG, measures bbox) and stores them. */
  #addMany(list, defaultCategory, source) {
    for (const raw of list || []) {
      try {
        const item = this.#normalize(raw, defaultCategory, source);
        this.#items.set(item.id, item);
      } catch (err) {
        console.warn('Skipped invalid gallery item', raw?.id, err);
      }
    }
  }

  #normalize(raw, defaultCategory, source) {
    const hasRecipe = Array.isArray(raw?.recipe) && raw.recipe.length > 0;
    if (typeof raw?.svg !== 'string' || !raw.svg.trim()) {
      if (!hasRecipe) throw new Error('missing svg');
      raw = { ...raw, svg: '<g/>', prepared: false, pending: true };
    }
    const category = CATEGORY_CODES.has(raw.category) ? raw.category : defaultCategory;
    const prepared = raw.prepared && raw.bbox ? { svg: raw.svg, bbox: raw.bbox } : prepareSvg(raw.svg, { noPad: category === 'backgrounds' });
    const item = {
      id: String(raw.id || uid('gal')),
      name: String(raw.name || 'Untitled'),
      category,
      svg: prepared.svg,
      bbox: prepared.bbox,
      source,
      prepared: true,
    };
    if (raw.pending) item.pending = true;
    this.#attachRecipe(item, raw);
    return item;
  }

  /* ---------- queries ---------- */

  displayName(item) {
    const renamed = this.#overrides.names[item.id];
    if (renamed) return renamed;
    return has(`gallery.item.${item.id}`) ? t(`gallery.item.${item.id}`) : item.name;
  }

  get(id) {
    return this.#items.get(id);
  }

  isDeleted(id) {
    return this.#overrides.deleted.includes(id);
  }

  all() {
    return [...this.#items.values()].filter((i) => !this.isDeleted(i.id));
  }

  /** Items in `category` (or all) whose name contains `query` (case-insensitive). */
  search(query = '', category = 'all') {
    const q = query.trim().toLowerCase();
    return this.all().filter(
      (i) => (category === 'all' || i.category === category) && (!q || this.displayName(i).toLowerCase().includes(q) || i.name.toLowerCase().includes(q)),
    );
  }

  count(category) {
    return this.all().filter((i) => i.category === category).length;
  }

  /** Building blocks, in gallery order. */
  blocks() {
    return this.all().filter((i) => i.category === 'buildingBlocks');
  }

  /** Items the "Build this object" game can use (they have a recipe). */
  recipes() {
    return this.all().filter((i) => i.recipe?.length && !i.pending);
  }

  customItems() {
    return this.all().filter((i) => i.source === 'user');
  }

  get deletedCount() {
    return this.#overrides.deleted.filter((id) => this.#items.has(id)).length;
  }

  /* ---------- changes ---------- */

  /** Saves a slide object/group (markup already baked) into the Custom category. */
  addCustom({ name, svg, bbox = null, recipe = null }) {
    const prepared = bbox ? { svg, bbox } : prepareSvg(svg);
    const item = { id: uid('custom'), name, category: 'custom', svg: prepared.svg, bbox: prepared.bbox, source: 'user', prepared: true, created: Date.now() };
    if (recipe) this.#attachRecipe(item, { recipe });
    this.#items.set(item.id, item);
    this.#changed(true);
    return item;
  }

  rename(id, name) {
    const item = this.#items.get(id);
    if (!item || !name.trim()) return;
    if (item.source === 'user') item.name = name.trim();
    else this.#overrides.names[id] = name.trim();
    this.#changed(item.source === 'user', true);
  }

  remove(id) {
    const item = this.#items.get(id);
    if (!item) return;
    if (item.source === 'user') this.#items.delete(id);
    else if (!this.isDeleted(id)) this.#overrides.deleted.push(id);
    this.#changed(item.source === 'user', true);
  }

  restoreDeleted() {
    this.#overrides.deleted = [];
    this.#changed(false, true);
  }

  #changed(userChanged, overridesChanged = false) {
    if (userChanged) local.set(USER_KEY, this.customItems().map(({ id, name, category, svg, bbox, source, prepared, created, recipe, fact }) => ({ id, name, category, svg, bbox, source, prepared, created, recipe, fact })));
    if (overridesChanged) local.set(OVERRIDES_KEY, this.#overrides);
    this.emit('change');
    if (userChanged) this.emit('userChange');
  }

  /* ---------- import / export ---------- */

  /**
   * @param {'custom'|'all'|'selected'} scope
   * @param {string[]} ids  used for 'selected'
   */
  exportText(scope, ids = []) {
    const pool = scope === 'custom' ? this.customItems() : scope === 'selected' ? this.all().filter((i) => ids.includes(i.id)) : this.all();
    const items = pool.map((i) => ({ id: i.id, name: this.displayName(i), category: i.category, svg: i.svg, bbox: i.bbox, prepared: true, recipe: i.recipe, fact: i.fact }));
    return JSON.stringify({ format: GALLERY_FORMAT, version: 1, exported: new Date().toISOString(), items });
  }

  /** Imports items from a gallery file; they become Custom items. Returns the count added. */
  importText(text) {
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('invalid');
    }
    const list = Array.isArray(data) ? data : data?.items;
    if (!Array.isArray(list)) throw new Error('invalid');
    let added = 0;
    for (const raw of list) {
      try {
        const clean = this.#normalize({ ...raw, prepared: false }, 'custom', 'user');
        // Avoid clobbering an existing item with the same id.
        clean.id = this.#items.has(clean.id) ? uid('custom') : clean.id;
        clean.category = 'custom';
        this.#items.set(clean.id, clean);
        added++;
      } catch (err) {
        console.warn('Skipped invalid gallery item while importing', err);
      }
    }
    this.#resolveRecipes();
    if (added) this.#changed(true);
    return added;
  }

  /* ---------- Working Directory mirror ---------- */

  async syncToWorkdir() {
    if (!workdir.active) return;
    try {
      await workdir.writeGallery(this.exportText('custom'));
    } catch (err) {
      console.warn('Could not mirror gallery to the working directory', err);
    }
  }

  /** Merges custom items found in the Working Directory into the gallery. */
  async loadFromWorkdir() {
    if (!workdir.active) return 0;
    const text = await workdir.readGallery();
    if (!text) return 0;
    try {
      const data = JSON.parse(text);
      let added = 0;
      for (const raw of data.items || []) {
        if (this.#items.has(raw.id)) continue;
        try {
          const clean = this.#normalize({ ...raw, prepared: false }, 'custom', 'user');
          clean.category = 'custom';
          this.#items.set(clean.id, clean);
          added++;
        } catch { /* skip */ }
      }
      this.#resolveRecipes();
      if (added) this.#changed(true);
      return added;
    } catch {
      return 0;
    }
  }
}

export const gallery = new GalleryService();
