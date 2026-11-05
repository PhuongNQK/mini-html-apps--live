/** Drawing helpers shared by the built-in gallery files. */
export const L = '#2b2b3b'; // outline colour used in Colored mode

/** Stroke attributes (outline). */
export const st = (w = 3) => `stroke="${L}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/** Cartoon eye: dark disc + white sparkle. */
export const eye = (cx, cy, r = 4.5) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${L}"/><circle cx="${+(cx + r * 0.35).toFixed(2)}" cy="${+(cy - r * 0.4).toFixed(2)}" r="${+(r * 0.38).toFixed(2)}" fill="#ffffff"/>`;

/** Happy closed eye (arc). */
export const happyEye = (cx, cy, w = 6) =>
  `<path d="M${cx - w} ${cy} Q${cx} ${cy - w * 1.2} ${cx + w} ${cy}" fill="none" ${st(2.5)}/>`;

export const cheek = (cx, cy, rx = 5, ry = 3.2) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#ff9eb5" opacity="0.75"/>`;

/** Star polygon points. */
export function starPoints(cx, cy, R, r, n = 5) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const radius = i % 2 === 0 ? R : r;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push(`${+(cx + radius * Math.cos(a)).toFixed(2)},${+(cy + radius * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

export const star = (cx, cy, R, r, fill = '#ffd23f', w = 3) =>
  `<polygon points="${starPoints(cx, cy, R, r)}" fill="${fill}" ${st(w)}/>`;
