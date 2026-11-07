/** Built-in gallery: Houses (recipes made of building blocks). */
import { P } from './_recipe.js';

export default {
  category: 'houses',
  items: [
    {
      id: 'house_cottage',
      name: 'Cottage',
      fact: 'Roofs are slanted so rain and snow can slide off.',
      recipe: [
        P('blk_square', 'wall', 50, 68, 0.8, 0.8, { fill: '#ffd9a8' }),
        P('blk_triangle', 'roof', 50, 32, 1.15, 0.65, { fill: '#e4572e', z: 1 }),
        P('blk_rect', 'door', 50, 80, 0.22, 0.5, { fill: '#a0522d', z: 2 }),
        P('blk_square', 'left window', 33, 62, 0.2, 0.2, { fill: '#8ec5ff', z: 2 }),
        P('blk_square', 'right window', 67, 62, 0.2, 0.2, { fill: '#8ec5ff', z: 2 }),
        P('blk_rect', 'chimney', 72, 18, 0.2, 0.45, { fill: '#a0522d', z: 0 }),
      ],
    },
    {
      id: 'house_igloo',
      name: 'Igloo',
      fact: 'Igloos are built from blocks of packed snow.',
      recipe: [
        P('blk_semicircle', 'dome', 50, 54, 1.15, 1.15, { fill: '#e3f6ff' }),
        P('blk_semicircle', 'door', 50, 72, 0.4, 0.5, { fill: '#6c7a89', z: 1 }),
        P('blk_whisker', 'upper snow line', 50, 40, 0.5, 0.5, { z: 1 }),
        P('blk_whisker', 'lower snow line', 50, 52, 0.7, 0.7, { z: 1 }),
      ],
    },
  ],
};
