/**
 * Built-in gallery: Background scenes. Design grid 800x450 (16:9); the first shape of each
 * scene covers the whole grid so the scene can be scaled to cover any slide.
 */
import { L, st, starPoints } from './_shared.js';

const tinyStar = (cx, cy, r, fill = '#ffe38a') =>
  `<polygon points="${starPoints(cx, cy, r, r * 0.45)}" fill="${fill}" ${st(2)}/>`;

const cloud = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 30 C-14 30 -14 10 2 10 C4 -6 28 -8 34 6 C48 0 62 12 54 26 C60 34 54 40 46 38 H8 C4 40 0 36 0 30 Z" fill="#ffffff" ${st(3)}/></g>`;

const pine = (x, y, s = 1, fill = '#2f9e57') => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-6" y="40" width="12" height="18" fill="#8a5a2b" ${st(3)}/>
  <path d="M0 -50 L26 -6 H-26 Z" fill="${fill}" ${st(3)}/><path d="M0 -30 L34 22 H-34 Z" fill="${fill}" ${st(3)}/><path d="M0 -8 L42 44 H-42 Z" fill="${fill}" ${st(3)}/></g>`;

const smallPumpkin = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <ellipse cx="-14" cy="0" rx="14" ry="20" fill="#ff9f43" ${st(3)}/><ellipse cx="14" cy="0" rx="14" ry="20" fill="#ff9f43" ${st(3)}/>
  <ellipse cx="0" cy="0" rx="18" ry="22" fill="#ff8c42" ${st(3)}/><path d="M-3 -22 Q-2 -34 8 -36 Q5 -28 5 -22 Z" fill="#6bcb77" ${st(3)}/></g>`;

const cottage = (x, y, s = 1, wall = '#ffe2b8', roof = '#e53935') => `<g transform="translate(${x} ${y}) scale(${s})">
  <rect x="-40" y="-40" width="80" height="60" fill="${wall}" ${st(3)}/>
  <path d="M-50 -38 L0 -80 L50 -38 Z" fill="${roof}" ${st(3)}/>
  <rect x="-10" y="-8" width="20" height="28" rx="3" fill="#8a5a2b" ${st(3)}/>
  <rect x="-34" y="-28" width="18" height="18" fill="#ffe38a" ${st(3)}/><rect x="16" y="-28" width="18" height="18" fill="#ffe38a" ${st(3)}/></g>`;

