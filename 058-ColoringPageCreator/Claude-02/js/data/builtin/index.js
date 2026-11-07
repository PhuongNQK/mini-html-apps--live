/** Registry of the built-in galleries (one per category). */
import characters from './characters.js';
import wearables from './wearables.js';
import props from './props.js';
import backgrounds from './backgrounds.js';
import buildingBlocks from './buildingBlocks.js';
import animals from './animals.js';
import humans from './humans.js';
import robots from './robots.js';
import flora from './flora.js';
import houses from './houses.js';
import vehicles from './vehicles.js';

export const BUILTIN_GALLERIES = [buildingBlocks, characters, wearables, props, backgrounds, animals, humans, robots, flora, houses, vehicles];

/** Category order shown in the UI. `custom` holds everything the user creates. */
export const CATEGORIES = [
  { code: 'characters', icon: '🐱' },
  { code: 'animals', icon: '🐟' },
  { code: 'humans', icon: '🧑' },
  { code: 'robots', icon: '🤖' },
  { code: 'flora', icon: '🌸' },
  { code: 'houses', icon: '🏠' },
  { code: 'vehicles', icon: '🚗' },
  { code: 'wearables', icon: '🎩' },
  { code: 'props', icon: '🎃' },
  { code: 'backgrounds', icon: '🏞️' },
  { code: 'buildingBlocks', icon: '🔷' },
  { code: 'custom', icon: '⭐' },
];
