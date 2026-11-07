/**
 * Built-in gallery: Building blocks.
 * Every block is drawn on a 100x100 grid, centred on (50,50). Recipes (see data/builtin/animals.js)
 * place a block with  translate(x y) rotate(rot) scale(sx sy) translate(-50 -50).
 * The "main colour" of a block is its first non-black fill; a recipe's `fill` replaces it.
 */
import { L, st, starPoints } from './_shared.js';

const s = st(4);

export default {
  category: 'buildingBlocks',
  items: [
    { id: 'blk_circle', name: 'Circle', svg: `<circle cx="50" cy="50" r="38" fill="#ffd23f" ${s}/>` },
    { id: 'blk_oval_wide', name: 'Wide oval', svg: `<ellipse cx="50" cy="50" rx="38" ry="26" fill="#4ea8de" ${s}/>` },
    { id: 'blk_oval_tall', name: 'Tall oval', svg: `<ellipse cx="50" cy="50" rx="26" ry="38" fill="#ff9f43" ${s}/>` },
    { id: 'blk_square', name: 'Square', svg: `<rect x="14" y="14" width="72" height="72" rx="6" fill="#6bcb77" ${s}/>` },
    { id: 'blk_rect', name: 'Rectangle', svg: `<rect x="8" y="26" width="84" height="48" rx="6" fill="#a78bfa" ${s}/>` },
    { id: 'blk_triangle', name: 'Triangle', svg: `<polygon points="50,12 88,86 12,86" fill="#ff9f43" ${s}/>` },
    { id: 'blk_semicircle', name: 'Half circle', svg: `<path d="M12 70 A38 38 0 0 1 88 70 Z" fill="#ff6b8b" ${s}/>` },
    { id: 'blk_heart', name: 'Heart', svg: `<path d="M50 86 C14 58 10 30 28 20 C40 14 48 22 50 30 C52 22 60 14 72 20 C90 30 86 58 50 86 Z" fill="#ff5d73" ${s}/>` },
    { id: 'blk_star', name: 'Star', svg: `<polygon points="${starPoints(50, 54, 42, 18)}" fill="#ffd23f" ${s}/>` },
    { id: 'blk_diamond', name: 'Diamond', svg: `<polygon points="50,8 90,50 50,92 10,50" fill="#4ecdc4" ${s}/>` },
    {
      id: 'blk_eye_round',
      name: 'Round eye',
      svg: `<circle cx="50" cy="50" r="24" fill="#ffffff" ${s}/><circle cx="52" cy="52" r="11" fill="${L}" data-solid="1"/><circle cx="47" cy="46" r="4" fill="#ffffff" data-blank="1"/>`,
    },
    {
      id: 'blk_eye_dot',
      name: 'Dot eye',
      svg: `<circle cx="50" cy="50" r="18" fill="${L}" data-solid="1"/><circle cx="56" cy="43" r="6" fill="#ffffff" data-blank="1"/>`,
    },
    { id: 'blk_smile', name: 'Smile', svg: `<path d="M16 38 Q50 90 84 38" fill="none" ${st(9)}/>` },
    {
      id: 'blk_bubble',
      name: 'Bubble',
      svg: `<circle cx="50" cy="50" r="38" fill="#e3f6ff" opacity="0.9" ${s}/><path d="M28 42 Q32 28 46 24" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round" data-blank="1"/>`,
    },
    { id: 'blk_fin', name: 'Fin', svg: `<path d="M14 88 C30 60 40 30 56 10 C58 50 72 74 90 88 Z" fill="#5c8fc7" ${s}/>` },
    { id: 'blk_ear_pointy', name: 'Pointy ear', svg: `<path d="M20 90 Q22 40 50 8 Q78 40 80 90 Z" fill="#c9a27a" ${s}/>` },
    { id: 'blk_wing', name: 'Wing', svg: `<path d="M10 50 C20 14 70 6 92 40 C78 74 30 86 10 50 Z" fill="#8ec5ff" ${s}/>` },
    { id: 'blk_leg', name: 'Leg', svg: `<rect x="38" y="8" width="24" height="84" rx="12" fill="#c9a27a" ${s}/>` },
    { id: 'blk_nose', name: 'Nose', svg: `<ellipse cx="50" cy="50" rx="16" ry="12" fill="#ff8fa3" ${s}/>` },
    { id: 'blk_spot', name: 'Spot', svg: `<circle cx="50" cy="50" r="30" fill="#8a5a2b" ${s}/>` },
    { id: 'blk_whisker', name: 'Whisker', svg: `<line x1="8" y1="50" x2="92" y2="50" fill="none" ${st(5)}/>` },
  ],
};
