export const MAX_QUEUE_LEN = 16;

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

export function optimize(baseStats, formula) {
    // FLAG UNNECESSARY RELICS
    const stats = Object.keys(formula);
    const relics = Object.values(JSON.parse(localStorage.getItem("relics") || "{}"));

    // for (let i = 0; i < relics.length-1; i++) {
    //     let r1 = relics[i];
    //     if (r1.delete) {
    //         continue;
    //     }
    //     for (let j = i+1; j < relics.length; j++) {
    //         let r2 = relics[j];
    //         if (r2.delete) {
    //             continue;
    //         }
    //         let del1 = true;
    //         let del2 = true;
    //         for (let stat of stats) {
    //             if ((r1.substats[stat] || 0) > (r2.substats[stat] || 0)) {
    //                 del1 = false;
    //             }
    //             if ((r1.substats[stat] || 0) < (r2.substats[stat] || 0)) {
    //                 del2 = false;
    //             }
    //             if (!del1 && !del2) {
    //                 break;
    //             }
    //         }

    //         if (del1) {
    //             r1.delete = true;
    //             relics[i] = r1;
    //         } else if (del2) {
    //             r2.delete = true;
    //             relics[j] = r2;
    //         }
    //     }
    // }

    var relics_by_type = {}
    for (let type of RELIC_TYPES) {
        relics_by_type[type] = [];
    }
    for (let relic of relics) {
        relics_by_type[relic.slotKey.toLowerCase()].push(relic);
    }
    for (let type of RELIC_TYPES) {
        if (relics_by_type[type].length == 0) {
            relics_by_type[type].push({});
        }
    }

    console.log("RELICS:");
    console.log(JSON.stringify(relics_by_type));
    console.log("RELIC LENGTH: %d", relics.length);

    var num_combos = relics_by_type['head'].length * relics_by_type['hands'].length * relics_by_type['body'].length * relics_by_type['feet'].length * relics_by_type['planar sphere'].length * relics_by_type['link rope'].length;
    console.log("NUM COMBOS: %d", num_combos);

    for (let head of relics_by_type['head']) {
        for (let hands of relics_by_type['hands']) {
            for (let body of relics_by_type['body']) {
                for (let feet of relics_by_type['feet']) {
                    for (let sphere of relics_by_type['planar sphere']) {
                        for (let rope of relics_by_type['link rope']) {
                            console.log("EVAL RELICS");
                            evalRelicCombo(baseStats, [head, hands, body, feet, sphere, rope], stats, formula);
                        }
                    }
                }
            }
        }
    }
}

export function evalRelicCombo(baseStats, relics, stats, formula) {

    console.log(relics);
    // TODO: apply relic set bonuses
    var percentStats = {};
    var flatStats = {};
    for (let stat of stats) {
        percentStats[stat] = 0;
        flatStats[stat] = 0;
    }
    for (let relic of relics) {
        if (relic.substats === undefined) {
            continue;
        }
        for (let stat of stats) {
            if (relic.substats[stat] !== undefined) {
                flatStats[stat] += relic.substats[stat];
            } else if (relic.substats[stat + "%"] !== undefined) {
                percentStats[stat] += relic.substats[stat];
            }
        }
    }

    console.log(JSON.stringify(percentStats));
    console.log(JSON.stringify(flatStats));
}