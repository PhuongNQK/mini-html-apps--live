/** Built-in gallery: Flora – plants and flowers (recipes made of building blocks). */
import { P } from './_recipe.js';

export default {
  category: 'flora',
  items: [
    {
      id: 'flora_flower',
      name: 'Flower',
      fact: 'Sunflowers turn their faces to follow the sun.',
      recipe: [
        P('blk_leg', 'stem', 50, 72, 0.14, 0.62, { fill: '#6bcb77', z: -1 }),
        P('blk_circle', 'top petal', 50, 14, 0.27, 0.27, { fill: '#ff8fb1' }),
        P('blk_circle', 'right petal', 66, 26, 0.27, 0.27, { fill: '#ff8fb1' }),
        P('blk_circle', 'bottom right petal', 60, 45, 0.27, 0.27, { fill: '#ff8fb1' }),
        P('blk_circle', 'bottom left petal', 40, 45, 0.27, 0.27, { fill: '#ff8fb1' }),
        P('blk_circle', 'left petal', 34, 26, 0.27, 0.27, { fill: '#ff8fb1' }),
        P('blk_circle', 'center', 50, 31, 0.26, 0.26, { fill: '#ffd23f', z: 1 }),
        P('blk_wing', 'left leaf', 36, 74, 0.34, 0.3, { rot: -25, flip: true, fill: '#6bcb77', z: 0 }),
        P('blk_wing', 'right leaf', 64, 66, 0.34, 0.3, { rot: -25, fill: '#6bcb77', z: 0 }),
      ],
    },
    {
      id: 'flora_apple_tree',
      name: 'Apple tree',
      fact: 'An apple tree can grow apples for more than 50 years.',
      recipe: [
        P('blk_leg', 'trunk', 50, 76, 0.42, 0.5, { fill: '#a0522d', z: -1 }),
        P('blk_circle', 'big crown', 50, 36, 0.8, 0.8, { fill: '#6bcb77' }),
        P('blk_circle', 'left crown', 28, 50, 0.5, 0.5, { fill: '#5bbd68', z: -0.5 }),
        P('blk_circle', 'right crown', 72, 50, 0.5, 0.5, { fill: '#5bbd68', z: -0.5 }),
        P('blk_circle', 'apple one', 40, 30, 0.12, 0.12, { fill: '#ff5d73', z: 1 }),
        P('blk_circle', 'apple two', 60, 40, 0.12, 0.12, { fill: '#ff5d73', z: 1 }),
        P('blk_circle', 'apple three', 34, 52, 0.12, 0.12, { fill: '#ff5d73', z: 1 }),
      ],
    },
  ],
};
