export const RELIC_SETS = [
    'Band of Sizzling Thunder',
    'Belobog of the Architects',
    'Celestial Differentiator',
    'Champion of Streetwise Boxing',
    'Eagle of Twilight Line',
    'Firesmith of Lava-Forging',
    'Fleet of the Ageless',
    'Genius of the Brilliant Stars',
    'Guard of Wuthering Snow',
    'Hunter of Glacial Forest',
    'Inert Salsotto',
    'Knight of Purity Palace',
    'Musketeer of Wild Wheat',
    'Pan-Galactic Commercial Enterprise',
    'Passerby of Wandering Cloud',
    'Space Sealing Station',
    'Sprightly Vonwacq',
    'Talia: Kingdom of Banditry',
    'Thief of Shooting Meteor',
    'Wastelander of Banditry Desert',
];
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

export const RELICSET2JSON = {
    'Passerby of Wandering Cloud': '101.json',
    'Musketeer of Wild Wheat': '102.json',
    'Knight of Purity Palace': '103.json',
    'Hunter of Glacial Forest': '104.json',
    'Champion of Streetwise Boxing': '105.json',
    'Guard of Wuthering Snow': '106.json',
    'Firesmith of Lava-Forging': '107.json',
    'Genius of Brilliant Stars': '108.json',
    'Band of Sizzling Thunder': '109.json',
    'Eagle of Twilight Line': '110.json',
    'Thief of Shooting Meteor': '111.json',
    'Wastelander of Banditry Desert': '112.json',
    'Space Sealing Station': '301.json',
    'Fleet of the Ageless': '302.json',
    'Pan-Galactic Commercial Enterprise': '303.json',
    'Belobog of the Architects': '304.json',
    'Celestial Differentiator': '305.json',
    'Inert Salsotto': '306.json',
    'Talia: Kingdom of Banditry': '307.json',
    'Sprightly Vonwacq': '308.json'
};
export const RELICSLOT2ID = {
    "Head": "1",
    "Hands": "2",
    "Body": "3",
    "Feet": "4",
    "Planar Sphere": "5",
    "Link Rope": "6",
}

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
    };

    // set
    for (const set of RELIC_SETS) {
        if (text.includes(set)) {
            relic["setKey"] = set;
            break;
        }
    }

    // slot
    for (const type of RELIC_TYPES) {
        if (text.includes(type)) {
            relic["slotKey"] = type;
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

