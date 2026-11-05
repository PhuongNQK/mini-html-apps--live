/** Registry of the built-in galleries (one per category). */
import characters from './characters.js';
import wearables from './wearables.js';
import props from './props.js';
import backgrounds from './backgrounds.js';
import buildingBlocks from './buildingBlocks.js';

export const BUILTIN_GALLERIES = [characters, wearables, props, backgrounds, buildingBlocks];

/** Category order shown in the UI. `custom` holds everything the user creates. */
export const CATEGORIES = [
  { code: 'characters', icon: '🐱' },
  { code: 'wearables', icon: '🎩' },
  { code: 'props', icon: '🎃' },
  { code: 'backgrounds', icon: '🏞️' },
  { code: 'buildingBlocks', icon: '🔷' },
  { code: 'custom', icon: '⭐' },
];
