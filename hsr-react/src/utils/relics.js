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
    {label: 'Passerby of Wandering Cloud', id: 101},
    {label: 'Musketeer of Wild Wheat', id: 102},
    {label: 'Knight of Purity Palace', id: 103},
    {label: 'Hunter of Glacial Forest', id: 104},
    {label: 'Champion of Streetwise Boxing', id: 105},
    {label: 'Guard of Wuthering Snow', id: 106},
    {label: 'Firesmith of Lava-Forging', id: 107},
    {label: 'Genius of Brilliant Stars', id: 108},
    {label: 'Band of Sizzling Thunder', id: 109},
    {label: 'Eagle of Twilight Line', id: 110},
    {label: 'Thief of Shooting Meteor', id: 111},
    {label: 'Wastelander of Banditry Desert', id: 112},
    {label: 'Longevous Disciple', id: 113},
    {label: 'Messenger Traversing Hackerspace', id: 114},
    {label: 'Space Sealing Station', id: 301},
    {label: 'Fleet of the Ageless', id: 302},
    {label: 'Pan-Galactic Commercial Enterprise', id: 303},
    {label: 'Belobog of the Architects', id: 304},
    {label: 'Celestial Differentiator', id: 305},
    {label: 'Inert Salsotto', id: 306},
    {label: 'Talia: Kingdom of Banditry', id: 307},
    {label: 'Sprightly Vonwacq', id: 308},
    {label: 'Rutilant Arena', id: 309},
    {label: 'Broken Keel', id: 310},
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
        if (stat == "hp" || stat == "atk" || stat == "def") {
            let m = textLower.search(stat + "\\s*[0-9]+.?[0-9]*%");
            if (m >= 0 && m < pos) {
                relic["mainStatKey"] = stat + '%';
                pos = m;
            }
        }
        let m = textLower.search(stat + "\\s*[0-9]+.?[0-9]*%?\\s");
        if (m >= 0 && m < pos) {
            relic["mainStatKey"] = stat;
            pos = m;
        }
    }
    for (const stat of STATS) {
        if (stat == "hp" || stat == "atk" || stat == "def") {
            let m = textLower.match(stat + "\\s*([0-9]+.?[0-9]*)%");
            if (m) {
                relic["substats"][stat + '%'] = parseFloat(m[1]);
            }
            m = textLower.match(stat + "\\s*([0-9]+)\\s");
            if (m) {
                relic["substats"][stat] = parseInt(m[1])
            }
        } else {
            let m = textLower.match(stat + "\\s*([0-9]+.?[0-9]*)%?");
            if (m) {
                relic["substats"][stat] = parseFloat(m[1]);
            }
        }
    }

    return relic;
}

export function optimize(baseStats, formula) {
    console.log("BASE STATS: " + JSON.stringify(baseStats));
    console.log("FORMULA: " + JSON.stringify(formula));
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

    var bestDMG = 0;
    var bestRelics = [-1, -1, -1, -1, -1, -1];
    for (let head of relics_by_type['head']) {
        for (let hands of relics_by_type['hands']) {
            for (let body of relics_by_type['body']) {
                for (let feet of relics_by_type['feet']) {
                    for (let sphere of relics_by_type['planar sphere']) {
                        for (let rope of relics_by_type['link rope']) {
                            console.log("EVAL RELICS");
                            var cur_relics = [head, hands, body, feet, sphere, rope]
                            var dmg = evalRelicCombo(baseStats, [head, hands, body, feet, sphere, rope], stats, formula);
                            if (dmg > bestDMG) {
                                console.log("COMBO BETTER");
                                bestDMG = dmg;
                                bestRelics = cur_relics.map(relic => relic.id);
                            }
                        }
                    }
                }
            }
        }
    }

    console.log("BEST RELICS: " + JSON.stringify(bestRelics));
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

    var finalStats = {};
    var relDMG = 0;
    for (let stat of stats) {
        finalStats[stat] = baseStats[stat] * (1 + percentStats[stat]) + flatStats[stat];
        relDMG += finalStats[stat] * formula[stat]
    }
    console.log("FINAL STATS: " + JSON.stringify(finalStats));
    console.log("REL VALUE: " + relDMG);
    return relDMG;
}