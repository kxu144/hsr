import { Autocomplete, List, ListItem, ListItemText, Slider, Stack, TextField } from "@mui/material";
import { CHARACTERS } from "../../utils/characters";
import { useEffect, useState } from "react";
import { LIGHTCONES } from "../../utils/lightcones";
import LongMenu from "./OptimizationTarget";

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
                const response = await fetch(`${process.env.PUBLIC_URL}/json/characters/${char.json}`);
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
        if (charJSON) {
            setCharImg(`${process.env.PUBLIC_URL}/image/characters/${charJSON.artPath}.webp`);
            setCharPath(charJSON.baseType.name);
        }
    }, [charJSON]);

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
            console.log(lcStats, lcLvl);
            setBaseStats({
                hp: charStats.hpBase + (charLvl.lvl - 1) * charStats.hpAdd + lcStats.hpBase + (lcLvl.lvl - 1) * lcStats.hpAdd,
                atk: charStats.attackBase + (charLvl.lvl - 1) * charStats.attackAdd + lcStats.attackBase + (lcLvl.lvl - 1) * lcStats.attackAdd,
                def: charStats.defenseBase + (charLvl.lvl - 1) * charStats.defenseAdd + lcStats.defenseBase + (lcLvl.lvl - 1) * lcStats.defenseAdd,
            });
        } else {
            setBaseStats(null);
        }
    }, [charJSON, lcJSON, charLvl, lcLvl]);

    // OPTIMIZE TARGET
    const [target, setTarget] = useState(null);
    const [multiplier, setMultiplier] = useState(null);
    useEffect(() => {
        if (target && charJSON && charJSON.calc) {
            console.log(target);
            setMultiplier(charJSON.calc[target]);
        }
    }, [target, charJSON])

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
            {lc &&
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
            {baseStats &&
                <div>
                    <List>
                        <ListItem disablePadding>
                            <ListItemText primary={`HP: ${baseStats.hp}`} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText primary={`ATK: ${baseStats.atk}`} />
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText primary={`DEF: ${baseStats.def}`} />
                        </ListItem>
                    </List>

                </div>
            }
            {baseStats && charJSON && charJSON.calc &&
                <LongMenu setTarget={setTarget}></LongMenu>
            }
        </div>
    );
}

export default BuildDisplay;