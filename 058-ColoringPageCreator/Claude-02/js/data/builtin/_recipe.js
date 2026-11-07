/** Shorthand used by the recipe galleries: P(block, label, x, y, sx, sy, {rot, flip, fill, z}). */
export const P = (block, label, x, y, sx, sy, { rot = 0, flip = false, fill = null, z = 0 } = {}) => ({ block, label, x, y, sx, sy, rot, flip, fill, z });
