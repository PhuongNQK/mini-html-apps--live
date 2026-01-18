export const ALPHABETS = {
    en: {
        scripts: [
            {
                id: 'latin',
                name: 'Alphabet',
                letters: [
                    { char: 'A', word: 'Apple', image: '🍎' },
                    { char: 'B', word: 'Ball', image: '⚽' },
                    { char: 'C', word: 'Cat', image: '🐱' },
                    { char: 'D', word: 'Dog', image: '🐶' },
                    { char: 'E', word: 'Elephant', image: '🐘' },
                    { char: 'F', word: 'Fish', image: '🐟' },
                    { char: 'G', word: 'Giraffe', image: '🦒' },
                    { char: 'H', word: 'Hat', image: '🎩' },
                    { char: 'I', word: 'Igloo', image: '🧊' },
                    { char: 'J', word: 'Juice', image: '🧃' },
                    { char: 'K', word: 'Kite', image: '🪁' },
                    { char: 'L', word: 'Lion', image: '🦁' },
                    { char: 'M', word: 'Monkey', image: '🐒' },
                    { char: 'N', word: 'Nose', image: '👃' },
                    { char: 'O', word: 'Octopus', image: '🐙' },
                    { char: 'P', word: 'Pig', image: '🐷' },
                    { char: 'Q', word: 'Queen', image: '👑' },
                    { char: 'R', word: 'Rabbit', image: '🐰' },
                    { char: 'S', word: 'Sun', image: '☀️' },
                    { char: 'T', word: 'Tiger', image: '🐅' },
                    { char: 'U', word: 'Umbrella', image: '☂️' },
                    { char: 'V', word: 'Van', image: '🚐' },
                    { char: 'W', word: 'Whale', image: '🐳' },
                    { char: 'X', word: 'Xylophone', image: '🎹' },
                    { char: 'Y', word: 'Yo-yo', image: '🪀' },
                    { char: 'Z', word: 'Zebra', image: '🦓' }
                ]
            }
        ]
    },
    // Vietnamese (Latin-based with variations, stripped for basic, extended later)
    vi: {
        scripts: [
            {
                id: 'vietnamese',
                name: 'Chữ cái',
                letters: [
                    { char: 'A', word: 'Anh', image: '👦' },
                    { char: 'Ă', word: 'Ăn', image: '🥣' },
                    { char: 'Â', word: 'Âu', image: '🥣' },
                    { char: 'B', word: 'Bà', image: '👵' },
                    { char: 'C', word: 'Cá', image: '🐟' },
                    { char: 'D', word: 'Dê', image: '🐐' },
                    { char: 'Đ', word: 'Đá', image: '🪨' },
                    { char: 'E', word: 'Em', image: '👶' },
                    { char: 'Ê', word: 'Êch', image: '🐸' },
                    { char: 'G', word: 'Gà', image: '🐔' },
                    { char: 'H', word: 'Hổ', image: '🐅' },
                    { char: 'I', word: 'Im lặng', image: '🤫' },
                    { char: 'K', word: 'Kem', image: '🍦' },
                    { char: 'L', word: 'Lá', image: '🍃' },
                    { char: 'M', word: 'Mèo', image: '🐱' },
                    { char: 'N', word: 'Nơ', image: '🎀' },
                    { char: 'O', word: 'Ong', image: '🐝' },
                    { char: 'Ô', word: 'Ô', image: '☂️' },
                    { char: 'Ơ', word: 'Ơ', image: '🎀' },
                    { char: 'P', word: 'Pin', image: '🔋' },
                    { char: 'Q', word: 'Quà', image: '🎁' },
                    { char: 'R', word: 'Rùa', image: '🐢' },
                    { char: 'S', word: 'Sách', image: '📕' },
                    { char: 'T', word: 'Táo', image: '🍎' },
                    { char: 'U', word: 'Ủng', image: '👢' },
                    { char: 'Ư', word: 'Ưng', image: '🦅' },
                    { char: 'V', word: 'Vịt', image: '🦆' },
                    { char: 'X', word: 'Xe', image: '🚗' },
                    { char: 'Y', word: 'Y tá', image: '👩‍⚕️' }
                ]
            }
        ]
    },
    es: {
        scripts: [
            {
                id: 'spanish',
                name: 'Alfabeto',
                letters: [
                    { char: 'A', word: 'Árbol', image: '🌳' }, { char: 'B', word: 'Bebé', image: '👶' }, { char: 'C', word: 'Casa', image: '🏠' },
                    { char: 'D', word: 'Dedo', image: '👆' }, { char: 'E', word: 'Elefante', image: '🐘' }, { char: 'F', word: 'Flor', image: '🌸' },
                    { char: 'G', word: 'Gato', image: '🐱' }, { char: 'H', word: 'Helado', image: '🍦' }, { char: 'I', word: 'Isla', image: '🏝️' },
                    { char: 'J', word: 'Jirafa', image: '🦒' }, { char: 'K', word: 'Koala', image: '🐨' }, { char: 'L', word: 'León', image: '🦁' },
                    { char: 'M', word: 'Manzana', image: '🍎' }, { char: 'N', word: 'Nido', image: '🪺' }, { char: 'Ñ', word: 'Ñu', image: '🐂' },
                    { char: 'O', word: 'Oso', image: '🐻' }, { char: 'P', word: 'Pato', image: '🦆' }, { char: 'Q', word: 'Queso', image: '🧀' },
                    { char: 'R', word: 'Ratón', image: '🐁' }, { char: 'S', word: 'Sol', image: '☀️' }, { char: 'T', word: 'Tigre', image: '🐅' },
                    { char: 'U', word: 'Uva', image: '🍇' }, { char: 'V', word: 'Vaca', image: '🐄' }, { char: 'W', word: 'Wafle', image: '🧇' },
                    { char: 'X', word: 'Xilófono', image: '🎹' }, { char: 'Y', word: 'Yoyó', image: '🪀' }, { char: 'Z', word: 'Zanahoria', image: '🥕' }
                ]
            }
        ]
    },
    fr: {
        scripts: [
            {
                id: 'french',
                name: 'Alphabet',
                letters: [
                    { char: 'A', word: 'Avion', image: '✈️' }, { char: 'B', word: 'Bateau', image: '⛵' }, { char: 'C', word: 'Chat', image: '🐱' },
                    { char: 'D', word: 'Dauphin', image: '🐬' }, { char: 'E', word: 'Éléphant', image: '🐘' }, { char: 'F', word: 'Fraise', image: '🍓' },
                    { char: 'G', word: 'Girafe', image: '🦒' }, { char: 'H', word: 'Hibou', image: '🦉' }, { char: 'I', word: 'Île', image: '🏝️' },
                    { char: 'J', word: 'Jus', image: '🧃' }, { char: 'K', word: 'Kangourou', image: '🦘' }, { char: 'L', word: 'Lune', image: '🌙' },
                    { char: 'M', word: 'Maison', image: '🏠' }, { char: 'N', word: 'Nuage', image: '☁️' }, { char: 'O', word: 'Orange', image: '🍊' },
                    { char: 'P', word: 'Pomme', image: '🍎' }, { char: 'Q', word: 'Quatre', image: '4️⃣' }, { char: 'R', word: 'Robot', image: '🤖' },
                    { char: 'S', word: 'Soleil', image: '☀️' }, { char: 'T', word: 'Tortue', image: '🐢' }, { char: 'U', word: 'Usine', image: '🏭' },
                    { char: 'V', word: 'Voiture', image: '🚗' }, { char: 'W', word: 'Wagon', image: '🚃' }, { char: 'X', word: 'Xylophone', image: '🎹' },
                    { char: 'Y', word: 'Yaourt', image: '🥣' }, { char: 'Z', word: 'Zèbre', image: '🦓' }
                ]
            }
        ]
    },
    de: {
        scripts: [
            {
                id: 'german',
                name: 'Alphabet',
                letters: [
                    { char: 'A', word: 'Apfel', image: '🍎' }, { char: 'B', word: 'Ball', image: '⚽' }, { char: 'C', word: 'Computer', image: '💻' },
                    { char: 'D', word: 'Dolphin', image: '🐬' }, { char: 'E', word: 'Elefant', image: '🐘' }, { char: 'F', word: 'Fisch', image: '🐟' },
                    { char: 'G', word: 'Giraffe', image: '🦒' }, { char: 'H', word: 'Haus', image: '🏠' }, { char: 'I', word: 'Igel', image: '🦔' },
                    { char: 'J', word: 'Jacke', image: '🧥' }, { char: 'K', word: 'Katze', image: '🐱' }, { char: 'L', word: 'Löwe', image: '🦁' },
                    { char: 'M', word: 'Maus', image: '🐭' }, { char: 'N', word: 'Nase', image: '👃' }, { char: 'O', word: 'Orange', image: '🍊' },
                    { char: 'P', word: 'Pizza', image: '🍕' }, { char: 'Q', word: 'Qualle', image: '🪼' }, { char: 'R', word: 'Regenbogen', image: '🌈' },
                    { char: 'S', word: 'Sonne', image: '☀️' }, { char: 'T', word: 'Tiger', image: '🐅' }, { char: 'U', word: 'Uhr', image: '⏰' },
                    { char: 'V', word: 'Vogel', image: '🐦' }, { char: 'W', word: 'Wasser', image: '💧' }, { char: 'X', word: 'Xylophon', image: '🎹' },
                    { char: 'Y', word: 'Yak', image: '🐂' }, { char: 'Z', word: 'Zebra', image: '🦓' },
                    { char: 'Ä', word: 'Äpfel', image: '🍎' }, { char: 'Ö', word: 'Öl', image: '🛢️' }, { char: 'Ü', word: 'Überraschung', image: '🎁' },
                    { char: 'ß', word: 'Fuß', image: '🦶' }
                ]
            }
        ]
    },
    it: {
        scripts: [
            {
                id: 'italian',
                name: 'Alfabeto',
                letters: [
                    { char: 'A', word: 'Albero', image: '🌳' }, { char: 'B', word: 'Bambino', image: '👶' }, { char: 'C', word: 'Cane', image: '🐶' },
                    { char: 'D', word: 'Dado', image: '🎲' }, { char: 'E', word: 'Elefante', image: '🐘' }, { char: 'F', word: 'Fiore', image: '🌸' },
                    { char: 'G', word: 'Gatto', image: '🐱' }, { char: 'H', word: 'Hotel', image: '🏨' }, { char: 'I', word: 'Isola', image: '🏝️' },
                    { char: 'L', word: 'Leone', image: '🦁' }, { char: 'M', word: 'Mela', image: '🍎' }, { char: 'N', word: 'Nave', image: '🚢' },
                    { char: 'O', word: 'Orologio', image: '⏰' }, { char: 'P', word: 'Palla', image: '⚽' }, { char: 'Q', word: 'Quadro', image: '🖼️' },
                    { char: 'R', word: 'Rana', image: '🐸' }, { char: 'S', word: 'Sole', image: '☀️' }, { char: 'T', word: 'Tigre', image: '🐅' },
                    { char: 'U', word: 'Uva', image: '🍇' }, { char: 'V', word: 'Vaso', image: '🏺' }, { char: 'Z', word: 'Zebra', image: '🦓' },
                    // Integrating foreign letters commonly taught
                    { char: 'J', word: 'Jeans', image: '👖' }, { char: 'K', word: 'Kiwi', image: '🥝' }, { char: 'W', word: 'Wurstel', image: '🌭' },
                    { char: 'X', word: 'Xilofono', image: '🎹' }, { char: 'Y', word: 'Yogurt', image: '🥣' }
                ]
            }
        ]
    },
    pt: {
        scripts: [
            {
                id: 'portuguese',
                name: 'Alfabeto',
                letters: [
                    { char: 'A', word: 'Abelha', image: '🐝' }, { char: 'B', word: 'Bola', image: '⚽' }, { char: 'C', word: 'Casa', image: '🏠' },
                    { char: 'D', word: 'Dado', image: '🎲' }, { char: 'E', word: 'Elefante', image: '🐘' }, { char: 'F', word: 'Flor', image: '🌸' },
                    { char: 'G', word: 'Gato', image: '🐱' }, { char: 'H', word: 'Hipopótamo', image: '🦛' }, { char: 'I', word: 'Igreja', image: '⛪' },
                    { char: 'J', word: 'Jacaré', image: '🐊' }, { char: 'K', word: 'Kiwi', image: '🥝' }, { char: 'L', word: 'Leão', image: '🦁' },
                    { char: 'M', word: 'Macaco', image: '🐒' }, { char: 'N', word: 'Navio', image: '🚢' }, { char: 'O', word: 'Ovo', image: '🥚' },
                    { char: 'P', word: 'Pato', image: '🦆' }, { char: 'Q', word: 'Queijo', image: '🧀' }, { char: 'R', word: 'Rato', image: '🐁' },
                    { char: 'S', word: 'Sapo', image: '🐸' }, { char: 'T', word: 'Tatu', image: '🦔' }, { char: 'U', word: 'Uva', image: '🍇' },
                    { char: 'V', word: 'Vaca', image: '🐄' }, { char: 'W', word: 'Web', image: '🌐' }, { char: 'X', word: 'Xícara', image: '☕' },
                    { char: 'Y', word: 'YouTube', image: '📺' }, { char: 'Z', word: 'Zebra', image: '🦓' }
                ]
            }
        ]
    },

    // Complex Scripts
    ja: {
        scripts: [
            {
                id: 'hiragana',
                name: 'Hiragana',
                letters: [
                    { char: 'あ', word: 'Ari', image: '🐜' }, { char: 'い', word: 'Inu', image: '🐶' }, { char: 'う', word: 'Ushi', image: '🐄' }, { char: 'え', word: 'E', image: '🖼️' }, { char: 'お', word: 'Onigiri', image: '🍙' },
                    { char: 'か', word: 'Kasa', image: '☂️' }, { char: 'き', word: 'Ki', image: '🌳' }, { char: 'く', word: 'Kutsu', image: '👞' }, { char: 'け', word: 'Keeki', image: '🍰' }, { char: 'こ', word: 'Koma', image: '🕷️' },
                    { char: 'さ', word: 'Sakana', image: '🐟' }, { char: 'し', word: 'Shinkansen', image: '🚄' }, { char: 'す', word: 'Suika', image: '🍉' }, { char: 'せ', word: 'Semi', image: '🦗' }, { char: 'そ', word: 'Sora', image: '⛅' },
                    { char: 'た', word: 'Tamago', image: '🥚' }, { char: 'ち', word: 'Chizu', image: '🧀' }, { char: 'つ', word: 'Tsukushi', image: '🌱' }, { char: 'て', word: 'Tebukuro', image: '🧤' }, { char: 'と', word: 'Tomato', image: '🍅' },
                    { char: 'な', word: 'Nasu', image: '🍆' }, { char: 'に', word: 'Nijin', image: '🥕' }, { char: 'ぬ', word: 'Nuigurumi', image: '🧸' }, { char: 'ね', word: 'Neko', image: '🐱' }, { char: 'の', word: 'Nori', image: '🍙' },
                    { char: 'は', word: 'Hana', image: '🌸' }, { char: 'ひ', word: 'Himawari', image: '🌻' }, { char: 'ふ', word: 'Fusen', image: '🎈' }, { char: 'へ', word: 'Hebi', image: '🐍' }, { char: 'ほ', word: 'Hoshi', image: '⭐' },
                    { char: 'ま', word: 'Mado', image: '🪟' }, { char: 'み', word: 'Mikan', image: '🍊' }, { char: 'む', word: 'Mushi', image: '🐛' }, { char: 'め', word: 'Megane', image: '👓' }, { char: 'も', word: 'Momo', image: '🍑' },
                    { char: 'や', word: 'Yama', image: '⛰️' }, { char: 'ゆ', word: 'Yuki', image: '❄️' }, { char: 'よ', word: 'Yoru', image: '🌃' },
                    { char: 'ら', word: 'Raion', image: '🦁' }, { char: 'り', word: 'Ringo', image: '🍎' }, { char: 'る', word: 'Rusuban', image: '🏠' }, { char: 'れ', word: 'Remon', image: '🍋' }, { char: 'ろ', word: 'Rosoku', image: '🕯️' },
                    { char: 'わ', word: 'Wani', image: '🐊' }, { char: 'を', word: 'O', image: '⭕' }, { char: 'ん', word: 'Un', image: '🔚' }
                ]
            },
            {
                id: 'katakana',
                name: 'Katakana',
                letters: [
                    { char: 'ア', word: 'Aisu', image: '🍨' }, { char: 'イ', word: 'Inku', image: '🖋️' }, { char: 'ウ', word: 'Uirusu', image: '🦠' }, { char: 'エ', word: 'Erebeetaa', image: '🛗' }, { char: 'オ', word: 'Orenji', image: '🍊' },
                    { char: 'カ', word: 'Kamera', image: '📷' }, { char: 'キ', word: 'Kiwi', image: '🥝' }, { char: 'ク', word: 'Kukki', image: '🍪' }, { char: 'ケ', word: 'Keeki', image: '🍰' }, { char: 'コ', word: 'Koara', image: '🐨' },
                    { char: 'サ', word: 'Sakka', image: '⚽' }, { char: 'シ', word: 'Shatsu', image: '👕' }, { char: 'ス', word: 'Supu', image: '🍲' }, { char: 'セ', word: 'Seta', image: '🧥' }, { char: 'ソ', word: 'Sosu', image: '🥫' },
                    { char: 'タ', word: 'Takushii', image: '🚕' }, { char: 'チ', word: 'Chizu', image: '🧀' }, { char: 'ツ', word: 'Tsukushi', image: '🌱' }, { char: 'テ', word: 'Terebi', image: '📺' }, { char: 'ト', word: 'Tomatom', image: '🍅' },
                    { char: 'ナ', word: 'Naifu', image: '🔪' }, { char: 'ニ', word: 'Nyusu', image: '📰' }, { char: 'ヌ', word: 'Nudoru', image: '🍜' }, { char: 'ネ', word: 'Nekutai', image: '👔' }, { char: 'ノ', word: 'Noto', image: '📓' },
                    { char: 'ハ', word: 'Hambaagaa', image: '🍔' }, { char: 'ヒ', word: 'Hiro', image: '🦸' }, { char: 'フ', word: 'Furai', image: '🍟' }, { char: 'ヘ', word: 'Herumetto', image: '⛑️' }, { char: 'ホ', word: 'Hoteru', image: '🏨' },
                    { char: 'マ', word: 'Maiku', image: '🎤' }, { char: 'ミ', word: 'Miruku', image: '🥛' }, { char: 'ム', word: 'Mun', image: '🌙' }, { char: 'メ', word: 'Meron', image: '🍈' }, { char: 'モ', word: 'Mota', image: '🛵' },
                    { char: 'ヤ', word: 'Yangu', image: '👶' }, { char: 'ユ', word: 'Yunikon', image: '🦄' }, { char: 'ヨ', word: 'Yotto', image: '⛵' },
                    { char: 'ラ', word: 'Rajio', image: '📻' }, { char: 'リ', word: 'Rabon', image: '🎀' }, { char: 'ル', word: 'Rubi', image: '💎' }, { char: 'レ', word: 'Remon', image: '🍋' }, { char: 'ロ', word: 'Robotto', image: '🤖' },
                    { char: 'ワ', word: 'Wain', image: '🍷' }, { char: 'ヲ', word: 'Wo', image: '⭕' }, { char: 'ン', word: 'Pn', image: '🍞' }
                ]
            }
        ]
    },
    ko: {
        scripts: [
            {
                id: 'hangul',
                name: 'Hangul',
                links: ['https://prepedu.com/vi/blog/bang-chu-cai-tieng-han-hangeul'],
                letters: [
                    { char: 'ㄱ', word: 'Gudu', image: '👞' }, { char: 'ㄴ', word: 'Nabi', image: '🦋' }, { char: 'ㄷ', word: 'Dari', image: '🦵' },
                    { char: 'ㄹ', word: 'Radio', image: '📻' }, { char: 'ㅁ', word: 'Moja', image: '🧢' }, { char: 'ㅂ', word: 'Banana', image: '🍌' },
                    { char: 'ㅅ', word: 'Saja', image: '🦁' }, { char: 'ㅇ', word: 'Ai', image: '👶' }, { char: 'ㅈ', word: 'Jadongcha', image: '🚗' },
                    { char: 'ㅊ', word: 'Chima', image: '👗' }, { char: 'ㅋ', word: 'Kamera', image: '📷' }, { char: 'ㅌ', word: 'Tomato', image: '🍅' },
                    { char: 'ㅍ', word: 'Podo', image: '🍇' }, { char: 'ㅎ', word: 'Haneul', image: '☁️' },
                    { char: 'ㄲ', word: 'Kkoul', image: '🍯' }, { char: 'ㄸ', word: 'Ttalgi', image: '🍓' }, { char: 'ㅃ', word: 'Ppang', image: '🍞' },
                    { char: 'ㅆ', word: 'Ssal', image: '🍚' }, { char: 'ㅉ', word: 'Jjajangmyeon', image: '🍜' },
                    { char: 'ㅏ', word: 'Agi', image: '👶' }, { char: 'ㅑ', word: 'Yagu', image: '⚾' }, { char: 'ㅓ', word: 'Eomeoni', image: '👩' },
                    { char: 'ㅕ', word: 'Yeou', image: '🦊' }, { char: 'ㅗ', word: 'Ori', image: '🦆' }, { char: 'ㅛ', word: 'Yori', image: '🍳' },
                    { char: 'ㅜ', word: 'Uyu', image: '🥛' }, { char: 'ㅠ', word: 'Yuri', image: '🥃' }, { char: 'ㅡ', word: 'Eumak', image: '🎵' },
                    { char: 'ㅣ', word: 'Ip', image: '👄' }, { char: 'ㅐ', word: 'Aengmu', image: '🦜' }, { char: 'ㅒ', word: 'Yaegi', image: '📖' },
                    { char: 'ㅔ', word: 'Energy', image: '⚡' }, { char: 'ㅖ', word: 'Yesul', image: '🎨' }, { char: 'ㅘ', word: 'Wang', image: '👑' },
                    { char: 'ㅙ', word: 'Wae', image: '❓' }, { char: 'ㅚ', word: 'Oeguk', image: '🛫' }, { char: 'ㅝ', word: 'Won', image: '🪙' },
                    { char: 'ㅞ', word: 'Wedding', image: '💒' }, { char: 'ㅟ', word: 'Wi', image: '⬆️' }, { char: 'ㅢ', word: 'Uisa', image: '👨‍⚕️' }
                ]
            }
        ]
    },
    ru: {
        scripts: [
            {
                id: 'cyrillic',
                name: 'Cyrillic',
                letters: [
                    { char: 'А', word: 'Arbuz', image: '🍉' }, { char: 'Б', word: 'Belka', image: '🐿️' }, { char: 'В', word: 'Volk', image: '🐺' }, { char: 'Г', word: 'Gus', image: '🪿' },
                    { char: 'Д', word: 'Dom', image: '🏠' }, { char: 'Е', word: 'Enot', image: '🦝' }, { char: 'Ё', word: 'Yozh', image: '🦔' }, { char: 'Ж', word: 'Zhuk', image: '🪲' },
                    { char: 'З', word: 'Zontik', image: '☂️' }, { char: 'И', word: 'Igla', image: '🪡' }, { char: 'Й', word: 'Yogurt', image: '🥣' }, { char: 'К', word: 'Kot', image: '🐱' },
                    { char: 'Л', word: 'Lisa', image: '🦊' }, { char: 'М', word: 'Medved', image: '🐻' }, { char: 'Н', word: 'Nos', image: '👃' }, { char: 'О', word: 'Oslik', image: '🫏' },
                    { char: 'П', word: 'Petukh', image: '🐓' }, { char: 'Р', word: 'Ryba', image: '🐟' }, { char: 'С', word: 'Sol', image: '🧂' }, { char: 'Т', word: 'Tigr', image: '🐅' },
                    { char: 'У', word: 'Utka', image: '🦆' }, { char: 'Ф', word: 'Flag', image: '🚩' }, { char: 'Х', word: 'Khleb', image: '🍞' }, { char: 'Ц', word: 'Tsaplya', image: '🦩' },
                    { char: 'Ч', word: 'Chasy', image: '⏰' }, { char: 'Ш', word: 'Shar', image: '🎈' }, { char: 'Щ', word: 'Shchetka', image: '🧹' }, { char: 'Ъ', word: 'Tverdy Znak', image: '🧱' },
                    { char: 'Ы', word: 'Y', image: '🧀' }, { char: 'Ь', word: 'Myagkiy Znak', image: '☁️' }, { char: 'Э', word: 'Ekran', image: '📺' }, { char: 'Ю', word: 'Yula', image: '🌪️' },
                    { char: 'Я', word: 'Yabloko', image: '🍎' }
                ]
            }
        ]
    },
    zh: {
        scripts: [
            {
                id: 'radicals',
                name: 'Radicals',
                links: ['https://www.archchinese.com/arch_chinese_radicals.html'],
                letters: [
                    { char: '一', word: "yī (one)", image: '1️⃣' },
                    { char: '丨', word: "gǔn (line)", image: '' },
                    { char: '丶', word: "zhǔ (dot)", image: '' },
                    { char: '丿', word: "piě (slash)", image: '' },
                    { char: '乙', word: "yǐ (second)", image: '' },
                    { char: '亅', word: "jué (hook)", image: '' },
                    { char: '二', word: "èr (two)", image: '2️⃣' },
                    { char: '亠', word: "tóu (lid)", image: '' },
                    { char: '人', word: "rén (person)", image: '🧍' },
                    { char: '儿', word: "ér (legs)", image: '' },
                    { char: '入', word: "rù (enter)", image: '' },
                    { char: '八', word: "bā (eight)", image: '8️⃣' },
                    { char: '冂', word: "jiǒng (down box)", image: '' },
                    { char: '冖', word: "mì (cover)", image: '' },
                    { char: '冫', word: "bīng (ice)", image: '' },
                    { char: '几', word: "jī (table)", image: '' },
                    { char: '凵', word: "qǔ (open box)", image: '' },
                    { char: '刀', word: "dāo (knife)", image: '' },
                    { char: '力', word: "lì (power)", image: '' },
                    { char: '勹', word: "bāo (wrap)", image: '' },
                    { char: '匕', word: "bǐ (dagger)", image: '' },
                    { char: '匚', word: "fāng (right open box)", image: '' },
                    { char: '匸', word: "xì (hide)", image: '' },
                    { char: '十', word: "shí (ten)", image: '🔟' },
                    { char: '卜', word: "bǔ (divine)", image: '' },
                    { char: '卩', word: "jié (seal)", image: '' },
                    { char: '厂', word: "chǎng (cliff)", image: '' },
                    { char: '厶', word: "sī (private)", image: '' },
                    { char: '又', word: "yòu (again)", image: '' },
                    { char: '口', word: "kǒu (mouth)", image: '👄' },
                    { char: '囗', word: "wéi (enclosure)", image: '' },
                    { char: '土', word: "tǔ (earth)", image: '🌍' },
                    { char: '士', word: "shì (scholar)", image: '' },
                    { char: '夂', word: "zhǐ (go)", image: '' },
                    { char: '夊', word: "suī (go slowly)", image: '' },
                    { char: '夕', word: "xī (evening)", image: '' },
                    { char: '大', word: "dà (big)", image: '🐘' },
                    { char: '女', word: "nǚ (woman)", image: '👩' },
                    { char: '子', word: "zǐ (son)", image: '👶' },
                    { char: '宀', word: "mián (roof)", image: '' },
                    { char: '寸', word: "cùn (inch)", image: '' },
                    { char: '小', word: "xiǎo (small)", image: '🐜' },
                    { char: '尢', word: "wāng (lame)", image: '' },
                    { char: '尸', word: "shī (corpse)", image: '' },
                    { char: '屮', word: "chè (sprout)", image: '' },
                    { char: '山', word: "shān (mountain)", image: '⛰️' },
                    { char: '巛', word: "chuān (river)", image: '' },
                    { char: '工', word: "gōng (work)", image: '' },
                    { char: '己', word: "jǐ (self)", image: '' },
                    { char: '巾', word: "jīn (towel)", image: '' },
                    { char: '干', word: "gān (dry)", image: '' },
                    { char: '幺', word: "yāo (tiny)", image: '' },
                    { char: '广', word: "guǎng (shelter)", image: '' },
                    { char: '廴', word: "yǐn (long stride)", image: '' },
                    { char: '廾', word: "gǒng (hands joined)", image: '✋' },
                    { char: '弋', word: "yì (shoot with arrow)", image: '' },
                    { char: '弓', word: "gōng (bow)", image: '' },
                    { char: '彐', word: "jì (snout)", image: '' },
                    { char: '彡', word: "shān (bristle)", image: '' },
                    { char: '彳', word: "chì (step)", image: '' },
                    { char: '心', word: "xīn (heart)", image: '❤️' },
                    { char: '戈', word: "gē (dagger-axe)", image: '' },
                    { char: '戶', word: "hù (door)", image: '🚪' },
                    { char: '手', word: "shǒu (hand)", image: '✋' },
                    { char: '支', word: "zhī (branch)", image: '' },
                    { char: '攴', word: "pū (rap)", image: '' },
                    { char: '文', word: "wén (script)", image: '' },
                    { char: '斗', word: "dǒu (dipper)", image: '' },
                    { char: '斤', word: "jīn (axe)", image: '' },
                    { char: '方', word: "fāng (square)", image: '' },
                    { char: '无', word: "wú (without)", image: '' },
                    { char: '日', word: "rì (sun)", image: '☀️' },
                    { char: '曰', word: "yuē (say)", image: '' },
                    { char: '月', word: "yuè (moon)", image: '🌙' },
                    { char: '木', word: "mù (wood)", image: '🪵' },
                    { char: '欠', word: "qiàn (lack)", image: '' },
                    { char: '止', word: "zhǐ (stop)", image: '' },
                    { char: '歹', word: "dǎi (evil)", image: '' },
                    { char: '殳', word: "shū (weapon)", image: '' },
                    { char: '毋', word: "wú (do not)", image: '' },
                    { char: '比', word: "bǐ (compare)", image: '' },
                    { char: '毛', word: "máo (hair)", image: '' },
                    { char: '氏', word: "shì (clan)", image: '' },
                    { char: '气', word: "qì (steam)", image: '' },
                    { char: '水', word: "shuǐ (water)", image: '💧' },
                    { char: '火', word: "huǒ (fire)", image: '🔥' },
                    { char: '爪', word: "zhǎo (claw)", image: '' },
                    { char: '父', word: "fù (father)", image: '' },
                    { char: '爻', word: "yáo (lines of a trigram)", image: '' },
                    { char: '爿', word: "pán (split wood)", image: '🪵' },
                    { char: '片', word: "piàn (slice)", image: '' },
                    { char: '牙', word: "yá (tooth)", image: '' },
                    { char: '牛', word: "niú (ox)", image: '' },
                    { char: '犬', word: "quǎn (dog)", image: '🐶' },
                    { char: '玄', word: "xuán (dark)", image: '' },
                    { char: '玉', word: "yù (jade)", image: '' },
                    { char: '瓜', word: "guā (melon)", image: '' },
                    { char: '瓦', word: "wǎ (tile)", image: '' },
                    { char: '甘', word: "gān (sweet)", image: '' },
                    { char: '生', word: "shēng (birth)", image: '' },
                    { char: '用', word: "yòng (use)", image: '' },
                    { char: '田', word: "tián (field)", image: '' },
                    { char: '疋', word: "pǐ (bolt of cloth)", image: '' },
                    { char: '疒', word: "nè (sickness)", image: '' },
                    { char: '癶', word: "bō (footsie)", image: '' },
                    { char: '白', word: "bái (white)", image: '' },
                    { char: '皮', word: "pí (skin)", image: '' },
                    { char: '皿', word: "mǐn (dish)", image: '' },
                    { char: '目', word: "mù (eye)", image: '👁️' },
                    { char: '矛', word: "máo (spear)", image: '👂' },
                    { char: '矢', word: "shǐ (arrow)", image: '' },
                    { char: '石', word: "shí (stone)", image: '1️⃣' },
                    { char: '示', word: "shì (show)", image: '' },
                    { char: '禸', word: "róu (footprints)", image: '' },
                    { char: '禾', word: "hé (grain)", image: '🌧️' },
                    { char: '穴', word: "xué (cave)", image: '' },
                    { char: '立', word: "lì (stand)", image: '' },
                    { char: '竹', word: "zhú (bamboo)", image: '🎍' },
                    { char: '米', word: "mǐ (rice)", image: '🍚' },
                    { char: '糸', word: "mì (silk)", image: '' },
                    { char: '缶', word: "fǒu (jar)", image: '' },
                    { char: '网', word: "wǎng (net)", image: '' },
                    { char: '羊', word: "yáng (sheep)", image: '🐑' },
                    { char: '羽', word: "yǔ (feather)", image: '🍽️' },
                    { char: '老', word: "lǎo (old)", image: '' },
                    { char: '而', word: "ér (and)", image: '' },
                    { char: '耒', word: "lěi (plow)", image: '' },
                    { char: '耳', word: "ěr (ear)", image: '👂' },
                    { char: '聿', word: "yù (brush)", image: '' },
                    { char: '肉', word: "ròu (meat)", image: '🍽️' },
                    { char: '臣', word: "chén (minister)", image: '' },
                    { char: '自', word: "zì (self)", image: '' },
                    { char: '至', word: "zhì (reach)", image: '' },
                    { char: '臼', word: "jiù (mortar)", image: '' },
                    { char: '舌', word: "shé (tongue)", image: '' },
                    { char: '舛', word: "chuǎn (opposite)", image: '' },
                    { char: '舟', word: "zhōu (boat)", image: '⛵' },
                    { char: '艮', word: "gèn (stopping)", image: '' },
                    { char: '色', word: "sè (color)", image: '' },
                    { char: '艸', word: "cǎo (grass)", image: '' },
                    { char: '虍', word: "hū (tiger stripes)", image: '🐅' },
                    { char: '虫', word: "chóng (insect)", image: '' },
                    { char: '血', word: "xuè (blood)", image: '' },
                    { char: '行', word: "xíng (go)", image: '' },
                    { char: '衣', word: "yī (clothes)", image: '👕' },
                    { char: '見', word: "jiàn (see)", image: '' },
                    { char: '角', word: "jiǎo (horn)", image: '' },
                    { char: '言', word: "yán (speech)", image: '' },
                    { char: '谷', word: "gǔ (valley)", image: '' },
                    { char: '豆', word: "dòu (bean)", image: '' },
                    { char: '豕', word: "shǐ (pig)", image: '🐖' },
                    { char: '豸', word: "zhì (cat)", image: '🐱' },
                    { char: '貝', word: "bèi (shell)", image: '' },
                    { char: '赤', word: "chì (red)", image: '' },
                    { char: '走', word: "zǒu (run)", image: '🏃' },
                    { char: '足', word: "zú (foot)", image: '' },
                    { char: '身', word: "shēn (body)", image: '' },
                    { char: '車', word: "chē (cart)", image: '🚗' },
                    { char: '辛', word: "xīn (bitter)", image: '' },
                    { char: '辰', word: "chén (morning)", image: '' },
                    { char: '辵', word: "chuò (walk)", image: '🚶' },
                    { char: '邑', word: "yì (city)", image: '' },
                    { char: '酉', word: "yǒu (wine)", image: '' },
                    { char: '釆', word: "biàn (distinguish)", image: '' },
                    { char: '里', word: "lǐ (village)", image: '' },
                    { char: '金', word: "jīn (metal)", image: '' },
                    { char: '長', word: "cháng (long)", image: '' },
                    { char: '門', word: "mén (door)", image: '🚪' },
                    { char: '阜', word: "fù (mound)", image: '' },
                    { char: '隶', word: "lì (slave)", image: '' },
                    { char: '隹', word: "zhuī (short-tailed bird)", image: '🐦' },
                    { char: '雨', word: "yǔ (rain)", image: '🌧️' },
                    { char: '青', word: "qīng (blue/green)", image: '' },
                    { char: '非', word: "fēi (wrong)", image: '' },
                    { char: '面', word: "miàn (face)", image: '' },
                    { char: '革', word: "gé (leather)", image: '🍽️' },
                    { char: '韋', word: "wéi (tanned leather)", image: '🍽️' },
                    { char: '韭', word: "jiǔ (leek)", image: '' },
                    { char: '音', word: "yīn (sound)", image: '' },
                    { char: '頁', word: "yè (leaf)", image: '' },
                    { char: '風', word: "fēng (wind)", image: '' },
                    { char: '飛', word: "fēi (fly)", image: '🪰' },
                    { char: '食', word: "shí (eat)", image: '🍽️' },
                    { char: '首', word: "shǒu (head)", image: '' },
                    { char: '香', word: "xiāng (fragrant)", image: '' },
                    { char: '馬', word: "mǎ (horse)", image: '🐎' },
                    { char: '骨', word: "gǔ (bone)", image: '1️⃣' },
                    { char: '高', word: "gāo (tall)", image: '' },
                    { char: '髟', word: "biāo (long hair)", image: '' },
                    { char: '鬥', word: "dòu (fight)", image: '' },
                    { char: '鬯', word: "chàng (sacrificial wine)", image: '' },
                    { char: '鬲', word: "lì (tripod cauldron)", image: '' },
                    { char: '鬼', word: "guǐ (ghost)", image: '' },
                    { char: '魚', word: "yú (fish)", image: '🐟' },
                    { char: '鳥', word: "niǎo (bird)", image: '🐦' },
                    { char: '鹵', word: "lǔ (salt)", image: '' },
                    { char: '鹿', word: "lù (deer)", image: '' },
                    { char: '麥', word: "mài (wheat)", image: '🍽️' },
                    { char: '麻', word: "má (hemp)", image: '' },
                    { char: '黃', word: "huáng (yellow)", image: '' },
                    { char: '黍', word: "shǔ (millet)", image: '' },
                    { char: '黑', word: "hēi (black)", image: '' },
                    { char: '黹', word: "zhǐ (embroidery)", image: '' },
                    { char: '鼏', word: "mì (pot lid)", image: '' },
                    { char: '鼎', word: "dǐng (tripod)", image: '' },
                    { char: '鼓', word: "gǔ (drum)", image: '' },
                    { char: '鼠', word: "shǔ (rat)", image: '🐀' },
                    { char: '鼻', word: "bí (nose)", image: '' },
                    { char: '齊', word: "qí (even)", image: '' },
                    { char: '齒', word: "chǐ (tooth)", image: '' },
                    { char: '龍', word: "lóng (dragon)", image: '🐉' },
                    { char: '龜', word: "guī (turtle)", image: '' },
                    { char: '龠', word: "yuè (flute)", image: '' }
                ]
            }
        ]
    }
};
