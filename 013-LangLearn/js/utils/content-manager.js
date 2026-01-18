import { WIMPY_VOCAB_EXTENDED } from '../data/modules/wimpy-vocab-extended.js';
import { WIMPY_PHRASES_EXTENDED } from '../data/modules/wimpy-phrases-extended.js';
import { CODING_VOCAB_EXTENDED } from '../data/modules/coding-vocab-extended.js';
import { CODING_PHRASES_EXTENDED } from '../data/modules/coding-phrases-extended.js';
import { VOCAB_BASIC } from '../data/modules/basic-vocab.js';
import { PHRASES_BASIC } from '../data/modules/basic-phrases.js';

// Wimpy: 7 weeks
// Coding: 6 weeks

const UNITS_PER_WEEK = 50;

function getFirstUnits(sourceArray, firstCount) {
    return sourceArray.slice(0, firstCount);
}

function getForWeek(sourceArray, moduleId, prefix) {
    if (!moduleId.startsWith(prefix)) {
        return null;
    }

    const weekNumber = parseInt(moduleId.substring(prefix.length));
    if (isNaN(weekNumber)) {
        return [...sourceArray];
    }

    const firstCount = UNITS_PER_WEEK * weekNumber;
    return getFirstUnits([...sourceArray], firstCount);
}

export function getContentById(moduleId) {
    const prefixes = ['wimpy-words-', 'wimpy-phrases-', 'code-words-', 'code-phrases-'];
    const sources = [WIMPY_VOCAB_EXTENDED, WIMPY_PHRASES_EXTENDED, CODING_VOCAB_EXTENDED, CODING_PHRASES_EXTENDED];

    let content = null;
    for (let i = 0; i < prefixes.length; i++) {
        content = getForWeek(sources[i], moduleId, prefixes[i])
        if (content) {
            return content;
        }
    }

    if (!content) {
        return [...VOCAB_BASIC];
    }
}
