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
];

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

