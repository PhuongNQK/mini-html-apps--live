/** Built-in gallery: Props (pumpkins, gifts, trees, cars, ...). 100x100 grid. */
import { L, st, eye, cheek, star, starPoints } from './_shared.js';

const pumpkinBody = (fill = '#ff9f43') => `
  <ellipse cx="28" cy="60" rx="17" ry="29" fill="${fill}" ${st()}/><ellipse cx="72" cy="60" rx="17" ry="29" fill="${fill}" ${st()}/>
  <ellipse cx="50" cy="60" rx="25" ry="31" fill="${fill}" ${st()}/>
  <path d="M43 30 Q45 12 58 10 Q55 20 56 30 Z" fill="#6bcb77" ${st()}/>`;

export default {
  category: 'props',
  items: [
    {
      id: 'prop_jack_o_lantern',
      name: 'Jack-o-Lantern',
      svg: `${pumpkinBody()}
        <path d="M30 50 L42 50 L36 38 Z M58 50 L70 50 L64 38 Z" fill="#ffd23f" ${st(2.5)}/>
        <path d="M30 64 L38 70 L44 64 L50 72 L56 64 L62 70 L70 64 Q50 88 30 64 Z" fill="#ffd23f" ${st(2.5)}/>`,
    },
    {
      id: 'prop_cute_pumpkin',
      name: 'Cute Pumpkin',
      svg: `${pumpkinBody('#ff8c42')}
        ${eye(40, 56, 4.5)}${eye(60, 56, 4.5)}
        <path d="M42 68 Q50 76 58 68" fill="none" ${st()}/>${cheek(32, 66)}${cheek(68, 66)}
        <path d="M58 12 Q70 8 74 18 Q66 20 66 14" fill="none" stroke="#6bcb77" stroke-width="3.5" stroke-linecap="round"/>`,
    },
    {
      id: 'prop_candy_corn',
      name: 'Candy Corn',
      svg: `<path d="M20 88 L28 62 L72 62 L80 88 Q50 98 20 88 Z" fill="#ffd23f" ${st()}/>
        <path d="M28 62 L36 36 L64 36 L72 62 Z" fill="#ff9f43" ${st()}/>
        <path d="M36 36 L44 12 Q50 5 56 12 L64 36 Z" fill="#ffffff" ${st()}/>
        ${eye(41, 76, 3.6)}${eye(59, 76, 3.6)}<path d="M45 83 Q50 87 55 83" fill="none" ${st(2.2)}/>`,
    },
    {
      id: 'prop_candy_cane',
      name: 'Candy Cane',
      svg: `<path d="M38 96 V34 A22 22 0 0 1 82 34 V46 H66 V34 A6 6 0 0 0 54 34 V96 Z" fill="#ffffff" ${st()}/>
        <path d="M38 84 L54 78 V88 L38 94 Z M38 62 L54 56 V66 L38 72 Z M38 40 L54 34 V44 L38 50 Z" fill="#e53935" ${st(2)}/>
        <path d="M66 36 L82 32 V40 L66 44 Z" fill="#e53935" ${st(2)}/>`,
    },
    {
      id: 'prop_gift_box',
      name: 'Gift Box',
      svg: `<rect x="14" y="46" width="72" height="46" rx="4" fill="#4d96ff" ${st()}/>
        <rect x="9" y="34" width="82" height="16" rx="4" fill="#6baaff" ${st()}/>
        <rect x="44" y="34" width="12" height="58" fill="#ff6b6b" ${st(2.5)}/>
        <ellipse cx="36" cy="25" rx="14" ry="8" transform="rotate(-25 36 25)" fill="#ff6b6b" ${st()}/>
        <ellipse cx="64" cy="25" rx="14" ry="8" transform="rotate(25 64 25)" fill="#ff6b6b" ${st()}/>
        <circle cx="50" cy="30" r="6" fill="#e04848" ${st(2.5)}/>`,
    },
    {
      id: 'prop_christmas_tree',
      name: 'Christmas Tree',
      svg: `<rect x="42" y="84" width="16" height="12" fill="#8a5a2b" ${st()}/>
        <path d="M50 38 L90 86 H10 Z" fill="#43b05c" ${st()}/>
        <path d="M50 22 L80 62 H20 Z" fill="#4cc26a" ${st()}/>
        <path d="M50 8 L72 38 H28 Z" fill="#58d078" ${st()}/>
        ${star(50, 10, 9, 4, '#ffd23f', 2.5)}
        <circle cx="42" cy="30" r="3.5" fill="#e53935" ${st(2)}/><circle cx="36" cy="54" r="4" fill="#ffd23f" ${st(2)}/><circle cx="62" cy="50" r="4" fill="#4d96ff" ${st(2)}/>
        <circle cx="28" cy="76" r="4.5" fill="#e53935" ${st(2)}/><circle cx="52" cy="72" r="4.5" fill="#ff9f43" ${st(2)}/><circle cx="74" cy="78" r="4.5" fill="#ffd23f" ${st(2)}/>`,
    },
    {
      id: 'prop_ornament',
      name: 'Bauble',
      svg: `<path d="M44 22 Q44 6 56 6 Q64 6 64 14" fill="none" ${st()}/>
        <rect x="40" y="22" width="20" height="10" rx="2.5" fill="#ffd23f" ${st()}/>
        <circle cx="50" cy="62" r="30" fill="#e53935" ${st()}/>
        <path d="M23 54 Q50 68 77 54 M21 68 Q50 84 79 68" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <ellipse cx="37" cy="50" rx="5" ry="9" transform="rotate(20 37 50)" fill="#ffffff" opacity="0.6"/>`,
    },
    {
      id: 'prop_star',
      name: 'Smiling Star',
      svg: `${star(50, 54, 44, 20, '#ffd23f', 3.5)}
        ${eye(42, 54, 3.6)}${eye(58, 54, 3.6)}<path d="M44 63 Q50 69 56 63" fill="none" ${st(2.5)}/>${cheek(36, 62, 4, 2.6)}${cheek(64, 62, 4, 2.6)}`,
    },
    {
      id: 'prop_stocking',
      name: 'Christmas Stocking',
      svg: `<path d="M30 12 H62 V54 L84 66 Q92 72 88 82 Q84 92 72 88 L40 76 Q30 72 30 60 Z" fill="#e53935" ${st()}/>
        <path d="M30 62 Q30 72 40 76 L48 79 L46 62 Z" fill="#ffffff" ${st(2.5)}/>
        <path d="M72 88 Q84 92 88 82 Q90 76 86 71 L76 78 Z" fill="#ffffff" ${st(2.5)}/>
        <rect x="26" y="8" width="40" height="18" rx="6" fill="#ffffff" ${st()}/>
        ${star(46, 42, 8, 3.6, '#ffd23f', 2)}`,
    },
    {
      id: 'prop_snowflake',
      name: 'Snowflake',
      svg: `<g fill="none" stroke="#4d96ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M50 8 V92 M14 29 L86 71 M14 71 L86 29"/>
          <path d="M42 16 L50 24 L58 16 M42 84 L50 76 L58 84"/>
          <path d="M16 38 L28 38 L24 27 M84 62 L72 62 L76 73"/>
          <path d="M16 62 L28 62 L24 73 M84 38 L72 38 L76 27"/>
        </g>
        <circle cx="50" cy="50" r="7" fill="#d6eeff" ${st(3)}/>`,
    },
    {
      id: 'prop_tombstone',
      name: 'Tombstone',
      svg: `<path d="M22 94 L24 40 C24 12 76 12 76 40 L78 94 Z" fill="#c9ced6" ${st()}/>
        <path d="M50 34 V62 M39 44 H61" fill="none" ${st(4)}/>
        <path d="M10 94 Q14 82 18 94 M82 94 Q86 80 90 94 M18 94 Q22 84 26 94" fill="none" stroke="#43b05c" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M32 80 Q38 76 42 82" fill="none" ${st(2)}/>`,
    },
    {
      id: 'prop_cauldron',
      name: 'Witch Cauldron',
      svg: `<path d="M26 78 Q22 92 18 98 Q30 92 36 82 Z M74 78 Q78 92 82 98 Q70 92 64 82 Z M46 82 Q50 98 54 82 Z" fill="#ff9f43" ${st(2.5)}/>
        <path d="M16 40 C8 72 24 86 50 86 C76 86 92 72 84 40 Z" fill="#4a4a5c" ${st()}/>
        <circle cx="14" cy="50" r="6" fill="none" ${st(3.5)}/><circle cx="86" cy="50" r="6" fill="none" ${st(3.5)}/>
        <ellipse cx="50" cy="40" rx="35" ry="9" fill="#5d5d72" ${st()}/>
        <ellipse cx="50" cy="40" rx="29" ry="5.5" fill="#6bcb77" ${st(2.5)}/>
        <circle cx="38" cy="30" r="6" fill="#8ee89b" ${st(2.5)}/><circle cx="56" cy="22" r="8" fill="#8ee89b" ${st(2.5)}/><circle cx="70" cy="32" r="4.5" fill="#8ee89b" ${st(2.5)}/>`,
    },
    {
      id: 'prop_car',
      name: 'Cute Car',
      svg: `<path d="M6 70 V56 Q6 48 14 48 H24 L36 30 Q39 26 45 26 H66 Q72 26 76 32 L86 48 H92 Q98 48 98 56 V70 Z" fill="#ff6b6b" ${st()}/>
        <path d="M30 48 L40 33 H50 V48 Z" fill="#d6eeff" ${st(2.5)}/><path d="M55 48 V33 H66 Q69 33 71 36 L79 48 Z" fill="#d6eeff" ${st(2.5)}/>
        <circle cx="94" cy="58" r="4" fill="#ffd23f" ${st(2)}/><rect x="6" y="56" width="5" height="8" rx="2" fill="#ffd23f" ${st(2)}/>
        <circle cx="28" cy="72" r="11" fill="#4a4a5c" ${st()}/><circle cx="28" cy="72" r="4.5" fill="#d9dde5" ${st(2)}/>
        <circle cx="76" cy="72" r="11" fill="#4a4a5c" ${st()}/><circle cx="76" cy="72" r="4.5" fill="#d9dde5" ${st(2)}/>`,
    },
    {
      id: 'prop_house',
      name: 'Cosy House',
      svg: `<rect x="68" y="14" width="12" height="26" fill="#b4573b" ${st()}/>
        <rect x="14" y="46" width="72" height="46" fill="#ffd9a8" ${st()}/>
        <path d="M6 50 L50 12 L94 50 Z" fill="#e53935" ${st()}/>
        <path d="M42 92 V70 Q50 60 58 70 V92 Z" fill="#8a5a2b" ${st()}/>
        <rect x="20" y="58" width="16" height="16" fill="#d6eeff" ${st(2.5)}/><rect x="64" y="58" width="16" height="16" fill="#d6eeff" ${st(2.5)}/>
        <path d="M28 58 V74 M20 66 H36 M72 58 V74 M64 66 H80" fill="none" ${st(2)}/>
        <circle cx="54" cy="80" r="1.8" fill="${L}"/>`,
    },
    {
      id: 'prop_lollipop',
      name: 'Swirl Lollipop',
      svg: `<rect x="46" y="58" width="8" height="38" rx="3" fill="#ffffff" ${st()}/>
        <circle cx="50" cy="36" r="29" fill="#ff8fb8" ${st()}/>
        <circle cx="50" cy="36" r="20" fill="none" stroke="#ffffff" stroke-width="4"/>
        <circle cx="50" cy="36" r="10" fill="none" stroke="#ffffff" stroke-width="4"/>
        <path d="M40 66 L50 62 L60 66 L56 72 L50 68 L44 72 Z" fill="#ffd23f" ${st(2.5)}/>`,
    },
    {
      id: 'prop_moon',
      name: 'Crescent Moon',
      svg: `<path d="M62 8 A42 42 0 1 0 92 66 A34 34 0 1 1 62 8 Z" fill="#ffd23f" ${st()}/>
        ${eye(36, 54, 3.4)}<path d="M26 66 Q34 74 42 66" fill="none" ${st(2.5)}/>${cheek(24, 60, 4, 2.6)}
        ${star(80, 22, 7, 3, '#ffe38a', 2)}`,
    },
    {
      id: 'prop_heart',
      name: 'Heart',
      svg: `<path d="M50 92 C8 58 12 20 34 20 C43 20 48 26 50 30 C52 26 57 20 66 20 C88 20 92 58 50 92 Z" fill="#ff6b6b" ${st()}/>
        <path d="M26 36 Q30 28 38 30" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      id: 'prop_broom',
      name: 'Witch Broom',
      svg: `<g transform="rotate(-32 50 52)">
          <rect x="4" y="47" width="64" height="9" rx="4.5" fill="#8a5a2b" ${st()}/>
          <path d="M66 42 L96 36 Q100 52 96 68 L66 62 Z" fill="#f2c14e" ${st()}/>
          <path d="M74 42 V62 M82 40 V64 M90 38 V66" fill="none" ${st(2)}/>
          <rect x="62" y="42" width="8" height="20" rx="2" fill="#e53935" ${st(2.5)}/>
        </g>`,
    },
  ],
};
