/** Built-in gallery: Vehicles (recipes made of building blocks). */
import { P } from './_recipe.js';

export default {
  category: 'vehicles',
  items: [
    {
      id: 'vehicle_car',
      name: 'Car',
      fact: 'The first cars had no roof and no windscreen.',
      recipe: [
        P('blk_rect', 'body', 50, 62, 0.95, 0.6, { fill: '#ff5d73' }),
        P('blk_semicircle', 'cabin', 50, 44, 0.55, 0.6, { fill: '#8ec5ff', z: -1 }),
        P('blk_circle', 'back wheel', 28, 78, 0.28, 0.28, { fill: '#2b2b3b', z: 1 }),
        P('blk_circle', 'front wheel', 72, 78, 0.28, 0.28, { fill: '#2b2b3b', z: 1 }),
        P('blk_circle', 'back hub', 28, 78, 0.12, 0.12, { fill: '#cfd6dd', z: 2 }),
        P('blk_circle', 'front hub', 72, 78, 0.12, 0.12, { fill: '#cfd6dd', z: 2 }),
        P('blk_circle', 'headlight', 86, 58, 0.1, 0.1, { fill: '#ffd23f', z: 2 }),
      ],
    },
    {
      id: 'vehicle_boat',
      name: 'Sailboat',
      fact: 'Sailboats move by catching the wind in their sails.',
      recipe: [
        P('blk_semicircle', 'hull', 50, 70, 1.0, 0.9, { rot: 180, fill: '#a0522d' }),
        P('blk_leg', 'mast', 50, 40, 0.1, 0.8, { fill: '#6b4423', z: -1 }),
        P('blk_triangle', 'big sail', 62, 40, 0.7, 0.85, { fill: '#ffffff', z: 1 }),
        P('blk_triangle', 'small sail', 36, 50, 0.4, 0.55, { fill: '#ffd23f', z: 1 }),
      ],
    },
    {
      id: 'vehicle_rocket',
      name: 'Rocket',
      fact: 'A rocket has to go very fast, about 28,000 km/h, to reach orbit.',
      recipe: [
        P('blk_oval_tall', 'body', 50, 50, 0.6, 1.0, { fill: '#e3e8f0' }),
        P('blk_triangle', 'nose', 50, 14, 0.4, 0.4, { fill: '#ff5d73', z: 1 }),
        P('blk_circle', 'window', 50, 42, 0.26, 0.26, { fill: '#8ec5ff', z: 2 }),
        P('blk_triangle', 'left fin', 33, 80, 0.3, 0.4, { rot: -20, fill: '#ff5d73', z: -1 }),
        P('blk_triangle', 'right fin', 67, 80, 0.3, 0.4, { rot: 20, fill: '#ff5d73', z: -1 }),
        P('blk_triangle', 'flame', 50, 94, 0.22, 0.3, { rot: 180, fill: '#ffb703', z: -2 }),
      ],
    },
  ],
};
