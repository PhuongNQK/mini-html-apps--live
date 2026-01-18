import { WIMPY_VOCAB, WIMPY_PHRASES } from '../data/modules/wimpy-kid.js';
import { WIMPY_VOCAB_EXTENDED } from '../data/modules/wimpy-vocab-extended.js';
import { WIMPY_PHRASES_EXTENDED } from '../data/modules/wimpy-phrases-extended.js';
import { CODING_VOCAB_EXTENDED } from '../data/modules/coding-vocab-extended.js';
import { CODING_PHRASES_EXTENDED } from '../data/modules/coding-phrases-extended.js';
import { VOCAB_BASIC } from '../data/modules/mock-vocab.js';

export function getContentById(moduleId) {
    switch (moduleId) {
        case 'wimpy-family':
        case 'wimpy-school':
        case 'wimpy-feelings':
            // Merge basic + extended for now to give volume
            return [...WIMPY_VOCAB, ...WIMPY_VOCAB_EXTENDED];
        case 'wimpy-sentences':
        case 'wimpy-diary': // Map Diary to Phrases for now
            return [...WIMPY_PHRASES, ...WIMPY_PHRASES_EXTENDED];
        case 'code-basics':
        case 'code-logic':
            return [...CODING_VOCAB_EXTENDED];
        case 'code-projects': // Map Projects to Phrases
            return [...CODING_PHRASES_EXTENDED];
        default:
            return VOCAB_BASIC; // Fallback
    }
}
