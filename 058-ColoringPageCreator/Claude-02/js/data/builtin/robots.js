/** Built-in gallery: Robots (recipes made of building blocks). */
import { P } from './_recipe.js';

export default {
  category: 'robots',
  items: [
    {
      id: 'robot_buddy',
      name: 'Robot buddy',
      fact: 'The word “robot” comes from a Czech word meaning “hard work”.',
      recipe: [
        P('blk_square', 'body', 50, 64, 0.6, 0.6, { fill: '#9aa5b1' }),
        P('blk_rect', 'head', 50, 30, 0.6, 0.55, { fill: '#cfd6dd', z: 1 }),
        P('blk_circle', 'left eye', 41, 28, 0.17, 0.17, { fill: '#4ecdc4', z: 2 }),
        P('blk_circle', 'right eye', 59, 28, 0.17, 0.17, { fill: '#4ecdc4', z: 2 }),
        P('blk_whisker', 'mouth', 50, 38, 0.2, 0.2, { z: 2 }),
        P('blk_leg', 'antenna', 50, 8, 0.1, 0.22, { fill: '#9aa5b1', z: 0 }),
        P('blk_circle', 'antenna ball', 50, 3, 0.14, 0.14, { fill: '#ff5d73', z: 1 }),
        P('blk_leg', 'left arm', 22, 66, 0.2, 0.45, { rot: 10, fill: '#cfd6dd', z: -1 }),
        P('blk_leg', 'right arm', 78, 66, 0.2, 0.45, { rot: -10, fill: '#cfd6dd', z: -1 }),
        P('blk_leg', 'left leg', 40, 92, 0.22, 0.3, { fill: '#9aa5b1', z: -1 }),
        P('blk_leg', 'right leg', 60, 92, 0.22, 0.3, { fill: '#9aa5b1', z: -1 }),
        P('blk_heart', 'chest heart', 50, 64, 0.22, 0.22, { fill: '#ff5d73', z: 2 }),
      ],
    },
    {
      id: 'robot_rover',
      name: 'Rover',
      fact: 'Robot rovers have explored the surface of Mars.',
      recipe: [
        P('blk_rect', 'body', 50, 52, 0.85, 0.7, { fill: '#ffb703' }),
        P('blk_circle', 'left wheel', 30, 80, 0.3, 0.3, { fill: '#2b2b3b', z: 1 }),
        P('blk_circle', 'right wheel', 70, 80, 0.3, 0.3, { fill: '#2b2b3b', z: 1 }),
        P('blk_circle', 'eye', 50, 50, 0.34, 0.34, { fill: '#ffffff', z: 2 }),
        P('blk_eye_dot', 'pupil', 50, 50, 0.2, 0.2, { z: 3 }),
        P('blk_leg', 'antenna', 70, 24, 0.1, 0.3, { rot: 15, fill: '#9aa5b1', z: -1 }),
        P('blk_circle', 'antenna ball', 74, 12, 0.13, 0.13, { fill: '#ff5d73', z: 0 }),
      ],
    },
  ],
};
