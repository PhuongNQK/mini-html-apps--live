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

const NON_DRAWING = new Set(['defs', 'style', 'title', 'desc', 'metadata']);

/** Top-level drawable shapes of an svg fragment (single wrapper groups without a transform are looked through). */
export function svgParts(svg) {
  const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`, 'image/svg+xml');
  let kids = [...doc.documentElement.children].filter((e) => !NON_DRAWING.has(e.localName));
  while (kids.length === 1 && kids[0].localName === 'g' && !kids[0].hasAttribute('transform')) {
    kids = [...kids[0].children].filter((e) => !NON_DRAWING.has(e.localName));
  }
  return kids;
}

export const countSvgParts = (svg) => Math.max(1, svgParts(svg).length);
// Any well-formed code is a valid category: unknown ones are detected and shown automatically.
const CATEGORY_RE = /^[A-Za-z][A-Za-z0-9_-]{0,31}$/;
const USER_KEY = 'gallery.user';
const OVERRIDES_KEY = 'gallery.overrides';

const yieldToBrowser = () => (globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((r) => setTimeout(r)));

class GalleryService extends Emitter {
  #items = new Map();
  #overrides = { names: {}, deleted: [] };
  #loading = { active: false, done: 0, total: 0 };
  ready = Promise.resolve();

  /**
   * Starts the gallery. Returns as soon as the user's own items are available; the built-in and file
   * galleries keep loading in the background, one after another, and the service emits "change"
   * after each one (and "progress" with the counters in `loading`). Use `ready` to await the end.
   */
  async init(config) {
    this.#overrides = { names: {}, deleted: [], ...local.get(OVERRIDES_KEY, {}) };
    for (const item of local.get(USER_KEY, [])) this.#items.set(item.id, item);

    // Start every download now so they overlap while earlier galleries are being processed.
    const downloads = config.galleries.map((path) =>
      fetch(path, { cache: 'no-cache' })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .catch((err) => (console.warn(`Gallery "${path}" could not be loaded`, err), null)),
    );
    this.#loading = { active: true, done: 0, total: BUILTIN_GALLERIES.length + downloads.length };
    this.ready = this.#loadAll(downloads);
  }

  get loading() {
    return this.#loading;
  }

  async #loadAll(downloads) {
    const finished = () => {
      this.#loading.done += 1;
      this.#resolveRecipes();
      this.emit('progress');
      this.emit('change');
    };
    try {
      for (const g of BUILTIN_GALLERIES) {
        await this.#addManyAsync(g.items, g.category, 'builtin');
        finished();
      }
      for (const download of downloads) {
        const data = await download;
        if (data) {
          const list = Array.isArray(data) ? data : data.items;
          await this.#addManyAsync(list, (!Array.isArray(data) && data.category) || 'props', 'file');
        }
        finished();
      }
      this.#resolveRecipes(true);
      this.auditCustom(); // repairs stale part counts (needs every block to be loaded)
    } finally {
      this.#loading.active = false;
      this.emit('progress');
      this.emit('change');
    }
  }

  /** Recipe items without their own svg are drawn from their blocks as soon as those blocks are loaded. */
  #resolveRecipes(final = false) {
    for (const item of [...this.#items.values()]) {
      if (!item.pending) continue;
      const composed = composeRecipe(item.recipe, (id) => this.#items.get(id)?.pending ? null : this.#items.get(id));
      if (!composed) {
        if (final) {
          console.warn(`Recipe "${item.id}" uses a missing block – skipped`);
          this.#items.delete(item.id);
        }
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
        line: /^#[0-9a-f]{6}$/i.test(p.line || '') ? p.line.toLowerCase() : null,
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

  /** Same as #addMany but gives the browser a turn every few milliseconds so the app stays responsive. */
  async #addManyAsync(list, defaultCategory, source) {
    let sliceStart = performance.now();
    let lastEmit = sliceStart;
    for (const raw of list || []) {
      try {
        const item = this.#normalize(raw, defaultCategory, source);
        this.#items.set(item.id, item);
      } catch (err) {
        console.warn('Skipped invalid gallery item', raw?.id, err);
      }
      const now = performance.now();
      if (now - sliceStart > 12) {
        if (now - lastEmit > 300) {
          this.emit('change'); // big galleries show up in steps too
          lastEmit = now;
        }
        await yieldToBrowser();
        sliceStart = performance.now();
      }
    }
  }

  #normalize(raw, defaultCategory, source) {
    const hasRecipe = Array.isArray(raw?.recipe) && raw.recipe.length > 0;
    if (typeof raw?.svg !== 'string' || !raw.svg.trim()) {
      if (!hasRecipe) throw new Error('missing svg');
      raw = { ...raw, svg: '<g/>', prepared: false, pending: true };
    }
    const category = typeof raw.category === 'string' && CATEGORY_RE.test(raw.category) ? raw.category : defaultCategory;
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
    const item = this.#items.get(id);
    return item?.pending ? undefined : item;
  }

  isDeleted(id) {
    return this.#overrides.deleted.includes(id);
  }

  all() {
    return [...this.#items.values()].filter((i) => !i.pending && !this.isDeleted(i.id));
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

  /**
   * Categories to show: the built-in ones in their usual order, then any category found in the loaded
   * galleries that the app does not know. Detected ones use their first shape as logo.
   */
  categories() {
    const items = this.all();
    const known = new Set(CATEGORIES.map((c) => c.code));
    const extra = [];
    for (const i of items) if (!known.has(i.category) && !extra.some((c) => c.code === i.category)) extra.push({ code: i.category, icon: '🔹', logo: i });
    const custom = CATEGORIES.filter((c) => c.code === 'custom');
    return [...CATEGORIES.filter((c) => c.code !== 'custom'), ...extra, ...custom];
  }

  /** Display name of a category (translated when a key exists, otherwise made readable from the code). */
  categoryLabel(code) {
    const key = `category.${code}`;
    if (has(key)) return t(key);
    return code.replace(/[-_]+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
  }

  /**
   * Scans the Custom category and repairs derived building-block data:
   *  - items with a recipe: part count, block counts and difficulty are recomputed from the recipe
   *    (a recipe that uses blocks which no longer exist is dropped; the picture stays);
   *  - items without a recipe: the part count is the number of top-level shapes in the drawing.
   * @returns {{checked:number, fixed:{id:string,name:string,before:number|null,after:number,note?:string}[]}}
   */
  auditCustom() {
    const fixed = [];
    const list = this.customItems();
    for (const item of list) {
      const before = item.partCount ?? null;
      let note = '';
      if (item.recipe?.length) {
        if (!item.recipe.every((p) => this.get(p.block))) {
          delete item.recipe;
          delete item.blocksUsed;
          delete item.difficulty;
          note = 'recipe used missing blocks';
          item.partCount = countSvgParts(item.svg);
        } else {
          const recipe = GalleryService.cleanRecipe(item.recipe);
          item.recipe = recipe;
          item.partCount = recipe.length;
          item.blocksUsed = Object.fromEntries(blockCounts(recipe));
          item.difficulty = difficultyOf(recipe.length);
        }
      } else item.partCount = countSvgParts(item.svg);
      if (before !== item.partCount || note) fixed.push({ id: item.id, name: item.name, before, after: item.partCount, note });
    }
    if (fixed.length) this.#changed(true);
    return { checked: list.length, fixed };
  }

  /** Building blocks, in gallery order. */
  blocks() {
    return this.all().filter((i) => i.category === 'buildingBlocks');
  }

  /** Items the "Build this object" game can use (they have a recipe). */
  recipes() {
    return this.all().filter((i) => i.recipe?.length && !i.pending && i.recipe.every((p) => this.get(p.block)));
  }

  customItems() {
    return this.all().filter((i) => i.source === 'user');
  }

  get deletedCount() {
    return this.#overrides.deleted.filter((id) => this.#items.has(id)).length;
  }

  /* ---------- changes ---------- */

  /** Saves a slide object/group (markup already baked) into the Custom category. */
  addCustom({ name, svg, bbox = null, recipe = null, partCount = null }) {
    const prepared = bbox ? { svg, bbox } : prepareSvg(svg);
    const item = { id: uid('custom'), name, category: 'custom', svg: prepared.svg, bbox: prepared.bbox, source: 'user', prepared: true, created: Date.now() };
    // Only recipes made purely of building blocks can be played as a puzzle.
    if (recipe && recipe.every((p) => typeof p.block === 'string' && !p.svg)) this.#attachRecipe(item, { recipe });
    if (partCount) item.partCount = item.recipe ? item.partCount : partCount;
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
    if (userChanged) local.set(USER_KEY, this.customItems().map(({ id, name, category, svg, bbox, source, prepared, created, recipe, fact, partCount }) => ({ id, name, category, svg, bbox, source, prepared, created, recipe, fact, partCount })));
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
    this.#resolveRecipes(!this.#loading.active);
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
      this.#resolveRecipes(!this.#loading.active);
      if (added) this.#changed(true);
      return added;
    } catch {
      return 0;
    }
  }
}

export const gallery = new GalleryService();
