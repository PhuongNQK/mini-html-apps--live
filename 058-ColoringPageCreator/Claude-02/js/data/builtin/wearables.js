/** Built-in gallery: Wearables (hats, glasses, beards, eyebrows, clothes, shoes ...). 100x100 grid. */
import { L, st, star } from './_shared.js';

const boot = (dx, dy, s) => `<g transform="translate(${dx} ${dy}) scale(${s})">
  <path d="M10 6 H34 V52 L56 58 Q64 61 64 72 V84 H10 Z" fill="#8d5b3a" ${st()}/>
  <rect x="8" y="80" width="58" height="10" rx="4" fill="#4b2f1c" ${st()}/>
  <rect x="10" y="6" width="24" height="12" fill="#a9744c" ${st(2.5)}/>
  <path d="M14 30 H30 M14 40 H30" fill="none" ${st(2.5)}/>
</g>`;

export default {
  category: 'wearables',
  items: [
    {
      id: 'wear_witch_hat',
      name: 'Witch Hat',
      svg: `<ellipse cx="50" cy="80" rx="46" ry="11" fill="#5e35b1" ${st()}/>
        <path d="M32 78 C38 56 46 38 66 8 C62 28 70 50 68 78 Z" fill="#7e57c2" ${st()}/>
        <path d="M33 68 Q50 78 67 68 L68 78 Q50 88 32 78 Z" fill="#ffd23f" ${st(2.5)}/>
        <rect x="44" y="70" width="12" height="12" rx="2" fill="#ffffff" ${st(2)}/>`,
    },
    {
      id: 'wear_santa_hat',
      name: 'Santa Hat',
      svg: `<path d="M14 74 C14 40 36 18 62 22 C76 24 86 34 82 50 C80 60 82 68 88 74 Z" fill="#e53935" ${st()}/>
        <rect x="10" y="66" width="84" height="20" rx="10" fill="#ffffff" ${st()}/>
        <circle cx="84" cy="52" r="10" fill="#ffffff" ${st()}/>`,
    },
    {
      id: 'wear_top_hat',
      name: 'Top Hat',
      svg: `<ellipse cx="50" cy="82" rx="42" ry="9" fill="#3a3a4a" ${st()}/>
        <rect x="28" y="16" width="44" height="66" rx="5" fill="#3a3a4a" ${st()}/>
        <ellipse cx="50" cy="17" rx="22" ry="5" fill="#4d4d62" ${st(2.5)}/>
        <rect x="28" y="62" width="44" height="13" fill="#e53935" ${st(2.5)}/>`,
    },
    {
      id: 'wear_crown',
      name: 'Royal Crown',
      svg: `<path d="M14 80 L10 30 L32 52 L50 22 L68 52 L90 30 L86 80 Z" fill="#ffd23f" ${st()}/>
        <rect x="13" y="68" width="74" height="14" rx="3" fill="#f2a03d" ${st()}/>
        <circle cx="10" cy="27" r="5" fill="#ffd23f" ${st(2.5)}/><circle cx="50" cy="19" r="5" fill="#ffd23f" ${st(2.5)}/><circle cx="90" cy="27" r="5" fill="#ffd23f" ${st(2.5)}/>
        <circle cx="50" cy="57" r="6" fill="#e53935" ${st(2.5)}/><circle cx="28" cy="75" r="3.5" fill="#4d96ff" ${st(2)}/><circle cx="72" cy="75" r="3.5" fill="#4d96ff" ${st(2)}/>`,
    },
    {
      id: 'wear_party_hat',
      name: 'Party Hat',
      svg: `<path d="M50 10 L78 86 L22 86 Z" fill="#4d96ff" ${st()}/>
        <path d="M41 34 L59 34 L63 46 L37 46 Z" fill="#ff6b6b" ${st(2.5)}/>
        <path d="M33 58 L67 58 L71 70 L29 70 Z" fill="#ffd23f" ${st(2.5)}/>
        <ellipse cx="50" cy="86" rx="29" ry="5" fill="#f2a03d" ${st(2.5)}/>
        <circle cx="50" cy="10" r="7" fill="#ff6b6b" ${st(2.5)}/>`,
    },
    {
      id: 'wear_round_glasses',
      name: 'Round Glasses',
      svg: `<path d="M10 46 L2 40 M90 46 L98 40" fill="none" ${st()}/>
        <circle cx="28" cy="50" r="18" fill="#d6eeff" ${st(4)}/><circle cx="72" cy="50" r="18" fill="#d6eeff" ${st(4)}/>
        <path d="M46 46 Q50 40 54 46" fill="none" ${st(4)}/>
        <path d="M18 44 Q22 38 29 38" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
        <path d="M62 44 Q66 38 73 38" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      id: 'wear_star_glasses',
      name: 'Star Glasses',
      svg: `<path d="M8 40 L1 34 M92 40 L99 34" fill="none" ${st()}/>
        ${star(27, 50, 24, 11, '#ff6b9d', 3.5)}${star(73, 50, 24, 11, '#ff6b9d', 3.5)}
        <path d="M45 46 Q50 40 55 46" fill="none" ${st(3.5)}/>`,
    },
    {
      id: 'wear_sunglasses',
      name: 'Cool Sunglasses',
      svg: `<path d="M8 42 L1 38 M92 42 L99 38" fill="none" ${st()}/>
        <rect x="8" y="36" width="38" height="28" rx="12" fill="#2f3a56" ${st()}/><rect x="54" y="36" width="38" height="28" rx="12" fill="#2f3a56" ${st()}/>
        <path d="M46 42 Q50 38 54 42" fill="none" ${st(3.5)}/>
        <path d="M15 44 L24 44 M60 44 L69 44" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>`,
    },
    {
      id: 'wear_mustache',
      name: 'Curly Mustache',
      svg: `<path d="M50 40 C42 28 26 28 14 36 C6 40 4 52 12 54 C22 54 30 44 40 47 C46 48 48 47 50 45 C52 47 54 48 60 47 C70 44 78 54 88 54 C96 52 94 40 86 36 C74 28 58 28 50 40 Z" fill="#6b4226" ${st()}/>`,
    },
    {
      id: 'wear_santa_beard',
      name: 'Santa Beard',
      svg: `<path d="M8 14 C4 58 26 96 50 96 C74 96 96 58 92 14 C82 36 68 42 50 40 C32 42 18 36 8 14 Z" fill="#ffffff" ${st()}/>
        <ellipse cx="38" cy="44" rx="15" ry="8" transform="rotate(12 38 44)" fill="#ffffff" ${st()}/>
        <ellipse cx="62" cy="44" rx="15" ry="8" transform="rotate(-12 62 44)" fill="#ffffff" ${st()}/>
        <path d="M44 62 Q50 68 56 62" fill="none" ${st(2.5)}/>
        <path d="M30 70 Q34 76 38 70 M62 74 Q66 80 70 74 M46 80 Q50 86 54 80" fill="none" ${st(2)}/>`,
    },
    {
      id: 'wear_eyebrows',
      name: 'Bushy Eyebrows',
      svg: `<ellipse cx="27" cy="48" rx="21" ry="8" transform="rotate(-16 27 48)" fill="#5b3a29" ${st()}/>
        <ellipse cx="73" cy="48" rx="21" ry="8" transform="rotate(16 73 48)" fill="#5b3a29" ${st()}/>`,
    },
    {
      id: 'wear_bow_tie',
      name: 'Bow Tie',
      svg: `<path d="M50 50 L12 26 Q4 50 12 74 Z" fill="#e53935" ${st()}/>
        <path d="M50 50 L88 26 Q96 50 88 74 Z" fill="#e53935" ${st()}/>
        <circle cx="26" cy="42" r="3" fill="#ffffff"/><circle cx="24" cy="58" r="3" fill="#ffffff"/><circle cx="74" cy="42" r="3" fill="#ffffff"/><circle cx="76" cy="58" r="3" fill="#ffffff"/>
        <rect x="42" y="38" width="16" height="24" rx="6" fill="#c62828" ${st()}/>`,
    },
    {
      id: 'wear_scarf',
      name: 'Cosy Scarf',
      svg: `<path d="M64 54 L88 54 L92 94 L68 94 Z" fill="#e53935" ${st()}/>
        <path d="M66 72 H90 M67 82 H91" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M70 94 V99 M78 94 V99 M86 94 V99" fill="none" ${st(2.5)}/>
        <path d="M6 24 Q50 52 94 24 L94 52 Q50 80 6 52 Z" fill="#e53935" ${st()}/>
        <path d="M24 36 Q50 52 76 36" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      id: 'wear_tshirt',
      name: 'T-Shirt',
      svg: `<path d="M30 14 L10 28 L22 46 L30 42 L30 90 L70 90 L70 42 L78 46 L90 28 L70 14 Q50 30 30 14 Z" fill="#4d96ff" ${st()}/>
        <path d="M30 14 Q50 30 70 14" fill="none" ${st(3)}/>
        ${star(50, 58, 13, 6, '#ffd23f', 2.5)}`,
    },
    {
      id: 'wear_boots',
      name: 'Boots',
      svg: `${boot(2, 8, 0.7)}${boot(50, 8, 0.7)}`,
    },
    {
      id: 'wear_bunny_ears',
      name: 'Bunny Ears',
      svg: `<ellipse cx="30" cy="38" rx="10" ry="28" transform="rotate(-10 30 38)" fill="#ffffff" ${st()}/>
        <ellipse cx="70" cy="38" rx="10" ry="28" transform="rotate(10 70 38)" fill="#ffffff" ${st()}/>
        <ellipse cx="30" cy="40" rx="4.5" ry="19" transform="rotate(-10 30 40)" fill="#ffb3c6"/>
        <ellipse cx="70" cy="40" rx="4.5" ry="19" transform="rotate(10 70 40)" fill="#ffb3c6"/>
        <path d="M14 84 Q50 66 86 84" fill="none" stroke="#ff6b9d" stroke-width="7" stroke-linecap="round"/>`,
    },
    {
      id: 'wear_hair_bow',
      name: 'Hair Bow',
      svg: `<ellipse cx="28" cy="50" rx="22" ry="14" transform="rotate(-22 28 50)" fill="#ff6b9d" ${st()}/>
        <ellipse cx="72" cy="50" rx="22" ry="14" transform="rotate(22 72 50)" fill="#ff6b9d" ${st()}/>
        <path d="M44 60 L38 86 L48 80 Z M56 60 L62 86 L52 80 Z" fill="#ff8fb8" ${st(2.5)}/>
        <circle cx="50" cy="50" r="9" fill="#e84a85" ${st()}/>`,
    },
  ],
};