export default {
  category: 'backgrounds',
  items: [
    {
      id: 'bg_haunted_night',
      name: 'Haunted Night',
      svg: `<rect x="0" y="0" width="800" height="450" fill="#2f2c63"/>
        <circle cx="640" cy="100" r="52" fill="#fff3b0" ${st()}/><circle cx="624" cy="88" r="9" fill="#f2e08c"/><circle cx="660" cy="116" r="6" fill="#f2e08c"/>
        ${tinyStar(90, 60, 10)}${tinyStar(220, 110, 8)}${tinyStar(380, 50, 9)}${tinyStar(500, 120, 7)}${tinyStar(760, 200, 8)}${tinyStar(40, 190, 7)}
        <path d="M0 340 Q140 292 280 330 T560 326 T800 336 V450 H0 Z" fill="#44407f" ${st()}/>
        <g>
          <rect x="250" y="190" width="40" height="90" fill="#6a5a92" ${st()}/><path d="M244 192 L270 140 L296 192 Z" fill="#3a3463" ${st()}/>
          <rect x="120" y="250" width="190" height="100" fill="#6a5a92" ${st()}/>
          <path d="M104 254 L190 176 L330 254 Z" fill="#3a3463" ${st()}/>
          <rect x="146" y="278" width="26" height="36" fill="#ffd23f" ${st()}/><rect x="206" y="278" width="26" height="36" fill="#ffd23f" ${st()}/>
          <rect x="258" y="214" width="24" height="30" fill="#ffd23f" ${st()}/>
          <path d="M176 350 V322 Q190 306 204 322 V350 Z" fill="#2a2450" ${st()}/>
          <path d="M159 278 V314 M146 296 H172 M219 278 V314 M206 296 H232" fill="none" ${st(2)}/>
        </g>
        <path d="M540 350 L552 220 L566 350 Z" fill="#4b3f66" ${st()}/>
        <path d="M552 250 L508 214 M552 270 L600 232 M552 226 L560 180 M510 214 L496 196 M600 232 L620 214" fill="none" stroke="#4b3f66" stroke-width="9" stroke-linecap="round"/>
        <path d="M430 128 Q444 116 458 128 Q444 124 430 128 Z M358 188 Q370 178 382 188 Q370 184 358 188 Z" fill="#1d1b3a" ${st(2)}/>
        ${smallPumpkin(430, 400, 1.2)}${smallPumpkin(620, 410, 1)}${smallPumpkin(720, 395, 0.8)}
        <path d="M60 340 L62 300 Q86 270 110 300 L112 340 Z" fill="#c9ced6" ${st()}/><path d="M86 296 V326 M76 308 H96" fill="none" ${st(3)}/>`,
    },
    {
      id: 'bg_pumpkin_patch',
      name: 'Pumpkin Patch',
      svg: `<rect x="0" y="0" width="800" height="450" fill="#ffe3a8"/>
        <circle cx="620" cy="90" r="54" fill="#ffb347" ${st()}/>
        ${cloud(90, 60, 1.4)}${cloud(330, 110, 1)}
        <path d="M0 250 Q200 170 400 240 T800 220 V450 H0 Z" fill="#9ed36a" ${st()}/>
        <path d="M0 320 Q220 270 420 320 T800 310 V450 H0 Z" fill="#7cc055" ${st()}/>
        <g>
          <rect x="108" y="150" width="14" height="110" fill="#8a5a2b" ${st()}/>
          <circle cx="115" cy="130" r="54" fill="#ff9f43" ${st()}/><circle cx="90" cy="120" r="30" fill="#ffb862" ${st(2)}/><circle cx="142" cy="140" r="26" fill="#ffb862" ${st(2)}/>
        </g>
        <path d="M520 262 V220 M500 262 V224 M540 262 V224 M580 262 V224 M600 262 V220 M480 244 H620 M480 232 H620" fill="none" stroke="#a9744c" stroke-width="7" stroke-linecap="round"/>
        ${smallPumpkin(160, 360, 1.5)}${smallPumpkin(330, 390, 1.9)}${smallPumpkin(520, 372, 1.4)}${smallPumpkin(680, 400, 1.7)}${smallPumpkin(430, 330, 1)}${smallPumpkin(240, 320, 0.9)}
        <path d="M0 420 Q20 400 40 420 M740 428 Q760 408 780 428" fill="none" stroke="#43b05c" stroke-width="5" stroke-linecap="round"/>`,
    },
    {
      id: 'bg_winter_village',
      name: 'Winter Village',
      svg: `<rect x="0" y="0" width="800" height="450" fill="#cfe9ff"/>
        <circle cx="660" cy="86" r="42" fill="#fff6c2" ${st()}/>
        ${cloud(120, 70, 1.3)}${cloud(400, 40, 1)}
        <path d="M0 270 Q160 210 320 262 T640 250 T800 266 V450 H0 Z" fill="#ffffff" ${st()}/>
        ${cottage(170, 280, 1.2, '#ffe2b8', '#d94a4a')}${cottage(560, 290, 1, '#d6f0e0', '#4d7ee0')}
        ${pine(70, 270, 0.9)}${pine(300, 292, 0.8)}${pine(440, 280, 1.1)}${pine(730, 280, 0.9)}
        <path d="M0 360 Q200 330 400 366 T800 350 V450 H0 Z" fill="#eef6ff" ${st()}/>
        <circle cx="250" cy="396" r="22" fill="#ffffff" ${st()}/><circle cx="250" cy="360" r="16" fill="#ffffff" ${st()}/><circle cx="250" cy="334" r="11" fill="#ffffff" ${st()}/>
        <path d="M252 334 L264 338 L252 340 Z" fill="#ff8c42" ${st(2)}/>
        <circle cx="70" cy="120" r="6" fill="#ffffff" ${st(2)}/><circle cx="260" cy="150" r="5" fill="#ffffff" ${st(2)}/><circle cx="480" cy="170" r="7" fill="#ffffff" ${st(2)}/><circle cx="600" cy="60" r="5" fill="#ffffff" ${st(2)}/><circle cx="740" cy="170" r="6" fill="#ffffff" ${st(2)}/><circle cx="360" cy="90" r="5" fill="#ffffff" ${st(2)}/>`,
    },
    {
      id: 'bg_christmas_room',
      name: 'Christmas Room',
      svg: `<rect x="0" y="0" width="800" height="450" fill="#f7d9aa"/>
        <rect x="0" y="330" width="800" height="120" fill="#b97a4a" ${st()}/>
        <path d="M0 360 H800 M0 395 H800 M0 428 H800" fill="none" ${st(2)}/>
        <rect x="70" y="60" width="170" height="150" fill="#2f3f7a" ${st(5)}/>
        <path d="M155 60 V210 M70 135 H240" fill="none" ${st(4)}/>
        ${tinyStar(110, 92, 8)}${tinyStar(200, 100, 6)}${tinyStar(120, 170, 6)}
        <circle cx="190" cy="168" r="5" fill="#ffffff" ${st(2)}/><circle cx="215" cy="190" r="4" fill="#ffffff" ${st(2)}/>
        <rect x="300" y="170" width="210" height="160" fill="#b4573b" ${st()}/>
        <rect x="288" y="150" width="234" height="26" fill="#8a5a2b" ${st()}/>
        <path d="M335 330 V250 Q405 190 475 250 V330 Z" fill="#3a2a22" ${st()}/>
        <path d="M368 330 Q380 280 405 262 Q412 290 420 300 Q430 280 440 330 Z" fill="#ff9f43" ${st(3)}/><path d="M392 330 Q404 300 414 330 Z" fill="#ffd23f" ${st(2)}/>
        <path d="M316 150 V128 H346 V150 Z" fill="#e53935" ${st(3)}/><path d="M456 150 V128 H486 V150 Z" fill="#43b05c" ${st(3)}/>
        <path d="M556 330 L640 214 L724 330 Z" fill="#43b05c" ${st()}/><path d="M572 270 L640 170 L708 270 Z" fill="#4cc26a" ${st()}/><path d="M592 214 L640 120 L688 214 Z" fill="#58d078" ${st()}/>
        <rect x="628" y="330" width="24" height="26" fill="#8a5a2b" ${st()}/>
        <polygon points="${starPoints(640, 112, 16, 7)}" fill="#ffd23f" ${st(3)}/>
        <circle cx="610" cy="250" r="7" fill="#e53935" ${st(2.5)}/><circle cx="660" cy="200" r="7" fill="#ffd23f" ${st(2.5)}/><circle cx="640" cy="290" r="7" fill="#4d96ff" ${st(2.5)}/><circle cx="600" cy="315" r="7" fill="#ffd23f" ${st(2.5)}/><circle cx="680" cy="312" r="7" fill="#e53935" ${st(2.5)}/>
        <rect x="590" y="352" width="40" height="34" fill="#4d96ff" ${st(3)}/><rect x="656" y="360" width="36" height="28" fill="#ff6b6b" ${st(3)}/>
        <path d="M584 369 H636 M610 352 V386 M674 360 V388 M656 374 H692" fill="none" ${st(2.5)}/>
        <ellipse cx="420" cy="410" rx="150" ry="26" fill="#e8605f" ${st()}/><ellipse cx="420" cy="410" rx="100" ry="15" fill="none" stroke="#ffffff" stroke-width="4"/>`,
    },
    {
      id: 'bg_sunny_farm',
      name: 'Sunny Farm',
      svg: `<rect x="0" y="0" width="800" height="450" fill="#bfe6ff"/>
        <circle cx="130" cy="90" r="54" fill="#ffd23f" ${st()}/>
        ${cloud(330, 70, 1.4)}${cloud(560, 120, 1)}
        <path d="M0 250 Q180 170 380 240 T800 230 V450 H0 Z" fill="#9ed36a" ${st()}/>
        <path d="M0 330 Q240 280 440 330 T800 320 V450 H0 Z" fill="#7cc055" ${st()}/>
        <rect x="520" y="170" width="190" height="130" fill="#d94a4a" ${st()}/>
        <path d="M500 176 L615 100 L730 176 Z" fill="#b83a3a" ${st()}/>
        <rect x="570" y="212" width="90" height="88" fill="#fff4e0" ${st(3.5)}/>
        <path d="M570 212 L660 300 M660 212 L570 300 M615 212 V300" fill="none" ${st(3)}/>
        <circle cx="615" cy="152" r="14" fill="#fff4e0" ${st(3)}/>
        <rect x="716" y="130" width="38" height="170" rx="10" fill="#e8e1d2" ${st()}/><path d="M712 132 Q735 100 758 132 Z" fill="#b83a3a" ${st()}/>
        <path d="M30 340 H360 M30 372 H360" fill="none" stroke="#a9744c" stroke-width="9" stroke-linecap="round"/>
        <path d="M60 322 V390 M130 322 V390 M200 322 V390 M270 322 V390 M340 322 V390" fill="none" stroke="#a9744c" stroke-width="12" stroke-linecap="round"/>
        <g fill="#ffffff" ${st(2.5)}>
          <circle cx="420" cy="400" r="9"/><circle cx="470" cy="418" r="9"/><circle cx="560" cy="405" r="9"/>
        </g>
        <g><circle cx="420" cy="400" r="4" fill="#ff6b9d"/><circle cx="470" cy="418" r="4" fill="#ffd23f"/><circle cx="560" cy="405" r="4" fill="#ff6b9d"/></g>`,
    },
  ],
};
