/**
 * Fonts offered for text. `css` is the font-family value; `web` fonts are loaded from Google Fonts
 * (see index.html) and fall back to a generic family when offline. To add a font: link it in index.html
 * (if it is a web font) and add one line here.
 */
export const FONTS = [
  { id: 'fredoka', label: 'Fredoka', css: "'Fredoka', 'Comic Sans MS', sans-serif", web: true },
  { id: 'baloo', label: 'Baloo', css: "'Baloo 2', 'Comic Sans MS', sans-serif", web: true },
  { id: 'chewy', label: 'Chewy', css: "'Chewy', 'Comic Sans MS', cursive", web: true },
  { id: 'patrick', label: 'Patrick Hand', css: "'Patrick Hand', 'Comic Sans MS', cursive", web: true },
  { id: 'caveat', label: 'Caveat', css: "'Caveat', cursive", web: true },
  { id: 'pacifico', label: 'Pacifico', css: "'Pacifico', cursive", web: true },
  { id: 'lobster', label: 'Lobster', css: "'Lobster', cursive", web: true },
  { id: 'bangers', label: 'Bangers', css: "'Bangers', Impact, sans-serif", web: true },
  { id: 'creepster', label: 'Creepster (Halloween)', css: "'Creepster', fantasy", web: true },
  { id: 'xmas', label: 'Mountains of Christmas', css: "'Mountains of Christmas', cursive", web: true },
  { id: 'arial', label: 'Arial', css: 'Arial, Helvetica, sans-serif' },
  { id: 'verdana', label: 'Verdana', css: 'Verdana, Geneva, sans-serif' },
  { id: 'trebuchet', label: 'Trebuchet MS', css: "'Trebuchet MS', sans-serif" },
  { id: 'georgia', label: 'Georgia', css: 'Georgia, serif' },
  { id: 'times', label: 'Times New Roman', css: "'Times New Roman', Times, serif" },
  { id: 'courier', label: 'Courier New', css: "'Courier New', monospace" },
  { id: 'comic', label: 'Comic Sans MS', css: "'Comic Sans MS', 'Comic Neue', cursive" },
  { id: 'impact', label: 'Impact', css: 'Impact, Haettenschweiler, sans-serif' },
];

export const DEFAULT_FONT = 'fredoka';
export const fontById = (id) => FONTS.find((f) => f.id === id) || FONTS[0];
