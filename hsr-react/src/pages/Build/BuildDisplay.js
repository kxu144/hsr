import { Autocomplete, Slider, Stack, TextField } from "@mui/material";
import { CHARACTERS } from "../../utils/characters";
import { useEffect, useState } from "react";
import { LIGHTCONES } from "../../utils/lightcones";
import Character from "./optimize/Optimizer";

function BuildDisplay() {
    const [char, setChar] = useState(null);
    const [charJSON, setCharJSON] = useState(null);
    const [charImg, setCharImg] = useState(null);
    
    const [charSliderVal, setCharSliderVal] = useState(86);
    const [charLvl, setCharLvl] = useState({promotion: 6, display: "80/80", lvl: 80});

    const [charPath, setCharPath] = useState(null);

    const [lc, setLC] = useState(null);
    const [lcJSON, setLCJSON] = useState(null);

    const [lcSliderVal, setLCSliderVal] = useState(86);
    const [lcLvl, setLCLvl] = useState({promotion: 6, display: "80/80", lvl: 80});

    const [baseStats, setBaseStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/chars/${char.json}`);
                const json = await response.json();
                console.log(json);
                setCharJSON(json);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (char) {
            fetchData();
        }
    }, [char]);

    useEffect(() => {
        if (char) {
            var img_str = char.label;
            console.log("CHAR LABEL: %s", img_str);
            if (img_str.includes("Trailblazer")) {
                if (img_str === "Trailblazer (Physical)") {
                    if (Math.random() < 0.5) {
                        img_str = "playerboy";
                    } else {
                        img_str = "playergirl";
                    }
                } else if (img_str === "Trailblazer (Fire)") {
                    if (Math.random() < 0.5) {
                        img_str = "playerboy2";
                    } else {
                        img_str = "playergirl2";
                    }
                }
            } else if (img_str === "March 7th") {
                img_str = "mar7th";
            }
            setCharImg(`${process.env.PUBLIC_URL}/image/characters/${img_str.replace(/\s/g, '')}.webp`);
        }
    }, [char]);

    useEffect(() => {
        if (charJSON) {
            setCharPath(charJSON.path);
        }
    }, [charJSON])

    useEffect(() => {
        if (charPath && lcJSON && charPath !== lcJSON.baseType.name) {
            setLC(null);
            setLCJSON(null);
        }
    }, [charPath, lcJSON]);

    // SLIDERS
    useEffect(() => {
        if (charSliderVal < 1) {
            return;
        }
        let p = Math.max(0, Math.floor((charSliderVal - 10) / 11));
        if (charSliderVal > 20 && (charSliderVal - 10) % 11 === 0) {
            setCharLvl({promotion: p, display: `${charSliderVal-p}/${charSliderVal-p + 10}`, lvl: charSliderVal-p});
        } else {
            setCharLvl({promotion: p, display: `${charSliderVal-p}/${Math.max(20, 10 * Math.floor((charSliderVal-p + 9) / 10))}`, lvl: charSliderVal-p});
        }
    }, [charSliderVal])

    useEffect(() => {
        if (lcSliderVal < 1) {
            return;
        }
        let p = Math.max(0, Math.floor((lcSliderVal - 10) / 11));
        if (lcSliderVal > 20 && (lcSliderVal - 10) % 11 === 0) {
            setLCLvl({promotion: p, display: `${lcSliderVal-p}/${lcSliderVal-p + 10}`, lvl: lcSliderVal-p});
        } else {
            setLCLvl({promotion: p, display: `${lcSliderVal-p}/${Math.max(20, 10 * Math.floor((lcSliderVal-p + 9) / 10))}`, lvl: lcSliderVal-p});
        }
    }, [lcSliderVal])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/lightcones/${lc.json}`);
                const json = await response.json();
                console.log(json);
                setLCJSON(json);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (lc) {
            fetchData();
        }
    }, [lc]);

    // BASE STATS
    useEffect(() => {
        if (charJSON && lcJSON) {
            const charStats = charJSON.levelData[charLvl.promotion];
            const lcStats = lcJSON.levelData[lcLvl.promotion];
            console.log(charStats, charLvl);
            console.log(lcStats, lcLvl);
            setBaseStats({
                "hp": charStats.hpBase + (charLvl.lvl - 1) * charStats.hpAdd + lcStats.hpBase + (lcLvl.lvl - 1) * lcStats.hpAdd,
                "atk": charStats.atkBase + (charLvl.lvl - 1) * charStats.atkAdd + lcStats.attackBase + (lcLvl.lvl - 1) * lcStats.attackAdd,
                "def": charStats.defBase + (charLvl.lvl - 1) * charStats.defAdd + lcStats.defenseBase + (lcLvl.lvl - 1) * lcStats.defenseAdd,
                "crit rate": charStats.crate * 100,
                "crit dmg": charStats.cdmg * 100,
                "spd": charStats.spdBase + (charLvl.lvl - 1) * charStats.spdAdd,
            });
        } else {
            setBaseStats(null);
        }
    }, [charJSON, lcJSON, charLvl, lcLvl]);

    // TALENTS
    const [talents, setTalents] = useState(['9', '15', '15', '15']);


    return (
        <div>
            <img alt="" src={charImg} style={{ width: '60%', position: 'absolute', bottom: 0, right: 0, zIndex: 0 }} />
            <Autocomplete 
                isOptionEqualToValue={(o, v) => v === "" || o === v || o.label === v.label}
                disablePortal disableClearable blurOnSelect options={CHARACTERS}
                renderInput={(params) => <TextField {...params} label="Select character" />}
                onChange={(_e, v) => {setChar(v);}}
            />
            {char && 
                <Stack spacing={2} direction="row" alignItems="center">
                    <TextField
                        variant="standard"
                        value={`Lvl: ${charLvl.display}`}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                        }}
                    />
                    <Slider 
                        value={charSliderVal} step={1} min={1} max={86}
                        onChange={(_e, v) => {setCharSliderVal(v);}}
                    />
                </Stack>
            }
            {charPath && 
                <Autocomplete 
                    isOptionEqualToValue={(o, v) => v === "" || o === v || o.label === v.label}
                    disablePortal disableClearable blurOnSelect options={(charPath && LIGHTCONES[charPath]) || null}
                    renderInput={(params) => <TextField {...params} label="Select lightcone" />}
                    value={lc} onChange={(_e, v) => {setLC(v);}}
                />
            }
            {charPath &&
                <Stack spacing={2} direction="row" alignItems="center">
                    <TextField
                        variant="standard"
                        value={`Lvl: ${lcLvl.display}`}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true,
                        }}
                    />
                    <Slider 
                        value={lcSliderVal} step={1} min={1} max={86}
                        onChange={(_e, v) => {setLCSliderVal(v);}}
                    />
                </Stack>
            }
            {lc &&
                <Stack direction="row" alignItems="center">
                    <Autocomplete 
                        disablePortal disableClearable blurOnSelect options={['1','2','3','4','5','6','7','8','9']}
                        renderInput={(params) => <TextField {...params} label="Basic ATK:" />}
                        value={talents[0]} onChange={(_e, v) => {setTalents([v, talents[1], talents[2], talents[3]])}}
                    />
                    <Autocomplete 
                        disablePortal disableClearable blurOnSelect options={['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']}
                        renderInput={(params) => <TextField {...params} label="Skill:" />}
                        value={talents[1]} onChange={(_e, v) => {setTalents([talents[0], v, talents[2], talents[3]])}}
                    />
                    <Autocomplete 
                        disablePortal disableClearable blurOnSelect options={['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']}
                        renderInput={(params) => <TextField {...params} label="Ultimate:" />}
                        value={talents[2]} onChange={(_e, v) => {setTalents([talents[0], talents[1], v, talents[3]])}}
                    />
                    <Autocomplete 
                        disablePortal disableClearable blurOnSelect options={['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15']}
                        renderInput={(params) => <TextField {...params} label="Talent:" />}
                        value={talents[3]} onChange={(_e, v) => {setTalents([talents[0], talents[1], talents[2], v])}}
                    />
                </Stack>
            }
            {char && charJSON && baseStats && talents &&
                <Character name={char.label} json={charJSON} stats={baseStats} talents={talents} />
            }
        </div>
    );
}

export default BuildDisplay;