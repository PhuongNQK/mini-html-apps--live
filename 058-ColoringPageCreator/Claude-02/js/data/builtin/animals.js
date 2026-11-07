/**
 * Built-in gallery: Animals that can be built in the "Build this object" game.
 * Each item has a `recipe`: the parts in build order, drawn from building blocks (see buildingBlocks.js).
 * The finished `svg` is composed from the recipe when the gallery loads (an item may also ship its own `svg`).
 *
 * Part:  { block, x, y, sx, sy, rot, flip, fill, label, z }   (design grid 100x100)
 *   fill  – replaces the block's main colour (null keeps it)
 *   z     – draw order; ears, wings and feet use a low z so they sit behind the body
 */
import { P } from './_recipe.js';

export default {
  category: 'animals',
  items: [
    {
      id: 'animal_fish',
      name: 'Fish',
      fact: 'Fish breathe underwater using gills.',
      recipe: [
        P('blk_oval_wide', 'body', 44, 50, 0.8, 0.9, { fill: '#4ea8de' }),
        P('blk_triangle', 'tail', 80, 50, 0.4, 0.4, { rot: -90, fill: '#ff9f43', z: -1 }),
        P('blk_eye_round', 'eye', 28, 46, 0.22, 0.22, { z: 2 }),
        P('blk_fin', 'top fin', 44, 28, 0.25, 0.25, { z: 3 }),
        P('blk_smile', 'smile', 22, 58, 0.12, 0.12, { z: 4 }),
        P('blk_bubble', 'bubble', 14, 22, 0.14, 0.14, { z: 5 }),
      ],
    },
    {
      id: 'animal_chick',
      name: 'Chick',
      fact: 'A baby chick can walk and peck just hours after it hatches.',
      recipe: [
        P('blk_circle', 'body', 50, 64, 0.78, 0.78, { fill: '#ffd23f' }),
        P('blk_circle', 'head', 50, 32, 0.56, 0.56, { fill: '#ffd23f', z: 1 }),
        P('blk_triangle', 'beak', 50, 40, 0.17, 0.17, { rot: 180, fill: '#ff9f43', z: 3 }),
        P('blk_eye_dot', 'left eye', 42, 29, 0.22, 0.22, { z: 3 }),
        P('blk_eye_dot', 'right eye', 58, 29, 0.22, 0.22, { z: 3 }),
        P('blk_leg', 'left foot', 40, 92, 0.3, 0.22, { fill: '#ff9f43', z: -1 }),
        P('blk_leg', 'right foot', 60, 92, 0.3, 0.22, { fill: '#ff9f43', z: -1 }),
      ],
    },
    {
      id: 'animal_butterfly',
      name: 'Butterfly',
      fact: 'Butterflies taste with their feet.',
      recipe: [
        P('blk_oval_tall', 'body', 50, 54, 0.2, 0.8, { fill: '#5a4a8a', z: 2 }),
        P('blk_circle', 'head', 50, 24, 0.24, 0.24, { fill: '#5a4a8a', z: 3 }),
        P('blk_wing', 'upper left wing', 26, 38, 0.6, 0.62, { rot: 20, flip: true, fill: '#ff8fb1' }),
        P('blk_wing', 'upper right wing', 74, 38, 0.6, 0.62, { rot: -20, fill: '#ff8fb1' }),
        P('blk_wing', 'lower left wing', 32, 68, 0.45, 0.45, { rot: -25, flip: true, fill: '#ffc857' }),
        P('blk_wing', 'lower right wing', 68, 68, 0.45, 0.45, { rot: 25, fill: '#ffc857' }),
        P('blk_whisker', 'left antenna', 40, 10, 0.22, 0.22, { rot: 60, z: 1 }),
        P('blk_whisker', 'right antenna', 60, 10, 0.22, 0.22, { rot: -60, z: 1 }),
      ],
    },
    {
      id: 'animal_bunny',
      name: 'Bunny',
      fact: 'A rabbit’s long ears help it hear danger from far away.',
      recipe: [
        P('blk_oval_tall', 'body', 50, 70, 0.78, 0.8, { fill: '#f4f1f8' }),
        P('blk_circle', 'head', 50, 42, 0.6, 0.6, { fill: '#f4f1f8', z: 1 }),
        P('blk_oval_tall', 'left ear', 38, 14, 0.28, 0.62, { rot: -10, fill: '#f4f1f8', z: -1 }),
        P('blk_oval_tall', 'right ear', 62, 14, 0.28, 0.62, { rot: 10, fill: '#f4f1f8', z: -1 }),
        P('blk_eye_dot', 'left eye', 42, 40, 0.2, 0.2, { z: 3 }),
        P('blk_eye_dot', 'right eye', 58, 40, 0.2, 0.2, { z: 3 }),
        P('blk_nose', 'nose', 50, 48, 0.3, 0.3, { z: 3 }),
        P('blk_smile', 'smile', 50, 55, 0.18, 0.18, { z: 3 }),
        P('blk_circle', 'tail', 76, 86, 0.22, 0.22, { fill: '#ffffff', z: 2 }),
      ],
    },
    {
      id: 'animal_owl',
      name: 'Owl',
      fact: 'Owls can turn their heads almost all the way around.',
      recipe: [
        P('blk_oval_tall', 'body', 50, 56, 0.98, 1.0, { fill: '#a97c50' }),
        P('blk_oval_tall', 'belly', 50, 70, 0.5, 0.52, { fill: '#f1d9b5', z: 1 }),
        P('blk_ear_pointy', 'left tuft', 30, 14, 0.22, 0.28, { rot: -20, fill: '#8a5f3a', z: -1 }),
        P('blk_ear_pointy', 'right tuft', 70, 14, 0.22, 0.28, { rot: 20, fill: '#8a5f3a', z: -1 }),
        P('blk_eye_round', 'left eye', 38, 36, 0.4, 0.4, { z: 3 }),
        P('blk_eye_round', 'right eye', 62, 36, 0.4, 0.4, { z: 3 }),
        P('blk_triangle', 'beak', 50, 48, 0.16, 0.16, { rot: 180, fill: '#ff9f43', z: 4 }),
        P('blk_oval_tall', 'left wing', 20, 62, 0.26, 0.6, { rot: 8, fill: '#8a5f3a', z: 2 }),
        P('blk_oval_tall', 'right wing', 80, 62, 0.26, 0.6, { rot: -8, fill: '#8a5f3a', z: 2 }),
        P('blk_leg', 'feet', 50, 95, 0.5, 0.1, { fill: '#ff9f43', z: -1 }),
      ],
    },
    {
      id: 'animal_cat',
      name: 'Cat',
      fact: 'Cats use their whiskers to feel which spaces they can fit through.',
      recipe: [
        P('blk_oval_tall', 'body', 50, 72, 0.8, 0.86, { fill: '#ff9f43' }),
        P('blk_circle', 'head', 50, 38, 0.66, 0.66, { fill: '#ff9f43', z: 1 }),
        P('blk_ear_pointy', 'left ear', 33, 16, 0.3, 0.3, { rot: -18, fill: '#ff9f43', z: -1 }),
        P('blk_ear_pointy', 'right ear', 67, 16, 0.3, 0.3, { rot: 18, fill: '#ff9f43', z: -1 }),
        P('blk_eye_round', 'left eye', 41, 36, 0.22, 0.22, { z: 3 }),
        P('blk_eye_round', 'right eye', 59, 36, 0.22, 0.22, { z: 3 }),
        P('blk_nose', 'nose', 50, 44, 0.26, 0.26, { z: 3 }),
        P('blk_smile', 'smile', 50, 50, 0.2, 0.2, { z: 3 }),
        P('blk_whisker', 'left whisker', 27, 46, 0.2, 0.2, { rot: 10, z: 3 }),
        P('blk_whisker', 'right whisker', 73, 46, 0.2, 0.2, { rot: -10, z: 3 }),
        P('blk_oval_tall', 'tail', 82, 84, 0.2, 0.5, { rot: 40, fill: '#ff9f43', z: -1 }),
      ],
    },
  ],
};
