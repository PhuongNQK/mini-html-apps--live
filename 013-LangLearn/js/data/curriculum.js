export const CURRICULUM = [
    {
        id: 'week1-7',
        title: 'Weeks 1-7',
        description: 'Wimpy Kid Favorites: Basics',
        modules: [
            { id: 'wimpy-words-1', name: '50 Words', type: 'vocab' },
            { id: 'wimpy-words-2', name: '100 Words', type: 'vocab' },
            { id: 'wimpy-words-3', name: '150 Words', type: 'vocab' },
            { id: 'wimpy-words-4', name: '200 Words', type: 'vocab' },
            { id: 'wimpy-words-5', name: '250 Words', type: 'vocab' },
            { id: 'wimpy-words-6', name: '300 Words', type: 'vocab' },
            { id: 'wimpy-words-all', name: 'All Words', type: 'vocab' },
        ]
    },
    {
        id: 'week8-14',
        title: 'Weeks 8-14',
        description: 'Wimpy Kid: Storytelling',
        modules: [
            { id: 'wimpy-phrases-1', name: '50 Phrases / Sentences', type: 'sentence' },
            { id: 'wimpy-phrases-2', name: '100 Phrases / Sentences', type: 'sentence' },
            { id: 'wimpy-phrases-3', name: '150 Phrases / Sentences', type: 'sentence' },
            { id: 'wimpy-phrases-4', name: '200 Phrases / Sentences', type: 'sentence' },
            { id: 'wimpy-phrases-5', name: '250 Phrases / Sentences', type: 'sentence' },
            { id: 'wimpy-phrases-6', name: '300 Phrases / Sentences', type: 'sentence' },
            { id: 'wimpy-phrases-all', name: 'All Phrases / Sentences', type: 'sentence' }
        ]
    },
    {
        id: 'week15-20',
        title: 'Weeks 15-20',
        description: 'Coding Words',
        modules: [
            { id: 'code-words-1', name: '50 Words', type: 'vocab' },
            { id: 'code-words-2', name: '100 Words', type: 'vocab' },
            { id: 'code-words-3', name: '150 Words', type: 'vocab' },
            { id: 'code-words-4', name: '200 Words', type: 'vocab' },
            { id: 'code-words-5', name: '250 Words', type: 'vocab' },
            { id: 'code-words-all', name: 'All Words', type: 'vocab' }
        ]
    },
    {
        id: 'week21-26',
        title: 'Weeks 21-26',
        description: 'Coding Phrases',
        modules: [
            { id: 'code-phrases-1', name: '50 Phrases / Sentences', type: 'sentence' },
            { id: 'code-phrases-2', name: '100 Phrases / Sentences', type: 'sentence' },
            { id: 'code-phrases-3', name: '150 Phrases / Sentences', type: 'sentence' },
            { id: 'code-phrases-4', name: '200 Phrases / Sentences', type: 'sentence' },
            { id: 'code-phrases-5', name: '250 Phrases / Sentences', type: 'sentence' },
            { id: 'code-phrases-all', name: 'All Phrases / Sentences', type: 'sentence' }
        ]
    }
];

export const getModuleById = (moduleId) => {
    for (let weekGroup of CURRICULUM) {
        const module = weekGroup.modules.find(module => module.id === moduleId);
        if (module) {
            return { ...module, weekGroup: { ...weekGroup } };
        }
    }

    return null;
}