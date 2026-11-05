/** Built-in gallery: Characters (cute Halloween / Christmas / farm friends). 100x100 design grid. */
import { L, st, eye, happyEye, cheek, star } from './_shared.js';

const GHOST = '#f6f4ff';
const ghostBody = `<path d="M20 90 V46 C20 22 34 9 50 9 C66 9 80 22 80 46 V90 L70 82 L60 91 L50 82 L40 91 L30 82 Z" fill="${GHOST}" ${st()}/>`;

export default {
  category: 'characters',
  items: [
    {
      id: 'char_ghost_happy',
      name: 'Happy Ghost',
      svg: `${ghostBody}${eye(39, 43, 5)}${eye(61, 43, 5)}
        <path d="M43 55 Q50 63 57 55" fill="none" ${st()}/>${cheek(30, 54)}${cheek(70, 54)}`,
    },
    {
      id: 'char_ghost_wave',
      name: 'Waving Ghost',
      svg: `<ellipse cx="88" cy="46" rx="6" ry="12" transform="rotate(22 88 46)" fill="${GHOST}" ${st()}/>
        <ellipse cx="12" cy="66" rx="5.5" ry="10" transform="rotate(-18 12 66)" fill="${GHOST}" ${st()}/>
        ${ghostBody}${happyEye(39, 44)}${happyEye(61, 44)}
        <path d="M42 54 Q50 68 58 54 Z" fill="#ff8fa3" ${st(2.5)}/>${cheek(29, 54)}${cheek(71, 54)}`,
    },
    {
      id: 'char_ghost_boo',
      name: 'Boo Ghost',
      svg: `<ellipse cx="12" cy="42" rx="6" ry="12" transform="rotate(-28 12 42)" fill="${GHOST}" ${st()}/>
        <ellipse cx="88" cy="42" rx="6" ry="12" transform="rotate(28 88 42)" fill="${GHOST}" ${st()}/>
        ${ghostBody}
        <path d="M30 32 L45 37 M70 32 L55 37" fill="none" ${st(3)}/>
        ${eye(39, 45, 6)}${eye(61, 45, 6)}
        <ellipse cx="50" cy="64" rx="7" ry="9" fill="#7a4a8a" ${st(2.5)}/>`,
    },
    {
      id: 'char_cat_orange',
      name: 'Kitty Cat',
      svg: `<path d="M70 88 C94 92 100 62 86 50 C80 58 90 72 70 76 Z" fill="#f2a03d" ${st()}/>
        <path d="M28 94 C24 72 32 56 50 56 C68 56 76 72 72 94 Z" fill="#f2a03d" ${st()}/>
        <ellipse cx="50" cy="78" rx="10" ry="14" fill="#fff3d6" ${st(2)}/>
        <ellipse cx="38" cy="94" rx="9" ry="4.5" fill="#f2a03d" ${st(2.5)}/><ellipse cx="62" cy="94" rx="9" ry="4.5" fill="#f2a03d" ${st(2.5)}/>
        <path d="M26 30 L28 6 L45 20 Z" fill="#f2a03d" ${st()}/><path d="M74 30 L72 6 L55 20 Z" fill="#f2a03d" ${st()}/>
        <path d="M30 24 L31 13 L39 20 Z" fill="#ffb3c6"/><path d="M70 24 L69 13 L61 20 Z" fill="#ffb3c6"/>
        <ellipse cx="50" cy="40" rx="26" ry="21" fill="#f2a03d" ${st()}/>
        <path d="M50 21 V28 M42 23 L43 29 M58 23 L57 29" fill="none" stroke="#c9741a" stroke-width="3" stroke-linecap="round"/>
        ${eye(39, 40, 4.5)}${eye(61, 40, 4.5)}
        <path d="M46 47 L54 47 L50 52 Z" fill="#ff8fa3" ${st(2)}/>
        <path d="M50 52 V55 M50 55 Q46 59 42 56 M50 55 Q54 59 58 56" fill="none" ${st(2)}/>
        <path d="M18 42 L33 45 M18 51 L33 49 M82 42 L67 45 M82 51 L67 49" fill="none" ${st(2)}/>${cheek(32, 50, 4, 2.6)}${cheek(68, 50, 4, 2.6)}`,
    },
    {
      id: 'char_cat_black',
      name: 'Black Cat',
      svg: `<path d="M72 92 C95 92 99 66 90 48 C85 56 90 76 70 80 Z" fill="#3d3a4f" ${st()}/>
        <path d="M28 94 C24 72 32 56 50 56 C68 56 76 72 72 94 Z" fill="#3d3a4f" ${st()}/>
        <path d="M26 30 L28 6 L45 20 Z" fill="#3d3a4f" ${st()}/><path d="M74 30 L72 6 L55 20 Z" fill="#3d3a4f" ${st()}/>
        <path d="M30 24 L31 13 L39 20 Z" fill="#ff9eb5"/><path d="M70 24 L69 13 L61 20 Z" fill="#ff9eb5"/>
        <ellipse cx="50" cy="40" rx="26" ry="21" fill="#3d3a4f" ${st()}/>
        <ellipse cx="39" cy="39" rx="7" ry="8" fill="#ffd23f" ${st(2)}/><ellipse cx="61" cy="39" rx="7" ry="8" fill="#ffd23f" ${st(2)}/>
        <ellipse cx="39" cy="39" rx="1.8" ry="6" fill="${L}"/><ellipse cx="61" cy="39" rx="1.8" ry="6" fill="${L}"/>
        <path d="M46 48 L54 48 L50 53 Z" fill="#ff8fa3" ${st(2)}/>
        <path d="M50 53 V56 M50 56 Q46 60 42 57 M50 56 Q54 60 58 57" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <path d="M34 59 Q50 69 66 59" fill="none" stroke="#ff6b6b" stroke-width="5" stroke-linecap="round"/>
        <circle cx="50" cy="67" r="5" fill="#ffd23f" ${st(2)}/>`,
    },
    {
      id: 'char_dog_sitting',
      name: 'Sitting Dog',
      svg: `<path d="M70 90 C88 92 94 76 90 62 C84 70 82 80 70 82 Z" fill="#8a5a2b" ${st()}/>
        <path d="M30 94 C26 70 34 54 50 54 C66 54 74 70 70 94 Z" fill="#d9a066" ${st()}/>
        <ellipse cx="50" cy="76" rx="10" ry="16" fill="#f6e3c8" ${st(2)}/>
        <path d="M45 76 V92 M55 76 V92" fill="none" ${st(2)}/>
        <ellipse cx="40" cy="93" rx="9" ry="4.5" fill="#d9a066" ${st(2.5)}/><ellipse cx="60" cy="93" rx="9" ry="4.5" fill="#d9a066" ${st(2.5)}/>
        <path d="M30 20 C14 20 12 46 24 52 C33 50 36 36 35 26 Z" fill="#8a5a2b" ${st()}/>
        <path d="M70 20 C86 20 88 46 76 52 C67 50 64 36 65 26 Z" fill="#8a5a2b" ${st()}/>
        <circle cx="50" cy="34" r="22" fill="#d9a066" ${st()}/>
        <ellipse cx="50" cy="43" rx="12" ry="9" fill="#f6e3c8" ${st(2)}/>
        <ellipse cx="50" cy="38" rx="5.5" ry="4" fill="${L}"/>
        ${eye(41, 29, 4)}${eye(59, 29, 4)}
        <path d="M50 42 V46 M50 46 Q45 51 41 47 M50 46 Q55 51 59 47" fill="none" ${st(2)}/>
        <path d="M46 48 Q50 60 54 48 Z" fill="#ff8fa3" ${st(2)}/>
        <path d="M32 58 Q50 68 68 58" fill="none" stroke="#ff6b6b" stroke-width="5" stroke-linecap="round"/>
        <circle cx="50" cy="66" r="4" fill="#ffd23f" ${st(2)}/>`,
    },
    {
      id: 'char_dog_puppy',
      name: 'Spotty Puppy',
      svg: `<path d="M26 22 C8 22 6 52 20 58 C30 56 34 40 34 28 Z" fill="#6b4226" ${st()}/>
        <path d="M74 22 C92 22 94 52 80 58 C70 56 66 40 66 28 Z" fill="#6b4226" ${st()}/>
        <ellipse cx="50" cy="52" rx="30" ry="29" fill="#ffffff" ${st()}/>
        <circle cx="64" cy="34" r="7" fill="#b07a4a"/><circle cx="34" cy="64" r="5" fill="#b07a4a"/><circle cx="70" cy="62" r="4" fill="#b07a4a"/>
        <ellipse cx="50" cy="60" rx="13" ry="10" fill="#fff0dc" ${st(2)}/>
        <ellipse cx="50" cy="55" rx="6" ry="4.5" fill="${L}"/>
        ${eye(38, 43, 5)}${eye(62, 43, 5)}
        <path d="M50 59 V63 M50 63 Q44 69 39 64 M50 63 Q56 69 61 64" fill="none" ${st(2)}/>
        <path d="M45 66 Q50 82 55 66 Z" fill="#ff8fa3" ${st(2)}/>${cheek(28, 56)}${cheek(72, 56)}`,
    },
    {
      id: 'char_pig_standing',
      name: 'Little Pig',
      svg: `<path d="M74 80 C86 80 88 70 82 67 C77 66 77 72 81 73" fill="none" ${st(2.5)}/>
        <path d="M26 94 C22 70 32 58 50 58 C68 58 78 70 74 94 Z" fill="#ffb3c6" ${st()}/>
        <rect x="31" y="84" width="14" height="12" rx="5" fill="#ff9eb5" ${st(2.5)}/><rect x="55" y="84" width="14" height="12" rx="5" fill="#ff9eb5" ${st(2.5)}/>
        <path d="M28 26 L22 6 L42 18 Z" fill="#ff9eb5" ${st()}/><path d="M72 26 L78 6 L58 18 Z" fill="#ff9eb5" ${st()}/>
        <circle cx="50" cy="40" r="25" fill="#ffb3c6" ${st()}/>
        <ellipse cx="50" cy="48" rx="12" ry="8.5" fill="#ff8fa3" ${st(2.5)}/>
        <ellipse cx="45.5" cy="48" rx="1.8" ry="3" fill="${L}"/><ellipse cx="54.5" cy="48" rx="1.8" ry="3" fill="${L}"/>
        ${eye(38, 34, 4.2)}${eye(62, 34, 4.2)}${cheek(30, 46)}${cheek(70, 46)}`,
    },
    {
      id: 'char_pig_face',
      name: 'Piggy Face',
      svg: `<path d="M24 34 L12 10 L40 22 Z" fill="#ff9eb5" ${st()}/><path d="M76 34 L88 10 L60 22 Z" fill="#ff9eb5" ${st()}/>
        <ellipse cx="50" cy="54" rx="36" ry="34" fill="#ffb3c6" ${st()}/>
        <ellipse cx="50" cy="64" rx="16" ry="11" fill="#ff8fa3" ${st(2.5)}/>
        <ellipse cx="44" cy="64" rx="2.4" ry="4" fill="${L}"/><ellipse cx="56" cy="64" rx="2.4" ry="4" fill="${L}"/>
        ${happyEye(34, 44, 6)}${happyEye(66, 44, 6)}${cheek(24, 58, 6, 4)}${cheek(76, 58, 6, 4)}`,
    },
    {
      id: 'char_chicken',
      name: 'Hen',
      svg: `<path d="M24 56 C8 52 6 36 12 28 C18 38 26 42 32 46 Z" fill="#f2a03d" ${st()}/>
        <ellipse cx="48" cy="62" rx="28" ry="24" fill="#fff6e0" ${st()}/>
        <ellipse cx="44" cy="64" rx="15" ry="10" transform="rotate(-12 44 64)" fill="#ffe2a8" ${st(2.5)}/>
        <path d="M42 84 V94 M56 84 V94 M37 94 H47 M51 94 H61" fill="none" stroke="#f29b1d" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="66" cy="38" r="15" fill="#fff6e0" ${st()}/>
        <circle cx="58" cy="22" r="5.5" fill="#ff5a5f" ${st(2.5)}/><circle cx="66" cy="19" r="6" fill="#ff5a5f" ${st(2.5)}/><circle cx="74" cy="22" r="5.5" fill="#ff5a5f" ${st(2.5)}/>
        <ellipse cx="73" cy="52" rx="3.5" ry="5.5" fill="#ff5a5f" ${st(2)}/>
        <path d="M78 34 L93 40 L78 46 Z" fill="#ffb02e" ${st(2.5)}/>${eye(68, 35, 3.5)}${cheek(62, 44, 3.5, 2.4)}`,
    },
    {
      id: 'char_chick',
      name: 'Baby Chick',
      svg: `<path d="M44 20 Q42 8 48 8 M50 20 Q50 6 56 8 M56 21 Q60 10 64 14" fill="none" ${st(2.5)}/>
        <path d="M40 86 V95 M60 86 V95 M34 95 H46 M54 95 H66" fill="none" stroke="#f29b1d" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="50" cy="56" r="32" fill="#ffe066" ${st()}/>
        <ellipse cx="20" cy="60" rx="7" ry="11" transform="rotate(20 20 60)" fill="#ffd23f" ${st(2.5)}/>
        <ellipse cx="80" cy="60" rx="7" ry="11" transform="rotate(-20 80 60)" fill="#ffd23f" ${st(2.5)}/>
        ${eye(38, 50, 4.5)}${eye(62, 50, 4.5)}
        <path d="M43 58 L57 58 L50 68 Z" fill="#ffa62b" ${st(2.5)}/>${cheek(28, 62)}${cheek(72, 62)}`,
    },
    {
      id: 'char_bat',
      name: 'Friendly Bat',
      svg: `<path d="M50 38 C40 20 18 20 6 36 C14 36 18 42 20 52 C26 46 32 48 36 58 C41 52 46 54 50 62 C54 54 59 52 64 58 C68 48 74 46 80 52 C82 42 86 36 94 36 C82 20 60 20 50 38 Z" fill="#7b68b5" ${st()}/>
        <path d="M38 30 L36 12 L48 24 Z" fill="#5a4a8a" ${st()}/><path d="M62 30 L64 12 L52 24 Z" fill="#5a4a8a" ${st()}/>
        <ellipse cx="50" cy="56" rx="13" ry="17" fill="#5a4a8a" ${st()}/>
        <circle cx="50" cy="40" r="14" fill="#5a4a8a" ${st()}/>
        ${eye(44, 38, 3.6)}${eye(56, 38, 3.6)}
        <path d="M45 46 Q50 51 55 46" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <path d="M46 47 L47.5 52 L49 48 Z M51 48 L52.5 52 L54 47 Z" fill="#ffffff" ${st(1.2)}/>`,
    },
    {
      id: 'char_owl',
      name: 'Wise Owl',
      svg: `<path d="M26 30 L28 8 L42 22 Z" fill="#a0723e" ${st()}/><path d="M74 30 L72 8 L58 22 Z" fill="#a0723e" ${st()}/>
        <ellipse cx="50" cy="56" rx="29" ry="36" fill="#a0723e" ${st()}/>
        <ellipse cx="22" cy="62" rx="9" ry="20" transform="rotate(8 22 62)" fill="#865c2e" ${st(2.5)}/>
        <ellipse cx="78" cy="62" rx="9" ry="20" transform="rotate(-8 78 62)" fill="#865c2e" ${st(2.5)}/>
        <ellipse cx="50" cy="68" rx="18" ry="22" fill="#f3d9a4" ${st(2.5)}/>
        <path d="M44 66 Q47 69 50 66 Q53 69 56 66 M43 76 Q46.5 79 50 76 Q53.5 79 57 76" fill="none" ${st(2)}/>
        <circle cx="37" cy="42" r="13" fill="#ffffff" ${st()}/><circle cx="63" cy="42" r="13" fill="#ffffff" ${st()}/>
        ${eye(38, 43, 6)}${eye(62, 43, 6)}
        <path d="M44 52 L56 52 L50 63 Z" fill="#ffb02e" ${st(2.5)}/>
        <path d="M40 94 H48 M52 94 H60" fill="none" stroke="#f29b1d" stroke-width="4" stroke-linecap="round"/>`,
    },
    {
      id: 'char_snowman',
      name: 'Snowman',
      svg: `<path d="M26 56 L8 44 M12 49 L8 40 M74 56 L92 44 M88 49 L92 40" fill="none" stroke="#8a5a2b" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="50" cy="76" r="22" fill="#ffffff" ${st()}/>
        <circle cx="50" cy="49" r="17" fill="#ffffff" ${st()}/>
        <circle cx="50" cy="23" r="13" fill="#ffffff" ${st()}/>
        <path d="M32 38 Q50 50 68 38 L68 46 Q50 58 32 46 Z" fill="#e53935" ${st(2.5)}/>
        <circle cx="50" cy="62" r="2.8" fill="${L}"/><circle cx="50" cy="72" r="2.8" fill="${L}"/><circle cx="50" cy="82" r="2.8" fill="${L}"/>
        ${eye(45, 20, 2.6)}${eye(55, 20, 2.6)}
        <path d="M50 25 L63 28 L50 30 Z" fill="#ff8c42" ${st(1.8)}/>
        <path d="M45 33 Q50 36 55 33" fill="none" ${st(2)}/>${cheek(40, 28, 3, 2)}${cheek(60, 28, 3, 2)}`,
    },
    {
      id: 'char_bunny',
      name: 'Bunny',
      svg: `<ellipse cx="36" cy="22" rx="9" ry="21" transform="rotate(-8 36 22)" fill="#ffffff" ${st()}/>
        <ellipse cx="64" cy="22" rx="9" ry="21" transform="rotate(8 64 22)" fill="#ffffff" ${st()}/>
        <ellipse cx="36" cy="24" rx="4" ry="14" transform="rotate(-8 36 24)" fill="#ffb3c6"/>
        <ellipse cx="64" cy="24" rx="4" ry="14" transform="rotate(8 64 24)" fill="#ffb3c6"/>
        <path d="M26 94 C22 74 32 62 50 62 C68 62 78 74 74 94 Z" fill="#ffffff" ${st()}/>
        <circle cx="50" cy="52" r="25" fill="#ffffff" ${st()}/>
        ${eye(40, 48, 4.2)}${eye(60, 48, 4.2)}
        <path d="M46 55 L54 55 L50 60 Z" fill="#ff8fa3" ${st(2)}/>
        <path d="M50 60 Q46 65 42 62 M50 60 Q54 65 58 62" fill="none" ${st(2)}/>
        <rect x="46.5" y="63" width="7" height="7" rx="2" fill="#ffffff" ${st(2)}/>
        ${cheek(32, 58, 4.5, 3)}${cheek(68, 58, 4.5, 3)}
        <path d="M14 56 L30 58 M14 64 L30 62 M86 56 L70 58 M86 64 L70 62" fill="none" ${st(2)}/>`,
    },
    {
      id: 'char_santa',
      name: 'Santa Claus',
      svg: `<ellipse cx="50" cy="54" rx="20" ry="18" fill="#ffd9b8" ${st()}/>
        <path d="M28 52 C22 78 36 96 50 96 C64 96 78 78 72 52 C64 64 58 66 50 64 C42 66 36 64 28 52 Z" fill="#ffffff" ${st()}/>
        <path d="M26 44 C26 16 50 6 72 16 C82 22 80 32 76 44 Z" fill="#e53935" ${st()}/>
        <rect x="23" y="38" width="54" height="13" rx="6.5" fill="#ffffff" ${st()}/>
        <circle cx="78" cy="20" r="9" fill="#ffffff" ${st()}/>
        <ellipse cx="42" cy="62" rx="9" ry="5.5" transform="rotate(-10 42 62)" fill="#ffffff" ${st(2.5)}/>
        <ellipse cx="58" cy="62" rx="9" ry="5.5" transform="rotate(10 58 62)" fill="#ffffff" ${st(2.5)}/>
        <circle cx="50" cy="56" r="5" fill="#ff8f8f" ${st(2)}/>
        ${eye(42, 53, 3.2)}${eye(58, 53, 3.2)}${cheek(34, 58, 4, 2.6)}${cheek(66, 58, 4, 2.6)}
        <path d="M44 72 Q50 77 56 72" fill="none" ${st(2)}/>`,
    },
  ],
};
