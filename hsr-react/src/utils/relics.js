export const RELIC_TYPES = [
    'head',
    'hands',
    'body',
    'feet',
    'planar sphere',
    'link rope',
];
export const STATS = [
    'hp',
    'atk',
    'def',
    'crit rate',
    'crit dmg',
    'outgoing healing boost',
    'effect hit rate',
    'effect res',
    'break effect',
    'spd',
    'energy regeneration rate',
];

export const RELICSETS = [
    {label: 'Passerby of Wandering Cloud', json: '101.json'},
    {label: 'Musketeer of Wild Wheat', json: '102.json'},
    {label: 'Knight of Purity Palace', json: '103.json'},
    {label: 'Hunter of Glacial Forest', json: '104.json'},
    {label: 'Champion of Streetwise Boxing', json: '105.json'},
    {label: 'Guard of Wuthering Snow', json: '106.json'},
    {label: 'Firesmith of Lava-Forging', json: '107.json'},
    {label: 'Genius of Brilliant Stars', json: '108.json'},
    {label: 'Band of Sizzling Thunder', json: '109.json'},
    {label: 'Eagle of Twilight Line', json: '110.json'},
    {label: 'Thief of Shooting Meteor', json: '111.json'},
    {label: 'Wastelander of Banditry Desert', json: '112.json'},
    {label: 'Space Sealing Station', json: '301.json'},
    {label: 'Fleet of the Ageless', json: '302.json'},
    {label: 'Pan-Galactic Commercial Enterprise', json: '303.json'},
    {label: 'Belobog of the Architects', json: '304.json'},
    {label: 'Celestial Differentiator', json: '305.json'},
    {label: 'Inert Salsotto', json: '306.json'},
    {label: 'Talia: Kingdom of Banditry', json: '307.json'},
    {label: 'Sprightly Vonwacq', json: '308.json'},
];
export const RELICSLOTS = [
    {label: "Head", id: "1"},
    {label: "Hands", id: "2"},
    {label: "Body", id: "3"},
    {label: "Feet", id: "4"},
    {label: "Planar Sphere", id: "5"},
    {label: "Link Rope", id: "6"},
]

export function textToRelic(text) {
    var relic = {
        "setKey": "",
        "slotKey": "",
        "level": 15,
        "rarity": 5,
        "mainStatKey": "",
        "location": "",
        "lock": false,
        "substats": {},
        "raw": text,
    };

    // set
    for (const set of RELICSETS) {
        if (text.includes(set.label)) {
            relic["setKey"] = set.label;
            break;
        }
    }

    // slot
    for (const type of RELICSLOTS) {
        if (text.includes(type.label)) {
            relic["slotKey"] = type.label;
            break;
        }
    }

    // level
    var level = text.match("[+]([0-9]+)");
    if (level) {
        relic["level"] = parseInt(level[1]);
    }

    // mainstat
    var textLower = text.toLowerCase();
    var pos = text.length;
    for (const stat of STATS) {
        let m = textLower.search(stat + " *[0-9]+.?[0-9]*%");
        if (m >= 0 && m < pos) {
            relic["mainStatKey"] = stat + '%';
            pos = m;
        }
        m = textLower.search(stat + " *[0-9]+\\s");
        if (m >= 0 && m < pos) {
            relic["mainStatKey"] = stat;
            pos = m;
        }
    }
    for (const stat of STATS) {
        let m = textLower.match(stat + " *([0-9]+.?[0-9]*)%");
        if (m) {
            relic["substats"][stat + '%'] = parseFloat(m[1]);
        }
        m = textLower.match(stat + " *([0-9]+)\\s");
        if (m) {
            relic["substats"][stat] = parseInt(m[1]);
        }
    }

    return relic;
}

