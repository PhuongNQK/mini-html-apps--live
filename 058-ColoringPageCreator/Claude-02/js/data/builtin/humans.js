/** Built-in gallery: Humans (recipes made of building blocks). */
import { P } from './_recipe.js';

export default {
  category: 'humans',
  items: [
    {
      id: 'human_boy',
      name: 'Boy',
      fact: 'Your heart is about as big as your fist.',
      recipe: [
        P('blk_circle', 'head', 50, 24, 0.38, 0.38, { fill: '#ffd9b3', z: 1 }),
        P('blk_semicircle', 'hair', 50, 17, 0.4, 0.4, { fill: '#6b4423', z: 2 }),
        P('blk_eye_dot', 'left eye', 44, 25, 0.12, 0.12, { z: 3 }),
        P('blk_eye_dot', 'right eye', 56, 25, 0.12, 0.12, { z: 3 }),
        P('blk_smile', 'smile', 50, 32, 0.12, 0.12, { z: 3 }),
        P('blk_oval_tall', 'body', 50, 58, 0.5, 0.55, { fill: '#4ea8de' }),
        P('blk_oval_tall', 'left arm', 31, 58, 0.16, 0.42, { rot: 14, fill: '#ffd9b3', z: -1 }),
        P('blk_oval_tall', 'right arm', 69, 58, 0.16, 0.42, { rot: -14, fill: '#ffd9b3', z: -1 }),
        P('blk_leg', 'left leg', 43, 87, 0.3, 0.4, { fill: '#2f4b8a', z: -1 }),
        P('blk_leg', 'right leg', 57, 87, 0.3, 0.4, { fill: '#2f4b8a', z: -1 }),
      ],
    },
    {
      id: 'human_girl',
      name: 'Girl',
      fact: 'Smiling uses fewer muscles than frowning.',
      recipe: [
        P('blk_circle', 'hair', 50, 26, 0.5, 0.5, { fill: '#8a5a2b', z: -1 }),
        P('blk_circle', 'head', 50, 26, 0.38, 0.38, { fill: '#ffd9b3', z: 1 }),
        P('blk_eye_dot', 'left eye', 44, 27, 0.12, 0.12, { z: 3 }),
        P('blk_eye_dot', 'right eye', 56, 27, 0.12, 0.12, { z: 3 }),
        P('blk_smile', 'smile', 50, 34, 0.12, 0.12, { z: 3 }),
        P('blk_triangle', 'dress', 50, 62, 0.8, 0.8, { fill: '#ff8fb1' }),
        P('blk_leg', 'left leg', 43, 90, 0.2, 0.25, { fill: '#ffd9b3', z: -1 }),
        P('blk_leg', 'right leg', 57, 90, 0.2, 0.25, { fill: '#ffd9b3', z: -1 }),
      ],
    },
  ],
};
